@AGENTS.md

## Design & Messaging Rules (from Mike)

- **Always research before making design decisions.** Never guess on colors, layouts, spacing, or animations. Search for expert best practices first — every time. If unsure, research it. Don't ask Mike for design opinions; he expects you to bring expert-backed recommendations.
- **Target market:** Dentists, attorneys, therapists, accountants — professionals, not trades. Use deep grounded tones (blues, dark greens, slate) that communicate trust. Never use bright/playful colors.
- **Color palette:** The site uses dark navy/green (#1a2332, #162420) and cream/light backgrounds. Accent is muted green. Stick to this palette.
- **Section heights:** Keep sections compact. Use py-8 to py-12 on mobile, md:py-12 to md:py-16 on desktop. Never use py-20+ unless it's the hero.
- **Alternating backgrounds:** Sections should alternate dark/light for visual rhythm.
- **Responsive:** Always design mobile-first. All grids collapse on mobile. Test all breakpoints.
- **Don't ask for opinions on design/marketing.** Research what experts recommend and implement it. Mike is not a designer or marketer — that's your job.
- **PowerShell terminal:** Mike uses Windows PowerShell. Use `;` not `&&` to chain commands. Or give commands on separate lines.
- **Deploy flow:** Always include `vercel --prod` in deploy instructions. Git push alone doesn't reliably trigger Vercel builds.
