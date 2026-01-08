'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Trash2,
    Settings,
    ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UnifiedMediumEditor } from './UnifiedMediumEditor'
import { SettingsDrawer } from './SettingsDrawer'
import { savePost, deletePost, autoSavePost } from '@/lib/actions/cms-posts'
import { useAutoSave } from '@/lib/hooks/useAutoSave'
import { slugify } from '@/lib/utils'

// Helper function to calculate reading time
const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200
    const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Helper function to count words
const countWords = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, '')
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    return words.length
}

interface PostEditorProps {
    post: any
    categories: any[]
    columnists: any[]
}

export function PostEditor({ post, categories, columnists }: PostEditorProps) {
    const router = useRouter()

    const [settingsOpen, setSettingsOpen] = useState(false)
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
        status: post?.status || 'draft',
        published_at: post?.published_at ? new Date(post.published_at).toISOString().split('T')[0] : '',
        featured_home: post?.featured_home || false,
        source_url: post?.source_url || '',
        tags: post?.tags || []
    })

    // Intelligent metrics
    const readingTime = useMemo(() => calculateReadingTime(formData.content), [formData.content])
    const wordCount = useMemo(() => countWords(formData.content), [formData.content])

    // Auto-save hook
    const { isSaving, hasUnsavedChanges } = useAutoSave({
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
        } catch (error: any) {
            console.error('Erro ao salvar post:', error)
            const errorMessage = error?.message || error?.code || 'Erro desconhecido'
            alert(`Erro ao salvar post: ${errorMessage}. Verifique o console para mais detalhes.`)
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
        } catch (error: any) {
            console.error('Erro ao publicar post:', error)
            const errorMessage = error?.message || error?.code || 'Erro desconhecido'
            alert(`Erro ao publicar post: ${errorMessage}. Verifique o console para mais detalhes.`)
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-6 py-3">
                    {/* Back Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/cms/posts')}
                        className="text-gray-400 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* View Published Post Button */}
                        {formData.status === 'published' && formData.slug && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(`/posts/${formData.slug}`, '_blank')}
                                className="text-gray-400 hover:text-gray-900"
                                title="Ver post publicado"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </Button>
                        )}

                        {/* Settings Button */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSettingsOpen(true)}
                            className="text-gray-400 hover:text-gray-900"
                            title="Configurações do post"
                        >
                            <Settings className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Unified Editor */}
            <UnifiedMediumEditor
                title={formData.title}
                content={formData.content}
                excerpt={formData.excerpt}
                coverImageUrl={formData.cover_image_url}
                onTitleChange={(value) => updateField('title', value)}
                onContentChange={(value) => updateField('content', value)}
                onExcerptChange={(value) => updateField('excerpt', value)}
                onCoverImageChange={(value) => updateField('cover_image_url', value)}
                onPublish={handlePublish}
                onSave={handleSave}
                isPublishing={isPublishing}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                status={formData.status}
                wordCount={wordCount}
                readingTime={readingTime}
            />

            {/* Settings Drawer */}
            <SettingsDrawer
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                formData={{
                    status: formData.status,
                    category_id: formData.category_id,
                    columnist_id: formData.columnist_id,
                    published_at: formData.published_at,
                    featured_home: formData.featured_home,
                    source_url: formData.source_url
                }}
                onChange={updateField}
                categories={categories}
                columnists={columnists}
                onDelete={handleDelete}
                isNew={formData.id === 'new'}
            />
        </div>
    )
}
