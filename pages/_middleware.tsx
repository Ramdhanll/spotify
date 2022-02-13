import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export async function middleware(req: any) {
  //  token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  const { pathname } = req.nextUrl

  // console.log('A', token)
  // Allow the request if the following is true
  // 1. the token exist
  // 2. token exists
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // redirect them to login if they dont have token AND are requesting a protected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login')
  }
}
