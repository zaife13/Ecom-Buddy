import React, { useState } from "react";
import DashboardStyle from "./dashboardstyle.module.css";

function Dashboard() {
  const [services, setServices] = useState([
    {
      title: "Keyword Tracker",
      subTitle: "Product Rank Tracking",
      description: "Keep track of the changes and visualize how each change affects product listings rank for given keywords.",
      icon: "fa-solid fa-key",
    },
    {
      title: "Index Checker",
      subTitle: "Keyword index checker",
      description: "Figure out which of your back-end and front-end keyword search terms are being indexed by Amazon and which ones are not.",
      icon: "fa-solid fa-scroll",
    },
    {
      title: "Scribbles",
      subTitle: "Listing Optimizer",
      description: "Never miss out on using any valuable keywords when writing fully optimized titles, bullet points, descriptions, and backend search term keywords.",
      icon: "fa-solid fa-pen",
    },
    {
      title: "Amazon Product Research",
      subTitle: "Product Rank Tracking",
      description: "Save time and energy researching every niche in existence on Amazon to find your next perfect product to sell—use Black Box to get results in seconds!",
      icon: "fa-solid fa-box",
    },
  ]);

  return (
    <section className={DashboardStyle.wrapper}>
      <div className={DashboardStyle.text}>
        <p className={DashboardStyle.text1}>Welcome</p>
      </div>
      <div className={DashboardStyle.container3}>
        {services.map((element, index) => (
          <div className={DashboardStyle.con4} key={index}>
            <div className={DashboardStyle.con1}>
              <div className={DashboardStyle.tool_head}>
                <div className={DashboardStyle.tool_icon}>
                  <i className={element.icon}></i>
                </div>
                <a href="#" className={DashboardStyle.tool_head_text}>
                  <span>{element.title}</span>
                  <span className={DashboardStyle.text2}>{element.subTitle}</span>
                </a>
                <br />
              </div>
              <div className={DashboardStyle.tool_body}>{element.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
