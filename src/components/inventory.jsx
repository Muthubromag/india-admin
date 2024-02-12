import {
  Collapse,
  Table,
  Spin,
  Form,
  Drawer,
  Button,
  Input,
  notification,
  Upload,
  Image,
} from "antd";
import React, { useEffect, useState } from "react";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import {
  DeleteOutlined,
  CaretRightOutlined,
  FileAddOutlined,
  PlusOutlined
} from "@ant-design/icons";
import axios from "axios";
import { get } from "lodash";
import moment from "moment";
import { useSelector } from "react-redux";


function Inventory() {
  const { Panel } = Collapse;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [updateId, setUpdateId] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state) => state.user.user);
  const [loadingButton,setLoadingButton]=useState(false);
  const [fileList, setFileList] = useState([]);
  const [imageurl,setImageUrl] = useState(null)
  

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getinventory`
      );
      setData(get(result, "data.data",[]));
    } catch (e) {
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFinish = async (value) => {
    try {
     
      setLoadingButton(true);
      const data = new FormData();
      if(updateId){
        data.append("file", get(value, "img.fileList[0].originFileObj")||null);
      }else{
        data.append("file", get(value, "img.fileList[0].originFileObj"));
      }
        data.append("productName",get(value,"productName"));
        data.append("category",get(value,"category"));
        data.append("provided",get(value,"provided"));
        data.append("consumed",get(value,"consumed"));
        data.append("available",get(value,"provided")-get(value,"consumed"));
        data.append("image",imageurl);
     
  
      const url = updateId
        ? `${process.env.REACT_APP_URL}/updateinventory/${updateId}`
        : `${process.env.REACT_APP_URL}/createinventory`;
  
      const method = updateId ? axios.put : axios.post;
  
      await method(url, data );
  
      const successMessage = updateId
        ? "inventory updated successfully"
        : "inventory created successfully";
  
      notification.success({ message: successMessage });
  
      setOpen(!open);
      fetchData();
      form.resetFields();
      setUpdateId("");
      setFileList([])
    } catch (err) {
      notification.error({message:"Something went wrong"})
    } finally {
      setLoadingButton(false);
    }
  };
  
  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleEdit = (values) => {
    setUpdateId(values._id);
    setOpen(!open);
    form.setFieldsValue(values);
    setFileList([
      { uid: "-1", name: "existing_image", status: "done", url: values.image },
    ]);
    setImageUrl(values.image)
  };

  const handleDelete = async (val) => {
    try {

      let data = {
        image: get(val, "image"),
      };

      await axios.delete(
        `${process.env.REACT_APP_URL}/deleteinventory/${val._id}`,{data}
      );

      notification.success({ message: "inventory deleted successfully" });
      fetchData();
    } catch (err) {
      notification.error({message:"Something went wrong"})
    }
  };

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
      title: <h1 className="text-[10px] md:text-[14px]">Product Name</h1>,
      dataIndex: "productName",
      key: "productName",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Category Name</h1>,
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Bill Image</h1>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (name) => {
      
        return  <Image
        alt="bill"
        className="!w-[80px] border-2 border-[#CD5C08] h-auto rounded-md"
        src={name}
      />
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Provided</h1>,
      dataIndex: "provided",
      key: "provided",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Consumed</h1>,
      dataIndex: "consumed",
      key: "consumed",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Available</h1>,
      dataIndex: "available",
      key: "available",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className={`text-[10px] md:text-[14px] ${get(user,"name","")==="bromag@kds"||get(user,"name","")==="bromag@partner"?"hidden":"block"}`}>Edit</h1>,
      width: 100,
      align: "center",
      render: (values) => {
        return (
          <EditNoteOutlinedIcon
            className=" text-green-500 cursor-pointer !text-[24px]"
            onClick={() => handleEdit(values)}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Delete</h1>,
      width: 100,
      align: "center",
      render: (values) => {
        return (
          <DeleteOutlined
            className=" text-red-500 cursor-pointer !text-[18px]"
            onClick={() => handleDelete(values)}
          />
        );
      },
    },
  ];

  const Kdscolumns = [
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
      title: <h1 className="text-[10px] md:text-[14px]">Product Name</h1>,
      dataIndex: "productName",
      key: "productName",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Category Name</h1>,
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Arrival Date</h1>,
      dataIndex: "arrivalDate",
      key: "arrivalDate",
      align: "center",
      render: (date) => {
        return <h1 className="text-[10px] md:text-[14px]">{moment(date).format("DD-MM-YYYY")}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Provided</h1>,
      dataIndex: "provided",
      key: "provided",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Consumed</h1>,
      dataIndex: "consumed",
      key: "consumed",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Available</h1>,
      dataIndex: "available",
      key: "available",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },

  ];
  return (
    <div className="mt-28 md:pl-[20vw]">
      <div className="!w-[99vw] md:!w-[80vw] lg:!w-[80vw]">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
          className="md:!w-[70vw] lg:!w-[78vw]"
        >
          <Panel
            header={
              <h1 className="text-md !text-[#CD5C08] font-semibold">
                Inventory
              </h1>
            }
            extra={
              <div
                className={`${get(user,"name","")==="bromag@kds"||get(user,"name","")==="bromag@partner"?"hidden":"block"} cursor-pointer`}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <FileAddOutlined className="!text-[#CD5C08] !text-xl" />
              </div>
            }
            key="1"
          >
            <div className="flex flex-col ">
              <div className="flex flex-col gap-y-2">
                <div className="p-2 ">
                  <Spin spinning={loading}>
                    <Table
                      key="id"
                      size="middle"
                      pagination={{
                        pageSize: 5,
                        current: currentPage,
                        onChange: (page) => {
                          setCurrentPage(page);
                        },
                      }}
                      columns={get(user,"name","")==="bromag@kds"||get(user,"name","")==="bromag@partner"?Kdscolumns:columns}
                      dataSource={data}
                      scroll={{x:800}}
                      className="overflow-x-scroll"
                    />
                  </Spin>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>

      <Drawer
        open={open}
        onClose={() => {
          setOpen(!open);
          form.resetFields();
          setFileList([])
          setUpdateId("")
        }}
        width={400}
        title={<p>Add Inventory</p>}
        footer={false}
        destroyOnClose
      >
        <Form
          layout="vertical"
          className="pt-3"
          onFinish={handleFinish}
          form={form}
        >
          <Form.Item
            name="productName"
            label="Product name"
            rules={[
              {
                required: true,
                message: "Please enter product name",
              },
            ]}
          >
            <Input type="text" disabled={ get(user, "name", "")?.split("@")?.includes("kds")|| get(user, "name", "")?.split("@")?.includes("partner")?true:false} placeholder="Product name..." size="large" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category name"
            rules={[
              {
                required: true,
                message: "Please enter category name",
              },
            ]}
          >
            <Input type="text" disabled={ get(user, "name", "")?.split("@")?.includes("kds")|| get(user, "name", "")?.split("@")?.includes("partner")?true:false}  placeholder="Category name..." size="large" />
          </Form.Item>
          <Form.Item
            name="img"
            label="Inventory Bill"
            rules={[
              {
                required: updateId === "" ? true : false,
                message: "Select cuisine image",
              },
            ]}
          >
            <Upload
              onChange={handleChange}
              fileList={fileList}
              onPreview={(e) => {
              
              }}
              maxCount={1}
              listType="picture-card"
              multiple={false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            name="provided"
            label="Provided"
            rules={[
              {
                required: true,
                message: "Please enter provided count...",
              },
              {
                validator: (_, value) => {
                  if (!value || /^\d+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Provided count should be a number")
                  );
                },
              },
            ]}
          >
            <Input type="text" disabled={ get(user, "name", "")?.split("@")?.includes("kds")|| get(user, "name", "")?.split("@")?.includes("partner")?true:false} placeholder="provided count..." size="large" />
          </Form.Item>
          <Form.Item
            name="consumed"
            label="Consumed"
            rules={[
              {
                required: true,
                message: "Please Enter Consumed count...",
              },
              {
                validator: (_, value) => {
                  if (!value || /^\d+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Consumed count should be a number")
                  );
                },
              },
            ]}
          >
            <Input type="text" placeholder="Consumed count..." size="large" />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-3 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();
                  setFileList([])
                  setUpdateId("")
                }}
              >
                Cancel
              </Button>
              <Button loading={loadingButton} htmlType="submit" className="bg-green-500 text-white">
                {updateId !== "" ? "Update" : "Save"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default Inventory;
