import React from "react";
import Navbar from "../Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-[920px]:flex max-[920px]:flex-col">
      <Navbar />
      <div className="ml-80 max-xl:ml-60 max-[920px]:mt-20 max-[920px]:ml-0">{children}</div>
    </section>
  );
}
