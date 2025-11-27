import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateItineraryPDF = (trip, activities) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(33, 150, 243);
  doc.text(`Trip Itinerary: ${trip.destination}`, margin, 20);

  // Trip Info
  doc.setFontSize(12);
  doc.setTextColor(33, 33, 33);
  doc.text(`Dates: ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`, margin, 35);
  doc.text(`Duration: ${getTripDuration(trip.startDate, trip.endDate)} days`, margin, 42);

  // Activities Table
  const tableColumn = ['Date', 'Time', 'Activity', 'Location', 'Notes'];
  const tableRows = activities.map(activity => [
    formatDate(activity.date, 'MMM d'),
    activity.time,
    activity.title,
    activity.location,
    activity.notes || '-'
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 55 }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }

  // Save the PDF
  doc.save(`Itinerary-${trip.destination}-${formatDate(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Helper functions
const formatDate = (date, format = 'MMM d, yyyy') => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getTripDuration = (startDate, endDate) => {
  const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};