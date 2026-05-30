"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    RiBriefcaseLine,
    RiBookOpenLine,
    RiToolsLine,
    RiMapPinLine,
    RiTimeLine,
    RiCalendarLine,
    RiArrowLeftLine,
    RiHeartLine,
    RiHeartFill,
    RiThumbDownLine,
    RiChat3Line,
    RiSendPlaneLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiAlertLine,
    RiCheckLine,
    RiFileLine,
    RiDeleteBinLine,
    RiStickyNoteLine,
    RiCloseLine,
    RiUserLine,
} from "react-icons/ri";
import { format, formatDistanceToNow } from "date-fns";
import {
    useGetJobByIdQuery,
    useReactToJobMutation,
    useAddCommentMutation,
    useAddReplyMutation,
    useDeleteCommentMutation,
    useDeleteReplyMutation,
    useApplyToJobMutation,
    useGetJobApplicationsQuery,
    useGetMyApplicationsQuery,
    useSelectApplicantMutation,
    useReactToCommentMutation,
    useReactToReplyMutation,
    useGetMyProviderProfileQuery,
} from "@/redux/apis/jobApi";
import { useAppSelector } from "@/redux/hooks";
import { IComment, IJobPost, TCommentReactionType } from "@/components/modules/user/job/job.types";

/* â”€â”€ Type config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const TYPE_CONFIG = {
    OFFICIAL: { label: "Official Job", color: "bg-blue-50 text-blue-700 border border-blue-200", icon: <RiBriefcaseLine /> },
    TUITION: { label: "Tuition Seek", color: "bg-primary2-50 text-primary2-700 border border-primary2-200", icon: <RiBookOpenLine /> },
    PERSONAL: { label: "Service Seek", color: "bg-violet-50 text-violet-700 border border-violet-200", icon: <RiToolsLine /> },
};

const STATUS_CONFIG = {
    PENDING: { label: "Pending Review", color: "text-amber-700 bg-amber-50 border border-amber-200", icon: <RiTimeLine /> },
    APPROVED: { label: "Active", color: "text-primary2-700 bg-primary2-50 border border-primary2-200", icon: <RiCheckboxCircleLine /> },
    REJECTED: { label: "Rejected", color: "text-red-700 bg-red-50 border border-red-200", icon: <RiCloseCircleLine /> },
    CLOSED: { label: "Closed", color: "text-neutral-600 bg-surface-100 border border-surface-300", icon: <RiCheckLine /> },
};

/* â”€â”€ Avatar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Avatar({ user, size = 32 }: { user: { name: string; imageUrl?: string }; size?: number }) {
    if (user.imageUrl) {
        return <Image src={user.imageUrl} alt={user.name} width={size} height={size} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />;
    }
    return (
        <div
            className="rounded-full bg-primary2-100 flex items-center justify-center font-bold text-primary2-700 flex-shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {user.name[0]}
        </div>
    );
}

/* â”€â”€ Reaction config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const REACTIONS: { type: TCommentReactionType; emoji: string; label: string }[] = [
    { type: "LIKE", emoji: "ðŸ‘", label: "Like" },
    { type: "LOVE", emoji: "â¤ï¸", label: "Love" },
    { type: "HAHA", emoji: "ðŸ˜‚", label: "Haha" },
    { type: "SAD", emoji: "ðŸ˜¢", label: "Sad" },
    { type: "ANGRY", emoji: "ðŸ˜ ", label: "Angry" },
    { type: "DISLIKE", emoji: "ðŸ‘Ž", label: "Dislike" },
];

function groupReactions(reactions: { userId: string; type: TCommentReactionType }[]) {
    const counts: Partial<Record<TCommentReactionType, number>> = {};
    for (const r of reactions) counts[r.type] = (counts[r.type] ?? 0) + 1;
    return Object.entries(counts) as [TCommentReactionType, number][];
}

/* â”€â”€ Reaction Picker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ReactionPicker({ onReact }: { onReact: (type: TCommentReactionType) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1 flex gap-1 bg-white rounded-2xl border border-surface-200 shadow-lg px-2 py-1.5 z-20"
        >
            {REACTIONS.map((r) => (
                <button
                    key={r.type}
                    title={r?.label}
                    onClick={() => onReact(r.type)}
                    className="text-lg hover:scale-125 transition-transform duration-150 p-0.5"
                >
                    {r?.emoji}
                </button>
            ))}
        </motion.div>
    );
}

/* â”€â”€ Reactions Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type ReactorsTab = "LIKE" | "DISLIKE" | TCommentReactionType;

function ReactorsModal({
    open,
    onClose,
    tabs,
}: {
    open: boolean;
    onClose: () => void;
    tabs: { type: ReactorsTab; emoji: string; label: string; users: { name: string; imageUrl?: string }[] }[];
}) {
    const [activeTab, setActiveTab] = useState<ReactorsTab>(tabs[0]?.type ?? "LIKE");
    if (!open) return null;

    const activeUsers = tabs.find((t) => t.type === activeTab)?.users ?? [];

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={{ duration: 0.18 }}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
                            <h3 className="font-bold text-primary2-900">Reactions</h3>
                            <button onClick={onClose} className="text-muted-foreground hover:text-primary2-700 transition-colors p-1 rounded-lg hover:bg-surface-100">
                                <RiCloseLine className="text-xl" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-surface-200 overflow-x-auto">
                            {tabs.filter(t => t.users.length > 0).map((tab) => (
                                <button
                                    key={tab.type}
                                    onClick={() => setActiveTab(tab.type)}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.type ? "border-primary2-600 text-primary2-700 font-semibold" : "border-transparent text-muted-foreground hover:text-primary2-700"}`}
                                >
                                    <span>{tab.emoji}</span>
                                    <span>{tab.users.length}</span>
                                </button>
                            ))}
                        </div>

                        {/* User list */}
                        <div className="max-h-72 overflow-y-auto px-3 py-2">
                            {activeUsers.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">No reactions</p>
                            ) : (
                                activeUsers.map((u, i) => (
                                    <div key={i} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-surface-50 transition-colors">
                                        {u.imageUrl ? (
                                            <Image src={u.imageUrl} alt={u.name} width={36} height={36} className="rounded-full object-cover" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-primary2-100 flex items-center justify-center text-sm font-bold text-primary2-700">
                                                {u.name[0]}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-primary2-900">{u.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

/* â”€â”€ Comment Reactions Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CommentReactionsModal({
    open,
    onClose,
    reactions,
}: {
    open: boolean;
    onClose: () => void;
    reactions: { userId: string; type: TCommentReactionType }[];
}) {
    const groups = REACTIONS.map((r) => ({
        ...r,
        count: reactions.filter((x) => x.type === r.type).length,
    })).filter((g) => g.count > 0);

    const [activeTab, setActiveTab] = useState<TCommentReactionType>(groups[0]?.type ?? "LIKE");
    if (!open || groups.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
                    <h3 className="font-bold text-primary2-900">Reactions</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-primary2-700 transition-colors p-1 rounded-lg hover:bg-surface-100">
                        <RiCloseLine className="text-xl" />
                    </button>
                </div>
                <div className="flex border-b border-surface-200 overflow-x-auto">
                    {groups.map((g) => (
                        <button
                            key={g.type}
                            onClick={() => setActiveTab(g.type)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === g.type ? "border-primary2-600 text-primary2-700 font-semibold" : "border-transparent text-muted-foreground hover:text-primary2-700"}`}
                        >
                            <span>{g.emoji}</span>
                            <span>{g.count}</span>
                        </button>
                    ))}
                </div>
                <div className="px-5 py-4 text-sm text-muted-foreground">
                    {groups.find(g => g.type === activeTab)?.count ?? 0} {groups.find(g => g.type === activeTab)?.label} reactions
                </div>
            </motion.div>
        </div>
    );
}

/* â”€â”€ Comment Item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CommentItem({
    comment,
    jobId,
    userId,
    role,
}: {
    comment: IComment;
    jobId: string;
    userId: string;
    role: string;
}) {
    const REPLIES_PER_PAGE = 10;
    const [showReply, setShowReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [visibleCount, setVisibleCount] = useState(REPLIES_PER_PAGE);
    const [replyBody, setReplyBody] = useState("");
    const [showCommentPicker, setShowCommentPicker] = useState(false);
    const [showCommentReactionsModal, setShowCommentReactionsModal] = useState(false);
    const [addReply, { isLoading: replying }] = useAddReplyMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [deleteReply] = useDeleteReplyMutation();
    const [reactToComment] = useReactToCommentMutation();
    const [reactToReply] = useReactToReplyMutation();

    const canDeleteComment = role === "ADMIN" || (comment.author as unknown as { _id: string })?._id === userId;

    const myCommentReaction = comment.reactions?.find((r) => r.userId === userId)?.type;
    const commentReactionGroups = groupReactions(comment.reactions ?? []);

    const handleReply = async () => {
        if (!replyBody.trim()) return;
        await addReply({ id: jobId, commentId: comment._id, body: replyBody });
        setReplyBody("");
        setShowReply(false);
        setShowReplies(true);
        setVisibleCount((v) => v + 1);
    };

    const handleCommentReact = (type: TCommentReactionType) => {
        reactToComment({ id: jobId, commentId: comment._id, reactionType: type });
        setShowCommentPicker(false);
    };

    const totalReplies = comment.replies.length;
    const visibleReplies = comment.replies.slice(0, visibleCount);

    return (
        <div className="flex gap-3">
            <Avatar user={comment.author} size={32} />
            <div className="flex-1 min-w-0">
                {/* Comment bubble */}
                <div className="bg-surface-50 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-primary2-900">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="text-sm text-neutral-700">{comment.body}</p>
                </div>

                {/* Comment reaction summary â€” clickable to open modal */}
                {commentReactionGroups.length > 0 && (
                    <button
                        onClick={() => setShowCommentReactionsModal(true)}
                        className="flex items-center gap-1.5 mt-1 px-1 hover:opacity-70 transition-opacity"
                    >
                        {commentReactionGroups.map(([type, count]) => {
                            const r = REACTIONS.find((x) => x.type === type);
                            return r ? <span key={type} className="text-xs text-muted-foreground">{r.emoji} {count}</span> : null;
                        })}
                    </button>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 mt-1 px-1 relative">
                    {/* Reaction button */}
                    <div className="relative">
                        <button
                            onMouseEnter={() => setShowCommentPicker(true)}
                            onMouseLeave={() => setShowCommentPicker(false)}
                            onClick={() => handleCommentReact(myCommentReaction === "LIKE" ? "LIKE" : "LIKE")}
                            className={`text-xs transition-colors ${myCommentReaction ? "text-primary2-700 font-semibold" : "text-muted-foreground hover:text-primary2-700"}`}
                        >
                            {myCommentReaction ? (REACTIONS.find((r) => r.type === myCommentReaction)?.emoji + " " + myCommentReaction) : "ðŸ‘ Like"}
                        </button>
                        <AnimatePresence>
                            {showCommentPicker && (
                                <div onMouseEnter={() => setShowCommentPicker(true)} onMouseLeave={() => setShowCommentPicker(false)}>
                                    <ReactionPicker onReact={handleCommentReact} />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {userId && <button onClick={() => setShowReply(!showReply)} className="text-xs text-muted-foreground hover:text-primary2-700 transition-colors">Reply</button>}

                    {canDeleteComment && (
                        <button onClick={() => deleteComment({ id: jobId, commentId: comment._id })} className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-0.5">
                            <RiDeleteBinLine /> Delete
                        </button>
                    )}
                </div>

                {/* Show/Hide replies toggle */}
                {totalReplies > 0 && !showReplies && (
                    <button onClick={() => setShowReplies(true)} className="mt-2 ml-1 text-xs text-primary2-700 font-medium hover:underline">
                        View {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
                    </button>
                )}

                {/* Replies list */}
                {showReplies && (
                    <div className="mt-2 space-y-2">
                        {visibleReplies.map((reply) => {
                            const canDeleteReply = role === "ADMIN" || (reply.author as unknown as { _id: string })?._id === userId;
                            const myReplyReaction = reply.reactions?.find((r) => r.userId === userId)?.type;
                            const replyReactionGroups = groupReactions(reply.reactions ?? []);
                            return (
                                <ReplyItem
                                    key={reply._id}
                                    reply={reply}
                                    myReplyReaction={myReplyReaction}
                                    replyReactionGroups={replyReactionGroups}
                                    canDelete={canDeleteReply}
                                    onDelete={() => deleteReply({ id: jobId, commentId: comment._id, replyId: reply._id })}
                                    onReact={(type) => reactToReply({ id: jobId, commentId: comment._id, replyId: reply._id, reactionType: type })}
                                />
                            );
                        })}

                        {/* Load more / Hide */}
                        <div className="ml-4 flex gap-3 mt-1">
                            {visibleCount < totalReplies && (
                                <button onClick={() => setVisibleCount((v) => v + REPLIES_PER_PAGE)} className="text-xs text-primary2-700 font-medium hover:underline">
                                    Load {Math.min(REPLIES_PER_PAGE, totalReplies - visibleCount)} more
                                </button>
                            )}
                            {visibleCount >= totalReplies && (
                                <button onClick={() => { setShowReplies(false); setVisibleCount(REPLIES_PER_PAGE); }} className="text-xs text-muted-foreground hover:text-primary2-700 transition-colors">
                                    Hide all replies
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Reply input */}
                {showReply && (
                    <div className="mt-2 flex gap-2 ml-4">
                        <input
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleReply()}
                            placeholder="Write a reply..."
                            className="flex-1 text-sm px-3 py-2 rounded-xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300"
                        />
                        <button
                            onClick={handleReply}
                            disabled={replying || !replyBody.trim()}
                            className="px-3 py-2 bg-primary2-700 text-white rounded-xl text-sm hover:bg-primary2-800 disabled:opacity-50 transition-colors"
                        >
                            <RiSendPlaneLine />
                        </button>
                    </div>
                )}

                <CommentReactionsModal
                    open={showCommentReactionsModal}
                    onClose={() => setShowCommentReactionsModal(false)}
                    reactions={comment.reactions ?? []}
                />
            </div>
        </div>
    );
}

/* â”€â”€ Reply Item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ReplyItem({
    reply,
    myReplyReaction,
    replyReactionGroups,
    canDelete,
    onDelete,
    onReact,
}: {
    reply: IComment["replies"][0];
    myReplyReaction?: TCommentReactionType;
    replyReactionGroups: [TCommentReactionType, number][];
    canDelete: boolean;
    onDelete: () => void;
    onReact: (type: TCommentReactionType) => void;
}) {
    const [showReactionsModal, setShowReactionsModal] = useState(false);
    return (
        <div className="flex gap-2 ml-4">
            <Avatar user={reply.author} size={24} />
            <div className="flex-1 min-w-0">
                <div className="bg-surface-50 rounded-xl px-3 py-2">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-primary2-900">{reply.author.name}</span>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="text-xs text-neutral-700">{reply.body}</p>
                </div>
                {replyReactionGroups.length > 0 && (
                    <button onClick={() => setShowReactionsModal(true)} className="flex items-center gap-1.5 mt-0.5 px-1 hover:opacity-70 transition-opacity">
                        {replyReactionGroups.map(([type, count]) => {
                            const rx = REACTIONS.find((x) => x.type === type);
                            return rx ? <span key={type} className="text-xs text-muted-foreground">{rx.emoji} {count}</span> : null;
                        })}
                    </button>
                )}
                <div className="flex items-center gap-2 mt-0.5 px-1">
                    <ReplyReactionButton
                        myReaction={myReplyReaction}
                        onReact={onReact}
                    />
                    {canDelete && (
                        <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-0.5">
                            <RiDeleteBinLine />
                        </button>
                    )}
                </div>
                <CommentReactionsModal
                    open={showReactionsModal}
                    onClose={() => setShowReactionsModal(false)}
                    reactions={reply.reactions ?? []}
                />
            </div>
        </div>
    );
}

/* â”€â”€ Reply Reaction Button (inline hover picker) â”€â”€â”€â”€â”€â”€â”€â”€ */
function ReplyReactionButton({ myReaction, onReact }: { myReaction?: TCommentReactionType; onReact: (type: TCommentReactionType) => void }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <button
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className={`text-xs transition-colors ${myReaction ? "text-primary2-700 font-semibold" : "text-muted-foreground hover:text-primary2-700"}`}
            >
                {myReaction ? (REACTIONS.find((r) => r.type === myReaction)?.emoji ?? "ðŸ‘") : "ðŸ‘"}
            </button>
            <AnimatePresence>
                {show && (
                    <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                        <ReactionPicker onReact={(t) => { onReact(t); setShow(false); }} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* â”€â”€ Application Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ApplicationCard({ app, onSelect, isOwner }: {
    app: { _id: string; applicant: { name: string; imageUrl?: string; email: string; batch?: string }; message?: string; status: string; createdAt: string };
    jobId: string;
    onSelect: (appId: string) => void;
    isOwner: boolean;
}) {
    const statusColor = {
        pending: "text-amber-700 bg-amber-50 border border-amber-200",
        selected: "text-primary2-700 bg-primary2-50 border border-primary2-200",
        rejected: "text-red-700 bg-red-50 border border-red-200",
    }[app.status] ?? "text-neutral-600 bg-surface-100";

    return (
        <div className="flex items-start gap-4 bg-surface-50 rounded-xl p-4">
            <Avatar user={app.applicant} size={40} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                        <p className="font-semibold text-primary2-900 text-sm">{app.applicant.name}</p>
                        <p className="text-xs text-muted-foreground">{app.applicant.email}{app.applicant.batch ? ` Â· Batch ${app.applicant.batch}` : ""}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor}`}>{app.status}</span>
                </div>
                {app.message && <p className="text-sm text-neutral-600 mt-2">{app.message}</p>}
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                    {isOwner && app.status === "pending" && (
                        <button onClick={() => onSelect(app._id)} className="text-xs bg-primary2-500 text-white px-3 py-1 rounded-full hover:bg-primary2-600 transition-colors">
                            Select
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN COMPONENT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

export default function JobDetailPage({ id }: { id: string }) {
    const { data, isLoading, isError } = useGetJobByIdQuery(id);
    const [reactToJob] = useReactToJobMutation();
    const [addComment, { isLoading: commenting }] = useAddCommentMutation();
    const [applyToJob, { isLoading: applying }] = useApplyToJobMutation();
    const [selectApplicant] = useSelectApplicantMutation();

    const [commentBody, setCommentBody] = useState("");
    const [applyMessage, setApplyMessage] = useState("");
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [showJobReactionsModal, setShowJobReactionsModal] = useState(false);

    const authUser = useAppSelector((s) => s.auth.user);
    const userId = authUser?._id ?? "";
    const role = authUser?.role ?? "USER";

    // Check if current user is a TUTOR-type approved provider
    const { data: myProviderData } = useGetMyProviderProfileQuery(undefined, { skip: !userId || role === "ADMIN" });
    const myProvider = myProviderData?.data;
    const isTutorProvider = myProvider?.providerType === "TUTOR" && myProvider?.status === "APPROVED";
    // console.log({userId, role})
    // console.log({myProviderData})
    // console.log(myProviderData?.data)
    // console.log({myProvider})
    // console.log({isTutorProvider})

    const job = data?.data as IJobPost | undefined;

    const isOwner = !!job && job.postedBy._id === userId;
    // Admin can see applicants/notes only if they are the owner OR NOT admin â€” admin is excluded from seeing applicants panel
    const canSeeApplicants = isOwner;
    const isSeekPost = job?.type === "TUITION" || job?.type === "PERSONAL";

    // For comments/apply: must be logged in, must be TUTOR-type provider (or owner, or admin sees it all read-only)
    const canInteract = !!userId && (isTutorProvider || isOwner);

    const { data: appsData } = useGetJobApplicationsQuery(id, { skip: !canSeeApplicants || !isSeekPost });
    const { data: myAppsData } = useGetMyApplicationsQuery({}, { skip: !userId || !isSeekPost || isOwner });
    const hasApplied = myAppsData?.data?.some(
        (app) => (app.job as unknown as { _id: string })?._id === id || (app.job as unknown as string) === id
    ) ?? false;
    const apps = appsData?.data ?? [];

    const hasLiked = job?.likes.includes(userId) ?? false;
    const hasDisliked = job?.dislikes.includes(userId) ?? false;

    const jobReactionsTabs = [
        { type: "LIKE" as const, emoji: "â¤ï¸", label: "Like", users: job?.likeUsers ?? [] },
        { type: "DISLIKE" as const, emoji: "ðŸ‘Ž", label: "Dislike", users: job?.dislikeUsers ?? [] },
    ].filter(t => t.users.length > 0);

    const handleComment = async () => {
        if (!commentBody.trim()) return;
        await addComment({ id, body: commentBody });
        setCommentBody("");
    };

    const handleApply = async () => {
        await applyToJob({ id, message: applyMessage });
        setShowApplyForm(false);
    };

    const handleSelect = async (appId: string) => {
        await selectApplicant({ jobId: id, appId });
    };

    if (isLoading) {
        return (
            <div className="three-xl-section-setup py-12 animate-pulse">
                <div className="h-8 w-48 bg-surface-200 rounded mb-6" />
                <div className="h-10 w-3/4 bg-surface-200 rounded mb-4" />
                <div className="h-4 w-full bg-surface-200 rounded mb-2" />
                <div className="h-4 w-2/3 bg-surface-200 rounded" />
            </div>
        );
    }

    if (isError || !job) {
        return (
            <div className="three-xl-section-setup py-20 text-center">
                <RiAlertLine className="text-5xl text-red-400 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Job not found or unavailable.</p>
                <Link href="/jobs" className="mt-4 inline-flex items-center gap-1 text-primary2-700 hover:underline text-sm">
                    <RiArrowLeftLine /> Back to Jobs
                </Link>
            </div>
        );
    }

    const cfg = TYPE_CONFIG[job.type];
    const statusCfg = STATUS_CONFIG[job.status];

    return (
        <div>
            {/* â”€â”€ Back + Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="bg-white border-b border-surface-200 sticky top-0 z-30">
                <div className="three-xl-section-setup py-3 flex items-center gap-4">
                    <Link href="/jobs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary2-700 transition-colors">
                        <RiArrowLeftLine /> Jobs
                    </Link>
                    <span className="text-surface-300">/</span>
                    <span className="text-sm text-neutral-600 line-clamp-1">{job.title}</span>
                </div>
            </div>

            <div className="three-xl-section-setup py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                {/* â”€â”€ Main Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div>
                    {/* Title block */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg?.color}`}>
                                {cfg?.icon} {cfg?.label}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg?.color}`}>
                                {statusCfg?.icon} {statusCfg?.label}
                            </span>
                            {job.applicationDeadline && (
                                <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                                    <RiCalendarLine /> Deadline: {format(new Date(job.applicationDeadline), "dd MMM yyyy")}
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary2-900 leading-tight mb-3">{job.title}</h1>

                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                            {job.type === "OFFICIAL" && job.company && <span className="flex items-center gap-1"><RiBriefcaseLine /> {job.company}</span>}
                            {(job.location || job.seekLocation) && <span className="flex items-center gap-1"><RiMapPinLine /> {job.location || job.seekLocation}</span>}
                            {job.type === "OFFICIAL" && job.jobType && <span className="flex items-center gap-1"><RiTimeLine /> {job.jobType}</span>}
                            <span className="flex items-center gap-1"><RiCalendarLine /> Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                        </div>

                        <p className="text-neutral-700 leading-relaxed">{job.description}</p>

                        {/* Reactions */}
                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-surface-100">
                            <button
                                onClick={() => userId && reactToJob({ id, reactionType: "LIKE" })}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${hasLiked ? "bg-red-50 text-red-600" : "bg-surface-100 text-neutral-600 hover:bg-red-50 hover:text-red-500"}`}
                            >
                                {hasLiked ? <RiHeartFill /> : <RiHeartLine />} {job.likes.length}
                            </button>
                            <button
                                onClick={() => userId && reactToJob({ id, reactionType: "DISLIKE" })}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${hasDisliked ? "bg-surface-200 text-neutral-700" : "bg-surface-100 text-neutral-600 hover:bg-surface-200"}`}
                            >
                                <RiThumbDownLine /> {job.dislikes.length}
                            </button>
                            {/* Who reacted â€” click to open modal */}
                            {(job.likes.length > 0 || job.dislikes.length > 0) && (
                                <button
                                    onClick={() => setShowJobReactionsModal(true)}
                                    className="text-xs text-primary2-600 hover:underline flex items-center gap-1"
                                >
                                    <RiUserLine /> See who reacted
                                </button>
                            )}
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground ml-auto">
                                <RiChat3Line /> {job.comments.length} comments
                            </span>
                        </div>
                    </motion.div>

                    {/* â”€â”€ Official Job Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    {job.type === "OFFICIAL" && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
                            <h2 className="text-base font-bold text-primary2-900 mb-4">Job Details</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {job.jobType && <><dt className="text-muted-foreground">Job Type</dt><dd className="font-medium text-primary2-900 capitalize">{job.jobType}</dd></>}
                                {job.experienceLevel && <><dt className="text-muted-foreground">Experience</dt><dd className="font-medium text-primary2-900 capitalize">{job.experienceLevel}</dd></>}
                                {(job.salaryMin || job.salaryMax) && (
                                    <><dt className="text-muted-foreground">Salary</dt>
                                        <dd className="font-medium text-primary2-900">
                                            {job.salaryNegotiable ? "Negotiable" : `${job.salaryMin ?? "?"} â€“ ${job.salaryMax ?? "?"} ${job.salaryCurrency ?? "BDT"}`}
                                        </dd></>
                                )}
                                {job.isRemote && <><dt className="text-muted-foreground">Remote</dt><dd className="font-medium text-primary2-600">Yes</dd></>}
                            </dl>
                            {job.requirements && job.requirements.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Requirements</p>
                                    <ul className="space-y-1">
                                        {job.requirements.map((r) => (
                                            <li key={r} className="flex items-start gap-2 text-sm text-neutral-700">
                                                <RiCheckboxCircleLine className="text-primary2-600 mt-0.5 flex-shrink-0" /> {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {job.applicationInstruction && (
                                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                                    <p className="font-semibold mb-1 flex items-center gap-1"><RiFileLine /> How to Apply</p>
                                    <p>{job.applicationInstruction}</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* â”€â”€ Tuition Seek Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    {job.type === "TUITION" && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
                            <h2 className="text-base font-bold text-primary2-900 mb-4">Tuition Details</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {job.studentClass && <><dt className="text-muted-foreground">Student Class</dt><dd className="font-medium text-primary2-900">{job.studentClass}</dd></>}
                                {job.employerGender && <><dt className="text-muted-foreground">Student Gender</dt><dd className="font-medium text-primary2-900 capitalize">{job.employerGender}</dd></>}
                                {job.employeeGender && <><dt className="text-muted-foreground">Required Tutor</dt><dd className="font-medium text-primary2-900 capitalize">{job.employeeGender}</dd></>}
                                {job.timing && <><dt className="text-muted-foreground">Timing</dt><dd className="font-medium text-primary2-900">{job.timing}</dd></>}
                                {job.sessionDuration && <><dt className="text-muted-foreground">Duration</dt><dd className="font-medium text-primary2-900">{job.sessionDuration}</dd></>}
                                {job.weeklyDays?.length && <><dt className="text-muted-foreground">Days/Week</dt><dd className="font-medium text-primary2-900">{job.weeklyDays.join(", ")}</dd></>}
                                {job.paymentAmount && <><dt className="text-muted-foreground">Payment</dt><dd className="font-medium text-primary2-900">{job.paymentNegotiable ? "Negotiable" : `${job.paymentAmount} BDT/${job.paymentPer ?? "month"}`}</dd></>}
                                {job.startDate && <><dt className="text-muted-foreground">Start Date</dt><dd className="font-medium text-primary2-900">{format(new Date(job.startDate), "dd MMM yyyy")}</dd></>}
                            </dl>
                            {job.subjects?.length && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Subjects</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.subjects.map((s) => (
                                            <span key={s} className="bg-primary2-50 text-primary2-700 border border-primary2-100 text-xs px-3 py-1 rounded-full">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* â”€â”€ Personal Seek Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    {job.type === "PERSONAL" && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
                            <h2 className="text-base font-bold text-primary2-900 mb-4">Service Details</h2>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {job.serviceCategory && <><dt className="text-muted-foreground">Category</dt><dd className="font-medium text-primary2-900 capitalize">{job.serviceCategory}</dd></>}
                                {job.seekLocation && <><dt className="text-muted-foreground">Location</dt><dd className="font-medium text-primary2-900">{job.seekLocation}</dd></>}
                                {job.paymentAmount && <><dt className="text-muted-foreground">Payment</dt><dd className="font-medium text-primary2-900">{job.paymentNegotiable ? "Negotiable" : `${job.paymentAmount} BDT/${job.paymentPer ?? "session"}`}</dd></>}
                                {job.startDate && <><dt className="text-muted-foreground">Start Date</dt><dd className="font-medium text-primary2-900">{format(new Date(job.startDate), "dd MMM yyyy")}</dd></>}
                            </dl>
                        </motion.div>
                    )}

                    {/* â”€â”€ Apply Section (seek posts) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    {isSeekPost && job.status === "APPROVED" && !isOwner && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-primary2-50 rounded-2xl border border-primary2-200 p-6 mb-6">
                            <h2 className="text-base font-bold text-primary2-900 mb-2">Interested?</h2>
                            {!userId ? (
                                <p className="text-sm text-muted-foreground">
                                    <Link href="/login" className="text-primary2-700 font-semibold hover:underline">Log in</Link> to apply to this post.
                                </p>
                            ) : !isTutorProvider ? (
                                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <RiAlertLine className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800">Provider Registration Required</p>
                                        <p className="text-xs text-amber-700 mt-0.5">You must be a registered &amp; approved TUTOR provider to apply. <Link href="/jobs/register-provider" className="underline font-semibold">Register now</Link></p>
                                    </div>
                                </div>
                            ) : hasApplied ? (
                                <div className="flex items-center gap-2 text-primary2-600 font-medium">
                                    <RiCheckboxCircleLine className="text-lg" /> Application submitted!
                                </div>
                            ) : showApplyForm ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={applyMessage}
                                        onChange={(e) => setApplyMessage(e.target.value)}
                                        placeholder="Introduce yourself (optional)..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300 resize-none"
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={handleApply} disabled={applying} className="px-6 py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 disabled:opacity-50 transition-colors text-sm">
                                            {applying ? "Submittingâ€¦" : "Submit Application"}
                                        </button>
                                        <button onClick={() => setShowApplyForm(false)} className="px-6 py-2.5 bg-white border border-surface-200 rounded-xl text-sm hover:border-surface-300 transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setShowApplyForm(true)} className="px-6 py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 transition-colors text-sm">
                                    Apply Now
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* â”€â”€ Applicants (owner / admin) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    {canSeeApplicants && isSeekPost && apps.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
                            <h2 className="text-base font-bold text-primary2-900 mb-4">Applicants ({apps.length})</h2>
                            <div className="space-y-3">
                                {apps.map((app) => (
                                    <ApplicationCard
                                        key={app._id}
                                        app={app as unknown as Parameters<typeof ApplicationCard>[0]["app"]}
                                        jobId={id}
                                        onSelect={handleSelect}
                                        isOwner={isOwner}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* â”€â”€ Comments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="bg-white rounded-2xl border border-surface-200 p-6">
                        <h2 className="text-base font-bold text-primary2-900 mb-6 flex items-center gap-2">
                            <RiChat3Line className="text-primary2-600" /> Comments ({job.comments.length})
                        </h2>

                        {/* Add comment */}
                        {canInteract && (
                            <div className="flex gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-primary2-100 flex items-center justify-center text-xs font-bold text-primary2-700 flex-shrink-0">
                                    {authUser?.name?.[0] ?? "U"}
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <input
                                        value={commentBody}
                                        onChange={(e) => setCommentBody(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleComment()}
                                        placeholder="Write a comment..."
                                        className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300"
                                    />
                                    <button
                                        onClick={handleComment}
                                        disabled={commenting || !commentBody.trim()}
                                        className="px-4 py-2.5 bg-primary2-700 text-white rounded-xl hover:bg-primary2-800 disabled:opacity-50 transition-colors"
                                    >
                                        <RiSendPlaneLine />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Not eligible message */}
                        {userId && !canInteract && !isOwner && (
                            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                                <RiAlertLine className="text-amber-600 text-base flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700">Only approved <strong>TUTOR</strong> providers can comment. <Link href="/jobs/register-provider" className="underline font-semibold">Register as a provider</Link></p>
                            </div>
                        )}

                        <div className="space-y-5">
                            <AnimatePresence>
                                {job.comments.length === 0 && (
                                    <p className="text-sm text-center text-muted-foreground py-6">No comments yet. Be the first!</p>
                                )}
                                {job.comments.map((comment) => (
                                    <motion.div key={comment._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                        <CommentItem comment={comment} jobId={id} userId={userId} role={role} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* â”€â”€ Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
                <div className="space-y-5">
                    {/* Posted by */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-surface-200 p-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Posted by</p>
                        <div className="flex items-center gap-3">
                            <Avatar user={job.postedBy} size={44} />
                            <div>
                                <p className="font-semibold text-primary2-900 text-sm">{job.postedBy.name}</p>
                                <p className="text-xs text-muted-foreground">{job.postedBy.email}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick info */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.14 }} className="bg-white rounded-2xl border border-surface-200 p-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Info</p>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Status</dt>
                                <dd className={`font-semibold ${statusCfg?.color} px-2 py-0.5 rounded-full text-xs`}>{statusCfg?.label}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Type</dt>
                                <dd className="font-medium text-primary2-900">{cfg?.label}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Posted</dt>
                                <dd className="font-medium text-primary2-900">{format(new Date(job.createdAt), "dd MMM yyyy")}</dd>
                            </div>
                            {job.approvedAt && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Approved</dt>
                                    <dd className="font-medium text-primary2-900">{format(new Date(job.approvedAt), "dd MMM yyyy")}</dd>
                                </div>
                            )}
                        </dl>
                    </motion.div>

                    {/* Admin notes â€” only for owner, not pure admin visitors */}
                    {isOwner && role !== "ADMIN" && job.adminNotes?.length > 0 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }} className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1"><RiStickyNoteLine /> Admin Notes</p>
                            <div className="space-y-2">
                                {job.adminNotes.map((n, i) => (
                                    <div key={i} className="bg-white rounded-lg p-3 border border-blue-100">
                                        <p className="text-sm text-blue-800">{n.note}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-blue-600 font-medium">{n.addedBy?.name}</span>
                                            <span className="text-xs text-blue-400">Â· {format(new Date(n.addedAt), "dd MMM yyyy, HH:mm")}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Rejection reason */}
                    {job.status === "REJECTED" && job.rejectedReason && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-red-50 rounded-2xl border border-red-200 p-5">
                            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-1"><RiAlertLine /> Rejection Reason</p>
                            <p className="text-sm text-red-700">{job.rejectedReason}</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Job reactions modal */}
            {jobReactionsTabs.length > 0 && (
                <ReactorsModal
                    open={showJobReactionsModal}
                    onClose={() => setShowJobReactionsModal(false)}
                    tabs={jobReactionsTabs}
                />
            )}
        </div >
    );
}
