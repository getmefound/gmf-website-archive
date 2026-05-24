import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBody, PageSection } from "@/components/PageBody";
import {
  getAllSlugs,
  getCategoryGradient,
  getPost,
  getRelatedPosts,
  type Post,
} from "@/lib/blog";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  const socialImage = post.ogImage ?? post.coverImage;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
  };
}

const serif = "[font-family:var(--font-fraunces)]";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ShareIcons({ url, title }: { url: string; title: string }) {
  const enc = encodeURIComponent;
  const links = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM8 19H5V8h3v11zM6.5 6.7c-1 0-1.7-.8-1.7-1.7s.8-1.7 1.7-1.7 1.7.8 1.7 1.7-.7 1.7-1.7 1.7zM20 19h-3v-5.6c0-3.4-4-3.1-4 0V19h-3V8h3v1.8c1.4-2.6 7-2.8 7 2.5V19z" />
        </svg>
      ),
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];
  return (
    <div className="flex items-center gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}

function AuthorCard({ post }: { post: Post }) {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  return (
    <aside
      aria-label="Article meta"
      className="rounded-2xl bg-[var(--color-bg-dark-card)] text-white p-6 md:p-7 shadow-2xl shadow-black/30 border border-white/10 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.author.avatar}
          alt=""
          aria-hidden="true"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="leading-tight">
          <p className="text-base font-semibold text-white">
            {post.author.name}
          </p>
          <p className="text-sm text-white/55">{post.author.role}</p>
        </div>
      </div>
      <hr className="my-5 border-white/10" />
      <div className="flex items-center justify-between gap-3 text-sm text-white/70">
        <span className="inline-flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formatDate(post.date)}
        </span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {post.readingMinutes} min read
        </span>
      </div>
      <hr className="my-5 border-white/10" />
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent-soft)] border border-[var(--color-accent)]/40">
          {post.category}
        </span>
        <ShareIcons url={articleUrl} title={post.title} />
      </div>
    </aside>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: "GetMeFound",
      url: SITE_URL,
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    ...(post.coverImage ? { image: post.coverImage } : post.ogImage ? { image: post.ogImage } : {}),
  };

  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const related = await getRelatedPosts(post.slug, post.category, 3);
  const gradient = getCategoryGradient(post.category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <article className="bg-[var(--color-bg-page)]">
        <header
          className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white`}
        >
          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />

          <div className="relative mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-24 md:pb-32">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors mb-10"
            >
              <span aria-hidden="true">←</span> All articles
            </Link>

            <div className="grid lg:grid-cols-[1fr_22rem] gap-12 lg:gap-16 items-end">
              <h1
                className={`${serif} text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight max-w-3xl`}
              >
                {post.title}
              </h1>
              <AuthorCard post={post} />
            </div>
          </div>
        </header>

        <PageBody>
          <PageSection>
            <p className="text-xl md:text-2xl text-[var(--color-text-muted)] leading-relaxed mb-12 max-w-3xl">
              {post.description}
            </p>
            <div
              className="post-content text-[var(--color-text-body)] text-lg leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </PageSection>

          {related.length > 0 && (
            <section
              aria-label="Related articles"
              className="border-t border-[var(--color-border)] pb-20 md:pb-24"
            >
              <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-20">
                <div className="flex items-center gap-3 mb-10">
                  <span className="h-px w-10 bg-[var(--color-accent)]" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
                    Keep reading
                  </span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <RelatedCard post={r} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </PageBody>
      </article>
    </>
  );
}

function RelatedCard({ post }: { post: Post }) {
  const gradient = getCategoryGradient(post.category);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all h-full"
    >
      <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${gradient}`}>
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute top-3 left-3 inline-flex items-center text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-white text-[var(--color-text-body)] shadow-sm">
          {post.category}
        </span>
      </div>
      <div className="flex flex-col gap-3 p-5 flex-1">
        <p className="text-xs text-[var(--color-text-muted)]">
          {post.readingMinutes} min read
        </p>
        <h3
          className="[font-family:var(--font-fraunces)] text-lg md:text-xl font-semibold leading-[1.2] tracking-tight text-[var(--color-text-body)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-3"
        >
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
