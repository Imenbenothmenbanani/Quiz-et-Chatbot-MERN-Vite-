import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signUp } from "../services/operations/AuthAPIs";
import Button from "../components/Button";
import RequiredError from "../components/RequiredError";
import HighLightText from "../components/HighLightText";
import { TbEyeClosed, TbEyeCheck } from "react-icons/tb";

const SignUp = () => {
  const [hidePassword, setHidePassword] = useState({
    password: true,
    confirmPassword: true,
  });
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();

  // Définit le rôle par défaut "user"
  useEffect(() => {
    setValue("role", "user");
  }, [setValue]);

  const submitHandler = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Processing your signup...");
    try {
      // Appelle l'API signup
      const response = await signUp(data);

      if (response?.success) {
        toast.success("User registered successfully!");
        navigate("/login"); // redirige vers login après inscription
      } else {
        toast.error(response?.error || "Something went wrong");
      }
    } catch (e) {
      console.error("ERROR WHILE SIGNING UP: ", e);
      toast.error(e?.error || "Server error, please try again");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <section>
        <h1 className="text-center pb-5 text-4xl font-mono underline">Quizzy</h1>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-y-3 max-w-[480px] shadow-lg shadow-blue-300 border p-10 rounded-lg"
        >
          <h3 className="text-4xl pb-5 text-center leading-[1.125]">
            Create Your <HighLightText>Free</HighLightText> Account Now!!!
          </h3>

          {loading && (
            <span className="text-center text-red-500 text-sm">
              Server might take a few seconds to respond. Please wait...
            </span>
          )}

          {/* Username */}
          <span className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              placeholder="Username"
              className="py-1 text-base placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl"
              type="text"
              {...register("username", { required: "Username is required" })}
            />
            {errors?.username && <RequiredError>{errors.username.message}</RequiredError>}
          </span>

          {/* Email */}
          <span className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="Email"
              className="py-1 text-base placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors?.email && <RequiredError>{errors.email.message}</RequiredError>}
          </span>

          {/* Password */}
          <span className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <span className="flex items-center w-full">
              <input
                id="password"
                placeholder="Password"
                className="py-1 text-base placeholder:text-black text-slate-950 w-full rounded-lg px-3 outline-none bg-slate-300 xl:text-xl"
                type={hidePassword.password ? "password" : "text"}
                {...register("password", { required: "Password is required" })}
              />
              <span
                className="p-3 cursor-pointer"
                onClick={() =>
                  setHidePassword((prev) => ({ ...prev, password: !prev.password }))
                }
              >
                {hidePassword.password ? <TbEyeClosed /> : <TbEyeCheck />}
              </span>
            </span>
            {errors?.password && <RequiredError>{errors.password.message}</RequiredError>}
          </span>

          {/* Confirm Password */}
          <span className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <span className="flex items-center w-full">
              <input
                id="confirmPassword"
                placeholder="Confirm Password"
                className="py-1 text-base placeholder:text-black text-slate-950 w-full rounded-lg px-3 outline-none bg-slate-300 xl:text-xl"
                type={hidePassword.confirmPassword ? "password" : "text"}
                {...register("confirmPassword", { required: "Re-enter your password" })}
              />
              <span
                className="p-3 cursor-pointer"
                onClick={() =>
                  setHidePassword((prev) => ({ ...prev, confirmPassword: !prev.confirmPassword }))
                }
              >
                {hidePassword.confirmPassword ? <TbEyeClosed /> : <TbEyeCheck />}
              </span>
            </span>
            {errors?.confirmPassword && (
              <RequiredError>{errors.confirmPassword.message}</RequiredError>
            )}
          </span>

          {/* Role */}
          <span className="flex border border-slate-600 p-1 cursor-pointer w-max gap-3 rounded-full">
            <button
              type="button"
              className={`${role === "user" ? "bg-green-700" : "bg-transparent"} px-3 rounded-full`}
              onClick={(e) => {
                e.preventDefault();
                setValue("role", "user");
                setRole("user");
              }}
            >
              User
            </button>
            <button
              type="button"
              className={`${role === "admin" ? "bg-green-700" : "bg-transparent"} px-3 rounded-full`}
              onClick={(e) => {
                e.preventDefault();
                setValue("role", "admin");
                setRole("admin");
              }}
            >
              Admin
            </button>
          </span>

          {/* Hidden role input */}
          <input type="hidden" {...register("role")} value={role} />

          {/* Submit */}
          <span>
            <Button disabled={loading} variant="primary" type="submit">
              Submit
            </Button>
          </span>

          <p className="text-center mt-3">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-green-500 cursor-pointer">
              Log in
            </span>
          </p>
        </form>
      </section>
    </div>
  );
};

export default SignUp;
