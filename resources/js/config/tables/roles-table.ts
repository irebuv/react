export const RolesTableConfig = {
    columns: [
        { label: 'Roles Name', key: 'label', className: 'border p-4' },
        { label: 'Description', key: 'description', className: 'border p-4' },
        { label: 'Permissions', key: 'permissions', className: 'border p-4 w-1/3', type: 'multi-values' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye', className: "cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90" },
        { label: 'Edit', icon: 'Pencil', className: "ms-2 cursor-pointer rounded-lg bg-green-600 p-2 text-white hover:opacity-90" },
        { label: 'Delete', icon: 'Trash', route: 'roles.destroy', className: "ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90" },
    ]

}
