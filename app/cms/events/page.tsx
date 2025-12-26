'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, MapPin, ArrowUpDown, Loader2, Link as LinkIcon, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/cms/DataTable'
import { getEvents, saveEvent, deleteEvent } from '@/lib/actions/cms-events'
import { cn } from '@/lib/utils'

export default function CMSEventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentEvent, setCurrentEvent] = useState<any>({ title: '', event_date: '', location: '', description: '', status: 'upcoming', registration_url: '' })
    const [saving, setSaving] = useState(false)

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const data = await getEvents()
            setEvents(data || [])
        } catch (error) {
            console.error('Erro ao buscar eventos:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await saveEvent(currentEvent)
            setIsEditing(false)
            setCurrentEvent({ title: '', event_date: '', location: '', description: '', status: 'upcoming', registration_url: '' })
            fetchEvents()
        } catch (error) {
            console.error('Erro ao salvar evento:', error)
        }
        setSaving(false)
    }

    const handleEdit = (event: any) => {
        setCurrentEvent({
            ...event,
            event_date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : ''
        })
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este evento?')) return
        try {
            await deleteEvent(id)
            fetchEvents()
        } catch (error) {
            console.error('Erro ao deletar:', error)
        }
    }

    const columns = [
        {
            key: 'name',
            label: 'Evento',
            render: (item: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-white">{item.title}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" /> {item.location || 'Local não definido'}
                    </div>
                </div>
            )
        },
        {
            key: 'event_date',
            label: 'Data',
            render: (item: any) => item.event_date ? (
                <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    {new Date(item.event_date).toLocaleDateString()}
                </div>
            ) : '-'
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: any) => (
                <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider",
                    item.status === 'upcoming' ? "bg-orange-400/10 text-orange-400 border border-orange-400/20" : "bg-slate-800 text-slate-400 border border-slate-700"
                )}>
                    {item.status === 'upcoming' ? 'Em breve' : 'Encerrado'}
                </span>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Eventos</h1>
                    <p className="text-slate-400 text-sm mt-1">Gerencie os próximos eventos, webinars e congressos.</p>
                </div>
                <Button
                    onClick={() => {
                        setCurrentEvent({ title: '', event_date: '', location: '', description: '', status: 'upcoming', registration_url: '' })
                        setIsEditing(true)
                    }}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 shadow-lg shadow-orange-900/20"
                >
                    <Plus className="w-4 h-4" /> Novo Evento
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <DataTable
                        columns={columns}
                        data={events}
                        loading={loading}
                        onRowClick={handleEdit}
                    />
                </div>

                <div className={cn(
                    "bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit sticky top-24 transition-all shadow-2xl shadow-black/40",
                    !isEditing && "opacity-50 pointer-events-none grayscale"
                )}>
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            {currentEvent.id ? 'Editar Evento' : 'Novo Evento'}
                        </h2>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-500 text-[10px] font-bold uppercase">Nome do Evento</Label>
                            <Input
                                value={currentEvent.title}
                                onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                                placeholder="Ex: Congresso Saúde Digital 2026"
                                className="bg-slate-950 border-slate-800 text-white h-11"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-bold uppercase">Data</Label>
                                <Input
                                    type="date"
                                    value={currentEvent.event_date}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, event_date: e.target.value })}
                                    className="bg-slate-950 border-slate-800 text-slate-300 h-11"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-bold uppercase">Status</Label>
                                <select
                                    value={currentEvent.status}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, status: e.target.value })}
                                    className="w-full bg-slate-950 border-slate-800 text-slate-300 text-sm rounded-md px-3 h-11 outline-none focus:ring-2 focus:ring-orange-400"
                                >
                                    <option value="upcoming">Em breve</option>
                                    <option value="past">Encerrado</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-500 text-[10px] font-bold uppercase">Localização</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                                <Input
                                    value={currentEvent.location}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                                    placeholder="Ex: São Paulo, SP (ou Online)"
                                    className="pl-9 bg-slate-950 border-slate-800 text-slate-300 h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-500 text-[10px] font-bold uppercase">Link para Inscrição (Opcional)</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                                <Input
                                    value={currentEvent.registration_url}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, registration_url: e.target.value })}
                                    placeholder="https://sua-pagina.com.br"
                                    className="pl-9 bg-slate-950 border-slate-800 text-slate-300 h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-500 text-[10px] font-bold uppercase">Descrição Curta</Label>
                            <textarea
                                value={currentEvent.description}
                                onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-slate-300 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-orange-400"
                                placeholder="Principais detalhes do evento..."
                            />
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold h-11"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {currentEvent.id ? 'Salvar Alterações' : 'Criar Evento'}
                            </Button>
                            {currentEvent.id && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDelete(currentEvent.id)}
                                    className="border-red-900/50 text-red-500 hover:bg-red-950 hover:text-red-400 h-11 px-4"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                            className="w-full text-slate-500 text-xs hover:bg-slate-800 h-10"
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
