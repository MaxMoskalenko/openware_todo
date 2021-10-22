import React from 'react'
import classNames from 'classnames';
import { useRouter } from 'next/dist/client/router';



export const Searchbar: React.FC<{}> = (): JSX.Element => {
    const router = useRouter();
    const handleSignOut = React.useCallback(() => {
        localStorage.clear();
        router.push('/signin');
    }, [])
    return (
        <div className="py-2 pl-3 border-b flex">
            <input type="text" className="h-12 bg-gray-100 w-1/3 pl-3" placeholder="Search" />
            <div className="w-full flex justify-end">
                <img src="/icons/avatar.svg" alt="Avatar" className="justify-self-end mr-3" onClick={handleSignOut} />
            </div>
        </div>
    );
}
