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
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getUsers, updateUserRole, updateUserProfile, deleteUser, createUser, type User } from '@/lib/actions/cms-users'

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

    const handleRoleChange = async (userId: string, role: 'admin' | 'editor' | 'user') => {
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

    const handleUpdateProfile = async (userId: string, data: { name: string }) => {
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
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Usuários</h2>
                    <p className="text-gray-500 text-sm mt-1">Gerencie usuários e permissões do sistema.</p>
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
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        Usuários Cadastrados ({users.length})
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p>Nenhum usuário cadastrado</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white",
                                            user.role === 'admin' ? "bg-orange-500" :
                                                user.role === 'editor' ? "bg-blue-500" : "bg-gray-400"
                                        )}>
                                            {user.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            {editingUser?.id === user.id ? (
                                                <EditUserForm
                                                    user={user}
                                                    onSave={(data) => handleUpdateProfile(user.id, data)}
                                                    onCancel={() => setEditingUser(null)}
                                                    saving={saving}
                                                />
                                            ) : (
                                                <>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Role Selector */}
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg border text-sm font-medium",
                                                user.role === 'admin' ? "bg-orange-50 border-orange-200 text-orange-700" :
                                                    user.role === 'editor' ? "bg-blue-50 border-blue-200 text-blue-700" :
                                                        "bg-gray-50 border-gray-200 text-gray-700"
                                            )}
                                            disabled={saving}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="editor">Editor</option>
                                            <option value="user">Usuário</option>
                                        </select>

                                        {/* Actions */}
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingUser(user)}
                                                className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="h-8 w-8 text-gray-500 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Role Legend */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-900">Tipos de Permissões</h4>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1">
                            <li><span className="font-medium">Admin:</span> Acesso total ao sistema, pode criar e gerenciar outros usuários</li>
                            <li><span className="font-medium">Editor:</span> Pode criar e editar conteúdo (posts, eventos, etc.)</li>
                            <li><span className="font-medium">Usuário:</span> Acesso básico para leitura</li>
                        </ul>
                    </div>
                </div>
            </div>

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

function EditUserForm({ user, onSave, onCancel, saving }: {
    user: User
    onSave: (data: { name: string }) => void
    onCancel: () => void
    saving: boolean
}) {
    const [name, setName] = useState(user.name)

    return (
        <div className="flex items-center gap-2">
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 w-48"
                placeholder="Nome"
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onSave({ name })} disabled={saving}>
                <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onCancel}>
                <X className="w-4 h-4 text-gray-500" />
            </Button>
        </div>
    )
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        role: 'editor' as 'admin' | 'editor'
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-orange-500" />
                        Novo Usuário
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
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
                        <label className="text-sm font-medium text-gray-700">Nome</label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nome completo"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@exemplo.com"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Senha</label>
                        <Input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Mínimo 6 caracteres"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tipo de Acesso</label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value as any }))}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white"
                        >
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-400 text-white"
                            disabled={saving}
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                            Criar Usuário
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
