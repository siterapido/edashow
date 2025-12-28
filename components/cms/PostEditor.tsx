'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Trash2,
    Eye,
    Settings,
    Check,
    Loader2,
    Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MediumEditor } from './MediumEditor'
import { CoverImageUpload } from './CoverImageUpload'
import { SettingsDrawer } from './SettingsDrawer'
import { PostPreview } from './PostPreview'
import { savePost, deletePost, autoSavePost } from '@/lib/actions/cms-posts'
import { useAutoSave } from '@/lib/hooks/useAutoSave'
import { slugify } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PostEditorProps {
    post: any
    categories: any[]
    authors: any[]
}

export function PostEditor({ post, categories, authors }: PostEditorProps) {
    const router = useRouter()

    const [settingsOpen, setSettingsOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [formData, setFormData] = useState({
        id: post?.id || 'new',
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        cover_image_url: post?.cover_image_url || '',
        category_id: post?.category_id || '',
        columnist_id: post?.columnist_id || '',
        author_id: post?.author_id || '',
        status: post?.status || 'draft',
        published_at: post?.published_at ? new Date(post.published_at).toISOString().split('T')[0] : '',
        featured_home: post?.featured_home || false,
        source_url: post?.source_url || '',
        tags: post?.tags || []
    })

    // Auto-save hook
    const { isSaving, statusText, hasUnsavedChanges } = useAutoSave({
        data: formData,
        delay: 5000,
        enabled: formData.id !== 'new' && formData.title.length > 0,
        onSave: async (data) => {
            await autoSavePost(data)
        }
    })

    const updateField = useCallback((field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            // Auto-generate slug from title for new posts
            ...(field === 'title' && formData.id === 'new' ? { slug: slugify(value) } : {})
        }))
    }, [formData.id])

    const handleSave = async () => {
        if (!formData.title) {
            alert('Por favor, adicione um título ao post.')
            return
        }

        try {
            const savedPost = await savePost(formData)
            if (formData.id === 'new') {
                router.replace(`/cms/posts/${savedPost.id}`)
            } else {
                router.push('/cms/posts')
            }
        } catch (error) {
            console.error('Erro ao salvar post:', error)
            alert('Erro ao salvar post. Verifique o console.')
        }
    }

    const handlePublish = async () => {
        if (!formData.title) {
            alert('Por favor, adicione um título ao post.')
            return
        }

        setIsPublishing(true)
        try {
            const savedPost = await savePost({
                ...formData,
                status: 'published',
                published_at: formData.published_at || new Date().toISOString().split('T')[0]
            })
            if (formData.id === 'new') {
                router.replace(`/cms/posts/${savedPost.id}`)
            } else {
                router.push('/cms/posts')
            }
        } catch (error) {
            console.error('Erro ao publicar post:', error)
            alert('Erro ao publicar post.')
        } finally {
            setIsPublishing(false)
        }
    }

    const handleDelete = async () => {
        if (formData.id === 'new') return
        if (!confirm('Tem certeza que deseja excluir este post?')) return

        try {
            await deletePost(formData.id)
            router.push('/cms/posts')
        } catch (error) {
            console.error('Erro ao deletar post:', error)
        }
    }

    const currentCategory = categories.find(c => c.id === formData.category_id)?.name

    return (
        <div className="min-h-screen bg-white pb-24 md:pb-8">
            {/* Header */}
            <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-40 transition-all duration-200">
                <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Left: Back button */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/cms/posts')}
                            className="text-gray-400 hover:text-gray-900 -ml-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Header actions if needed, otherwise empty to balance */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
                {/* Title Input - Medium Style */}
                <div className="space-y-1">
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="Título do post"
                        className="w-full bg-transparent text-3xl md:text-4xl font-bold text-gray-900 placeholder:text-gray-300 outline-none border-none"
                    />
                    {formData.slug && (
                        <p className="text-xs text-gray-400 font-mono">
                            /posts/{formData.slug}
                        </p>
                    )}
                </div>

                {/* Cover Image */}
                <CoverImageUpload
                    value={formData.cover_image_url}
                    onChange={(url) => updateField('cover_image_url', url || '')}
                />

                {/* Excerpt */}
                <textarea
                    value={formData.excerpt}
                    onChange={(e) => updateField('excerpt', e.target.value)}
                    placeholder="Escreva um resumo ou subtítulo para o post..."
                    className="w-full bg-transparent text-lg text-gray-700 placeholder:text-gray-400 outline-none border-none resize-none min-h-[60px]"
                    rows={2}
                />

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Editor */}
                <MediumEditor
                    content={formData.content}
                    onChange={(content) => updateField('content', content)}
                    placeholder="Comece a escrever sua história..."
                />
            </main>

            {/* Settings Drawer */}
            <SettingsDrawer
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                formData={{
                    status: formData.status,
                    category_id: formData.category_id,
                    columnist_id: formData.columnist_id,
                    author_id: formData.author_id,
                    published_at: formData.published_at,
                    featured_home: formData.featured_home,
                    source_url: formData.source_url
                }}
                onChange={updateField}
                categories={categories}
                authors={authors}
                onDelete={handleDelete}
                isNew={formData.id === 'new'}
            />

            {/* Post Preview Modal */}
            <PostPreview
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                post={{
                    title: formData.title,
                    content: formData.content,
                    excerpt: formData.excerpt,
                    cover_image_url: formData.cover_image_url,
                    category: currentCategory
                }}
            />


            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] safe-area-pb">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-3">

                    {/* Status Section - Mobile: Icon only / Desktop: Full badge */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                            ) : hasUnsavedChanges ? (
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                            ) : (
                                <Check className="w-4 h-4 text-green-500" />
                            )}
                            <span className="text-gray-600 text-xs font-medium hidden sm:inline">
                                {isSaving ? 'Salvando...' : statusText || 'Rascunho'}
                            </span>
                        </div>
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                        {/* Settings */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSettingsOpen(true)}
                            className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl w-10 h-10 shrink-0"
                            title="Configurações"
                        >
                            <Settings className="w-5 h-5" />
                        </Button>

                        {/* Preview */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setPreviewOpen(true)}
                            className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl w-10 h-10 shrink-0"
                            title="Prévia"
                        >
                            <Eye className="w-5 h-5" />
                        </Button>

                        {/* Separator - Small */}
                        <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />

                        {/* Publish / Update */}
                        {formData.status === 'published' ? (
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-500 text-white font-bold h-10 px-6 gap-2 rounded-xl shadow-sm shadow-green-200 transition-all"
                            >
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">Atualizar Post</span>
                                <span className="sm:hidden">Atualizar</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePublish}
                                disabled={isPublishing || !formData.title}
                                className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-400 text-white font-bold h-10 px-6 gap-2 rounded-xl shadow-lg shadow-orange-200 transition-all"
                            >
                                {isPublishing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">Publicar Agora</span>
                                <span className="sm:hidden">Publicar</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
