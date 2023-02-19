import React, { memo, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "../../constants/ToastConfig";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  getUsersList,
  getDocs,
  getUser,
  deleteUserAccount,
} from "../../fireabse/config";

function Login() {
  const [agents, SetAgents] = useState([]);
  const fetchAllUsers = async () => {
    const userQuery = getUsersList();
    const querySnapshot = await getDocs(userQuery);
    querySnapshot.forEach((doc) => {
      const document = doc.data();
      SetAgents((prev) => {
        if (document.role === "agent") {
          return [...prev, document];
        } else {
          return prev;
        }
      });
    });
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const deleteUser = async (row) => {
    const userQuery = getUser(row.email);
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach(async (doc) => {
      deleteUserAccount(doc.id)
        .then(() => {
          SetAgents([]);
          fetchAllUsers();
          toast.success("user deleted successfully", toastConfig);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.message);
        });
    });
  };
  return (
    <div className="student-container">
      <h1 className="text text-large">Agents List</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Agent Email</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents &&
              agents.map((row) => (
                <TableRow
                  key={row?.uid}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row?.uid}</TableCell>

                  <TableCell>{row?.email}</TableCell>
                  <TableCell>
                    {row?.answer ? (
                      row?.answer
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteUser(row);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default memo(Login);
