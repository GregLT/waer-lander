/**
 * Backfills the `demographic` column on existing vote rows.
 * Fetches customer_demographic from Klaviyo for rows where demographic = 'Unknown'
 * and klaviyo_id is present. Writes 'Unknown' for any it can't resolve.
 *
 * Run with:
 *   KLAVIYO_API_KEY=pk_xxx npx tsx scripts/backfill-demographics.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uagrnylqcgqzkigvbljd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZ3JueWxxY2dxemtpZ3ZibGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTU1NjUsImV4cCI6MjA5ODEzMTU2NX0.I5enEek9KfwCXtILspzTqa6KUJRkAaY_a4aXSzdRjBE'
const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY

if (!KLAVIYO_API_KEY) {
  console.error('Set KLAVIYO_API_KEY env var before running this script.')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function fetchDemographic(klaviyoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://a.klaviyo.com/api/profiles/${klaviyoId}?fields[profile]=properties`,
      { headers: { Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`, revision: '2024-10-15' } }
    )
    if (!res.ok) return 'Unknown'
    const json = await res.json() as { data?: { attributes?: { properties?: { customer_demographic?: string } } } }
    return json?.data?.attributes?.properties?.customer_demographic ?? 'Unknown'
  } catch {
    return 'Unknown'
  }
}

async function main() {
  const { data: rows, error } = await sb
    .from('votes')
    .select('id, klaviyo_id')
    .eq('demographic', 'Unknown')
    .not('klaviyo_id', 'is', null)

  if (error) { console.error('Supabase fetch failed:', error); process.exit(1) }

  console.log(`Found ${rows?.length ?? 0} rows to backfill.`)

  let updated = 0, skipped = 0

  for (const row of rows ?? []) {
    const demographic = await fetchDemographic(row.klaviyo_id as string)
    const { error: updateError } = await sb
      .from('votes')
      .update({ demographic })
      .eq('id', row.id)

    if (updateError) {
      console.warn(`  ✗ ${row.id}: ${updateError.message}`)
      skipped++
    } else {
      console.log(`  ✓ ${row.id}: ${demographic}`)
      updated++
    }
  }

  console.log(`\nDone. ${updated} updated, ${skipped} failed.`)
}

main()
