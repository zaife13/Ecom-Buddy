import { Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Person } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import UserForm from "./UserForm";
import styles from "./adduser.module.css";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { AuthContext } from "../../../context/auth-context";
import { toastError, toastSuccess } from "../../../utils/toast-message";
import { ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const AddUser = ({ userType, edit = false }) => {
  const [action, setAction] = useState("Add");

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // get the dynamic id from the url : /admin/edit-user/:id
  const { id } = useParams();

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (edit) {
      setAction("Edit");
      // fetch the user data and set the form values
      fetch(`${import.meta.env.VITE_BACKEND_URL}/ecomm/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            // set the form values
            const user = data.data.user;
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("password", user.password);
            setValue("confirmPassword", user.password);
            setValue("role", user.role);
          } else {
            toastError(data.message);
          }
        });
    }

    return () => {
      setAction("Add");
      reset();
    };
  }, [edit, id, setValue, reset, auth.token]);

  const onSubmit = (formData) => {
    const url = !edit ? "ecomm/users/createUser" : `ecomm/users/${id}`;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
      method: !edit ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
        role: formData.role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          toastSuccess(`${userType} ${action}ed successfully`);
          reset();
          setTimeout(() => {
            navigate(`/admin/view-${userType}s`);
          }, 1500);
        } else {
          toastError(data.message);
        }
      });
  };

  return (
    <div>
      <ToastContainer />
      <div className={styles.formContainer}>
        <section className={styles.formSection}>
          <h1 className={styles.formHeading}>
            <Person sx={{ mr: 1 }} fontSize="large" />
            <p>
              {action} {userType}
            </p>
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ mt: 5, px: 2 }}>
              <UserForm
                control={control}
                getValues={getValues}
                setValue={setValue}
                errors={errors}
                edit={edit}
                userType={userType}
              />
              <Grid item xs={12} textAlign={"center"} sx={{ mt: 2, p: 2 }}>
                <button type="submit" className={styles.formButton}>
                  <PeopleAltIcon sx={{ mr: 1 }} fontSize="small" />
                  <span className={styles.formSpan}>
                    {action} {userType}
                  </span>
                </button>
              </Grid>
            </Grid>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AddUser;
