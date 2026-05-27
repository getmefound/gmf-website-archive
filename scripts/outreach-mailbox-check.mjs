#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { connect as tlsConnect } from "node:tls";
import { Socket } from "node:net";

const SMTP_HOST = "mail.privateemail.com";
const SMTP_PORT = 587;
const IMAP_HOST = "mail.privateemail.com";
const IMAP_PORT = 993;

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const accounts = [1, 2, 3].map((n) => ({
    n,
    email: process.env[`OUTREACH_EMAIL_${n}`]?.trim(),
    password: process.env[`OUTREACH_EMAIL_${n}_PASSWORD`]?.trim(),
  }));

  const results = [];
  for (const account of accounts) {
    if (!account.email || !account.password) {
      results.push({ account: account.n, ok: false, error: "missing_env" });
      continue;
    }
    const smtp = await testSmtpLogin(account).catch((error) => ({ ok: false, error: error.message }));
    const imap = await testImapLogin(account).catch((error) => ({ ok: false, error: error.message }));
    const result = { account: account.n, email: account.email, smtp, imap };
    if (args.send && smtp.ok) {
      const to = String(args.to ?? process.env.RESEND_FROM_EMAIL ?? "mike@getmefound.ai");
      result.send = await sendSmtpTest(account, to).catch((error) => ({ ok: false, error: error.message }));
    }
    results.push(result);
  }

  console.log(JSON.stringify({ ok: results.every((r) => r.smtp?.ok && r.imap?.ok), results }, null, 2));
}

async function testSmtpLogin(account) {
  const client = await smtpSession();
  try {
    await client.expect(220);
    await client.send(`EHLO localhost`);
    await client.expect(250);
    await client.send(`STARTTLS`);
    await client.expect(220);
    await client.startTls(SMTP_HOST);
    await client.send(`EHLO localhost`);
    await client.expect(250);
    await client.send(`AUTH LOGIN`);
    await client.expect(334);
    await client.send(Buffer.from(account.email).toString("base64"));
    await client.expect(334);
    await client.send(Buffer.from(account.password).toString("base64"));
    await client.expect(235);
    await client.send("QUIT");
    return { ok: true };
  } finally {
    client.close();
  }
}

async function sendSmtpTest(account, to) {
  const client = await smtpSession();
  const stamp = new Date().toISOString();
  const body = [
    `From: ${account.email}`,
    `To: ${to}`,
    `Subject: GetMeFound outreach mailbox smoke test`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    `Smoke test from ${account.email} at ${stamp}.`,
  ].join("\r\n");

  try {
    await client.expect(220);
    await client.send(`EHLO localhost`);
    await client.expect(250);
    await client.send(`STARTTLS`);
    await client.expect(220);
    await client.startTls(SMTP_HOST);
    await client.send(`EHLO localhost`);
    await client.expect(250);
    await client.send(`AUTH LOGIN`);
    await client.expect(334);
    await client.send(Buffer.from(account.email).toString("base64"));
    await client.expect(334);
    await client.send(Buffer.from(account.password).toString("base64"));
    await client.expect(235);
    await client.send(`MAIL FROM:<${account.email}>`);
    await client.expect(250);
    await client.send(`RCPT TO:<${to}>`);
    await client.expect(250);
    await client.send("DATA");
    await client.expect(354);
    await client.send(`${body}\r\n.`);
    await client.expect(250);
    await client.send("QUIT");
    return { ok: true, to };
  } finally {
    client.close();
  }
}

async function testImapLogin(account) {
  const client = await imapSession();
  try {
    await client.expect("* OK");
    await client.send(`a1 LOGIN "${escapeImap(account.email)}" "${escapeImap(account.password)}"`);
    await client.expect("a1 OK");
    await client.send("a2 LOGOUT");
    return { ok: true };
  } finally {
    client.close();
  }
}

function smtpSession() {
  return plainLineClient(SMTP_HOST, SMTP_PORT);
}

function imapSession() {
  return tlsLineClient(IMAP_HOST, IMAP_PORT);
}

function plainLineClient(host, port) {
  const socket = new Socket();
  return lineClient(new Promise((resolve, reject) => {
    socket.once("error", reject);
    socket.connect(port, host, () => {
      socket.off("error", reject);
      resolve(socket);
    });
  }));
}

function tlsLineClient(host, port) {
  return lineClient(new Promise((resolve, reject) => {
    const socket = tlsConnect({ host, port, servername: host }, () => resolve(socket));
    socket.once("error", reject);
  }));
}

async function lineClient(socketPromise) {
  let socket = await socketPromise;
  let buffer = "";
  const waiters = [];
  socket.setEncoding("utf8");
  socket.on("data", (chunk) => {
    buffer += chunk;
    for (let i = waiters.length - 1; i >= 0; i--) {
      const waiter = waiters[i];
      if (waiter.match(buffer)) {
        waiters.splice(i, 1);
        const data = buffer;
        buffer = "";
        waiter.resolve(data);
      }
    }
  });
  socket.on("error", (error) => {
    while (waiters.length) waiters.pop().reject(error);
  });

  return {
    async expect(pattern) {
      const match = (data) => {
        if (typeof pattern === "number") return new RegExp(`(^|\\r?\\n)${pattern}[ -]`).test(data);
        return data.includes(pattern);
      };
      if (match(buffer)) {
        const data = buffer;
        buffer = "";
        return data;
      }
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          const index = waiters.findIndex((w) => w.resolve === resolve);
          if (index >= 0) waiters.splice(index, 1);
          reject(new Error(`Timed out waiting for ${pattern}`));
        }, 15000);
        waiters.push({
          match,
          resolve: (data) => {
            clearTimeout(timeout);
            resolve(data);
          },
          reject: (error) => {
            clearTimeout(timeout);
            reject(error);
          },
        });
      });
    },
    send(line) {
      socket.write(`${line}\r\n`);
    },
    async startTls(servername) {
      socket = tlsConnect({ socket, servername });
      socket.setEncoding("utf8");
      buffer = "";
      socket.on("data", (chunk) => {
        buffer += chunk;
        for (let i = waiters.length - 1; i >= 0; i--) {
          const waiter = waiters[i];
          if (waiter.match(buffer)) {
            waiters.splice(i, 1);
            const data = buffer;
            buffer = "";
            waiter.resolve(data);
          }
        }
      });
    },
    close() {
      socket.end();
    },
  };
}

function escapeImap(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function printHelp() {
  console.log(`
Test outreach mailbox SMTP and IMAP credentials.

Login-only:
  npm run outreach:mailbox-check

Send smoke emails:
  npm run outreach:mailbox-check -- --send --to mike@getmefound.ai
`);
}
