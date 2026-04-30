"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
    RiArrowLeftLine,
    RiBuilding2Line,
    RiCheckDoubleLine,
    RiDeleteBin6Line,
    RiGraduationCapLine,
    RiMailLine,
    RiMessage2Line,
    RiMoreLine,
    RiPhoneLine,
    RiSendPlaneLine,
} from "react-icons/ri";
import {
    useGetMyProviderContactsQuery,
    useGetMySentContactsQuery,
    useGetMyProviderProfileQuery,
    useDeleteContactMutation,
    useDeleteContactReplyMutation,
    useDeleteInitialMessageMutation,
    useReplyToContactMutation,
} from "@/redux/apis/jobApi";
import type { IProviderContact as ProviderContact, IContactReply as ContactReply } from "@/components/modules/user/job/job.types";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";
import { getContactsSocket } from "@/lib/socket";

/* ── Avatar ──────────────────────────────────────────────── */
function Av({ name, imageUrl, size = 40 }: { name: string; imageUrl?: string; size?: number }) {
    if (imageUrl) {
        return (
            <Image src={imageUrl} alt={name} width={size} height={size}
                className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />
        );
    }
    return (
        <div className="rounded-full bg-primary2-100 flex items-center justify-center font-bold text-primary2-700 flex-shrink-0 select-none"
            style={{ width: size, height: size, fontSize: size * 0.38 }}>
            {name?.[0]?.toUpperCase() ?? "?"}
        </div>
    );
}

/* ── Helpers ─────────────────────────────────────────────── */
function getOtherPerson(contact: ProviderContact, myUserId: string) {
    const providerUserId = (contact.provider as { user?: { _id?: string } })?.user?._id ?? contact.provider?._id ?? "";
    const isIAmProvider = providerUserId === myUserId;
    return isIAmProvider ? contact.seeker : (contact.provider as { user?: { name: string; imageUrl?: string; email: string } })?.user ?? contact.seeker;
}

function getLastMessage(contact: ProviderContact): string {
    const lastReply = contact?.replies?.length > 0 ? contact.replies[contact.replies.length - 1] : null;
    if (lastReply) return lastReply.body;
    return contact?.message ?? "No message";
}

function getLastTime(contact: ProviderContact): Date {
    const lastReply = contact?.replies?.length > 0 ? contact.replies[contact.replies.length - 1] : null;
    return new Date(lastReply ? lastReply.createdAt : contact?.createdAt ?? Date.now());
}

/* ── Contact List Item ───────────────────────────────────── */
function ConversationItem({
    contact,
    isActive,
    myUserId,
    onSelect,
}: {
    contact: ProviderContact;
    isActive: boolean;
    myUserId: string;
    onSelect: () => void;
}) {
    const other = getOtherPerson(contact, myUserId);
    const lastMsg = getLastMessage(contact);
    const lastTime = getLastTime(contact);

    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-50 border-b border-surface-100 last:border-0",
                isActive && "bg-primary2-50 hover:bg-primary2-50",
            )}
        >
            <Av name={other.name} imageUrl={other.imageUrl} size={44} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className={cn("text-sm font-semibold truncate", isActive ? "text-primary2-700" : "text-neutral-800")}>
                        {other.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 whitespace-nowrap">
                        {formatDistanceToNow(lastTime, { addSuffix: true })}
                    </span>
                </div>
                <p className="text-xs truncate text-muted-foreground">{lastMsg}</p>
            </div>
        </button>
    );
}

/* ── Chat Bubble ─────────────────────────────────────────── */
function Bubble({ body, time, isMine, authorName, authorImage, onDelete, isDeletable,
    // seenByOther, seenBy

 }: {
    body: string; time: string; isMine: boolean; authorName: string; authorImage?: string;
    onDelete?: () => void; isDeletable?: boolean; seenByOther?: string; seenBy?: string[];
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className={cn("group flex items-end gap-2 max-w-[80%]", isMine ? "ml-auto flex-row-reverse" : "mr-auto")}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {!isMine && <Av name={authorName} imageUrl={authorImage} size={26} />}
            <div className="relative">
                <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                    isMine
                        ? "bg-primary2-600 text-white rounded-br-sm"
                        : "bg-white border border-surface-200 text-neutral-800 rounded-bl-sm",
                )}>
                    {body}
                </div>
                <p className={cn("text-[10px] text-muted-foreground mt-1", isMine ? "text-right" : "text-left")}>
                    {formatDistanceToNow(new Date(time), { addSuffix: true })}
                </p>
                {isDeletable && onDelete && hovered && (
                    <button
                        onClick={onDelete}
                        title="Delete message"
                        className={cn(
                            "absolute top-1 p-1 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm",
                            isMine ? "-left-7" : "-right-7",
                        )}
                    >
                        <RiDeleteBin6Line className="text-xs" />
                    </button>
                )}
            </div>
        </div>
    );
}

/* ── Seen indicator ──────────────────────────────────────── */
// function SeenDots({ seenBy, myUserId, otherUserId }: { seenBy?: string[]; myUserId: string; otherUserId: string }) {
//     const otherSeen = seenBy?.includes(otherUserId);
//     return otherSeen ? (
//         <RiCheckDoubleLine className="inline text-primary2-400 text-xs ml-1" title="Seen" />
//     ) : null;
// }

/* ── Conversation Detail (socket-based) ──────────────────── */
function ConversationDetail({
    contact: initialContact,
    myUserId,
    onBack,
    onDeleted,
}: {
    contact: ProviderContact;
    myUserId: string;
    onBack: () => void;
    onDeleted: () => void;
}) {
    const [contact, setContact] = useState<ProviderContact>(initialContact);
    const [deleteContact, { isLoading: deletingContact }] = useDeleteContactMutation();
    const [deleteInitialMessage] = useDeleteInitialMessageMutation();
    const [replyToContact] = useReplyToContactMutation();
    const [deleteContactReply] = useDeleteContactReplyMutation();
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [seenInfo, setSeenInfo] = useState<{ seenBy: string; seenAt: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const msgContainerRef = useRef<HTMLDivElement>(null);
    // accessToken dep ensures socket effect re-runs after SocketProvider initializes sockets
    const accessToken = useAppSelector((s) => s.auth.accessToken);

    // Keep contact in sync when parent prop updates (e.g. from RTK cache refresh)
    useEffect(() => { setContact(initialContact); }, [initialContact._id]); // eslint-disable-line

    const other = getOtherPerson(contact, myUserId);
    const otherUserId = (other as { _id?: string })?._id ?? "";

    /* ── Socket setup (receive-only) ──────────────────── */
    useEffect(() => {
        let sock: ReturnType<typeof getContactsSocket>;
        try { sock = getContactsSocket(); } catch { return; } // not initialized yet

        // Use named function so we can properly remove it on cleanup
        const joinRoom = () => sock.emit("join:conversation", contact._id);

        // Join now if connected, otherwise join on every (re)connect
        if (sock.connected) joinRoom();
        // Register on "connect" (not "once") so reconnects also re-join the room
        sock.on("connect", joinRoom);
        if (!sock.connected) sock.connect();

        const onNewMsg = (data: { contactId: string; reply: ContactReply }) => {
            if (data.contactId !== contact._id) return;
            setContact((prev) => ({
                ...prev,
                replies: prev.replies.some((r) => r._id === data.reply._id)
                    ? prev.replies
                    : [...prev.replies, data.reply],
            }));
        };

        const onReplyDeleted = (data: { contactId: string; replyId: string }) => {
            if (data.contactId !== contact._id) return;
            setContact((prev) => ({
                ...prev,
                replies: prev.replies.filter((r) => r._id !== data.replyId),
            }));
        };

        const onInitialDeleted = (data: { contactId: string }) => {
            if (data.contactId !== contact._id) return;
            setContact((prev) => ({ ...prev, message: undefined }));
        };

        const onConvDeleted = (data: { contactId: string }) => {
            if (data.contactId !== contact._id) return;
            onDeleted();
        };

        const onSeen = (data: { contactId: string; seenBy: string; seenAt: string }) => {
            if (data.contactId !== contact._id || data.seenBy === myUserId) return;
            setSeenInfo(data);
        };

        sock.on("message:new", onNewMsg);
        sock.on("message:deleted", onReplyDeleted);
        sock.on("message:initialDeleted", onInitialDeleted);
        sock.on("conversation:deleted", onConvDeleted);
        sock.on("conversation:seen", onSeen);

        return () => {
            sock.emit("leave:conversation", contact._id);
            sock.off("connect", joinRoom);
            sock.off("message:new", onNewMsg);
            sock.off("message:deleted", onReplyDeleted);
            sock.off("message:initialDeleted", onInitialDeleted);
            sock.off("conversation:deleted", onConvDeleted);
            sock.off("conversation:seen", onSeen);
        };
    }, [contact._id, myUserId, accessToken]); // eslint-disable-line

    /* ── Auto-scroll ───────────────────────────────────── */
    useEffect(() => {
        const c = msgContainerRef.current;
        if (c) c.scrollTop = c.scrollHeight;
    }, [contact.replies.length]);

    const details = [
        "email" in other && (other as { email: string }).email && { icon: RiMailLine, text: (other as { email: string }).email },
        "phone" in other && (other as { phone?: string }).phone && { icon: RiPhoneLine, text: (other as { phone: string }).phone },
        (("batch" in other && (other as { batch?: number }).batch) || ("section" in other && (other as { section?: string }).section)) && {
            icon: RiGraduationCapLine,
            text: [
                ("batch" in other && (other as { batch?: number }).batch) && `Batch ${(other as { batch: number }).batch}`,
                ("section" in other && (other as { section?: string }).section) && `Section ${(other as { section: string }).section}`,
            ].filter(Boolean).join(" · "),
        },
        (("workplace" in other && (other as { workplace?: string }).workplace) || ("position" in other && (other as { position?: string }).position)) && {
            icon: RiBuilding2Line,
            text: [
                ("position" in other && (other as { position?: string }).position),
                ("workplace" in other && (other as { workplace?: string }).workplace),
            ].filter(Boolean).join(" at "),
        },
    ].filter(Boolean) as { icon: React.ElementType; text: string }[];

    // Build chronological message timeline
    type Msg = { id: string; body: string; time: string; authorId: string; authorName: string; authorImage?: string; isReply: boolean; replyObj?: ContactReply };
    const messages: Msg[] = [
        ...(contact.message ? [{
            id: `init-${contact._id}`,
            body: contact.message,
            time: contact.createdAt,
            authorId: (contact.seeker as { _id?: string })?._id ?? "",
            authorName: contact.seeker.name,
            authorImage: contact.seeker.imageUrl,
            isReply: false,
        }] : []),
        ...(contact?.replies ?? []).map((r) => ({
            id: r._id,
            body: r.body,
            time: r.createdAt,
            authorId: (r.author as { _id?: string })?._id ?? "",
            authorName: r.author.name,
            authorImage: r.author.imageUrl,
            isReply: true,
            replyObj: r,
        })),
    ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const handleSend = async () => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;
        setSending(true);
        try {
            const res = await replyToContact({ id: contact._id, body: trimmed }).unwrap();
            setText("");
            // Optimistic update from REST response
            if (res?.data) {
                const newReply = res.data.replies[res.data.replies.length - 1];
                if (newReply) {
                    setContact((prev) => ({
                        ...prev,
                        replies: prev.replies.some((r) => r._id === newReply._id)
                            ? prev.replies
                            : [...prev.replies, newReply],
                    }));
                }
            }
        } catch (err) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to send message.");
        } finally {
            setSending(false);
        }
    };

    const handleDeleteReply = async (replyId: string) => {
        setContact((prev) => ({ ...prev, replies: prev.replies.filter((r) => r._id !== replyId) }));
        try {
            await deleteContactReply({ contactId: contact._id, replyId }).unwrap();
        } catch {
            toast.error("Failed to delete message.");
        }
    };

    const handleDeleteInitialMessage = async () => {
        try {
            await deleteInitialMessage(contact._id).unwrap();
            setContact((prev) => ({ ...prev, message: undefined }));
        } catch { toast.error("Failed to delete message."); }
    };

    const handleDeleteContact = async () => {
        try {
            await deleteContact(contact._id).unwrap();
            toast.success("Conversation deleted.");
            onDeleted();
        } catch { toast.error("Failed to delete conversation."); }
        finally { setConfirmDelete(false); }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 bg-white flex-shrink-0 sticky top-0 z-10">
                <button onClick={onBack} className="md:hidden text-primary2-700 hover:text-primary2-900 p-1 -ml-1 rounded transition-colors" aria-label="Back">
                    <RiArrowLeftLine className="text-xl" />
                </button>
                <Av name={other.name} imageUrl={other.imageUrl} size={36} />
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-primary2-900 leading-tight truncate">{other.name}</p>
                    {"email" in other && (other as { email: string }).email && (
                        <p className="text-xs text-muted-foreground truncate">{(other as { email: string }).email}</p>
                    )}
                </div>
                {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)} title="Delete conversation"
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                        <RiMoreLine className="text-lg" />
                    </button>
                ) : (
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-red-600 font-medium">Delete chat?</span>
                        <button onClick={handleDeleteContact} disabled={deletingContact}
                            className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors">Yes</button>
                        <button onClick={() => setConfirmDelete(false)}
                            className="px-2 py-1 rounded text-xs bg-surface-100 text-neutral-700 hover:bg-surface-200 transition-colors">No</button>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div ref={msgContainerRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-surface-50/60" data-lenis-prevent style={{ minHeight: 0 }}>
                {messages.map((msg) => (
                    <Bubble
                        key={msg.id}
                        body={msg.body}
                        time={msg.time}
                        isMine={msg.authorId === myUserId}
                        authorName={msg.authorName}
                        authorImage={msg.authorImage}
                        isDeletable={msg.authorId === myUserId}
                        seenByOther={msg.isReply && msg.authorId === myUserId ? otherUserId : undefined}
                        seenBy={msg.replyObj?.seenBy}
                        onDelete={msg.isReply ? () => handleDeleteReply(msg.id) : () => handleDeleteInitialMessage()}
                    />
                ))}
                {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>
                )}
                {seenInfo && (
                    <p className="text-[10px] text-right text-primary2-400 flex items-center justify-end gap-1">
                        <RiCheckDoubleLine /> Seen {formatDistanceToNow(new Date(seenInfo.seenAt), { addSuffix: true })}
                    </p>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Contact details strip */}
            {details.length > 0 && (
                <div className="border-t border-surface-200 px-4 py-3 bg-white flex-shrink-0">
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                        {details.map(({ icon: Icon, text }, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-600 min-w-0">
                                <Icon className="text-primary2-500 flex-shrink-0" />
                                <span className="truncate">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="border-t border-surface-200 px-3 py-3 bg-white flex-shrink-0 flex items-center gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Type a message…"
                    className="flex-1 text-sm px-4 py-2.5 rounded-full border border-surface-200 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300 transition-colors"
                />
                <button onClick={handleSend} disabled={sending || !text.trim()}
                    className="p-2.5 bg-primary2-600 text-white rounded-full hover:bg-primary2-700 disabled:opacity-50 transition-colors flex-shrink-0">
                    <RiSendPlaneLine className="text-lg" />
                </button>
            </div>
        </div>
    );
}

/* ── Main Component ──────────────────────────────────────── */
export default function MyProviderContactsPanel() {
    const authUser = useAppSelector((s) => s.auth.user);
    const myUserId = authUser?._id ?? "";

    // Received contacts (as a provider)
    const { data: myProviderData } = useGetMyProviderProfileQuery(undefined, { skip: !myUserId });
    const hasProviderProfile = !!myProviderData?.data;

    const { data: receivedData, isLoading: loadingReceived } = useGetMyProviderContactsQuery(undefined, {
        skip: !hasProviderProfile,
    });
    const { data: sentData, isLoading: loadingSent } = useGetMySentContactsQuery();

    const receivedContacts: ProviderContact[] = receivedData?.data ?? [];
    const sentContacts: ProviderContact[] = sentData?.data ?? [];

    // Merge and deduplicate (same contact may appear in both if user is both provider+seeker)
    const allIds = new Set<string>();
    const allContacts: ProviderContact[] = [];
    [...receivedContacts, ...sentContacts].forEach((c) => {
        if (!allIds.has(c._id)) { allIds.add(c._id); allContacts.push(c); }
    });

    // Sort by latest activity
    allContacts.sort((a, b) => getLastTime(b).getTime() - getLastTime(a).getTime());

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<"list" | "detail">("list");

    const isLoading = loadingReceived || loadingSent;

    useEffect(() => {
        if (allContacts.length > 0 && !selectedId) {
            setSelectedId(allContacts[0]._id);
        }
    }, [allContacts.length, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

    const selected = allContacts.find((c) => c._id === selectedId) ?? null;

    const handleSelect = (contact: ProviderContact) => {
        setSelectedId(contact._id);
        setMobileView("detail");
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden animate-pulse p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="w-11 h-11 rounded-full bg-surface-200 flex-shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="h-3 w-32 bg-surface-200 rounded" />
                            <div className="h-3 w-48 bg-surface-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (allContacts.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
                <RiMessage2Line className="text-4xl text-surface-300 mx-auto mb-3" />
                <p className="font-medium text-primary2-900">No conversations yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                    Contact requests you send or receive will appear here as conversations.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden flex" style={{ height: 600 }}>
            {/* LEFT — conversation list */}
            <div className={cn(
                "w-full md:w-72 lg:w-80 md:flex-shrink-0 border-r border-surface-200 flex flex-col",
                mobileView === "detail" && "hidden md:flex",
            )}>
                <div className="px-4 py-3 border-b border-surface-200 bg-surface-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <RiMessage2Line className="text-primary2-700" />
                        <span className="font-semibold text-sm text-primary2-900">Contacts</span>
                        <span className="ml-auto text-xs text-muted-foreground">{allContacts.length}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto" data-lenis-prevent>
                    {allContacts.map((contact) => (
                        <ConversationItem
                            key={contact._id}
                            contact={contact}
                            isActive={contact._id === selectedId}
                            myUserId={myUserId}
                            onSelect={() => handleSelect(contact)}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT — conversation detail */}
            <div className={cn(
                "flex-1 flex flex-col min-h-0 min-w-0",
                mobileView === "list" && "hidden md:flex",
            )}>
                {selected ? (
                    <ConversationDetail
                        key={selected._id}
                        contact={selected}
                        myUserId={myUserId}
                        onBack={() => setMobileView("list")}
                        onDeleted={() => { setSelectedId(null); setMobileView("list"); }}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface-50/50">
                        <RiMessage2Line className="text-4xl text-surface-300 mb-3" />
                        <p className="text-sm text-muted-foreground">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
