import React, { useEffect, FC } from 'react'
import { useRouter } from 'next/dist/client/router'

export const SignUp: FC<{}> = (): JSX.Element => {
    const router = useRouter();
    return (
        <div className="h-1/3 w-1/4 bg-white z-20 m-auto shadow-md flex flex-col p-10">
            <div className="flex">
                <img src="/icons/logo.svg" alt="Logo" />
                <span className="text-gray-500 text-2xl ml-1">Todo</span>
            </div>
            <span className="text-lg mt-2">Sign up</span>
            <input type="email" placeholder="Email" className="border-b border-gray-300 pt-2 focus:border-yellow-300 focus:outline-none placeholder-gray-300" />
            <input type="password" placeholder="Password" className="border-b border-gray-300 pt-2 focus:border-yellow-300 focus:outline-none placeholder-gray-300 mt-2" />
            <input type="password" placeholder="Confirm password" className="border-b border-gray-300 pt-2 focus:border-yellow-300 focus:outline-none placeholder-gray-300 mt-2" />
            <div className="mt-2">
                <span className="text-xs">No account?</span>
                <a href="/user/signup" className="text-yellow-300 text-xs ml-1" >Create one!</a>
            </div>
            <span className="text-xs cursor-pointer mt-1" onClick={() => { }} >Forgot password</span>
            <div className="flex justify-end w-100 mt-2">
                <button className="w-1/3 bg-gray-400 py-2" onClick={()=>router.push('/signin')}>Back</button>
                <button className="w-1/3 bg-yellow-300 py-2 ml-3">Sign in</button>
            </div>
        </div>
    );
}
