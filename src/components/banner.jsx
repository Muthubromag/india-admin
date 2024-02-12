/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Image,
  Select,
  Modal,
  Upload,
  Button,
  notification,
  Spin,
  Collapse,
  Badge,
  Input,
  Table,
} from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  FileAddOutlined,
  PlusOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import _, { get } from "lodash";
import { EyeOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

function Banner() {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Panel } = Collapse;
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [selected, setSelected] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [products, setProducts] = useState([]);
  const [userModal, setUserModal] = useState(false);
  const [AdvertisementId, setAdvertisementId] = useState("");
  const [formattedDatas, setFormattedDatas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [fileList, setFileList] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [filteredBannersAdd,setFilteredBannersAdd]=useState([])

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getbanner?search=${filteredBanners}`
      );
      const product = await axios.get(
        `${process.env.REACT_APP_URL}/getproduct`
      );
      setData(get(result, "data.data", []));
      setProducts(get(product, "data.data", []));
    } catch (e) {
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filteredBanners]);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);

    if (newFileList?.length === 0) {
      form.setFieldsValue({ img: {} });
    }
  };


  const handleFinish = async (value) => {
    try {
      setLoadingBtn(true);
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("content", value.content || "");
      formData.append("productId", value.productId || "");
      formData.append("image", imageUrl);

      if (updateId) {
        _.get(value, "img.fileList", []).map((res, index) => {
          if (_.get(res, "originFileObj", false)) {
            formData.append("banner", res.originFileObj);
          }
        });
        await axios.put(
          `${process.env.REACT_APP_URL}/updatebanner/${updateId}`,
          formData
        );
      } else {
        _.get(value, "img.fileList", []).map((res) => {
          formData.append("banner", res.originFileObj);
        });

        await axios.post(`${process.env.REACT_APP_URL}/createbanner`, formData);
      }
      setOpen(!open);
      form.resetFields();
      setSelected("");
      setFileList([]);
      setUpdateId("");
      fetchData();
      notification.success({
        message: `banner ${updateId ? "updated" : "created"} `,
      });
    } catch (err) {
      notification.error({message:"Something went wrong"})
      if (get(err, "response.data")?.split(" ").includes("limit")) {
        Modal.warning({
          title: get(err, "response.data"),
          content:
            "if you really wanna add banner you have to delete existing one",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
      }
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleEdit = (values) => {
    let prepareImg = values.image.map((res, index) => {
      return {
        uid: index,
        name: index + Date.now(),
        url: res,
      };
    });

    setUpdateId(get(values, "_id"));
    setSelected(get(values, "name"));
    setImageUrl(get(values, "image"));
    setFileList(prepareImg);
    setCurrentImage(get(values, "image"));
    form.setFieldsValue({ img: prepareImg });
    form.setFieldsValue(values);
    setOpen(!open);
  };

  const handleDelete = async (val) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_URL}/deletebanner/${val._id}`,
        { data: { image: val.image } }
      );

      notification.success({ message: "Banner deleted successfully" });
      fetchData();
    } catch (err) {
      notification.error({message:"Something went wrong"})
    }
  };

  useEffect(() => {
    const addDatas = data.filter((res) => res._id === AdvertisementId);

    const phoneNumberCounts = {};

    const formattedData = addDatas.reduce((acc, item) => {
      const userDetails = item.userDetails || [];
      if (Array.isArray(userDetails)) {
        userDetails.forEach((user) => {
          const { phoneNumber, userName } = user;
          phoneNumberCounts[phoneNumber] =
            (phoneNumberCounts[phoneNumber] || 0) + 1;

          const existingEntryIndex = acc.findIndex(
            (entry) => entry.phoneNumber === phoneNumber
          );

          if (existingEntryIndex !== -1) {
            acc[existingEntryIndex].count = phoneNumberCounts[phoneNumber];
          } else {
            acc.push({
              phoneNumber,
              userName,
              count: phoneNumberCounts[phoneNumber],
            });
          }
        });
      }

      return acc;
    }, []);
    setFormattedDatas(formattedData);
  }, [data, AdvertisementId]);

  const exportToExcel = () => {
    if (!exporting) {
      const dataForExport = formattedDatas.map((formattedData, i) => ({
        SerialNo: i + 1,
        Username: formattedData.userName,
        PhoneNumber: formattedData.phoneNumber,
        Count: formattedData.count,
      }));

      const ws = XLSX.utils.json_to_sheet(dataForExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "exported_data.xlsx");
      setExporting(false);
    }
  };

  useEffect(() => {
    setFilteredBannersAdd(data.filter(res => res.name === "Advertisement Banner"));
  }, [data]);
  
  useEffect(() => {
    
  }, [filteredBannersAdd]);



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
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <div className="flex flex-col items-center  min-h-[70vh] pt-28 md:pl-[20vw]">
      <Select
        placeholder="Select banner name..."
        size="large"
        onChange={(e) => {
          setFilteredBanners(e || "");
        }}
        allowClear={true}
        className={`${
          get(user, "name")?.split("@")?.includes("banner") ? "hidden" : "block"
        } w-[60vw]`}
      >
        <Option value="Banner">Banner</Option>
        <Option value="Top Notch Banner">Top Notch Banner</Option>
        <Option value="Advertisement Banner">Advertisement Banner</Option>
        <Option value="Vegetarian Banner">Vegetarian Banner</Option>
        <Option value="Non Vegetarian Banner">Non Vegetarian Banner</Option>
      </Select>

      <div className="w-[95vw] md:w-[75vw] pt-4">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
          className="w-[95vw] md:!w-[75vw]"
        >
          <Panel
            header={
              <h1 className="text-md text-[#CD5C08] font-semibold">Banner</h1>
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
              <div
                className={`flex gap-10 md:w-[75vw] flex-wrap  items-center justify-center md:items-start md:justify-start`}
              >
                {get(user, "name").split("@").includes("banner")?filteredBannersAdd.map((res, i) => {
                  return (
                    <Badge.Ribbon
                      key={i}
                      text={
                        <div
                          className={`flex  items-center gap-x-2 cursor-pointer`}
                          onClick={() => {
                            setUserModal(!userModal);
                            setAdvertisementId(res._id);
                          }}
                        >
                          <div>{get(res, "count", 0)}</div> <EyeOutlined />
                        </div>
                      }
                      className={`${
                        get(res, "name") === "Advertisement Banner"
                          ? "!block"
                          : "!hidden"
                      }`}
                    >
                      <Card
                        key={i}
                        title={
                          <p className="text-white text-center">
                            {get(res, "name", [])}
                          </p>
                        }
                        bordered={false}
                        style={{
                          width: 250,
                          height: 240,
                          backgroundColor: "black",
                        }}
                      >
                        <Image
                          src={get(res, "image[0]")}
                          width={200}
                          height={120}
                          preview={false}
                        />

                        <div className="flex items-center justify-center gap-2 pt-1">
                          <span>
                            <EditNoteIcon
                              className="!text-green-500 cursor-pointer"
                              onClick={() => {
                                handleEdit(res);
                              }}
                            />
                          </span>
                          <span>
                            <DeleteIcon
                              className="!text-red-500 cursor-pointer"
                              onClick={() => {
                                handleDelete(res);
                              }}
                            />
                          </span>
                        </div>
                      </Card>
                    </Badge.Ribbon>
                  );
                }):data.map((res, i) => {
                  return (
                    <Badge.Ribbon
                      key={i}
                      text={
                        <div
                          className={`flex  items-center gap-x-2 cursor-pointer`}
                          onClick={() => {
                            setUserModal(!userModal);
                            setAdvertisementId(res._id);
                          }}
                        >
                          <div>{get(res, "count", 0)}</div> <EyeOutlined />
                        </div>
                      }
                      className={`${
                        get(res, "name") === "Advertisement Banner"
                          ? "!block"
                          : "!hidden"
                      }`}
                    >
                      <Card
                        key={i}
                        title={
                          <p className="text-white text-center">
                            {get(res, "name", [])}
                          </p>
                        }
                        bordered={false}
                        style={{
                          width: 250,
                          height: 240,
                          backgroundColor: "black",
                        }}
                      >
                        <Image
                          src={get(res, "image[0]")}
                          width={200}
                          height={120}
                          preview={false}
                        />

                        <div className="flex items-center justify-center gap-2 pt-1">
                          <span>
                            <EditNoteIcon
                              className="!text-green-500 cursor-pointer"
                              onClick={() => {
                                handleEdit(res);
                              }}
                            />
                          </span>
                          <span>
                            <DeleteIcon
                              className="!text-red-500 cursor-pointer"
                              onClick={() => {
                                handleDelete(res);
                              }}
                            />
                          </span>
                        </div>
                      </Card>
                    </Badge.Ribbon>
                  );
                })}
             
              </div>

           
            </Spin>
          </Panel>
        </Collapse>
      </div>
      <Modal open={open} destroyOnClose footer={false} closable={false}>
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Form.Item
            name="name"
            label="Select Banner Name"
            rules={[{ required: true, message: "Select Banner" }]}
          >
            <Select
              placeholder="Select banner name..."
              size="large"
              onChange={(e) => {
                setSelected(e);

                if (fileList.length > 1 && e !== "Advertisement Banner") {
                  form.setFieldsValue({ img: null });
                  setFileList([]);
                }
              }}
            >
              <Option
                value="Banner"
                className={`${
                  get(user, "name")?.split("@")?.includes("banner")
                    ? "!hidden"
                    : "!block"
                } `}
              >
                Banner
              </Option>
              <Option
                value="Top Notch Banner"
                className={`${
                  get(user, "name")?.split("@")?.includes("banner")
                    ? "!hidden"
                    : "!block"
                } `}
              >
                Top Notch Banner
              </Option>
              <Option value="Advertisement Banner">Advertisement Banner</Option>
              <Option
                value="Vegetarian Banner"
                className={`${
                  get(user, "name")?.split("@")?.includes("banner")
                    ? "!hidden"
                    : "!block"
                }`}
              >
                Vegetarian Banner
              </Option>
              <Option
                value="Non Vegetarian Banner"
                className={`${
                  get(user, "name")?.split("@")?.includes("banner")
                    ? "!hidden"
                    : "!block"
                } `}
              >
                Non Vegetarian Banner
              </Option>
            </Select>
          </Form.Item>
          {selected !== "Advertisement Banner" ? (
            <Form.Item
              name="productId"
              label="Select Matching Products"
              rules={[{ required: true, message: "Select maching product" }]}
            >
              <Select
                placeholder="Select matching products..."
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {products.map((res, i) => {
                  return (
                    <Option value={res._id} key={i}>
                      {res.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Enter advertisement content",
                },
              ]}
            >
              <Input.TextArea placeholder="Enter Your Content" />
            </Form.Item>
          )}

          <Form.Item
            name="img"
            rules={[{ required: true, message: "Select banner image" }]}
          >
            <Upload
              onChange={handleChange}
              onRemove={handleRemove}
              fileList={fileList}
              onPreview={(e) => {
              
              }}
              maxCount={selected === "Advertisement Banner" ? 5 : 1}
              listType="picture-card"
              multiple={selected === "Advertisement Banner" || false}
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
                  setSelected("");
                  setFileList([]);
                  setUpdateId("");
                }}
              >
                Cancel
              </Button>
              <Button
                loading={loadingBtn}
                htmlType="submit"
                className="bg-green-500 text-white"
              >
                {updateId !== "" ? "Update" : "Save"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={userModal}
        destroyOnClose
        footer={false}
        closable={false}
        onCancel={() => {
          setUserModal(!userModal);
        }}
      >
        <Table
          dataSource={formattedDatas}
          columns={columns}
          pagination={{
            pageSize: 5,
            current: currentPage,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
        />
        <Button
          onClick={() => {
            exportToExcel(formattedDatas);
          }}
          className="!bg-black !text-white float-right"
        >
          Export Excel
        </Button>
      </Modal>
    </div>
  );
}

export default Banner;
