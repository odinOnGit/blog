import { useState } from 'react';
import { Link } from 'react-router-dom';
import { posts, fmt } from './posts.js';
import { site } from './site.js';

export default function Home() {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const tags = [...new Set(posts.flatMap((p) => p.tags))];
  const shown = posts.filter((p) => (!tag || p.tags.includes(tag)) && (p.title + p.summary).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <h1 className="hero">{site.tagline}</h1>
      <div className="tools">
        <input type="search" placeholder="Search posts(i don't have so many posts)" aria-label="Search posts" value={q} onChange={(e) => setQ(e.target.value)} />
        <div>{tags.map((t) => <button key={t} className={'chip' + (t === tag ? ' on' : '')} onClick={() => setTag(t === tag ? '' : t)}>{t}</button>)}</div>
      </div>
      {shown.map((p) => (
        <Link key={p.slug} to={'/post/' + p.slug} className="item">
          {p.cover && <img src={p.cover} alt="" loading="lazy" />}
          <div>
            <h2>{p.title}</h2>
            <p>{p.summary}</p>
            <small><span>{fmt(p.date)}</span><span>{p.minutes} min read</span></small>
          </div>
        </Link>
      ))}
      {!shown.length && <p className="mute">No posts match. Clear the search or pick another tag.</p>}
    </>
  );
}
