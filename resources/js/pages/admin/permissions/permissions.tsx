/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomTable } from '@/components/custom-table';
import { CustomToast, toast } from '@/components/custom-toast';
import { CustomModalForm } from '@/components/ui/custom-modal-form';
import { PermissionModalFormConfig } from '@/config/forms/permission-modal-form';
import { PermissionsTableConfig } from '@/config/tables/permissions-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Permissions',
        href: '/admin/permissions',
    },
];

interface Permission {
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

interface PermissionPagination {
    data: Permission[];
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
    permissions: PermissionPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ permissions }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const { data, setData, errors, processing, reset, post } = useForm({
        module: '',
        name: '',
        description: '',
        _method: 'POST',
    });

    const handleDelete = (id: number, route: string) => {
        if (confirm('Are you sure to delete this product?')) {
            router.delete(route, {
                preserveScroll: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    successMessage && toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message;

                    errorMessage && toast.error(errorMessage);
                    closeModal();
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'edit' && selectedCategory) {
            data._method = 'PUT';

            post(route('permissions.update', selectedCategory.id), {
                forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    successMessage && toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message;

                    errorMessage && toast.error(errorMessage);
                    closeModal();
                },
            });
        } else {
            post(route('permissions.store'), {
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success;
                    successMessage && toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message;

                    errorMessage && toast.error(errorMessage);
                    closeModal();
                },
            });
        }
    };

    const closeModal = () => {
        setMode('create');
        setSelectedCategory(null);
        reset();
        setModalOpen(false);
    };

    const handleModalToggle = (open: boolean) => {
        setModalOpen(open);

        if (!open) {
            setMode('create');
            setSelectedCategory(null);
            reset();
        }
    };

    const openModal = (mode: 'create' | 'view' | 'edit', category?: any) => {
        setMode(mode);

        if (category) {
            Object.entries(category).forEach(([key, value]) => {
                setData(key as keyof typeof data, value as string | null);
            });
            setSelectedCategory(category);
        } else {
            reset();
        }

        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions Management" />

            <CustomToast />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="ml-auto">
                    <CustomModalForm
                        addButton={PermissionModalFormConfig.addButton}
                        title={mode === 'view' ? 'View Permission' : mode === 'edit' ? 'Update Permission' : PermissionModalFormConfig.title}
                        description={PermissionModalFormConfig.description}
                        fields={PermissionModalFormConfig.fields}
                        buttons={PermissionModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                    />
                </div>

                <CustomTable
                    columns={PermissionsTableConfig.columns}
                    actions={PermissionsTableConfig.actions}
                    data={permissions.data}
                    from={permissions.from}
                    onDelete={handleDelete}
                    onView={(category) => openModal('view', category)}
                    onEdit={(category) => openModal('edit', category)}
                    isModal={true}
                />
            </div>
        </AppLayout>
    );
}
