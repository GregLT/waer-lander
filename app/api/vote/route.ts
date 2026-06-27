import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

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

    const { error } = await getSupabase().from('votes').insert({
      klaviyo_id: klaviyo_id ?? null,
      choice_1: choices[0],
      choice_2: choices[1],
      submitted_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
