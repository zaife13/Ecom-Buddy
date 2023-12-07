import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, CircularProgress, Menu, MenuItem } from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";

const ToggleBlock = ({ blocked, hide = false, type, id }) => {
  const auth = useContext(AuthContext);

  const [buttonTextColor, setButtonTextColor] = useState(
    blocked ? "error" : "primary"
  );
  const [isBlocked, setIsBlocked] = useState(blocked);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleBlock() {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ecomm/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        active: isBlocked,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsBlocked(!isBlocked);
        setButtonTextColor(!isBlocked ? "error" : "primary");
        setLoading(false);
        handleClose();
      });
  }

  if (loading) return <CircularProgress size={30} />;
  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        color={buttonTextColor}
        endIcon={<KeyboardArrowDown sx={{ marginLeft: -1, marginRight: 1 }} />}
        size="small"
        sx={{
          padding: "1px 0",
          borderWidth: "1px",
          justifyContent: "center",
          fontFamily: "poppins",
          fontSize: "10px",
          maxWidth: "80px",
          minWidth: "80px",
          paddingLeft: 1,
        }}
      >
        {isBlocked ? "Blocked" : "Active"}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={handleBlock}
          sx={{
            minWidth: "80px",
            justifyContent: "center",
            maxHeight: "12px",
            fontSize: "14px",
          }}
        >
          {isBlocked ? "Unblock" : "Block"}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ToggleBlock;
