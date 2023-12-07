import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  color: "black",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

export default function TransitionsModal(props) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={props.open}>
          <Box sx={style}>
            <CircularProgress sx={{ fontSize: 36 }} color="success" />
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{
                fontSize: "24px",
              }}
            >
              Fetching Data
            </Typography>
            <Typography
              id="transition-modal-description"
              sx={{ mt: 2, fontSize: 16 }}
            >
              Please wait. This may take a minute...
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
