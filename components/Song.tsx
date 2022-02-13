import { NextPage } from 'next'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify'
import { millisToMinutesAndSeconds } from '../lib/time'

interface ISong {
  item: any
  order: number
}

const Song: NextPage<ISong> = ({ item, order }) => {
  const spotifyApi = useSpotify()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

  const playSong = () => {
    setCurrentTrackId(item.track.id)
    setIsPlaying(true)

    spotifyApi.play({
      uris: [item.track.uri],
    })
  }
  return (
    <div
      onClick={playSong}
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900 active:bg-gray-800"
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={item.track.album.images[0].url}
          alt=""
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">
            {item?.track?.name}
          </p>
          <p className="w-40 ">{item?.track?.artists[0]?.name}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline">{item.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(item.track.duration_ms)}</p>
      </div>
    </div>
  )
}

export default Song
