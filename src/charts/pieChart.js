/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { DatePicker } from "antd";

const CallOrderChart = ({ ordersData }) => {
  const [chartData, setChartData] = useState({});
  const [chartInstance, setChartInstance] = useState(null);
  const { RangePicker } = DatePicker;


  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      const last5Dates = getLast5Dates(ordersData);
      const ordersCount = organizeAndCountOrders(ordersData);
  
      const backgroundColors = [
        "rgba(75, 192, 192, 0.2)",
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ];
  
      const initialChartData = {
        labels: last5Dates,
        datasets: [
          {
            label: "Orders Count",
            data: last5Dates.map((date) => ordersCount[date] || 0),
            backgroundColor: backgroundColors,
            borderColor: "white",
            borderWidth: 1,
          },
        ],
      };
  
      setChartData(initialChartData);
      return;
    }
  
    // Calculate the duration between the selected dates
    const durationInDays = Math.abs(dates[1].diff(dates[0], 'days'));
  
    // If the duration is longer than 5 days, show an alert
    if (durationInDays > 5) {
      alert("Please select a date range of 5 days or less.");
      return;
    }
  
    // Filter the data based on the selected date range
    const filteredData = ordersData.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= dates[0] && orderDate <= dates[1];
    });
  
    const filteredDates = getLast5Dates(filteredData);
    const filteredOrdersCount = organizeAndCountOrders(filteredData);
  
    const backgroundColors = [
      "rgba(75, 192, 192, 0.2)",
      "rgba(255, 99, 132, 0.2)",
      "rgba(255, 205, 86, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(153, 102, 255, 0.2)",
    ];
  
    const filteredChartData = {
      labels: filteredDates,
      datasets: [
        {
          label: "Orders Count",
          data: filteredDates.map((date) => filteredOrdersCount[date] || 0),
          backgroundColor: backgroundColors,
          borderColor: "white",
          borderWidth: 1,
        },
      ],
    };
  
    setChartData(filteredChartData);
  };
  


  const getLast5Dates = (data) => {
    const uniqueDates = [
      ...new Set(
        data.map((order) => new Date(order.createdAt).toLocaleDateString())
      ),
    ];
    return uniqueDates.slice(-5);
  };

  const organizeAndCountOrders = (data) => {
    const ordersByDate = {};

    data.forEach((order) => {
      const createdAtDate = new Date(order.createdAt).toLocaleDateString();

      if (ordersByDate[createdAtDate]) {
        ordersByDate[createdAtDate]++;
      } else {
        ordersByDate[createdAtDate] = 1;
      }
    });

    return ordersByDate;
  };

  useEffect(() => {
    const dates = getLast5Dates(ordersData);
    const ordersCount = organizeAndCountOrders(ordersData);

    const backgroundColors = [
      "rgba(75, 192, 192, 0.2)",
      "rgba(255, 99, 132, 0.2)",
      "rgba(255, 205, 86, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(153, 102, 255, 0.2)",
    ];

    const data = {
      labels: dates,
      datasets: [
        {
          label: "Orders Count",
          data: dates.map((date) => ordersCount[date] || 0),
          backgroundColor: backgroundColors,
          borderColor: "white",
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, [ordersData]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy(); 
    }

    if (chartData.labels && chartData.labels.length > 0) {
      const ctx = document.getElementById("callorderchart").getContext("2d");
      const newChartInstance = new Chart(ctx, {
        type: "pie",
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        },
      });

      setChartInstance(newChartInstance);
    }
  }, [chartData]);

  return (
    <div>
      <h1 className="text-center text-[12px] lg:text-[16px] text-[--primary-color] font-bold">
        Last 5 Days Call For Order
      </h1>
      <RangePicker
        style={{ marginBottom: "20px" }}
        format="YYYY-MM-DD"
        onChange={handleDateChange}
        className="flex mt-1 items-center justify-center"
        size="large"
      />
     {chartData?.labels?.length === 0 ? (
        <p className="text-center text-[--primary-color]">No data available</p>
      ) : (
        <canvas id="callorderchart" width="100" height="100"></canvas>
      )}
    </div>
  );
};

export default CallOrderChart;
