import React, { useEffect, useState } from "react";
import { Table,Spin} from "antd";
import axios from "axios";
import { get } from "lodash";

function Wallet() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${process.env.REACT_APP_URL}/getwallet`);
      setData(get(result, "data.data",[]));
    } catch (e) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: <h1 className="text-[10px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return(
          <h1 className="text-[10px] md:text-[14px]">
          {(currentPage - 1) * 5 + index + 1}
        </h1>
        )
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Order Id</h1>,
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Table No</h1>,
      dataIndex: "tableNo",
      key: "tableNo",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Time Slot</h1>,
      dataIndex: "timeSlot",
      key: "timeSlot",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Bill Date</h1>,
      dataIndex: "billDate",
      key: "billDate",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Total Bill Amount</h1>,
      dataIndex: "totalBillAmount",
      key: "totalBillAmount",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Amount Deduction</h1>,
      dataIndex: "amountDeduction",
      key: "amountDeduction",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
  ];

  return (
    <div className="pt-28 w-[98vw] md:pl-[20vw] md:w-[90vw]">
      <Spin spinning={loading}>
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-white/80 flex flex-col gap-5 items-center justify-center text-black rounded-md py-10 px-10">
        <h1 className="text-3xl">Current balance</h1>
        <p className="text-7xl font-normal tracking-wider">Rs.{9700}</p>
      </div>
      <div className="pt-5">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 5,
            current: currentPage,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
          scroll={{x:800}}
          className="overflow-x-scolltext-[10px] md:"
        />
      </div>
      </Spin>
     
    </div>
  );
}

export default Wallet;
