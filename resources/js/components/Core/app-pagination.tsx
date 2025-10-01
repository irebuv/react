import { Link } from '@inertiajs/react';

interface LinkProps {
    active: boolean;
    label: string;
    url: string | null;
}

interface PaginationData {
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface PaginationProps {
    items: PaginationData;
    perPage?: string;
    onPerPageChange?: (value: string) => void;
    totalCount: number;
    filteredCount: number;
    search?: string;
}

export const AppPagination = ({ items }: PaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-2">
                <Link
                    className={`text-blue-500`}
                    href={items.links[0].url || '#'}
                    dangerouslySetInnerHTML={{ __html: items.links[0].label }}
                />
                <p className={'mx-2'}>
                    Showing <strong>{items.links.find(link => link.active)?.label}</strong> from <strong>{items.links.length - 2}</strong>
                </p>
                <Link
                    className={`text-blue-500`}
                    href={items.links[items.links.length - 1]?.url || '#'}
                    dangerouslySetInnerHTML={{ __html: items.links[items.links.length - 1]?.label }}
                />
        </div>
    );
};
