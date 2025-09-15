import React from 'react'
import { Link } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { SlBookOpen } from "react-icons/sl";
export const Header = () => {
  return (
    <div className='border h-15 flex justify-between items-center gap-9  px-10 bg-blue-50'>
        <div className='flex items-center gap-2'>
          <SlBookOpen className='w-8 h-8 '/>
          <span>Flip Book</span>
        </div>  
       <div className="flex gap-9 font-bold text-lg text-gray-600">
         <Link to={"/"} >Home</Link>
         <Link to={"/create"}>Create</Link>
         {/* <Link to={"/flipbook/:id"}>View flipbook</Link> */}
       </div>
       <div className='w-10 h-10 rounded-full  flex items-center '>
          <CgProfile className='w-8 h-8'/>
       </div>
    </div>
  )
}
