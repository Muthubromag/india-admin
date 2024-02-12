/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Image, Tabs } from "antd";
import FooterSettings from "./footerSettings";
import ThemeSettings from "./themeSettings";
import axios from "axios";
import { get } from "lodash";
import SocialMediaSettings from "./socialMediaSettings";
import WhoWeAre from "./whoWeAre";

function Footer() {
  const [data, setData] = useState([]);
  const [socialMediaData, setSocialMediaData] = useState([]);

  const fetchData = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_URL}/get_footer`);
      setData(get(result, "data.data"));
      const setSocialMediaDatas = await axios.get(
        `${process.env.REACT_APP_URL}/get_socialmedia`
      );
      setSocialMediaData(get(setSocialMediaDatas, "data.data", []));
    } catch (err) {
      
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const items = [
    {
      key: "1",
      label: "Footer Settings",
      children: <FooterSettings data={data} fetchData={fetchData} />,
    },
    {
      key: "2",
      label: "Social media settings",
      children: <SocialMediaSettings data={data} SocialfetchData={fetchData} />,
    },
    {
      key: "3",
      label: "Theme Settings",
      children: <ThemeSettings data={data} fetchData={fetchData} />,
    },
    {
      key: "4",
      label: "Who We Are",
      children: <WhoWeAre data={data} fetchData={fetchData} />,
    },
  ];

  return (
    <div className="mt-20 pl-3 md:pl-[20vw] text-white">
      <div className="w-[75vw] flex flex-col  lg:flex-row items-center justify-center lg:items-start lg:justify-start gap-5">
        <div className="bg-gradient-to-r  from-black via-gray-800 to-black border rounded-md   h-[500px] flex flex-col   pt-10 w-[50vw]   lg:!w-[30vw] xl:!w-[25vw]">
          {data.map((res, i) => {
            return (
              <div key={i}>
                <div className="py-3 rounded-md w-[120px] mx-auto bg-[--secondary-color] flex items-center justify-center px-2">
                  <Image width={100} src={res.logo} />
                </div>
                <div className="flex flex-col pt-3 items-center justify-center">
                  <h1>{res.name}</h1>
                  <p>{res.email}</p>
                </div>
                <div className="flex flex-col pt-5 pl-10 items-start justify-start">
                  <h1>Address:</h1>
                  <p>{res.address}</p>
                </div>
                <div className="flex flex-col pt-5 pl-10 items-start justify-start">
                  <h1>Contact Number:</h1>
                  <p>{res.contactNumber}</p>
                </div>

                <div className="flex pl-10 gap-1 pt-5">
                  <p>color:</p>
                  <span
                    style={{
                      backgroundColor: get(res, "colors.primaryColor", ""),
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%  ",
                    }}
                  ></span>
                  <span
                    style={{
                      backgroundColor: get(res, "colors.secondaryColor", ""),
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%  ",
                    }}
                  ></span>
                  <span
                    style={{
                      backgroundColor: get(res, "colors.thirdColor", ""),
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%  ",
                    }}
                  ></span>
                  <span
                    style={{
                      backgroundColor: get(res, "colors.fourthColor", ""),
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%  ",
                    }}
                  ></span>
                </div>
                <div className="flex pl-5">
                  {socialMediaData.map((res, i) => (
                    <div
                      className={`flex pt-5 pl-5 gap-2 h-[3vh] w-[3vw] ${
                        res.status ? "block" : "hidden"
                      }`}
                    >
                      <a href={res.link}>
                        <Image
                          src={res.image}
                          alt="social"
                          preview={false}
                          className="w-[100%] h-[100%]"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex h-[80vh">
          <Tabs items={items} className="!w-[70vw] lg:!w-[40vw] xl:w-[50vw]" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
