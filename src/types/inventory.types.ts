export interface InventoryItem {
    SKU: string | number;
    Style: string;
    Category: string;
    'Style Number'?: string;
    Colour?: string;
    Size?: string;
    'Size 2'?: string;
    UPC?: number;
    'Category Number'?: string;
    'SKU Status'?: string;
    'In Catalog'?: boolean;
    row?: number;
}
