import React, { FC } from 'react'
import { useRouter } from 'next/dist/client/router'
import { Sidebar } from 'components/Sidebar'
import { getLists, getTasks } from 'helpers/axiosRequests'
import { TodoPage } from 'components/TodoPage'
import { Searchbar } from 'components/Searchbar'

export const Layout: FC<{}> = (): JSX.Element => {
    const router = useRouter();
    const [storage, setStorage] = React.useState({ token: '', lists: [], selectedListId: -1, tasks: [] });
    React.useEffect(() => {
        const handleStorageChange = () => {
            setStorage({ 
                token: storage.token, 
                lists: JSON.parse(localStorage.lists || '[]'), 
                selectedListId: localStorage.selectedListId === undefined ? -1 : Number(localStorage.selectedListId) ,
                tasks: JSON.parse(localStorage.tasksForCurrentList || '[]'),
            })
        }

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    })

    React.useEffect(() => {
        if (!localStorage.token || localStorage.token == '')
            router.push('/signin')

        getLists(router);
        setStorage({ 
            token: storage.token, 
            lists: JSON.parse(localStorage.lists || '[]'), 
            selectedListId: localStorage.selectedListId === undefined ? -1 : Number(localStorage.selectedListId) ,
            tasks: JSON.parse(localStorage.tasksForCurrentList || '[]'), 
        })
    }, [storage.token]);

    const getSelectedList = () => {
        for (let i = 0; i < storage.lists.length; i++) {
            if(storage.lists[i].Id == storage.selectedListId){
                return storage.lists[i]
            }
        }
        return {}
    }

    return (
        <div className="h-screen w-full flex overflow-none">
            <Sidebar lists={storage.lists} selectedId={storage.selectedListId} />
            <div className="h-screen w-full flex flex-col">
                <Searchbar />
                {
                    storage.selectedListId != -1
                        ? <TodoPage selectedList={getSelectedList()} tasks={storage.tasks} />
                        : <div className="h-screen w-full flex">
                            <div className="m-auto flex flex-col items-center">
                                <span className="text-yellow-300 text-xl">List not found</span>
                                <span>We can't find the list you're looking for. Select one of your lists from the sidebar or create a new list.</span>
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}
