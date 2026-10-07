import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';
import SEO from '../components/SEO';
import { PackageFilters } from '../components/Filters';
import { DestinationCard, RoomCard } from '../components/Cards';
import Gallery from '../components/Gallery';
import EnquiryForm from '../components/EnquiryForm';
import FAQ from '../components/FAQ';
import { useBusiness } from '../context/BusinessContext';
import { useApi } from '../hooks/useApi';
import { fetchPackages } from '../api/packages';
import { fetchRooms } from '../api/rooms';
import { fetchDestinations } from '../api/destinations';
import { fetchReviews } from '../api/reviews';
import { fetchGallery } from '../api/gallery';

export default function SimplePage({ view }) {
  const { business, siteContent } = useBusiness();
  const { data: packages, loading: packagesLoading, error: packagesError } = useApi(fetchPackages);
  const { data: roomsData, loading: roomsLoading, error: roomsError } = useApi(fetchRooms);
  const { data: destinationsData, loading: destinationsLoading, error: destinationsError } = useApi(fetchDestinations);
  const { data: reviewsData, loading: reviewsLoading, error: reviewsError } = useApi(fetchReviews);
  const { data: galleryData, loading: galleryLoading, error: galleryError } = useApi(fetchGallery);

  const pkgs = packages || [];
  const rooms = roomsData || [];
  const destinations = destinationsData || [];
  const reviews = reviewsData || [];
  const gallery = galleryData || [];
  const homestay = siteContent.homestay || {};

  const titles = { homestay: 'Homestay', rooms: 'Rooms', tours: 'Tour Packages', destinations: 'Destinations', gallery: 'Gallery', reviews: 'Reviews', about: 'About Memories for Travellers', contact: 'Contact' };
  return (
    <>
      <SEO title={`${titles[view]} | Memories for Travellers`} />
      <Navbar />
      <main>
        <section className="page-head"><span className="label">{business.tagline}</span><h1>{titles[view]}</h1><p>Editable, conversion-focused content for the official Memories for Travellars website.</p></section>
        {view === 'homestay' && <section className="section split">{homestay.image && <img className="standalone-img" src={homestay.image} alt="Homestay" onError={(event) => { event.currentTarget.hidden = true; }} />}<div><h2>{business.businessName} Homestay</h2><p>{homestay.intro}</p><p>Location: {homestay.location}</p><p>Guest capacity: {homestay.guestCapacity}</p></div></section>}
        {view === 'rooms' && <section className="section card-grid">{roomsLoading ? <p>Loading rooms...</p> : roomsError ? <DataMessage error={roomsError} /> : rooms.length ? rooms.map((room) => <RoomCard key={room.slug || room._id} room={room} />) : <DataMessage empty="No rooms are listed yet." />}</section>}
        {view === 'tours' && <section className="section"><PackageFilters allPackages={pkgs} loading={packagesLoading} error={packagesError} /></section>}
        {view === 'destinations' && <section className="section destination-grid">{destinationsLoading ? <p>Loading destinations...</p> : destinationsError ? <DataMessage error={destinationsError} /> : destinations.length ? destinations.map((destination) => <DestinationCard key={destination.name} destination={destination} count={pkgs.filter((pkg) => pkg.destination === destination.name).length} />) : <DataMessage empty="No destinations are listed yet." />}</section>}
        {view === 'gallery' && <section className="section">{galleryLoading ? <p>Loading gallery...</p> : galleryError ? <DataMessage error={galleryError} /> : <Gallery images={gallery} />}</section>}
        {view === 'reviews' && <section className="section review-grid">{reviewsLoading ? <p>Loading reviews...</p> : reviewsError ? <DataMessage error={reviewsError} /> : reviews.length ? reviews.map((review, index) => <article key={review._id || index}><span>Guest Review</span><h3>{review.name}</h3><p>{review.review}</p><small>{review.rating} stars - {review.date}</small></article>) : <DataMessage empty="No reviews have been published yet." />}</section>}
        {view === 'about' && <section className="section narrow"><h2>Memories for Travellars</h2><p>Memories for Travellers combines homestay enquiries, tour planning and local travel assistance in one premium, data-ready website. Replace this placeholder with the verified story, service area and founder details.</p><FAQ faqs={siteContent.faqs} /></section>}
        {view === 'contact' && <section className="section final-cta"><h2>Contact Memories for Travellers</h2><p>Phone: {business.phoneLabel} | WhatsApp: {business.whatsappLabel} | Email: {business.email} | Address: {business.address}</p><EnquiryForm packages={pkgs} /></section>}
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}

function DataMessage({ error, empty }) {
  return <div className="empty-state" role={error ? 'alert' : undefined}><h3>{error ? 'Unable to load this section' : 'Nothing to show yet'}</h3><p>{error || empty}</p></div>;
}
