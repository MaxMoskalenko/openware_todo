import React from 'react'
import classNames from 'classnames';
import { NewListInput } from 'components/NewListInput'
import { SidebarListTitle } from 'components/SidebarListTitle'

interface SidebarProps {
    lists: any;
    selectedId: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ lists, selectedId }: SidebarProps): JSX.Element => {    
    const [isWrapped, setIsWrapped] = React.useState<boolean>(false);


    const renderExistedLists = React.useMemo(() => {        
        return lists.map((list: any) => {
            return <SidebarListTitle title={list.Name} id={list.Id} isSelected={selectedId == list.Id} key={`list-titile-${list.Id}`} />
        });
    }, [lists, selectedId]);

    return (
        <div className={classNames("h-screen bg-yellow-300", { "w-2/12": !isWrapped, "w-1/36": isWrapped })}>
            {!isWrapped
                ?
                <div className="flex flex-col">
                    <div className="flex flex-col m-4">
                        <img src="/icons/logo-w.svg" alt="Logo" className="w-12 mb-4" />
                        <img src="/icons/arrow-left.svg" alt="Close Sidebar" className="w-6 mt-4 ml-2 cursor-pointer" onClick={() => setIsWrapped(true)} />
                        {renderExistedLists}
                        <NewListInput />
                    </div>
                    <div className="absolute bottom-0 m-4">

                    </div>
                </div >
                :
                <div className="flex flex-col m-4">
                    <img src="/icons/logo-w.svg" alt="Logo" className=" w-12 mb-4 w-full" />
                    <img src="/icons/arrow-right.svg" alt="Open Sidebar" className="w-6 mt-4 ml-2 cursor-pointer" onClick={() => setIsWrapped(false)} />
                    <img src="/icons/list.svg" alt="List icon" className="ml-2 mr-4 w-5 mt-4" />
                    <img src="/icons/plus.svg" alt="Plus icon" className="ml-2 mr-4 w-5 mt-4" />

                </div>
            }
        </div>
    );
}
