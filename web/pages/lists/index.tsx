import React, { FC } from 'react'
import Head from 'next/head'
import { Layout } from 'components/Layout'

const Home: FC<{}> = (): JSX.Element => {
    return (
        <div>
            <Head>
                <title>TODO</title>
            </Head>
            <Layout />
        </div>
    )
}

export default Home
