import React, { useEffect, useState } from "react";
import {get} from "lodash"
import axios from "axios";
import moment from "moment";
import { Spin } from "antd";


function Notification() {
  const [data,setData]=useState([])
  const [loading,setLoading]=useState(false)

  const fetchData=async()=>{
    try{
      setLoading(true)
      const result=await axios.get(
        `${process.env.REACT_APP_URL}/getnotification`
      );
      setData(get(result,"data.data",[]))
    }catch(err){
      
    }finally{
      setLoading(false)
    }
  }
 

  useEffect(()=>{
    fetchData()
  },[])
  
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
 
  return (
    <div className="pt-28 pl-[20vw]  md:pl-[28vw] w-[80vw] text-black flex items-center justify-center">
  <Spin spinning={loading}>
  {data.map((res,i)=>{
         const headingStyle = {
          color: getRandomColor(),
        };
      return(
        <div key={i} className="w-[95vw] md:w-[70vw] bg-black mt-2 text-white py-4 px-3 rounded-md text-[10px] sm:text-[12px] md:text-[15px] flex justify-between">
        <div>
        <h1 style={headingStyle} className="font-bold text-[12px] sm:text-[14px] md:text-[18px]">{res.heading}</h1>
          <p>{res.status}</p>
        </div>
        <div>
         <p className={`${res.field==="Online order"?"text-red-500":res.field==="Dinning order"?"text-green-500":res.field==="Call for order"?"text-blue-500":"text-yellow-500"}`}>{res.field}</p>
          <h1>{moment(res.createdAt).format('DD-MM-YYYY, h:mm:ss a')}</h1>
        </div>
      </div>
      )
    })}
  </Spin>
    </div>
  );
}

export default Notification;
