import React, { useContext, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

import Dashboard from "@mui/icons-material/Dashboard";
import Inventory from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ProfileIcon from "@mui/icons-material/ContactPage";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LogoutIcon from "@mui/icons-material/MeetingRoom";
import ModeEdit from "@mui/icons-material/ModeEdit";

import style from "./sidebar.module.css";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

function Sidebar({ open }) {
  const history = useNavigate();
  const auth = useContext(AuthContext);

  const [sidebarMenus] = useState([
    {
      id: 1,
      name: "Dashboard",
      route: "/dashboard",
      icon: Dashboard,
    },
    {
      id: 2,
      name: "Product Hunter",
      route: "/blackbox",
      icon: Inventory,
    },
    {
      id: 3,
      name: "Product Suppliers",
      route: "/suppliers",
      icon: LocalShippingIcon,
    },
    {
      id: 4,
      name: "Market Trends",
      route: "/trends",
      icon: TrendingUpIcon,
    },
    {
      id: 5,
      name: "Product Listing",
      route: "/product-listing",
      icon: ModeEdit,
    },
    {
      id: 6,
      name: "Profile",
      route: "/profile",
      icon: ProfileIcon,
    },
    {
      id: 7,
      name: "Logout",
      route: "/logout",
      icon: LogoutIcon,
    },
  ]);
  function navigateTo(route) {
    history(`/${route}`);
  }

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
        navigateTo("login");
        auth.logout();
      });
  }

  function MenuItemDesign(element) {
    element.isActive = element.route === window.location.pathname;
    if (element.id === 7) {
      return (
        <ListItemButton
          className={style.sidebarItem}
          sx={{ marginTop: 2 }}
          onClick={() => {
            logoutPressed();
          }}
        >
          <ListItemIcon sx={{ mr: open ? -2 : "auto" }}>
            {<element.icon className={style.sidebarIcon} />}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                className={style.sidebarText}
                sx={{
                  opacity: open ? 1 : 0,
                }}
              >
                {element.name}
              </Typography>
            }
          />
        </ListItemButton>
      );
    }
    return (
      <ListItemButton className={style.sidebarItem} sx={{ marginTop: 2 }}>
        <ListItemIcon sx={{ mr: open ? -2 : "auto" }}>
          {<element.icon className={style.sidebarIcon} />}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              className={style.sidebarText}
              sx={{
                opacity: open ? 1 : 0,
              }}
            >
              {element.name}
            </Typography>
          }
        />
      </ListItemButton>
    );
  }

  return (
    <>
      <div>
        <List>
          {sidebarMenus.map((element, index) => (
            <NavLink
              key={index}
              to={element.name === "Logout" ? "#" : element.route}
            >
              {MenuItemDesign(element)}
            </NavLink>
          ))}
        </List>
      </div>
    </>
  );
}

export default Sidebar;
