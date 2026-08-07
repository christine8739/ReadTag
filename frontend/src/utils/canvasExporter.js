import html2canvas from 'html2canvas';

/**
 * Export target DOM node as high-resolution PNG for Instagram story / SNS proof of reading
 */
export async function exportReceiptToImage(elementId, fileName = 'readtag-receipt.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High DPI export
      useCORS: true,
      backgroundColor: null,
      logging: false
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (error) {
    console.error('Error generating receipt image:', error);
    return false;
  }
}
