import './globals.css'
import { cookies } from 'next/headers'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import logo from './logo.png'
import { getUserInfoByToken } from '@/data/users'
import { Navigation } from '@/components/Navigation'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Full-Stack Next.js Blog',
  description: 'A blog about React and Next.js',
}

async function logoutAction() {
  'use server'
  cookies().delete('AUTH_TOKEN')
}

export default async function RootLayout({ children }) {
  const token = cookies().get('AUTH_TOKEN')
  const user = await getUserInfoByToken(token?.value)
  return (
    <html lang='en' className={inter.className}>
      <body>
        <div className='page-shell'>
          <header className='app-header'>
            <Image
              src={logo}
              alt='Full-Stack Next.js Blog Logo'
              width={320}
              height={30}
            />
            <nav>
              <Navigation username={user?.username} logoutAction={logoutAction} />
            </nav>
          </header>
          <main className='app-main'>{children}</main>
        </div>
      </body>
    </html>
  )
}
