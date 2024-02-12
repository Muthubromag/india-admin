/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  Collapse,
  Form,
  Input,
  Modal,
  Spin,
  Table,
  Select,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  CaretRightOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { get } from "lodash";
import moment from "moment";

function ScratchCard() {
  const { Panel } = Collapse;
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [expiredFilter, setExpiredFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { Option } = Select;
  const [loadingButton,setLoadingButton]=useState(false)

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getscratch?search=${expiredFilter}`
      );
      setData(get(result, "data.data", []));
    } catch (e) {
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [expiredFilter]);

  const onChange = (e) => {
    setChecked(e.target.checked);
  };


  

  const handleFinish = async (val) => {
    try {
      setLoadingButton(true)
      const formData = {
        number: val.number,
        status: checked,
      };
     await axios.post(
        `${process.env.REACT_APP_URL}/createscratch`,
        formData
      );
      setOpen(false);
      fetchData();
      form.resetFields();
      notification.success({
        message: "Scratch card details created successfully",
      });
    } catch (err) {
      notification.error({message:"Something went wrong"})
      if (err.response.data.data === "This number already exists...") {
        notification.error({ message: err.response.data.data });
      }
    }finally{
      setLoadingButton(false)
    }
  };

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
      title: <h1 className="text-[10px] md:text-[14px]">User Id</h1>,
      dataIndex: "userId",
      key: "userId",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Contact Number</h1>,
      dataIndex: "contact_number",
      key: "contact_number",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px]  md:text-[14px]">Scratch Number</h1>,
      dataIndex: "number",
      key: "number",
      align: "center",
      ellipsis: true,
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: (
        <h1 className="text-[10px] md:text-[14px]">Scratch Card Result</h1>
      ),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        return (
          <h1
            className={`text-[10px] md:text-[14px] ${
              status ? "text-green-500" : "text-red-500"
            }`}
          >
            {status ? "Winner" : "Not Winner"}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Collected</h1>,
      key: "expired",
      align: "center",
      render: (data, res) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {get(data, "expired", false) ? "Yes" : "No"}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Expired Date</h1>,
      dataIndex: "expireDate",
      key: "expireDate",
      align: "center",
      render: (data, res) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {res.status && data ? moment(data).format("lll") : ""}
          </h1>
        );
      },
    },
  ];

  return (
    <div className="md:pl-[20vw] mt-[10vh] text-black flex flex-col gap-2 items-center justify-center">
      <Select
        defaultValue="all"
        style={{ width: 120 }}
        onChange={(value) => setExpiredFilter(value)}
        className="!w-[70%] md:!w-[50%] mt-5"
        size="large"
      >
        <Option value="all">All</Option>
        <Option value="expired">Expired</Option>
        <Option value="notexpired">Not Expired</Option>
        <Option value="winner">Winner</Option>
        <Option value="notwinner">Not Winner</Option>
      </Select>

      <Collapse
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            className="!text-[#CD5C08]"
          />
        )}
        collapsible="icon"
        className="w-[100vw] md:!w-[75vw] mt-10"
      >
        <Panel
          header={
            <h1 className="text-md !text-[#CD5C08] font-semibold">
              Add Scratch Card
            </h1>
          }
          extra={
            <div
              className="cursor-pointer"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <FileAddOutlined className="!text-[#CD5C08] !text-xl" />
            </div>
          }
          key="1"
        >
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
              scroll={{ x: 300 }}
            />
          </Spin>
        </Panel>
      </Collapse>

      <Modal
        open={open}
        footer={false}
        onCancel={() => {
          setOpen(!open);
        }}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Form.Item
            name="number"
            label={"Add Scratch Number"}
            rules={[{ required: true, message: "Scratch number is required" }]}
          >
            <Input
              type="text"
              placeholder="Add scratch number..."
              size="large"
            />
          </Form.Item>
          <Form.Item name="status">
            <Checkbox checked={checked} onChange={onChange}>
              Select Winner
            </Checkbox>
          </Form.Item>
          <Form.Item className="flex items-end justify-end">
            <Button htmlType="submit" loading={loadingButton} className="bg-green-500">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ScratchCard;
