'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Users, ArrowUpDown, Loader2, Instagram, Twitter, Globe, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/cms/DataTable'
import { getColumnists, saveColumnist, deleteColumnist } from '@/lib/actions/cms-taxonomy'
import { slugify } from '@/lib/utils'

export default function CMSColumnistsPage() {
    const [columnists, setColumnists] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentCol, setCurrentCol] = useState<any>({ name: '', slug: '', bio: '', avatar_url: '', social_instagram: '', social_twitter: '' })
    const [saving, setSaving] = useState(false)

    const fetchCols = async () => {
        setLoading(true)
        try {
            const data = await getColumnists()
            setColumnists(data || [])
        } catch (error) {
            console.error('Erro ao buscar colunistas:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCols()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await saveColumnist(currentCol)
            setIsEditing(false)
            setCurrentCol({ name: '', slug: '', bio: '', avatar_url: '', social_instagram: '', social_twitter: '' })
            fetchCols()
        } catch (error) {
            console.error('Erro ao salvar colunista:', error)
        }
        setSaving(false)
    }

    const handleEdit = (col: any) => {
        setCurrentCol(col)
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este colunista?')) return
        try {
            await deleteColumnist(id)
            fetchCols()
        } catch (error) {
            console.error('Erro ao deletar:', error)
        }
    }

    const updateName = (name: string) => {
        setCurrentCol(prev => ({
            ...prev,
            name,
            slug: !prev.id ? slugify(name) : prev.slug
        }))
    }

    const columns = [
        {
            key: 'name',
            label: 'Nome',
            render: (col: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                        {col.avatar_url ? (
                            <img src={col.avatar_url} alt={col.name} className="w-full h-full object-cover" />
                        ) : (
                            <Users className="w-4 h-4 m-2 text-gray-400" />
                        )}
                    </div>
                    <span className="font-bold text-gray-900">{col.name}</span>
                </div>
            )
        },
        { key: 'slug', label: 'Slug' },
        {
            key: 'social',
            label: 'Redes',
            render: (col: any) => (
                <div className="flex gap-2">
                    {col.social_instagram && <Instagram className="w-3 h-3 text-pink-500" />}
                    {col.social_twitter && <Twitter className="w-3 h-3 text-orange-300" />}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Colunistas</h1>
                    <p className="text-gray-500 text-sm mt-1">Gerencie os autores e especialistas do portal.</p>
                </div>
                <Button
                    onClick={() => {
                        setCurrentCol({ name: '', slug: '', bio: '', avatar_url: '', social_instagram: '', social_twitter: '' })
                        setIsEditing(true)
                    }}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 shadow-lg shadow-orange-500/20"
                >
                    <Plus className="w-4 h-4" /> Novo Colunista
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <DataTable
                        columns={columns}
                        data={columnists}
                        loading={loading}
                        onRowClick={handleEdit}
                    />
                </div>

                <div className={cn(
                    "bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-24 transition-all",
                    !isEditing && "opacity-50 pointer-events-none grayscale"
                )}>
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-4 h-4 text-orange-500" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                            {currentCol.id ? 'Editar Colunista' : 'Novo Colunista'}
                        </h2>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-100 overflow-hidden flex items-center justify-center">
                                    {currentCol.avatar_url ? (
                                        <img src={currentCol.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-gray-300" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Nome Completo</Label>
                            <Input
                                value={currentCol.name}
                                onChange={(e) => updateName(e.target.value)}
                                placeholder="Ex: João Silva"
                                className="bg-gray-50 border-gray-100 text-gray-900 focus:bg-white transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Slug</Label>
                            <Input
                                value={currentCol.slug}
                                onChange={(e) => setCurrentCol((prev: any) => ({ ...prev, slug: e.target.value }))}
                                className="bg-gray-50 border-gray-100 text-gray-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Biografia</Label>
                            <textarea
                                value={currentCol.bio}
                                onChange={(e) => setCurrentCol((prev: any) => ({ ...prev, bio: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 focus:bg-white transition-colors rounded-md p-3 text-gray-700 text-sm min-h-[80px] outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Breve descrição sobre o autor..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-gray-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Instagram className="w-2.5 h-2.5" /> Instagram
                                </Label>
                                <Input
                                    value={currentCol.social_instagram}
                                    onChange={(e) => setCurrentCol((prev: any) => ({ ...prev, social_instagram: e.target.value }))}
                                    placeholder="@username"
                                    className="bg-gray-50 border-gray-100 text-pink-600 text-xs focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Twitter className="w-2.5 h-2.5" /> Twitter
                                </Label>
                                <Input
                                    value={currentCol.social_twitter}
                                    onChange={(e) => setCurrentCol((prev: any) => ({ ...prev, social_twitter: e.target.value }))}
                                    placeholder="@username"
                                    className="bg-gray-50 border-gray-100 text-orange-400 text-xs focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {currentCol.id ? 'Atualizar' : 'Criar Autor'}
                            </Button>
                            {currentCol.id && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDelete(currentCol.id)}
                                    className="border-red-100 text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                            className="w-full text-gray-400 text-xs hover:bg-gray-50"
                        >
                            Cancelar
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
