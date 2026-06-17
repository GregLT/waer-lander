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
