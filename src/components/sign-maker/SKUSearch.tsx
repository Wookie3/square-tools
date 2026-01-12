import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { InventoryItem } from '@/types/inventory.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SKUSearchProps {
    onItemFound: (item: InventoryItem) => void;
}

export default function SKUSearch({ onItemFound }: SKUSearchProps) {
    const [upc, setUpc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!upc.trim()) {
            setError('Please enter a UPC');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: supabaseError } = await supabase
                .from('Inventory')
                .select('SKU, UPC, Style, Category, "Category Number"')
                .eq('UPC', upc.trim())
                .single();

            if (supabaseError) {
                if (supabaseError.code === 'PGRST116') {
                    setError('UPC not found in inventory');
                } else {
                    setError('Error searching for UPC: ' + supabaseError.message);
                }
                return;
            }

            if (data) {
                onItemFound(data as InventoryItem);
                setError(null);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Search Inventory</CardTitle>
                <CardDescription>Enter a UPC to find an item</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="upc">UPC Number</Label>
                        <Input
                            id="upc"
                            type="text"
                            placeholder="Enter UPC..."
                            value={upc}
                            onChange={(e) => setUpc(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
