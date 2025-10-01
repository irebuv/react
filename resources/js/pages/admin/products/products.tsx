import { CustomTable } from '@/components/custom-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { ProductTableConfig } from '@/config/tables/product-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Products',
        href: '/admin/products',
    },
];

interface Product {
    id: number;
    name: string;
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

interface ProductPagination {
    data: Product[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface FilterProps {
    search: string;
    perPage: string;
}

interface IndexProps {
    products: ProductPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ products, filters, totalCount, filteredCount }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flash?.success || flash?.error ? true : false);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    const { data, setData } = useForm({
        search: filters.search || '',
        perPage: filters.perPage || '10',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        const queryString = {
            ...(value && { search: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('products.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData('search', '');
        setData('perPage', '10');

        router.get(
            route('products.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('products.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number, route: string) => {
        if (confirm('Are you sure to delete this product?')) {
            router.delete(route, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {showAlert && flashMessage && (
                    <Alert
                        variant={'default'}
                        className={`${flash?.success ? 'bg-green-800' : flash?.error ? 'bg-red-800' : ''} ml-auto max-w-md text-white`}
                    >
                        <AlertDescription className="text-white">
                            {flash.success ? 'Success!' : 'Error!'} {''}
                            {flashMessage}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    {/* Add product button */}
                    <Input onChange={handleChange} value={data.search} type="text" className="h-10 w-1/4" placeholder="Search product" />
                    <Button onClick={handleReset} className="ms-2 h-10 cursor-pointer bg-red-400 hover:bg-red-500">
                        <XIcon size={20} />
                    </Button>
                    <div className="ml-auto">
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                            as="button"
                            href={route('products.create')}
                        >
                            <CirclePlusIcon className="me-2" />
                            Add Product
                        </Link>
                    </div>
                </div>

                <CustomTable
                    columns={ProductTableConfig.columns}
                    actions={ProductTableConfig.actions}
                    data={products.data}
                    from={products.from}
                    onDelete={handleDelete}
                />

                {/* <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-black bg-gray-700 text-white">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Featured Image</th>
                                <th className="border p-4">Name</th>
                                <th className="border p-4">Description</th>
                                <th className="border p-4">Price</th>
                                <th className="border p-4">Created Date</th>
                                <th className="border p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.length > 0 ? (
                                products.data.map((product, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{products.from + index}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <div className="flex justify-center">
                                                {product.featured_image && (
                                                    <img width="100" src={`/storage/${product.featured_image}`} alt={product.name} />
                                                )}
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 text-center">{product.name}</td>
                                        <td className="border px-4 py-2 text-center">{product.description}</td>
                                        <td className="border px-4 py-2 text-center">{product.price}</td>
                                        <td className="border px-4 py-2 text-center">{product.created_at}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <div className="flex justify-center">
                                                <Link
                                                    as="button"
                                                    className="cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90"
                                                    href={route('products.show', product.id)}
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                                <Link
                                                    as="button"
                                                    className="ms-2 cursor-pointer rounded-lg bg-green-600 p-2 text-white hover:opacity-90"
                                                    href={route('products.edit', product.id)}
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </Link>
                                                <Button
                                                    className="ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90"
                                                    onClick={() => {
                                                        if (confirm('Are you sure to delete this product?')) {
                                                            router.delete(route('products.destroy', product.id), {
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Trash />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-4 text-center font-bold text-red-800">
                                        No Products found!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div> */}
                <Pagination
                    products={products}
                    perPage={data.perPage}
                    onPerPageChange={handlePerPageChange}
                    totalCount={totalCount}
                    filteredCount={filteredCount}
                    search={data.search}
                />
            </div>
        </AppLayout>
    );
}
