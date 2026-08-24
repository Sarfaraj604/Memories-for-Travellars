import { Link } from 'react-router-dom';
import { ArrowRight, Check, Download, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';
import SEO from './components/SEO';
import { CallButton, WhatsAppButton } from './components/Buttons';
import { DestinationCard, PackageCard, RoomCard } from './components/Cards';
import { PackageFilters, QuickTripSearch } from './components/Filters';
import EnquiryForm from './components/EnquiryForm';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
import { business } from './config/business';
import { packages } from './data/packages';
import { rooms } from './data/rooms';
import { destinations } from './data/destinations';
import { experiences, homestay, reviews, whyChoose } from './data/siteContent';

export default function App() {
  return (
    <>
      <SEO />
      <Navbar />
      <main>
        <section className="hero" id="home">
          <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80" alt="Replaceable mountain travel hero image" />
          <div className="hero-overlay" />
          <div className="hero-content reveal">
            <span className="label">HOMESTAY • TOURS • LOCAL EXPERIENCES</span>
            <h1>Stay. Explore. Experience.</h1>
            <p>Discover beautiful places, comfortable stays and unforgettable journeys with Memories for Travellers.</p>
            <div className="hero-actions">
              <Link className="accent-btn" to="/tours">Explore Tour Packages</Link>
              <Link className="glass-btn" to="/rooms">Book Your Stay</Link>
              <WhatsAppButton className="glass-btn" message="Hello, I would like to plan a trip with Memories for Travellers." />
              <CallButton className="glass-btn" />
            </div>
          </div>
        </section>

        <QuickTripSearch />

        <section className="section split" id="homestay">
          <div className="image-panel"><img src={homestay.image} alt="Replaceable homestay property image" loading="lazy" /></div>
          <div>
            <span className="section-kicker">Homestay</span>
            <h2>A comfortable base for slow, memorable travel.</h2>
            <p>{homestay.intro}</p>
            <div className="fact-grid">
              <span><MapPin size={16} /> {homestay.location}</span>
              <span>{homestay.roomInfo}</span>
              <span>Check-in: {homestay.checkIn}</span>
              <span>Check-out: {homestay.checkOut}</span>
              <span>Capacity: {homestay.guestCapacity}</span>
            </div>
            <div className="chips">{homestay.amenities.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</div>
            <Link className="dark-btn" to="/rooms">Explore Our Rooms <ArrowRight size={18} /></Link>
          </div>
        </section>

        <SectionIntro kicker="Rooms" title="Featured Rooms" text="Premium room cards are configured from editable data. Replace images, prices and amenities with verified homestay details." />
        <div className="section card-grid" id="rooms">{rooms.map((room) => <RoomCard key={room.slug} room={room} />)}</div>

        <SectionIntro kicker="Tours" title="Explore Our Tour Packages" text="Instant filters help visitors narrow trips by destination, duration and travel style." />
        <section className="section" id="tours"><PackageFilters allPackages={packages} /></section>

        <SectionIntro kicker="Destinations" title="Popular Destinations" text="Destination cards remain configurable and show package counts from the package dataset." />
        <section className="section destination-grid" id="destinations">
          {destinations.map((destination) => <DestinationCard key={destination.name} destination={destination} count={packages.filter((pkg) => pkg.destination === destination.name).length} />)}
        </section>

        <section className="section muted-band">
          <SectionIntro kicker="Experiences" title="Experiences You'll Remember" text="Keep only the experiences actually offered by the business before publishing." />
          <div className="icon-grid">{experiences.map((item) => <div key={item}><Sparkles size={20} /><span>{item}</span></div>)}</div>
        </section>

        <section className="section">
          <SectionIntro kicker="Trust" title="Why Memories for Travellers" text="Clear information, easy enquiry and flexible trip planning help visitors move from browsing to conversation." />
          <div className="trust-grid">{whyChoose.map((item) => <article key={item}><ShieldCheck size={22} /><h3>{item}</h3><p>Editable trust point. Replace with verified business wording.</p></article>)}</div>
        </section>

        <section className="section" id="gallery">
          <SectionIntro kicker="Gallery" title="Photo Gallery" text="Images are replaceable placeholders and are not presented as verified business photos." />
          <Gallery compact />
        </section>

        <section className="section reviews" id="reviews">
          <SectionIntro kicker="Reviews" title="Guest Reviews" text="See what our guests say about their stay and travel experience." />
          <div className="review-summary"><strong>4.8 / 5</strong><span>100 reviews</span>{business.googleBusinessProfile && <a href={business.googleBusinessProfile}>View us on Google</a>}</div>
          <div className="review-grid">{reviews.map((review, index) => <article key={index}><span>Guest Review</span><h3>{review.name}</h3><p>{review.review}</p><small>{review.rating} ★ • {review.date}</small></article>)}</div>
        </section>

        <section className="section">
          <SectionIntro kicker="FAQ" title="Helpful Travel Questions" text="FAQ answers are editable and should be finalized with business policy details." />
          <FAQ />
        </section>

        <section className="section split" id="contact">
          <div>
            <span className="section-kicker">Location</span>
            <h2>Plan your stay or journey with a real conversation.</h2>
            <p>Address: {business.address}</p>
            <p>Opening hours: {business.openingHours}</p>
            <div className="hero-actions"><WhatsAppButton message="Hello, I would like to enquire about Memories for Travellers." /><CallButton /></div>
          </div>
          <div className="map-box">{business.googleMapsUrl.startsWith('http') ? <iframe src={business.googleMapsUrl} title="Google Maps location" loading="lazy" /> : <div><MapPin /><strong>https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d113700.47129921794!2d88.5109639!3d27.0573371!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e41d002d9c4d41%3A0x2745d4d0802e25b4!2sMairung%20Home%20Stay!5e0!3m2!1sen!2sin!4v1787571540752!5m2!1sen!2sin</strong><p>Add a valid embed URL in business config.</p></div>}</div>
        </section>

        <section className="section final-cta" id="enquiry">
          <SectionIntro kicker="Enquiry" title="Tell us how you want to travel" text="Submit the enquiry form or continue directly on WhatsApp for faster conversation." />
          <EnquiryForm />
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}

export function SectionIntro({ kicker, title, text }) {
  return (
    <div className="section intro">
      <span className="section-kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
