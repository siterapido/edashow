import React from 'react'
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ArrowUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Column<T> {
    key: string
    label: string
    render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    loading?: boolean
    onRowClick?: (item: T) => void
    onReorder?: (items: T[]) => void
}

interface SortableRowProps {
    children: React.ReactNode
    id: string | number
    className?: string
    onClick?: () => void
}

function SortableRow({ children, id, className, onClick }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: isDragging ? 'relative' as const : undefined,
    }

    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(className, isDragging && "bg-orange-50 shadow-lg scale-[1.01]")}
            onClick={onClick}
        >
            {children}
        </tr>
    )
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    loading,
    onRowClick,
    onReorder
}: DataTableProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id && onReorder) {
            const oldIndex = data.findIndex((item) => item.id === active.id)
            const newIndex = data.findIndex((item) => item.id === over.id)
            onReorder(arrayMove(data, oldIndex, newIndex))
        }
    }

    const TableContent = (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest"
                        >
                            <div className="flex items-center gap-2">
                                {col.label}
                                {col.key !== 'drag' && (
                                    <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </div>
                        </th>
                    ))}
                    <th className="px-6 py-4 text-right"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            {columns.map((_, j) => (
                                <td key={j} className="px-6 py-4">
                                    <div className="h-4 bg-gray-100 rounded w-full" />
                                </td>
                            ))}
                            <td className="px-6 py-4"></td>
                        </tr>
                    ))
                ) : data.length > 0 ? (
                    onReorder ? (
                        <SortableContext
                            items={data.map(d => d.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {data.map((item) => (
                                <SortableRow
                                    key={item.id}
                                    id={item.id}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        "hover:bg-gray-50 transition-colors cursor-pointer group",
                                        onRowClick && "active:bg-gray-100"
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-sm text-gray-600">
                                            {col.render ? col.render(item) : (item as any)[col.key]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 cursor-pointer relative z-20" onClick={(e) => e.stopPropagation()}>
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </SortableRow>
                            ))}
                        </SortableContext>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "hover:bg-gray-50 transition-colors cursor-pointer group",
                                    onRowClick && "active:bg-gray-100"
                                )}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4 text-sm text-gray-600">
                                        {col.render ? col.render(item) : (item as any)[col.key]}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )
                ) : (
                    <tr>
                        <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 italic">
                            Nenhum registro encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                {onReorder ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        {TableContent}
                    </DndContext>
                ) : (
                    TableContent
                )}
            </div>

            {/* Pagination Placeholder */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    Mostrando <span className="font-bold text-gray-700">{data.length}</span> resultados
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-500 hover:bg-gray-50 h-8 px-2">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-500 hover:bg-gray-50 h-8 px-2">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
