import { FiltersProps } from '@/config/types/filters';

function AnimeKind({ options }: FiltersProps) {
    const defaultTypes = [
        {
            name: 'TV Series',
            value: 'series',
        },
        {
            name: 'Movie',
            value: 'movie',
        },
        {
            name: 'OVA',
            value: 'ova',
        },
        {
            name: 'ONA',
            value: 'ona',
        },
    ];

    const sortBy = options ?? defaultTypes;

    return (
        <div className={'p-3'}>
            <div>
                <div className={'border-r-10 border-gray-300 bg-gray-200 px-4 py-2 text-xl'}>Type</div>
                <ul className={'mt-2 cursor-pointer'}>
                    {sortBy.map((el) => {
                        return (
                            <li key={el.name} className={`p-1 hover:bg-gray-300 `}>
                                {el.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default AnimeKind;
