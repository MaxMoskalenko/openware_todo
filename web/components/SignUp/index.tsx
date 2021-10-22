import React, { FC } from 'react'
import { useRouter } from 'next/dist/client/router'
import { instance as axios } from 'helpers/axios';
import { postSignup } from 'helpers/axiosRequests';

export const SignUp: FC<{}> = (): JSX.Element => {
    const router = useRouter();
    const [email, setEmail] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')
    const [confirmPassword, setConfirmPassword] = React.useState<string>('')

    const handleSignupClick = React.useCallback(() => {
        if (password != confirmPassword) {
            alert("Passwords are different, try again");
            return;
        }
        postSignup(email, password, router);
    }, [email, password, confirmPassword]);

    return (
        <div className="h-1/3 w-1/4 bg-white z-20 m-auto shadow-md flex flex-col p-10">
            <div className="flex">
                <img src="/icons/logo.svg" alt="Logo" />
                <span className="text-gray-500 text-2xl ml-1">Todo</span>
            </div>
            <span className="text-lg mt-2">Sign up</span>
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
                onChange={(e) => { setPassword(e.target.value) }}
                value={password}
            />
            <input
                type="password"
                placeholder="Confirm password"
                className="border-b border-gray-300 pt-2 focus:border-yellow-300 focus:outline-none placeholder-gray-300 mt-2"
                onChange={(e) => { setConfirmPassword(e.target.value) }}
                value={confirmPassword}
            />
            <div className="flex justify-end w-100 mt-2">
                <button className="w-1/3 bg-gray-400 py-2" onClick={() => router.push('/signin')}>Back</button>
                <button className="w-1/3 bg-yellow-300 py-2 ml-3" onClick={handleSignupClick}>Sign up</button>
            </div>
        </div>
    );
}
