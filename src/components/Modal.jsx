import React,{useState} from 'react'

export const Modal = ({children,IsOpen}) => {
   
  return (
  <>
      {
    IsOpen==true&&(<div className='fixed inset-0 bg-black/70 flex justify-center items-center z-50' >
        <div className='bg-white p-6 rounded-lg shadow-lg w-1/2'>
        
        {children}
        </div>
    </div>)
  }
  </>
    
  )
}
