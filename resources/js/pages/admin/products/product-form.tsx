import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Upload, X } from 'lucide-react';
import { useState } from 'react';
//import imageCompression from './../../../../../node_modules/browser-image-compression/dist/browser-image-compression.d';
import imageCompression from 'browser-image-compression';

export default function ProductForm({ ...props }) {
    const { product, isView, isEdit } = props;
    const [previewUrls, setPreviewUrls] = useState<string | null>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Product`,
            href: route('products.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<{ files: File[] }>({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        featured_image: null as File | null,
        _method: isEdit ? 'PUT' : 'POST',
        files: [],
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            post(route('products.update', product.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('featured_image', e.target.files[0]);
        }
    };

    // Handle file compress
    const compressAndSetFiles = async (files: File[]) => {
        const compressedFiles: File[] = [];

        const previews: (string | null)[] = [];

        for (const [index, file] of files.entries()) {
            let finalFile = file;

            // If the file is type of image
            if (file.type.startsWith('image/')) {
                finalFile = await imageCompression(file, {
                    maxSize: 1,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true,
                });

                console.log(finalFile);
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

        // setData('files', selectedFiles);

        // //Calling preview files
        // previewFiles(selectedFiles);
    };

    // Handle drop function
    const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const selectedFiles = Array.from(e.dataTransfer.files ?? []);

        await compressAndSetFiles(selectedFiles);

        // setData('files', selectedFiles);

        // //Calling preview files
        // previewFiles(selectedFiles);
    };

    //File preview
    // const previewFiles = (files: File[]) => {
    //     const previews: string[] = [];

    //     files.forEach((file, index) => {
    //         if (file.type.startsWith('image/')) {
    //             const reader = new FileReader();

    //             reader.onloadend = () => {
    //                 previews[index] = reader.result as string;

    //                 if (previews.length === files.length) {
    //                     setPreviewUrls([...previews]);
    //                 }
    //             };
    //             reader.readAsDataURL(file);
    //         } else {
    //             previews[index] = '';
    //             if (previews.length === files.length) {
    //                 setPreviewUrls([...previews]);
    //             }
    //         }

    //         setPreviewUrls(previews);
    //     });
    // };

    // Handle Remove
    const handleRemove = (index: number) => {
        const updatedFiles = [...data.files];
        const updatedPreviews = [...previewUrls];

        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setData('files', updatedFiles);
        setPreviewUrls(updatedPreviews);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        href={route('products.index')}
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-500 px-4 py-2 text-white hover:opacity-90"
                    >
                        <ArrowLeft className="me-2" />
                        Back to Products
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="grid gap-6">
                                <div className="mt-4 grid gap-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Product Name"
                                        autoFocus
                                        tabIndex={1}
                                        disabled={isView || processing}
                                    />

                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <CustomTextarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        id="description"
                                        name="description"
                                        placeholder="Product description"
                                        autoFocus
                                        tabIndex={2}
                                        rows={4}
                                        disabled={isView || processing}
                                    />

                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="price">Product Price</Label>
                                    <Input
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        id="price"
                                        name="price"
                                        type="text"
                                        placeholder="Product price"
                                        autoFocus
                                        tabIndex={3}
                                        disabled={isView || processing}
                                    />

                                    <InputError message={errors.price} />
                                </div>

                                {!isView && (
                                    <div className="mx-auto mt-10 w-4xl rounded-md p-10 shadow-md">
                                        <label
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleDrop}
                                            htmlFor="dropzone"
                                            className="flex h-60 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 bg-gray-50 transition hover:bg-gray-100"
                                        >
                                            <input onChange={handleFileChange} type="file" id="dropzone" multiple className="hidden" />
                                            <Upload className="h-16 w-16" />
                                            <p className="my-2 text-sm text-gray-600">
                                                <span className="semi-bold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-400">Any file type (max 10MB each)</p>
                                        </label>

                                        <InputError message={errors.files} />
                                        {errors.files && <p>{errors.files}</p>}
                                        {/* For non images - files */}
                                        {data.files.some((_, index) => !previewUrls[index]) && (
                                            <div className="mt-3 grid grid-cols-1 gap-2">
                                                {data.files.map((file, index) =>
                                                    !previewUrls[index] ? (
                                                        <div
                                                            key={index}
                                                            className="relative flex flex-col items-center rounded-md border border-gray-300 bg-white p-2 shadow-md"
                                                        >
                                                            {/* Button to remove selected image */}
                                                            <button
                                                                type="button"
                                                                className="top-1.6 absolute right-1 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                                                onClick={() => handleRemove(index)}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                            <span>{file.name}</span>
                                                        </div>
                                                    ) : null,
                                                )}
                                            </div>
                                        )}

                                        {/* file preview */}
                                        {previewUrls.some((url) => url) && (
                                            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                {data.files.map((file, index) =>
                                                    previewUrls[index] ? (
                                                        <div
                                                            key={index}
                                                            className="relative flex flex-col items-center rounded-md border border-gray-300 bg-white p-2 shadow-md"
                                                        >
                                                            {/* Button to remove selected image */}
                                                            <button
                                                                type="button"
                                                                className="absolute top-1 right-1 cursor-pointer rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                                                onClick={() => handleRemove(index)}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                            <img
                                                                src={previewUrls[index] as string}
                                                                alt={`preview-${index}`}
                                                                className="h-32 w-32 rounded-md object-cover"
                                                            />
                                                        </div>
                                                    ) : null,
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!isView && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="featured_image">Featured Image</Label>
                                        <Input
                                            onChange={handleFileUpload}
                                            className="w-fit cursor-pointer"
                                            id="featured_image"
                                            name="featured_image"
                                            type="file"
                                            placeholder="Product featured_image"
                                            autoFocus
                                            tabIndex={4}
                                        />

                                        <InputError message={errors.featured_image} />
                                    </div>
                                )}

                                {isView ||
                                    (isEdit && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="featured_image">Current Featured Image</Label>
                                            <img
                                                src={`/storage/${product.featured_image}`}
                                                alt="Featured Image"
                                                className="h-40 w-50 rounded-lg border"
                                            />
                                        </div>
                                    ))}

                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer" tabIndex={5}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Create'} Product
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
