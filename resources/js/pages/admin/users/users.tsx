/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomTable } from '@/components/custom-table';
import { CustomToast, toast } from '@/components/custom-toast';
import { CustomModalForm } from '@/components/ui/custom-modal-form';
import { UsersModalFormConfig } from '@/config/forms/users-modal-form';
import { UsersTableConfig } from '@/config/tables/users-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/admin/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    roles: string;
}

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface UserPagination {
    data: User[];
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
    permissions: UserPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ users }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const { props } = usePage();

    const { data, setData, errors, processing, reset, post } = useForm<{
        name: string;
        email: string;
        password: string;
        confirm_password: string;
        roles: string;
        _method: string;
    }>({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        roles: '',
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

            post(route('users.update', selectedCategory.id), {
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
            post(route('users.store'), {
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
                if (key === 'roles' && Array.isArray(value)) {
                    setData('roles', value[0]?.name);
                } else {
                    setData(key as keyof typeof data, value as string | null ?? '');
                }
            });
            setSelectedCategory(category);
        } else {
            reset();
        }

        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Management" />

            <CustomToast />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="ml-auto">
                    <CustomModalForm
                        addButton={UsersModalFormConfig.addButton}
                        title={mode === 'view' ? 'View User' : mode === 'edit' ? 'Update User' : UsersModalFormConfig.title}
                        description={UsersModalFormConfig.description}
                        fields={UsersModalFormConfig.fields}
                        buttons={UsersModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                        extraData={props}
                    />
                </div>

                <CustomTable
                    columns={UsersTableConfig.columns}
                    actions={UsersTableConfig.actions}
                    data={users.data}
                    from={users.from}
                    onDelete={handleDelete}
                    onView={(category) => openModal('view', category)}
                    onEdit={(category) => openModal('edit', category)}
                    isModal={true}
                />
            </div>
        </AppLayout>
    );
}
