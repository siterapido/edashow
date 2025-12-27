'use client'

import React, { useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import TextAlign from '@tiptap/extension-text-align'


import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    ImageIcon,
    Minus,
    List,
    ListOrdered,
    Undo,
    Redo,
    Type,
    Code,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadMedia } from '@/lib/actions/cms-media'

interface MediumEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export function MediumEditor({ content, onChange, placeholder = 'Comece a escrever sua história...' }: MediumEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Underline,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full mx-auto my-6 shadow-sm'
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-orange-600 underline hover:text-orange-500 transition-colors cursor-pointer'
                }
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
                defaultAlignment: 'justify',
            }),
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none min-h-[300px] outline-none py-6 text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:text-justify prose-headings:text-justify prose-a:text-orange-600 prose-img:rounded-xl prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:my-4 prose-blockquote:not-italic prose-blockquote:text-gray-600',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer?.files.length) {
                    const files = Array.from(event.dataTransfer.files)
                    const images = files.filter(file => file.type.startsWith('image/'))

                    if (images.length > 0) {
                        event.preventDefault()
                        images.forEach(image => handleImageUpload(image))
                        return true
                    }
                }
                return false
            },
            handlePaste: (view, event, slice) => {
                const items = event.clipboardData?.items
                if (items) {
                    for (const item of Array.from(items)) {
                        if (item.type.startsWith('image/')) {
                            event.preventDefault()
                            const file = item.getAsFile()
                            if (file) handleImageUpload(file)
                            return true
                        }
                    }
                }
                return false
            }
        },
    })

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return

        // Insert placeholder
        const placeholderId = `uploading-${Date.now()}`
        editor.chain().focus().setImage({
            src: '/placeholder.jpg',
            alt: 'Carregando...',
        }).run()

        try {
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadMedia(formData)

            // Replace placeholder with actual image
            editor.chain().focus().setImage({
                src: result.url,
                alt: file.name
            }).run()
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error)
            alert('Erro ao fazer upload da imagem. Tente novamente.')
        }
    }, [editor])

    const triggerImageUpload = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageUpload(file)
            e.target.value = ''
        }
    }, [handleImageUpload])

    const setLink = useCallback(() => {
        if (!editor) return

        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL do link:', previousUrl)

        if (url === null) return

        if (url === '') {
            editor.chain().focus().unsetLink().run()
            return
        }

        editor.chain().focus().setLink({ href: url }).run()
    }, [editor])

    if (!editor) return null

    const characterCount = editor.storage.characterCount.characters()
    const wordCount = editor.storage.characterCount.words()

    return (
        <div className="relative group">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Desktop Sticky Toolbar Removed */}

            {/* Bubble Menu - appears on text selection */}
            <BubbleMenu
                editor={editor}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex items-center gap-0.5 p-1 overflow-hidden"
            >
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Negrito (Cmd+B)"
                >
                    <Bold className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Itálico (Cmd+I)"
                >
                    <Italic className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Sublinhado (Cmd+U)"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Tachado"
                >
                    <Strikethrough className="w-4 h-4" />
                </BubbleButton>

                <div className="w-px h-5 bg-gray-200 mx-1" />

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Título 2"
                >
                    <Heading2 className="w-4 h-4" />
                </BubbleButton>

                <div className="w-px h-5 bg-gray-200 mx-1" />

                <BubbleButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    title="Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </BubbleButton>

                <div className="w-px h-5 bg-gray-200 mx-1" />

                <BubbleButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Alinhar à esquerda"
                >
                    <AlignLeft className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Centralizar"
                >
                    <AlignCenter className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Alinhar à direita"
                >
                    <AlignRight className="w-4 h-4" />
                </BubbleButton>
                <BubbleButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    title="Justificar"
                >
                    <AlignJustify className="w-4 h-4" />
                </BubbleButton>
            </BubbleMenu>

            {/* Floating Menu - appears on empty lines */}
            <FloatingMenu
                editor={editor}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex items-center gap-0.5 p-1"
            >
                <FloatingButton
                    onClick={triggerImageUpload}
                    title="Adicionar imagem"
                >
                    <ImageIcon className="w-4 h-4" />
                </FloatingButton>
                <FloatingButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Citação"
                >
                    <Quote className="w-4 h-4" />
                </FloatingButton>
                <FloatingButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Separador"
                >
                    <Minus className="w-4 h-4" />
                </FloatingButton>
                <FloatingButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Lista"
                >
                    <List className="w-4 h-4" />
                </FloatingButton>
            </FloatingMenu>

            {/* Editor Content */}
            <div className="min-h-[500px] outline-none">
                <EditorContent editor={editor} />
            </div>

            {/* Status Footer */}
            <div className="mt-2 flex items-center justify-between px-2 text-xs text-gray-400 font-medium">
                <div className="flex gap-4">
                    <span>{wordCount} palavras</span>
                    <span>{characterCount} caracteres</span>
                </div>
                <div>
                    markdown support
                </div>
            </div>

            {/* Mobile Bottom Toolbar */}
            <MobileToolbar editor={editor} onImageUpload={triggerImageUpload} />
        </div>
    )
}





// Bubble Menu Button Component
function BubbleButton({
    onClick,
    isActive,
    children,
    title
}: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                "p-2 rounded-md transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center",
                isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            {children}
        </button>
    )
}

// Floating Menu Button Component
function FloatingButton({
    onClick,
    children,
    title
}: {
    onClick: () => void
    children: React.ReactNode
    title: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
            {children}
        </button>
    )
}

// Mobile Toolbar Component
function MobileToolbar({
    editor,
    onImageUpload
}: {
    editor: any
    onImageUpload: () => void
}) {
    if (!editor) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-pb shadow-lg">
            <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-hide">
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                >
                    <UnderlineIcon className="w-5 h-5" />
                </MobileToolbarButton>

                <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />

                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    isActive={editor.isActive('paragraph')}
                >
                    <Type className="w-5 h-5" />
                </MobileToolbarButton>

                <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />

                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <List className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                >
                    <Quote className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton onClick={onImageUpload}>
                    <ImageIcon className="w-5 h-5" />
                </MobileToolbarButton>

                <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />

                <MobileToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                >
                    <AlignLeft className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                >
                    <AlignCenter className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                >
                    <AlignRight className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                >
                    <AlignJustify className="w-5 h-5" />
                </MobileToolbarButton>

                <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />

                <MobileToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="w-5 h-5" />
                </MobileToolbarButton>
                <MobileToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="w-5 h-5" />
                </MobileToolbarButton>
            </div>
        </div>
    )
}

// Mobile Toolbar Button Component
function MobileToolbarButton({
    onClick,
    isActive,
    disabled,
    children
}: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "p-3 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0",
                isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-900",
                disabled && "opacity-30 cursor-not-allowed"
            )}
        >
            {children}
        </button>
    )
}
