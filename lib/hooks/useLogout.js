import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut({ 
                redirect: true,
                callbackUrl: '/admin'
            });
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/admin');
        }
    };

    return handleLogout;
} 