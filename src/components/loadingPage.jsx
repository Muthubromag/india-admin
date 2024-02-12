import React from 'react'
import Logo from "../assets/logo1.png"

const LoadingPage = () => {
  return (
    <div className="!w-screen !min-h-screen center_div flex items-center justify-center  bg-black bg-cover bg-no-repeat mb-10 ">
    <img src={Logo} alt='loading' className="animate-bounce w-[18vw]"/>
  </div>
  )
}

export default LoadingPage;