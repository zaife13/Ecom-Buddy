import React, { useState } from "react";
import style from "./forgetPassword.module.scss";
import ForgotIllus from "../../Images/forgetPassIllus.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "../../utils/toast-message";

const ResetPassword = () => {
  const history = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { wrapper, card, illusHolder, headerHolder, contentHolder } = style;

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/ecomm/users/resetPassword/${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": import.meta.env.VITE_BACKEND_URL,
          },
          mode: "cors",
          body: JSON.stringify({ password, passwordConfirm }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setPassword("");
        setPasswordConfirm("");
        toastSuccess("Password Reset Successfully");

        setTimeout(() => {
          history("/login");
        }, 1500);
      } else {
        toastError(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={wrapper}>
      <div className={card}>
        <div className={illusHolder}>
          <img src={ForgotIllus} alt="Recover password" />
        </div>

        <div className={headerHolder}>
          <h3 style={{ marginBottom: "5px" }}>Reset Password</h3>
        </div>

        <div className={contentHolder}>
          <ToastContainer />

          <form
            onSubmit={(e) => {
              resetPassword(e);
            }}
          >
            <input
              type="password"
              placeholder="Enter the new password"
              pattern="[a-z0-9._%+-]{8,}$"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Enter password again"
              pattern="[a-z0-9._%+-]{8,}$"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
            />
            <div style={{ display: "flex", gap: "5px" }}>
              <Button
                type="submit"
                disabled={!password.length || !passwordConfirm.length}
                variant="contained"
                sx={{
                  backgroundColor: "#1C8090",
                  textAlign: "center",
                  margin: "auto",
                  ":hover": { backgroundColor: "#29c0d7" },
                }}
              >
                Submit
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
    </div>
  );
};

export default ResetPassword;
