import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/components/App/layouts/main-layout';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];
export default function Home() {
    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
        </MainLayout>
    );
}
