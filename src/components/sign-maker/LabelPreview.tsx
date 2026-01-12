import { useState } from 'react';
import { InventoryItem } from '@/types/inventory.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LabelPreviewProps {
    item: InventoryItem;
    onAddToSheet: (item: InventoryItem, quantity: number) => void;
}

export default function LabelPreview({ item, onAddToSheet }: LabelPreviewProps) {
    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => {
        if (quantity > 0 && quantity <= 4) {
            onAddToSheet(item, quantity);
        }
    };

    return (
        <Card className="border-4 border-[var(--sign-red)] z-10">
            <CardHeader className="bg-[var(--sign-red)]/10">
                <CardTitle className="flex items-center gap-2">
                    <span>Label Preview</span>
                </CardTitle>
                <CardDescription>Review item details before adding.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    {/* Label Preview */}
                    <div className="border-4 border-[var(--ink-black)] p-6 bg-white shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] transform rotate-1">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tighter" style={{ fontFamily: 'sans-serif' }}>{item.Style}</h2>
                            <div className="w-16 h-1 bg-black mx-auto mb-2"></div>
                            <p className="text-xl text-gray-800 font-mono font-bold">Category: {item['Category Number']}  {item.Category}</p>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-end gap-4 p-4 border-2 border-[var(--ink-black)] border-dashed bg-[var(--paper-bg)]">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="quantity" className="font-bold uppercase tracking-wider text-xs">Quantity (max 4)</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                max="4"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.min(4, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="text-center font-bold text-lg"
                            />
                        </div>
                        <Button onClick={handleAdd} className="w-full flex-1" variant="default">
                            ADD TO SHEET
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
