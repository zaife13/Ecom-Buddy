import React, { useState } from "react";
import style from "./forgetPassword.module.scss";
import ForgotIllus from "../../Images/forgetPassIllus.jpg";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

export default function ForgetPassword() {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const { wrapper, card, illusHolder, headerHolder, contentHolder } = style;

  const requestRecoveryLink = async (e) => {
    e.preventDefault();
    console.log(email);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/ecomm/users/forgotPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        setEmail("");
        toast.success(data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Invalid User", {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Invalid User", {
        position: "top-center",
      });
    }
  };
  return (
    <div className={wrapper}>
      <div className={card}>
        <div className={illusHolder}>
          <img src={ForgotIllus} alt="Recover password" />
        </div>

        <div className={headerHolder}>
          <h3 style={{ marginBottom: "5px" }}>Forgot password?</h3>
          <p style={{ fontWeight: "light" }}>
            Enter your email and we will send you instructions on your email-address
          </p>
        </div>

        <div className={contentHolder}>
          <form
            onSubmit={(e) => {
              requestRecoveryLink(e);
            }}
          >
            <input
              type="email"
              placeholder="Enter email-address"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              value={email}
              onChange={(e) => {
                console.log(e.target.value);
                setEmail(e.target.value);
              }}
            />

            <div style={{ display: "flex", gap: "5px" }}>
              <Button
                type="submit"
                disabled={!email.length}
                variant="contained"
                sx={{
                  backgroundColor: "#1C8090",
                  textAlign: "center",
                  margin: "auto",
                  ":hover": { backgroundColor: "#29c0d7" },
                }}
              >
                Send Email
              </Button>

              <Button
                variant="outlined"
                sx={{ borderColor: "#1C8090", textAlign: "center", margin: "auto" }}
                onClick={() => {
                  history("/login");
                }}
              >
                Back to login
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
