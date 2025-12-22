'use client'

import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: (e: KeyboardEvent) => void
  preventDefault?: boolean
}

/**
 * Hook para gerenciar atalhos de teclado
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const altMatch = shortcut.alt ? e.altKey : !e.altKey
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault()
          }
          shortcut.handler(e)
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
}

/**
 * Atalhos padrão para postagem
 */
export const defaultPostShortcuts = {
  save: (handler: () => void) => ({
    key: 's',
    ctrl: true,
    handler: () => handler(),
  }),
  preview: (handler: () => void) => ({
    key: 'p',
    ctrl: true,
    handler: () => handler(),
  }),
  publish: (handler: () => void) => ({
    key: 'p',
    ctrl: true,
    shift: true,
    handler: () => handler(),
  }),
  new: (handler: () => void) => ({
    key: 'n',
    ctrl: true,
    handler: () => handler(),
  }),
  escape: (handler: () => void) => ({
    key: 'Escape',
    handler: () => handler(),
  }),
}











