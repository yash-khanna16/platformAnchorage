import { NextRequest, NextResponse } from "next/server";



export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.redirect(new URL("/home",req.nextUrl));
  }
  if (path === "/admin") {
    return NextResponse.redirect(new URL("/admin/search-guests",req.nextUrl));
  }

  return NextResponse.next();
}
