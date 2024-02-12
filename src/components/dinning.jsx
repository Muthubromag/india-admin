import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Select,
  Form,
  Table,
  notification,
  Modal,
  Spin,
  Image,
} from "antd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { get } from "lodash";
import { useSelector } from "react-redux";
import moment from "moment";

function Dinning() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [kdsOrders, setKdsOrders] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [timeSlot, setTimeSlot] = useState("");
  const [timeOrders, setTimeOrders] = useState("");
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [foodInformationList, setFoodInformationList] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [form]=Form.useForm()


  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getdinningorder`
      );

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
        return get(res,"status","") !== "Order accepted" && get(res,"status","") !== "Order placed";
      })
    );
  }, [data]);

  const handleStatusChange = async (val, Status) => {
    
    if (Status === "Order ready to preparing") {
      setTimeSlot(!timeSlot);
      setTimeOrders(val);
    } else if (Status === "Order ready to pick") {
      const now = new Date();
      const currentHours = ("0" + now.getHours()).slice(-2) % 12;
      const currentMinutes = ("0" + now.getMinutes()).slice(-2);
      const currentSeconds = ("0" + now.getSeconds()).slice(-2);
      const formattedTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;

      const formData = {
        stopTime: formattedTime,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updatedinningorder/${val._id}`,
        formData
      );
      notification.success({ message: "TimeSlot Added" });
      fetchData();
    }
    try {
      const formData = {
        status: Status,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updatedinningorder/${val._id}`,
        formData
      );
      const formData2 = {
        heading: Status,
        field: "Dinning order",
        status: `${val.orderId}'S  ${Status}`,
      };
      await axios.post(
        `${process.env.REACT_APP_URL}/createnotification`,
        formData2
      );
      notification.success({ message: "order status updated successfully" });
      fetchData();
    } catch (err) {
      notification.error({message:"Something went wrong"})
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusOptions = ["Order accepted", "Order moved to KDS"];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  const getNextStatusOptionsAfterKds = (currentStatus) => {
    const statusOptions = ["Order picked", "Order served", "Cancelled"];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
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
        `${process.env.REACT_APP_URL}/updatedinningorder/${timeOrders._id}`,
        formData
      );
      notification.success({ message: "order status updated successfully" });
      fetchData();
      setTimeSlot(!timeSlot)
     form.resetFields()
    } catch (e) {
      notification.error({message:"Something went wrong"})
    }
  };


  const openPreviewModal = (orderedFood) => {
    setPreviewData(!previewData);
    setFoodInformationList(orderedFood);
  };

  const closePreviewModal = () => {
    setPreviewData(null);
  };

  const getNextStatusOptionsinKds = (currentStatus) => {
    const statusOptions = ["Order ready to preparing", "Order ready to pick"];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
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
      title: <h1 className="text-[10px] md:text-[14px]">User Id</h1>,
      dataIndex: "userId",
      key: "UserId",
      align: "center",
      render: (name, data) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
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
      title: <h1 className="text-[10px] md:text-[14px]">Booking Id</h1>,
      dataIndex: "bookingId",
      key: "bookingId",
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
      title: <h1 className="text-[10px] md:text-[14px]">Table No</h1>,
      dataIndex: "tableNo",
      key: "tableNo",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
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
        const nextOptionsAfterKds = getNextStatusOptionsAfterKds(status);
        const isDelivered = status === "Order served";
        const isCancelled = status === "Cancelled";
        const isPick =
          status === "Order ready to pick" ||
          status === "Order served" ||
          status === "Order picked";
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
                    {nextOptionsAfterKds.map((option) => (
                      <Select.Option key={option} value={option}>
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
                    Order served
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
                      nextStatusOptions.map((option) => (
                        <Select.Option key={option} value={option}>
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
                    Order served
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
      title: <h1 className="text-[10px] md:text-[14px]">Booking Id</h1>,
      dataIndex: "bookingId",
      key: "bookingId",
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
        return <h1 className="tet-[10pxx] md:text-[14px]">{name}</h1>;
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
          <p className="md:text-[14px] text-[10px] ">{`${hours}:${
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
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const nextStatusOptions = getNextStatusOptions(status);
        const nextOptionsAfterKds = getNextStatusOptionsAfterKds(status);
        const isDelivered = status === "Order served";
        const isCancelled = status === "Cancelled";
        const isPick =
          status === "Order ready to pick" ||
          status === "Order served" ||
          status === "Order picked";
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
                    {nextOptionsAfterKds.map((option) => (
                      <Select.Option key={option} value={option}>
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
                    Order served
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
                      nextStatusOptions.map((option) => (
                        <Select.Option key={option} value={option}>
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
                    Order served
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
    if( data.find(
      (res) => (get(res,"status","") === "Order ready to preparing") !== undefined
    )){
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
      title: <h1 className="text-[10px] md:text-[14px]">OrderId</h1>,
      dataIndex: "orderId",
      key: "orderId",
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
          <p className="text-[10px] md:text-[14px] ">{`${hours}:${
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
            ) : get(record,"status") === "Order ready to preparing" ? (
              <div>
                <p className="text-green-500 font-bold">
                  Start Time:{get(record,"startTime")}
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
                    className={`${minutes === 0 ? "hidden" : "block"} ${hours===0?"pl-0":"pl-1"}`}
                  >{`${minutes}mins`}</span>
                  <span className={`${minutes===0?"pl-0":"pl-1"}`}>{`${seconds}secs`}</span>
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
        const isDelivered = status === "Order served";
        const isCancelled = status === "Cancelled";
        const isMovedToKDS = status === "Order moved to KDS";
        const isAfterKds =
          status === "Order ready to pick" ||
          status === "Order picked" ||
          status === "Order served";

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
                  nextStatusOptions.map((option, i) => (
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
                Served
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];

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
      <div className="w-[98vw]  md:w-[78vw]">
        <Spin spinning={loading}>
          <Table
            columns={
              get(user, "name", "")?.split("@")?.includes("kds")
                ? kdsColumns
                :  get(user, "name", "")?.split("@")?.includes("frontdesk")||
                get(user, "name", "")?.split("@")?.includes("partner")
                ? columnsOperations
                : columns
            }
            dataSource={
              get(user, "name", "")?.split("@")?.includes("kds") ? kdsOrders : data
            }
            scroll={{
              x:
              get(user, "name", "")?.split("@")?.includes("partner") ||
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk")
                  ? 1500
                  : 2000,
            }}
            ref={tableRef}
            pagination={{
              pageSize: 5,
              current: currentPage,
              onChange: (page) => {
                setCurrentPage(page);
              },
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
            {foodInformationList.map((res, i) => {
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
        <Form layout="vertical" id="timeslot_form" form={form}>
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
    </div>
  );
}

export default Dinning;
