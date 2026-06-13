import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'

export default function StrokeAnimation({ hanzi }) {
  const containerRef = useRef(null)
  const writerRefs = useRef([])

  useEffect(() => {
    if (!hanzi || !containerRef.current) return

    const container = containerRef.current
    container.innerHTML = ''
    writerRefs.current = []

    const chars = Array.from(hanzi)

    chars.forEach((char) => {
      const div = document.createElement('div')
      div.style.display = 'inline-block'
      div.style.margin = '0 5px'
      container.appendChild(div)

      const writer = HanziWriter.create(div, char, {
        width: 150,
        height: 150,
        padding: 5,
        showOutline: true,
        strokeColor: '#1e293b',
        outlineColor: '#e2e8f0',
        drawingColor: '#6366f1',
        animationSpeed: 1,
        delayBetweenStrokes: 300,
      })
      writerRefs.current.push(writer)
    })

    async function animateAll() {
      for (const writer of writerRefs.current) {
        await new Promise(resolve => writer.animateCharacter({ onComplete: resolve }))
      }
    }
    animateAll()

    return () => {
      container.innerHTML = ''
    }
  }, [hanzi])

  function handleReplay() {
    async function animateAll() {
      for (const writer of writerRefs.current) {
        await new Promise(resolve => writer.animateCharacter({ onComplete: resolve }))
      }
    }
    animateAll()
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div ref={containerRef} style={{ margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} />
      <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button type="button" className="btn-ghost" onClick={handleReplay}>Phát lại</button>
      </div>
    </div>
  )
}
