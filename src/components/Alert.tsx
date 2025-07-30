import MuiAlert from "@mui/material/Alert";

const Alert = ({
  message,
  type,
}: {
  message: string;
  type: "error" | "warning" | "info";
}) => {
  const getAlertClass = () => {
    switch (type) {
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div>
      <MuiAlert
        className={`${getAlertClass}`}
        variant="filled"
        severity={type}
        style={{
          position: "absolute",
          top: "10%",
          right: "1%",
          transform: "translate(0%, 0%)",
          zIndex: 1000,
          width: "290px",
          borderRadius: 0
        }}
      >
        {message}
      </MuiAlert>
    </div>
  );
};

export default Alert;
