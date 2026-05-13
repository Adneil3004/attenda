/**
 * Utility for exporting data to Excel-compatible CSV format.
 */

export const exportToExcel = (data, filename = 'cronograma.csv') => {
  if (!data || !data.length) return;

  // Define headers
  const headers = ['Fecha', 'Hora Inicio', 'Hora Fin', 'Actividad', 'Descripción', 'Duración'];
  
  // Map data to rows
  const rows = data.map(item => [
    new Date(item.startTime).toLocaleDateString('es-ES'),
    new Date(item.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    item.endTime ? new Date(item.endTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-',
    item.title || '',
    (item.description || '').replace(/,/g, ' '), // Basic sanitization
    item.duration ? `${item.duration} min` : '-'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Add BOM (Byte Order Mark) for UTF-8 to ensure Excel handles accents correctly
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
