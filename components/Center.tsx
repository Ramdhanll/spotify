import { NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

interface ICenter {}

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-yellow-500',
  'from-orange-500',
  'from-red-500',
  'from-purple-500',
  'from-pink-500',
]

const Center: NextPage<ICenter> = () => {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState<string>(colors[0])
  const playlistId = useRecoilValue<string>(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState<any>(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop() as string)
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data: any) => {
        setPlaylist(data.body)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [spotifyApi, playlistId])

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => signOut()}
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
        >
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user?.image ?? ''}
            alt=""
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />

        <div>
          <p className="text-1xl  md:text-2xl xl:text-4xl">PLAYLIST</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
