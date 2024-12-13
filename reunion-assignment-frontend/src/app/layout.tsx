"use client";
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() // Get the current pathname

  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <div className="flex min-h-screen flex-col">
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
                <Button className="ml-auto">
                  Logout
                </Button>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}