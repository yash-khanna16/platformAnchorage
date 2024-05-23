import React from "react";
import Navbar from "./Navbar"

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section>
            <Navbar />
            {children}
        </section>
    );
}