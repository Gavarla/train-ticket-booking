import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../fireabse/config";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    navigate("/login");
    await logout();
  };
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Toolbar>
                <Button color="success">
                  <Link to="book-tickets" style={{ color: "Aliceblue" }}>
                    Book Tickets
                  </Link>
                </Button>
                <Button color="success">
                  <Link to="history" style={{ color: "Aliceblue" }}>
                    History
                  </Link>
                </Button>
                <Button color="success">
                  <Link to="profile" style={{ color: "Aliceblue" }}>
                    Profile
                  </Link>
                </Button>
              </Toolbar>
            </div>

            <div>
              <Button color="success">
                <Link onClick={handleLogout} style={{ color: "Aliceblue" }}>
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </AppBar>
      </Box>
      <Outlet />
    </div>
  );
}
