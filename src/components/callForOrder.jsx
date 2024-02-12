import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Table,
  notification,
  Modal,
  Form,
  Input,
  Collapse,
  Spin,
  Space,
  Row,
  Col,
  Drawer,
  Image,
} from "antd";
import axios from "axios";
import { get, sum, isEmpty } from "lodash";
import { FileAddOutlined, CaretRightOutlined } from "@ant-design/icons";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useSelector } from "react-redux";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { v4 as uuidv4 } from "uuid";





function CallForOrder() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [inventoryForm] = Form.useForm();
  const [updateId, setUpdateId] = useState("");
  const { Panel } = Collapse;
  const user = useSelector((state) => state.user.user);
  const [kdsOrders, setKdsOrders] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [timeOrders, setTimeOrders] = useState("");

  const [getInventory, setGetInventory] = useState([]);
  const [openInventory, setOpenInventory] = useState(false);
  const [inventortUpdateId, setInventoryUpdateId] = useState("");
  const [updateIdForConsumed, setUpdateIdForConsumed] = useState("");
  const [quantity, setQuantity] = useState("");
  const { Option } = Select;
  const [menu, setMenu] = useState(false);
  const [total, setTotal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredInventoryCategory, setFilteredInventoryCategory] = useState(
    []
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeForm] = Form.useForm();
  const [foodInformationList, setFoodInformationList] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);

  const updateTotalAmount = (e, key) => {
    const orderedFoods = form.getFieldValue("orderedFood");

    const newTotalAmounts = orderedFoods.map((food) => {
      const quantity = food.quantity || 0;
      const selectedFood = menu.find((item) => item.name === food.food);
      const foodPrice = selectedFood ? selectedFood.price : 0;
      return quantity * foodPrice;
    });
    setTotal(sum(newTotalAmounts));

    orderedFoods.map((res, index) => {
      return res.ref_id === key
        ? (res.img = menu.find((res) => res.name === e)?.image)
        : res;
    });
  };

  const calculateModalWidth = () => {
    const baseWidth = 400;
    const minWidth = 400;
    const maxWidth = 800;

    const dataCount = foodInformationList.length;
    const calculatedWidth = baseWidth + dataCount * 100;

    return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getcallorder`
      );
      const inventory = await axios.get(
        `${process.env.REACT_APP_URL}/getinventory`
      );

      const menu = await axios.get(`${process.env.REACT_APP_URL}/getproduct`);
      setMenu(get(menu, "data.data", []));
      setGetInventory(get(inventory, "data.data", []));
      setData(get(result, "data.data"));
    } catch (e) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  useEffect(() => {
    setKdsOrders(
      data.filter((res) => {
        return (
          res.status !== "Order Accepted" && res.status !== "Order received"
        );
      })
    );
  }, [data]);

  const handleStatusChange = async (Id, Status) => {
    if (Status === "Order ready to preparing") {
      setTimeSlot(!timeSlot);
      setTimeOrders(Id._id);

      if (Id.deliveryStatus === "Delivery") {
        const deliveryDatas = {
          location: get(Id,"location",""),
          billAmount: get(Id,"billAmount",""),
          paymentMode: "gpay",
          PickupLocation: "velachery,chennai",
          hotelContactNumber: 9887172128,
          foods: get(Id,"orderedFood",""),
        };

        await axios.post(
          `${process.env.REACT_APP_URL}/create_delivery`,
          deliveryDatas
        );
      }
    } else if (Status === "Order ready to pack") {
      const now = new Date();
      const currentHours = ("0" + now.getHours()).slice(-2) % 12;
      const currentMinutes = ("0" + now.getMinutes()).slice(-2);
      const currentSeconds = ("0" + now.getSeconds()).slice(-2);
      const formattedTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;
      const formData = {
        stopTime: formattedTime,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updatecallorder/${Id._id}`,
        formData
      );

      notification.success({ message: "TimeSlot Added" });
      fetchData();
    }
    if (Status === "Order ready to pick" || Status === "Food ready to pickup") {
      setOpenInventory(!openInventory);
      setInventoryUpdateId(Id._id);
    }
    try {
      const formData = {
        status: Status,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updatecallorder/${Id._id}`,
        formData
      );
      const formData2 = {
        heading: Status,
        field: "Call for order",
        status: `${get(Id,"orderId","")}'S  ${Status}`,
      };
      await axios.post(
        `${process.env.REACT_APP_URL}/createnotification`,
        formData2
      );
      notification.success({ message: "order status updated successfully" });
      fetchData();
    } catch (err) {
      
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusOptions = ["Order accepted", "Order moved to KDS"];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };


  const openPreviewModal = (orderedFood) => {
    setPreviewData(!previewData);
    setFoodInformationList(orderedFood);
  };

  const closePreviewModal = () => {
    setPreviewData(null);
  };

  const qty = [
    {
      id: 1,
      qty: 1,
    },
    {
      id: 2,
      qty: 2,
    },
    {
      id: 3,
      qty: 3,
    },
    {
      id: 4,
      qty: 4,
    },
    {
      id: 5,
      qty: 5,
    },
  ];

  const handleAddField = async () => {
    try {
      if (updateIdForConsumed !== "" && quantity !== "") {
        const formData = {
          consumed:
            Number(
              getInventory.filter((res) => {
                return get(res,"_id") === updateIdForConsumed;
              })[0].consumed
            ) + quantity,
          available:
            Number(
              getInventory.filter((res) => {
                return get(res,"_id") === updateIdForConsumed;
              })[0].available
            ) - quantity,
        };

        await axios.put(
          `${process.env.REACT_APP_URL}/updateinventory/${updateIdForConsumed}`,
          formData
        );
        notification.success({ message: "inventory updated successfully" });
      }
    } catch (err) {
      notification.error({message:"Something went wrong"})
    }
  };

  const handleFinish = async (value) => {
    if (updateId === "") {
      setButtonLoader(true);
      try {
        const formData = {
          customerName: get(value,"customerName",""),
          mobileNumber: get(value,"mobileNumber",""),
          billAmount:
            total +
            (total * 5) / 100 +
            (total * 5) / 100 +
            (total * 10) / 100 +
            50,
          deliveryStatus: get(value,"deliveryStatus",""),
          orderedFood: get(value,"orderedFood",""),
          location: get(value,"location",""),
          gst: (total * 5) / 100,
          deliveryCharge: get(value,"deliveryStatus") === "Delivery" ? 50 : "",
          transactionCharge: (total * 5) / 100,
          packingCharge: (total * 10) / 100,
          orderId:"BIPL031023" +
          uuidv4()?.slice(0, 4)?.toUpperCase() +
          moment(new Date()).format("DMy"),
        };
        const result = await axios.post(
          `${process.env.REACT_APP_URL}/createcallorder`,
          {
            formData,
          }
        );
        const formData2 = {
          heading: "Order received",
          field: "Call for order",
          status: `${get(
            result,
            "data.data.orderId",
            []
          )}'S  ${"Order received"}`,
        };
        await axios.post(
          `${process.env.REACT_APP_URL}/createnotification`,
          formData2
        );
        notification.success({ message: "Call order created successfully" });
        setOpen(!open);
        form.resetFields();
        setTotal("");
        fetchData();
      } catch (err) {
        notification.error({message:"Something went wrong"})
      } finally {
        setButtonLoader(false);
      }
    } else {
      try {
        setButtonLoader(true);
        const formData = {
          customerName: get(value,"customerName",""),
          mobileNumber: get(value,"mobileNumber",""),
          deliveryStatus: get(value,"deliveryStatus",""),
          billAmount:
            total === ""
              ? data.filter((res) => {
                  return get(res,"_id") === updateId;
                })[0].billAmount
              :
              total +
              (total * 5) / 100 +
              (total * 5) / 100 +
              (total * 10) / 100 +
              50,
              orderedFood: get(value,"orderedFood",""),
              location: get(value,"location",""),
          orderId:"BIPL031023" +
          uuidv4()?.slice(0, 4)?.toUpperCase() +
          moment(new Date()).format("DMy"),
        };

        await axios.put(
          `${process.env.REACT_APP_URL}/updatecallorder/${updateId}`,
          formData
        );
        notification.success({ message: "Category Updated successfully" });
        setUpdateId("");
        form.resetFields();
        fetchData();
        setOpen(!open);
        setTotal("");
      } catch (err) {
       
      } finally {
        setButtonLoader(false);
      }
    }
  };

  const handleTimeSlot = async (val) => {
    try {
      const now = new Date();
      const currentHours = ("0" + now.getHours()).slice(-2) % 12;
      const currentMinutes = ("0" + now.getMinutes()).slice(-2);
      const currentSeconds = ("0" + now.getSeconds()).slice(-2);
      const formattedTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;
      const formData = {
        timePicked: val,
        startTime: formattedTime,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updatecallorder/${timeOrders}`,
        formData
      );
      notification.success({ message: "order status updated successfully" });
      fetchData();
      setTimeSlot(!timeSlot);
      timeForm.resetFields();
    } catch (e) {
      notification.error({message:"Something went wrong"})
    }
  };

  const handleEdit = (val) => {
    setOpen(!open);
    form.setFieldsValue(val);
    setUpdateId(get(val, "_id"));
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
      title: <h1 className="text-[10px] md:text-[14px]">Order Id</h1>,
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        return <p className="text-[10px] md:text-[14px]">{formattedDate}</p>;
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Customer Name</h1>,
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Mobile Number</h1>,
      dataIndex: "mobileNumber",
      key: "customerName",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Time</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return (
          <p className="text-[10px] md:text-[14px]">{`${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${ampm}`}</p>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Ordered Foods</h1>,
      dataIndex: "orderedFood",
      key: "orderedFood",
      align: "center",
      render: (orderedFood) => (
        <div className="group bg-white ml-10 shadow-md w-[80px] rounded-md flex flex-col items-center justify-center h-[35px]">
          <Button
            onClick={() => openPreviewModal(orderedFood)}
            type="link"
            size="small"
            className="!text-black  flex items-center justify-center"
          >
            <VisibilityIcon className="!text-[15px]" />
            <p className="ml-2 text-[12px md:text-[14px]">View</p>
          </Button>
        </div>
      ),
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Bill Amount</h1>,
      dataIndex: "billAmount",
      key: "billAmount",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Delivery Status</h1>,
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Location</h1>,
      dataIndex: "location",
      key: "location",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Edit</h1>,
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
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const nextStatusOptions = getNextStatusOptions(status);
        const isDelivered = status === "Delivered" || status === "Picked";
        const isCancelled = status === "Cancelled";
        const isPick =
          status === "Order ready to pick" ||
          status === "Food ready to pickup" ||
          status === "Order out for delivery" ||
          status === "Order reached nearest to you";

        const isbeforeKds =
          status === "Order accepted" || status === "Order received";
        const isTakeAwayStatus = status === "Food ready to pickup";
        const isTakeAway = record.status === "Picked";

        return (
          <>
            {isPick ? (
              <div>
                {!isCancelled && !isDelivered && isTakeAwayStatus ? (
                  <Select
                    value={status}
                    onChange={(newStatus) =>
                      handleStatusChange(record, newStatus)
                    }
                    className="w-[100%]"
                  >
                    <Select.Option value="Picked">Picked</Select.Option>
                    <Select.Option value="Cancelled">Cancelled</Select.Option>
                  </Select>
                ) : (
                  <Select
                    value={status}
                    onChange={(newStatus) =>
                      handleStatusChange(record, newStatus)
                    }
                    className="w-[100%]"
                  >
                    <Select.Option value="Cancelled">Cancelled</Select.Option>
                  </Select>
                )}

                {isCancelled ? (
                  <Button className="bg-red-500 text-white border-none w-[100%]">
                    Cancelled
                  </Button>
                ) : isDelivered ? (
                  <Button className="bg-green-500 text-white border-none w-[100%]">
                    {status === "Picked" ? "Picked" : "Delivered"}
                  </Button>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div>
                {!isCancelled && !isDelivered && (
                  <Select
                    value={status}
                    onChange={(newStatus) =>
                      handleStatusChange(record, newStatus)
                    }
                    className="w-[100%]"
                  >
                    {isbeforeKds &&
                      nextStatusOptions?.map((option, i) => (
                        <Select.Option key={i} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    <Select.Option value="Cancelled">Cancelled</Select.Option>
                  </Select>
                )}

                {isCancelled ? (
                  <Button className="bg-red-500 text-white border-none w-[100%]">
                    Cancelled
                  </Button>
                ) : isDelivered ? (
                  <Button className="bg-green-500 text-white border-none w-[100%]">
                    {isTakeAway ? "Picked" : "Delivered"}
                  </Button>
                ) : (
                  ""
                )}
              </div>
            )}
          </>
        );
      },
    },
  ];

  const handleSetCategory = (value) => {
    setFilteredInventoryCategory(
      getInventory.filter((res) => {
        return get(res,"_id") === value;
      })
    );
  };

  const columnsOperation = [
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
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        return <p className="text-[10px] md:text-[14px]">{formattedDate}</p>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Time</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return (
          <p className="text-[10px] md:text-[14px]">{`${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${ampm}`}</p>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Bill Amount</h1>,
      dataIndex: "billAmount",
      key: "billAmount",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Delivery Status</h1>,
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Location</h1>,
      dataIndex: "location",
      key: "location",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Edit</h1>,
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
      title: <h1 className="text-[10px] md:text-[14px]">Ordered Foods</h1>,
      dataIndex: "orderedFood",
      key: "orderedFood",
      align: "center",
      render: (orderedFood) => (
        <div className="group bg-white ml-10 shadow-md w-[80px] rounded-md flex flex-col items-center justify-center h-[35px]">
          <Button
            onClick={() => openPreviewModal(orderedFood)}
            type="link"
            size="small"
            className="!text-black  flex items-center justify-center"
          >
            <VisibilityIcon className="!text-[15px]" />
            <p className="ml-2 text-[12px md:text-[14px]">View</p>
          </Button>
        </div>
      ),
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const nextStatusOptions = getNextStatusOptions(status);
        const isDelivered = status === "Delivered" || status === "Picked";
        const isCancelled = status === "Cancelled";
        const isPick =
          status === "Order ready to pick" ||
          status === "Food ready to pickup" ||
          status === "Order out for delivery" ||
          status === "Order reached nearest to you";

        const isbeforeKds =
          status === "Order accepted" || status === "Order received";
        const isTakeAwayStatus = status === "Food ready to pickup";
        const isTakeAway = record.status === "Picked";

        return (
          <>
            {isPick ? (
              <div>
                {!isCancelled && !isDelivered && isTakeAwayStatus ? (
                  <Select
                    value={status}
                    onChange={(newStatus) =>
                      handleStatusChange(record, newStatus)
                    }
                    className="w-[100%]"
                  >
                    <Select.Option value="Picked">Picked</Select.Option>
                    <Select.Option value="Cancelled">Cancelled</Select.Option>
                  </Select>
                ) : (
                  <Select
                    value={status}
                    onChange={(newStatus) =>
                      handleStatusChange(record, newStatus)
                    }
                    className="w-[100%]"
                  >
                    <Select.Option value="Cancelled">Cancelled</Select.Option>
                  </Select>
                )}

                {isCancelled ? (
                  <Button className="bg-red-500 text-white border-none w-[100%]">
                    Cancelled
                  </Button>
                ) : isDelivered ? (
                  <Button className="bg-green-500 text-white border-none w-[100%]">
                    {status === "Picked" ? "Picked" : "Delivered"}
                  </Button>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div>
                {!isCancelled && !isDelivered && (
                  <Select
                    value={status}
                    onChange={(newStatus) =>
                      handleStatusChange(record, newStatus)
                    }
                    className="w-[100%]"
                  >
                    {isbeforeKds &&
                      nextStatusOptions?.map((option, i) => (
                        <Select.Option key={i} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    <Select.Option value="Cancelled">Cancelled</Select.Option>
                  </Select>
                )}

                {isCancelled ? (
                  <Button className="bg-red-500 text-white border-none w-[100%]">
                    Cancelled
                  </Button>
                ) : isDelivered ? (
                  <Button className="bg-green-500 text-white border-none w-[100%]">
                    {isTakeAway ? "Picked" : "Delivered"}
                  </Button>
                ) : (
                  ""
                )}
              </div>
            )}
          </>
        );
      },
    },
  ];

  const getNextStatusOptionsinKds = (currentStatus) => {
    const statusOptions = [
      "Order ready to preparing",
      "Order ready to pack",
      "Order ready to pick",
    ];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  const getNextStatusOptionsinKdsTakeAway = (currentStatus) => {
    const statusOptions = [
      "Order ready to preparing",
      "Order ready to pack",
      "Food ready to pickup",
    ];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  useEffect(() => {
    if (
      data.find((res) => {
        return res.status === "Order ready to preparing";
      }) !== undefined
    ) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [data]);

  const kdsColumns = [
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
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        return <p className="text-[10px] md:text-[14px]">{formattedDate}</p>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Ordered Foods</h1>,
      dataIndex: "orderedFood",
      key: "orderedFood",
      align: "center",
      render: (orderedFood) => (
        <div className="group bg-white ml-10 shadow-md w-[80px] rounded-md flex flex-col items-center justify-center h-[35px]">
          <Button
            onClick={() => openPreviewModal(orderedFood)}
            type="link"
            size="small"
            className="!text-black  flex items-center justify-center"
          >
            <VisibilityIcon className="!text-[15px]" />
            <p className="ml-2 text-[12px md:text-[14px]">View</p>
          </Button>
        </div>
      ),
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Inventory</h1>,
      dataIndex: "inventory",
      key: "inventory",
      align: "center",
      render: (inventory) => {
        return (
          <div>
            {isEmpty(inventory) ? (
              <p className="text-[10px] md:text-[14px]">No inventories</p>
            ) : (
              <div>
                {inventory?.map((item, i) => (
                  <p key={i} className="text-[10px] md:text-[14px]">
                    {`${
                      getInventory.filter(
                        (res) => get(res,"_id") === item.productName
                      )[0]?.productName
                    }: ${item.quantity}`}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Time</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return (
          <p className="text-[10px] md:text-[14px]">{`${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${ampm}`}</p>
        );
      },
    },
    {
      title: (
        <h1 className="text-[10px] w-[200px] md:text-[14px]">Time Slot</h1>
      ),
      dataIndex: "timePicked",
      key: "timePicked",
      align: "center",
      render: (name, record) => {
        const formattedTime = currentTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
        const timeMoment = moment(record.startTime, "HH:mm:ss");
        const totalSeconds =
          timeMoment.seconds() +
          timeMoment.minutes() * 60 +
          timeMoment.hours() * 3600;
        const endTime = totalSeconds + Number(record.timePicked);

        const timeString1 = record.startTime;
        const timeString2 = record.stopTime;

        const timeMoment1 = moment(timeString1, "HH:mm:ss");
        const timeMoment2 = moment(timeString2, "HH:mm:ss");

        const totalSeconds1 =
          timeMoment1.hours() * 3600 +
          timeMoment1.minutes() * 60 +
          timeMoment1.seconds();
        const totalSeconds2 =
          timeMoment2.hours() * 3600 +
          timeMoment2.minutes() * 60 +
          timeMoment2.seconds();

        const timeDifferenceInSeconds = Math.abs(totalSeconds2 - totalSeconds1);

        const hours = Math.floor(timeDifferenceInSeconds / 3600);
        const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
        const seconds = timeDifferenceInSeconds % 60;

        return (
          <div className="text-[10px]  md:text-[14px]">
            {record.timePicked === undefined ? (
              <div>No slots</div>
            ) : record.status === "Order ready to preparing" ? (
              <div>
                <p className="text-green-500 font-bold">
                  Start Time:{record.startTime}
                </p>
                <p className="text-blue-500 font-bold">
                  Destination:
                  {`${Math.floor(endTime / 3600) % 12}:${Math.floor(
                    (endTime % 3600) / 60
                  )}:${endTime % 60}`}
                </p>
                <p className="text-red-500 font-bold">Clock: {formattedTime}</p>
              </div>
            ) : (
              <div>
                <p className=" font-semibold">Time Picked:{name / 60} Mins</p>
                <p className="flex items-center justify-center font-semibold">
                  Time Taken:
                  <span
                    className={`${hours === 0 ? "hidden" : "block"}`}
                  >{`${hours}hrs`}</span>
                  <span
                    className={`${minutes === 0 ? "hidden" : "block"} ${
                      hours === 0 ? "pl-0" : "pl-1"
                    }`}
                  >{`${minutes}mins`}</span>
                  <span
                    className={`${minutes === 0 ? "pl-0" : "pl-1"}`}
                  >{`${seconds}secs`}</span>
                </p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const nextStatusOptions =
          record.deliveryStatus === "Take away"
            ? getNextStatusOptionsinKdsTakeAway(status)
            : getNextStatusOptionsinKds(status);
        const isDelivered = status === "Delivered" || status === "Picked";
        const isCancelled = status === "Cancelled";
        const isMovedToKDS = status === "Order moved to KDS";
        const isAfterKds =
          status === "Order ready to pick" ||
          status === "Order out for delivery" ||
          status === "Order reached nearest to you";

        return (
          <div>
            {!isCancelled && !isDelivered && (
              <Select
                value={isMovedToKDS ? "Order received" : status}
                onChange={(newStatus) => handleStatusChange(record, newStatus)}
                className="w-[100%]"
                id="status"
              >
                {!isAfterKds &&
                  nextStatusOptions?.map((option, i) => (
                    <Select.Option key={i} value={option}>
                      {option}
                    </Select.Option>
                  ))}
              </Select>
            )}

            {isCancelled ? (
              <Button id="cancel_button" className="bg-red-500 text-white border-none w-[100%]">
                Cancelled
              </Button>
            ) : isDelivered ? (
              <Button id="delivery_button" className="bg-green-500 text-white border-none w-[100%]">
                {status === "Picked" ? "Picked" : "Delivered"}
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];

  const handleInventory = async (values) => {
    try {
      if (updateIdForConsumed !== "" && quantity !== "") {
        const formData = {
          consumed:
            Number(
              getInventory.filter((res) => {
                return get(res,"_id") === updateIdForConsumed;
              })[0].consumed
            ) + quantity,
          available:
            Number(
              getInventory.filter((res) => {
                return get(res,"_id") === updateIdForConsumed;
              })[0].available
            ) - quantity,
        };

        await axios.put(
          `${process.env.REACT_APP_URL}/updateinventory/${updateIdForConsumed}`,
          formData
        );
        fetchData();
        inventoryForm.resetFields();
        setUpdateIdForConsumed("");
        notification.success({ message: "inventory updated successfully" });
      }

      await axios.put(
        `${process.env.REACT_APP_URL}/updatecallorder/${inventortUpdateId}`,
        values
      );
      notification.success({
        message: "Add inventory in onlineorder successfully",
      });
      fetchData();
      setUpdateIdForConsumed("");
      setOpenInventory(!openInventory);
    } catch (err) {
      notification.error({message:"Something went wrong"})
    }
  };

  return (
    <div className="pt-28 md:pl-[20vw]">
      <div className="w-[99vw] md:w-[80vw]">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
          className="md:!w-[78vw]"
        >
          <Panel
            header={
              <h1 className="text-md !text-[#CD5C08] font-semibold">
                Call for order
              </h1>
            }
            extra={
              <div
                className={`cursor-pointer ${
                  get(user, "name", "")?.split("@")?.includes("kds") ? "hidden" : "block"
                }`}
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
                <div className="lg:p-2 ">
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
                      columns={
                        get(user, "name", "")?.split("@")?.includes("kds")
                          ? kdsColumns
                          : get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                          get(user, "name", "")?.split("@")?.includes("partner")
                          ? columnsOperation
                          : columns
                      }
                      dataSource={
                        get(user, "name", "")?.split("@")?.includes("kds")
                          ? kdsOrders
                          : data
                      }
                      className="overflow-x-scoll"
                      scroll={{
                        x:
                        get(user, "name", "")?.split("@")?.includes("partner")||
                        get(user, "name", "")?.split("@")?.includes("kds") ||
                        get(user, "name", "")?.split("@")?.includes("frontdesk")
                            ? 800
                            : 1700,
                      }}
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
        width={400}
        destroyOnClose
        onClose={() => {
          setOpen(!open);
          setUpdateId("");
          form.resetFields();
        }}
        footer={false}
      >
        <Form layout="vertical" id="details_form" onFinish={handleFinish} form={form}>
          <Form.Item
            name="customerName"
            label="Enter Customer Name"
            rules={[{ required: true }]}
          >
            <Input type="text" id="customer_name" placeholder="customer name..." size="large" />
          </Form.Item>
          <Form.Item
            name="mobileNumber"
            label="Enter Mobile Number"
            rules={[
              {
                required: true,
                message: "Please enter mobile number",
              },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (isNaN(value)) {
                    return Promise.reject("Mobile number has to be a number.");
                  }
                  if (value.length < 10) {
                    return Promise.reject(
                      "Mobile number can't be less than 5 digits"
                    );
                  }
                  if (value.length > 10) {
                    return Promise.reject("Mobile number more than 5 digits");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input type="text" id="mobile_number" placeholder="Mobile number..." size="large" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Enter Location"
            rules={[{ required: true }]}
          >
            <Input.TextArea
            id="location"
              type="text"
              placeholder="Location..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="deliveryStatus"
            label="Enter Delivery Status"
            rules={[{ required: true }]}
          >
            <Select id="delivery_status" placeholder="Enter delivery status...">
              <Select.Option value="Take away">Take away</Select.Option>
              <Select.Option value="Delivery">Delivery</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
          id="order_foods"
            name="orderedFood"
            label="Enter Foods"
            rules={[{ required: true }]}
          >
            <Form.List name="orderedFood">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div key={key}>
                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item
                            label={`Food ${name + 1}`}
                            {...restField}
                            name={[name, "food"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select a food",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder="Select food"
                              style={{ width: "100%" }}
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={(e) => {
                                updateTotalAmount(e, key);
                              }}
                              id="food"
                            >
                              {menu &&
                                menu.map((res, i) => (
                                  <Option key={i} value={res.name}>
                                    {res.name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>

                          {form.getFieldValue([
                            "orderedFood",
                            name,
                            "food",
                          ]) && (
                            <div>
                              Selected Food Price:
                              {
                                menu.filter((res) => {
                                  return (
                                    res.name ===
                                    form.getFieldValue([
                                      "orderedFood",
                                      name,
                                      "food",
                                    ])
                                  );
                                })[0]?.offer
                              }
                            </div>
                          )}
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Please enter quantity",
                              },
                            ]}
                            className="!pt-[30px]"
                          >
                            <Input
                            id="qty"
                              placeholder="Quantity"
                              style={{ width: "100%" }}
                              onChange={updateTotalAmount}
                              size="large"
                            />
                          </Form.Item>
                          {form.getFieldValue([
                            "orderedFood",
                            name,
                            "quantity",
                          ]) && (
                            <div>
                              Quantity:{" "}
                              {form.getFieldValue([
                                "orderedFood",
                                name,
                                "quantity",
                              ])}
                            </div>
                          )}
                        </Col>
                        <Col span={4}>
                          <Button
                          id="remove_button"
                            onClick={() => remove(name)}
                            style={{ width: "60%" }}
                            className="!mt-[35px] flex items-center justify-center text-black text-[20px]"
                          >
                            -
                          </Button>

                          {!isNaN(
                            form.getFieldValue([
                              "orderedFood",
                              name,
                              "quantity",
                            ])
                          ) &&
                            !isNaN(
                              menu.filter((res) => {
                                return (
                                  res.name ===
                                  form.getFieldValue([
                                    "orderedFood",
                                    name,
                                    "food",
                                  ])
                                );
                              })[0]?.offer
                            ) && (
                              <p className="!pt-6">
                                Total:
                                {form.getFieldValue([
                                  "orderedFood",
                                  name,
                                  "quantity",
                                ]) *
                                  menu.filter((res) => {
                                    return (
                                      res.name ===
                                      form.getFieldValue([
                                        "orderedFood",
                                        name,
                                        "food",
                                      ])
                                    );
                                  })[0]?.offer}
                              </p>
                            )}
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={`Food ${name + 1}`}
                            {...restField}
                            name={[name, "ref_id"]}
                            initialValue={key}
                            hidden
                          >
                            <Input id="food_name"/>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%" }}
                    >
                      Add Food
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item>
            <div className="flex gap-3 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button htmlType="submit" loading={buttonLoader} className="bg-green-500 text-white">
                {updateId ? "Update" : "Save"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        open={!!previewData}
        onCancel={closePreviewModal}
        footer={null}
        closable={false}
        width={calculateModalWidth()}
      >
        <div>
          <h1 className="font-bold">Ordered Food Details</h1>
          <div className="flex flex-wrap gap-8">
            {foodInformationList.map((res, i) => {
              return (
                <div className="flex  gap-5 pt-5" key={i}>
                  <div>
                    <Image width={100} src={res.img} preview={false} />
                  </div>
                  <div>
                    <p>Food Name: {res.food}</p>
                    <p>Quantity: {res.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
      <Modal
        title="Pick Time slot"
        open={timeSlot}
        footer={false}
        closable={false}
      >
        <Form layout="vertical" form={timeForm}>
          <Form.Item name="timeSlot" label={"Select Time Slot"}>
            <Select
              onChange={handleTimeSlot}
              placeholder="Select timeSlot"
              className="w-[100%]"
              size="large"
            >
              <Select.Option value="600">10 Minutes</Select.Option>
              <Select.Option value="1200">20 Minutes</Select.Option>
              <Select.Option value="1800">30 Minutes</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal open={openInventory} footer={false} closable={false}>
        <Form
          name="dynamic_form_nest_item"
          onFinish={handleInventory}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          layout="vertical"
          form={inventoryForm}
        >
          <h1>Add inventories</h1>
          <Form.List name="inventory">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "productName"]}
                      rules={[
                        {
                          required: true,
                          message: "name is required",
                        },
                      ]}
                      label={<p className="text-[12px]">Select Product</p>}
                      className="w-[100%]"
                    >
                      <Select
                        placeholder="Select product"
                        onChange={(value) => {
                          setUpdateIdForConsumed(value);
                          handleSetCategory(value);
                        }}
                      >
                        {getInventory.map((res, i) => {
                          return (
                            <Select.Option value={get(res,"_id")} key={i}>
                              {res.productName}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "category"]}
                      rules={[
                        {
                          required: true,
                          message: "category is required",
                        },
                      ]}
                      label={<p className="text-[12px]">Select Category</p>}
                      className="w-[100%]"
                    >
                      <Select placeholder="Select category">
                        {filteredInventoryCategory.map((res, i) => {
                          return (
                            <Select.Option value={res.category} key={i}>
                              {res.category}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: "quantity is required",
                        },
                      ]}
                      label={<p className="text-[12px]">Select Quantity</p>}
                      className="!w-[100%]"
                    >
                      <Select
                        placeholder="Select quantity"
                        onChange={(value) => {
                          setQuantity(value);
                        }}
                      >
                        {qty.map((res, i) => {
                          return (
                            <Select.Option value={res.qty} key={i}>
                              {res.qty}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      handleAddField();
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-green-500 float-right"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CallForOrder;
