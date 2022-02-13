import { NextPage } from 'next'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song'

interface ISongs {}

const Songs: NextPage<ISongs> = () => {
  const playlist = useRecoilValue<any>(playlistState)
  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {playlist?.tracks?.items.map((item: any, i: number) => (
        <Song key={item.track.id} item={item} order={i} />
      ))}
    </div>
  )
}

export default Songs
