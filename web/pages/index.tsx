import React, {useEffect} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/signin');
  }, [])
  return (
    <div>
      <Head>
        <title>TODO</title>
      </Head>
    </div>
  )
}

export default Home
