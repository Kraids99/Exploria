import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const defaultButtons = {
  confirmButtonColor: "#2563eb", 
  cancelButtonColor: "#6b7280", 
  buttonsStyling: false,
  didOpen: (popup) => {
    const actions = popup.querySelector(".swal2-actions");
    if (actions) {
      actions.style.gap = "12px";
    }
  },
  customClass: {
    confirmButton:
      "swal2-confirm px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-200",
    cancelButton:
      "swal2-cancel px-5 py-2.5 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-200",
    popup: "rounded-2xl shadow-lg",
  },
};

export function alertSuccess(title, text) {
  return MySwal.fire({
    icon: "success",
    title,
    text,
    ...defaultButtons,
  });
}

export function alertError(title, text) {
  return MySwal.fire({
    icon: "error",
    title,
    text,
    ...defaultButtons,
  });
}

export function alertWarning(title, text) {
  return MySwal.fire({
    icon: "warning",
    title,
    text,
    ...defaultButtons,
  });
}

export function alertConfirm({
  title,
  text,
  confirmButtonText = "Ya",
  cancelButtonText = "Batal",
  icon = "warning",
}) {
  return MySwal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    ...defaultButtons,
  });
}

export default MySwal;