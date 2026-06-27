import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { klaviyo_id, choices, ts } = await req.json() as {
      klaviyo_id?: string
      choices?: string[]
      ts?: number
    }

    if (!choices || choices.length !== 2) {
      return NextResponse.json({ ok: false, error: 'Select exactly two.' }, { status: 400 })
    }

    // Supabase insertion goes here — wired up in next step
    console.log('Vote received:', { klaviyo_id, choices, ts })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
