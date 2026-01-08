'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    AlignJustify,
    Save,
    Send,
    Loader2,
    Eye,
    EyeOff,
    Clock,
    FileText,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadMedia } from '@/lib/actions/cms-media'

interface UnifiedMediumEditorProps {
    title: string
    content: string
    excerpt: string
    coverImageUrl: string
    onTitleChange: (title: string) => void
    onContentChange: (content: string) => void
    onExcerptChange: (excerpt: string) => void
    onCoverImageChange: (url: string) => void
    onPublish: () => void
    onSave: () => void
    isPublishing?: boolean
    isSaving?: boolean
    hasUnsavedChanges?: boolean
    status?: string
    wordCount?: number
    readingTime?: number
}

export function UnifiedMediumEditor({
    title,
    content,
    excerpt,
    coverImageUrl,
    onTitleChange,
    onContentChange,
    onExcerptChange,
    onCoverImageChange,
    onPublish,
    onSave,
    isPublishing = false,
    isSaving = false,
    hasUnsavedChanges = false,
    status = 'draft',
    wordCount = 0,
    readingTime = 1
}: UnifiedMediumEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const coverImageInputRef = useRef<HTMLInputElement>(null)
    const excerptTextareaRef = useRef<HTMLTextAreaElement>(null)
    const [showPreview, setShowPreview] = useState(false)

    // Função para ajustar altura do textarea de excerpt
    const adjustExcerptHeight = useCallback(() => {
        const textarea = excerptTextareaRef.current
        if (textarea) {
            // Primeiro, remove qualquer altura fixa para recalcular o scrollHeight
            textarea.style.height = 'auto'
            // Calcula a altura necessária baseada no conteúdo
            const scrollHeight = textarea.scrollHeight
            // Define a nova altura, ajustando dinamicamente ao conteúdo
            textarea.style.height = `${scrollHeight}px`
        }
    }, [])

    // Ajusta altura quando excerpt muda ou componente monta
    useEffect(() => {
        // Usa requestAnimationFrame para garantir que o DOM foi atualizado
        requestAnimationFrame(() => {
            adjustExcerptHeight()
        })
    }, [excerpt, adjustExcerptHeight])

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
                placeholder: 'Comece a escrever sua história...',
            }),
            CharacterCount,
        ],
        content,
        onUpdate: ({ editor }) => {
            onContentChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none outline-none py-6 text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:text-justify prose-headings:text-justify prose-a:text-orange-600 prose-img:rounded-xl prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:my-4 prose-blockquote:not-italic prose-blockquote:text-gray-600',
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

        const placeholderId = `uploading-${Date.now()}`
        editor.chain().focus().setImage({
            src: '/placeholder.jpg',
            alt: 'Carregando...',
        }).run()

        try {
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadMedia(formData)

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

    const triggerCoverImageUpload = useCallback(() => {
        coverImageInputRef.current?.click()
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageUpload(file)
            e.target.value = ''
        }
    }, [handleImageUpload])

    const handleCoverFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const formData = new FormData()
                formData.append('file', file)
                const result = await uploadMedia(formData)
                onCoverImageChange(result.url)
            } catch (error) {
                console.error('Erro ao fazer upload da capa:', error)
                alert('Erro ao fazer upload da imagem de capa. Tente novamente.')
            }
            e.target.value = ''
        }
    }, [onCoverImageChange])

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
    const words = editor.storage.characterCount.words()

    return (
        <div className="min-h-screen bg-white">
            {/* Hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
            <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileSelect}
                className="hidden"
            />

            {/* Top Action Bar */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Left: Status */}
                    <div className="flex items-center gap-3">
                        {isSaving ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                <span>Salvando...</span>
                            </div>
                        ) : hasUnsavedChanges ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                <span>Alterações não salvas</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>{status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                            </div>
                        )}

                        {/* Metrics */}
                        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{readingTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{words} palavras</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Preview Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className={cn(
                                "p-2 rounded-lg transition-colors",
                                showPreview
                                    ? "bg-orange-100 text-orange-600"
                                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            )}
                            title={showPreview ? "Esconder prévia" : "Ver prévia"}
                        >
                            {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        {/* Save Button */}
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                                bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Salvando</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span className="hidden sm:inline">Salvar</span>
                                </>
                            )}
                        </button>

                        {/* Publish Button */}
                        <button
                            type="button"
                            onClick={onPublish}
                            disabled={isPublishing || isSaving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                                bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isPublishing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Publicando</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        {status === 'published' ? 'Atualizar' : 'Publicar'}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="max-w-4xl mx-auto">
                {!showPreview ? (
                    // Editor Mode
                    <div className="px-6 py-8 space-y-6">
                        {/* Cover Image */}
                        <div className="relative group">
                            {coverImageUrl ? (
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                    <img
                                        src={coverImageUrl}
                                        alt="Capa do post"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerCoverImageUpload}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    >
                                        <div className="text-white font-medium flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5" />
                                            <span>Alterar imagem de capa</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onCoverImageChange('')}
                                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={triggerCoverImageUpload}
                                    className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50/50 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-orange-500"
                                >
                                    <ImageIcon className="w-12 h-12" />
                                    <div className="text-center">
                                        <p className="font-medium">Adicionar imagem de capa</p>
                                        <p className="text-sm">ou arraste uma imagem aqui</p>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Title */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="Título do post"
                            className="w-full bg-transparent text-4xl md:text-5xl font-bold text-gray-900 placeholder:text-gray-300 outline-none border-none"
                        />

                        {/* Excerpt */}
                        <textarea
                            ref={excerptTextareaRef}
                            value={excerpt}
                            onChange={(e) => {
                                onExcerptChange(e.target.value)
                                // Ajusta altura após o estado ser atualizado
                                requestAnimationFrame(() => {
                                    adjustExcerptHeight()
                                })
                            }}
                            placeholder="Escreva um resumo ou subtítulo para o post..."
                            className="w-full bg-transparent text-xl text-gray-600 placeholder:text-gray-400 outline-none border-none resize-none overflow-hidden"
                            style={{ minHeight: '60px' }}
                        />

                        {/* Divider */}
                        <div className="border-b border-gray-100" />

                        {/* Content Editor */}
                        <div className="min-h-[600px]">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                ) : (
                    // Preview Mode
                    <div className="px-6 py-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-6">
                            {/* Cover Image */}
                            {coverImageUrl && (
                                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                                    <img
                                        src={coverImageUrl}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {title || 'Título do Post'}
                            </h1>

                            {/* Excerpt */}
                            {excerpt && (
                                <p className="text-xl text-gray-600">
                                    {excerpt}
                                </p>
                            )}

                            {/* Divider */}
                            <div className="border-b border-gray-100" />

                            {/* Content */}
                            <div
                                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-orange-600 prose-strong:text-gray-900"
                                dangerouslySetInnerHTML={{
                                    __html: content || '<p class="text-gray-400 italic">Comece a escrever para ver o conteúdo...</p>'
                                }}
                            />

                            {/* Footer Metrics */}
                            <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{readingTime} min de leitura</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4" />
                                    <span>{words} palavras</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bubble Menu - appears on text selection */}
            <BubbleMenu
                editor={editor}
                className="bg-white border border-gray-200 rounded-lg shadow-xl flex items-center gap-0.5 p-1 overflow-hidden"
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
                className="bg-white border border-gray-200 rounded-lg shadow-xl flex items-center gap-0.5 p-1"
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
