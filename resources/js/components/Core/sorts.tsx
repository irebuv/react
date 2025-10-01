import type { FiltersProps } from '@/config/types/filters';

interface ExtendFilter extends FiltersProps {
    sort: string;
    direction: 'asc' | 'desc';
}

function Sorts({ options, sort, direction, onChange }: ExtendFilter) {
    const defaultOptions = [
        {
            name: 'Date',
            value: 'updated_at',
        },
        {
            name: 'ID',
            value: 'id',
        },
        {
            name: 'Popular',
            value: 'description',
        },
        {
            name: 'Rating',
            value: 'rating',
        },
        {
            name: 'Alphabet',
            value: 'name',
        },
        {
            name: 'Random',
            value: 'random',
        },
    ];
    const sortBy = options ?? defaultOptions;

    const handleSort = (el: string) => {
        if (el === 'random') {
            onChange({ sort: 'random' });
        }
        const newDirection = sort === el && direction === 'asc' ? 'desc' : 'asc';
        onChange({ sort: el, direction: newDirection });
    };
    return (
        <div className={'p-3'}>
            <div>
                <div className={'border-r-10 border-gray-300 bg-gray-200 px-4 py-2 text-xl'}>Sort BY</div>
                <ul className={'mt-2 cursor-pointer'}>
                    {sortBy.map((el) => {
                        const isActive = el.value === sort;
                        return (
                            <li
                                key={el.name}
                                className={`p-1 hover:bg-gray-300 ${isActive ? 'bg-blue-100 font-bold text-blue-600' : ''}`}
                                onClick={() => handleSort(el.value)}
                            >
                                {el.name}
                                {el.value === sort && sort !== 'random' && <span className="ml-2 text-sm">{direction === 'asc' ? '↑' : '↓'}</span>}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Sorts;
