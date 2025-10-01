interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    featured_image: string;
    featured_image_original_name: string;
    created_at: string;
}

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface AnimePagination {
    data: Product[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

export interface FlashProps extends Record<string, any> {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface Filter {
    id:  string;
    title: string;
}
interface FiltersResponse {
    [group: string]: Filter[];
}
export interface IndexProps {
    anime: AnimePagination;
    filters: FiltersResponse | undefined;
    query?: { filters?: string[] };
    totalCount: number;
    filteredCount: number;
    sort?: string | undefined;
    direction?: "asc" | "desc" | undefined;
}
