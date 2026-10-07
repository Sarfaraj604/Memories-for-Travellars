import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PackageCard } from './Cards';

const tripTypes = ['Family', 'Couple', 'Friends', 'Solo', 'Adventure', 'Relaxation', 'Custom Trip'];

export function QuickTripSearch({ packages = [], loading = false }) {
  const [filters, setFilters] = useState({ destination: '', guests: '', tripType: '', date: '' });
  const filtered = useMemo(() => packages.filter((pkg) => {
    const destinationMatch = !filters.destination || (pkg.destination || '').toLowerCase().includes(filters.destination.toLowerCase());
    const typeMatch = !filters.tripType || (pkg.tripType || []).includes(filters.tripType);
    return destinationMatch && typeMatch;
  }), [filters, packages]);

  return (
    <section className="search-panel" aria-label="Find trip">
      <div className="search-grid">
        <label>Destination<input value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })} placeholder="Where to?" /></label>
        <label>Travel Date<input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} /></label>
        <label>Guests<input type="number" min="1" value={filters.guests} onChange={(e) => setFilters({ ...filters, guests: e.target.value })} placeholder="Guests" /></label>
        <label>Trip Type<select value={filters.tripType} onChange={(e) => setFilters({ ...filters, tripType: e.target.value })}><option value="">Any type</option>{tripTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <button className="accent-btn"><Search size={18} /> Find My Trip</button>
      </div>
      {(filters.destination || filters.tripType) && (
        <div className="inline-results">
          {loading ? <div className="route-loader">Loading...</div> : filtered.length ? filtered.map((pkg) => <PackageCard key={pkg.slug} pkg={pkg} />) : <EmptyState />}
        </div>
      )}
    </section>
  );
}

export function PackageFilters({ allPackages = [], loading = false, error = null }) {
  const [query, setQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [tripType, setTripType] = useState('');
  const destinations = [...new Set(allPackages.map((pkg) => pkg.destination).filter(Boolean))];
  const filtered = allPackages.filter((pkg) => {
    const q = `${pkg.name} ${pkg.destination} ${pkg.shortDescription}`.toLowerCase().includes(query.toLowerCase());
    const d = !destination || pkg.destination === destination;
    const du = !duration || (duration === 'short' ? pkg.durationDays <= 4 : pkg.durationDays > 4);
    const t = !tripType || (pkg.tripType || []).includes(tripType);
    return q && d && du && t;
  });

  return (
    <>
      {loading && <div className="route-loader">Loading packages...</div>}
      {error && <div className="empty-state" role="alert"><h3>Unable to load packages</h3><p>{error}</p></div>}
      {!loading && !error && allPackages.length === 0 && <div className="empty-state"><h3>No packages available</h3><p>Tour packages added by the administrator will appear here.</p></div>}
      <div className="filter-bar">
        <label><Search size={16} /> <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Where do you want to go?" /></label>
        <select value={destination} onChange={(e) => setDestination(e.target.value)}><option value="">All destinations</option>{destinations.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}><option value="">Any duration</option><option value="short">Up to 4 days</option><option value="long">5+ days</option></select>
        <select value={tripType} onChange={(e) => setTripType(e.target.value)}><option value="">Any trip type</option>{tripTypes.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      {!loading && !error && allPackages.length > 0 && <div className="card-grid">{filtered.length ? filtered.map((pkg) => <PackageCard key={pkg.slug || pkg._id} pkg={pkg} />) : <EmptyState />}</div>}
    </>
  );
}

function EmptyState() {
  return <div className="empty-state"><h3>No packages found</h3><p>Try another destination, duration or trip type. You can also request a custom itinerary.</p></div>;
}
