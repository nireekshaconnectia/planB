"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export const useAdminHeaders = () => {
    const { data: session } = useSession();
    const [headers, setHeaders] = useState({});

    useEffect(() => {
        // Log the session to help debug
        console.log('Current session:', session);
        
        if (session?.user?.token) {
            setHeaders({
                'Authorization': `Bearer ${session.user.token}`,
                'Content-Type': 'application/json'
            });
        } else {
            console.log('No token found in session');
        }
    }, [session]);

    return headers;
}; 