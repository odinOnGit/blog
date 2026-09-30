import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { posts, fmt } from './posts.js';

const kindOf = (n) => {
  const e = n.split('.').pop().toLowerCase();
  if (e === 'pdf') return 'pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(e)) return 'img';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(e)) return 'audio';
  if (['mp4', 'webm'].includes(e)) return 'video';
  return 'file';
};
const size = (b) => (!b ? '' : b < 1e6 ? Math.max(1, Math.round(b / 1e3)) + ' KB' : (b / 1e6).toFixed(1) + ' MB');

function Attachment({ name }) {
  const url = '/files/' + name;
  const kind = kindOf(name);
  const [bytes, setBytes] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetch(url, { method: 'HEAD' }).then((r) => setBytes(+r.headers.get('content-length') || 0)).catch(() => {});
  }, [url]);
  return (
    <div className="att">
      <div className="att-row">
        <span className="ext">{name.split('.').pop()}</span>
        <div className="att-name"><strong>{name}</strong><small>{size(bytes)}</small></div>
        {kind !== 'file' && <button className="btn" onClick={() => setOpen(!open)}>{open ? 'Hide preview' : 'Preview'}</button>}
        <a className="btn solid" href={url} download>Download</a>
      </div>
      {open && (
        <div className="att-view">
          {kind === 'pdf' && <iframe src={url} title={name} />}
          {kind === 'img' && <img src={url} alt={name} />}
          {kind === 'audio' && <audio src={url} controls />}
          {kind === 'video' && <video src={url} controls />}
        </div>
      )}
    </div>
  );
}

export default function Post() {
  const { slug } = useParams();
  const p = posts.find((x) => x.slug === slug);
  const [zoom, setZoom] = useState(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (p) document.title = p.title;
    const on = () => { const h = document.documentElement; setPct((h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100); };
    const esc = (e) => e.key === 'Escape' && setZoom(null);
    addEventListener('scroll', on); addEventListener('keydown', esc);
    return () => { removeEventListener('scroll', on); removeEventListener('keydown', esc); };
  }, [p]);

  if (!p) return <p>Post not found. <Link to="/">Go to all posts</Link></p>;

  const components = {
    img: ({ src, alt }) => (
      <span className="fig">
        <img src={src} alt={alt} loading="lazy" onClick={() => setZoom({ src, alt })} />
        {alt && <em>{alt}</em>}
      </span>
    ),
    a: ({ href, children }) => <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</a>,
  };

  return (
    <article>
      <div className="progress" style={{ width: pct + '%' }} />
      <header className="phead">
        <h1>{p.title}</h1>
        <small className="meta"><span>{fmt(p.date)}</span><span>{p.minutes} min read</span>{p.tags.map((t) => <span key={t}>#{t}</span>)}</small>
      </header>
      <div className="prose"><Markdown remarkPlugins={[remarkGfm]} components={components}>{p.body}</Markdown></div>
      {p.attachments.length > 0 && (
        <section className="atts"><h3>Attachments</h3>{p.attachments.map((n) => <Attachment key={n} name={n} />)}</section>
      )}
      <p className="back"><Link to="/">Back to all posts</Link></p>
      {zoom && <div className="lb" onClick={() => setZoom(null)} role="dialog" aria-label="Enlarged image"><img src={zoom.src} alt={zoom.alt} /></div>}
    </article>
  );
}
