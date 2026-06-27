import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { fireVoteEvent, subscribeProfileToList } from '@/lib/klaviyo'

export async function POST(req: NextRequest) {
  try {
    const { klaviyo_id, choices, feedback, ts } = await req.json() as {
      klaviyo_id?: string
      choices?: string[]
      feedback?: string | null
      ts?: number
    }

    if (!choices || choices.length !== 3) {
      return NextResponse.json({ ok: false, error: 'Select exactly three.' }, { status: 400 })
    }

    const { error } = await getSupabase().from('votes').insert({
      klaviyo_id: klaviyo_id ?? null,
      choice_1: choices[0],
      choice_2: choices[1],
      choice_3: choices[2],
      feedback: feedback ?? null,
      submitted_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
    }

    if (klaviyo_id) {
      await Promise.allSettled([
        fireVoteEvent(klaviyo_id, choices),
        subscribeProfileToList(klaviyo_id),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
