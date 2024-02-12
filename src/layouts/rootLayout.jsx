/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import SideNavbar from "./sidenavbar";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import { useDispatch } from "react-redux";
import axios from "axios";
import { changeUserValues } from "../redux/adminUserSlice";
import { get } from "lodash";



function RootLayout() {
  const location = useLocation();
  const dispatch = useDispatch();

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
      dispatch(changeUserValues(get(result, "data")));
    } catch (err) {
   
      
    }
  };

 

  useEffect(() => {
    fetchData();
  }, []);

 

  return (
    <div className="flex">
        <div>
          <div>
            {location.pathname?.split("/")?.includes("login") ? (
              ""
            ) : (
              <div>
                <AdminNavbar />
              </div>
            )}
          </div>
          <div className="flex">
            <div>
              {location.pathname?.split("/")?.includes("login") ? (
                ""
              ) : (
                <div>
                  <SideNavbar />
                </div>
              )}
            </div>

            <div>
              <Outlet />
            </div>
          </div>
        </div>
      
    </div>
  );
}

export default RootLayout;
