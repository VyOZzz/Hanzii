import { useState, useRef, useEffect } from 'react'
import { chatWithAITutor } from '../api'
import './AITutorWidget.css'

export default function AITutorWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Chào bạn! Mình là Hanzii, gia sư tiếng Trung AI của bạn. Bạn muốn luyện tập giao tiếp hay có câu hỏi gì về tiếng Trung không?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setIsLoading(true)

    try {
      const response = await chatWithAITutor(userMessage)
      setMessages((prev) => [...prev, { role: 'ai', text: response }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Xin lỗi, Hanzii đang gặp chút sự cố kết nối. Bạn vui lòng cấu hình API Key hoặc thử lại sau nhé!' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`ai-tutor-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="ai-tutor-fab bounce-animation" onClick={() => setIsOpen(true)}>
          <span className="ai-tutor-icon">✨</span>
          <span className="ai-tutor-tooltip">Gia sư AI</span>
        </button>
      )}

      {isOpen && (
        <div className="ai-tutor-window">
          <div className="ai-tutor-header">
            <div className="ai-tutor-header-title">
              <span className="ai-tutor-icon">✨</span> Gia sư AI Hanzii
            </div>
            <button className="ai-tutor-close" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="ai-tutor-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-message-row ${msg.role}`}>
                {msg.role === 'ai' && <div className="ai-avatar">H</div>}
                <div className={`ai-message-bubble ${msg.role}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-message-row ai">
                <div className="ai-avatar">H</div>
                <div className="ai-message-bubble ai loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-tutor-input-area">
            <input
              type="text"
              placeholder="Nhập tiếng Việt hoặc tiếng Trung..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button className="ai-send-btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
