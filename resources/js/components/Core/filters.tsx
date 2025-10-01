import type { FiltersProps } from '@/config/types/filters';
interface Filter {
    id:  string;
    title: string;
}
interface FiltersResponse {
    [group: string]: Filter[];
}
interface ExtendFilter extends FiltersProps {
    query: { filters?: string[] };
    filters: FiltersResponse | undefined;
}
function Filters({ filters, query, onChange }: ExtendFilter) {
    const selected = query.filters || [];

    const toggleFilter = (id:  string) => {
        const idStr = String(id);
        const newValues = selected.includes(idStr)
            ? selected.filter(x => x !== idStr)
            : [...selected, idStr];

        onChange({ filters: newValues });
    };

    return (
        <div className={'p-3'}>
            {filters && Object.entries(filters).map(([key, items]) => (
                <div key={key} className={'current-filter'}>
                    <div className={'border-r-10 border-gray-300 bg-gray-200 px-4 py-2 text-xl'}>{key}</div>
                    <ul className={'mt-2 cursor-pointer'}>
                        {items.map((el) => {
                            return (
                                <label htmlFor={`${el.id}`} key={el.id} className={`flex w-full cursor-pointer items-center p-2 hover:bg-gray-300`}>
                                    <input
                                        id={`${el.id}`}
                                        type="checkbox"
                                        checked={selected.includes(String(el.id))}
                                        onChange={() => toggleFilter(el.id)}
                                    />
                                    &nbsp;&nbsp;
                                    <span>{el.title}</span>
                                </label>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default Filters;
