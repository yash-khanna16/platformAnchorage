import { NextRequest, NextResponse } from "next/server";
import {validate } from "./app/actions/utils";
import { cookies } from "next/headers";



export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const adminRoutes = ["/admin/search-guests","/admin/manage-rooms","/admin/send-email","/admin/add-guest","/admin/analytics"] ;
  const isAdminRoute = adminRoutes.includes(path);
  const adminCookie = await validate(cookies().get("admin")?.value);


  if (path === "/") {
    return NextResponse.redirect(new URL("/admin/login",req.nextUrl));
  }
  if(isAdminRoute && !adminCookie) {
    console.log("redirected from here")
    return NextResponse.redirect(new URL("/admin/login",req.nextUrl));
  }
  
  if (adminCookie && path.startsWith("/admin/analytics") && adminCookie.role !== "superadmin") {
    return NextResponse.redirect(new URL("/admin/search-guests",req.nextUrl));
  }
  
  if (path.startsWith("/admin/login") && adminCookie) {
    return NextResponse.redirect(new URL("/admin/search-guests",req.nextUrl));
  }  
  
  if (path === "/admin") {
    // console.log("redirected from here 2")
    return NextResponse.redirect(new URL("/admin/search-guests",req.nextUrl));
  }

  return NextResponse.next();
}
