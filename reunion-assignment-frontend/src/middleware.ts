import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const verifyAuthApi = `${process.env.NEXT_PUBLIC_API_URL}/users/verify`;

    // Call the verifyAuth API
    const response = await fetch(verifyAuthApi, {
        method: "GET",
        headers: {
            Cookie: request.headers.get("cookie") || "", // Pass cookies from the request
        },
    });

    const isLoggedIn = response.ok;

    // Get the requested path
    const { pathname } = request.nextUrl;

    // Redirect logged-in users away from /auth/login and /auth/signup
    if (isLoggedIn && (pathname === "/auth/login" || pathname === "/auth/signup")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect logged-out users away from protected routes (/ and /tasks)
    if (!isLoggedIn && (pathname === "/" || pathname.startsWith("/tasks"))) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

// Apply middleware to all pages
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};