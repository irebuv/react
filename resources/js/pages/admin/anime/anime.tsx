import { CustomTable } from '@/components/custom-table';
import { CustomToast, toast } from '@/components/custom-toast';
import { Button } from '@/components/ui/button';
import { CustomModalForm } from '@/components/ui/custom-modal-form';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { ConfigModalFormAnime } from '@/pages/admin/anime/ConfigModalFormAnime';
import { ConfigTableAnime } from '@/pages/admin/anime/ConfigTableAnime';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import imageCompression from 'browser-image-compression';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import type { FlashProps, IndexProps } from '@/config/types/types-anime';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Anime',
        href: '/admin/anime',
    },
];

function Anime({ anime, filters, totalCount, filteredCount }: IndexProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedAnime, setSelectedAnime] = useState<any>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const { data, setData, errors, processing, reset, post } = useForm({
        name: '',
        description: '',
        featured_image: null as File | null,
        _method: 'POST',
        rating: '',
        files: [],
        search: filters.search || '',
        perPage: filters.perPage || '10',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'edit' && selectedAnime) {
            data._method = 'PUT';
            console.log(data);
            post(route('anime-handles.update', selectedAnime.id), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success || 'Anime updated successfully!';
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to update anime!';
                    toast.error(errorMessage);
                    closeModal();
                },
            });
            reset();
        } else {
            post(route('anime-handles.store'), {
                preserveScroll: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success || 'Anime created successfully!';
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to create anime!';
                    toast.error(errorMessage);
                    closeModal();
                },
            });
        }
    };
    const closeModal = () => {
        setMode('create');
        setPreviewImage(null);
        setSelectedAnime(null);
        setPreviewUrls([]);
        setModalOpen(false);
        reset('name', 'description', 'featured_image', '_method', 'rating', 'files');
    };
    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('anime-handles.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    const handleModalToggle = (open: boolean) => {
        setModalOpen(open);

        if (!open) {
            setMode('create');
            setPreviewImage(null);
            setSelectedAnime(null);
            reset();
        }
    };
    const openModal = (mode: 'create' | 'view' | 'edit', anim?: any) => {
        setMode(mode);

        reset();
        if (anim) {
            Object.entries(anim).forEach(([key, value]) => {
                if (key === 'featured_image' || key === 'files') {
                    value = null;
                }
                if (key === 'search'){
                    return;
                }
                setData(key as keyof typeof data, value as string | null);
            });
            setPreviewImage(anim.featured_image);
            setSelectedAnime(anim);
            setPreviewUrls([]);
        } else {
            reset();
        }

        setModalOpen(true);
    };
    console.log('data', data);
    const compressAndSetFiles = async (files: File[]) => {
        const compressedFiles: File[] = [];

        const previews: (string | null)[] = [];

        for (const [index, file] of files.entries()) {
            let finalFile = file;

            // If the file is type of image
            if (file.type.startsWith('image/')) {
                finalFile = await imageCompression(file, {
                    maxSize: 3,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                });

                previews[index] = URL.createObjectURL(finalFile);
            } else {
                previews[index] = null;
            }

            compressedFiles.push(finalFile);
        }

        setData('files', compressedFiles);
        setPreviewUrls(previews);
    };

    // Handle change function
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ?? []);
        await compressAndSetFiles(selectedFiles);
    };
    const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const selectedFiles = Array.from(e.dataTransfer.files ?? []);
        await compressAndSetFiles(selectedFiles);
    };

    const handleRemove = (index: number) => {
        const updatedFiles = [...data.files];
        const updatedPreviews = [...previewUrls];

        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setData('files', updatedFiles);
        setPreviewUrls(updatedPreviews);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        const queryString = {
            ...(value && { search: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('anime-handles.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData('search', '');
        setData('perPage', '10');

        router.get(
            route('anime-handles.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };
    const handleDelete = (id: number, route: string) => {
        router.delete(route, {
            preserveScroll: true,
            onSuccess: (response: { props: FlashProps }) => {
                const successMessage = response.props.flash?.success || 'Anime deleted successfully!';
                toast.success(successMessage);
                closeModal();
            },
            onError: (error: Record<string, string>) => {
                const errorMessage = error?.message || 'Failed to delete anime!';

                toast.error(errorMessage);
                closeModal();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} className={'pb-5'}>
            <Head title="Manage Anime" />
            <CustomToast />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Input onChange={handleChange} value={data.search} type="text" className="h-10 w-1/4" placeholder="Search product" />
                    <Button onClick={handleReset} className="ms-2 h-10 cursor-pointer bg-red-400 hover:bg-red-500">
                        <XIcon size={20} />
                    </Button>
                    <div className="ml-auto">
                        <CustomModalForm
                            addButton={ConfigModalFormAnime.addButton}
                            title={mode === 'view' ? 'View Category' : mode === 'edit' ? 'Update Anime' : ConfigModalFormAnime.title}
                            description={ConfigModalFormAnime.description}
                            fields={ConfigModalFormAnime.fields}
                            buttons={ConfigModalFormAnime.buttons}
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            handleSubmit={handleSubmit}
                            open={modalOpen}
                            onOpenChange={handleModalToggle}
                            mode={mode}
                            previewImage={previewImage}
                            previewUrls={previewUrls}
                            handleFileChange={handleFileChange}
                            handleDrop={handleDrop}
                            handleRemove={handleRemove}
                        />
                    </div>
                </div>

                <CustomTable
                    columns={ConfigTableAnime.columns}
                    actions={ConfigTableAnime.actions}
                    data={anime.data}
                    from={anime.from}
                    onDelete={handleDelete}
                    onView={(anim) => openModal('view', anim)}
                    onEdit={(anim) => openModal('edit', anim)}
                    isModal={true}
                />
                <Pagination
                    products={anime}
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

export default Anime;
