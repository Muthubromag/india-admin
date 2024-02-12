import React, { useEffect, useState } from "react";
import { Table,Spin } from "antd";
import axios from "axios";
import { get } from "lodash";

function User() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage,setCurrentPage] = useState(1)

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${process.env.REACT_APP_URL}/getalluser`);

      setData(get(result, "data.message",[]));
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
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {(currentPage - 1) * 5 + index + 1}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px] ">User Id</h1>,
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px] ">Name</h1>,
      dataIndex: "user",
      key: "user",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px] ">Mobile Number</h1>,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px] ">Email</h1>,
      dataIndex: "email",
      key: "email",
      align: "start",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    
    {
      title: <h1 className="text-[10px] md:text-[14px] ">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "start",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
  ];
  return (
    <div className="pt-28 md:pl-[20vw] w-[98vw] lg:w-[95vw]">
      <Spin spinning={loading}>
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
        className="overflow-x-scroll"
        scroll={{x:600}}
      />
      </Spin>
    </div>
  );
}

export default User;
