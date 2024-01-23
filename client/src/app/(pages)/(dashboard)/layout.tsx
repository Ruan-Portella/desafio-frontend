import Navbar from './components/NavBar'
import React from 'react'

export default function layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className= 'h-full'>
            <Navbar />
            <main className='h-full m-10 rounded'>
                { children }
            </main>
        </div>
  )
}