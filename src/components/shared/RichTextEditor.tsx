"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect, useCallback } from "react";
import {
    RiBold,
    RiItalic,
    RiUnderline,
    RiStrikethrough,
    RiListUnordered,
    RiListOrdered,
    RiDoubleQuotesL,
    RiCodeLine,
    RiCodeBoxLine,
    RiSeparator,
    RiAlignLeft,
    RiAlignCenter,
    RiAlignRight,
    RiAlignJustify,
    RiArrowGoBackLine,
    RiArrowGoForwardLine,
    RiLinkM,
    RiLinkUnlink,
    RiH1,
    RiH2,
    RiH3,
} from "react-icons/ri";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    className?: string;
    editorClassName?: string;
    error?: string;
    label?: string;
    required?: boolean;
    minHeight?: number;
}

interface ToolbarButtonProps {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}

const ToolbarBtn = ({ onClick, active, disabled, title, children }: ToolbarButtonProps) => (
    <button
        type="button"
        onMouseDown={(e) => {
            e.preventDefault();
            onClick();
        }}
        disabled={disabled}
        title={title}
        className={cn(
            "h-7 w-7 flex items-center justify-center rounded text-sm transition-colors",
            active
                ? "bg-primary2-700 text-white"
                : "text-primary2-700 hover:bg-primary2-100",
            disabled && "opacity-40 cursor-not-allowed",
        )}
    >
        {children}
    </button>
);

const Divider = () => <div className="w-px h-5 bg-surface-300 mx-0.5 self-center" />;

const RichTextEditor = ({
    value = "",
    onChange,
    placeholder = "Write your content here...",
    className,
    editorClassName,
    error,
    label,
    required,
    minHeight = 200,
}: RichTextEditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-primary2-600 underline" },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.isEmpty ? "" : editor.getHTML();
            onChange?.(html);
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm max-w-none focus:outline-none px-4 py-3",
                    "prose-headings:text-primary2-900 prose-p:text-gray-700",
                    "prose-strong:text-primary2-900 prose-blockquote:border-primary2-300",
                    editorClassName,
                ),
                style: `min-height: ${minHeight}px`,
            },
        },
    });

    // Sync external value changes (e.g. when editing opens)
    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (value !== current) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("Enter URL:", prev ?? "");
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className={cn("space-y-1.5", className)}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}

            <div
                className={cn(
                    "rounded-xl border bg-white transition-colors",
                    error
                        ? "border-red-400 focus-within:border-red-500"
                        : "border-surface-300 focus-within:border-primary2-400",
                )}
            >
                {/* ── Toolbar ───────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-0.5 border-b border-surface-200 px-2 py-1.5">
                    {/* Headings */}
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        active={editor.isActive("heading", { level: 1 })}
                        title="Heading 1"
                    >
                        <RiH1 />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive("heading", { level: 2 })}
                        title="Heading 2"
                    >
                        <RiH2 />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        active={editor.isActive("heading", { level: 3 })}
                        title="Heading 3"
                    >
                        <RiH3 />
                    </ToolbarBtn>

                    <Divider />

                    {/* Marks */}
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive("bold")}
                        title="Bold"
                    >
                        <RiBold />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive("italic")}
                        title="Italic"
                    >
                        <RiItalic />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        active={editor.isActive("underline")}
                        title="Underline"
                    >
                        <RiUnderline />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        active={editor.isActive("strike")}
                        title="Strikethrough"
                    >
                        <RiStrikethrough />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        active={editor.isActive("code")}
                        title="Inline code"
                    >
                        <RiCodeLine />
                    </ToolbarBtn>

                    <Divider />

                    {/* Alignment */}
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        active={editor.isActive({ textAlign: "left" })}
                        title="Align left"
                    >
                        <RiAlignLeft />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        active={editor.isActive({ textAlign: "center" })}
                        title="Align center"
                    >
                        <RiAlignCenter />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        active={editor.isActive({ textAlign: "right" })}
                        title="Align right"
                    >
                        <RiAlignRight />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        active={editor.isActive({ textAlign: "justify" })}
                        title="Justify"
                    >
                        <RiAlignJustify />
                    </ToolbarBtn>

                    <Divider />

                    {/* Lists & blocks */}
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive("bulletList")}
                        title="Bullet list"
                    >
                        <RiListUnordered />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive("orderedList")}
                        title="Ordered list"
                    >
                        <RiListOrdered />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive("blockquote")}
                        title="Blockquote"
                    >
                        <RiDoubleQuotesL />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        active={editor.isActive("codeBlock")}
                        title="Code block"
                    >
                        <RiCodeBoxLine />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Horizontal rule"
                    >
                        <RiSeparator />
                    </ToolbarBtn>

                    <Divider />

                    {/* Link */}
                    <ToolbarBtn
                        onClick={setLink}
                        active={editor.isActive("link")}
                        title="Set link"
                    >
                        <RiLinkM />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        disabled={!editor.isActive("link")}
                        title="Remove link"
                    >
                        <RiLinkUnlink />
                    </ToolbarBtn>

                    <Divider />

                    {/* Undo / Redo */}
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <RiArrowGoBackLine />
                    </ToolbarBtn>
                    <ToolbarBtn
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <RiArrowGoForwardLine />
                    </ToolbarBtn>
                </div>

                {/* ── Editor area ───────────────────────────── */}
                <EditorContent editor={editor} />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default RichTextEditor;
