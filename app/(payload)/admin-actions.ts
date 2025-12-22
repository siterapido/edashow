'use server'

import configPromise from '@payload-config'

/**
 * Server function required by Payload CMS admin
 * This function is used internally by Payload's RootLayout component
 * 
 * @param args - Arguments passed from Payload's RootLayout
 * @returns The resolved config with any additional args
 */
export async function serverFunction(args: Record<string, unknown>) {
  const config = await configPromise
  return {
    config,
    ...args,
  }
}





