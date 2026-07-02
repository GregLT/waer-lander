import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { fetchProfileDemographicByEmail, fireKlaviyoEventByEmail, subscribeToKlaviyo } from '@/lib/klaviyo'

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      q1_starter,
      q2_subscription,
      q2b_benefit,
      q3_cadence,
      q4_price_reaction,
      q4_bundle_shown,
      q5_text,
      ts,
    } = await req.json() as {
      email?: string | null
      q1_starter?: string
      q2_subscription?: string
      q2b_benefit?: string | null
      q3_cadence?: string
      q4_price_reaction?: string | null
      q4_bundle_shown?: string
      q5_text?: string | null
      ts?: number
    }

    if (!q1_starter || !q2_subscription || !q3_cadence) {
      return NextResponse.json({ ok: false, error: 'Please answer all required questions.' }, { status: 400 })
    }

    // Fetch customer_demographic from Klaviyo before writing — never throws
    const customer_demographic = email
      ? await fetchProfileDemographicByEmail(email)
      : 'Unknown'

    const { error } = await getSupabase().from('wardrobe_responses_v2').insert({
      email: email ?? null,
      customer_demographic,
      q1_starter,
      q2_subscription,
      q2b_benefit: q2b_benefit ?? null,
      q3_cadence,
      q4_price_reaction: q4_price_reaction ?? null,
      q4_bundle_shown: q4_bundle_shown ?? null,
      q5_text: q5_text ?? null,
      submitted_at: ts ? new Date(ts).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
    }

    if (email) {
      await Promise.allSettled([
        fireKlaviyoEventByEmail(email, 'Answered Wardrobe Survey', {
          q1_starter,
          q2_subscription,
          q2b_benefit: q2b_benefit ?? null,
          q3_cadence,
          q4_price_reaction: q4_price_reaction ?? null,
        }),
        subscribeToKlaviyo(email),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
