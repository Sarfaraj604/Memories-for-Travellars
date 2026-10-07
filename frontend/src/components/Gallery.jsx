import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fetchGallery } from '../api/gallery';

export default function Gallery({ compact = false, images: imagesProp }) {
  const [images, setImages] = useState(imagesProp || []);
  const [category, setCategory] = useState('All');
  const [active, setActive] = useState(null);

  // If images are passed as props, use them; otherwise fetch from API
  useEffect(() => {
    if (imagesProp) {
      setImages(imagesProp);
      return;
    }
    let cancelled = false;
    fetchGallery().then((data) => {
      if (!cancelled) setImages(data || []);
    }).catch(() => { if (!cancelled) setImages([]); });
    return () => { cancelled = true; };
  }, [imagesProp]);

  const categories = ['All', ...new Set(images.map((item) => item.category).filter(Boolean))];
  const items = images.filter((item) => category === 'All' || item.category === category);
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
          <button key={`${item.src}-${index}`} className="gallery-item" onClick={() => setActive(index)} aria-label={`Open ${item.title || 'image'}`}>
            <img src={item.src} alt={item.alt || `${item.title || 'Gallery image'}`} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />
            <span>{item.category}</span>
          </button>
        ))}
      </div>
      {!visible.length && <div className="empty-state"><h3>No gallery images yet</h3><p>Images added by the site administrator will appear here.</p></div>}
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
