// import NextAuth from "next-auth";
// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import type { NextRequest } from "next/server";
// import authConfig from "./lib/auth/auth.config";

// const { auth } = NextAuth(authConfig);

// // Define user roles
// type UserRole = "admin" | "mentor" | "user" | "undefined";

// // Protected routes configuration - routes that require specific roles
// const protectedRoutes: Record<string, UserRole[]> = {
//   "/admin": ["admin"],
//   "/mentor": ["mentor"],
//   "/user": ["user"],
// };

// // Public routes that don't require authentication

// const authRoutes = [
//   "/login",
//   "/signup",
//   "/blocked",
//   "/forgot-password",
//   "/register-as-mentor",
//   "/verify",
// ];
// const publicRoutes = ["/", "/about", "/contact", "/mentors", "/insights",...authRoutes];

// // API routes that should bypass middleware
// const apiRoutes = ["/api/auth", "/api/stripe", "/api/public"];

// // Role-based default redirects
// const roleDefaultRoutes: Record<UserRole, string> = {
//   admin: "/admin",
//   mentor: "/mentor",
//   user: "/",
//   undefined: "/signup",
// };

// // Check if a route is public
// const isPublicRoute = (pathname: string): boolean => {
//   return publicRoutes.some((route) => {
//     if (route === "/") {
//       return pathname === "/";
//     }
//     return pathname === route || pathname.startsWith(route + "/");
//   });
// };

// // Check if a route is API route
// const isApiRoute = (pathname: string): boolean => {
//   return apiRoutes.some((route) => pathname.startsWith(route));
// };

// // Check if user has access to a protected route
// const hasAccess = (pathname: string, role: UserRole): boolean => {
//   for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
//     if (pathname === route || pathname.startsWith(route + "/")) {
//       return allowedRoles.includes(role);
//     }
//   }
//   return true; // Allow access if route is not explicitly protected
// };

// // Get user's default route based on role
// const getUserDefaultRoute = (role: UserRole): string => {
//   return roleDefaultRoutes[role] || "/";
// };

// // Check if admin/mentor should be redirected from this route
// const shouldRedirectToRoleDefault = (
//   pathname: string,
//   role: UserRole
// ): boolean => {


//   // Don't redirect regular users
//   if (role === "user" || role === "undefined") {
//     return false;
//   }


//   const defaultRoute = getUserDefaultRoute(role);
//   if (pathname === defaultRoute || pathname.startsWith(defaultRoute + "/")) {
//     return false;
//   }

//   return true;
// };

// // Check if user is accessing a route meant for a different role
// const isAccessingWrongRoleRoute = (
//   pathname: string,
//   role: UserRole
// ): boolean => {
//   const roleRoutes = {
//     admin: "/admin",
//     mentor: "/mentor",
//     user: "/user",
//   };

//   for (const [routeRole, routePath] of Object.entries(roleRoutes)) {
//     if (
//       routeRole !== role &&
//       (pathname === routePath || pathname.startsWith(routePath + "/"))
//     ) {
//       return true;
//     }
//   }
//   return false;
// };

// // Main middleware function
// export default auth(async (req: NextRequest) => {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const role = (token?.role as UserRole) ?? "undefined";
//   const isBlocked = token?.isBlocked as boolean;
//   const tokenError = token?.error;
//   const isAuthenticated = !!token;
//   const { pathname } = req.nextUrl;

//   console.log("Middleware Debug:", {
//     pathname,
//     role,
//     isBlocked,
//     tokenError,
//     isAuthenticated,
//     shouldRedirect: shouldRedirectToRoleDefault(pathname, role),
//   });

//   // Allow API routes to pass through
//   if (isApiRoute(pathname)) {
//     return NextResponse.next();
//   }

//   // Handle token refresh errors
//   if (tokenError === "RefreshAccessTokenError") {
//     if (pathname !== "/signup" && pathname !== "/login") {
//       return NextResponse.redirect(
//         new URL("/signup?error=session_expired", req.nextUrl.origin)
//       );
//     }
//     return NextResponse.next();
//   }

//   // Handle blocked users
//   if (isBlocked && pathname !== "/blocked") {
//     return NextResponse.redirect(new URL("/blocked", req.nextUrl));
//   }

//   // Redirect authenticated users trying to access login/signup pages
//   if (isAuthenticated && authRoutes.includes(pathname)) {
//     const defaultRoute = getUserDefaultRoute(role);
//     return NextResponse.redirect(new URL(defaultRoute, req.nextUrl));
//   }

//   // For authenticated users: check if they should be redirected to role default
//   if (isAuthenticated && shouldRedirectToRoleDefault(pathname, role)) {
//     const defaultRoute = getUserDefaultRoute(role);
//     return NextResponse.redirect(new URL(defaultRoute, req.nextUrl));
//   }

//   // For authenticated users: check if accessing wrong role route
//   if (isAuthenticated && isAccessingWrongRoleRoute(pathname, role)) {
//     const defaultRoute = getUserDefaultRoute(role);
//     return NextResponse.redirect(new URL(defaultRoute, req.nextUrl));
//   }

//   // Allow access to public routes
//   if (isPublicRoute(pathname)) {
//     return NextResponse.next();
//   }

//   // Check authentication for non-public routes
//   if (!isAuthenticated) {
//     return NextResponse.redirect(new URL("/login", req.nextUrl));
//   }

//   // Check role-based access for protected routes
//   if (!hasAccess(pathname, role)) {
//     const defaultRoute = getUserDefaultRoute(role);
//     return NextResponse.redirect(new URL(defaultRoute, req.nextUrl));
//   }

//   // Additional specific checks
//   if (pathname.includes("/booking") && role !== "user") {
//     const defaultRoute = getUserDefaultRoute(role);
//     return NextResponse.redirect(new URL(defaultRoute, req.nextUrl));
//   }

//   return NextResponse.next();
// });

// // Middleware configuration
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public files with extensions
//      */
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
//   ],
// };

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import authConfig from "./lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

// Role-based route access mapping
const protectedRoutes: Record<string, string> = {
  "/mentor": "mentor",
  "/user": "user",
  "/admin": "admin",

};

// Function to check role access
const hasAccess = (pathname: string, role: string): boolean => {
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return role === protectedRoutes[route];
    }
  }
  return true; // Default to allowing access
};

// Middleware function
export default auth(async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role ?? "undefined";
  const isBlocked = token?.isBlocked as boolean;
  const tokenError = token?.error;

  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  console.log(
    "Middleware:",
    pathname,
    "Role =>",
    role,
    "Blocked =>",
    isBlocked,
    "Error=>",
    tokenError
  );

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/stripe")) {
    return NextResponse.next();
  }

  if (tokenError === "RefreshAccessTokenError") {
    // Clear cookies

   // Only redirect to login if we're not already there
    if (pathname !== "/signup") {
      return NextResponse.redirect(
        new URL("/signup?error=session_expired", req.nextUrl.origin)
      );
    }

    // If we're already at login, just continue
    return NextResponse.next();
  }

  if (isBlocked && pathname !== "/blocked") {
    return NextResponse.redirect(new URL("/blocked", req.nextUrl));
  }

  // if (pathname === "/register-as-mentor" && role !== "user") {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  if(pathname.includes("/booking") && role !== "user") {

    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!hasAccess(pathname, role)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthenticated && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

// // Apply middleware to relevant routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
