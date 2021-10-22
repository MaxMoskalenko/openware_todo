import React, { FC, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import 'axios'
import { postSignin } from 'helpers/axiosRequests'

export const SignIn: FC<{}> = (): JSX.Element => {
    const router = useRouter();
    const [isRecoverPassword, setIsRecoverPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSiginClick = React.useCallback(() => {
        postSignin(email, password,router)
    }, [email, password])

    return (
        <div className="w-1/4 bg-white z-20 m-auto shadow-md flex flex-col p-10">
            <div className="flex">
                <img src="/icons/logo.svg" alt="Logo" />
                <span className="text-gray-500 text-2xl ml-1">Todo</span>
            </div>
            {!isRecoverPassword
                ? <>
                    <span className="text-lg mt-2">Sign in</span>
                    <input
                        type="email"
                        placeholder="Email"
                        className="border-b border-gray-300 pt-2 focus:border-yellow-300 focus:outline-none placeholder-gray-300"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border-b border-gray-300 pt-2 focus:border-yellow-300 focus:outline-none placeholder-gray-300 mt-2"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <div className="mt-2">
                        <span className="text-xs">No account?</span>
                        <a href="/signup" className="text-yellow-300 text-xs ml-1" >Create one!</a>
                    </div>
                    <span className="text-xs cursor-pointer mt-1" onClick={() => { setIsRecoverPassword(true) }} >Forgot password</span>
                    <div className="flex justify-end w-100 mt-2">
                        <button className="w-1/3 bg-yellow-300 py-2" onClick={handleSiginClick}>Sign in</button>
                    </div>
                </>
                : <>
                    <span className="text-lg mt-2">Forgot password</span>
                    <input type="email" placeholder="Email" className="border-b border-gray-300 pt-2 focus:border-yellow-300 focus:outline-none placeholder-gray-300" />
                    <div className="flex justify-end w-100 mt-3">
                        <button className="w-1/3 bg-gray-400 py-2" onClick={() => { setIsRecoverPassword(false) }}>Back</button>
                        <button className="w-1/3 bg-yellow-300 py-2 ml-3">Sign in</button>
                    </div>
                </>
            }
        </div>
    );
}
