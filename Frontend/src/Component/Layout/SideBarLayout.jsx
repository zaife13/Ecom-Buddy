import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { Box } from "@mui/material";
import CustomDrawer, { DrawerHeader } from "../Admin/Drawer/CustomDrawer";

function SideBarLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        fontFamily: "poppins",
        height: "100svh",
      }}
    >
      <CustomDrawer userType="User" Sidebar={Sidebar} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}

export default SideBarLayout;
