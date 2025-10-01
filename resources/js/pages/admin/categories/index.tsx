/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomTable } from '@/components/custom-table';
import { CustomToast, toast } from '@/components/custom-toast';
import { CustomModalForm } from '@/components/ui/custom-modal-form';
import { CategoryModalFormConfig } from '@/config/forms/category-modal-form';
import { CategoryTableConfig } from '@/config/tables/category-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Categories',
        href: '/admin/categories',
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

interface CategoryPagination {
    data: Product[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface FlashProps extends Record<string, any> {
    flash?: {
        success?: string;
        error?: string;
    };
}

interface FilterProps {
    search: string;
    perPage: string;
}

interface IndexProps {
    categories: CategoryPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ categories }: IndexProps) {
    //const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    //const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, errors, processing, reset, post } = useForm({
        name: '',
        description: '',
        image: null as File | null,
        _method: 'POST',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'edit' && selectedCategory) {
            data._method = 'PUT';

            post(route('categories.update', selectedCategory.id), {
                forceFormData: true,
                onSuccess: (response: {props: FlashProps}) => {
                    const successMessage = response.props.flash?.success || 'Category updated successfully!';
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to update category!';

                    toast.error(errorMessage);
                    closeModal();
                },
            });
        } else {
            post(route('categories.store'), {
                 onSuccess: (response: {props: FlashProps}) => {
                    const successMessage = response.props.flash?.success || 'Category created successfully!';
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to create category!';

                    toast.error(errorMessage);
                    closeModal();
                },
            });
        }
    };

    const closeModal = () => {
        setMode('create');
        setPreviewImage(null);
        setSelectedCategory(null);
        reset();
        setModalOpen(false);
    };

    const handleModalToggle = (open: boolean) => {
        setModalOpen(open);

        if (!open) {
            setMode('create');
            setPreviewImage(null);
            setSelectedCategory(null);
            reset();
        }
    };

    const openModal = (mode: 'create' | 'view' | 'edit', category?: any) => {
        setMode(mode);
        console.log(category)
        if (category) {
            Object.entries(category).forEach(([key, value]) => {
                setData(key as keyof typeof data, value as string | null);
            });
            setPreviewImage(category.image);
            setSelectedCategory(category);
        } else {
            reset();
        }

        setModalOpen(true);
    };

    const handleDelete = (id: number, route: string) => {
        if (confirm('Are you sure to delete this product?')) {
            router.delete(route, {
                preserveScroll: true,
                onSuccess: (response: {props: FlashProps}) => {
                    const successMessage = response.props.flash?.success || 'Category deleted successfully!';
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to delete category!';

                    toast.error(errorMessage);
                    closeModal();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories Management" />

            <CustomToast />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="ml-auto">
                    <CustomModalForm
                        addButton={CategoryModalFormConfig.addButton}
                        title={mode === 'view' ? 'View Category' : mode === 'edit' ? 'Update Category' : CategoryModalFormConfig.title}
                        description={CategoryModalFormConfig.description}
                        fields={CategoryModalFormConfig.fields}
                        buttons={CategoryModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                        previewImage={previewImage}
                    />
                </div>

                <CustomTable
                    columns={CategoryTableConfig.columns}
                    actions={CategoryTableConfig.actions}
                    data={categories.data}
                    from={categories.from}
                    onDelete={handleDelete}
                    onView={(category) => openModal('view', category)}
                    onEdit={(category) => openModal('edit', category)}
                    isModal={true}
                />

            </div>
        </AppLayout>
    );
}
