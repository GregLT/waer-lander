function klaviyoHeaders(apiKey: string) {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    revision: '2024-10-15',
    'Content-Type': 'application/json',
  }
}

export async function fetchProfileDemographic(klaviyoId: string): Promise<string> {
  const apiKey = process.env.KLAVIYO_API_KEY
  if (!apiKey) return 'Unknown'

  try {
    const res = await fetch(
      `https://a.klaviyo.com/api/profiles/${klaviyoId}?fields[profile]=properties`,
      { headers: { Authorization: `Klaviyo-API-Key ${apiKey}`, revision: '2024-10-15' } }
    )
    if (!res.ok) return 'Unknown'
    const json = await res.json() as { data?: { attributes?: { properties?: { customer_demographic?: string } } } }
    return json?.data?.attributes?.properties?.customer_demographic ?? 'Unknown'
  } catch {
    return 'Unknown'
  }
}

export async function fireVoteEvent(klaviyoId: string, choices: string[]): Promise<void> {
  const apiKey = process.env.KLAVIYO_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') { console.warn('[klaviyo] KLAVIYO_API_KEY not set'); return }
    throw new Error('Klaviyo not configured.')
  }

  const res = await fetch('https://a.klaviyo.com/api/events/', {
    method: 'POST',
    headers: klaviyoHeaders(apiKey),
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          metric: { data: { type: 'metric', attributes: { name: 'Voted for Case' } } },
          profile: { data: { type: 'profile', id: klaviyoId } },
          properties: {
            choice_1: choices[0],
            choice_2: choices[1],
            choice_3: choices[2],
          },
        },
      },
    }),
  })

  if (res.status === 202 || res.ok) return
  console.error('[klaviyo] fireVoteEvent failed', res.status, await res.text())
}

export async function subscribeProfileToList(klaviyoId: string): Promise<void> {
  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID
  if (!apiKey || !listId) {
    if (process.env.NODE_ENV === 'development') { console.warn('[klaviyo] env vars not set'); return }
    throw new Error('Klaviyo not configured.')
  }

  const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
    method: 'POST',
    headers: klaviyoHeaders(apiKey),
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [{
              type: 'profile',
              id: klaviyoId,
              attributes: {
                subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
              },
            }],
          },
        },
        relationships: { list: { data: { type: 'list', id: listId } } },
      },
    }),
  })

  if (res.status === 202 || res.ok) return
  console.error('[klaviyo] subscribeProfileToList failed', res.status, await res.text())
}

export async function subscribeToKlaviyo(email: string): Promise<void> {
  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (!apiKey || !listId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[klaviyo] env vars not set — skipping in dev')
      return
    }
    throw new Error('Klaviyo not configured.')
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

  if (res.status === 202 || res.ok) return

  let detail = 'Klaviyo error'
  try {
    const err = await res.json() as { errors?: Array<{ detail?: string; code?: string }> }
    const firstError = err.errors?.[0]
    if (firstError?.code === 'duplicate_profile') return
    detail = firstError?.detail ?? detail
  } catch { /* ignore */ }
  throw new Error(detail)
}
