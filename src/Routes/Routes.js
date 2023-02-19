import React, { memo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Wrapper from "../Wrapper/Wrapper";
import Login from "../Views/Login/Login";
import Admin from "../Views/Admin/Admin";
import AddAgent from "../Views/AddAgent/AddAgent";
import AgentsList from "../Views/ListAgent/ListAgent";
import Configuration from "../Views/Configuration/Configuration";
import AgentDashboard from "../Views/AgentDashboard/AgentDashboard";
import AgentProfile from "../Views/AgentProfile/AgentProfile";
import BookTicket from "../Views/BookTicket/BookTicket";
import History from "../Views/History/history";

function RouteComponent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Wrapper>
              <Login />
            </Wrapper>
          }
        ></Route>
        <Route
          path="login"
          element={
            <Wrapper>
              <Login />
            </Wrapper>
          }
        ></Route>
        <Route
          path="admin"
          element={
            <Wrapper>
              <Admin />
            </Wrapper>
          }
        >
          <Route
            path=""
            element={
              <Wrapper>
                <AddAgent />
              </Wrapper>
            }
          ></Route>
          <Route
            path="add-agent"
            element={
              <Wrapper>
                <AddAgent />
              </Wrapper>
            }
          ></Route>
          <Route
            path="view-agents"
            element={
              <Wrapper>
                <AgentsList />
              </Wrapper>
            }
          ></Route>
          <Route
            path="configuration"
            element={
              <Wrapper>
                <Configuration />
              </Wrapper>
            }
          ></Route>
        </Route>
        <Route
          path="agent"
          element={
            <Wrapper>
              <AgentDashboard />
            </Wrapper>
          }
        >
          <Route
            path=""
            element={
              <Wrapper>
                <BookTicket />
              </Wrapper>
            }
          ></Route>
          <Route
            path="book-tickets"
            element={
              <Wrapper>
                <BookTicket />
              </Wrapper>
            }
          ></Route>
          <Route
            path="profile"
            element={
              <Wrapper>
                <AgentProfile />
              </Wrapper>
            }
          ></Route>
          <Route
            path="history"
            element={
              <Wrapper>
                <History />
              </Wrapper>
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default memo(RouteComponent);
