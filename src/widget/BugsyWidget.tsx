import React, { useState, useRef, useEffect, useCallback } from 'react';

// Types
interface BugsyConfig {
  apiUrl: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  greeting?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'visitor' | 'bugsy';
  timestamp: Date;
  imageUrl?: string;
}

interface FeedbackForm {
  title: string;
  type: 'BUG' | 'FEATURE' | 'FEEDBACK' | 'QUESTION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

// Inline styles (no global CSS pollution)
const createStyles = (primaryColor: string, position: 'bottom-right' | 'bottom-left') => {
  const isRight = position === 'bottom-right';
  return {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      position: 'fixed' as const,
      bottom: '20px',
      [isRight ? 'right' : 'left']: '20px',
      zIndex: 2147483647,
    },
    bubble: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: primaryColor,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      fontSize: '24px',
      color: '#fff',
    },
    window: {
      position: 'absolute' as const,
      bottom: '70px',
      [isRight ? 'right' : 'left']: '0',
      width: '380px',
      maxWidth: 'calc(100vw - 40px)',
      height: '520px',
      maxHeight: 'calc(100vh - 100px)',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      animation: 'bugsySlideIn 0.25s ease-out',
    },
    windowMobile: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      borderRadius: '0',
    },
    header: {
      backgroundColor: primaryColor,
      color: '#fff',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    },
    headerTitle: {
      fontWeight: '600' as const,
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    headerBtn: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '20px',
      padding: '4px 8px',
      borderRadius: '4px',
      opacity: 0.8,
    },
    messages: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    msgBubble: (isSender: boolean) => ({
      maxWidth: '80%',
      padding: '10px 14px',
      borderRadius: '12px',
      alignSelf: isSender ? 'flex-end' as const : 'flex-start' as const,
      backgroundColor: isSender ? primaryColor : '#f3f4f6',
      color: isSender ? '#fff' : '#1f2937',
      wordBreak: 'break-word' as const,
      fontSize: '14px',
    }),
    inputArea: {
      borderTop: '1px solid #e5e7eb',
      padding: '12px',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexShrink: 0,
    },
    textInput: {
      flex: 1,
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit',
      resize: 'none' as const,
    },
    sendBtn: {
      backgroundColor: primaryColor,
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 14px',
      cursor: 'pointer',
      fontWeight: '500' as const,
      fontSize: '14px',
      whiteSpace: 'nowrap' as const,
    },
    feedbackBtn: {
      background: 'none',
      border: `1px solid ${primaryColor}`,
      color: primaryColor,
      borderRadius: '8px',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500' as const,
      margin: '0 12px 12px',
      display: 'block',
    },
    form: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
      overflowY: 'auto' as const,
      flex: 1,
    },
    formLabel: {
      fontSize: '12px',
      fontWeight: '600' as const,
      color: '#374151',
      marginBottom: '4px',
      display: 'block',
    },
    formInput: {
      width: '100%',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
    },
    formSelect: {
      width: '100%',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit',
      backgroundColor: '#fff',
      boxSizing: 'border-box' as const,
    },
    formSubmit: {
      backgroundColor: primaryColor,
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
      cursor: 'pointer',
      fontWeight: '600' as const,
      fontSize: '14px',
    },
    uploadBtn: {
      background: 'none',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '6px 8px',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#6b7280',
      flexShrink: 0,
    },
    success: {
      padding: '24px',
      textAlign: 'center' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      gap: '12px',
    },
    imgPreview: {
      maxWidth: '200px',
      maxHeight: '150px',
      borderRadius: '8px',
      marginTop: '4px',
    },
  };
};

const BugsyWidget: React.FC<BugsyConfig> = ({ apiUrl, position = 'bottom-right', primaryColor = '#7c3aed', greeting }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm] = useState<FeedbackForm>({ title: '', type: 'BUG', priority: 'MEDIUM' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const s = createStyles(primaryColor, position);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const greetingMsg = greeting || "Hi! I'm Bugsy \u{1F41B} I can help you report bugs, request features, or give feedback. How can I help?";

  const ensureConversation = useCallback(async (): Promise<string> => {
    if (conversationId) return conversationId;
    const res = await fetch(`${apiUrl}/api/widget/conversation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorName: 'Visitor',
        visitorEmail: '',
        currentUrl: window.location.href,
        metadata: { userAgent: navigator.userAgent },
      }),
    });
    const data = await res.json();
    const id = data.conversation?.id || data.id || data.conversationId;
    setConversationId(id);
    // Load initial messages from server
    if (data.messages?.length) {
      setMessages(data.messages.map((m: { id: string; content: string; sender: string; createdAt: string }) => ({
        id: m.id,
        content: m.content,
        sender: m.sender === 'BUGSY' ? 'bugsy' : 'visitor',
        timestamp: new Date(m.createdAt),
      })));
    }
    return id;
  }, [apiUrl, conversationId]);

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{ id: 'greeting', content: greetingMsg, sender: 'bugsy', timestamp: new Date() }]);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), content: text, sender: 'visitor', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    try {
      const cid = await ensureConversation();
      const res = await fetch(`${apiUrl}/api/widget/conversation/${cid}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.bugsyMessage?.content || data.reply;
        if (reply) {
          setMessages(prev => [...prev, { id: data.bugsyMessage?.id || Date.now().toString() + 'r', content: reply, sender: 'bugsy', timestamp: new Date() }]);
        }
      }
    } catch { /* silently handle */ }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: tempId,
      content: `Uploading: ${file.name}...`,
      sender: 'visitor',
      timestamp: new Date(),
      imageUrl: localUrl,
    }]);

    try {
      const cid = await ensureConversation();
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${apiUrl}/api/widget/conversation/${cid}/screenshot`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        // Update message with server URL
        setMessages(prev => prev.map(m =>
          m.id === tempId
            ? { ...m, content: `Screenshot: ${file.name}`, imageUrl: `${apiUrl}${data.url}` }
            : m
        ));
      } else {
        setMessages(prev => prev.map(m =>
          m.id === tempId ? { ...m, content: `Screenshot: ${file.name} (upload failed)` } : m
        ));
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === tempId ? { ...m, content: `Screenshot: ${file.name} (upload failed)` } : m
      ));
    }
  };

  const submitFeedback = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const cid = await ensureConversation();
      const res = await fetch(`${apiUrl}/api/widget/conversation/${cid}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch { /* silently handle */ }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) {
    return (
      <div style={s.container}>
        <button style={s.bubble} onClick={handleOpen} onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.1)'; }} onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; }} aria-label="Open Bugsy">
          {'\u{1F41B}'}
        </button>
      </div>
    );
  }

  const windowStyle = isMobile ? { ...s.window, ...s.windowMobile } : s.window;

  return (
    <div style={s.container}>
      <div style={windowStyle}>
        {/* Header */}
        <div style={s.header}>
          <span style={s.headerTitle}>{'\u{1F41B}'} Bugsy</span>
          <button style={s.headerBtn} onClick={() => setOpen(false)} aria-label="Close">&times;</button>
        </div>

        {showSuccess ? (
          <div style={s.success}>
            <div style={{ fontSize: '48px' }}>{'\u2705'}</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Feedback Submitted!</div>
            <div style={{ color: '#6b7280' }}>Thank you for your feedback.</div>
          </div>
        ) : showForm ? (
          <>
            <div style={{ ...s.header, padding: '12px 16px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ fontWeight: '600', color: '#374151', fontSize: '14px' }}>Submit Feedback</span>
              <button style={{ ...s.headerBtn, color: '#6b7280' }} onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <div style={s.form}>
              <div>
                <label style={s.formLabel}>Title *</label>
                <input style={s.formInput} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Brief description..." />
              </div>
              <div>
                <label style={s.formLabel}>Type</label>
                <select style={s.formSelect} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as FeedbackForm['type'] }))}>
                  <option value="BUG">Bug</option>
                  <option value="FEATURE">Feature</option>
                  <option value="FEEDBACK">Feedback</option>
                  <option value="QUESTION">Question</option>
                </select>
              </div>
              <div>
                <label style={s.formLabel}>Priority</label>
                <select style={s.formSelect} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as FeedbackForm['priority'] }))}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <button style={s.formSubmit} onClick={submitFeedback} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Messages */}
            <div style={s.messages}>
              {messages.map(msg => (
                <div key={msg.id} style={s.msgBubble(msg.sender === 'visitor')}>
                  {msg.content}
                  {msg.imageUrl && <img src={msg.imageUrl} alt="Screenshot" style={s.imgPreview} />}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Feedback button */}
            <button style={s.feedbackBtn} onClick={() => setShowForm(true)}>
              {'\u{1F4DD}'} Submit Feedback
            </button>

            {/* Input */}
            <div style={s.inputArea}>
              <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
              <button style={s.uploadBtn} onClick={() => fileInputRef.current?.click()} title="Upload screenshot">{'\u{1F4F7}'}</button>
              <input style={s.textInput} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message..." />
              <button style={s.sendBtn} onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>

      {/* Minimize bubble when window is open */}
      <button style={{ ...s.bubble, width: '48px', height: '48px', fontSize: '20px' }} onClick={() => setOpen(false)} aria-label="Minimize Bugsy">
        {'\u{1F41B}'}
      </button>
    </div>
  );
};

export default BugsyWidget;
