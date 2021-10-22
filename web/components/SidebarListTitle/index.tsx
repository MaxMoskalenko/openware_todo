import React from 'react'
import classNames from 'classnames';
import { deleteLists } from 'helpers/axiosRequests';
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
        deleteLists(id, router)
    }, []);

    return (
        <div className={classNames("w-full flex mt-4", { "bg-yellow-200": isSelected })}>
            <img
                src="/icons/list.svg"
                alt="List icon"
                className="ml-2 mr-4 w-5"
            />
            <span className="w-10/12">{title}</span>
            <img
                src="/icons/trash.svg"
                alt="Trash icon"
                className="mr-2 cursor-pointer w-5"
                onClick={handleDeletionOfList}
            />
        </div>
    );
}
