"use client";

import { Backdrop, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@mui/joy";
import { Email, Lock } from "@mui/icons-material";
import { loginAdmin } from "@/app/actions/api";
import { setAuthAdmin } from "@/app/actions/cookie";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  async function handleLogin() {
    console.log("handle login");
    setLoading(true);
    try {
      const response = await loginAdmin(email, password);
      await setAuthAdmin(response.token);
      setLoading(false);
      router.push("/admin/search-guests");
      console.log(response)
    } catch(error) {
      setLoading(false);
      console.log(error)

    }
  }

  return (
    <>
      <div className=" ">
        <div className="flex self-center justify-center min-h-[100vh]  items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="flex flex-col bg-white  rounded-3xl shadow-xl border max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center max-md:space-y-7 md:space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100vh] w-[470px]  "
          >
            {/* <Image height={130} className="-mb-4" src={logo} alt="logo" /> */}
            <div className="text-[32px] font-medium  ">Login</div>
            <div className="mt-1 w-[100%]">
              <Input
                required
                startDecorator={<Email />}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHelperText("");
                  setError(false);
                }}
                size="lg"
                value={email}
                error={error}
                placeholder="Email Address"
                id="myfilled-name"
                fullWidth
              />
            </div>
            <div className="mt-1 w-[100%]">
              <Input
                required
                startDecorator={<Lock />}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHelperText("");
                  setError(false);
                }}
                size="lg"
                type="password"
                placeholder="Password"
                value={password}
                error={error}
                id="myfilled-name"
                fullWidth
              />
            </div>
            <Button type="submit"  loading={loading} size="lg"  fullWidth>
              Sign In
            </Button>
            {/* <div className="flex w-full justify-between">
              <div
                onClick={() => {
                  router.push("/forgotpassword");
                }}
                className="w-full text-right cursor-pointer hover:underline"
              >
                Forgot Password?
              </div> 
              </div> */}
          </form>
        </div>
      </div>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </>
  );
}
