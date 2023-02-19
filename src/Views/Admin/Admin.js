import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../fireabse/config";

export default function Admin() {
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
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
                <Button>
                  <Link to="add-agent" style={{ color: "Aliceblue" }}>
                    Add Agent
                  </Link>
                </Button>
                <Button>
                  <Link to="view-agents" style={{ color: "Aliceblue" }}>
                    View Agents
                  </Link>
                </Button>
                <Button>
                  <Link to="configuration" style={{ color: "Aliceblue" }}>
                    configuration
                  </Link>
                </Button>
              </Toolbar>
            </div>

            <div>
              <Button>
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
