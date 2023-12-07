import React, { useContext } from "react";
import "./Navbar.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Logo from "../../Images/Logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { Avatar, Button } from "@mui/material";
import stringAvatar from "../../utils/generate-color";
import { LogoutOutlined } from "@mui/icons-material";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const Navbar = (props) => {
  const auth = useContext(AuthContext);
  const history = useNavigate();

  function navigateTo(route) {
    history(`/${route}`);
  }

  return (
    <>
      <ElevationScroll {...props}>
        <AppBar
          sx={{
            background: "#fff",
          }}
        >
          <Toolbar>
            <div className="navbar-container">
              <div className="navbar">
                <div className="logo-links-container">
                  <div className="logo">
                    <img src={Logo} alt="logo" className="navbar-logo" />
                  </div>
                  {auth.token && (
                    <>
                      <div className="desktop-navbar-links">
                        <ul>
                          <li>
                            <p onClick={() => navigateTo("dashboard")}>Dashboard</p>
                          </li>
                          <li>
                            <p onClick={() => navigateTo("blackbox")}>Black box</p>
                          </li>
                          <li>
                            <p onClick={() => navigateTo("product")}>Product Listing</p>
                          </li>
                          <li>
                            <p href="#contact_us">Contact Us</p>
                          </li>
                        </ul>
                      </div>

                      <div className="user-info">
                        {auth.name && <Avatar {...stringAvatar("" + auth.name)} />}
                        <Button variant="outlined" color="error" endIcon={<LogoutOutlined />} onClick={auth.logout}>
                          Logout
                        </Button>
                      </div>
                    </>
                  )}
                  {!auth.token && (
                    <div className="navbar-btns">
                      <button className="signup-btn" onClick={() => navigateTo("signup")}>
                        Sign up for free
                      </button>
                      <button className="login-btn" onClick={() => navigateTo("login")}>
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mobile-navbar-links">
                <ul>
                  <li>
                    <p onClick={() => navigateTo("dashboard")}>Dashboard</p>
                  </li>
                  <li>
                    <p onClick={() => navigateTo("blackbox")}>Black box</p>
                  </li>
                  <li>
                    <p href="#product_listing" onClick={() => navigateTo("product")}>
                      Product Listing
                    </p>
                  </li>
                  <li>
                    <a href="#contact_us">Contact Us</a>
                  </li>
                </ul>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div style={{ marginBottom: "100px" }}></div>
    </>
  );
};

export default Navbar;
