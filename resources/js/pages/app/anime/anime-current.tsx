
import MainLayout from '@/components/App/layouts/main-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    featured_image: string;
    featured_image_original_name: string;
    created_at: string;
}


interface IndexProps {
    anime: Product;
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Products',
        href: '/categories',
    },
];

export default function Categories({anime} : IndexProps) {
    console.log(anime)
    return (
        <MainLayout className='max-w-[1180px] mx-auto flex gap-4 flex-col' breadcrumbs={breadcrumbs}>
            <Head title={anime.slug}/>
            <div>
                <h2 className={'font-bold mb-1'}>Anime</h2>
                <p>
                    This page contains anime sorted by ranking
                </p>
            </div>
            <div>
                <img src={`/storage/${anime.featured_image}`} alt={anime.slug} />
            </div>
        </MainLayout>
    );
}
