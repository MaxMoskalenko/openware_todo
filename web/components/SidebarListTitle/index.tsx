import React from 'react'
import classNames from 'classnames';
import { deleteLists, getTasks } from 'helpers/axiosRequests';
import { useRouter } from 'next/dist/client/router';

interface SidebarListTitleProps {
    title: string;
    id: number;
    isSelected: boolean;
}

export const SidebarListTitle: React.FC<SidebarListTitleProps> = (
    {
        title,
        id,
        isSelected
    }: SidebarListTitleProps): JSX.Element => {
    const router = useRouter();

    const handleDeletionOfList = React.useCallback(() => {
        if(isSelected){            
            localStorage.setItem('selectedListId', String(-1));
        }
        deleteLists(id, router);
    }, [isSelected]);

    const handleSelection = React.useCallback(() => {        
        localStorage.setItem('selectedListId', String(id));
        getTasks(id, router);
        window.dispatchEvent( new Event('storage') );
    }, [])

    return (
        <div className={classNames("w-full flex mt-4", { "bg-yellow-200": isSelected })}>
            <img
                src="/icons/list.svg"
                alt="List icon"
                className="ml-2 mr-4 w-5"
            />
            <span className="w-10/12 cursor-pointer" onClick={handleSelection}>{title}</span>
            <img
                src="/icons/trash.svg"
                alt="Trash icon"
                className="mr-2 cursor-pointer w-5"
                onClick={handleDeletionOfList}
            />
        </div>
    );
}
