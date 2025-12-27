'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Tag, ArrowUpDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/cms/DataTable'
import { getCategories, saveCategory, deleteCategory } from '@/lib/actions/cms-taxonomy'
import { slugify } from '@/lib/utils'

export default function CMSCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentCat, setCurrentCat] = useState<any>({ name: '', slug: '', display_order: 0 })
    const [saving, setSaving] = useState(false)

    const fetchCats = async () => {
        setLoading(true)
        try {
            const data = await getCategories()
            setCategories(data || [])
        } catch (error) {
            console.error('Erro ao buscar categorias:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCats()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await saveCategory(currentCat)
            setIsEditing(false)
            setCurrentCat({ name: '', slug: '', display_order: 0 })
            fetchCats()
        } catch (error) {
            console.error('Erro ao salvar categoria:', error)
        }
        setSaving(false)
    }

    const handleEdit = (cat: any) => {
        setCurrentCat(cat)
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir esta categoria? Todos os posts vinculados perderão a categoria.')) return
        try {
            await deleteCategory(id)
            fetchCats()
        } catch (error) {
            console.error('Erro ao deletar:', error)
        }
    }

    const updateName = (name: string) => {
        setCurrentCat(prev => ({
            ...prev,
            name,
            slug: !prev.id ? slugify(name) : prev.slug
        }))
    }

    const columns = [
        { key: 'name', label: 'Nome' },
        { key: 'slug', label: 'Slug' },
        { key: 'display_order', label: 'Ordem' },
    ]

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Categorias</h1>
                    <p className="text-gray-500 text-sm mt-1">Organize seus posts por temas e editorias.</p>
                </div>
                <Button
                    onClick={() => {
                        setCurrentCat({ name: '', slug: '', display_order: categories.length + 1 })
                        setIsEditing(true)
                    }}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 shadow-lg shadow-orange-500/20"
                >
                    <Plus className="w-4 h-4" /> Nova Categoria
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Section */}
                <div className="lg:col-span-2">
                    <DataTable
                        columns={columns}
                        data={categories}
                        loading={loading}
                        onRowClick={handleEdit}
                    />
                </div>

                {/* Editor Section */}
                <div className={cn(
                    "bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-24 transition-all",
                    !isEditing && "opacity-50 pointer-events-none grayscale"
                )}>
                    <div className="flex items-center gap-2 mb-6">
                        <Tag className="w-4 h-4 text-orange-500" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                            {currentCat.id ? 'Editar Categoria' : 'Nova Categoria'}
                        </h2>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Nome</Label>
                            <Input
                                value={currentCat.name}
                                onChange={(e) => updateName(e.target.value)}
                                placeholder="Ex: Tecnologia"
                                className="bg-gray-50 border-gray-100 text-gray-900 focus:bg-white transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Slug</Label>
                            <Input
                                value={currentCat.slug}
                                onChange={(e) => setCurrentCat({ ...prev, slug: e.target.value })}
                                className="bg-gray-50 border-gray-100 text-gray-500 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Ordem de Exibição</Label>
                            <Input
                                type="number"
                                value={currentCat.display_order}
                                onChange={(e) => setCurrentCat({ ...prev, display_order: parseInt(e.target.value) })}
                                className="bg-gray-50 border-gray-100 text-gray-900 w-24 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {currentCat.id ? 'Atualizar' : 'Criar Categoria'}
                            </Button>
                            {currentCat.id && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDelete(currentCat.id)}
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
