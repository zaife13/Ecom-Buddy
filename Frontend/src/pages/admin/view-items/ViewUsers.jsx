import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/auth-context";
import UserTable from "../../../Component/Admin/Tables/UserTable";
import { Typography } from "@mui/material";
import ToggleBlock from "../../../utils/ToggleBlock";
import UserActions from "../../../utils/UserActions";
import { toastSuccess } from "../../../utils/toast-message";
import { ToastContainer } from "react-toastify";

const ViewUsers = (props) => {
  const auth = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const deleteRow = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ecomm/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => {
      if (res.status === 204) {
        toastSuccess("User deleted successfully");
        setUsers(users.filter((row) => row.id !== id));
      }
    });
  };
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <div>
          <Typography variant="body2" color="textSecondary">
            {params.row.name}
          </Typography>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <div>
          <Typography variant="body2" color="textSecondary">
            {params.row.email}
          </Typography>
        </div>
      ),
    },
    {
      field: "active",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <div>
          <Typography variant="body2" color="textSecondary">
            {params.row.active ? "Active" : "Blocked"}
          </Typography>
        </div>
      ),
    },
    {
      field: "Created At",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => (
        <div>
          <Typography variant="body2" color="textSecondary">
            {params.row.createdAt}
          </Typography>
        </div>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <ToggleBlock
            blocked={!params.row.active}
            type={props.type}
            id={params.row.id}
          />
          <UserActions
            text="Are you sure you want to delete the user"
            warningText="This action cannot be undone!"
            id={params.row.id}
            onDeleteRow={deleteRow}
            userType={props.type}
          />
        </div>
      ),
    },
  ];
  useEffect(() => {
    const url = props.type === "admin" ? "ecomm/users?role=admin" : "ecomm/users";
    fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data.users);
        setIsLoading(false);
      });

    return () => {
      setUsers([]);
      setIsLoading(true);
      setSearchValue("");
      setPageSize(10);
    };
  }, [props.type, auth.token]);

  if (!isLoading)
    return (
      <div>
        <ToastContainer />
        <UserTable
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          rows={users}
          columns={columns}
          pageSize={pageSize}
          setPageSize={setPageSize}
          type={props.type}
        />
      </div>
    );

  return <div>Loading...</div>;
};

export default ViewUsers;
