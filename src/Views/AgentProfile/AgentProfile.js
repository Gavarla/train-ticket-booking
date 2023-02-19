import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { toastConfig } from "../../constants/ToastConfig";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  auth,
  getUser,
  getDocs,
  updateUserProfile,
} from "../../fireabse/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AgentProfile() {
  const [id, setUserId] = useState();
  const [user, setUser] = useState([]);
  const [showForm, SetShowForm] = useState(false);
  const [imgUrl, setImgUrl] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();
  const storage = getStorage();

  const onSubmit = async (data) => {
    if (isValid) {
      const storageRef = ref(storage, auth.currentUser.email);

      try {
        const result = await uploadBytes(storageRef, data.profilePicture[0]);
        console.log("res", result);
        await updateUserProfile(id, {
          dob: data.dob,
          address: data.address,
          phoneNo: data.phoneNo,
        });
        toast.success("profile updated successfully.", toastConfig);
        const img = ref(storage, auth.currentUser.email);
        getDownloadURL(img).then((res) => {
          console.log(res);
          setImgUrl(res);
        });
      } catch (e) {
        toast.error(e.message, toastConfig);
      }
    }
  };

  const fetchUserDetails = async () => {
    const email = auth?.currentUser?.email || "";
    const userQuery = getUser(email);
    if (email) {
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc) => {
        const userDetails = doc.data();
        if (userDetails?.role === "agent") {
          SetShowForm(true);
          console.log("u", userDetails);
          setUser(userDetails);
          setUserId(doc.id);
        }
      });
    } else {
      SetShowForm(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchUserDetails();

      const img = ref(storage, auth.currentUser.email);
      getDownloadURL(img).then((res) => {
        console.log(res);
        setImgUrl(res);
      });
    }, 2000);
  }, []);

  return (
    <div className="main">
      <div className="">
        <section className="wrapper">
          <div
            className="heading"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="text text-large">Update Profile</span>
            <span>
              {imgUrl && showForm && (
                <img
                  style={{ width: "30px", height: "30px" }}
                  alt=""
                  src={imgUrl}
                />
              )}
            </span>
          </div>
          {showForm ? (
            <form name="profile" className="form">
              <div className="input-control">
                <input
                  type={"date"}
                  placeholder="select your date of birth"
                  className="input-field"
                  {...register("dob", {
                    required: true,
                    value: user ? user?.dob : "",
                  })}
                />
              </div>
              <div className="error-block">
                {errors.dob?.type === "required" && (
                  <small role="alert">*Date of birth is required.</small>
                )}
              </div>

              <div className="input-control">
                <input
                  type="number"
                  name="phoneNo"
                  id="phoneNo"
                  className="input-field"
                  placeholder="Enter the phone no"
                  {...register("phoneNo", {
                    required: true,
                    value: user ? user?.phoneNo : "",
                  })}
                />
              </div>
              <div className="error-block">
                {errors.email?.type === "required" && (
                  <small role="alert">*Phone No is required.</small>
                )}
              </div>

              <div className="input-control">
                <TextareaAutosize
                  className="input-field"
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Enter your address"
                  {...register("address", {
                    required: true,
                    value: user ? user?.address : "",
                  })}
                />
              </div>
              <div className="error-block">
                {errors.dob?.address === "required" && (
                  <small role="alert">*Address is required.</small>
                )}
              </div>
              <div
                className="input-control"
                style={{ justifyContent: "center" }}
              >
                <Button component="label">
                  <span>
                    Click here to upload Profile Picture{" "}
                    <CloudUploadIcon
                      style={{ position: "relative", top: "5px" }}
                    />
                  </span>{" "}
                  <input
                    className="input-field"
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    {...register("profilePicture", { required: true })}
                  />
                </Button>
                <input
                  type="submit"
                  name="submit"
                  className="input-submit"
                  value="Update Profile"
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
              <div className="error-block">
                {errors.profilePicture?.type === "required" && (
                  <small role="alert">*Profile picture is required.</small>
                )}
              </div>
            </form>
          ) : (
            "loading..."
          )}
        </section>
      </div>
    </div>
  );
}

export default AgentProfile;
