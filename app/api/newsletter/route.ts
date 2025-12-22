import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const payload = await getPayload({ config: configPromise })

        // Verificar se já existe
        const existing = await payload.find({
            collection: 'newsletter-subscribers',
            where: {
                email: {
                    equals: email,
                },
            },
        })

        if (existing.docs.length > 0) {
            return NextResponse.json(
                { message: 'Email already subscribed' },
                { status: 200 }
            )
        }

        await payload.create({
            collection: 'newsletter-subscribers',
            data: {
                email,
                subscriptionDate: new Date().toISOString(),
            },
        })

        return NextResponse.json(
            { message: 'Successfully subscribed' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Newsletter subscription error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
