import React, { useEffect, FC } from 'react'
import { useRouter } from 'next/dist/client/router'
import { Sidebar } from 'components/Sidebar'

export const Layout: FC<{}> = (): JSX.Element => {
    const router = useRouter();
    return (
        <div className="h-screen w-full flex">
            <Sidebar/>
            content
        </div>
    );
}
