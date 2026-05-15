import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email =
    typeof body === 'object' && body !== null && 'email' in body
      ? (body as { email: unknown }).email
      : undefined

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 })
  }

  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (!apiKey || !listId) {
    console.error('[subscribe] KLAVIYO_API_KEY or KLAVIYO_LIST_ID not set')
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
  }

  const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      revision: '2024-10-15',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email,
                  subscriptions: {
                    email: {
                      marketing: { consent: 'SUBSCRIBED' },
                    },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: { type: 'list', id: listId },
          },
        },
      },
    }),
  })

  if (res.status === 202 || res.ok) {
    return NextResponse.json({ success: true })
  }

  let detail = 'Something went wrong.'
  try {
    const err = (await res.json()) as { errors?: Array<{ detail?: string; code?: string }> }
    const firstError = err.errors?.[0]
    // Already subscribed is still a success
    if (firstError?.code === 'duplicate_profile') {
      return NextResponse.json({ success: true })
    }
    detail = firstError?.detail ?? detail
  } catch { /* ignore */ }

  return NextResponse.json({ error: detail }, { status: 500 })
}
