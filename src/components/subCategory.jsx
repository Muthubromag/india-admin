/* eslint-disable no-unused-vars */
import {
  Collapse,
  Table,
  Button,
  Form,
  Input,
  Select,
  Modal,
  Upload,
  notification,
  Image,
  Spin,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import axios from "axios";
import { get } from "lodash";
import {
  DeleteOutlined,
  PlusOutlined,
  CaretRightOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

function SubCategory() {
  const { Panel } = Collapse;
  const [category, setCategory] = useState([]);
  const { Option } = Select;
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [data, setData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [imageKey, setImageKey] = useState(null);
  const user = useSelector((state) => state.user.user);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getcategory`
      );
      setCategory(get(result, "data.data", []));

      const result1 = await axios.get(
        `${process.env.REACT_APP_URL}/getsubcategory`
      );
      setData(get(result1, "data.data", []));
    } catch (e) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleFinish = async (value) => {
    try {
      setLoadingButton(true);
      const data = new FormData();
      if (updateId !== "") {
        data.append(
          "file",
          get(value, "img.fileList[0].originFileObj") || null
        );
        data.append("image", imageUrl);
      } else {
        data.append("file", get(value, "img.fileList[0].originFileObj"));
      }
      data.append("name", value.name);
      data.append("categoryId", value.categoryId);
      data.append(
        "categoryName",
        category.filter((res) => {
          return res._id === value.categoryId;
        })[0].name
      );
      data.append("status", value.status === undefined ? false : value.status);
      const url = updateId
        ? `${process.env.REACT_APP_URL}/updatesubcategory/${updateId}`
        : `${process.env.REACT_APP_URL}/createsubcategory`;

      const method = updateId ? axios.put : axios.post;

      await method(url, data);

      const successMessage = updateId
        ? "Subcategory updated successfully"
        : "Subcategory created successfully";

      notification.success({ message: successMessage });

      setUpdateId("");
      form.resetFields();
      fetchData();
      setImageUrl("");
      setOpen(!open);
      setFileList([]);
      setIsAvailable(false);
    } catch (err) {
      notification.error({message:"Something went wrong"})
      if (get(err, "response.data")?.split(" ").includes("limit")) {
        Modal.warning({
          title: get(err, "response.data"),
          content:
            "if you really wanna add Subuisines you have to delete existing one",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
      }
    } finally {
      setLoadingButton(false);
    }
  };

  const handleEdit = (value) => {
    setUpdateId(value._id);
    setImageUrl(value.image);
    setOpen(!open);
    form.setFieldsValue(value);
    setIsAvailable(value.status);
    setSelectedCategory(value.categoryId);
    setFileList([
      { uid: "-1", name: "existing_image", status: "done", url: value.image },
    ]);
    setImageKey(value.subcategory_image_key);
  };

  const handleDelete = async (val) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/getproduct`
      );

      const isSubCategoryMapped = response.data.data.some(
        (product) => product.subCategoryId === val._id
      );

      if (isSubCategoryMapped) {
        Modal.warning({
          title: "This SubCategory Mapped With product",
          content: "if you really wanna delete this delete product first",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
        return;
      } else {
        let data = {
          image: get(val, "image"),
        };
        await axios.delete(
          `${process.env.REACT_APP_URL}/deletesubcategory/${val._id}`,
          { data }
        );

        notification.success({ message: "SubCategory deleted successfully" });
        fetchData();
      }
    } catch (error) {
      notification.error({ message: "Failed to delete Subcategory" });
    }
  };

  const handleStatus = async (status, value) => {
  
    try {
      const formData = {
        name: value.name,
        image: value.image,
        status: status,
        categoryName: value.categoryName,
        categoryId: value.categoryId,
      };

      await axios.put(
        `${process.env.REACT_APP_URL}/updatesubcategory/${value._id}`,
        formData
      );
      fetchData();
      notification.success({ message: "Status updated successfully" });
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
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {(currentPage - 1) * 5 + index + 1}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Image</h1>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (name) => {
        return (
          <Image
            alt="logo"
            className="!w-[80px] border-2 border-[#CD5C08] h-auto rounded-md"
            src={name}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Name</h1>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Cuisine Name</h1>,
      dataIndex: "categoryId",
      key: "categoryId",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {
              category.filter((res) => {
                return res._id === name;
              })[0]?.name
            }
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, value) => {
        return (
          <Switch
            className="text-[10px] md:text-[14px]"
            checked={status}
            onChange={(checked) => handleStatus(checked, value)}
          />
        );
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Edit</h1>,
      align: "center",
      render: (values) => {
        return (
          <EditNoteOutlinedIcon
            className=" text-green-500 cursor-pointer !text-[24px]"
            onClick={() => {
              handleEdit(values);
            }}
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
            onClick={() => {
              handleDelete(values);
            }}
          />
        );
      },
    },
  ];

  const partnerColumns = [
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
      title: <h1 className="text-[10px] md:text-[14px]">Image</h1>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (name) => {
        return (
          <Image
            alt="logo"
            className="!w-[80px] border-2 border-[#CD5C08] h-auto rounded-md"
            src={name}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Name</h1>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Cuisine Name</h1>,
      dataIndex: "categoryId",
      key: "categoryId",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {
              category.filter((res) => {
                return res._id === name;
              })[0]?.name
            }
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, value) => {
        return (
          <Switch
            className="text-[10px] md:text-[14px]"
            checked={status}
            onChange={(checked) => handleStatus(checked, value)}
          />
        );
      },
    },
  ];

  return (
    <div className="mt-28 md:pl-[20vw]">
      <Collapse
        defaultActiveKey={[1]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            className="!text-[#CD5C08]"
          />
        )}
        collapsible="icon"
        className="w-[95vw] md:!w-[78vw]"
      >
        <Panel
          header={
            <p className="md:text-[14px] !text-[#CD5C08] font-semibold">
              Subcuisines
            </p>
          }
          extra={
            <div
              className="cursor-pointer"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <FileAddOutlined
                className={`!text-[#CD5C08] !text-xl ${
                  get(user, "name")?.split("@")?.includes("partner")
                    ? "!hidden"
                    : "!block"
                }`}
              />
            </div>
          }
          key="1"
        >
          <Spin spinning={loading}>
            <Table
              columns={
                get(user, "name")?.split("@")?.includes("partner")
                  ? partnerColumns
                  : columns
              }
              dataSource={data}
              size="middle"
              key="id"
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
        destroyOnClose
        onCancel={() => {
          setOpen(!open);
          form.resetFields();
          setImageUrl("");
          setUpdateId("");
          setIsAvailable(false);
          setFileList([]);
        }}
      >
        <Form onFinish={handleFinish} layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Subcuisine Name"
            rules={[
              {
                required: true,
                message: "Please enter subCategory",
              },
            ]}
          >
            <Input type="text" placeholder="SubCategory name..." size="large" />
          </Form.Item>
          <Form.Item
            label="Cuisine Name"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Please choose a category name",
              },
            ]}
          >
            <Select
              placeholder="Select Cuisine"
              size="large"
              onChange={(e) => {
                setSelectedCategory(e);
              }}
            >
              {category.map((res, i) => {
                return (
                  <Option value={res._id} key={i}>
                    {res.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Subcuisine Availability"
            name="status"
            className="mb-0"
          >
            <Switch
              checked={isAvailable}
              onChange={(checked) => setIsAvailable(checked)}
            />
          </Form.Item>

          <Form.Item
            name="img"
            rules={[
              {
                required: updateId === "" ? true : false,
                message: "Select subcuisine image",
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

          <Form.Item>
            <div className="flex gap-3 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();
                  setImageUrl("");
                  setUpdateId("");
                  setIsAvailable(false);
                  setFileList([]);
                }}
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                loading={loadingButton}
                className="bg-green-500 text-white"
              >
                {updateId !== "" ? "Update" : "Save"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SubCategory;
