"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
        method: "POST",
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (!response.ok) {
        throw Error();
      }
      router.push("/auth/login"); // Redirect after successful logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Determine if the current path is one of the auth pages
  const hideHeader = pathname === "/auth/login" || pathname === "/auth/signup";

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <div className="flex min-h-screen flex-col">
          {/* Conditionally render the header */}
          {!hideHeader && (
            <header className="sticky px-12 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <nav className="flex items-center w-full">
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    <Link
                      href="/"
                      className={cn(
                        "text-sm font-medium text-gray-700 transition-colors hover:text-primary",
                        pathname === "/" && "text-primary scale-110"
                      )}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/tasks"
                      className={cn(
                        "text-sm font-medium text-gray-700 transition-colors hover:text-primary",
                        pathname === "/tasks" && "text-primary scale-110"
                      )}
                    >
                      Tasks
                    </Link>
                  </div>
                  <Button onClick={handleLogout} className="ml-auto">
                    Logout
                  </Button>
                </nav>
              </div>
            </header>
          )}
          <main className="flex-1">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}