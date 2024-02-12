import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Table,
  notification,
  Modal,
  Form,
  Spin,
  Space,
  Image,
} from "antd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { get, isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

function OnlineOrder() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [kdsOrders, setKdsOrders] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [timeOrders, setTimeOrders] = useState("");
  const [getInventory, setGetInventory] = useState([]);
  const [openInventory, setOpenInventory] = useState(false);
  const [form] = Form.useForm();
  const [inventortUpdateId, setInventoryUpdateId] = useState("");
  const [updateIdForConsumed, setUpdateIdForConsumed] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [foodInformationList, setFoodInformationList] = useState([]);
  const [filteredInventoryCategory, setFilteredInventoryCategory] = useState(
    []
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeForm] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getonlineorder`
      );
      const inventory = await axios.get(
        `${process.env.REACT_APP_URL}/getinventory`
      );

      setGetInventory(get(inventory, "data.data", []));
      setData(get(result, "data.data", []));
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
        return get(res,"status") !== "Order accepted" && get(res,"status") !== "Order placed";
      })
    );
  }, [data]);

  const getNextStatusOptions = (currentStatus) => {
    const statusOptions = ["Order accepted", "Order moved to KDS"];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  // const getNextStatusOptionsAfterKds = (currentStatus) => {
  //   const statusOptions = [
  //     "Order out for delivery",
  //     "Order reached nearest to you",
  //     "Delivered",
  //   ];

  //   const currentIndex = statusOptions.indexOf(currentStatus);

  //   return currentIndex < statusOptions.length - 1
  //     ? [statusOptions[currentIndex + 1]]
  //     : [];
  // };

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

  const openPreviewModal = (orderedFood) => {
    setPreviewData(!previewData);
    setFoodInformationList(orderedFood);
  };

  const closePreviewModal = () => {
    setPreviewData(null);
  };

  const handleTimeSlot = async (val) => {
    try {
      const now = new Date();
      const currentHours = ("0" + now.getHours()).slice(-2) % 12;
      const currentMinutes = ("0" + now.getMinutes()).slice(-2);
      const currentSeconds = ("0" + now.getSeconds()).slice(-2);
      const formattedTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;
      const formData = {
        userId:get(timeOrders,"userId",""),
        orderId: get(timeOrders,"orderId",""),
        customerName:get(timeOrders,"customerName",""),
        mobileNumber: get(timeOrders,"mobileNumber",""),
        location: get(timeOrders,"location",""),
        billAmount: get(timeOrders,"billAmount",""),
        orderedFood: get(timeOrders,"orderedFood",[]),
        status: "Order ready to preparing",
        timePicked: val,
        startTime: formattedTime,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updateonlineorder/${timeOrders._id}`,
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

  const handleStatusChange = async (values, Status) => {
    if (Status === "Order ready to preparing") {
      setTimeSlot(!timeSlot);
      setTimeOrders(values);

      const deliveryDatas = {
        orderId: get(values,"orderId",""),
        location: get(values,"location",""),
        billAmount: get(values,"billAmount",""),
        paymentMode: "Gpay",
        PickupLocation: "velachery,chennai",
        hotelContactNumber: 9887172128,
        foods: get(values,"orderedFood",[]),
      };

      await axios.post(
        `${process.env.REACT_APP_URL}/create_delivery`,
        deliveryDatas
      );
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
        `${process.env.REACT_APP_URL}/updateonlineorder/${values._id}`,
        formData
      );
      fetchData();
      notification.success({ message: "TimeSlot Added" });
    }

    if (Status === "Order ready to pick") {
      setOpenInventory(!openInventory);
      setInventoryUpdateId(values._id);
    }

    try {
      const formData = {
        status: Status,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updateonlineorder/${values._id}`,
        formData
      );
      const formData2 = {
        heading: Status,
        field: "Online order",
        status: `${values.orderId}'S  ${Status}`,
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
        setUpdateIdForConsumed("");
        form.resetFields();
        notification.success({ message: "inventory updated successfully" });
      }
      await axios.put(
        `${process.env.REACT_APP_URL}/updateonlineorder/${inventortUpdateId}`,
        values
      );
      notification.success({
        message: "Add inventory in onlineorder successfully",
      });
      fetchData();
      setOpenInventory(!openInventory);
      setInventoryUpdateId("");
    } catch (err) {
     
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
      title: <h1 className="text-[10px] md:text-[14px]">Order Id</h1>,
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
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
      key: "mobileNumber",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
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
      title: <h1 className="text-[10px] md:text-[14px]">Location</h1>,
      dataIndex: "location",
      key: "location",
      align: "center",
      render: (name) => {
        return (
          <>
            {name &&
              name.map((res, i) => {
                return (
                  <div key={i} className="lg:w-[20vw] flex flex-col">
                    <p>Street:{res.streetName}</p>
                    <p>LandMark:{res.landMark}</p>
                    <p>City:{res.city}</p>
                    <p>Pincode:{res.picCode}</p>
                    <p>Street:{res.streetName}</p>
                    <p>State:{res.customerState}</p>
                  </div>
                );
              })}
          </>
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
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const nextStatusOptions = getNextStatusOptions(status);
        const isDelivered = status === "Delivered";
        const isCancelled = status === "Cancelled";
        const isPick =
          status === "Order ready to pick" ||
          status === "Order out for delivery" ||
          status === "Order reached nearest to you";
        const isbeforeKds =
          status === "Order accepted" || status === "Order placed";

        return (
          <>
            {isPick ? (
              <div>
                {!isCancelled && !isDelivered && (
                  <Select
                    value={status}
                    onChange={(newStatus) =>
                      handleStatusChange(record, newStatus)
                    }
                    className="w-[100%]"
                    id="status"
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
                    Delivered
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
                      nextStatusOptions.map((option, i) => (
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
                    Delivered
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

  const columnsOperations = [
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
      title: <h1 className="text-[10px] md:text-[14px]">Order Id</h1>,
      dataIndex: "orderId",
      key: "orderId",
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
      title: <h1 className="text-[10px] md:text-[14px]">Bill Amount</h1>,
      dataIndex: "billAmount",
      key: "billAmount",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
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

        const isDelivered = status === "Delivered";
        const isCancelled = status === "Cancelled";
        const isPick =
          status === "Order ready to pick" ||
          status === "Order out for delivery" ||
          status === "Order reached nearest to you";
        const isbeforeKds =
          status === "Order accepted" || status === "Order placed";

        return (
          <>
            {isPick ? (
              <div>
                {!isCancelled && !isDelivered && (
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
                    Delivered
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
                      nextStatusOptions.map((option, i) => (
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
                    Delivered
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

  useEffect(() => {
    if(data.find(res=>{return get(res,"status")==="Order ready to preparing"})!==undefined){
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
      title: <h1 className="text-[10px] md:text-[14px]">S.no</h1>,
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
      title: <h1 className="text-[10px] md:text-[14px]">Order Id</h1>,
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
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
              <p className="text-[10px] md:text-[14px]">
                {inventory
                  .map(
                    (item) =>
                      `${
                        getInventory.filter((res) => {
                          return res._id === item.productName;
                        })[0]?.productName
                      }: ${item.quantity}`
                  )
                  .join(", ")}
              </p>
            )}
          </div>
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
            id="viewFood"
          >
            <VisibilityIcon className="!text-[15px]" />
            <p className="ml-2 text-[12px md:text-[14px]">View</p>
          </Button>
        </div>
      ),
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
            {get(record,"timePicked") === undefined ? (
              <div>No slots</div>
            ) : get(record,"status") === "Order ready to preparing" ? (
              <div>
                <p className="text-green-500 font-bold">
                  Start Time:{get(record,"startTime","")}
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
        const nextStatusOptions = getNextStatusOptionsinKds(status);
        const isDelivered = status === "Delivered";
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
              <Button className="bg-red-500 text-white border-none w-[100%]">
                Cancelled
              </Button>
            ) : isDelivered ? (
              <Button className="bg-green-500 text-white border-none w-[100%]">
                Delivered
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];

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
                return res._id === updateIdForConsumed;
              })[0].consumed
            ) + quantity,
          available:
            Number(
              getInventory.filter((res) => {
                return res._id === updateIdForConsumed;
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

  const handleSetCategory = (value) => {
    setFilteredInventoryCategory(
      getInventory.filter((res) => {
        return res._id === value;
      })
    );
  };

  const calculateModalWidth = () => {
    const baseWidth = 400;
    const minWidth = 400;
    const maxWidth = 800;

    const dataCount = foodInformationList.length;
    const calculatedWidth = baseWidth + dataCount * 100;

    return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
  };

  
  return (
    <div className="pt-28 md:pl-[20vw]">
      <div className="w-[98vw] md:w-[78vw]">
        <Spin spinning={loading}>
          <Table
            columns={
              get(user, "name", "")?.split("@")?.includes("kds")
                ? kdsColumns
                : get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("partner")
                ? columnsOperations
                : columns
            }
            dataSource={
              get(user, "name", "")?.split("@")?.includes("kds") ? kdsOrders : data
            }
            pagination={{
              pageSize: 5,
              current: currentPage,
              onChange: (page) => {
                setCurrentPage(page);
              },
            }}
            scroll={{
              x:
              get(user, "name", "")?.split("@")?.includes("partner") ||
              get(user, "name", "")?.split("@")?.includes("kds") ||
              get(user, "name", "")?.split("@")?.includes("frontdesk")
                  ? 800
                  : 1800,
            }}
            className="overflow-x-scroll"
          />
        </Spin>
      </div>
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
            {foodInformationList?.map((res, i) => {
              return (
                <div className="flex  gap-5 pt-5" key={i}>
                  <div>
                    <Image width={100} src={res.pic} preview={false} />
                  </div>
                  <div>
                    <p>Food Name: {res.foodName}</p>
                    <p>Price: {res.foodPrice}</p>
                    <p>Quantity: {res.foodQuantity}</p>
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
        <Form layout="vertical" form={timeForm} id="timeslot_form">
          <Form.Item name="timeSlot" label={"Select Time Slot"}>
            <Select
              onChange={handleTimeSlot}
              placeholder="Select timeSlot"
              className="w-[100%]"
              size="large"
              id="time_slot"
            >
              <Select.Option value="600">10 Minutes</Select.Option>
              <Select.Option value="1200">20 Minutes</Select.Option>
              <Select.Option value="1800">30 Minutes</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal open={openInventory} footer={false} closable={false} form={form}>
        <Form
          name="dynamic_form_nest_item"
          onFinish={handleInventory}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          layout="vertical"
          form={form}
          id="inventory_form"
        >
          <h1 className="pb-3">Add Inventories</h1>
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
                        id="product"
                      >
                        {getInventory?.map((res, i) => {
                          return (
                            <Select.Option value={res._id} key={i}>
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
                      <Select placeholder="Select category" id="category">
                        {filteredInventoryCategory?.map((res, i) => {
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
                      className="w-[100%]"
                    >
                      <Select
                        placeholder="Select quantity"
                        id="quantity"
                        onChange={(value) => {
                          setQuantity(value);
                        }}
                      >
                        {qty?.map((res, i) => {
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
                    id="button"
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
              id="submit_button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default OnlineOrder;
