import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "../../constants/ToastConfig";
import {
  logInWithEmailAndPassword,
  getUser,
  getDocs,
  getSeats,
  insertBookings,
  auth,
  setSeats,
} from "../../fireabse/config";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { getConfiguration } from "../../fireabse/config";
import { allocateSeats } from "../../service/BookingService";
import "./BookTicket.css";
function BookTicket() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({});
  const [seatings, setSeatings] = useState();

  const email = auth?.currentUser?.email;
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    formState,
  } = useForm({
    defaultValues: {
      passengerList: [{ name: "", age: "", gender: "" }],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "passengerList", // unique name for your Field Array
    }
  );

  const onSubmit = async (data) => {
    if (isValid) {
      const email = auth.currentUser.email;
      const passengers = data?.passengerList.map((ele) => ({
        ...ele,
        agentId: email,
      }));
      fetchSeats(passengers);
      if (config.agentBookingLimit > passengers.length) {
        console.log("sic");
      } else {
        toast.error("Agent booking limit is only 8 passengers.", toastConfig);
      }
    }
  };

  const fetchSeats = async (passengers) => {
    try {
      const querySnapshot = await getSeats();
      const seats = querySnapshot.data();
      console.log("sea", seats);
      if (seats) {
        const seatMatrix = JSON.parse(seats.seatMatrix);
        console.log("seatmatrix", seatMatrix);
        const [bookings, seatings] = allocateSeats(passengers, seatMatrix);
        console.log("bookings", bookings);
        const id = localStorage.getItem("docId");
        const parsed = id.split('"')[1];
        const result = await insertBookings(parsed, bookings);
        console.log("final result", result);
        toast.success("Tickets Booked Successfully", toastConfig);
        setSeatings(seatings);
        await setSeats(seatings);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message, toastConfig);
    }
  };

  const getConfigurationDetails = async () => {
    try {
      const query = getConfiguration();

      const querySnapshot = await getDocs(query);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("data", data);
        setConfig(data);
      });
    } catch (e) {
      toast.error(e.message, toastConfig);
    }
  };

  const getSeatChar = (seatStr) => {
    const [row, seat] = seatStr.split(",").map(Number);
    return row + 1 * seat + 1;
  };

  useEffect(() => {
    setTimeout(() => {
      getConfigurationDetails();
    }, 2000);
  }, []);

  return (
    <div className="main">
      <div className="">
        <section className="wrapper" style={{ maxWidth: "50rem" }}>
          <div className="heading">
            <h1 className="text text-large">Book Tickets</h1>
          </div>
          {Object.keys(config).length ? (
            <form name="signin" className="form">
              {fields.map((item, index) => (
                <div key={index}>
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <div className="input-control">
                      <input
                        type="name"
                        name="name"
                        id="name"
                        className="input-field"
                        placeholder="Enter passenger name"
                        {...register(`passengerList.${index}.name`, {
                          required: true,
                        })}
                      />
                    </div>
                    <div className="input-control">
                      <input
                        type="number"
                        name="age"
                        id="age"
                        className="input-field"
                        placeholder="Enter passenger age"
                        {...register(`passengerList.${index}.age`, {
                          required: true,
                        })}
                      />
                    </div>
                    <div
                      className="input-container"
                      style={{ marginBottom: "1rem" }}
                    >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={["M", "F"]}
                        renderInput={(params) => {
                          return (
                            <TextField
                              placeholder="Gender"
                              {...params}
                              {...register(`passengerList.${index}.gender`, {
                                required: true,
                              })}
                            />
                          );
                        }}
                      />
                    </div>

                    <div>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => {
                          append({
                            name: "",
                            age: 0,
                            gender: "",
                          });
                        }}
                      >
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        disabled={index === 0 && fields.length === 1}
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="input-control"
                style={{ justifyContent: "center" }}
              >
                <input
                  type="submit"
                  name="submit"
                  className="input-submit"
                  value="Book Tickets"
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </form>
          ) : (
            "Loading..."
          )}
        </section>

        {seatings && (
          <div className="flex-container">
            {seatings.map((row, rowIndex) => (
              <div key={rowIndex} className="flex-row">
                {row.map((seat, seatIndex) => (
                  <div
                    key={seatIndex}
                    className={`flex-item ${seat !== 0 ? "occupied" : ""} `}
                  >
                    {seat !== 0 ? getSeatChar(seat.seat) : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookTicket;
