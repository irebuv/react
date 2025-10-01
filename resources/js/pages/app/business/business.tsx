import MainLayout from '@/components/App/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { CustomModalForm } from '@/components/ui/custom-modal-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BusinessList from '@/pages/app/business/business-list';
import { BusinessModalFormConfig, BusinessModalFormRequest } from '@/pages/app/business/config-business-modal-form';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Pagination } from '@/components/ui/pagination';
import DialogRequestShow from '@/pages/app/business/request-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Business',
        href: '/business',
    },
];
interface User {
    phone: string;
}
interface Business {
    id: number;
    user_id: number;
    image: string;
    name: string;
    type: string;
    description: string;
    user: User;
}

interface Order {
    id: string;
    name: string;
    is_read: boolean;
    phone: string;
    date: string;
    business_name: string;
    business_image: string;
    description: string;
}

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}
interface BusinessPagination {
    data: Business[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface IndexProps {
    businesses: BusinessPagination;
    totalCount: number;
    filteredCount: number;
    myProjects: number;
    types: string[];
    myRequests: Order[];
    unreadCount: number;
}

function Business({ businesses, myProjects, types, myRequests, unreadCount }: IndexProps) {
    const {auth} = usePage().props as any;
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'view' | 'edit' | 'create_request'>('create');
    const [selectedType, setSelectedType] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { data, setData, errors, processing, reset, post } = useForm({
        name: '',
        description: '',
        image: null as File | null,
        type: '',
        _method: 'POST',
        phone: '',
        date: '',
        request_name: '',
        request_description: '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'edit' && selectedType) {
            data._method = 'PUT';
            post(route('business.update', selectedType.id), {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                },
            });
        } else if (mode === 'create_request') {
            post(route('business.request'), {
                onSuccess: () => {
                    closeModal();
                },
            });
        } else {
            post(route('business.store'), {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };
    const closeModal = () => {
        setMode('create');
        setPreviewImage(null);
        setSelectedType(null);
        reset();
        setModalOpen(false);
    };

    const handleModalToggle = (open: boolean) => {
        setModalOpen(open);

        if (!open) {
            setMode('create');
            setPreviewImage(null);
            setSelectedType(null);
            reset();
        }
    };

    const openModal = (mode: 'create' | 'view' | 'edit' | 'create_request', project?: any) => {
        setMode(mode);
        if (project) {
            Object.entries(project).forEach(([key, value]) => {
                if (key === 'image') {
                    value = null;
                }
                setData(key as keyof typeof data, value as string | null);
            });
            setPreviewImage(project.image);
            setSelectedType(project);
        } else {
            reset();
        }

        setModalOpen(true);
    };

    const handleDelete = (id: number, route: string) => {
        if (confirm('Are you sure to delete this project?')) {
            router.delete(route, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                },
                onError: () => {
                    closeModal();
                },
            });
        }
    };

    const { url } = usePage();
    const query = Object.fromEntries(new URLSearchParams(url.split('?')[1]));

    const [filters, setFilters] = useState({
        type: query.type || 'all',
        myProjects: query.myProjects || 0,
    });

    useEffect(() => {
        setFilters({
            type: query.type || 'all',
            myProjects: query.myProjects || 0,
        });
    }, [url]);

    const updateFilters = (newValues: Partial<typeof filters>) => {
        const updated = { ...filters, ...newValues };
        setFilters(updated);

        router.get(route('business.index'), updated, {
            preserveState: true,
            preserveScroll: true,
        });
    };


    return (
        <MainLayout className="mx-auto mt-5 flex max-w-[1150px] flex-col gap-5 px-7" breadcrumbs={breadcrumbs}>
            <Head title={'Business'} />

            <div className={'flex items-center'}>
                <div className={'w-[200px]'}>
                    <Select
                        value={filters.type}
                        onValueChange={(value) => updateFilters({ type: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`All`}></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {types.map((el) => (
                                <SelectItem key={el} value={el}>{el}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="ml-auto">
                    {auth.user ? (
                        <div className="flex items-center gap-3">
                            <label htmlFor="myBusinesses" className={'flex w-full cursor-pointer items-center p-2'}>
                                <span>Only my projects</span>
                                &nbsp;&nbsp;
                                <Input
                                    className={'w-[30px] cursor-pointer'}
                                    id="myBusinesses"
                                    type={'checkbox'}
                                    checked={myProjects == 1}
                                    onChange={(e) =>
                                        updateFilters({ myProjects: e.target.checked ? 1 : 0 })
                                    }
                                />
                            </label>
                            <DialogRequestShow myRequests={myRequests} unreadCount={unreadCount}/>
                            <CustomModalForm
                                addButton={BusinessModalFormConfig.addButton}
                                title={mode === 'create_request' ? BusinessModalFormRequest.title : BusinessModalFormConfig.title}
                                description={mode === 'create_request' ? BusinessModalFormRequest.description : BusinessModalFormConfig.description}
                                fields={mode === 'create_request' ? BusinessModalFormRequest.fields : BusinessModalFormConfig.fields}
                                buttons={BusinessModalFormConfig.buttons}
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
                    ) : (
                        <Button disabled>Log in to add a project...</Button>
                    )}
                </div>
            </div>

            <BusinessList
                onEdit={(project) => openModal('edit', project)}
                onCreateRequest={(project) => openModal('create_request', project)}
                businesses={businesses.data}
                onDelete={handleDelete}
            />
            <Pagination products={businesses} rowPerPage={false} />
        </MainLayout>
    );
}

export default Business;
