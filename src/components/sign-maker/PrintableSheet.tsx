import { InventoryItem } from '@/types/inventory.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import jsPDF from 'jspdf';

interface PrintableSheetProps {
    labels: InventoryItem[];
    onClear: () => void;
}

export default function PrintableSheet({ labels, onClear }: PrintableSheetProps) {
    const handleDownloadPDF = () => {
        // Create PDF with letter size (8.5 x 11 inches)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'letter'
        });

        const pageWidth = 8.5;
        const pageHeight = 11;
        const margin = 0.5;
        const usableWidth = pageWidth - (2 * margin);
        const usableHeight = pageHeight - (2 * margin);
        const sectionHeight = usableHeight / 4;

        labels.forEach((label, index) => {
            const yPosition = margin + (index * sectionHeight);

            // Draw border for each section
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(margin, yPosition, usableWidth, sectionHeight);

            // Calculate font size based on text length
            let titleFontSize = 24;
            if (label.Style.length > 50) {
                titleFontSize = 16;
            } else if (label.Style.length > 30) {
                titleFontSize = 20;
            }

            // Add product name (Style)
            pdf.setFontSize(titleFontSize);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);

            // Center the text horizontally
            const titleLines = pdf.splitTextToSize(label.Style, usableWidth - 1);
            const titleHeight = titleLines.length * (titleFontSize / 72); // Convert points to inches
            const titleY = yPosition + (sectionHeight / 2) - (titleHeight / 2) - 0.2;

            titleLines.forEach((line: string, lineIndex: number) => {
                const textWidth = pdf.getTextWidth(line);
                const textX = margin + (usableWidth - textWidth) / 2;
                pdf.text(line, textX, titleY + (lineIndex * titleFontSize / 72));
            });

            // Add category information
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 100, 100);
            const categoryText = `Category: ${label['Category Number']}  ${label.Category}`;
            const categoryWidth = pdf.getTextWidth(categoryText);
            const categoryX = margin + (usableWidth - categoryWidth) / 2;
            const categoryY = yPosition + (sectionHeight / 2) + 0.3;
            pdf.text(categoryText, categoryX, categoryY);
        });

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        pdf.save(`labels-${timestamp}.pdf`);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b-2 border-[var(--ink-black)] border-dashed border-b-2">
                <CardTitle>Printable Sheet</CardTitle>
                <div className="flex gap-2">
                    <Button onClick={handleDownloadPDF} disabled={labels.length === 0} variant="secondary">
                        Download PDF
                    </Button>
                    <Button variant="destructive" onClick={onClear} disabled={labels.length === 0} size="icon" aria-label="Clear All">
                        X
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {labels.length === 0 ? (
                    <div className="text-[var(--ink-black)] text-center py-12 flex flex-col items-center opacity-60">
                        <div className="text-4xl mb-2">🖨️</div>
                        <p className="font-mono">SHEET IS EMPTY</p>
                        <p className="text-sm">Add up to 4 labels.</p>
                    </div>
                ) : (
                    <>
                        {/* Preview in UI */}
                        <div className="preview-area border-2 border-[var(--ink-black)] bg-white p-4 h-[600px] overflow-hidden relative shadow-inner">
                            <div className="absolute top-2 right-2 text-xs font-mono text-[var(--ink-black)] opacity-50">
                                PREVIEW MODE
                            </div>

                            {/* Re-using the structure for preview, but without print-specific styles/portal */}
                            <div className="flex flex-col h-full bg-white">
                                {labels.map((label, index) => (
                                    <div
                                        key={index}
                                        className="border-b border-dashed border-gray-400 flex items-center justify-center bg-white w-full last:border-b-0"
                                        style={{ height: '25%' }}
                                    >
                                        <div className="text-center px-4">
                                            <h2 className="text-xl font-bold text-black mb-2 font-sans uppercase">{label.Style}</h2>
                                            <p className="text-lg text-gray-600 font-mono">Category: {label['Category Number']}  {label.Category}</p>
                                        </div>
                                    </div>
                                ))}
                                {labels.length < 4 && Array.from({ length: 4 - labels.length }).map((_, index) => (
                                    <div
                                        key={`empty-${index}`}
                                        className="border-b border-dashed border-gray-300 w-full flex items-center justify-center last:border-b-0"
                                        style={{ height: '25%' }}
                                    >
                                        <span className="text-gray-300 font-mono text-sm uppercase tracking-widest">Empty Slot</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
