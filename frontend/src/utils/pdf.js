import { jsPDF } from 'jspdf';

export function downloadPackagePdf(pkg, business = {}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 44;
  let y = 48;
  const line = (text, size = 10, gap = 18, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text), 510);
    doc.text(lines, margin, y);
    y += gap * lines.length;
    if (y > 760) {
      doc.addPage();
      y = 48;
    }
  };

  line(business.logoText || business.businessName || 'Memories for Travellers', 18, 24, true);
  line(pkg.name, 24, 30, true);
  line(`${pkg.destination} | ${pkg.durationDays} Days / ${pkg.nights} Nights | Starting from ${pkg.price}`, 12, 24);
  line('Overview', 14, 20, true);
  line(pkg.description);
  line('Highlights', 14, 20, true);
  pkg.highlights?.forEach((item) => line(`- ${item}`));
  line('Daily Itinerary', 14, 20, true);
  pkg.itinerary?.forEach((day) => {
    line(`DAY ${String(day.day).padStart(2, '0')} - ${day.title}`, 12, 18, true);
    line(day.description);
    if (day.places?.length) line(`Places: ${day.places.join(', ')}`);
    if (day.meals) line(`Meals: ${day.meals}`);
    if (day.accommodation) line(`Accommodation: ${day.accommodation}`);
  });
  line('Inclusions', 14, 20, true);
  pkg.inclusions?.forEach((item) => line(`- ${item}`));
  line('Exclusions', 14, 20, true);
  pkg.exclusions?.forEach((item) => line(`- ${item}`));
  line('Contact', 14, 20, true);
  line(`${business.businessName || 'Memories for Travellers'} | Phone: ${business.phoneLabel || ''} | WhatsApp: ${business.whatsappLabel || ''} | Email: ${business.email || ''} | Website: ${business.website || ''}`);
  doc.save(`${pkg.slug}-itinerary.pdf`);
}
