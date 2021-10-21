import React from 'react'
import { useRouter } from 'next/dist/client/router'
import classNames from 'classnames';
import data from 'data'
import { NewListInput } from 'components/NewListInput'
import { SidebarListTitle } from 'components/SidebarListTitle'


export const Sidebar: React.FC<{}> = (): JSX.Element => {
    const router = useRouter();
    const [isWrapped, setIsWrapped] = React.useState<boolean>(false);

    const renderExistedLists = React.useMemo(() => {
        return data.lists.map((list) => {
            return <SidebarListTitle title={list.name} id={list.id} isSelected={data.selectedList?.id == list.id} key={`list-titile-${list.id}`} />
        });
    }, [data]);

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
