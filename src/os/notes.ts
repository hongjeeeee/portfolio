import { marked, type Tokens } from 'marked';

export interface Note {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  link?: string;
  order: number;

  body: string;
  html: string;
}

const files = import.meta.glob<string>('/src/content/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// 추가: [글 안의 이미지] · src/assets/ 에 넣고 파일명으로 쓰면 됨
const assets = import.meta.glob<string>(
  '/src/assets/*.{png,jpg,jpeg,webp,gif,svg}',
  { query: '?url', import: 'default', eager: true },
);

const resolveAssets = (html: string) =>
  html.replace(/src="([^"]+)"/g, (tag, src: string) => {
    if (/^(https?:|data:)/.test(src)) return tag;
    const name = src.split('/').pop();
    const url = Object.entries(assets).find(([p]) =>
      p.endsWith(`/${name}`),
    )?.[1];
    return url ? `src="${url}"` : tag;
  });

const splitFrontmatter = (raw: string) => {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  const meta: Record<string, string> = {};
  if (!m) return { meta, body: raw };
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) {
      meta[line.slice(0, i).trim()] = line
        .slice(i + 1)
        .trim()
        .replace(/^['"]|['"]$/g, '');
    }
  }
  return { meta, body: raw.slice(m[0].length) };
};

const TAG_COLORS = [
  'default',
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
];

const autoColor = (name: string) => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return TAG_COLORS[1 + (h % (TAG_COLORS.length - 1))];
};

const splitTag = (inner: string): [name: string, color: string] => {
  const i = inner.lastIndexOf(':');
  const color = inner.slice(i + 1).trim();
  if (i > 0 && TAG_COLORS.includes(color)) {
    return [inner.slice(0, i).trim(), color];
  }
  const name = inner.trim();
  return [name, autoColor(name)];
};

const TAG = /^\{\{([^{}\n]+?)\}\}/;

const plain = (md: string) =>
  md
    .replace(/\{\{([^{}\n]+?)\}\}/g, (_, inner: string) => splitTag(inner)[0])
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const firstHeading = (md: string) => /^#\s+(.+)$/m.exec(md)?.[1].trim();

const firstParagraph = (md: string) =>
  md
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .find((b) => b && !b.startsWith('#') && !b.startsWith('!['));

const attr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const escape = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

marked.use({
  renderer: {
    link(
      this: { parser: { parseInline: (t: Tokens.Link['tokens']) => string } },
      token: Tokens.Link,
    ) {
      const text = this.parser.parseInline(token.tokens);
      return `<a href="${attr(token.href)}" target="_blank" rel="noreferrer">${text}</a>`;
    },
  },
});

marked.use({
  extensions: [
    {
      name: 'tag',
      level: 'inline',
      start: (src: string) => {
        const i = src.indexOf('{{');
        return i < 0 ? undefined : i;
      },
      tokenizer: (src: string) => {
        const m = TAG.exec(src);
        if (!m) return undefined;
        const [name, color] = splitTag(m[1]);
        return { type: 'tag', raw: m[0], name, color };
      },
      renderer: (token) =>
        `<span data-tag="${token.color}">${escape(token.name)}</span>`,
    },
  ],
});

export const notes: Note[] = Object.entries(files)
  .map(([path, raw]) => {
    const [, category, slug] = /\/src\/content\/([^/]+)\/([^/]+)\.md$/.exec(
      path,
    )!;
    const { meta, body } = splitFrontmatter(raw);
    return {
      id: `${category}/${slug}`,
      slug,
      category,
      title: meta.title || firstHeading(body) || slug,
      excerpt: meta.excerpt || plain(firstParagraph(body) ?? '').slice(0, 80),
      link: meta.link || undefined,
      order: meta.order ? Number(meta.order) : Infinity,
      body,
      html: resolveAssets(marked.parse(body, { async: false })),
    };
  })
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

export const notesIn = (category: string) =>
  notes.filter((n) => n.category === category);
