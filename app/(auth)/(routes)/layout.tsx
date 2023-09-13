import React from 'react'

const AuthLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className='flex justify-center items-center h-full'>{children} Hello</div>
  )
}

export default AuthLayout