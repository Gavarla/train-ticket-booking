import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Wrapper(props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {(location.pathname === "/master" ||
        location.pathname === "/student") && (
        <Button
          style={{ marginLeft: "auto", display: "block" ,marginTop: "1rem" , marginRight: "1rem" }}
          variant="contained"
          onClick={() => {
            localStorage.setItem("token", "");
            navigate("/");
          }}
        >
          Logout
        </Button>
      )}
      {props.children}
    </>
  );
}

export default Wrapper;
