 'use client';

import dynamic from 'next/dynamic'; 
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import SellerDashboard from '@/components/shared/Dashboard/Seller';



const CustomerDashboard = dynamic(() => import('@/components/shared/Dashboard/Customer'), { ssr: false });

const AdminDashboard = dynamic(() => import('@/components/shared/Dashboard/Admin'), { ssr: false });
const HybridDashboard = dynamic(() => import('@/components/shared/Dashboard/Hybrid'), { ssr: false });
const OwnerDashboard = dynamic(() => import('@/components/shared/Dashboard/Owner'), { ssr: false });

type UserRole = 'customer' | 'seller' | 'admin' | 'hybrid' | 'owner' | null;

export default function DashboardPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [specificId, setSpecificId] = useState<number | null>(null);
    const [stripeAccountId,setStripeAccountId] = useState<string | null>(null);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        const fetchAndValidate = async () => {
            try {
                const response = await fetch("/api/user-session", { cache: "no-store" });
                if (!response.ok) throw new Error("Failed to fetch user session");

                const sessionData = await response.json();

                const validationResponse = await fetch("/api/user-session/session-validation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionToken: sessionData.sessionToken,
                        userId: sessionData.userId,
                    }),
                });
                const validationResult = await validationResponse.json();
                if (!validationResult.isValid) {
                    router.replace("/auth");
                    return;
                }
                setSessionToken(sessionData.sessionToken);
                setUserId(sessionData.userId);
                setSpecificId(sessionData.specificId)
                setUserRole(sessionData.userRole);
                setStripeAccountId(sessionData.stripeAccountId)
                setError(null);
            } catch (err: any) {
                console.error("Session validation failed:", err);
                setError("Your session has expired or is invalid.");
                router.replace("/auth");
            } finally {
                setLoading(false);
            }
        };

        fetchAndValidate();
        intervalId = setInterval(fetchAndValidate, 100000); // Validate every 2 sec

        return () => clearInterval(intervalId);
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    switch (userRole) {
        case 'customer':
            return <CustomerDashboard />;
        case 'seller':
            return <SellerDashboard specificId={specificId as number} stripeAccountId={stripeAccountId as string}/>;
        case 'admin':
            return <AdminDashboard />;
        case 'hybrid':
            return <HybridDashboard />;
        case 'owner':
            return <OwnerDashboard />;
        default:
            return (
                <div className="min-h-screen flex items-center justify-center">
                    Unknown Role. <button onClick={() => router.replace('/auth/signin')}>Login Again</button>
                </div>
            );
    }
}

