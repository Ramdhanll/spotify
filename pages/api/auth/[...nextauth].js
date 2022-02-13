import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify'

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    console.log('REFRESHED TOKEN IS', refreshedToken)

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpiresAt: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.log(error)

    return {
      token,
      error: 'RefreshAccessTokenError',
      refreshError: true,
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: '3db01b20118a4876990a5c0f5fb32ab4',
      clientSecret: '85e94e14bee24ba7b2a0e941e3327ec5',
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial signin

      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        }
      }

      // return previous token if the access token has not expired
      if (Date.now() < token.accessTokenExpires) {
        console.log('EXISTING ACCESS TOKEN IS VALID')
        return token
      }

      // Access token has expired, so refresh it
      console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING')
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username

      return session
    },
  },
})
