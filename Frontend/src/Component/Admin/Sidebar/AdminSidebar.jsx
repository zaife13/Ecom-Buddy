import React, { useContext } from "react";
import { AuthContext } from "../../../context/auth-context";
import { NavLink, useNavigate } from "react-router-dom";

// styles
import styles from "./adminsidebar.module.css";

// material-ui
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { Collapse } from "@mui/material";

// icons
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  AdminPanelSettings,
  DoorBack,
  EnhancedEncryption,
  ExpandLess,
  ExpandMore,
  PersonSearch,
} from "@mui/icons-material";

const AdminSidebar = ({ open }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [userClicked, setUserClicked] = React.useState(false);
  const [adminClicked, setAdminClicked] = React.useState(false);

  const handleUserClick = () => {
    setUserClicked(!userClicked);
  };
  const handleAdminClick = () => {
    setAdminClicked(!adminClicked);
  };

  function logoutPressed() {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ecomm/users/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        auth.logout();
        navigate("/login");
      });
  }
  return (
    <>
      <List>
        {/* DASHBOARD */}
        <NavLink to="/admin/dashboard">
          <ListItemButton className={styles.sidebarItem} sx={{ marginTop: 2 }}>
            <ListItemIcon sx={{ mr: open ? -2 : "auto" }}>
              <DashboardIcon className={styles.sidebarIcon} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  className={styles.sidebarText}
                  sx={{
                    opacity: open ? 1 : 0,
                  }}
                >
                  Dashboard
                </Typography>
              }
            />
          </ListItemButton>
        </NavLink>

        {/* Users */}
        <ListItemButton
          onClick={handleUserClick}
          className={styles.sidebarItem}
          sx={{
            justifyContent: open ? "initial" : "center",
            // px: 2.5,
            display: "flex",
            // alignItems: "left",
          }}
        >
          <ListItemIcon
            className={styles.sidebarIcon}
            sx={{
              minWidth: 0,
              mr: open ? 2 : 0,
              justifyContent: "center",
            }}
          >
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                className={styles.sidebarText}
                sx={{
                  opacity: open ? 1 : 0,
                }}
              >
                Manage Users
              </Typography>
            }
            sx={{ opacity: open ? 1 : 0 }}
          />
          {userClicked ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <NavLink to="/admin/add-user">
          <Collapse in={userClicked} timeout="auto" unmountOnExit>
            <ListItemButton sx={{ pl: open ? 6 : 2 }} className={styles.sidebarItem}>
              <ListItemIcon className={styles.sidebarIcon}>
                <GroupAddIcon style={{ fontSize: "20px" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    className={styles.sidebarSubText}
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  >
                    Add User
                  </Typography>
                }
              />
            </ListItemButton>
          </Collapse>
        </NavLink>

        <NavLink to="/admin/view-users">
          <Collapse in={userClicked} timeout="auto" unmountOnExit>
            <ListItemButton className={styles.sidebarItem} sx={{ pl: open ? 6 : 2 }}>
              <ListItemIcon className={styles.sidebarIcon}>
                <PeopleAltIcon style={{ fontSize: "20px" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    className={styles.sidebarSubText}
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  >
                    View All Users
                  </Typography>
                }
              />
            </ListItemButton>
          </Collapse>
        </NavLink>

        {/* ADMIN */}
        <ListItemButton
          onClick={handleAdminClick}
          className={styles.sidebarItem}
          sx={{
            justifyContent: open ? "initial" : "center",
            display: "flex",
          }}
        >
          <ListItemIcon
            className={styles.sidebarIcon}
            sx={{
              minWidth: 0,
              mr: open ? 2 : 0,
              justifyContent: "center",
            }}
          >
            <AdminPanelSettings className={styles.sidebarIcon} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                className={styles.sidebarText}
                sx={{
                  opacity: open ? 1 : 0,
                }}
              >
                Manage Admin
              </Typography>
            }
            sx={{ opacity: open ? 1 : 0 }}
          />
          {userClicked ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <NavLink to="/admin/add-admin">
          <Collapse in={adminClicked} timeout="auto" unmountOnExit>
            <ListItemButton sx={{ pl: open ? 6 : 2 }} className={styles.sidebarItem}>
              <ListItemIcon className={styles.sidebarIcon}>
                <EnhancedEncryption style={{ fontSize: "20px" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    className={styles.sidebarSubText}
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  >
                    Add Admin
                  </Typography>
                }
              />
            </ListItemButton>
          </Collapse>
        </NavLink>

        <NavLink to="/admin/view-admins">
          <Collapse in={adminClicked} timeout="auto" unmountOnExit>
            <ListItemButton className={styles.sidebarItem} sx={{ pl: open ? 6 : 2 }}>
              <ListItemIcon>
                <PersonSearch className={styles.sidebarIcon} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    className={styles.sidebarSubText}
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  >
                    View All Admins
                  </Typography>
                }
              />
            </ListItemButton>
          </Collapse>
        </NavLink>

        {/* LOGOUT */}
        <NavLink to="#" onClick={logoutPressed}>
          <ListItemButton className={styles.sidebarItem} sx={{ marginTop: 2 }}>
            <ListItemIcon sx={{ mr: open ? -2 : "auto" }}>
              <DoorBack className={styles.sidebarIcon} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  className={styles.sidebarText}
                  sx={{
                    opacity: open ? 1 : 0,
                  }}
                >
                  Logout
                </Typography>
              }
            />
          </ListItemButton>
        </NavLink>
      </List>
    </>
  );
};

export default AdminSidebar;
