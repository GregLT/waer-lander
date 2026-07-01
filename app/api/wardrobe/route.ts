import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { fireWardrobeSurveyEvent, subscribeProfileById } from '@/lib/klaviyo'

export async function POST(req: NextRequest) {
  try {
    const { klaviyo_id, q1_count, q2_cases, q3_subscription, q4_refill_frequency, ts } = await req.json() as {
      klaviyo_id?: string | null
      q1_count?: string
      q2_cases?: string
      q3_subscription?: string
      q4_refill_frequency?: string
      ts?: number
    }

    if (!q1_count || !q2_cases || !q3_subscription || !q4_refill_frequency) {
      return NextResponse.json({ ok: false, error: 'All four questions required.' }, { status: 400 })
    }

    const { error } = await getSupabase().from('wardrobe_responses').insert({
      klaviyo_id: klaviyo_id ?? 'Unknown',
      q1_count,
      q2_cases,
      q3_subscription,
      q4_refill_frequency,
      submitted_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
    }

    if (klaviyo_id) {
      await Promise.allSettled([
        fireWardrobeSurveyEvent(klaviyo_id, { q1_count, q2_cases, q3_subscription, q4_refill_frequency }),
        subscribeProfileById(klaviyo_id),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
