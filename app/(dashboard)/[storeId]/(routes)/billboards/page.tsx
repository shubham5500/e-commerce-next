import React from 'react'
import BillboardClient from './components/client'

type Props = {}

const Billboards = (props: Props) => {
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-5'>
            <BillboardClient/>
        </div>
    </div>
  )
}

export default Billboards