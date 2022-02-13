import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_ID,
  clientSecret: process.env.SPOTIFY_SECRET,
})

const useSpotify = () => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      // if refresh access token attemps fails, direct user to login
      if ((session.error = 'RefreshAccessTokenError')) {
        // alert('token expired, Please login again')
        // signIn()
      }

      spotifyApi.setAccessToken(session.user?.accessToken || '')
    }
  }, [session])

  return spotifyApi
}

export default useSpotify
