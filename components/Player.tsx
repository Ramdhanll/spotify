import {
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
  ReplyIcon,
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
} from '@heroicons/react/solid'
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'

interface IPlayer {}

const Player: NextPage<IPlayer> = () => {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState<any>(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)

  const songInfo = useSongInfo()

  const fetchCurrentSong = async () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((res) => {
        console.log('Now playing: ', res?.body?.item)
        setCurrentTrackId(res?.body?.item?.id)

        spotifyApi.getMyCurrentPlaybackState().then((res) => {
          setIsPlaying(res.body?.is_playing)
        })
      })
    }
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch the song info
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((res) => {
      if (res.body.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    spotifyApi.getMyDevices().then((res) => {
      console.log('DEVICES', res)
    })
  }, [])

  return (
    songInfo && (
      <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
        {/* left */}
        <div className="flex items-center space-x-4">
          <img
            className="hidden h-10 w-10 md:inline"
            src={songInfo?.album?.images?.[0]?.url}
            alt=""
          />
          <div>
            <h3>{songInfo?.name}</h3>
            <p>{songInfo?.artists?.[0]?.name}</p>
          </div>
        </div>

        {/* center */}
        <div className="flex items-center justify-evenly ">
          <SwitchHorizontalIcon className="button" />
          <RewindIcon
            className="button"
            onClick={() => spotifyApi.skipToPrevious()}
          />

          {isPlaying ? (
            <PauseIcon className="button h-10 w-10" onClick={handlePlayPause} />
          ) : (
            <PlayIcon className="button h-10 w-10" onClick={handlePlayPause} />
          )}

          <FastForwardIcon
            className="button"
            onClick={() => spotifyApi.skipToNext()}
          />
          <ReplyIcon className="button" />
        </div>
      </div>
    )
  )
}

export default Player
