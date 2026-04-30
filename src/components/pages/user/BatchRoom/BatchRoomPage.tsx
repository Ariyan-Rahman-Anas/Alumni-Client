"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import {
    RiSendPlaneLine,
    RiDeleteBin6Line,
    RiBarChartLine,
    RiVideoLine,
    RiMicLine,
    RiCloseLine,
    RiAddLine,
    RiTimeLine,
    RiCheckLine,
    RiCheckDoubleLine,
    RiImageLine,
    RiShieldUserLine,
    RiInformationLine,
    RiEditLine,
    RiGalleryLine,
    RiGroupLine,
    RiPlayLine,
    RiPauseLine,
    RiPhoneLine,
    RiRefreshLine,
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

import { useAppSelector } from "@/redux/hooks";
import {
    useGetBatchRoomQuery,
    useGetBatchMessagesQuery,
    useGetBatchPollsQuery,
    useApplyAsCoordinatorMutation,
    useCreateBatchPollMutation,
    useRenameBatchRoomMutation,
    useSendBatchMediaMessageMutation,
    useDeleteBatchMessageMutation,
    useVoteBatchPollMutation,
    useCloseBatchPollMutation,
    useDeleteBatchPollMutation,
    useGetBatchCoordinatorApplicationsQuery,
} from "@/redux/apis/batchRoom";
import { useGetAllApprovedUsersQuery } from "@/redux/apis/userApi";
import { useBatchSocket, type TypingUser } from "@/hooks/useBatchSocket";
import type { BatchMessage, BatchPoll } from "@/redux/apis/batchRoom/types";
import { cn } from "@/lib/utils";

/* ── Avatar ──────────────────────────────────────────────── */
function Av({ name, imageUrl, size = 36 }: { name: string; imageUrl?: string; size?: number }) {
    if (imageUrl)
        return <Image src={imageUrl} alt={name} width={size} height={size} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />;
    return (
        <div className="rounded-full bg-primary2-100 flex items-center justify-center font-bold text-primary2-700 flex-shrink-0 select-none"
            style={{ width: size, height: size, fontSize: size * 0.38 }}>
            {name?.[0]?.toUpperCase() ?? "?"}
        </div>
    );
}

/* ── Poll Card ───────────────────────────────────────────── */
function PollCard({ poll, myUserId, isCoordinator, onVote, onClose, onDelete }: {
    poll: BatchPoll; myUserId: string; isCoordinator: boolean;
    onVote: (pollId: string, optionId: string) => void;
    onClose: (pollId: string) => void;
    onDelete: (pollId: string) => void;
}) {
    const totalVotes = poll.options.reduce((s, o) => s + o.voters.length, 0);
    const myVote = poll.options.find((o) => o.voters.includes(myUserId));
    const hasVoted = !!myVote;
    return (
        <div className="border border-surface-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                    <p className="text-sm font-semibold text-neutral-800 leading-snug">{poll.question}</p>
                    {poll.isCoordinatorElection && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5 mt-1">
                            <RiShieldUserLine /> Coordinator Election
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {poll.isOpen ? (
                        <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 rounded-full px-2 py-0.5">Open</span>
                    ) : (
                        <span className="text-[10px] bg-surface-100 text-muted-foreground border border-surface-200 rounded-full px-2 py-0.5">Closed</span>
                    )}
                    {poll.deadline && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <RiTimeLine /> {format(new Date(poll.deadline), "MMM d, HH:mm")}
                        </span>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                {poll.options.map((opt) => {
                    const pct = totalVotes > 0 ? Math.round((opt.voters.length / totalVotes) * 100) : 0;
                    const isMyVote = opt._id === myVote?._id;
                    return (
                        <button key={opt._id} onClick={() => poll.isOpen && !hasVoted && onVote(poll._id, opt._id)}
                            disabled={!poll.isOpen || hasVoted}
                            className={cn("w-full relative rounded-lg border overflow-hidden text-left transition-colors",
                                isMyVote ? "border-primary2-400 bg-primary2-50" : "border-surface-200 bg-surface-50",
                                poll.isOpen && !hasVoted && "hover:border-primary2-300 cursor-pointer")}>
                            <div className="absolute inset-0 h-full bg-primary2-100/50 transition-all" style={{ width: `${pct}%` }} />
                            <div className="relative flex items-center justify-between px-3 py-2">
                                <span className="text-sm text-neutral-800">{opt.text}</span>
                                <div className="flex items-center gap-1.5">
                                    {isMyVote && <RiCheckLine className="text-primary2-600 text-xs" />}
                                    <span className="text-xs text-muted-foreground">{pct}% ({opt.voters.length})</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{totalVotes} vote{totalVotes !== 1 ? "s" : ""} cast</p>
            <div className="flex items-center gap-3 mt-2">
                {poll.isOpen && (isCoordinator || poll.createdBy._id === myUserId) && (
                    <button onClick={() => onClose(poll._id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Close poll</button>
                )}
                {!poll.isOpen && (isCoordinator || poll.createdBy._id === myUserId) && (
                    <button onClick={() => onDelete(poll._id)} className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-0.5">
                        <RiDeleteBin6Line className="text-[11px]" /> Delete poll
                    </button>
                )}
            </div>
        </div>
    );
}

/* ── Create Poll Modal ───────────────────────────────────── */
function CreatePollModal({ onClose, onCreate }: {
    onClose: () => void;
    onCreate: (data: { question: string; options: string[]; deadline?: string }) => void;
}) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [deadline, setDeadline] = useState("");
    const submit = () => {
        if (!question.trim() || options.filter((o) => o.trim()).length < 2) { toast.error("Need a question and at least 2 options."); return; }
        onCreate({ question: question.trim(), options: options.filter((o) => o.trim()), deadline: deadline || undefined });
        onClose();
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Create Poll</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-100"><RiCloseLine /></button>
                </div>
                <div className="space-y-3">
                    <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Poll question…"
                        className="w-full text-sm px-3 py-2 rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary2-300" />
                    <div className="space-y-2">
                        {options.map((opt, i) => (
                            <div key={i} className="flex gap-2">
                                <input value={opt} onChange={(e) => { const o = [...options]; o[i] = e.target.value; setOptions(o); }}
                                    placeholder={`Option ${i + 1}`}
                                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary2-300" />
                                {options.length > 2 && (
                                    <button onClick={() => setOptions(options.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-1"><RiCloseLine /></button>
                                )}
                            </div>
                        ))}
                        {options.length < 5 && (
                            <button onClick={() => setOptions([...options, ""])} className="text-xs text-primary2-600 hover:text-primary2-800 flex items-center gap-1">
                                <RiAddLine /> Add option
                            </button>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground">Deadline (optional)</label>
                        <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                            className="w-full mt-1 text-sm px-3 py-2 rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary2-300" />
                    </div>
                </div>
                <div className="flex gap-2 mt-5">
                    <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-surface-200 text-sm hover:bg-surface-50 transition-colors">Cancel</button>
                    <button onClick={submit} className="flex-1 px-4 py-2 rounded-xl bg-primary2-600 text-white text-sm hover:bg-primary2-700 transition-colors">Create</button>
                </div>
            </div>
        </div>
    );
}

/* ── Group Info Modal ────────────────────────────────────── */
function GroupInfoModal({ room, myBatch, myUserId, isCoordinator, polls, onClose, onVote, onDelete }: {
    room: { name?: string; coordinator?: unknown; batchYear: number } | null;
    myBatch: number; myUserId: string; isCoordinator: boolean;
    polls: BatchPoll[];
    onClose: () => void;
    onVote: (pollId: string, optionId: string) => void;
    onDelete: (pollId: string) => void;
}) {
    const [renameBatchRoom] = useRenameBatchRoomMutation();
    const [editingName, setEditingName] = useState(false);
    const [nameVal, setNameVal] = useState(room?.name ?? `Batch ${myBatch} Room`);
    const [activeSection, setActiveSection] = useState<"info" | "polls">("info");
    const { data: messagesData } = useGetBatchMessagesQuery({ year: myBatch, limit: 200 });
    const sharedImages = messagesData?.data?.filter((m) => m.imageUrl && !m.isDeleted) ?? [];
    const coordinator = room?.coordinator as { name?: string; imageUrl?: string; _id?: string } | null | undefined;

    const handleRename = async () => {
        if (!nameVal.trim()) return;
        try {
            await renameBatchRoom({ year: myBatch, name: nameVal.trim() }).unwrap();
            toast.success("Room renamed."); setEditingName(false);
        } catch { toast.error("Failed to rename room."); }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
                className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
                    <h2 className="font-bold text-lg">Batch {myBatch} Room</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-100"><RiCloseLine className="text-lg" /></button>
                </div>
                <div className="flex border-b border-surface-200 px-5 flex-shrink-0">
                    {(["info", "polls"] as const).map((tab) => (
                        <button key={tab} onClick={() => setActiveSection(tab)}
                            className={cn("text-sm font-medium py-2.5 mr-5 transition-colors capitalize border-b-2",
                                activeSection === tab ? "border-primary2-600 text-primary2-700" : "border-transparent text-muted-foreground hover:text-neutral-700")}>
                            {tab === "polls" ? "Polls" : "Info & Media"}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-5" data-lenis-prevent>
                    {activeSection === "info" && (
                        <>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Room Name</p>
                                {editingName ? (
                                    <div className="flex gap-2">
                                        <input value={nameVal} onChange={(e) => setNameVal(e.target.value)}
                                            className="flex-1 text-sm px-3 py-2 rounded-lg border border-primary2-300 focus:outline-none focus:ring-2 focus:ring-primary2-300" />
                                        <button onClick={handleRename} className="px-3 py-2 bg-primary2-600 text-white text-sm rounded-lg hover:bg-primary2-700 transition-colors">Save</button>
                                        <button onClick={() => setEditingName(false)} className="px-3 py-2 border border-surface-200 text-sm rounded-lg hover:bg-surface-50 transition-colors">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-neutral-800">{room?.name ?? `Batch ${myBatch} Room`}</span>
                                        {isCoordinator && (
                                            <button onClick={() => setEditingName(true)} className="p-1 text-muted-foreground hover:text-primary2-700 transition-colors">
                                                <RiEditLine className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            {coordinator && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Coordinator</p>
                                    <div className="flex items-center gap-3">
                                        <Av name={coordinator.name ?? "?"} imageUrl={coordinator.imageUrl} size={36} />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-800">{coordinator.name}</p>
                                            <p className="text-xs text-amber-600 flex items-center gap-1"><RiShieldUserLine /> Batch Coordinator</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {sharedImages.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                                        <RiGalleryLine /> Shared Media ({sharedImages.length})
                                    </p>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {sharedImages.slice(0, 12).map((m) => (
                                            <a key={m._id} href={m.imageUrl} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden block">
                                                <Image src={m.imageUrl!} alt="shared" width={80} height={80} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {activeSection === "polls" && (
                        <div className="space-y-3">
                            {polls.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No polls yet.</p>
                            ) : polls.map((poll) => (
                                <PollCard key={poll._id} poll={poll} myUserId={myUserId} isCoordinator={isCoordinator}
                                    onVote={onVote} onClose={() => { }} onDelete={onDelete} />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

/* ── Active Polls Modal (banner button) ──────────────────── */
function PollsModal({ polls, myUserId, isCoordinator, onVote, onClose, onDelete }: {
    polls: BatchPoll[]; myUserId: string; isCoordinator: boolean;
    onVote: (pollId: string, optionId: string) => void;
    onClose: () => void;
    onDelete: (pollId: string) => void;
}) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
                className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
                    <h2 className="font-bold text-lg">Active Polls</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-100"><RiCloseLine className="text-lg" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3" data-lenis-prevent>
                    {polls.map((poll) => (
                        <PollCard key={poll._id} poll={poll} myUserId={myUserId} isCoordinator={isCoordinator} onVote={onVote} onClose={() => { }} onDelete={onDelete} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

/* ── Voice Recorder hook ─────────────────────────────────── */
function useVoiceRecorder() {
    const [recording, setRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [bars, setBars] = useState<number[]>(Array(20).fill(0.1));
    const mrRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const animFrameRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        const draw = () => {
            const data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
            setBars(Array.from({ length: 20 }, (_, i) => Math.max(0.08, (data[i] ?? 0) / 255)));
            animFrameRef.current = requestAnimationFrame(draw);
        };
        animFrameRef.current = requestAnimationFrame(draw);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
        const mr = new MediaRecorder(stream);
        mrRef.current = mr; chunksRef.current = [];
        mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.start(); setRecording(true);
    }, []);

    const stop = useCallback((): Promise<File> => new Promise((resolve) => {
        cancelAnimationFrame(animFrameRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        audioCtxRef.current?.close();
        setBars(Array(20).fill(0.1));
        const mr = mrRef.current; if (!mr) return;
        mr.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" });
            const file = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
            mrRef.current?.stream.getTracks().forEach((t) => t.stop());
            setRecording(false); setRecordingSeconds(0); resolve(file);
        };
        mr.stop();
    }), []);

    const cancel = useCallback(() => {
        cancelAnimationFrame(animFrameRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        audioCtxRef.current?.close();
        mrRef.current?.stop();
        mrRef.current?.stream.getTracks().forEach((t) => t.stop());
        mrRef.current = null; chunksRef.current = [];
        setRecording(false); setRecordingSeconds(0); setBars(Array(20).fill(0.1));
    }, []);

    return { recording, recordingSeconds, bars, start, stop, cancel };
}

/* ── Voice Message Bubble ────────────────────────────────── */
function VoiceMessageBubble({ url, isMine }: { url: string; isMine: boolean }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Deterministic waveform bars from URL
    const waveformBars = (() => {
        const hash = url.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        return Array.from({ length: 30 }, (_, i) => 0.15 + 0.85 * Math.abs(Math.sin(hash * 0.1 + i * 0.8)));
    })();

    const fmtDur = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    const toggle = () => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) a.pause(); else a.play().catch(() => { });
    };

    return (
        <div className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-2xl min-w-[200px] shadow-sm",
            isMine ? "bg-primary2-600 text-white rounded-br-sm" : "bg-white border border-surface-200 text-neutral-800 rounded-bl-sm"
        )}>
            <button onClick={toggle}
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                    isMine ? "bg-white/20 hover:bg-white/30" : "bg-primary2-50 hover:bg-primary2-100"
                )}>
                {playing
                    ? <RiPauseLine className={cn("text-sm", isMine ? "text-white" : "text-primary2-600")} />
                    : <RiPlayLine className={cn("text-sm", isMine ? "text-white" : "text-primary2-600")} />}
            </button>
            <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-end gap-px h-6">
                    {waveformBars.map((h, i) => {
                        const played = progress > 0 && i / waveformBars.length < progress;
                        return (
                            <span key={i}
                                className={cn("rounded-full flex-1 transition-colors",
                                    played
                                        ? (isMine ? "bg-white" : "bg-primary2-600")
                                        : (isMine ? "bg-white/35" : "bg-neutral-300"))}
                                style={{ height: `${h * 100}%`, minHeight: 3 }} />
                        );
                    })}
                </div>
                <span className={cn("text-[10px]", isMine ? "text-white/70" : "text-muted-foreground")}>
                    {duration > 0 ? fmtDur(playing ? progress * duration : duration) : "●●●"}
                </span>
            </div>
            <audio ref={audioRef} src={url}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => { setPlaying(false); setProgress(0); }}
                onTimeUpdate={() => { const a = audioRef.current; if (a?.duration) setProgress(a.currentTime / a.duration); }}
                onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
            />
        </div>
    );
}

/* ── Type helpers ───────────────────────────────────────── */
type CallSystemMsg = { _id: string; callerName: string; hasVideo: boolean; createdAt: string; type: "started" | "joined"; endedAt?: string };
type PendingImage = { id: string; preview: string; file: File; failed: boolean };

/* ── Main Page ───────────────────────────────────────────── */
export default function BatchRoomPage() {
    const authUser = useAppSelector((s) => s.auth.user);
    const myUserId = authUser?._id ?? "";
    const myBatch = authUser?.batch as number | undefined;

    const { data: roomData } = useGetBatchRoomQuery(myBatch!, { skip: !myBatch });
    const { data: messagesData } = useGetBatchMessagesQuery({ year: myBatch! }, { skip: !myBatch });
    const { data: pollsData } = useGetBatchPollsQuery(myBatch!, { skip: !myBatch });
    const { data: membersData } = useGetAllApprovedUsersQuery({ batch: String(myBatch), limit: 200 }, { skip: !myBatch });
    const { data: applicationsData } = useGetBatchCoordinatorApplicationsQuery(myBatch!, { skip: !myBatch });
    const [applyAsCoordinator] = useApplyAsCoordinatorMutation();
    const [createPoll] = useCreateBatchPollMutation();
    const [sendMediaMessage] = useSendBatchMediaMessageMutation();
    const [deleteBatchMessage] = useDeleteBatchMessageMutation();
    const [voteBatchPoll] = useVoteBatchPollMutation();
    const [closeBatchPoll] = useCloseBatchPollMutation();
    const [deleteBatchPoll] = useDeleteBatchPollMutation();

    const [messages, setMessages] = useState<BatchMessage[]>([]);
    const [polls, setPolls] = useState<BatchPoll[]>([]);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const [activeTab, setActiveTab] = useState<"chat" | "members" | "polls">("chat");
    const [showPollModal, setShowPollModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showPollsBanner, setShowPollsBanner] = useState(false);
    const [text, setText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [ongoingCall, setOngoingCall] = useState<{ from: string; name: string; hasVideo: boolean } | null>(null);
    const [isInCall, setIsInCall] = useState(false);
    const [incomingCall, setIncomingCall] = useState<{ from: string; name: string; hasVideo: boolean } | null>(null);
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const [callSystemMsgs, setCallSystemMsgs] = useState<CallSystemMsg[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const msgContainerRef = useRef<HTMLDivElement>(null);
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const ringCtxRef = useRef<AudioContext | null>(null);
    const ringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const ringingRef = useRef(false);

    const room = roomData?.data;
    const coordinatorId = (room?.coordinator as { _id?: string })?._id;
    const isCoordinator = coordinatorId === myUserId;
    const members = membersData?.data ?? [];
    const openPolls = polls.filter((p) => p.isOpen);

    // Coordinator application state
    const applications = applicationsData?.data ?? [];
    const pendingApplication = applications.find((a) => a.status === "PENDING");
    const myApplication = applications.find((a) => a.applicant._id === myUserId);
    const hasCoordinator = !!room?.coordinator;
    const canApply = !hasCoordinator && !pendingApplication && !myApplication;

    const { recording, recordingSeconds, bars: recordingBars, start: startRecording, stop: stopRecording, cancel: cancelRecording } = useVoiceRecorder();

    useEffect(() => { if (messagesData?.data) setMessages(messagesData.data); }, [messagesData]);
    useEffect(() => { if (pollsData?.data) setPolls(pollsData.data); }, [pollsData]);
    useEffect(() => {
        const c = msgContainerRef.current;
        if (c) c.scrollTop = c.scrollHeight;
    }, [messages.length, pendingImages.length]);

    // Synthesised ring tone using Web Audio API.
    // No file needed — works without autoplay permissions because AudioContext.resume()
    // is called lazily; the context is created on first user interaction (see the
    // document-level click handler below) so it's already unlocked by the time
    // a call arrives via socket.
    const getRingCtx = useCallback(() => {
        if (!ringCtxRef.current) ringCtxRef.current = new AudioContext();
        if (ringCtxRef.current.state === "suspended") void ringCtxRef.current.resume();
        return ringCtxRef.current;
    }, []);

    const startRingtone = useCallback(() => {
        if (ringingRef.current) return;
        ringingRef.current = true;
        const ctx = getRingCtx();
        const tick = () => {
            if (!ringingRef.current) return;
            // Classic phone ring: two 440+480 Hz bursts, ~0.4 s each, 0.2 s gap, then 2 s silence
            [[0, 440], [0, 480], [0.5, 440], [0.5, 480]].forEach(([t, freq]) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.07, ctx.currentTime + t);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.42);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + t);
                osc.stop(ctx.currentTime + t + 0.42);
            });
            ringTimerRef.current = setTimeout(tick, 2400);
        };
        tick();
    }, [getRingCtx]);

    const stopRingtone = useCallback(() => {
        ringingRef.current = false;
        if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
    }, []);

    // Pre-unlock AudioContext on first user interaction so it's ready when a call arrives
    useEffect(() => {
        const unlock = () => { getRingCtx(); };
        document.addEventListener("click", unlock, { once: true });
        document.addEventListener("keydown", unlock, { once: true });
        document.addEventListener("pointerdown", unlock, { once: true });
        return () => {
            document.removeEventListener("click", unlock);
            document.removeEventListener("keydown", unlock);
            document.removeEventListener("pointerdown", unlock);
            stopRingtone();
            ringCtxRef.current?.close();
        };
    }, [getRingCtx, stopRingtone]);

    const { startTyping, stopTyping } = useBatchSocket(myBatch, {
        onMessageNew: (msg) => setMessages((prev) => prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]),
        onMessageDeleted: ({ messageId }) => setMessages((prev) => prev.map((m) => m._id === messageId ? { ...m, isDeleted: true } : m)),
        onPollUpdated: (poll) => setPolls((prev) => prev.map((p) => p._id === poll._id ? poll : p)),
        onPollDeleted: ({ pollId }) => setPolls((prev) => prev.filter((p) => p._id !== pollId)),
        onTypingUpdate: ({ userId, userName, typing }) => {
            setTypingUsers((prev) => {
                if (typing) {
                    return prev.some((u) => u.userId === userId) ? prev : [...prev, { userId, name: userName }];
                }
                return prev.filter((u) => u.userId !== userId);
            });
        },
        onCallIncoming: (data) => {
            // Always ignore our own events (call-tab socket fires call:start → our batch-room socket receives it)
            if (data.from === myUserId) return;

            if (ongoingCall) {
                // Call is already ongoing — this person is joining, not starting
                setCallSystemMsgs((prev) => [
                    ...prev,
                    { _id: `call-sys-${Date.now()}`, callerName: data.name, hasVideo: data.hasVideo, createdAt: new Date().toISOString(), type: "joined" },
                ]);
                return; // no popup, no ringtone
            }

            if (isInCall) return; // safety guard

            // Fresh call — show incoming popup and ring
            setIncomingCall(data);
            setOngoingCall(data);
            setCallSystemMsgs((prev) => [
                ...prev,
                { _id: `call-sys-${Date.now()}`, callerName: data.name, hasVideo: data.hasVideo, createdAt: new Date().toISOString(), type: "started" },
            ]);
            startRingtone();
        },
        onCallEnded: () => {
            // All participants left — reset call state so the header shows normal icons
            stopRingtone();
            setIncomingCall(null);
            setOngoingCall(null);
            setIsInCall(false);
            // Stamp the last "started" message with an endedAt for duration display
            setCallSystemMsgs((prev) => {
                const idx = [...prev].reverse().findIndex((m) => m.type === "started" && !m.endedAt);
                if (idx === -1) return prev;
                const realIdx = prev.length - 1 - idx;
                return prev.map((m, i) => i === realIdx ? { ...m, endedAt: new Date().toISOString() } : m);
            });
        },
    });

    // Merge regular messages with call-system events, sorted by time
    const allChatItems = useMemo<(BatchMessage | CallSystemMsg)[]>(
        () => [...messages, ...callSystemMsgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        [messages, callSystemMsgs]
    );

    const handleSend = () => {
        if (recording) {
            setIsSending(true);
            stopRecording().then((file) => {
                const fd = new FormData();
                fd.append("image", file);
                sendMediaMessage({ year: myBatch!, formData: fd }).unwrap()
                    .then((res) => {
                        if (res.data) setMessages((prev) => prev.some((m) => m._id === res.data._id) ? prev : [...prev, res.data]);
                    })
                    .catch(() => toast.error("Failed to send voice message."))
                    .finally(() => setIsSending(false));
            }).catch(() => setIsSending(false));
            return;
        }

        const trimmed = text.trim();
        if (!trimmed) return;
        setIsSending(true);
        const fd = new FormData();
        fd.append("body", trimmed);
        sendMediaMessage({ year: myBatch!, formData: fd }).unwrap()
            .then((res) => {
                if (res.data) setMessages((prev) => prev.some((m) => m._id === res.data._id) ? prev : [...prev, res.data]);
                setText("");
            })
            .catch((err) => toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to send message."))
            .finally(() => setIsSending(false));
    };

    const handleTextChange = (value: string) => {
        setText(value);
        startTyping();
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(stopTyping, 2000);
    };

    const handleDeleteMsg = async (msg: BatchMessage) => {
        // Optimistic UI update
        setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, isDeleted: true } : m));
        try {
            await deleteBatchMessage({ year: myBatch!, messageId: msg._id }).unwrap();
        } catch {
            // Revert on failure
            setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, isDeleted: false } : m));
            toast.error("Failed to delete message.");
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // reset so same file can be re-selected
        if (!file) return;
        const pendingId = `pending-${Date.now()}`;
        const preview = URL.createObjectURL(file);
        setPendingImages((prev) => [...prev, { id: pendingId, preview, file, failed: false }]);
        const fd = new FormData();
        fd.append("image", file);
        sendMediaMessage({ year: myBatch!, formData: fd }).unwrap()
            .then((res) => {
                setPendingImages((prev) => prev.filter((p) => p.id !== pendingId));
                if (res.data) setMessages((prev) => prev.some((m) => m._id === res.data._id) ? prev : [...prev, res.data]);
            })
            .catch(() => setPendingImages((prev) => prev.map((p) => p.id === pendingId ? { ...p, failed: true } : p)));
    };

    const retryPendingImage = (pendingId: string) => {
        const pending = pendingImages.find((p) => p.id === pendingId);
        if (!pending) return;
        setPendingImages((prev) => prev.map((p) => p.id === pendingId ? { ...p, failed: false } : p));
        const fd = new FormData();
        fd.append("image", pending.file);
        sendMediaMessage({ year: myBatch!, formData: fd }).unwrap()
            .then((res) => {
                setPendingImages((prev) => prev.filter((p) => p.id !== pendingId));
                if (res.data) setMessages((prev) => prev.some((m) => m._id === res.data._id) ? prev : [...prev, res.data]);
            })
            .catch(() => setPendingImages((prev) => prev.map((p) => p.id === pendingId ? { ...p, failed: true } : p)));
    };

    const handleCreatePoll = async (data: { question: string; options: string[]; deadline?: string }) => {
        try {
            const res = await createPoll({ year: myBatch!, ...data }).unwrap();
            if (res.data) setPolls((prev) => [...prev, res.data]);
        } catch { toast.error("Failed to create poll."); }
    };

    const handleVote = async (pollId: string, optionId: string) => {
        try {
            const res = await voteBatchPoll({ year: myBatch!, pollId, optionId }).unwrap();
            if (res.data) setPolls((prev) => prev.map((p) => p._id === pollId ? res.data : p));
        } catch (e) {
            toast.error((e as { data?: { message?: string } })?.data?.message ?? "Failed to cast vote.");
        }
    };
    const handleClosePoll = async (pollId: string) => {
        try {
            const res = await closeBatchPoll({ year: myBatch!, pollId }).unwrap();
            if (res.data) setPolls((prev) => prev.map((p) => p._id === pollId ? res.data : p));
        } catch (e) {
            toast.error((e as { data?: { message?: string } })?.data?.message ?? "Failed to close poll.");
        }
    };
    const handleDeletePoll = async (pollId: string) => {
        try {
            await deleteBatchPoll({ year: myBatch!, pollId }).unwrap();
            setPolls((prev) => prev.filter((p) => p._id !== pollId));
        } catch (e) {
            toast.error((e as { data?: { message?: string } })?.data?.message ?? "Failed to delete poll.");
        }
    };

    const handleApply = async () => {
        try {
            await applyAsCoordinator(myBatch!).unwrap();
            toast.success("Application submitted! A poll will be created for batch vote.");
        } catch (e: unknown) {
            toast.error((e as { data?: { message?: string } })?.data?.message ?? "Failed to apply.");
        }
    };

    const openCallTab = (hasVideo: boolean) => {
        stopRingtone();
        setIncomingCall(null);
        setIsInCall(true);
        const callerName = authUser?.name ?? "You";
        const isJoining = !!ongoingCall; // receiver clicking "Join call" vs caller starting new call
        if (!isJoining) {
            // Caller starts a new call — show the header "Join call" button for themselves too
            setOngoingCall({ from: myUserId, name: callerName, hasVideo });
        }
        setCallSystemMsgs((prev) => [
            ...prev,
            { _id: `call-sys-${Date.now()}`, callerName, hasVideo: isJoining ? ongoingCall!.hasVideo : hasVideo, createdAt: new Date().toISOString(), type: isJoining ? "joined" : "started" },
        ]);
        window.open(`/batch-room/call?video=${isJoining ? ongoingCall!.hasVideo : hasVideo}&batch=${myBatch}`, "_blank", "width=1200,height=800,menubar=no,toolbar=no,location=no");
    };

    if (!myBatch) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <p className="text-muted-foreground text-sm">Your account doesn&apos;t have a batch assigned.</p>
            </div>
        );
    }

    return (
        <div className="three-xl-section-setup flex flex-col h-[calc(100vh-120px)] min-h-0">
            {/* ── Active poll banner ── */}
            {openPolls.length > 0 && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
                    <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
                        <RiBarChartLine className="text-amber-500" />
                        {openPolls.length} active poll{openPolls.length > 1 ? "s" : ""} running
                    </span>
                    <button onClick={() => setShowPollsBanner(true)}
                        className="text-xs bg-amber-600 text-white px-3 py-1 rounded-full hover:bg-amber-700 transition-colors">
                        View polls
                    </button>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-surface-200 bg-white flex-shrink-0">
                <div>
                    <h1 className="font-bold text-lg text-primary2-900">{room?.name ?? `Batch ${myBatch} Room`}</h1>
                    {room?.coordinator && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <RiShieldUserLine className="text-amber-500" />
                            Coordinator: {(room.coordinator as { name?: string }).name ?? "—"}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    {ongoingCall ? (
                        <>
                            <button onClick={() => openCallTab(ongoingCall.hasVideo)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors">
                                <RiPhoneLine className="text-sm" />
                                <span>Join call</span>
                            </button>
                            <button onClick={() => setOngoingCall(null)} title="Dismiss"
                                className="p-1.5 text-muted-foreground hover:text-neutral-700 rounded-lg hover:bg-surface-100 transition-colors">
                                <RiCloseLine className="text-sm" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => openCallTab(false)} title="Voice call"
                                className="p-2 rounded-lg border border-surface-200 text-neutral-600 hover:bg-surface-50 transition-colors">
                                <RiMicLine className="text-lg" />
                            </button>
                            <button onClick={() => openCallTab(true)} title="Video call"
                                className="p-2 rounded-lg border border-surface-200 text-neutral-600 hover:bg-surface-50 transition-colors">
                                <RiVideoLine className="text-lg" />
                            </button>
                        </>
                    )}
                    <button onClick={() => setShowInfoModal(true)} title="Group info"
                        className="p-2 rounded-lg border border-surface-200 text-neutral-600 hover:bg-surface-50 transition-colors">
                        <RiInformationLine className="text-lg" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0">
                {/* ── Sidebar ── */}
                <div className="w-64 border-r border-surface-200 bg-white flex-shrink-0 flex-col hidden md:flex">
                    <div className="flex border-b border-surface-200">
                        {(["chat", "members", "polls"] as const).map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={cn("flex-1 text-[11px] font-medium py-2.5 transition-colors capitalize border-b-2",
                                    activeTab === tab ? "border-primary2-600 text-primary2-700" : "border-transparent text-muted-foreground hover:text-neutral-700")}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Coordinator strip */}
                    <div className="p-4 border-b border-surface-100 flex-shrink-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Coordinator</p>
                        {room?.coordinator ? (
                            <div className="flex items-center gap-2">
                                <Av name={(room.coordinator as { name?: string }).name ?? "?"} imageUrl={(room.coordinator as { imageUrl?: string }).imageUrl} size={30} />
                                <span className="text-sm text-neutral-800 font-medium">{(room.coordinator as { name?: string }).name}</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">No coordinator yet.</p>
                                {/* Show application status */}
                                {pendingApplication && (
                                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1.5">
                                        <p className="text-[10px] text-amber-700 font-medium">Pending: {pendingApplication.applicant.name}</p>
                                        <p className="text-[10px] text-amber-600">Vote in the election poll above</p>
                                    </div>
                                )}
                                {myApplication && myApplication.status === "REJECTED" && (
                                    <div className="rounded-lg bg-red-50 border border-red-200 px-2 py-1.5">
                                        <p className="text-[10px] text-red-700 font-medium">Your application was rejected</p>
                                        {myApplication.rejectionNote && <p className="text-[10px] text-red-600 mt-0.5">{myApplication.rejectionNote}</p>}
                                    </div>
                                )}
                                {canApply && (
                                    <button onClick={handleApply}
                                        className="text-xs bg-primary2-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary2-700 transition-colors w-full">
                                        Apply as Coordinator
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Members */}
                    {activeTab === "members" && (
                        <div className="flex-1 overflow-y-auto p-3 space-y-1" data-lenis-prevent>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-1">Members ({members.length})</p>
                            {members.map((m) => (
                                <div key={m._id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-surface-50">
                                    <Av name={m.name} imageUrl={m.imageUrl} size={28} />
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-neutral-800 truncate">{m.name}</p>
                                        {m._id === coordinatorId && (
                                            <p className="text-[10px] text-amber-600 flex items-center gap-0.5"><RiShieldUserLine />Coordinator</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {members.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No members yet.</p>}
                        </div>
                    )}

                    {/* Polls */}
                    {activeTab === "polls" && (
                        <div className="flex-1 overflow-y-auto p-4 space-y-3" data-lenis-prevent>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Polls</p>
                                <button onClick={() => setShowPollModal(true)}
                                    className="text-xs bg-primary2-600 text-white px-2 py-1 rounded-lg hover:bg-primary2-700 transition-colors flex items-center gap-0.5">
                                    <RiAddLine /> New
                                </button>
                            </div>
                            {polls.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No polls yet.</p>
                            ) : polls.map((poll) => (
                                <PollCard key={poll._id} poll={poll} myUserId={myUserId} isCoordinator={isCoordinator}
                                    onVote={handleVote} onClose={handleClosePoll} onDelete={handleDeletePoll} />
                            ))}
                        </div>
                    )}

                    {/* Chat placeholder */}
                    {activeTab === "chat" && (
                        <div className="flex-1 flex items-center justify-center p-4">
                            <div className="text-center">
                                <RiGroupLine className="text-4xl text-primary2-200 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">Real-time batch chat</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Chat Area ── */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div ref={msgContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-surface-50/40" data-lenis-prevent style={{ minHeight: 0 }}>
                        {allChatItems.map((item) => {
                            /* ── Call system event ── */
                            if ("callerName" in item) {
                                const durationMs = item.endedAt
                                    ? new Date(item.endedAt).getTime() - new Date(item.createdAt).getTime()
                                    : null;
                                const durationLabel = durationMs !== null ? (() => {
                                    const s = Math.round(durationMs / 1000);
                                    const m = Math.floor(s / 60);
                                    const sec = s % 60;
                                    return m > 0 ? `${m}m ${sec > 0 ? `${sec}s` : ""}`.trim() : `${sec}s`;
                                })() : null;
                                return (
                                    <div key={item._id} className="flex justify-center my-1">
                                        <div className="bg-surface-100 border border-surface-200 rounded-full px-4 py-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                            {item.hasVideo
                                                ? <RiVideoLine className="text-blue-500 flex-shrink-0" />
                                                : <RiPhoneLine className="text-green-500 flex-shrink-0" />}
                                            <span>
                                                <strong className="text-neutral-700">{item.callerName}</strong>
                                                {item.type === "joined" ? " joined the " : " started a "}
                                                {item.hasVideo ? "video" : "voice"}{" call"}
                                            </span>
                                            <span className="text-surface-300">·</span>
                                            <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                                            {durationLabel && (
                                                <>
                                                    <span className="text-surface-300">·</span>
                                                    <span>{durationLabel}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            /* ── Regular message ── */
                            const msg = item;
                            const isMine = (msg.author as { _id?: string })?._id === myUserId;
                            const isAudio = msg.imageUrl && (
                                msg.imageUrl.includes("/video/upload/") || // cloudinary audio stored as video
                                msg.imageUrl.endsWith(".webm") ||
                                msg.imageUrl.endsWith(".mp3") ||
                                msg.imageUrl.endsWith(".ogg") ||
                                msg.imageUrl.endsWith(".wav")
                            );

                            if (msg.isDeleted) {
                                return (
                                    <div key={msg._id} className={cn("text-xs text-muted-foreground italic", isMine ? "text-right" : "text-left")}>
                                        <em>Message deleted</em>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg._id} className={cn("group flex items-end gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
                                    {!isMine && <Av name={msg.author.name} imageUrl={msg.author.imageUrl} size={28} />}
                                    <div className={cn("max-w-[70%] flex flex-col", isMine ? "items-end" : "items-start")}>
                                        {!isMine && <p className="text-[10px] text-muted-foreground mb-0.5 ml-1">{msg.author.name}</p>}
                                        <div className="relative">
                                            {msg.imageUrl && !isAudio && (
                                                <a href={msg.imageUrl} target="_blank" rel="noreferrer">
                                                    <Image src={msg.imageUrl} alt="img" width={240} height={160}
                                                        className="rounded-xl object-cover max-w-full hover:opacity-90 transition-opacity" style={{ maxHeight: 200 }} />
                                                </a>
                                            )}
                                            {isAudio && <VoiceMessageBubble url={msg.imageUrl!} isMine={isMine} />}
                                            {msg.body && (
                                                <div className={cn("px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm mt-1",
                                                    isMine ? "bg-primary2-600 text-white rounded-br-sm" : "bg-white border border-surface-200 text-neutral-800 rounded-bl-sm")}>
                                                    {msg.body}
                                                </div>
                                            )}
                                            {isMine && (
                                                <button onClick={() => handleDeleteMsg(msg)}
                                                    className="absolute -left-6 top-1 p-1 rounded-full bg-red-50 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <RiDeleteBin6Line className="text-xs" />
                                                </button>
                                            )}
                                        </div>
                                        <p className={cn("text-[10px] text-muted-foreground mt-0.5", isMine ? "text-right" : "text-left")}>
                                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                            {isMine && msg.seenBy.length > 1 && <RiCheckDoubleLine className="inline ml-1 text-primary2-400" />}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {typingUsers.length > 0 && (
                            <p className="text-xs text-muted-foreground italic">
                                {typingUsers.map((u) => u.name).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
                            </p>
                        )}
                        {messages.length === 0 && pendingImages.length === 0 && callSystemMsgs.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-12">No messages yet. Say hello! 👋</p>
                        )}
                        {/* Uploading images — optimistic UI */}
                        {pendingImages.map((pending) => (
                            <div key={pending.id} className="flex justify-end">
                                <div className="max-w-[70%] flex flex-col items-end">
                                    <div className="relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={pending.preview} alt="uploading"
                                            className={cn("rounded-xl object-cover max-w-full", pending.failed ? "opacity-40" : "opacity-70")}
                                            style={{ maxHeight: 200, maxWidth: 240 }} />
                                        {!pending.failed && (
                                            <div className="absolute inset-0 rounded-xl bg-black/20 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                        {pending.failed && (
                                            <div className="absolute inset-0 rounded-xl bg-black/55 flex flex-col items-center justify-center gap-2">
                                                <button onClick={() => retryPendingImage(pending.id)}
                                                    className="px-3 py-1 bg-white text-neutral-800 text-xs rounded-full hover:bg-neutral-100 transition-colors font-medium flex items-center gap-1">
                                                    <RiRefreshLine className="text-xs" /> Resend
                                                </button>
                                                <button onClick={() => setPendingImages((prev) => prev.filter((p) => p.id !== pending.id))}
                                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors">
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-surface-200 px-3 py-3 bg-white flex-shrink-0 flex items-center gap-2">
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

                        {recording ? (
                            /* ── Recording mode UI ── */
                            <>
                                {/* Cancel button */}
                                <button onClick={cancelRecording} title="Cancel recording"
                                    className="p-2 text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                                    <RiCloseLine className="text-xl" />
                                </button>
                                {/* Live waveform + timer */}
                                <div className="flex-1 flex items-center gap-2 bg-red-50 rounded-full px-4 py-2 min-w-0">
                                    <span className="relative flex h-2 w-2 flex-shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                                    </span>
                                    <div className="flex items-end gap-px flex-1 h-5">
                                        {recordingBars.map((h, i) => (
                                            <span key={i} className="flex-1 bg-red-400 rounded-full"
                                                style={{ height: `${Math.max(h * 100, 15)}%` }} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-red-600 font-mono tabular-nums flex-shrink-0">
                                        {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")}
                                    </span>
                                </div>
                                {/* Send button (stops recording + sends) */}
                                <button onClick={handleSend} disabled={isSending}
                                    className="p-2.5 bg-primary2-600 text-white rounded-full hover:bg-primary2-700 disabled:opacity-50 transition-colors flex-shrink-0">
                                    {isSending
                                        ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <RiSendPlaneLine className="text-lg" />}
                                </button>
                            </>
                        ) : (
                            /* ── Normal mode UI ── */
                            <>
                                <button onClick={() => fileInputRef.current?.click()} title="Attach image"
                                    className="p-2 text-muted-foreground hover:text-primary2-600 transition-colors flex-shrink-0">
                                    <RiImageLine className="text-xl" />
                                </button>
                                <button onClick={() => !isSending && startRecording().catch(() => toast.error("Microphone permission denied."))}
                                    disabled={isSending}
                                    title="Voice message"
                                    className="p-2 text-muted-foreground hover:text-primary2-600 disabled:opacity-50 transition-colors flex-shrink-0">
                                    <RiMicLine className="text-xl" />
                                </button>
                                <input
                                    value={text}
                                    onChange={(e) => handleTextChange(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                                    placeholder="Message your batch…"
                                    className="flex-1 text-sm px-4 py-2.5 rounded-full border border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary2-300 transition-colors"
                                />
                                <button onClick={handleSend} disabled={!text.trim() || isSending}
                                    className="p-2.5 bg-primary2-600 text-white rounded-full hover:bg-primary2-700 disabled:opacity-50 transition-colors flex-shrink-0">
                                    {isSending
                                        ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <RiSendPlaneLine className="text-lg" />}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Incoming call banner ── */}
            <AnimatePresence>
                {incomingCall && (
                    <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-surface-200 px-6 py-4 flex items-center gap-4">
                        <div>
                            <p className="font-semibold text-sm">{incomingCall.name} is calling…</p>
                            <p className="text-xs text-muted-foreground">{incomingCall.hasVideo ? "Video call" : "Voice call"}</p>
                        </div>
                        <button onClick={() => { openCallTab(incomingCall.hasVideo); setIncomingCall(null); }}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition-colors">Answer</button>
                        <button onClick={() => { stopRingtone(); setIncomingCall(null); }}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors">Decline</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Modals ── */}
            <AnimatePresence>
                {showInfoModal && (
                    <GroupInfoModal
                        room={room ? { name: room.name, coordinator: room.coordinator, batchYear: room.batchYear } : null}
                        myBatch={myBatch} myUserId={myUserId} isCoordinator={isCoordinator}
                        polls={polls} onClose={() => setShowInfoModal(false)} onVote={handleVote} onDelete={handleDeletePoll}
                    />
                )}
                {showPollsBanner && (
                    <PollsModal polls={openPolls} myUserId={myUserId} isCoordinator={isCoordinator}
                        onVote={handleVote} onClose={() => setShowPollsBanner(false)} onDelete={handleDeletePoll} />
                )}
            </AnimatePresence>

            {showPollModal && (
                <CreatePollModal onClose={() => setShowPollModal(false)} onCreate={handleCreatePoll} />
            )}
        </div>
    );
}
