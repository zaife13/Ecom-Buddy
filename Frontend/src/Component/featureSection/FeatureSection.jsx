import React from "react";
import "./FeatureSection.css";
import Section2_Ecombuddy from "../../Images/Section2_Ecombuddy.png";
import LandingSection3 from "../../Images/landing_section_3.svg";

const MobileSection = () => {
  return (
    <>
      <div className="mobile-section">
        <div className="mobile-sec-img">
          <img src={Section2_Ecombuddy} alt="" />
        </div>
        <div className="mobile-sec-text">
          <span className="grad-text">Faster, More Powerful Product Research</span>
          <br />
          <br />
          <p>
            Easily find a product with our robust 450 million ASIN database, and
            quickly validate your product's success with at-a-glance analytics like
            seasonal trends, profit estimates, and more.
          </p>
          <p className="explore_link">Explore Product Research Tools</p>
        </div>
      </div>
      <div className="mobile-section">
        <div className="mobile-sec-text">
          <span className="grad-text">Find Thousands of Keywords in Seconds</span>
          <br />
          <br />
          <p>
            With multiple keyword search options, like single-word and reverse ASIN
            searches, source everything from backend keywords to low-competition
            phrases, and more.
          </p>
          <p className="explore_link">Explore Keyword Research Tools</p>
        </div>
        <div className="mobile-sec-img-2">
          <img src={LandingSection3} alt="" />
        </div>
      </div>
    </>
  );
};

export default MobileSection;
