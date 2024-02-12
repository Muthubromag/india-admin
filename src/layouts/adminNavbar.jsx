/* eslint-disable react-hooks/exhaustive-deps */
import { Button, notification } from "antd";
import React, { useEffect, useState } from "react";
import Logo from "../assets/logo1.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import { changeUserValues } from "../redux/adminUserSlice";
import axios from "axios";
import LoadingPage from "../components/loadingPage";
import { Switch } from "antd";

function AdminNavbar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [status, setStatus] = useState([]);

  const handeLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    sessionStorage.removeItem("selectedKey");
    navigate("/login");
  };

  const handleStatus = async (value) => {
    try {
      await axios.post(`${process.env.REACT_APP_URL}/create_status`, {
        status: value,
      });
      notification.success({ message: "Restaurant status successfully" });
      fetchData();
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/validateToken`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const status = await axios.get(`${process.env.REACT_APP_URL}/get_status`);
      setStatus(get(status, "data.data[0].status"));
      dispatch(changeUserValues(get(result, "data")));
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  return (
    <div>
      {!localStorage.getItem("token") ? (
        <LoadingPage />
      ) : (
        <div className="w-screen !fixed z-40 !h-[8vh] bg-[--secondary-color] border-b py-3  shadow-md flex items-center justify-between lg:px-20 ">
          <div>
            <img src={Logo} alt="logo" className="xsm:w-[14vw] lg:w-[8vw]" />
          </div>
          <div>
            <h1
              className={`xsm:text-[11px] font-semibold sm:text-[13px] md:text-[15px] lg:text-xl text-[--primary-color] ${
                get(user, "name") === undefined ? "hidden" : "block"
              }`}
            >
              {get(user, "name") && `Welcome ${get(user, "name")}`}
            </h1>
          </div>

          <div className={`flex gap-7 items-center justify-center `}>
            <div
              className={`flex items-center justify-center ${
                get(user, "name", "")?.split("@")?.includes("partner") ||
                get(user, "name")?.startsWith("admin")
                  ? "flex"
                  : "hidden"
              }`}
            >
              <p className="text-[--primary-color] font-bold text-[10px] md:text-[16px] pr-2">
                {status ? "On" : "Off"}
              </p>
              <Switch
                checked={status}
                onChange={(checked) => handleStatus(checked)}
              />
            </div>
            <div>
              <Button
                className=" lg:!w-[7vw] h-[3.5vh] sm:h-[4vh] flex items-center justify-center text-[#CD5C08] xsm:text-[10px] lg:text-[14px] text-center !border-slate-400  lg:!h-[4.5vh] hover:scale-105 hover:bg-black duration-1000 hover:!text-white font-semibold"
                htmlType="submit"
                onClick={handeLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNavbar;
