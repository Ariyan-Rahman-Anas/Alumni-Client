import { RiCheckLine, RiSearchLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { IUserProfile } from "../../user/profile/user-profile.types";

interface AdminUserViewModalProps {
    user: IUserProfile | null;
    onClose: () => void;
    onApprove: (id: string) => void;
    isApproving?: boolean;
}

const AdminUserViewModal = ({ user, onClose, onApprove, isApproving = false }: AdminUserViewModalProps) => {
    return (
        <Dialog open={!!user} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>User Profile</DialogTitle>
                </DialogHeader>
                {user && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            {user.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.imageUrl} alt={user.name} className="h-16 w-16 rounded-2xl object-cover shrink-0" />
                            ) : (
                                <span className="h-16 w-16 rounded-2xl bg-primary2-100 text-primary2-700 text-xl font-bold flex items-center justify-center shrink-0">
                                    {user.name.slice(0, 2).toUpperCase()}
                                </span>
                            )}
                            <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-sm text-muted-foreground">{user.phone ?? "—"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {([
                                ["Batch", user.batch],
                                ["Blood Group", user.bloodGroup],
                                ["Workplace", user.workplace || "—"],
                                ["Position", user.position || "—"],
                                ["Approval", user.approvalStatus],
                                ["Email Verified", user.isVerified ? "Yes" : "No"],
                            ] as [string, unknown][]).map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className="font-medium text-gray-800">{String(value ?? "—")}</p>
                                </div>
                            ))}
                        </div>

                        {user.currentAddress && (
                            <div className="text-sm">
                                <p className="text-xs text-muted-foreground">Current Address</p>
                                <p className="text-gray-800">{user.currentAddress}</p>
                            </div>
                        )}

                        {user.alumniProofUrl && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1.5">Alumni Proof</p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={user.alumniProofUrl}
                                    alt="Alumni proof"
                                    className="w-full max-h-56 object-contain rounded-xl border border-gray-200"
                                />
                                <a
                                    href={user.alumniProofUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary2-600 hover:underline"
                                >
                                    <RiSearchLine className="text-sm" /> Open full image
                                </a>
                            </div>
                        )}

                        {user.approvalStatus === "PENDING" && (
                            <div className="pt-2 flex justify-end">
                                <Button
                                    onClick={() => { onApprove(user._id); onClose(); }}
                                    disabled={isApproving}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    <RiCheckLine className="mr-1.5" />
                                    {isApproving ? "Approving..." : "Approve User"}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
export default AdminUserViewModal;