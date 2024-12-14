import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const useAuthRedirect = () => {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const verifyAuthApi = `${process.env.NEXT_PUBLIC_API_URL}/users/verify`;
                const response = await fetch(verifyAuthApi, {
                    method: "GET",
                    credentials: "include", // Include cookies
                });

                const isLoggedIn = response.ok;

                // If user is logged in and tries to access /auth/login or /auth/signup
                if (isLoggedIn && (pathname === "/auth/login" || pathname === "/auth/signup")) {
                    router.replace("/"); // Redirect to home page
                }

                // If user is not logged in and tries to access protected routes
                if (!isLoggedIn && (pathname === "/" || pathname.startsWith("/tasks"))) {
                    router.replace("/auth/login"); // Redirect to login page
                }
            } catch (error) {
                console.error("Error verifying authentication:", error);
                // Handle API call errors (e.g., redirect to login on failure)
                router.replace("/auth/login");
            }
        };

        checkAuth();
    }, [router, pathname]);
};

export default useAuthRedirect;