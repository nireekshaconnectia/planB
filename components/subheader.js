import React from 'react'
import { RiInstagramFill } from "react-icons/ri";
import { SiTiktok } from "react-icons/si";
import { IoLocation } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { SiLinktree } from "react-icons/si";

export default function subheader(fburl , ) {
  return (
    <div className='subheader flex col'>
      <div className='text-logo'>
        PlanB Cafe
      </div>
      <div className='flex g-5 icon-box'>
      <RiInstagramFill />
      <SiTiktok />
      <IoLocation />
      <FaStar />
      </div>
    </div>
  )
}
