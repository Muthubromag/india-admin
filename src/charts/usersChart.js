/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { get } from "lodash";

const UsersChart = () => {
  const [chartData, setChartData] = useState({});
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/getalluser`
        );
        const users = get(response, "data.message", []);

        if (!users) {
        
          return;
        }

        const lastMonthUsers = users.filter((user) => {
          const userCreatedAt = new Date(user.createdAt);
          const currentMonth = new Date();
          currentMonth.setMonth(currentMonth.getMonth() - 1); // Subtract 1 month
          return (
            userCreatedAt.getMonth() === currentMonth.getMonth() &&
            userCreatedAt.getFullYear() === currentMonth.getFullYear()
          );
        });

        const webUsersCount = lastMonthUsers.filter(
          (user) => user.status === "web"
        ).length;
        const appUsersCount = lastMonthUsers.filter(
          (user) => user.status === "app"
        ).length;

        const data = {
          labels: ["Web Users", "App Users"],
          datasets: [
            {
              data: [webUsersCount, appUsersCount],
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 99, 132, 0.2)",
              ],
              borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
              borderWidth: 1,
            },
          ],
        };

        setChartData(data);
      } catch (error) {
     
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy(); // Destroy the previous chart instance
    }

    if (chartData.labels && chartData.labels.length > 0) {
      const ctx = document.getElementById("usersChart").getContext("2d");
      const newChartInstance = new Chart(ctx, {
        type: "polarArea",
        data: chartData,
      });

      setChartInstance(newChartInstance);
    }
  }, [chartData]);

  return (
    <div>
      <h1 className="text-center text-[--primary-color] font-bold">
        Last Month Users Count
      </h1>
      <canvas id="usersChart" width="400" height="200"></canvas>
    </div>
  );
};

export default UsersChart;
