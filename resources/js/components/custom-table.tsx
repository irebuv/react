/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { hasPermission } from '@/utils/authorization';
import { Link, usePage } from '@inertiajs/react';
import * as LucidIcons from 'lucide-react';
import { route } from 'ziggy-js';

interface TableColumn {
    label: string;
    key: string;
    isImage?: boolean;
    isAction?: boolean;
    isGallery?: boolean;
    className?: string;
    type?: string;
}

interface ActionConfig {
    label: string;
    icon: keyof typeof LucidIcons;
    route: string;
    className?: string;
    permission?: string;
}

interface TableRow {
    [key: string]: any;
}

interface CustomTableProps {
    columns: TableColumn[];
    actions: ActionConfig[];
    data: TableRow[];
    from: number;
    onDelete: (id: number, route: string) => void;
    onView: (row: TableRow) => void;
    onEdit: (row: TableRow) => void;
    isModal: boolean;
}

export const CustomTable = ({ columns, actions, data, from, onDelete, onView, onEdit, isModal }: CustomTableProps) => {
    const { auth } = usePage().props as any;
    const roles = auth.roles;
    const permissions = auth.permissions;
    const renderActionButtons = (row: TableRow) => {
        return (
            <div className="flex justify-center">
                {actions.map((action, index) => {
                    if (action.permission && !hasPermission(permissions, action.permission)) {
                        return null;
                    }

                    const IconComponent = LucidIcons[action.icon] as React.ElementType;

                    if (isModal) {
                        if (action.label === 'View') {
                            return (
                                <Button key={index} className={action.className} onClick={() => onView?.(row)}>
                                    <IconComponent size={18} />
                                </Button>
                            );
                        }

                        if (action.label === 'Edit') {
                            return (
                                <Button key={index} className={action.className} onClick={() => onEdit?.(row)}>
                                    <IconComponent size={18} />
                                </Button>
                            );
                        }
                    }

                    if (action.label === 'Delete') {
                        return (
                            <Button key={index} className={action.className} onClick={() => onDelete(row.id, route(action.route, row.id))}>
                                <IconComponent size={18} />
                            </Button>
                        );
                    }

                    return (
                        <Link key={index} as="button" href={route(action.route, row.id)} className={action.className}>
                            <IconComponent size={18} />f
                        </Link>
                    );
                })}
            </div>
        );
    };
    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-black bg-gray-700 text-white">
                        <th className="border p-4">#</th>
                        {columns.map((column, index) => (
                            <th key={column.key} className={column.className}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr key={index}>
                                <td className={`border px-4 py-2 text-center`}>{from + index}</td>
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`border px-4 py-2 text-center ${col.className} ${row.files !== null && col.isGallery && 'w-1/4'}`}
                                    >
                                        {col.isImage ? (
                                            <div className="flex justify-center">
                                                {row[col.key] !== null ? (
                                                    <img width="100" src={`/storage/${row[col.key]}`} alt={row.name || 'Image'} />
                                                ) : (
                                                    <img width="100" src={`/storage/images/no-image.png`} alt={row.name || 'Image'} />
                                                )}
                                            </div>
                                        ) : col.isAction ? (
                                            renderActionButtons(row)
                                        ) : col.type === 'multi-values' && Array.isArray(row[col.key]) ? (
                                            <div className="flex flex-wrap items-center justify-center gap-2">
                                                {row[col.key].map((permission: any) => (
                                                    <Badge
                                                        className="bg-indigo-100 px-3 py-0.5 text-indigo-700"
                                                        key={permission.id}
                                                        variant="outline"
                                                    >
                                                        {permission.label || permission.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : col.isGallery ? (
                                            <div
                                                className={`col-auto flex items-center justify-center justify-items-center gap-3 py-2 ${row.files !== null && row.files.length > 3 && 'grid grid-cols-4'}`}
                                            >
                                                {row.files !== null ? (
                                                    row.files.map((file) => (
                                                        <img
                                                            className="p-1 shadow"
                                                            key={file}
                                                            width="80"
                                                            src={`/storage/${file}`}
                                                            alt={row.name || 'Image'}
                                                        />
                                                    ))
                                                ) : (
                                                    <span className="text-sm">There aren't any images in this product...</span>
                                                )}
                                            </div>
                                        ) : (
                                            row[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="py-4 text-center font-bold text-red-800">
                                No data found!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
