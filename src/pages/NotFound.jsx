import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="not-found">
        <h1>Looks like this trail doesn't lead anywhere.</h1>
        <p>The page may have moved, or the trip may need a fresh route.</p>
        <div className="hero-actions"><Link className="accent-btn" to="/">Back to Home</Link><Link className="ghost-btn" to="/tours">Explore Tours</Link></div>
      </main>
      <Footer />
    </>
  );
}
