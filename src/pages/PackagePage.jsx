import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';
import SEO from '../components/SEO';
import { CallButton, WhatsAppButton } from '../components/Buttons';
import EnquiryForm from '../components/EnquiryForm';
import Gallery from '../components/Gallery';
import FAQ from '../components/FAQ';
import { packages } from '../data/packages';
import { business } from '../config/business';
import { downloadPackagePdf } from '../utils/pdf';

export default function PackagePage() {
  const { slug } = useParams();
  const pkg = packages.find((item) => item.slug === slug);
  if (!pkg) return <PackageNotFound />;

  return (
    <>
      <SEO title={`${pkg.name} | Memories for Travellers`} description={pkg.shortDescription} />
      <Navbar />
      <main>
        <section className="sub-hero">
          <img src={pkg.image} alt={`${pkg.name} destination placeholder`} />
          <div className="hero-overlay" />
          <div>
            <Link className="back-link" to="/tours"><ArrowLeft size={18} /> All Tours</Link>
            <span className="label">{pkg.destination}</span>
            <h1>{pkg.name}</h1>
            <p>{pkg.shortDescription}</p>
            <div className="hero-actions">
              <button className="accent-btn" onClick={() => downloadPackagePdf(pkg)}><Download size={18} /> Download Itinerary PDF</button>
              <WhatsAppButton className="glass-btn" message={`Hello, I am interested in the ${pkg.name} package. Please share availability and details.`}>Enquire on WhatsApp</WhatsAppButton>
              <CallButton className="glass-btn" />
            </div>
          </div>
        </section>

        <section className="section package-layout">
          <article className="detail-main">
            <div className="detail-card">
              <h2>Overview</h2>
              <p>{pkg.description}</p>
              <div className="chips">{pkg.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="detail-card">
              <h2>Highlights</h2>
              <ul>{pkg.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="detail-card">
              <h2>Day-by-Day Itinerary</h2>
              <div className="timeline">{pkg.itinerary.map((day) => <article key={day.day}><span>DAY {String(day.day).padStart(2, '0')}</span><h3>{day.title}</h3><p>{day.description}</p>{day.places && <small>Places: {day.places.join(', ')}</small>}{day.meals && <small>Meals: {day.meals}</small>}{day.accommodation && <small>Stay: {day.accommodation}</small>}</article>)}</div>
            </div>
            <div className="detail-grid">
              <InfoList title="Inclusions" items={pkg.inclusions} />
              <InfoList title="Exclusions" items={pkg.exclusions} />
              <InfoList title="Important Information" items={pkg.importantInfo} />
              <div className="detail-card"><h2>Accommodation</h2><p>{pkg.accommodation}</p><h2>Transportation</h2><p>{pkg.transportation}</p></div>
            </div>
            <div className="detail-card"><h2>Gallery</h2><Gallery compact /></div>
            <div className="detail-card"><h2>FAQs</h2><FAQ /></div>
          </article>
          <aside className="booking-panel">
            <h2>{pkg.price}</h2>
            <p>{pkg.durationDays} Days / {pkg.nights} Nights</p>
            <p><MapPin size={16} /> {pkg.destination}</p>
            <button className="dark-btn full-button" onClick={() => downloadPackagePdf(pkg)}><Download size={18} /> Download PDF</button>
            <WhatsAppButton message={`Hello, I am interested in the ${pkg.name} package. Please share availability and details.`}>Enquire Now</WhatsAppButton>
            <CallButton />
            <div className="mini-map">{business.googleMapsUrl.startsWith('http') ? <iframe src={business.googleMapsUrl} title={`${pkg.name} map`} /> : <span>[GOOGLE MAPS URL]</span>}</div>
          </aside>
        </section>
        <section className="section final-cta" id="enquiry"><h2>Enquire About {pkg.name}</h2><EnquiryForm selectedPackage={pkg.name} /></section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}

function InfoList({ title, items = [] }) {
  return <div className="detail-card"><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function PackageNotFound() {
  return (
    <>
      <Navbar />
      <main className="not-found"><h1>Looks like this trail doesn't lead anywhere.</h1><Link className="accent-btn" to="/">Back to Home</Link><Link className="ghost-btn" to="/tours">Explore Tours</Link></main>
      <Footer />
    </>
  );
}
