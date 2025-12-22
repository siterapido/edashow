'use client'

import { toast } from 'sonner'

/**
 * Utilitários para notificações de postagem
 */
export const postNotifications = {
  /**
   * Notificação de rascunho salvo automaticamente
   */
  draftSaved: (timestamp?: Date) => {
    toast.success('Rascunho salvo automaticamente', {
      description: timestamp 
        ? `Salvo às ${timestamp.toLocaleTimeString('pt-BR')}`
        : undefined,
      duration: 2000,
    })
  },

  /**
   * Notificação de post publicado
   */
  postPublished: (title?: string) => {
    toast.success('Post publicado com sucesso!', {
      description: title ? `"${title}" está agora visível no site` : undefined,
      duration: 4000,
    })
  },

  /**
   * Notificação de post agendado
   */
  postScheduled: (date: Date, title?: string) => {
    toast.success('Post agendado!', {
      description: title 
        ? `"${title}" será publicado em ${date.toLocaleDateString('pt-BR')}`
        : `Será publicado em ${date.toLocaleDateString('pt-BR')}`,
      duration: 4000,
    })
  },

  /**
   * Notificação de erro ao salvar
   */
  saveError: (message?: string) => {
    toast.error('Erro ao salvar', {
      description: message || 'Não foi possível salvar o post. Tente novamente.',
      duration: 5000,
    })
  },

  /**
   * Notificação de campos obrigatórios não preenchidos
   */
  validationError: (errors: string[]) => {
    toast.error('Campos obrigatórios não preenchidos', {
      description: errors.join(', '),
      duration: 5000,
    })
  },

  /**
   * Notificação de preview gerado
   */
  previewGenerated: () => {
    toast.info('Preview gerado', {
      description: 'Visualize como o post aparecerá no site',
      duration: 2000,
    })
  },

  /**
   * Notificação de slug gerado
   */
  slugGenerated: (slug: string) => {
    toast.success('Slug gerado', {
      description: `URL: /posts/${slug}`,
      duration: 3000,
    })
  },

  /**
   * Notificação de excerpt gerado
   */
  excerptGenerated: () => {
    toast.info('Resumo gerado automaticamente', {
      description: 'Você pode editá-lo se necessário',
      duration: 3000,
    })
  },
}











