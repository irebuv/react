/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from './../input-error';
import { Select } from '@/components/ui/select';
import { SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { usePage } from '@inertiajs/react';
import { hasPermission } from "@/utils/authorization";
import { Upload } from 'lucide-react';
import React, { useState } from 'react';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import FilePreview from '@/components/Core/file-preview';
import { format } from "date-fns";

interface AddButtonProps {
    id: string;
    label: string;
    className: string;
    icon: React.ComponentType<any>;
    type: 'reset' | 'button' | 'submit' | undefined;
    variant: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | undefined;
    permission?: string;
}

interface FieldProps {
    id: string;
    key: string;
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    autocomplete?: string;
    tabIndex: number;
    autoFocus?: boolean;
    rows?: number;
    accept?: string;
    className?: string;
    options?: {label: string, value: string, key: string}[];
}

interface ButtonProps {
    key: string;
    type: 'button' | 'submit' | 'reset' | undefined;
    label: string;
    variant: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | undefined;
    className?: string;
}

interface Permissions {
    id: number;
    module: string;
    name: string;
    label: string;
    description: string;
}

interface FieldOptions {
    key: string;
    label: string;
    value: string;
}

interface ExtraData {
    [module: string]: Permissions[];
}

interface CustomModalFormProps {
    addButton: AddButtonProps;
    title: string;
    description: string;
    fields: FieldProps[];
    buttons: ButtonProps[];
    data: Record<string, any>;
    setData: (name: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (data: any) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'view' | 'edit' | 'create_request';
    previewImage?: string | null;
    extraData: ExtraData;
    previewUrls?: [];
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDrop: (e: React.DragEvent<HTMLLabelElement>) => Promise<void>;
    handleRemove: (index: number) => void;
}

export const CustomModalForm = ({
    addButton,
    title,
    description,
    fields,
    buttons,
    data,
    setData,
    processing,
    errors,
    handleSubmit,
    open,
    onOpenChange,
    mode = 'create',
    previewImage,
    extraData,
    previewUrls,
    handleFileChange,
    handleDrop,
    handleRemove,
}: CustomModalFormProps) => {
    const {auth} = usePage().props as any;
    const roles = auth.roles;
    const permissions = auth.permissions;
    const [selectedDate, setSelectedDate] = useState<Date>();



  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <form>
        {(addButton.permission === undefined || (addButton.permission && hasPermission(permissions, addButton.permission))) && (
            <DialogTrigger asChild>
            <Button  type={addButton.type} id={addButton.id} variant={addButton.variant} className={addButton.className}>
                {addButton.icon && <addButton.icon />}{addButton.label}
                </Button>
            </DialogTrigger>
        )}
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="sm:max-w-[830px] max-h-[90%] overflow-y-hidden"
            >
                  <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                  </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col overflow-y-hidden">
                      <div className="grid gap-6 overflow-y-auto h-[100%] px-2">
                            { fields.map((field) => (
                                <div key={field.key} className="grid gap-2">
                                    <Label htmlFor={field.id}>{field.label}</Label>

                                    { field.type === 'textarea' ? (
                                        <textarea
                                            id={field.id}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            rows={field.rows}
                                            autoComplete={field.autocomplete}
                                            tabIndex={field.tabIndex}
                                            className={field.className}
                                            onChange={(e) => setData(field.name, e.target.value)}
                                            value={data[field.name] || ''}
                                            disabled={processing || mode === 'view'}
                                        />
                                    ) : (field.type === 'file' && field.name !== 'files') ? (

                                        <div className="space-y-2">
                                            {mode !== 'create' && previewImage &&
                                                <img width="100" src={`/storage/${previewImage}`} alt={data?.[field.key]} />
                                            }

                                            {mode !== 'view' && (
                                                <Input
                                                    id={field.id}
                                                    name={field.name}
                                                    tabIndex={field.tabIndex}
                                                    type='file'
                                                    accept={field.accept}
                                                    onChange={(e) => setData(field.name, e.target.files ? e.target.files[0] : null)}
                                                    disabled={processing}

                                                />
                                            )}
                                        </div>
                                    ) : field.type === 'files' ? (
                                        <div className="mx-auto mt-5 w-full rounded-md p-10 shadow-md">
                                            <label
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleDrop}
                                                htmlFor="dropzone"
                                                className="flex h-60 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 bg-gray-50 transition hover:bg-gray-100"
                                            >
                                                <input
                                                    onChange={handleFileChange}
                                                    type="file" id="dropzone"
                                                    multiple className="hidden"
                                                    disabled={processing || mode === 'view'}
                                                />
                                                <Upload className="h-16 w-16" />
                                                <p className="my-2 text-sm text-gray-600">
                                                    <span className="semi-bold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-400">Any file type (max 10MB each)</p>
                                            </label>

                                            <InputError message={errors.files} />
                                            {errors.files && <p>{errors.files}</p>}
                                            <FilePreview
                                                files={data.files}
                                                previewUrls={previewUrls}
                                                onRemove={handleRemove}
                                            />

                                        </div>
                                    ) : field.type === 'single-select' ? (
                                        <Select disabled={processing || mode === 'view'} value={data[field.name]  || ''} onValueChange={(value) => setData(field.name, value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Select ${field.label}`}></SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                            {(field.options?.length ? field.options : (extraData?.[field.key] || []).map((item: any) => ({
                                                key: item.id,
                                                value: item.name,
                                                label: item.label,
                                            }
                                            )))?.map((option: FieldOptions) => (
                                                <SelectItem value={option.value} key={option.key}>{option.label}</SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                    ) : field.type === 'grouped-checkboxes' ? (
                                        <div className='space-y-2'>
                                            {extraData && Object.entries(extraData).map(([module, permissions]) => (
                                                <div key={module} className='mb-4 border-b pb-5'>
                                                    <h4 className='capitalize text-sm font-bold text-gray-700'>{module}</h4>

                                                    <div className='ms-2 mt-2 grid grid-cols-3'>
                                                        {permissions.map((permission) => (
                                                            <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                                                                <input type="checkbox"
                                                                name={field.name}
                                                                disabled={processing || mode === "view"}
                                                                value={permission.name}
                                                                checked={data.permissions.includes(permission.name)}
                                                                onChange={(e) => {
                                                                         const value = permission.name;
                                                                         const current = data.permissions || [];

                                                                         if (e.target.checked) {
                                                                            setData('permissions', [...current, value]);
                                                                         } else {
                                                                            setData('permissions', current.filter((permission: string) => permission !== value));
                                                                         }
                                                                    }}/>
                                                                <span>{permission.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : field.type === 'date-select' ? (
                                        <div className="flex flex-col">
                                            <DayPicker
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={(date) => {
                                                    setSelectedDate(date);
                                                    if (date) {
                                                        setData(field.name, format(date, "yyyy-MM-dd"));
                                                    } else {
                                                        setData(field.name, '');
                                                    }
                                                }}
                                                className={'shadow-blue-500 shadow p-3 max-w-max min-h-[372px] border-2'}
                                            />
                                            <p className="mt-2 text-sm text-gray-600 min-h-[20px]">
                                            {selectedDate ? (
                                                    <span>You picked {selectedDate.toDateString()}</span>
                                            ) : (
                                                <span>Please chose a date!</span>
                                            )}
                                            </p>
                                        </div>
                                    ) : (
                                        <Input
                                            id={field.id}
                                            name={field.name}
                                            tabIndex={field.tabIndex}
                                            type={field.type}
                                            accept={field.accept}
                                            placeholder={field.placeholder}
                                            autoComplete={field.autocomplete}
                                            autoFocus={field.autoFocus}
                                            onChange={(e) => setData(field.name, e.target.value)}
                                            value={data[field.name] || ''}
                                            disabled={processing || mode === 'view'}
                                        />
                                    )}

                                    <InputError message={errors?.[field.name]} />

                                </div>
                            )) }
                      </div>
                      <DialogFooter>
                        {buttons.map((button) => {
                            if (button.key === 'cancel') {
                                return (
                                    <DialogClose asChild key={button.key}>
                                        <Button
                                            key={button.key}
                                            type={button.type}
                                            variant={button.variant}
                                            className={button.className}
                                        >
                                            {button.label}
                                        </Button>
                                    </DialogClose>
                                );
                            } else if(mode !== 'view'){
                                return (
                                    <Button
                                        key={button.key}
                                        type={button.type}
                                        variant={button.variant}
                                        className={button.className}
                                    >
                                        {button.label}
                                    </Button>
                                );
                            }
                        })}
                      </DialogFooter>
                </form>
            </DialogContent>
      </form>
    </Dialog>
  )
}
