import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { fireVoteEvent, subscribeToKlaviyo, fetchProfileDemographicByEmail } from '@/lib/klaviyo'

export async function POST(req: NextRequest) {
  try {
    const { klaviyo_id, email, choices, feedback, ts } = await req.json() as {
      klaviyo_id?: string | null
      email?: string | null
      choices?: string[]
      feedback?: string | null
      ts?: number
    }

    if (!choices || choices.length !== 3) {
      return NextResponse.json({ ok: false, error: 'Select exactly three.' }, { status: 400 })
    }

    // Fetch demographic if we have an email; never throws — falls back to 'Unknown'
    const demographic = email
      ? await fetchProfileDemographicByEmail(email)
      : 'Unknown'

    const { error } = await getSupabase().from('votes').insert({
      klaviyo_id: klaviyo_id ?? null,
      choice_1: choices[0],
      choice_2: choices[1],
      choice_3: choices[2],
      feedback: feedback ?? null,
      demographic,
      submitted_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
    }

    if (email) {
      await Promise.allSettled([
        fireVoteEvent(email, choices),
        subscribeToKlaviyo(email),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
