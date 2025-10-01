export const ProductTableConfig = {
    columns: [
        { label: 'Featured Image', key: 'featured_image', isImage: true, className: 'border p-4' },
        { label: 'Gallery', key: 'gallery', isGallery: true, className: 'border p-4' },
        { label: 'Product Name', key: 'name', className: 'border w-90 p-4' },
        { label: 'Description', key: 'description', className: 'border p-4 w-1/3' },
        { label: 'Price', key: 'price', className: 'border p-4' },
        { label: 'Created Date', key: 'created_at', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye', route: 'products.show', className: "cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90" },
        { label: 'Edit', icon: 'Pencil', route: 'products.edit', className: "ms-2 cursor-pointer rounded-lg bg-green-600 p-2 text-white hover:opacity-90" },
        { label: 'Delete', icon: 'Trash', route: 'products.destroy', className: "ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90" },
    ]

}
