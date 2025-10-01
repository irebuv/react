
interface FilterOption {
    name: string;
    value: string;
}
export interface FiltersProps {
    options?: FilterOption[];
    onChange: (params: Record<string, any>) => void;
}
