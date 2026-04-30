"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    RiMicLine,
    RiMicOffLine,
    RiVideoLine,
    RiVideoOffLine,
    RiPhoneLine,
    RiUserLine,
} from "react-icons/ri";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { useBatchSocket } from "@/hooks/useBatchSocket";

/* ── Peer video tile ──────────────────────────────────────── */
function PeerTile({ stream, name, muted = false }: { stream: MediaStream | null; name: string; muted?: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <div className="relative rounded-2xl overflow-hidden bg-neutral-900 aspect-video flex items-center justify-center">
            {stream ? (
                <video ref={videoRef} autoPlay playsInline muted={muted} className="w-full h-full object-cover" />
            ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                    <RiUserLine className="text-5xl" />
                    <span className="text-sm">{name}</span>
                </div>
            )}
            <span className="absolute bottom-2 left-3 text-xs text-white bg-black/40 px-2 py-0.5 rounded-full">
                {name}
            </span>
        </div>
    );
}

/* ── Main call page ───────────────────────────────────────── */
export default function BatchCallPage() {
    const searchParams = useSearchParams();
    const hasVideo = searchParams.get("video") === "true";
    const batchYear = searchParams.get("batch");

    const authUser = useAppSelector((s) => s.auth.user);
    const myName = authUser?.name ?? "Me";
    const myBatch = authUser?.batch as number | undefined;

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [peers, setPeers] = useState<Map<string, { name: string; stream: MediaStream | null }>>(new Map());
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(hasVideo);
    const [inCall, setInCall] = useState(false);
    const [callEnded, setCallEnded] = useState(false);

    const pcRefs = useRef<Map<string, RTCPeerConnection>>(new Map());
    const localStreamRef = useRef<MediaStream | null>(null);

    // Outgoing dial tone — synthesised via Web Audio API (no file needed).
    // Plays from the moment the caller joins until the first peer connects.
    const dialCtxRef = useRef<AudioContext | null>(null);
    const dialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const diallingRef = useRef(false);

    const startDialTone = useCallback(() => {
        if (diallingRef.current) return;
        diallingRef.current = true;
        if (!dialCtxRef.current) dialCtxRef.current = new AudioContext();
        const ctx = dialCtxRef.current;
        if (ctx.state === "suspended") void ctx.resume();
        const tick = () => {
            if (!diallingRef.current) return;
            // Outgoing ring: single 1-second burst of 440+480 Hz, then 2 s silence
            [440, 480].forEach((freq) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.06, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 1.0);
            });
            dialTimerRef.current = setTimeout(tick, 3000);
        };
        tick();
    }, []);

    const stopDialTone = useCallback(() => {
        diallingRef.current = false;
        if (dialTimerRef.current) clearTimeout(dialTimerRef.current);
    }, []);

    useEffect(() => {
        return () => {
            stopDialTone();
            dialCtxRef.current?.close();
        };
    }, [stopDialTone]);

    const { sendOffer, sendAnswer, sendIce, endCall, startCall } = useBatchSocket(myBatch, {
        onCallOffer: async ({ fromSocketId, offer }) => {
            if (!localStreamRef.current) return;
            const pc = createPc(fromSocketId, `Peer-${fromSocketId.slice(0, 6)}`);
            await pc.setRemoteDescription(new RTCSessionDescription(offer as RTCSessionDescriptionInit));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendAnswer(fromSocketId, answer);
        },
        onCallAnswer: async ({ fromSocketId, answer }) => {
            const pc = pcRefs.current.get(fromSocketId);
            if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer as RTCSessionDescriptionInit));
        },
        onCallIce: async ({ fromSocketId, candidate }) => {
            const pc = pcRefs.current.get(fromSocketId);
            if (pc && candidate) {
                try { await pc.addIceCandidate(new RTCIceCandidate(candidate as RTCIceCandidateInit)); } catch { /* ignore */ }
            }
        },
        onCallPeerLeft: ({ socketId }) => {
            const pc = pcRefs.current.get(socketId);
            pc?.close();
            pcRefs.current.delete(socketId);
            setPeers((prev) => { const next = new Map(prev); next.delete(socketId); return next; });
        },
        onCallIncoming: ({ from, fromSocketId, name: callerName }) => {
            // New peer joined — initiate offer to them
            setPeers((prev) => new Map(prev).set(fromSocketId, { name: callerName ?? from, stream: null }));
            if (localStreamRef.current) {
                const pc = createPc(fromSocketId, callerName ?? from);
                pc.createOffer().then((offer) => {
                    pc.setLocalDescription(offer);
                    sendOffer(fromSocketId, offer);
                }).catch(() => { });
            }
        },
    } as Parameters<typeof useBatchSocket>[1]);

    const createPc = useCallback((socketId: string, peerId: string): RTCPeerConnection => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));
        pc.onicecandidate = (e) => { if (e.candidate) sendIce(socketId, e.candidate); };
        pc.ontrack = (e) => {
            const stream = e.streams[0];
            stopDialTone();  // first peer connected — stop dial tone
            setPeers((prev) => new Map(prev).set(socketId, { name: peerId, stream }));
        };
        pcRefs.current.set(socketId, pc);
        return pc;
    }, [sendIce, stopDialTone]);

    const joinCall = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: hasVideo });
            localStreamRef.current = stream;
            setLocalStream(stream);
            setInCall(true);
            startCall(hasVideo);
            startDialTone();   // ring until a peer picks up
        } catch {
            toast.error("Could not access camera/microphone. Please allow permissions and try again.");
        }
    }, [hasVideo, startCall, startDialTone]);

    const leaveCall = useCallback(() => {
        endCall();
        pcRefs.current.forEach((pc) => pc.close());
        pcRefs.current.clear();
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        setLocalStream(null);
        setInCall(false);
        setCallEnded(true);
    }, [endCall]);

    // Join once auth is ready (myBatch is populated from AuthInitializer)
    const joinedRef = useRef(false);
    useEffect(() => {
        if (!myBatch || joinedRef.current) return;
        joinedRef.current = true;
        joinCall();
        // Cleanup: stop media tracks only — don't call leaveCall (avoids strict-mode false "ended")
        return () => {
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, [myBatch, joinCall]);

    const toggleMic = () => {
        localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
        setMicOn((v) => !v);
    };
    const toggleCam = () => {
        localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
        setCamOn((v) => !v);
    };

    if (callEnded) {
        return (
            <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4 text-white">
                <RiPhoneLine className="text-5xl text-red-400" />
                <p className="text-xl font-semibold">Call ended</p>
                <button onClick={() => window.close()} className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-sm">
                    Close window
                </button>
            </div>
        );
    }

    if (!myBatch) {
        return (
            <div className="h-screen bg-neutral-950 flex items-center justify-center text-white">
                <p className="text-sm text-neutral-400 animate-pulse">Initializing…</p>
            </div>
        );
    }

    const peersArray = Array.from(peers.entries());

    return (
        <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-neutral-900 border-b border-neutral-800">
                <div>
                    <p className="text-white font-semibold text-sm">Batch {batchYear ?? myBatch} Call</p>
                    <p className="text-neutral-400 text-xs">{inCall ? `${peersArray.length + 1} participant${peersArray.length > 0 ? "s" : ""}` : "Connecting…"}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {inCall ? "Live" : "Joining…"}
                </div>
            </div>

            {/* Video grid */}
            <div className="flex-1 overflow-auto p-4">
                <div className={`grid gap-3 h-full ${peersArray.length === 0 ? "grid-cols-1 max-w-2xl mx-auto" : peersArray.length <= 3 ? "grid-cols-2" : "grid-cols-3"}`}>
                    {/* Local video */}
                    <PeerTile stream={localStream} name={`${myName} (You)`} muted />
                    {/* Remote peers */}
                    {peersArray.map(([socketId, peer]) => (
                        <PeerTile key={socketId} stream={peer.stream} name={peer.name} />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 py-5 bg-neutral-900 border-t border-neutral-800">
                <button onClick={toggleMic}
                    className={`p-4 rounded-full transition-colors ${micOn ? "bg-neutral-700 text-white hover:bg-neutral-600" : "bg-red-600 text-white hover:bg-red-700"}`}>
                    {micOn ? <RiMicLine className="text-xl" /> : <RiMicOffLine className="text-xl" />}
                </button>
                {hasVideo && (
                    <button onClick={toggleCam}
                        className={`p-4 rounded-full transition-colors ${camOn ? "bg-neutral-700 text-white hover:bg-neutral-600" : "bg-red-600 text-white hover:bg-red-700"}`}>
                        {camOn ? <RiVideoLine className="text-xl" /> : <RiVideoOffLine className="text-xl" />}
                    </button>
                )}
                <button onClick={leaveCall} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors">
                    <RiPhoneLine className="text-xl rotate-[135deg]" />
                </button>
            </div>
        </div>
    );
}
