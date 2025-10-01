
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

interface CustomTableProps {
    data: Product[];
}

function CustomGalleryTable({ data } : CustomTableProps) {
    return (
        <div className={'grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-8'}>
            {data.length > 0 ? (
                data.map((el) => (
                    <div className={'cursor-pointer'} key={el.id}>
                        <img className={'aspect-[2/3] w-full object-cover'} src={`/storage/${el.featured_image}`} alt={el.name} />
                        <a href={route('show.anime', el.slug)}>{el.name}</a>
                    </div>
                ))
            ) : (
                <span>No data found</span>
            )}
        </div>
    );
}

export default CustomGalleryTable;
