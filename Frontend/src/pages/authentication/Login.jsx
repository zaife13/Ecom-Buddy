import React, { useContext, useState } from "react";
import Logo1 from "../../Images/Logo.png";
import LoginStyle from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import SignupStyle from "./signupstyle.module.css";
import Img3 from "../../Images/Signup_image.png";
import { AuthContext } from "../../context/auth-context";
import { toast, ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../../utils/toast-message";

function Login() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({});
  const { sendRequest, error } = useHttpClient();

  function handleForm(e) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/ecomm/users/login`,
        "POST",
        JSON.stringify({
          email: inputs.email,
          password: inputs.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      if (responseData.status === "success") {
        toastSuccess("Login Successful!");
        const user = responseData.data.user;
        setTimeout(() => {
          auth.login(user._id, user.role, responseData.token, user.name);
          user.role === "user"
            ? navigate("/dashboard")
            : navigate("/admin/dashboard");
        }, 1500);
      } else {
        toastError(responseData.message);
      }
    } catch (error) {}
  };

  return (
    <>
      <section className={LoginStyle.mainsection}>
        <div className={SignupStyle.section1}>
          <div className={LoginStyle.loginform}>
            <div className={LoginStyle.top_image}>
              <img src={Logo1} alt="" />
            </div>
            <h2 className={LoginStyle.loginheading}>Log In to EcomBuddy</h2>

            <div className={LoginStyle.main_form}>
              <form onSubmit={authSubmitHandler}>
                <ToastContainer />

                <div className={LoginStyle.logintextfield}>
                  <div className={LoginStyle.loginemail}>
                    <p className={LoginStyle.text}>Email</p>

                    <input
                      className={LoginStyle.input}
                      type="email"
                      placeholder="This will be your email"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      required
                      name="email"
                      onChange={(e) => {
                        handleForm(e);
                      }}
                      value={inputs.email}
                    />
                  </div>

                  <div className={LoginStyle.loginpassword}>
                    <p className={LoginStyle.text}>Password</p>
                    <input
                      className={LoginStyle.input}
                      type="password"
                      placeholder="Choose a strong password"
                      required
                      name="password"
                      onChange={(e) => {
                        handleForm(e);
                      }}
                      value={inputs.password}
                    />
                  </div>

                  <div className={LoginStyle.forgetPasswordHolder}>
                    <Link to="/recover-password">
                      <p>Forget password?</p>
                    </Link>
                  </div>
                </div>
                <button
                  id="button"
                  type="submit"
                  className={`${LoginStyle.btn_primary}`}
                >
                  Log In
                </button>
              </form>
              <div className={LoginStyle.bottom_text}>
                <p className={LoginStyle.bottom_para}>
                  Don't have an account?{" "}
                  <Link className={LoginStyle.bottom_link} to="/signup">
                    Register now
                  </Link>
                </p>
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

export default Login;
