import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home.jsx';
import Post from './Post.jsx';
import { site } from './site.js';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme); }, [theme]);
  return (
    <BrowserRouter>
      <ScrollTop />
      <div className="wrap">
        <header className="top">
          <Link to="/" className="brand">{site.name}</Link>
          <nav>
            <Link to="/about">about</Link>
            <button className="icon" aria-label="Switch light and dark theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? 'light' : 'dark'}
            </button>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/about" element={<article className="prose"><h1>about</h1><p>{site.about}</p></article>} />
            <Route path="*" element={<p>that page doesn't exist. <Link to="/">go to all posts</Link></p>} />
          </Routes>
        </main>
        <footer className="foot">
          <p>{site.footerText}</p>
          <div>{site.links.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}</div>
          <small>© {new Date().getFullYear()} {site.name}</small>
        </footer>
      </div>
    </BrowserRouter>
  );
}
