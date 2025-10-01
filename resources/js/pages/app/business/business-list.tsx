import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { Pen, Trash } from 'lucide-react';
import { route } from 'ziggy-js';

interface User {
    phone: string;
}
interface Business {
    id: number;
    user_id: number;
    image: string;
    name: string;
    type: string;
    description: string;
    user: User;
}

interface BusinessProps {
    onDelete: (id: number, route: string) => void;
    onCreateRequest: (project: Business) => void;
    onEdit: (project: Business) => void;
    businesses: Business[];
}
function BusinessList({ businesses, onEdit, onDelete, onCreateRequest }: BusinessProps) {
    const {auth} = usePage().props as any;
    return (
        <div className={'grid gap-8 sm:grid-cols-1 md:grid-cols-2'}>
            {businesses.map((el) => (
                <div key={el.id} className={`grid p-3 shadow shadow-blue-100 ${auth.user?.id === el.user_id && 'bg-sky-50'}`}>
                    <div className={'flex columns-2 gap-3'}>
                        {el.image && <img src={`storage/${el.image}`} alt={el.image} className={'aspect-square w-1/3 object-contain'} />}
                        <div className={`flex flex-col ${el.image ? 'w-2/3' : 'w-full'}`}>
                            <h4 className={'mb-2 text-center'}>
                                <b>{el.name}</b>
                            </h4>
                            <p>{el.description}</p>
                            <div className={'self-end mt-auto'}>
                                <b>{el.user?.phone}</b>
                            </div>
                        </div>
                    </div>
                    <div className={`mt-2 flex w-full justify-between self-end`}>
                        <div className="flex items-center gap-1">
                            {auth.user?.id === el.user_id && (
                                <div>
                                    <Button variant={'ghost'} className={'cursor-pointer'} onClick={() => onEdit?.(el)}>
                                        <Pen />
                                    </Button>
                                    <Button
                                        variant={'ghost'}
                                        className={'cursor-pointer'}
                                        onClick={() => onDelete(el.id, route('business.destroy', el.id))}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            )}
                            <span>
                                Type: <b>{el.type}</b>
                            </span>
                        </div>
                            <div>
                                <Button variant={'outline'} className={'cursor-pointer'} onClick={() => onCreateRequest?.(el)}>
                                    create a request
                                </Button>
                            </div>

                    </div>
                </div>
            ))}
        </div>
    );
}

export default BusinessList;
