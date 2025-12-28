'use client'

import React, { useEffect, useState } from 'react'
import {
    Settings,
    X,
    Calendar,
    Tag,
    User,
    Star,
    Link as LinkIcon,
    ChevronRight,
    Trash2,
    AlertTriangle,
    FileText,
    CheckCircle2,
    Archive,
    ChevronDown,
    Sparkles
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SettingsDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    formData: {
        status: string
        category_id: string
        columnist_id: string
        author_id: string
        published_at: string
        featured_home: boolean
        source_url: string
    }
    onChange: (field: string, value: any) => void
    categories: Array<{ id: string; name: string }>
    authors: Array<{ id: string; name: string }>
    onDelete?: () => void
    isNew?: boolean
}

// Premium Settings Card Component
function SettingsCard({
    children,
    className,
    animate = true
}: {
    children: React.ReactNode
    className?: string
    animate?: boolean
}) {
    return (
        <div className={cn(
            "bg-white rounded-[24px] border border-gray-100 p-4 shadow-sm",
            "transition-all duration-300 ease-out",
            animate && "hover:border-gray-200",
            className
        )}>
            {children}
        </div>
    )
}

// Section Header Component
function SectionHeader({
    icon: Icon,
    label,
    badge
}: {
    icon: React.ElementType
    label: string
    badge?: string
}) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gray-50 rounded-xl">
                <Icon className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            {badge && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                    {badge}
                </span>
            )}
        </div>
    )
}

// Status Button Component
function StatusButton({
    selected,
    onClick,
    icon: Icon,
    label,
    color
}: {
    selected: boolean
    onClick: () => void
    icon: React.ElementType
    label: string
    color: 'gray' | 'green' | 'orange'
}) {
    const colors = {
        gray: {
            selected: "border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-200",
            icon: "text-white",
            dot: "bg-gray-400"
        },
        green: {
            selected: "border-green-600 bg-green-600 text-white shadow-lg shadow-green-100",
            icon: "text-white",
            dot: "bg-green-300"
        },
        orange: {
            selected: "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-100",
            icon: "text-white",
            dot: "bg-orange-200"
        }
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-[20px] border transition-all duration-300",
                "focus:outline-none",
                selected
                    ? cn(colors[color].selected, "scale-105 z-10")
                    : "border-gray-100 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50"
            )}
        >
            <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                selected ? "bg-white/20" : "bg-gray-50"
            )}>
                <Icon className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    selected ? colors[color].icon : "text-gray-400"
                )} />
            </div>
            <span className="text-xs font-bold">{label}</span>
            {selected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
        </button>
    )
}

// Custom Select Component
function CustomSelect({
    value,
    onChange,
    options,
    placeholder,
    icon: Icon
}: {
    value: string
    onChange: (value: string) => void
    options: Array<{ id: string; name: string }>
    placeholder: string
    icon: React.ElementType
}) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full appearance-none bg-white border border-gray-100 text-gray-900 text-sm rounded-2xl",
                    "pl-11 pr-10 py-4 outline-none cursor-pointer",
                    "transition-all duration-300",
                    "hover:border-gray-300",
                    "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5"
                )}
            >
                <option value="" className="text-gray-400">{placeholder}</option>
                {options.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
        </div>
    )
}

// Premium Toggle Component
function PremiumToggle({
    checked,
    onChange,
    label,
    description,
    icon: Icon
}: {
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
    description: string
    icon: React.ElementType
}) {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={cn(
                "flex items-center justify-between p-4 rounded-[20px] cursor-pointer transition-all duration-300",
                "border bg-white",
                checked
                    ? "border-orange-200 shadow-sm"
                    : "border-gray-100 hover:border-gray-200"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "p-3 rounded-xl transition-all duration-300",
                    checked
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                        : "bg-gray-50 text-gray-400"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className={cn(
                        "text-sm font-bold transition-colors",
                        checked ? "text-gray-900" : "text-gray-600"
                    )}>{label}</p>
                    <p className="text-xs text-gray-400 font-medium">{description}</p>
                </div>
            </div>

            {/* Premium Switch */}
            <div className={cn(
                "relative w-12 h-6 rounded-full p-1 transition-all duration-300",
                checked ? "bg-orange-500" : "bg-gray-200"
            )}>
                <div className={cn(
                    "absolute w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-out",
                    checked ? "left-[calc(100%-20px)]" : "left-1"
                )} />
            </div>
        </div>
    )
}

// Quick Date Buttons
function QuickDateButton({
    label,
    onClick,
    active
}: {
    label: string
    onClick: () => void
    active?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 border",
                active
                    ? "bg-gray-900 border-gray-900 text-white shadow-md shadow-gray-100"
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-900"
            )}
        >
            {label}
        </button>
    )
}

// Floating Menu Component
function SettingsModal({
    open,
    onOpenChange,
    formData,
    onChange,
    categories,
    authors,
    onDelete,
    isNew
}: SettingsDrawerProps) {
    const [showDangerZone, setShowDangerZone] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            onOpenChange(false)
            setIsClosing(false)
        }, 200)
    }

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                handleClose()
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [open])

    if (!open && !isClosing) return null

    return (
        <>
            {/* Extremely subtle backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] transition-all duration-500",
                    "bg-gray-950/5 backdrop-blur-[1px]",
                    open && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Floating Menu Container */}
            <div
                className={cn(
                    "fixed bottom-[88px] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl px-6 pointer-events-none",
                    "transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
                )}
            >
                {/* Modal Content */}
                <div
                    className={cn(
                        "relative w-full max-h-[75vh] pointer-events-auto",
                        "bg-white",
                        "rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.12)]",
                        "border border-gray-100/50",
                        "flex flex-col overflow-hidden",
                        // Animation
                        "transition-all duration-500 ease-out",
                        open && !isClosing
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 translate-y-20"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative flex items-center justify-between px-10 py-8 bg-white border-b border-gray-50/50">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-orange-50 rounded-[24px]">
                                <Settings className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Configurações</h2>
                                <p className="text-sm font-medium text-gray-400">Personalize os detalhes do seu post</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={cn(
                                "p-3 rounded-[20px] transition-all duration-300",
                                "text-gray-300 hover:text-gray-900 hover:bg-gray-50",
                                "focus:outline-none"
                            )}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 scrollbar-hide">
                        {/* Status Section */}
                        <div className="space-y-4">
                            <SectionHeader icon={Tag} label="Status da Publicação" badge={formData.status} />
                            <div className="grid grid-cols-3 gap-4">
                                <StatusButton
                                    selected={formData.status === 'draft'}
                                    onClick={() => onChange('status', 'draft')}
                                    icon={FileText}
                                    label="Rascunho"
                                    color="gray"
                                />
                                <StatusButton
                                    selected={formData.status === 'published'}
                                    onClick={() => onChange('status', 'published')}
                                    icon={CheckCircle2}
                                    label="Publicado"
                                    color="green"
                                />
                                <StatusButton
                                    selected={formData.status === 'archived'}
                                    onClick={() => onChange('status', 'archived')}
                                    icon={Archive}
                                    label="Arquivado"
                                    color="orange"
                                />
                            </div>
                        </div>

                        {/* Category & Author */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <SectionHeader icon={Tag} label="Categoria" />
                                <CustomSelect
                                    value={formData.category_id}
                                    onChange={(val) => onChange('category_id', val)}
                                    options={categories}
                                    placeholder="Selecione a categoria..."
                                    icon={Tag}
                                />
                            </div>

                            <div className="space-y-4">
                                <SectionHeader icon={User} label="Autor do Sistema" />
                                <CustomSelect
                                    value={formData.author_id}
                                    onChange={(val) => onChange('author_id', val)}
                                    options={authors}
                                    placeholder="Selecione o autor..."
                                    icon={User}
                                />
                            </div>
                        </div>

                        {/* Publication Date */}
                        <div className="space-y-4">
                            <SectionHeader icon={Calendar} label="Data de Publicação" />
                            <div className="flex items-center gap-2 mb-4">
                                <QuickDateButton
                                    label="Hoje"
                                    onClick={() => onChange('published_at', today)}
                                    active={formData.published_at === today}
                                />
                                <QuickDateButton
                                    label="Amanhã"
                                    onClick={() => onChange('published_at', tomorrow)}
                                    active={formData.published_at === tomorrow}
                                />
                            </div>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors pointer-events-none" />
                                <Input
                                    type="date"
                                    value={formData.published_at}
                                    onChange={(e) => onChange('published_at', e.target.value)}
                                    className="h-14 pl-12 bg-white border-gray-100 rounded-2xl font-medium focus:border-orange-500 transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Toggles & Options */}
                        <div className="space-y-4">
                            <SectionHeader icon={Star} label="Visibilidade e Destaque" />
                            <PremiumToggle
                                checked={formData.featured_home}
                                onChange={(val) => onChange('featured_home', val)}
                                label="Destaque na Home"
                                description="Exibir este post na seção principal do site"
                                icon={Star}
                            />
                        </div>

                        {/* Source URL */}
                        <div className="space-y-4">
                            <SectionHeader icon={LinkIcon} label="Link da Fonte Original" />
                            <div className="relative group">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors pointer-events-none" />
                                <Input
                                    value={formData.source_url}
                                    onChange={(e) => onChange('source_url', e.target.value)}
                                    placeholder="https://exemplo.com.br/artigo-original"
                                    className="h-14 pl-12 bg-white border-gray-100 rounded-2xl font-medium focus:border-orange-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Danger Zone */}
                        {!isNew && onDelete && (
                            <div className="pt-4 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowDangerZone(!showDangerZone)}
                                    className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-red-500 transition-colors uppercase tracking-widest"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Opções Avançadas</span>
                                    <ChevronDown className={cn(
                                        "w-4 h-4 transition-transform duration-300",
                                        showDangerZone && "rotate-180"
                                    )} />
                                </button>

                                <div className={cn(
                                    "overflow-hidden transition-all duration-500",
                                    showDangerZone ? "max-h-32 opacity-100 mt-6" : "max-h-0 opacity-0"
                                )}>
                                    <div className="p-6 bg-red-50 rounded-[24px] border border-red-100">
                                        <p className="text-xs text-red-600 font-bold mb-4 flex items-center gap-2">
                                            <AlertTriangle className="w-3 h-3" />
                                            Atenção: esta ação não pode ser desfeita.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={onDelete}
                                            className="w-full justify-center text-red-600 border-red-200 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 h-14 rounded-2xl text-sm font-black transition-all duration-300"
                                        >
                                            <Trash2 className="w-5 h-5 mr-2" />
                                            EXCLUIR POST AGORA
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-10 bg-white border-t border-gray-50/50">
                        <Button
                            onClick={handleClose}
                            className={cn(
                                "w-full h-16 rounded-[24px] font-black text-lg uppercase tracking-tighter",
                                "bg-orange-500 hover:bg-gray-900 border-none",
                                "text-white shadow-[0_15px_40px_rgba(249,115,22,0.25)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]",
                                "transition-all duration-500 hover:-translate-y-1 active:scale-[0.98]",
                                "flex items-center justify-center gap-3"
                            )}
                        >
                            FECHAR E APLICAR
                            <CheckCircle2 className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

// Main Component Export
export function SettingsDrawer(props: SettingsDrawerProps) {
    // Prevent body scroll when menu is open
    useEffect(() => {
        if (props.open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [props.open])

    return <SettingsModal {...props} />
}
