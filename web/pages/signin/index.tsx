import React, { FC } from 'react'
import Head from 'next/head'
import {SignIn} from 'components/SignIn'

const Home: FC<{}> = (): JSX.Element => {

    return (
        <div>
            <Head>
                <title>TODO</title>
            </Head>
            <div
                className="w-full h-screen flex"
                style={{
                    backgroundImage: `url("/background.png")`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <img src="/dinoware.svg" alt="Stand by. Dino will be back soon" className="absolute ml-20 my-20" style={{width: "65%"}} />
                <SignIn />
            </div>
        </div>
    )
}

export default Home
