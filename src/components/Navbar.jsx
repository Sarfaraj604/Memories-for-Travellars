import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { business, callUrl, whatsappUrl } from "../config/business";

const links = [
  "Home",
  "Homestay",
  "Rooms",
  "Tours",
  "Destinations",
  "Gallery",
  "Reviews",
  "About",
  "Contact",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled || open ? "nav-solid" : ""}`}>
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-script">Memories</span>
        <small>for Travellers</small>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink
            key={link}
            to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
          >
            {link}
          </NavLink>
        ))}
      </nav>
      <div className="nav-actions">
        <a className="ghost-btn small desktop-only" href={callUrl()}>
          <Phone size={16} /> Call
        </a>
        <a
          className="accent-btn small"
          href={whatsappUrl(
            "Hello, I would like to plan a trip with Memories for Travellers.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          Plan Your Trip
        </a>
        <button
          className="icon-btn mobile-only"
          aria-label="Open menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        {links.map((link) => (
          <NavLink
            key={link}
            to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
            onClick={() => setOpen(false)}
          >
            {link}
          </NavLink>
        ))}
        <a
          className="accent-btn"
          href={whatsappUrl(
            `Hello, I want to plan a trip with ${business.businessName}.`,
          )}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp Us
        </a>
        <a className="ghost-btn" href={callUrl()}>
          Call Now
        </a>
      </div>
    </header>
  );
}
