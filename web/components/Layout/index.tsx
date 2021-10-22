import React, { useEffect, FC } from 'react'
import { useRouter } from 'next/dist/client/router'
import { Sidebar } from 'components/Sidebar'
import { instance as axios } from 'helpers/axios'
import { getLists } from 'helpers/axiosRequests'
export const Layout: FC<{}> = (): JSX.Element => {
    const router = useRouter();
    const [storage, setStorage] = React.useState({ token: '', lists: [] });

    React.useEffect(() => {
        const handleStorageChange = () => {
            setStorage({ token: storage.token, lists: JSON.parse(localStorage.lists) })
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
        setStorage({ token: storage.token, lists: JSON.parse(localStorage.lists) })
    }, [storage.token]);


    // const sidebarWithLists= React.useMemo(()=>{
    //     return 
    // }, [storage.lists]);

    return (
        <div className="h-screen w-full flex">
            <Sidebar lists={storage.lists} />
            content
        </div>
    );
}
