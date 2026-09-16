"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Trash2, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userUpdateMeHook } from "@/features/users/hooks/user-update-me.hook";
import type { ApiUser } from "@/features/users/type";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { PROFILE_LABELS } from "./constants";
import { useImageUpload } from "@/features/users/hooks/use-image-upload";

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: ApiUser | undefined;
}

export function ProfileEditModal({ isOpen, onClose, user }: ProfileEditModalProps) {
    const { locale } = useTranslation();
    const labels = PROFILE_LABELS[locale as keyof typeof PROFILE_LABELS] || PROFILE_LABELS.pt;
    const { mutate: updateProfile, isPending } = userUpdateMeHook();
    const { upload, isUploading, progress: uploadProgress, error: uploadError } = useImageUpload();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        avatarUrl: user?.avatarUrl || "",
        bio: user?.profile?.bio || "",
        country: user?.profile?.country || "",
        socialLinks: user?.profile?.socialLinks || [] as any[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateProfile(formData, {
            onSuccess: () => {
                toast.success(labels.success);
                onClose();
            },
            onError: (error) => {
                toast.error(labels.error + error.message);
            }
        });
    };

    const addSocialLink = () => {
        setFormData({
            ...formData,
            socialLinks: [...formData.socialLinks, { platform: "", url: "" }]
        });
    };

    const removeSocialLink = (index: number) => {
        setFormData({
            ...formData,
            socialLinks: formData.socialLinks.filter((_, i) => i !== index)
        });
    };

    const updateSocialLink = (index: number, field: "platform" | "url", value: string) => {
        const newLinks = [...formData.socialLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData({ ...formData, socialLinks: newLinks });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        const result = await upload(file);
        if (result) {
            setFormData((prev) => ({ ...prev, avatarUrl: result.url }));
        }
        // reset input so same file can be re-selected
        e.target.value = "";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg z-[101] p-1"
                    >
                        <div className="bg-card border-2 border-primary/30 box-glow overflow-hidden rounded-sm relative">
                            {/* Terminal Header */}
                            <div className="bg-primary/10 border-b border-primary/20 p-3 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
                                    <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                                        {labels.updateProtocol}
                                    </span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="font-mono text-[10px] uppercase text-muted-foreground">{labels.username}</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ex: Xavier Silva"
                                            className="bg-background/50 border-primary/20 font-mono text-xs focus-visible:ring-primary/30"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="font-mono text-[10px] uppercase text-muted-foreground">{labels.avatarUrl}</Label>

                                        {/* Avatar upload area */}
                                        <label
                                            htmlFor="avatarUpload"
                                            className={`relative flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed cursor-pointer transition-colors ${isUploading
                                                    ? "border-primary/40 bg-primary/5"
                                                    : "border-primary/20 bg-background/50 hover:border-primary/50 hover:bg-primary/5"
                                                }`}
                                            style={{ minHeight: "120px" }}
                                        >
                                            {formData.avatarUrl ? (
                                                <div className="relative w-full h-28 flex items-center justify-center">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={formData.avatarUrl}
                                                        alt="Avatar preview"
                                                        className="h-24 w-24 rounded-full object-cover border-2 border-primary/30"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <div className="bg-background/70 backdrop-blur-sm rounded-full p-2">
                                                            <Upload className="h-5 w-5 text-primary" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 py-6 text-muted-foreground">
                                                    <ImageIcon className="h-8 w-8 opacity-40" />
                                                    <span className="font-mono text-[10px] uppercase tracking-wider">
                                                        {isUploading ? labels.uploading ?? "a enviar..." : labels.clickToUpload ?? "clica para fazer upload"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Progress bar */}
                                            {isUploading && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10 rounded-b-sm overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-200"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                            )}

                                            <input
                                                id="avatarUpload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                disabled={isUploading}
                                                onChange={handleImageUpload}
                                            />
                                        </label>

                                        {/* Upload status */}
                                        {isUploading && (
                                            <p className="font-mono text-[10px] text-primary animate-pulse">
                                                {labels.uploading ?? "a enviar..."} {uploadProgress}%
                                            </p>
                                        )}
                                        {uploadError && (
                                            <p className="font-mono text-[10px] text-destructive">{uploadError}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="country" className="font-mono text-[10px] uppercase text-muted-foreground">{labels.countryCode}</Label>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                id="country"
                                                value={formData.country}
                                                maxLength={2}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                                                placeholder="AO"
                                                className="bg-background/50 border-primary/20 font-mono text-xs focus-visible:ring-primary/30 w-16 text-center"
                                            />
                                            <span className="text-[10px] font-mono text-muted-foreground italic">Ex: AO, PT, BR, FR</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bio" className="font-mono text-[10px] uppercase text-muted-foreground">{labels.bio}</Label>
                                        <textarea
                                            id="bio"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="min-h-[100px] w-full rounded-sm border border-primary/20 bg-background/50 px-3 py-2 text-xs font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder={labels.bioPlaceholder}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Label className="font-mono text-[10px] uppercase text-muted-foreground">{labels.socialLinks}</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addSocialLink}
                                                className="h-6 px-2 text-[9px] border-primary/20 hover:bg-primary/10 text-primary"
                                            >
                                                <Plus className="h-3 w-3 mr-1" /> {labels.add}
                                            </Button>
                                        </div>

                                        {formData.socialLinks.map((link, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <Input
                                                    value={link.platform}
                                                    onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                                                    placeholder="github"
                                                    className="bg-background/50 border-primary/20 font-mono text-[10px] h-8 w-24"
                                                />
                                                <Input
                                                    value={link.url}
                                                    onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                                                    placeholder="https://..."
                                                    className="bg-background/50 border-primary/20 font-mono text-[10px] h-8 flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeSocialLink(index)}
                                                    className="h-8 w-8 text-neutral-500 hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={onClose}
                                        className="font-mono text-[10px] uppercase tracking-widest hover:bg-primary/5 h-9"
                                    >
                                        {labels.cancel}
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="font-mono text-[10px] uppercase tracking-widest bg-primary text-primary-foreground box-glow-sm hover:bg-primary/90 h-9"
                                    >
                                        {isPending ? labels.processing : (
                                            <>
                                                <Save className="h-3.5 w-3.5 mr-2" /> {labels.saveChanges}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
