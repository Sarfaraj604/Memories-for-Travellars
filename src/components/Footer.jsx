import { Link } from 'react-router-dom';
import { business, callUrl, whatsappUrl } from '../config/business';

export default function Footer() {
  const links = ['Home', 'Homestay', 'Rooms', 'Tours', 'Destinations', 'Gallery', 'Reviews', 'About', 'Contact'];
  return (
    <footer className="footer">
      <div>
        <h2>{business.businessName}</h2>
        <p>Comfortable stays, customizable tour packages and local travel assistance. Placeholder details are centralized for easy replacement.</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        {links.map((link) => <Link key={link} to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}>{link}</Link>)}
      </div>
      <div>
        <h3>Contact</h3>
        <a href={callUrl()}>{business.phoneLabel}</a>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer">{business.whatsappLabel}</a>
        <span>{business.email}</span>
        <span>{business.address}</span>
      </div>
      <div>
        <h3>Policies</h3>
        <span>Privacy Policy</span>
        <span>Terms & Conditions</span>
        <p>© 2026 Memories for Travellers. All rights reserved.</p>
      </div>
    </footer>
  );
}
