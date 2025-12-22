'use client'

import React from 'react'
import { PostPreview } from './post-preview'
import { QuickPublishButton } from './quick-publish-button'
import { PostFormEnhancements } from './post-form-enhancements'
import { AutoSaveIndicator } from './auto-save-indicator'
import { useForm, useDocumentInfo } from '@payloadcms/ui'
import { useKeyboardShortcuts, defaultPostShortcuts } from '@/lib/admin/posts/keyboard-shortcuts'

/**
 * Componente que agrupa ferramentas administrativas para posts
 * Pode ser usado como um campo UI no Payload CMS
 */
const PostTools: React.FC = () => {
  const { getData, submit } = useForm()
  const { id } = useDocumentInfo()
  const data: any = getData()

  // Configurar atalhos de teclado
  useKeyboardShortcuts([
    defaultPostShortcuts.save(() => {
      console.log('Salvando via atalho...')
      submit()
    }),
    // O preview e publish seriam disparados clicando nos botões via ref ou lógica similar
    // Para simplificar, os botões já estão acessíveis visualmente
  ])

  return (
    <div className="flex flex-col gap-4 mt-4 p-4 border rounded-lg bg-muted/20">
      <div className="flex flex-wrap gap-2">
        <PostPreview postData={data} postId={id?.toString()} />
        <QuickPublishButton postData={data} postId={id?.toString()} />
      </div>
      
      <AutoSaveIndicator 
        isSaving={false} 
        lastSaved={null} 
        hasChanges={true} 
      />
      
      <PostFormEnhancements 
        title={data.title} 
        excerpt={data.excerpt} 
        slug={data.slug}
      />
    </div>
  )
}

export default PostTools
