import { Box, Icon, Typography } from "@mui/material";
import React from "react";
import SearchField from "../../../utils/SearchField";
import { DataGrid } from "@mui/x-data-grid";

const UserTable = ({
  searchValue,
  setSearchValue,
  rows,
  columns,
  pageSize,
  setPageSize,
  type,
}) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        paddingRight: "5%",
        paddingLeft: "5%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // mb: 5,
          p: 1.5,
          gap: 1,
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
          backgroundColor: type === "admin" ? "#3f51b5" : "#1c8090",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            alignItems={"center"}
            sx={{ marginLeft: 1, color: "white" }}
          >
            <Icon sx={{ mr: 1, mb: 0.3 }} fontSize="medium" />
            {type === "admin" ? "View Admins" : "View Users"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            boxShadow: "none",
          }}
        >
          <SearchField searchValue={searchValue} setSearchValue={setSearchValue} />
        </Box>
      </Box>

      <DataGrid
        sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus, .MuiDataGrid-columnHeader:focus":
            {
              outline: "none",
            },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F0F4F6",
            color: "black",
            fontSize: 16,
          },
          boxShadow: "0 5px 5px -5px",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
        rows={rows}
        columns={columns}
        pagination
        pageSize={pageSize}
        rowsPerPageOptions={[10, 25, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        checkboxSelection
        autoHeight
        disableSelectionOnClick
      />
    </Box>
  );
};

export default UserTable;
