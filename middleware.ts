import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is not authenticated, redirect to login
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect all dashboard routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard/products/:path*",
    "/dashboard/products/new",
    "/dashboard/products/:id/edit",
  ],
};
