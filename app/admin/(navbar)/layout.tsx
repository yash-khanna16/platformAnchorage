import React from "react";
import Navbar from "../Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-lg:flex max-lg:flex-col">
      <Navbar />
      <div className="ml-80 max-xl:ml-60 max-lg:mt-20 max-lg:ml-0">{children}</div>
    </section>
  );
}
