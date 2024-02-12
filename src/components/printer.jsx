/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "lodash";
import axios from "axios";

const PrinterSelection = () => {
  const [selectedConnection, setSelectedConnection] = useState("usb"); // Default to USB
  const { name, id } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);


  const [selectedBill, setSelectBill] = useState("kot");
  const [restaurant, setRestaturannt] = useState("kot");

  const fetchData = async () => {
    if (name === "takeaway") {
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/gettakeaway`
      );

      setData(get(result, "data.data", []));
    }
    const result = await axios.get(`${process.env.REACT_APP_URL}/get_footer`);
    setRestaturannt(get(result, "data.data", []))
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((res) => {
        return res._id === id;
      })[0]
    );
  }, [data]);

//   const connectToUSBPrinter = async () => {
//     try {
//       const usbDevice = await navigator.usb.requestDevice({
//         filters: [{ vendorId: 0x1234, productId: 0x5678 }],
//       });
//       await usbDevice.open();
//       alert("Connecting to USB printer...");
//       await usbDevice.close();
//     } catch (error) {
//       console.error("Error connecting to USB printer:", error);
//     }
//   };

//   const connectToBluetoothPrinter = async () => {
//     try {
//       const device = await navigator.bluetooth.requestDevice({
//         acceptAllDevices: true,
//       });
//       const server = await device.gatt.connect();
//       alert("Connecting to Bluetooth printer...");
//       server.disconnect();
//     } catch (error) {
//       console.error("Error connecting to Bluetooth printer:", error);
//     }
//   };

//   const connectToPrinter = async () => {
//     try {
//       if (selectedConnection === "usb") {
//         await connectToUSBPrinter();
//       } else if (selectedConnection === "bluetooth") {
//         await connectToBluetoothPrinter();
//       }
//     } catch (error) {
//       console.error("Error connecting to printer:", error);
//     }
//   };
//   const handleConnectionChange = async (event) => {
//     try {
//       setSelectedConnection(event.target.value);
//       await connectToPrinter(); // Connect to the printer when the connection type changes
//     } catch (error) {
//       console.error("Error connecting to printer:", error);
//     }
//   };


  const handleBillChange = async (event) => {
    try {
      setSelectBill(event.target.value);
    } catch (err) {
      console.log(err);
    }
  };


  const handlePrint = () => {

    if(selectedBill==="kot"){
        const printWindow = window.open("", "_blank");
        printWindow.document.write("<html><head><title>Print</title></head><body>");
        printWindow.document.write("<div>");
        printWindow.document.write("<h1>Printable Bill</h1>");
        printWindow.document.write(`<p>${filteredData.orderId}</p>`);
        printWindow.document.write(`<p>${filteredData.customerName}</p>`);
        printWindow.document.write(`<p>${filteredData.billAmount}</p>`);
        printWindow.document.write("</div>");
        printWindow.document.write("<div>");
        printWindow.document.write(
          '<button onclick="window.print()">Print</button>'
        );
        printWindow.document.write("</div>");
        printWindow.document.write("<div>");
        printWindow.document.write("<hr>");
        printWindow.document.write("</div>");
        printWindow.document.write("<div>");
        printWindow.document.write("<BillPrintable data={data} />");
        printWindow.document.write("</div>");
        printWindow.document.write("</body></html>");
        printWindow.document.close();
    }else{
        const printWindow = window.open("", "_blank");
        printWindow.document.write("<html><head><title>Print</title></head><body>");
        printWindow.document.write("<div>");
        printWindow.document.write("<h1>Printable Bill</h1>");
        printWindow.document.write(`<p>${filteredData.orderId}</p>`);
        printWindow.document.write(`<p>${restaurant[0].name}</p>`);
        printWindow.document.write(`<p>${filteredData.mobileNumber}</p>`);
        printWindow.document.write(`<p>${filteredData.delivery_charge}</p>`);
        printWindow.document.write(`<p>${filteredData.billAmount}</p>`);
        printWindow.document.write("</div>");
        printWindow.document.write("<div>");
        printWindow.document.write(
          '<button onclick="window.print()">Print</button>'
        );
        printWindow.document.write("</div>");
        printWindow.document.write("<div>");
        printWindow.document.write("<hr>");
        printWindow.document.write("</div>");
        printWindow.document.write("<div>");
        printWindow.document.write("<BillPrintable data={data} />");
        printWindow.document.write("</div>");
        printWindow.document.write("</body></html>");
        printWindow.document.close();
    }
   
  };

  return (
    <div className="pl-[20vw] mt-20 text-white flex gap-20">
      {/* <div className="flex flex-col">
        <h1>Printer Selection</h1>
        <div>
          <label>
            <input
              type="radio"
              value="usb"
              checked={selectedConnection === "usb"}
              onChange={handleConnectionChange}
            />
            USB
          </label>
          <label>
            <input
              type="radio"
              value="bluetooth"
              checked={selectedConnection === "bluetooth"}
              onChange={handleConnectionChange}
            />
            Bluetooth
          </label>
        </div>
       
      </div> */}

      <div className="flex flex-col">
        <div>
          <label>
            <input
              type="radio"
              value="kot"
              checked={selectedBill === "kot"}
              onChange={handleBillChange}
            />
            KOT
          </label>
          <label>
            <input
              type="radio"
              value="bill"
              checked={selectedBill === "bill"}
              onChange={handleBillChange}
            />
            Bill
          </label>
        </div>
        <button onClick={handlePrint} className="bg-green-500">
          Print Bill
        </button>
      </div>
    </div>
  );
};

export default PrinterSelection;
