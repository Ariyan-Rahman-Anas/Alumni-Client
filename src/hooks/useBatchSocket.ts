"use client";

import { useEffect, useRef, useCallback } from "react";
import { getBatchSocket } from "@/lib/socket";
import { useAppSelector } from "@/redux/hooks";
import type { BatchMessage, BatchPoll } from "@/redux/apis/batchRoom/types";

export interface TypingUser { userId: string; name: string }
export interface IncomingCall { from: string; fromSocketId: string; name: string; hasVideo: boolean }

export interface BatchSocketHandlers {
    onMessageNew?: (msg: BatchMessage) => void;
    onMessageDeleted?: (data: { messageId: string }) => void;
    onMessageSeenUpdate?: (data: { messageId: string; userId: string }) => void;
    onPollUpdated?: (poll: BatchPoll) => void;
    onPollDeleted?: (data: { pollId: string }) => void;
    /** Server emits individual typing events: { userId, userName, typing } */
    onTypingUpdate?: (data: { userId: string; userName: string; typing: boolean }) => void;
    onCallIncoming?: (data: IncomingCall) => void;
    onCallOffer?: (data: { from: string; fromSocketId: string; offer: unknown }) => void;
    onCallAnswer?: (data: { from: string; fromSocketId: string; answer: unknown }) => void;
    onCallIce?: (data: { from: string; fromSocketId: string; candidate: unknown }) => void;
    onCallPeerLeft?: (data: { socketId: string }) => void;
}

/** Returns the batch socket if initialized, null otherwise */
const tryGetSock = () => { try { return getBatchSocket(); } catch { return null; } };

export function useBatchSocket(batchYear: number | undefined, handlers: BatchSocketHandlers) {
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    // accessToken dep ensures this effect re-runs after SocketProvider (useLayoutEffect)
    // has initialized the socket in the same render cycle.
    const accessToken = useAppSelector((s) => s.auth.accessToken);

    useEffect(() => {
        if (!batchYear || !accessToken) return;
        const sock = tryGetSock();
        if (!sock) return;
        if (!sock.connected) sock.connect();

        const on = <T>(event: string, key: keyof BatchSocketHandlers) => {
            const fn = (data: T) => (handlersRef.current[key] as ((d: T) => void) | undefined)?.(data);
            sock.on(event, fn);
            return () => sock.off(event, fn);
        };

        const cleanups = [
            on<BatchMessage>("message:new", "onMessageNew"),
            on<{ messageId: string }>("message:deleted", "onMessageDeleted"),
            on<{ messageId: string; userId: string }>("message:seenUpdate", "onMessageSeenUpdate"),
            on<BatchPoll>("poll:updated", "onPollUpdated"),
            on<{ pollId: string }>("poll:deleted", "onPollDeleted"),
            on<{ userId: string; userName: string; typing: boolean }>("typing:update", "onTypingUpdate"),
            on<IncomingCall>("call:incoming", "onCallIncoming"),
            on<{ from: string; fromSocketId: string; offer: unknown }>("call:offer", "onCallOffer"),
            on<{ from: string; fromSocketId: string; answer: unknown }>("call:answer", "onCallAnswer"),
            on<{ from: string; fromSocketId: string; candidate: unknown }>("call:ice", "onCallIce"),
            on<{ socketId: string }>("call:peerLeft", "onCallPeerLeft"),
        ];

        return () => { cleanups.forEach((off) => off()); };
    }, [batchYear, accessToken]);

    const emit = useCallback((event: string, ...args: unknown[]) => {
        tryGetSock()?.emit(event, ...args);
    }, []);

    const sendMessage = useCallback((body: string, cb?: (res: { error?: string; message?: BatchMessage }) => void) => {
        emit("message:send", { body }, cb ?? (() => {}));
    }, [emit]);

    const deleteMessage = useCallback((messageId: string) => { emit("message:delete", { messageId }); }, [emit]);
    const markSeen = useCallback((upToMessageId: string) => { emit("message:seen", { upToMessageId }); }, [emit]);
    const votePoll = useCallback((pollId: string, optionId: string) => { emit("poll:vote", { pollId, optionId }); }, [emit]);
    const closePoll = useCallback((pollId: string) => { emit("poll:close", { pollId }); }, [emit]);
    const startCall = useCallback((hasVideo: boolean) => { emit("call:start", { hasVideo }); }, [emit]);
    const sendOffer = useCallback((to: string, offer: unknown) => { emit("call:offer", { to, offer }); }, [emit]);
    const sendAnswer = useCallback((to: string, answer: unknown) => { emit("call:answer", { to, answer }); }, [emit]);
    const sendIce = useCallback((to: string, candidate: unknown) => { emit("call:ice", { to, candidate }); }, [emit]);
    const endCall = useCallback(() => { emit("call:end", {}); }, [emit]);
    const startTyping = useCallback(() => { emit("typing:start", {}); }, [emit]);
    const stopTyping = useCallback(() => { emit("typing:stop", {}); }, [emit]);

    return { sendMessage, deleteMessage, markSeen, votePoll, closePoll, startCall, sendOffer, sendAnswer, sendIce, endCall, startTyping, stopTyping };
}
