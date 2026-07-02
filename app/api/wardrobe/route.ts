import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { fetchProfileDemographicByEmail, fireKlaviyoEventByEmail, subscribeToKlaviyo } from '@/lib/klaviyo'

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      q1_starter,
      q2_subscription,
      q3_cadence,
      q3_buy_timing,
      q4_price_reaction,
      q4_bundle_shown,
      q5_purchase_intent,
      q5_text,
      survey_version,
      ts,
    } = await req.json() as {
      email?: string | null
      q1_starter?: string
      q2_subscription?: string
      q3_cadence?: string | null
      q3_buy_timing?: string | null
      q4_price_reaction?: string | null
      q4_bundle_shown?: string
      q5_purchase_intent?: string | null
      q5_text?: string | null
      survey_version?: string
      ts?: number
    }

    if (!q1_starter || !q2_subscription || (!q3_cadence && !q3_buy_timing) || !q5_purchase_intent) {
      return NextResponse.json({ ok: false, error: 'Please answer all required questions.' }, { status: 400 })
    }

    const customer_demographic = email
      ? await fetchProfileDemographicByEmail(email)
      : 'Unknown'

    const { error } = await getSupabase().from('wardrobe_responses_v2').insert({
      email: email ?? null,
      customer_demographic,
      q1_starter,
      q2_subscription,
      q3_cadence: q3_cadence ?? null,
      q3_buy_timing: q3_buy_timing ?? null,
      q4_price_reaction: q4_price_reaction ?? null,
      q4_bundle_shown: q4_bundle_shown ?? null,
      q5_purchase_intent: q5_purchase_intent ?? null,
      q5_text: q5_text ?? null,
      survey_version: survey_version ?? null,
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
          q3_cadence: q3_cadence ?? null,
          q3_buy_timing: q3_buy_timing ?? null,
          q4_price_reaction: q4_price_reaction ?? null,
          q5_purchase_intent: q5_purchase_intent ?? null,
        }),
        subscribeToKlaviyo(email),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 })
  }
}
