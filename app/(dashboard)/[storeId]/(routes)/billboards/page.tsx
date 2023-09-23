import React from 'react'
import BillboardClient from './components/client'
import prismadb from '@/lib/prismadb'

type Props = {
  params: {
    storeId: string,
  }
}

const Billboards = async (props: Props) => {
  const {params: {storeId}} = props;

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    },
  });
  console.log({billboards});
  
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-5'>
            <BillboardClient billboards={billboards}/>
        </div>
    </div>
  )
}

export default Billboards