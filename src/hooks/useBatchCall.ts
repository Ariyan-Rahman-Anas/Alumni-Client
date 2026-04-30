"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import SimplePeer from "simple-peer";
import { getBatchSocket } from "@/lib/socket";

export interface RemoteStream { socketId: string; stream: MediaStream; name?: string }

export function useBatchCall() {
    const [callActive, setCallActive] = useState(false);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
    const peersRef = useRef<Map<string, SimplePeer.Instance>>(new Map());
    const localStreamRef = useRef<MediaStream | null>(null);

    const addPeer = useCallback((socketId: string, initiator: boolean, stream: MediaStream) => {
        if (peersRef.current.has(socketId)) return;

        const peer = new SimplePeer({ initiator, stream, trickle: true });
        peersRef.current.set(socketId, peer);

        const sock = getBatchSocket();

        peer.on("signal", (data) => {
            if ((data as { type?: string }).type === "offer") {
                sock.emit("call:offer", { to: socketId, offer: data });
            } else if ((data as { type?: string }).type === "answer") {
                sock.emit("call:answer", { to: socketId, answer: data });
            } else {
                sock.emit("call:ice", { to: socketId, candidate: data });
            }
        });

        peer.on("stream", (remoteStream) => {
            setRemoteStreams((prev) => {
                const exists = prev.find((r) => r.socketId === socketId);
                if (exists) return prev;
                return [...prev, { socketId, stream: remoteStream }];
            });
        });

        peer.on("close", () => removePeer(socketId));
        peer.on("error", () => removePeer(socketId));
    }, []); // eslint-disable-line

    const removePeer = useCallback((socketId: string) => {
        const peer = peersRef.current.get(socketId);
        if (peer) { peer.destroy(); peersRef.current.delete(socketId); }
        setRemoteStreams((prev) => prev.filter((r) => r.socketId !== socketId));
    }, []);

    const startCall = useCallback(async (hasVideo: boolean) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: hasVideo });
        localStreamRef.current = stream;
        setLocalStream(stream);
        setCallActive(true);
        getBatchSocket().emit("call:start", { hasVideo });
    }, []);

    const endCall = useCallback(() => {
        peersRef.current.forEach((peer) => peer.destroy());
        peersRef.current.clear();
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        setLocalStream(null);
        setRemoteStreams([]);
        setCallActive(false);
        getBatchSocket().emit("call:end", {});
    }, []);

    /* ── Socket signal handlers ── */
    useEffect(() => {
        const sock = getBatchSocket();

        const onIncoming = (data: { from: string; hasVideo: boolean }) => {
            if (!localStreamRef.current) return; // only handle if already in call
            addPeer(data.from, false, localStreamRef.current);
        };

        const onOffer = (data: { from: string; offer: unknown }) => {
            const peer = peersRef.current.get(data.from);
            if (peer) peer.signal(data.offer as SimplePeer.SignalData);
        };

        const onAnswer = (data: { from: string; answer: unknown }) => {
            const peer = peersRef.current.get(data.from);
            if (peer) peer.signal(data.answer as SimplePeer.SignalData);
        };

        const onIce = (data: { from: string; candidate: unknown }) => {
            const peer = peersRef.current.get(data.from);
            if (peer) peer.signal(data.candidate as SimplePeer.SignalData);
        };

        const onPeerLeft = (data: { socketId: string }) => removePeer(data.socketId);

        sock.on("call:incoming", onIncoming);
        sock.on("call:offer", onOffer);
        sock.on("call:answer", onAnswer);
        sock.on("call:ice", onIce);
        sock.on("call:peerLeft", onPeerLeft);

        return () => {
            sock.off("call:incoming", onIncoming);
            sock.off("call:offer", onOffer);
            sock.off("call:answer", onAnswer);
            sock.off("call:ice", onIce);
            sock.off("call:peerLeft", onPeerLeft);
        };
    }, [addPeer, removePeer]);

    return { callActive, localStream, remoteStreams, startCall, endCall };
}
