import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import readingTime from "reading-time";

const BLOG_DIR = join(process.cwd(), "content", "blog");

export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: BlogAuthor;
  category: string;
  coverImage?: string;
  featured: boolean;
  tags: string[];
  ogImage?: string;
  readingMinutes: number;
};

export type Post = PostMeta & {
  html: string;
  raw: string;
};

const DEFAULT_AUTHOR: BlogAuthor = {
  name: "Mike Egidio",
  role: "Founder, GetMeFound",
  avatar: "/team/mike.jpg",
};

function parseAuthor(data: unknown): BlogAuthor {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    return {
      name: typeof d.name === "string" ? d.name : DEFAULT_AUTHOR.name,
      role: typeof d.role === "string" ? d.role : DEFAULT_AUTHOR.role,
      avatar: typeof d.avatar === "string" ? d.avatar : DEFAULT_AUTHOR.avatar,
    };
  }
  if (typeof data === "string") {
    return { ...DEFAULT_AUTHOR, name: data };
  }
  return DEFAULT_AUTHOR;
}

async function listFiles(): Promise<string[]> {
  if (!existsSync(BLOG_DIR)) return [];
  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name);
}

async function loadFile(filename: string): Promise<Post> {
  const slug = filename.replace(/\.md$/, "");
  const raw = await readFile(join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const rawHtml = await marked.parse(content, { async: true });
  const html = rawHtml.replace(
    /<a\s+([^>]*href="https?:\/\/[^"]+"[^>]*)>/gi,
    (_match, attrs: string) => {
      let nextAttrs = attrs;
      if (!/\btarget\s*=/.test(nextAttrs)) {
        nextAttrs += ' target="_blank"';
      }
      if (!/\brel\s*=/.test(nextAttrs)) {
        nextAttrs += ' rel="noopener noreferrer"';
      }
      return `<a ${nextAttrs}>`;
    },
  );
  const rt = readingTime(content);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "1970-01-01",
    author: parseAuthor(data.author),
    category: typeof data.category === "string" ? data.category : "Insights",
    coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
    featured: data.featured === true,
    tags: Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === "string") : [],
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    readingMinutes: Math.max(1, Math.round(rt.minutes)),
    html,
    raw: content,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await listFiles();
  const posts = await Promise.all(files.map(loadFile));
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getFeaturedPost(): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export async function getPost(slug: string): Promise<Post | null> {
  const filename = `${slug}.md`;
  if (!existsSync(join(BLOG_DIR, filename))) return null;
  return loadFile(filename);
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await listFiles();
  return files.map((f) => f.replace(/\.md$/, ""));
}

export async function getRelatedPosts(
  currentSlug: string,
  currentCategory: string,
  limit = 3,
): Promise<Post[]> {
  const posts = await getAllPosts();
  const others = posts.filter((p) => p.slug !== currentSlug);
  const sameCategory = others.filter((p) => p.category === currentCategory);
  const otherCategory = others.filter((p) => p.category !== currentCategory);
  return [...sameCategory, ...otherCategory].slice(0, limit);
}

export const CATEGORY_COLORS: Record<string, string> = {
  "AI & Search": "from-[#0A1628] via-[#0a1c3d] to-[#1a2855]",
  "Industry": "from-[#1a2e25] via-[#2D6A4F] to-[#3D7A65]",
  "Reviews": "from-[#3d2f1a] via-[#7a5a2d] to-[#a07c3d]",
  "Done-For-You": "from-[#2a1a2e] via-[#4f2d5a] to-[#653d7a]",
  "Operations": "from-[#1a2a2e] via-[#2d5a5f] to-[#3d7a7f]",
  "Insights": "from-[#0A1628] to-[#1A1F2E]",
};

export function getCategoryGradient(category: string): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Insights;
}
