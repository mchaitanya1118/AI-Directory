import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Check for admin routes
    if (pathname.startsWith("/admin")) {
      const role = req.nextauth.token?.role;
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply middleware only to protected paths
export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
