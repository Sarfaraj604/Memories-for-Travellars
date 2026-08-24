import { Link } from 'react-router-dom';
import { BedDouble, CalendarDays, MapPin, Users } from 'lucide-react';
import { WhatsAppButton } from './Buttons';

export function PackageCard({ pkg }) {
  return (
    <article className="card package-card">
      <img src={pkg.image} alt={`${pkg.name} configurable package image`} loading="lazy" />
      <div className="card-body">
        <div className="eyebrow"><MapPin size={14} /> {pkg.destination}</div>
        <h3>{pkg.name}</h3>
        <p>{pkg.shortDescription}</p>
        <div className="meta-row">
          <span><CalendarDays size={16} /> {pkg.durationDays} Days / {pkg.nights} Nights</span>
          <span>{pkg.price}</span>
        </div>
        <div className="chips">{pkg.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="card-actions">
          <Link className="dark-btn" to={`/tours/${pkg.slug}`}>View Package</Link>
          <WhatsAppButton className="outline-btn" message={`Hello, I am interested in the ${pkg.name} package. Please share availability and details.`}>Enquire Now</WhatsAppButton>
        </div>
      </div>
    </article>
  );
}

export function RoomCard({ room }) {
  return (
    <article className="card">
      <img src={room.image} alt={`${room.name} replaceable room image`} loading="lazy" />
      <div className="card-body">
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <div className="meta-row"><span><Users size={16} /> {room.maxGuests}</span><span><BedDouble size={16} /> {room.bedType}</span></div>
        <strong className="price">{room.price}</strong>
        <div className="chips">{room.amenities.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="card-actions">
          <a className="dark-btn" href="#rooms">View Room</a>
          <WhatsAppButton className="outline-btn" message={`Hello, I am interested in the ${room.name}. Please share availability and details.`}>Enquire Now</WhatsAppButton>
        </div>
      </div>
    </article>
  );
}

export function DestinationCard({ destination, count = 0 }) {
  return (
    <article className="destination-card">
      <img src={destination.image} alt={`${destination.name} destination placeholder`} loading="lazy" />
      <div>
        <span>{count} package{count === 1 ? '' : 's'}</span>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        <a href={`/tours?destination=${encodeURIComponent(destination.name)}`}>Explore Destination</a>
      </div>
    </article>
  );
}
