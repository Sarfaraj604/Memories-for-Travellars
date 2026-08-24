import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { gallery } from '../data/gallery';

export default function Gallery({ compact = false }) {
  const [category, setCategory] = useState('All');
  const [active, setActive] = useState(null);
  const categories = ['All', ...new Set(gallery.map((item) => item.category))];
  const items = gallery.filter((item) => category === 'All' || item.category === category);
  const visible = compact ? items.slice(0, 6) : items;

  useEffect(() => {
    const onKey = (event) => {
      if (active === null) return;
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') setActive((active + 1) % visible.length);
      if (event.key === 'ArrowLeft') setActive((active - 1 + visible.length) % visible.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, visible.length]);

  return (
    <>
      <div className="tabs" role="tablist">{categories.map((item) => <button className={item === category ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="gallery-grid">
        {visible.map((item, index) => (
          <button key={`${item.src}-${index}`} className="gallery-item" onClick={() => setActive(index)} aria-label={`Open ${item.title}`}>
            <img src={item.src} alt={`${item.title} - configurable placeholder`} loading="lazy" />
            <span>{item.category}</span>
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
          <button className="icon-btn close" onClick={() => setActive(null)} aria-label="Close"><X /></button>
          <button className="icon-btn prev" onClick={() => setActive((active - 1 + visible.length) % visible.length)} aria-label="Previous image"><ChevronLeft /></button>
          <img src={visible[active].src} alt={visible[active].title} />
          <button className="icon-btn next" onClick={() => setActive((active + 1) % visible.length)} aria-label="Next image"><ChevronRight /></button>
        </div>
      )}
    </>
  );
}
