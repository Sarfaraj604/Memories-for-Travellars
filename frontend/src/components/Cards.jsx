import { Link } from 'react-router-dom';
import { BedDouble, CalendarDays, MapPin, Users } from 'lucide-react';
import { WhatsAppButton } from './Buttons';

function handleImageError(event) {
  event.currentTarget.hidden = true;
}

export function PackageCard({ pkg }) {
  return (
    <article className="card package-card">
      {pkg.image && <img src={pkg.image} alt={`${pkg.name} package`} loading="lazy" onError={handleImageError} />}
      <div className="card-body">
        <div className="eyebrow"><MapPin size={14} /> {pkg.destination}</div>
        <h3>{pkg.name}</h3>
        <p>{pkg.shortDescription || pkg.description}</p>
        <div className="meta-row">
          <span><CalendarDays size={16} /> {pkg.durationDays} Days / {pkg.nights} Nights</span>
          <span>{pkg.price}</span>
        </div>
        <div className="chips">{(pkg.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
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
      {room.image && <img src={room.image} alt={`${room.name} room`} loading="lazy" onError={handleImageError} />}
      <div className="card-body">
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <div className="meta-row"><span><Users size={16} /> {room.maxGuests || room.guests || 'Ask for availability'}</span><span><BedDouble size={16} /> {room.bedType || 'Room details on request'}</span></div>
        <strong className="price">{room.price || 'Contact for rates'}</strong>
        <div className="chips">{(room.amenities || []).map((item) => <span key={item}>{item}</span>)}</div>
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
      {destination.image && <img src={destination.image} alt={`${destination.name} destination`} loading="lazy" onError={handleImageError} />}
      <div>
        <span>{count} package{count === 1 ? '' : 's'}</span>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        <a href={`/tours?destination=${encodeURIComponent(destination.name)}`}>Explore Destination</a>
      </div>
    </article>
  );
}
