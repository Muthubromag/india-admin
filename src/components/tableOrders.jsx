import React, { useState, useEffect } from "react";
import axios from "axios";
import { get } from "lodash";
import { Statistic } from "antd";
import CountUp from "react-countup";

function TableOrders() {
  const [tabledata, setTableData] = useState([]);
  const [tableBookingData, setTableBookingData] = useState([]);
  const formatter = (value) => <CountUp end={value} separator="," />;

  const fetchData = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_URL}/gettable`);
      const result1 = await axios.get(
        `${process.env.REACT_APP_URL}/getdinningorder`
      );
      setTableData(get(result, "data.data"));
      setTableBookingData(get(result1, "data.data"));
    } catch (e) {
     
    }
  };



  useEffect(() => {
    fetchData();
  }, []);

 

  return (
    <div className="flex gap-1 md:gap-5 pt-1 md:w-[78vw] flex-wrap justify-center items-center sm:justify-start">
    <div className="px-4 w-[74vw] flex flex-col md:flex-row gap-5 md:flex-wrap justify-between bg-gradient-to-r from-pink-500 via-pink-500 to-white/50 rounded-md">
      {tabledata?.map((res, i) => {
        const filteredData = tableBookingData?.filter((data) => {
          return data.tableNo === res.tableNo && data.status === "Order served";
        });
        const totalPrice = filteredData.reduce(
          (total, data) => total + Number(data.billAmount),
          0
        );
  
        return (
          <div
            key={i}
            className={`flex flex-col md:flex-row md:flex-wrap border-r md:w-[220px] rounded-md gap-10`}
          >
            <div className="flex flex-col gap-4 items-center justify-center pt-2 ">
              <div
                key={i}
                className={`pb-2 w-[160px] md:w-[220px] rounded-md gap-10`}
              >
                <h1 className="text-white text-xl text-center pt-1">
                  Table no: {res.tableNo}
                </h1>
                <div className="flex justify-between items-center px-3 pt-5">
                  <Statistic
                    title={
                      <h1 className="text-white font-semibold text-[12px] md:text-[16px]">
                        Total orders
                      </h1>
                    }
                    value={filteredData.length}
                    valueStyle={{
                      color: "white",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                    formatter={formatter}
                  />
  
                  <p>
                    <Statistic
                      title={
                        <h1 className="text-white font-semibold text-[12px] md:text-[16px]">
                          Total amount
                        </h1>
                      }
                      value={totalPrice}
                      valueStyle={{
                        color: "white",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                      formatter={formatter}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
  
  );
}

export default TableOrders;
