import React from 'react'
import classNames from 'classnames';

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

    const handleDeletionOfList = React.useCallback(() => {
        console.log('Deleted list:', id);
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
