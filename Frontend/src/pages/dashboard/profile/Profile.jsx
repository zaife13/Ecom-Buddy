import React, { useContext, useEffect, useState } from "react";
import style from "./profile.module.css";
import { AuthContext } from "../../../context/auth-context";
import { Avatar, Backdrop, Button, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

import { useAuth } from "../../../hooks/auth-hook";
import ImageUpload from "../../../utils/image-upload";

function Main_profile() {
  const auth = useContext(AuthContext);
  const { updateContext } = useAuth();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [image, setImage] = useState("");

  const getImage = (img) => {
    setImage(img);
  };
  const {
    wrapper,
    userCard,
    imageCard,
    userImageHolder,
    userTextInfoHolder,
    profileFields,
    profileField,
    imageBtn,
  } = style;

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/ecomm/users/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        const userData = await res.json();
        const user = userData.data.user;
        setUser(user);
        setName(user.name);
        setEmail(user.email);
        if (user.image) setImage(user.image);
        setIsLoading(false);
      } catch (err) {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 1500,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    }

    setTimeout(() => {
      getUser();
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const formData = new FormData();
      // formData.append("name", name);
      // formData.append("email", email);
      // formData.append("image", image);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/ecomm/users/updateMe`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": import.meta.env.VITE_BACKEND_URL,
            Authorization: `Bearer ${auth.token}`,
          },
          mode: "cors",
          body: JSON.stringify({ name, email }),
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        toast.success("User updated successfully", {
          position: "top-center",
          autoClose: 500,
          closeOnClick: true,
          pauseOnHover: false,
        });
        updateContext(data.data.user.name);
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      } else {
        toast.error(data.message, {
          position: "top-center",
          autoClose: 1500,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return toast.error("Passwords don't match", {
        position: "top-center",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/ecomm/users/updatePassword`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": import.meta.env.VITE_BACKEND_URL,
          Authorization: `Bearer ${auth.token}`,
        },
        mode: "cors",
        body: JSON.stringify({ currentPassword, password, passwordConfirm }),
      }
    );
    const data = await res.json();
    if (data.status === "success") {
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
      toast.success("Password reset successfully", {
        position: "top-center",
        autoClose: 500,
        closeOnClick: true,
        pauseOnHover: false,
      });

      updateContext(null, data.token);
    } else {
      toast.error(data.message, {
        position: "top-center",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className={wrapper}>
      <ToastContainer />

      <div className={userCard}>
        <h3>Update profile information</h3>
        {console.log(image)}
        <form onSubmit={handleSubmit}>
          {/* <ImageUpload getImage={getImage} /> */}
          <div className={`${userCard} ${imageCard}`}>
            <div className={userImageHolder}>
              <Avatar
                sx={{ height: 100, width: 100 }}
                src={`${import.meta.env.VITE_BACKEND_URL}/${image}`}
              />
            </div>

            <div className={userTextInfoHolder}>
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <div>
                {/* <Button variant="contained" component="label">
                  Update Image
                  <input
                    hidden
                    accept="images/*"
                    type="file"
                    name="image"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                  />
                </Button> */}
              </div>
            </div>
          </div>

          <div className={profileFields}>
            <div>
              <p>Name</p>
              <input
                className={profileField}
                type="text"
                name="name"
                value={name}
                placeholder={user.name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div>
              <p>Email</p>
              <input
                className={profileField}
                type="text"
                name="email"
                value={email}
                placeholder={user.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <Button
                sx={{
                  backgroundColor: "#1C8090",
                  borderRadius: "8px",
                  ":hover": { backgroundColor: "#1C8090" },
                }}
                variant="contained"
                type="submit"
                disabled={!name.length && !email.length}
              >
                Update Profile
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className={userCard}>
        <h3>Update Password</h3>
        <form onSubmit={updatePassword}>
          <div className={profileFields}>
            <div>
              <p>Current Password</p>
              <input
                className={profileField}
                type="password"
                name="currentPassword"
                value={currentPassword}
                placeholder="Enter your current Password"
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                }}
              />
            </div>

            <div>
              <p>New Password</p>
              <input
                className={profileField}
                type="password"
                name="password"
                value={password}
                placeholder="Enter your new Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div>
              <p>New Password Confirm</p>
              <input
                className={profileField}
                type="password"
                name="passwordConfirm"
                value={passwordConfirm}
                placeholder="Enter the new password again"
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
              />
            </div>

            <div>
              <Button
                sx={{
                  backgroundColor: "#1C8090",
                  borderRadius: "8px",
                  ":hover": { backgroundColor: "#1C8090" },
                }}
                variant="contained"
                type="submit"
                disabled={!password.length && !passwordConfirm.length}
              >
                Update Password
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Main_profile;
