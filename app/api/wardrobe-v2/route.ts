import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { fireKlaviyoEventById, subscribeProfileById } from '@/lib/klaviyo'

export async function POST(req: NextRequest) {
  try {
    const {
      klaviyo_id,
      q1_starter,
      q2_subscription,
      q2b_benefit,
      q3_cadence,
      q4_price_reaction,
      q4_bundle_shown,
      q5_text,
      ts,
    } = await req.json() as {
      klaviyo_id?: string | null
      q1_starter?: string
      q2_subscription?: string
      q2b_benefit?: string | null
      q3_cadence?: string
      q4_price_reaction?: string
      q4_bundle_shown?: string
      q5_text?: string | null
      ts?: number
    }

    if (!q1_starter || !q2_subscription || !q3_cadence || !q4_price_reaction) {
      return NextResponse.json({ ok: false, error: 'Please answer all required questions.' }, { status: 400 })
    }

    const { error } = await getSupabase().from('wardrobe_responses_v2').insert({
      klaviyo_id: klaviyo_id ?? 'Unknown',
      q1_starter,
      q2_subscription,
      q2b_benefit: q2b_benefit ?? null,
      q3_cadence,
      q4_price_reaction,
      q4_bundle_shown: q4_bundle_shown ?? null,
      q5_text: q5_text ?? null,
      submitted_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
    }

    if (klaviyo_id) {
      await Promise.allSettled([
        fireKlaviyoEventById(klaviyo_id, 'Answered Wardrobe Survey', {
          q1_starter,
          q2_subscription,
          q2b_benefit: q2b_benefit ?? null,
          q3_cadence,
          q4_price_reaction,
        }),
        subscribeProfileById(klaviyo_id),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
