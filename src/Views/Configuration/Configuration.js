import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "../../constants/ToastConfig";
import { createZeroMatrix } from "../../service/BookingService";
import {
  getDocs,
  getConfiguration,
  setConfiguration,
  setSeats,
} from "../../fireabse/config";

function Configuration() {
  const [config, setConfig] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = async (data) => {
    if (isValid) {
      try {
        await setConfiguration({
          compartmentCapacity: parseInt(data.compartmentCapacity),
          agentBookingLimit: parseInt(data.agentBookingLimit),
        });
        await setSeats(createZeroMatrix(data.compartmentCapacity));
        toast.success("Configuration Updated Successfully", toastConfig);
      } catch (e) {
        console.log(e);
        toast.error(
          "Error while saving config, please try again later.",
          toastConfig
        );
      }
    }
  };

  const getConfigurationDetails = async () => {
    try {
      const query = getConfiguration();

      const querySnapshot = await getDocs(query);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("data", data);
        if (data) {
          setConfig(data);
        }
      });
    } catch (e) {
      toast.error(e.message, toastConfig);
    }
  };

  useEffect(() => {
    getConfigurationDetails();
  }, []);

  return (
    <div className="main">
      <div className="">
        <section className="wrapper">
          <div className="heading">
            <h1 className="text text-large">Configuration</h1>
          </div>
          {Object.keys(config).length ? (
            <form name="signin" className="form">
              <div className="input-control">
                <label htmlFor="compartmentCapacity" className="input-label">
                  Compartment Capactity
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Enter compartment capacity"
                  {...register("compartmentCapacity", {
                    required: true,
                    value: config.compartmentCapacity || 0,
                  })}
                />
              </div>
              <div className="error-block">
                {errors.compartmentCapacity?.type === "required" && (
                  <small role="alert">*Compartment capacity is required.</small>
                )}
              </div>
              <div className="input-control">
                <label htmlFor="agentBookingLimit" className="input-label">
                  Agent Booking Limit
                </label>
                <input
                  type="number"
                  id="agentBookingLimit"
                  className="input-field"
                  placeholder="Enter Agent Booking Limit"
                  {...register("agentBookingLimit", {
                    required: true,
                    value: config.agentBookingLimit || 0,
                  })}
                />
              </div>
              <div className="error-block">
                {errors.password?.type === "required" && (
                  <small role="alert">*Agent Booking Limit is required.</small>
                )}
              </div>
              <div
                className="input-control"
                style={{ justifyContent: "center" }}
              >
                <input
                  type="submit"
                  name="submit"
                  className="input-submit"
                  value="Save Configuration"
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </form>
          ) : (
            "Loading..."
          )}
        </section>
      </div>
    </div>
  );
}

export default Configuration;
