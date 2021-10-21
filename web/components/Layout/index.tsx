import React, { useEffect, FC } from 'react'
import { useRouter } from 'next/dist/client/router'
import { Sidebar } from 'components/Sidebar'
import { instance as axios } from 'helpers/axios'
export const Layout: FC<{}> = (): JSX.Element => {
    const router = useRouter();
    React.useEffect(() => {
        //TODO add listeners to local storage
        if (!localStorage.token)
            router.push('/signin')

        axios()
            .get('/user/lists', {
                headers: {
                    'Authorization': `Bearer ${localStorage.token}`
                }
            })
            .then((r: any) => {
                localStorage.setItem('lists', JSON.stringify(r.data))
            })
            .catch((e) => {
                if (e.response)
                    alert(e.response.data)
                else
                    console.log(e);
            });
    })
    return (
        <div className="h-screen w-full flex">
            <Sidebar/>
            content
        </div>
    );
}
