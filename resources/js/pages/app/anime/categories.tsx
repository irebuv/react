import CustomGalleryTable from '@/components/App/custom-gallery-table';
import MainLayout from '@/components/App/layouts/main-layout';
import { AppPagination } from '@/components/Core/app-pagination';
import Sorts from '@/components/Core/sorts';
import type { IndexProps } from '@/config/types/types-anime';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AnimeKind from '@/components/Core/anime-kind';
import Filters from '@/components/Core/filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Anime',
        href: '/anime',
    },
];
export default function Categories({ anime, totalCount, filteredCount, sort, direction, filters, query }: IndexProps) {

    const updateQuery = (newParams: Record<string, any>)=> {
        router.get(
            'anime',
            { ...query, ...newParams },
            { preserveState: true, replace: true, preserveScroll: true, }
        )
        console.log(query)
    }
    return (
        <MainLayout className="mx-auto flex flex-col gap-5 px-7" breadcrumbs={breadcrumbs}>
            <Head title={'Anime'} />
            <div className={'grid grid-cols-5 gap-3'}>
                <div>
                    <Sorts sort={sort ?? "id"} direction={direction ?? "desc"} onChange={updateQuery} />
                    <AnimeKind onChange={updateQuery} />
                    <Filters filters={filters} query={query ?? {}} onChange={updateQuery} />
                </div>
                <div className={'col-span-4 mt-3'}>
                    <div className={'mb-5 grid grid-cols-3 items-center justify-between'}>
                        <div>Home / Anime</div>
                        <h2 className={'mb-1 text-center text-2xl font-bold'}>Anime</h2>
                        {sort !== 'random' && (
                            <div className={`justify-self-end`}>
                                <AppPagination items={anime} totalCount={totalCount} filteredCount={filteredCount} />
                            </div>
                        )}
                    </div>
                    <CustomGalleryTable data={anime.data} />
                </div>
            </div>
        </MainLayout>
    );
}
