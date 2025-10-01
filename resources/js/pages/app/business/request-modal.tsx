import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import RequestItem from '@/pages/app/business/request-item';
import { router } from '@inertiajs/react';

interface Order {
    id: string;
    name: string;
    is_read: boolean;
    phone: string;
    date: string;
    business_name: string;
    business_image: string;
    description: string;
}
interface FormProps {
    unreadCount: number;
    myRequests: Order[];
}
const DialogRequestShow = ({ myRequests, unreadCount }: FormProps) => (
    <Dialog
        onOpenChange={(open) => {
            if (open) {
                router.post(
                    route('business.markAsRead'),
                    {},
                    {
                        preserveScroll: true,
                        preserveState: true,
                    },
                );
            }
        }}
    >
        <DialogTrigger asChild>
            <Button variant={'outline'} className={'relative mr-1 cursor-pointer'}>
                my requests
                {unreadCount > 0 && (
                    <div className="absolute -top-2.5 -right-2.5 rounded-full bg-orange-500 px-2.5 py-1 text-white">
                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </div>
                )}
            </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90%] overflow-y-hidden sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%]">
            <DialogHeader>
                <DialogTitle>My Requests</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            {myRequests.length > 0 ? myRequests.map((el) => <RequestItem key={el.id} el={el} />) : <span>There's no requests here yet...</span>}
            <DialogFooter className={''}>
                <DialogClose asChild>
                    <Button className="cursor-pointer">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default DialogRequestShow;
