import React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import '@payloadcms/next/css'
import './admin-theme.css'
import './posts/custom.css'
import { importMap } from './importMap'
import { serverFunction } from './actions'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  const config = await configPromise

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
