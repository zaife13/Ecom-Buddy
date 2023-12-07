/* eslint-disable no-undef */
import React, { useContext, useState } from "react";
import SignupStyle from "./signupstyle.module.css";
import Img3 from "../../Images/Signup_image.png";
import EcomBuddyLogo from "../../Images/Logo.png";

import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Link, useNavigate } from "react-router-dom";
import { FacebookTwoTone, Google } from "@mui/icons-material";
import { useHttpClient } from "../../hooks/http-hook";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toastError, toastSuccess } from "../../utils/toast-message";
import jwtDecode from "jwt-decode";
import { AuthContext } from "../../context/auth-context";
import { ToastContainer } from "react-toastify";

export default function Signup() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({});
  const { sendRequest } = useHttpClient();

  function handleForm(e) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  const responseFacebook = (response) => {
    console.log(response);
  };

  const googleLoginSuccess = async (data) => {
    //console.log(data.credential);
    const profile = jwtDecode(data.credential);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/ecomm/users/auth/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": import.meta.env.VITE_BACKEND_URL,
        },
        mode: "cors",
        body: JSON.stringify({
          user: {
            credential: profile,
          },
        }),
      }
    );

    const res = await response.json();
    const user = res.data.user;

    toastSuccess("Signed in successfully");
    setTimeout(() => {
      auth.login(user._id, user.role, res.token, user.name);
      user.role === "user" ? navigate("/dashboard") : navigate("/admin/dashboard");
    }, 1500);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(inputs);
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/ecomm/users/signup`,
        "POST",
        JSON.stringify({
          name: inputs.name,
          email: inputs.email,
          password: inputs.password,
          passwordConfirm: inputs.passwordConfirm,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      const user = responseData.data.user;

      toastSuccess("Signed in successfully");
      setTimeout(() => {
        auth.login(user._id, user.role, responseData.token, user.name);
        user.role === "user" ? navigate("/dashboard") : navigate("/admin/dashboard");
      }, 1500);
      // navigate("/dashboard");
    } catch (error) {
      toastError("Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className={SignupStyle.main_section}>
        <div className={SignupStyle.section1}>
          <div className={SignupStyle.top_image}>
            <img src={EcomBuddyLogo} alt="" />
          </div>
          <h2 className={SignupStyle.loginheading}>Sign Up to EcomBuddy</h2>

          <div className={SignupStyle.main_form}>
            <form onSubmit={authSubmitHandler}>
              <></>

              <div className={SignupStyle.logintextfield}>
                <div className={SignupStyle.entername}>
                  <p className={SignupStyle.text}>Name</p>
                  <label htmlFor="Name" />
                  <input
                    className={SignupStyle.input}
                    type="text"
                    id="Name"
                    name="name"
                    placeholder="First and last name"
                    required
                    onChange={(e) => {
                      handleForm(e);
                    }}
                    value={inputs.name}
                  />
                </div>

                <div className={SignupStyle.loginemail}>
                  <p className={SignupStyle.text}>Email</p>

                  <input
                    className={SignupStyle.input}
                    type="email"
                    name="email"
                    placeholder="This will be your email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    required
                    onChange={(e) => {
                      handleForm(e);
                    }}
                    value={inputs.email}
                  />
                </div>

                <div className={SignupStyle.loginpassword}>
                  <p className={SignupStyle.text}>Password</p>
                  <input
                    className={SignupStyle.input}
                    type="password"
                    name="password"
                    placeholder="Choose a strong password"
                    required
                    onChange={(e) => {
                      handleForm(e);
                    }}
                    value={inputs.password}
                  />
                </div>

                <div className={SignupStyle.loginpassword}>
                  <p className={SignupStyle.text}>Password Confirmation</p>
                  <input
                    className={SignupStyle.input}
                    type="password"
                    name="passwordConfirm"
                    placeholder="Enter the password again"
                    required
                    onChange={(e) => {
                      handleForm(e);
                    }}
                    value={inputs.passwordConfirm}
                  />
                </div>
                {/* <ul className={SignupStyle.list}>
                <li>At least 8 characters</li>
                <li>A mixture of letters,numbers and special characters</li>
              </ul> */}
              </div>

              <button
                id="button"
                type="submit"
                className={`${SignupStyle.btn_primary}`}
              >
                Sign up
              </button>
            </form>
            <div className={SignupStyle.bottom_text}>
              <p className={SignupStyle.bottom_para}>
                Already have an account?{" "}
                <Link className={SignupStyle.bottom_link} to="/login">
                  Login
                </Link>
              </p>
            </div>

            <hr />
            <div className={`${SignupStyle.tp_div}`}>
              <p>Sign Up with:</p>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {/* <div className={SignupStyle.tp_icon} onClick={renderProps.onClick}>
                    <div>
                      <Google />
                    </div>
                  </div> */}

                <GoogleOAuthProvider clientId="1010179090786-iquiuhpl5fbg0gicdu89je8ura4fvqgg.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={(data) => {
                      googleLoginSuccess(data);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </GoogleOAuthProvider>

                {/* <FacebookLogin
                  appId="380989097569545"
                  autoLoad={false}
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <div
                      className={SignupStyle.tp_icon}
                      onClick={renderProps.onClick}
                    >
                      <FacebookTwoTone />
                    </div>
                  )}
                /> */}
              </div>
            </div>
          </div>
        </div>

        <div className={SignupStyle.section2}>
          <div className={SignupStyle.section2_imagediv}>
            <img className={SignupStyle.section2_image} src={Img3} alt="" />
          </div>

          <div className={SignupStyle.main_para}>
            <p className={SignupStyle.section2_para}>
              Absolutely the best product on the market for dealing with anything as
              a seller on Amazon!!!
            </p>
            <p className={SignupStyle.section2_para1}>
              I can not think of anything else that your product could do expect sell
              the products for me! What is even more incredible about this product is
              the Freedom Ticket Training that you get for free with the purchase of
              your product!! Incredibly fantastic product and training!!!
            </p>
            <p className={SignupStyle.section2_para2}>Michael Mosely</p>
          </div>
        </div>
      </section>
    </>
  );
}
