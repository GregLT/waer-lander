'use client'

import { useEffect, useState } from 'react'

const LAUNCH = new Date('2026-09-01T00:00:00Z')

function getTimeLeft() {
  const diff = LAUNCH.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return { days, hours }
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="countdown-stat">
      <span className="signup-count-num">
        {time.days}
        <span className="countdown-unit">d</span>{' '}
        {time.hours}
        <span className="countdown-unit">h</span>
      </span>
      <span className="signup-count-lbl">Until launch</span>
    </div>
  )
}
