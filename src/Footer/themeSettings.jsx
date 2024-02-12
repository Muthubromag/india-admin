import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import axios from "axios";
import { Modal, notification } from "antd";
import { isEmpty } from "lodash";

function ThemeSettings({ data, fetchData }) {
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [color3, setColor3] = useState("");
  const [color4, setColor4] = useState("");

  useEffect(() => {
    if (data.length > 0 && data[0]?.colors) {
      setColor1(data[0].colors.primaryColor || "#FFFFFF");
      setColor2(data[0].colors.secondaryColor || "#FFFFFF");
      setColor3(data[0].colors.thirdColor || "#FFFFFF");
      setColor4(data[0].colors.fourthColor || "#FFFFFF");
    } else {
      setColor1("#FFFFFF");
      setColor2("#FFFFFF");
      setColor3("#FFFFFF");
      setColor4("#FFFFFF");
    }
  }, [data]);

  const handleColorChange = async (color, setColor) => {
    if (isEmpty(data[0]?.logo)) {
      Modal.warning({
        title: "If You Want to Change the theme",
        content: "Add Footer settings First",
        okButtonProps: {
          style: {
            backgroundColor: "blue",
            color: "white",
          },
        },
      });
    } else {
      try {
        const formData = {
          primaryColor: color1,
          secondaryColor: color2,
          thirdColor: color3,
          fourthColor: color4,
        };
        await axios.post(`${process.env.REACT_APP_URL}/create_footer`, formData);
        notification.success({
          message: "Footer settings created successfully",
        });
        fetchData();
      } catch (err) {
        notification.error({ message: "Something went wrong" });
      }
    }
  };

  return (
    <div className="pt-5">
      <h1 className="text-white">Theme Settings</h1>
      <div className="flex lg:w-[40vw] h-[50vh] overflow-y-scroll gap-4 flex-wrap">
        <div>
          <h1 className="text-white">Header*</h1>
          <ChromePicker
            color={color1}
            onChange={(selectedColor) => setColor1(selectedColor.hex)}
          />
          <button
            className="!bg-green-500 py-1 text-white w-[100%]"
            onClick={() => handleColorChange(color1, setColor1)}
          >
            Apply
          </button>
        </div>
        <div>
          <h1 className="text-white">Footer*</h1>
          <ChromePicker
            color={color2}
            onChange={(selectedColor) => setColor2(selectedColor.hex)}
          />
          <button
            className="!bg-green-500 py-1 text-white w-[100%]"
            onClick={() => handleColorChange(color2, setColor2)}
          >
            Apply
          </button>
        </div>
        <div>
          <h1 className="text-white">Options*</h1>
          <ChromePicker
            color={color3}
            onChange={(selectedColor) => setColor3(selectedColor.hex)}
          />
          <button
            className="!bg-green-500 py-1 text-white w-[100%]"
            onClick={() => handleColorChange(color3, setColor3)}
          >
            Apply
          </button>
        </div>
        <div>
          <h1 className="text-white">Heading*</h1>
          <ChromePicker
            color={color4}
            onChange={(selectedColor) => setColor4(selectedColor.hex)}
          />
          <button
            className="!bg-green-500 py-1 text-white w-[100%]"
            onClick={() => handleColorChange(color4, setColor4)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeSettings;
