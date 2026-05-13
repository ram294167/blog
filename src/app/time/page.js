export default async function TimePage() {
  let currentTime = 'Unavailable'

  try {
    const timeRequest = await fetch('https://worldtimeapi.org/api/timezone/UTC', {
      next: { revalidate: 10 },
    })
    if (!timeRequest.ok) {
      throw new Error(`Time API response ${timeRequest.status}`)
    }
    const time = await timeRequest.json()
    currentTime = time?.datetime || 'Unavailable'
  } catch (error) {
    console.error('Time fetch failed:', error)
  }

  return <div>Current timestamp: {currentTime}</div>
}
