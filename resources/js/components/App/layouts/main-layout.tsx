//import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import Header from '@/components/App/Header/Header';
import MainContent from '@/components/App/layouts/app-content';
import HeaderShiki from '@/components/Shiki/Header/HeaderShiki';
import { CustomToast } from '@/components/custom-toast';
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs: BreadcrumbItem[];
    className?: string;
}

export default function MainLayout ({ children, className, breadcrumbs }: AppLayoutProps) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    return (
        <>
            <Header></Header>
            <CustomToast />
            {breadcrumbs[0].title !== 'Business' && (
                <HeaderShiki></HeaderShiki>
            )}
            <div className={className}>
                <MainContent>{children}</MainContent>
            </div>
        </>
    );
}
