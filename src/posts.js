// Every .md file in src/content/posts becomes a post. Filename = URL slug.
const files = import.meta.glob('./content/posts/*.md', { query: '?raw', import: 'default', eager: true });
const list = (v) => (v || '').split(',').map((s) => s.trim()).filter(Boolean);

function parse(path, src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta = {};
  (m ? m[1] : '').split(/\r?\n/).forEach((l) => {
    const i = l.indexOf(':');
    if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim();
  });
  const body = m ? m[2] : src;
  return {
    slug: path.split('/').pop().replace('.md', ''),
    title: meta.title || 'Untitled',
    date: meta.date || '',
    summary: meta.summary || '',
    cover: meta.cover || '',
    tags: list(meta.tags),
    attachments: list(meta.attachments),
    body,
    minutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
  };
}

export const posts = Object.entries(files).map(([p, s]) => parse(p, s)).sort((a, b) => b.date.localeCompare(a.date));
export const fmt = (d) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }) : '');
