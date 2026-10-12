import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { respondent_id, ...rest } = body

    if (!respondent_id || typeof respondent_id !== 'string') {
      return NextResponse.json({ error: 'missing respondent_id' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('survey_responses')
      .upsert(
        { respondent_id, ...rest, updated_at: new Date().toISOString() },
        { onConflict: 'respondent_id' }
      )

    if (error) {
      console.error('survey upsert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('survey route error:', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
