import { NextPage } from 'next'
import { getProviders, signIn } from 'next-auth/react'

interface ILogin {
  providers: any
}

const Login: NextPage<ILogin> = ({ providers }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <img
        className="mb-5 w-52"
        src="https://links.papareact.com/9xl"
        alt="logo spotify"
      />

      {Object.values(providers).map((provider: any) => (
        <div key={provider.id}>
          <button
            className="rounded-full bg-[#18D860] p-5 text-white"
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
}

import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const providers = await getProviders()

  return {
    props: {
      providers,
    },
  }
}

export default Login
