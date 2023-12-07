import { toast } from "react-toastify";

function toastError(message) {
  toast.error(message, {
    position: "top-center",
    autoClose: 1500,
    closeOnClick: true,
    pauseOnHover: false,
  });
}

function toastSuccess(message) {
  toast.success(message, {
    position: "top-center",
    autoClose: 500,
    closeOnClick: true,
    pauseOnHover: false,
  });
}

export { toastError, toastSuccess };
