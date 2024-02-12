/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Select,
  Form,
  Button,
  notification,
  Spin,
  Upload,
  Collapse,
} from "antd";
import {
  DeleteOutlined,
  FileAddOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { get } from "lodash";
import EditNoteIcon from "@mui/icons-material/EditNote";

function Video() {
  const [videoUrl, setVideoUrl] = useState("");
  const { Option } = Select;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const { Panel } = Collapse;
  const [alertShown, setAlertShown] = useState(false);
  const [videoS3, setVideoS3] = useState("");
  const [videoKey, setVideoKey] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [newVideo, setNewVideo] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${process.env.REACT_APP_URL}/getvideo`);
      setData(get(result, "data.data", []));
    } catch (e) {
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadVideo = async (file) => {
    setNewVideo(true);
      setVideoS3(file.file.originFileObj);
  };

  useEffect(() => {
    return () => {
      setAlertShown(false);
    };
  }, []);


  const handleFinish = async (value) => {
    if (!videoS3) {
      alert("Please upload a video before saving.");
      return;
    }
    if (updateId === "") {
      try {
        setLoadingButton(true);
        const data = new FormData();
        data.append("file", videoS3);
        data.append("name", get(value, "name"));
        await axios.post(`${process.env.REACT_APP_URL}/createvideo`, data);
        fetchData();
        notification.success({ message: "Video created successfully" });
        setOpen(!open);
        form.resetFields();
        setVideoUrl("");
      } catch (err) {
      
        if (get(err, "response.data")?.split(" ").includes("limit")) {
          Modal.warning({
            title: err.response.data,
            content:
              "if you really wanna add video you have to delete existing one",
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
    } else {
      try {
        setLoadingButton(true);
        const data = new FormData();
        data.append("file", videoS3 || null);
        data.append("name", get(value, "name"));
        data.append("video",videoUrl);
        await axios.put(
          `${process.env.REACT_APP_URL}/updatevideo/${updateId}`,
          data
        );
        notification.success({ message: "Video updated successfully" });
        fetchData();
        window.location.reload()
        setUpdateId("");
        setOpen(!open);
        form.resetFields();
        setVideoUrl("");
      } catch (err) {
        notification.error({message:"Something went wrong"})
      } finally {
        setLoadingButton(false);
      }
    }
  };

  const handleDelete = async (val) => {
    
    try {
      const data={
        video:get(val,"video","")
      }
      await axios.delete(`${process.env.REACT_APP_URL}/deletevideo/${val._id}`,{data});
      notification.success({ message: "Video deleted successfully" });
      fetchData();
    } catch (e) {
      notification.error({message:"Something went wrong"})
    }
  };

  const handleEdit = (value) => {
    setOpen(!open);
    setUpdateId(value._id);
    form.setFieldsValue(value);
    setVideoUrl(value.video);
    setVideoKey(value.video_key);
  };

  return (
    <div className="pt-28  md:pl-[20vw] ">
      <div className="w-[95vw]  md:w-[80vw] max-h-[75vh]">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
        >
          <Panel
            header={
              <h1 className="text-md text-[#CD5C08] font-semibold">Video</h1>
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
              <div className="w-[95vw] md:w-[80vw] md:pl-14 pt-5 flex gap-5 items-center justify-center md:items-start md:justify-start flex-wrap h-[75vh] overflow-y-scroll">
                {data &&
                  data.map((res, i) => {
                    return (
                      <div
                        key={i}
                        className="bg-black xl:w-[20vw] h-[35vh] rounded-md flex border border-slate-700 flex-col items-center justify-center  py-3 shadow-md"
                      >
                        <div className="text-white flex items-center h-[5vh] justify-center pb-2 border-b-2 w-[100%]">
                          <span>{res.name}</span>
                        </div>
                        <video
                          width="240"
                          height="220"
                          controls
                          className="h-[25vh]"
                        >
                          <source src={res?.video} type="video/mp4" />
                        </video>
                        <div className="text-white flex items-center justify-center gap-4">
                          <span>
                            <EditNoteIcon
                              className="!text-green-500 cursor-pointer !text-[28px]"
                              onClick={() => {
                                handleEdit(res);
                              }}
                            />
                          </span>
                          <span>
                            <DeleteOutlined
                              className="!text-red-500 cursor-pointer !text-[20px]"
                              onClick={() => {
                                handleDelete(res);
                              }}
                            />
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Spin>
          </Panel>
        </Collapse>
      </div>

      <Modal
        open={open}
        footer={false}
        destroyOnClose
        onCancel={() => {
          setOpen(!open);
          form.resetFields();
          setVideoUrl("");
          setUpdateId("")
          setNewVideo(true)
          setLoadingButton(false)
        }}
      >
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Form.Item
            name="name"
            label="Select Video Name"
            rules={[{ required: true, message: "video is required" }]}
          >
            <Select placeholder="Select Video ..." size="large">
              <Option value="BroMag">BroMag</Option>
              <Option value="Restaurant">Restaurant</Option>
            </Select>
          </Form.Item>
          <Upload.Dragger
            name="media"
            accept="video/*"
            showUploadList={{ showRemoveIcon: true }}
            beforeUpload={(file) => {
              return true;
            }}
            maxCount={1}
            onChange={uploadVideo}
          >
            {newVideo === false && updateId !== "" ? (
              <video controls className="w-[100%]">
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : (
              <>
                <p className="ant-upload-drag-icon">
                  <FileAddOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag video file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </>
            )}
          </Upload.Dragger>

          <Form.Item>
            <div className="flex gap-3 !pt-2 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();
                  setVideoUrl("");
                  setUpdateId("");
                  setNewVideo(true)
                  setLoadingButton(false)
                }}
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                loading={loadingButton}
                className="bg-green-500 text-white"
              >
                {updateId ? "Update" : "Save"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Video;
