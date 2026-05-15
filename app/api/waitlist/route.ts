import { NextRequest, NextResponse } from 'next/server'
import { subscribeToKlaviyo } from '@/lib/klaviyo'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const email =
    typeof body === 'object' && body !== null && 'email' in body
      ? (body as { email: unknown }).email
      : undefined

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Valid email required.' }, { status: 400 })
  }

  try {
    await subscribeToKlaviyo(email)

    let position = 1285

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
        )
        await supabase
          .from('waitlist_signups')
          .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })
        const { count } = await supabase
          .from('waitlist_signups')
          .select('*', { count: 'exact', head: true })
        if (count != null) position = count
      } catch (err) {
        console.error('[supabase] non-fatal error:', err)
      }
    }

    return NextResponse.json({ ok: true, position })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
