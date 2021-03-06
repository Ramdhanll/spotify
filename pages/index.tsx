import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

export default function Home() {
  const { data: session, status } = useSession()
  console.log('SESSION', session)
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>Spotify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" flex ">
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  )
}
