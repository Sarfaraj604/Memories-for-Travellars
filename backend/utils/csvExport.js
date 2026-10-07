import { createObjectCsvStringifier } from 'csv-writer';

export const enquiriesToCsv = (enquiries) => {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'name', title: 'Name' },
      { id: 'phone', title: 'Phone' },
      { id: 'email', title: 'Email' },
      { id: 'destination', title: 'Destination' },
      { id: 'tourPackage', title: 'Tour Package' },
      { id: 'date', title: 'Date' },
      { id: 'guests', title: 'Guests' },
      { id: 'nights', title: 'Nights' },
      { id: 'tripType', title: 'Trip Type' },
      { id: 'budget', title: 'Budget' },
      { id: 'message', title: 'Message' },
      { id: 'status', title: 'Status' },
      { id: 'createdAt', title: 'Created At' }
    ]
  });

  const records = enquiries.map(eq => ({
    name: eq.name || '',
    phone: eq.phone || '',
    email: eq.email || '',
    destination: eq.destination || '',
    tourPackage: eq.tourPackage || '',
    date: eq.date || '',
    guests: eq.guests || '',
    nights: eq.nights || '',
    tripType: eq.tripType || '',
    budget: eq.budget || '',
    message: eq.message || '',
    status: eq.status || '',
    createdAt: eq.createdAt ? new Date(eq.createdAt).toISOString() : ''
  }));

  const header = csvStringifier.getHeaderString();
  const body = csvStringifier.stringifyRecords(records);
  
  return header + body;
};
