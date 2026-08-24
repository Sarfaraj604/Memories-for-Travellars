import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';
import SEO from '../components/SEO';
import { PackageFilters } from '../components/Filters';
import { DestinationCard, RoomCard } from '../components/Cards';
import Gallery from '../components/Gallery';
import EnquiryForm from '../components/EnquiryForm';
import FAQ from '../components/FAQ';
import { packages } from '../data/packages';
import { rooms } from '../data/rooms';
import { destinations } from '../data/destinations';
import { reviews, homestay } from '../data/siteContent';
import { business } from '../config/business';

export default function SimplePage({ view }) {
  const titles = { homestay: 'Homestay', rooms: 'Rooms', tours: 'Tour Packages', destinations: 'Destinations', gallery: 'Gallery', reviews: 'Reviews', about: 'About Memories for Travellers', contact: 'Contact' };
  return (
    <>
      <SEO title={`${titles[view]} | Memories for Travellers`} />
      <Navbar />
      <main>
        <section className="page-head"><span className="label">{business.tagline}</span><h1>{titles[view]}</h1><p>Editable, conversion-focused content for the official Memories for Travellars website.</p></section>
        {view === 'homestay' && <section className="section split"><img className="standalone-img" src={homestay.image} alt="Replaceable homestay image" /><div><h2>Memories for Travellers Homestay</h2><p>{homestay.intro}</p><p>Location: {homestay.location}</p><p>Guest capacity: {homestay.guestCapacity}</p></div></section>}
        {view === 'rooms' && <section className="section card-grid">{rooms.map((room) => <RoomCard key={room.slug} room={room} />)}</section>}
        {view === 'tours' && <section className="section"><PackageFilters allPackages={packages} /></section>}
        {view === 'destinations' && <section className="section destination-grid">{destinations.map((destination) => <DestinationCard key={destination.name} destination={destination} count={packages.filter((pkg) => pkg.destination === destination.name).length} />)}</section>}
        {view === 'gallery' && <section className="section"><Gallery /></section>}
        {view === 'reviews' && <section className="section review-grid">{reviews.map((review, index) => <article key={index}><span>Placeholder review</span><h3>{review.name}</h3><p>{review.review}</p><small>{review.rating} • {review.date}</small></article>)}</section>}
        {view === 'about' && <section className="section narrow"><h2>Memories for Travellars</h2><p>Memories for Travellers combines homestay enquiries, tour planning and local travel assistance in one premium, data-ready website. Replace this placeholder with the verified story, service area and founder details.</p><FAQ /></section>}
        {view === 'contact' && <section className="section final-cta"><h2>Contact Memories for Travellers</h2><p>Phone: {business.phoneLabel} | WhatsApp: {business.whatsappLabel} | Email: {business.email} | Address: {business.address}</p><EnquiryForm /></section>}
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
