import React from 'react'
import { useRouter } from "next/navigation";
import { RiInstagramFill } from "react-icons/ri";
import { SiTiktok } from "react-icons/si";
import { IoLocation } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";

export default function subheader(fburl , ) {
  const router = useRouter()
  const feedback = () => {
    router.push("/feedback"); 
  };
  const insta = () => {
    window.open("https://www.instagram.com/planb.qa/"); 
  };
  const location = () => {
    window.open("https://maps.app.goo.gl/wByeN8tbfEGTAZBb7"); 
  };
  const linktree = () => {
    window.open("https://linktr.ee"); 
  };
  return (
    <div className='subheader flex col'>
      <div className='text-logo'>
        PlanB Cafe
      </div>
      <div className='flex g-5 icon-box'>
      <RiInstagramFill onClick={insta} />
      <SiTiktok onClick={insta} />
      <IoLocation onClick={location} />
      <FaStar onClick={feedback}/>
      <FaTruck onClick={feedback}/>
      <SiLinktree onClick={linktree}/>
      </div>
    </div>
  )
}
