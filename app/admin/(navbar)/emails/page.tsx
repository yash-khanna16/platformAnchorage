"use client";
import { editEmailTemplate, getEmailTemplate } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { Button } from "@mui/joy";
import React, { useEffect } from "react";

function SendEmails() {
  const [subject, setSubject] = React.useState("");
  const [content, setContent] = React.useState("");
  const [token, setToken] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) setToken(auth.value);
    });
  }, []);
  useEffect(() => {
    if (token !== "") {
      setLoading(true);
      getEmailTemplate(token, "welcome")
        .then((result) => {
          console.log(result);
          setSubject(result.subject);
          setContent(result.content);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          console.log("error getting template");
        });
      console.log(subject, content);
    }
  }, [token]);

  function handleEdit() {
    setLoading(true);
    editEmailTemplate(token, "welcome", content, subject)
      .then((result) => {
        console.log("successfully edited template");
        setLoading(false);
      })
      .catch((error) => {
        console.log("error editing template");
        setLoading(false);
      });
  }
  return (
    <div className="w-[700px] mx-auto pt-10 px-10 max-md:w-full">
      <h1 className=" text-3xl font-bold">Welcome Email Template </h1>
      <form className=" mx-auto">
        <div className=" mt-[40px] space-y-2 ">
          <div className="flex flex-col">
            <label htmlFor="sendEmail">Email</label>
            <input
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              type="text"
              name="sendEmail"
              placeholder="Subject"
              id="sendEmail"
              className="border-2 mt-2 focus:outline-[#1A80E5] rounded-lg p-3"
            />
          </div>
          <div className="flex mt-5 flex-col">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              name="guestCompany"
              rows={8}
              placeholder="Write a message here...."
              id="guestCompany"
              className="border-2 mt-2 focus:outline-[#1A80E5] rounded-lg p-4 bg-gray-100"
            />
          </div>
        </div>
        <Button loading={loading} onClick={handleEdit} fullWidth className="mt-4" type="submit">
          Edit Template
        </Button>
      </form>
    </div>
  );
}

export default SendEmails;
