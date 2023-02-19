import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerWithEmailAndPassword, addUser } from "../../fireabse/config";
import { toast } from "react-toastify";
import { toastConfig } from "../../constants/ToastConfig";

function AddAgent() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();
  const onSubmit = async (data) => {
    if (isValid) {
      const res = await registerWithEmailAndPassword(data.email, data.password);
      const dbRes = await addUser(res, data.email);
      console.log("dbRes", dbRes);
      if (res && dbRes) {
        toast.success(`Verification link sent to user.`, toastConfig);
        navigate("/admin/view-agents");
      }
      // navigate("/login");
    }
  };
  return (
    <div className="main">
      <section className="wrapper">
        <div className="heading">
          <h1 className="text text-large">Create Agent</h1>
        </div>
        <form name="register" className="form">
          <div className="input-control">
            <label htmlFor="email" className="input-label" hidden>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-field"
              placeholder="Email Address"
              {...register("email", {
                required: true,
                pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
              })}
            />
          </div>
          <div className="error-block">
            {errors.email?.type === "required" && (
              <small role="alert">*Email is required.</small>
            )}
            {errors.email?.type === "pattern" && (
              <small role="alert">*Enter a valid email.</small>
            )}
          </div>
          <div className="input-control">
            <label htmlFor="password" className="input-label" hidden>
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="input-field"
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
            />
          </div>
          <div className="error-block">
            {errors.password?.type === "required" && (
              <small role="alert">*Password is required.</small>
            )}
            {errors.password?.type === "minLength" && (
              <small role="alert">
                *Password should have atleast 6 characters.
              </small>
            )}
          </div>
          <div className="input-control" style={{ justifyContent: "center" }}>
            <input
              type="submit"
              name="submit"
              className="input-submit"
              value="Create Agent"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddAgent;
