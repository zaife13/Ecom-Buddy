import React from "react";
import Styles from "./homepagestyle.module.css";
import Navbar from "../../Component/navbar/Navbar";
import FeatureSection from "../../Component/featureSection/FeatureSection";
import Img1 from "../../Images/Home_title_image.jpeg";

export default function Homepage() {
  return (
    <>
      <Navbar />
      <div className={Styles.Container}>
        <div className={Styles.conn1}>
          <div className={Styles.title}>
            <p className={Styles.home_title}>Everything you need to sell on amazon and more</p>
            <h2 className={Styles.home_subtitle}>Easily manage and grow a thriving e-commerce business with just one platform.</h2>
          </div>
          <form className={Styles.home_title_form} action="">
            <input className={Styles.input_email} type="text" placeholder="Enter your email-address" id="email" name="email" />
            <br />
            <button type="submit" className={Styles.btn}>
              Sign up for free
            </button>
            <br />
            <span className="{Styles.agree_text}">
              <h5>By entering your email, you agree to receive marketing emails from EcomBuddy.</h5>
            </span>
          </form>
        </div>
        <div className={Styles.conn2}>
          <img className={Styles.Image} id="Image" src={Img1} alt="" />
        </div>
      </div>
      <div className={Styles.section_title}>
        <h2>Everything for Your Business on Amazon</h2>
        <p>One of the Industry's First All-In-One Software for Amazon</p>
      </div>
      <FeatureSection />
    </>
  );
}
