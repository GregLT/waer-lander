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
          list_id: listId,
          subscriptions: [
            {
              channels: { email: ['MARKETING'] },
              email,
            },
          ],
        },
      },
    }),
  })

  if (!res.ok) {
    let detail = 'Klaviyo error'
    try {
      const err = await res.json() as { errors?: Array<{ detail?: string }> }
      detail = err.errors?.[0]?.detail ?? detail
    } catch { /* ignore */ }
    throw new Error(detail)
  }
}
