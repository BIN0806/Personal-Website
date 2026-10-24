import type { ReactNode } from "react";

/** Reusable article blocks. Write normal JSX for paragraphs, lists, and links. */
export function ArticleSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="article-section"><h2>{title}</h2>{children}</section>;
}

export function CodeBlock({ filename, children }: { filename: string; children: string }) {
  return (
    <figure className="article-code">
      <figcaption>{filename}</figcaption>
      <pre tabIndex={0} aria-label={`Code example: ${filename}`}><code>{children}</code></pre>
    </figure>
  );
}

export function ArticleNote({ children }: { children: ReactNode }) {
  return <aside className="article-note">{children}</aside>;
}
