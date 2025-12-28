'use client'

import React, { useEffect, useState } from 'react'
import {
    Users,
    UserPlus,
    Shield,
    Trash2,
    Edit2,
    RefreshCw,
    X,
    Check,
    AlertCircle,
    Globe,
    Twitter,
    Instagram,
    Linkedin,
    BadgeCheck,
    Mail,
    User as UserIcon,
    Camera
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { getUsers, updateUserRole, updateUserProfile, deleteUser, createUser, type User, type AppRole } from '@/lib/actions/cms-users'

const ROLE_CONFIG: Record<AppRole, { label: string; color: string; description: string }> = {
    admin: { label: 'Admin', color: 'bg-orange-500', description: 'Acesso total ao sistema.' },
    editor: { label: 'Editor', color: 'bg-blue-500', description: 'Pode gerenciar qualquer conteúdo.' },
    author: { label: 'Autor', color: 'bg-green-500', description: 'Pode criar e publicar seus próprios posts.' },
    columnist: { label: 'Colunista', color: 'bg-purple-500', description: 'Perfil público de colunista com bio e redes sociais.' },
    contributor: { label: 'Colaborador', color: 'bg-amber-500', description: 'Pode enviar posts para revisão.' },
    user: { label: 'Usuário', color: 'bg-gray-400', description: 'Acesso básico (leitura).' }
}

export function UsersSettingsTab() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [saving, setSaving] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        const data = await getUsers()
        setUsers(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleRoleChange = async (userId: string, role: AppRole) => {
        setSaving(true)
        const result = await updateUserRole(userId, role)
        if (result.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
        } else {
            alert('Erro ao atualizar role: ' + result.error)
        }
        setSaving(false)
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return

        setSaving(true)
        const result = await deleteUser(userId)
        if (result.success) {
            setUsers(users.filter(u => u.id !== userId))
        } else {
            alert('Erro ao excluir usuário: ' + result.error)
        }
        setSaving(false)
    }

    const handleUpdateProfile = async (userId: string, data: Partial<User>) => {
        setSaving(true)
        const result = await updateUserProfile(userId, data)
        if (result.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u))
            setEditingUser(null)
        } else {
            alert('Erro ao atualizar: ' + result.error)
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sistema de Usuários Unificado</h2>
                    <p className="text-gray-500 text-sm mt-1">Gerencie autores, colunistas e administradores em um só lugar.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 shadow-lg"
                >
                    <UserPlus className="w-4 h-4" />
                    Novo Usuário
                </Button>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        Usuários do Sistema ({users.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuário</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Papel / Nível</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfil</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-500">
                                        <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>Nenhum usuário cadastrado</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white relative overflow-hidden",
                                                    ROLE_CONFIG[user.role].color
                                                )}>
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.name?.substring(0, 2).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 flex items-center gap-1">
                                                        {user.name}
                                                        {user.role === 'columnist' && <BadgeCheck className="w-4 h-4 text-purple-500" />}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as AppRole)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                                                    user.role === 'admin' ? "bg-orange-50 border-orange-200 text-orange-700" :
                                                        user.role === 'editor' ? "bg-blue-50 border-blue-200 text-blue-700" :
                                                            user.role === 'columnist' ? "bg-purple-50 border-purple-200 text-purple-700" :
                                                                user.role === 'author' ? "bg-green-50 border-green-200 text-green-700" :
                                                                    "bg-gray-50 border-gray-200 text-gray-700"
                                                )}
                                                disabled={saving}
                                            >
                                                {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                                                    <option key={role} value={role}>{config.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex gap-2">
                                                {user.is_public ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Público</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Privado</span>
                                                )}
                                                {user.bio ? (
                                                    <span className="text-xs text-blue-600 font-medium">Bio ✓</span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Sem Bio</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingUser(user)}
                                                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Settings Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                    <div key={role} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.color, "bg-opacity-10")}>
                            <Shield className={cn("w-5 h-5", config.color.replace('bg-', 'text-'))} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{config.label}</p>
                            <p className="text-xs text-gray-500">{config.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={(data) => handleUpdateProfile(editingUser.id, data)}
                    saving={saving}
                />
            )}

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false)
                        fetchUsers()
                    }}
                />
            )}
        </div>
    )
}

function EditUserModal({ user, onClose, onSave, saving }: {
    user: User
    onClose: () => void
    onSave: (data: Partial<User>) => void
    saving: boolean
}) {
    const [form, setForm] = useState({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
        slug: user.slug || '',
        website: user.website || '',
        is_public: user.is_public ?? true,
        social_links: user.social_links || { twitter: '', instagram: '', linkedin: '' }
    })

    const handleSocialChange = (key: string, value: string) => {
        setForm(prev => ({
            ...prev,
            social_links: { ...prev.social_links, [key]: value }
        }))
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", ROLE_CONFIG[user.role].color)}>
                            <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Editar Perfil de Usuário</h3>
                            <p className="text-xs text-gray-500">Ajuste as informações públicas e privadas.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <UserIcon className="w-4 h-4" /> Informações Básicas
                            </h4>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nome do usuário"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Título Profissional</label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Ex: Editor de Saúde, Colunista de Tecnologia"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase text-red-500">Slug (URL do Perfil)</label>
                                <Input
                                    value={form.slug}
                                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                                    placeholder="nome-sobrenome"
                                    className="bg-red-50/30 font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <Camera className="w-4 h-4" /> Identidade Visual
                            </h4>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Avatar URL</label>
                                <Input
                                    value={form.avatar_url}
                                    onChange={(e) => setForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                                    placeholder="https://..."
                                />
                            </div>
                            {form.avatar_url && (
                                <div className="mt-2 flex justify-center">
                                    <img src={form.avatar_url} className="w-20 h-20 rounded-full object-cover border-4 border-orange-100" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_public"
                                    checked={form.is_public}
                                    onChange={(e) => setForm(prev => ({ ...prev, is_public: e.target.checked }))}
                                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                                />
                                <label htmlFor="is_public" className="text-sm text-gray-700 font-medium">Perfil Público (Visível no site)</label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                            <BadgeCheck className="w-4 h-4" /> Biografia do Autor
                        </h4>
                        <Textarea
                            value={form.bio}
                            onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Conte um pouco sobre a experiência acadêmica e profissional deste autor..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                            <Globe className="w-4 h-4" /> Presença Digital & Redes
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Globe className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Website (URL completa)"
                                    value={form.website}
                                    onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))}
                                />
                            </div>
                            <div className="relative">
                                <Twitter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Twitter ID"
                                    value={form.social_links?.twitter}
                                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Instagram className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Instagram ID"
                                    value={form.social_links?.instagram}
                                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Linkedin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="LinkedIn ID"
                                    value={form.social_links?.linkedin}
                                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button
                        onClick={() => onSave(form)}
                        disabled={saving}
                        className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </div>
    )
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        role: 'author' as AppRole
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!form.email || !form.password || !form.name) {
            setError('Preencha todos os campos')
            return
        }

        if (form.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres')
            return
        }

        setSaving(true)
        const result = await createUser(form)

        if (result.success) {
            onCreated()
        } else {
            setError(result.error || 'Erro ao criar usuário')
        }
        setSaving(false)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-orange-500" />
                        Criar Novo Usuário
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome Coletivo/Autor</label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ex: João da Silva ou Redação"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email de Acesso</label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@exemplo.com"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Senha Temporária</label>
                        <Input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Mínimo 6 caracteres"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Cargo / Role</label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value as AppRole }))}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white text-sm"
                        >
                            {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                                <option key={role} value={role}>{config.label}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1 italic">
                            * {ROLE_CONFIG[form.role].description}
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-400 text-white shadow-lg"
                            disabled={saving}
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                            Registrar Usuário
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

