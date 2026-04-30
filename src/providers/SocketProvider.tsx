"use client";

import { useLayoutEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { initSockets, disconnectAllSockets } from "@/lib/socket";

/**
 * Connects socket.io namespaces when the user has a valid in-memory access token.
 * Uses useLayoutEffect so sockets are created BEFORE child useEffect handlers
 * (such as useBatchSocket) try to access them in the same render cycle.
 */
export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const accessToken = useAppSelector((s) => s.auth.accessToken);
    const isInitialized = useAppSelector((s) => s.auth.isInitialized);

    useLayoutEffect(() => {
        if (!isInitialized) return;

        if (accessToken) {
            initSockets(accessToken);
        } else {
            disconnectAllSockets();
        }
    }, [accessToken, isInitialized]);

    return <>{children}</>;
}
