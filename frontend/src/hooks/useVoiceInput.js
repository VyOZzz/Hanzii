import { useMemo, useState } from 'react'

export default function useVoiceInput(lang = 'zh-CN') {
  const [listening, setListening] = useState(false)
  const [supported] = useState(() => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition))

  const RecognitionClass = useMemo(() => window.SpeechRecognition || window.webkitSpeechRecognition, [])

  async function startListening({ onResult, onError }) {
    if (!RecognitionClass) {
      onError?.(new Error('Trình duyệt không hỗ trợ nhập giọng nói'))
      return
    }

    const recognition = new RecognitionClass()
    recognition.lang = lang
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = (event) => {
      setListening(false)
      onError?.(new Error(event.error || 'Không thể nhận diện giọng nói'))
    }
    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || ''
      onResult?.(transcript)
    }

    recognition.start()
  }

  return {
    listening,
    supported,
    startListening,
  }
}
