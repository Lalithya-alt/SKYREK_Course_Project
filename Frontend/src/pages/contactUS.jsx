import React, { useState } from 'react';
import api from '../Utils/api';

// ─── Sample Contact Info Data ───────────────────────────────────────────────
const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8a16 16 0 006.91 6.91l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    label: 'Phone',
    value: '+94 77 123 4567',
    sub: 'Mon–Fri, 9am – 6pm',
    bg: 'rgba(29,78,216,0.08)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'support@digitalmart.lk',
    sub: 'We reply within 24 hours',
    bg: 'rgba(37,99,235,0.08)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Address',
    value: '42 Galle Road, Colombo 03',
    sub: 'Sri Lanka',
    bg: 'rgba(30,64,175,0.08)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: 'Business Hours',
    value: 'Mon – Sat: 9am – 7pm',
    sub: 'Sunday: 10am – 4pm',
    bg: 'rgba(29,78,216,0.08)',
  },
];

const categories = ['General', 'Bug Report', 'Feature Request', 'Compliment', 'Other'];

// ─── Star Rating Component ────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="cu-star-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`cu-star${(hovered || value) >= star ? ' cu-star--active' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          &#9733;
        </button>
      ))}
      {value > 0 && (
        <span className="cu-star-label">
          {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][value]}
        </span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContactUS() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General',
    rating: 0,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message') setCharCount(value.length);
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRating = (val) => setForm((prev) => ({ ...prev, rating: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/feedback', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', category: 'General', rating: 0, message: '' });
      setCharCount(0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        /* ── Base ─────────────────────────────── */
        .cu-page {
          min-height: 100%;
          width: 100%;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 30%, #ffffff 60%, #eff6ff 100%);
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Animated Blobs ───────────────────── */
        .cu-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.22;
          pointer-events: none;
          z-index: 0;
        }
        .cu-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #3b82f6, #1d4ed8);
          top: -120px; left: -120px;
          animation: cu-float1 9s ease-in-out infinite alternate;
        }
        .cu-blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #60a5fa, #2563eb);
          bottom: -100px; right: -80px;
          animation: cu-float2 11s ease-in-out infinite alternate;
        }
        .cu-blob-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, #93c5fd, #bfdbfe);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: cu-float3 13s ease-in-out infinite alternate;
        }
        @keyframes cu-float1 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(40px,-50px) scale(1.08); }
        }
        @keyframes cu-float2 {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(-30px,30px) scale(0.95); }
        }
        @keyframes cu-float3 {
          0%   { transform: translate(-50%,-50%) scale(1); }
          100% { transform: translate(-48%,-54%) scale(1.1); }
        }

        /* ── Page Content ─────────────────────── */
        .cu-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px 80px;
        }

        /* ── Hero ─────────────────────────────── */
        .cu-hero { text-align: center; margin-bottom: 64px; }
        .cu-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(29,78,216,0.1));
          border: 1px solid rgba(59,130,246,0.3);
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 7px 18px;
          border-radius: 100px;
          margin-bottom: 20px;
          backdrop-filter: blur(8px);
        }
        .cu-badge-dot {
          width: 7px; height: 7px;
          background: #3b82f6;
          border-radius: 50%;
          animation: cu-pulse-dot 1.8s ease-in-out infinite;
        }
        @keyframes cu-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
        .cu-hero-title {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 16px;
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #2563eb 70%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        .cu-hero-title .cu-title-accent {
          background: linear-gradient(135deg, #60a5fa, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cu-hero-sub {
          font-size: 1.05rem;
          color: #4b5563;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .cu-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 24px auto 0;
          max-width: 200px;
        }
        .cu-divider-line {
          flex: 1; height: 2px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          border-radius: 2px;
        }
        .cu-divider-diamond {
          width: 8px; height: 8px;
          background: #2563eb;
          transform: rotate(45deg);
          border-radius: 2px;
        }

        /* ── Grid Layout ──────────────────────── */
        .cu-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .cu-grid { grid-template-columns: 1fr; }
        }

        /* ── Contact Cards ────────────────────── */
        .cu-cards-col { display: flex; flex-direction: column; gap: 16px; }
        .cu-card {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(147,197,253,0.4);
          border-radius: 20px;
          padding: 22px 24px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          backdrop-filter: blur(12px);
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          cursor: default;
        }
        .cu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(37,99,235,0.12);
          border-color: rgba(59,130,246,0.5);
        }
        .cu-card-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .cu-card:hover .cu-card-icon { transform: scale(1.1) rotate(-5deg); }
        .contact-icon-svg { width: 22px; height: 22px; stroke: #1d4ed8; }
        .cu-card-body { flex: 1; }
        .cu-card-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .cu-card-value { font-size: 0.95rem; font-weight: 700; color: #1e3a8a; margin-bottom: 3px; }
        .cu-card-sub { font-size: 0.8rem; color: #6b7280; }

        /* ── Map Placeholder ──────────────────── */
        .cu-map {
          margin-top: 4px;
          background: linear-gradient(135deg, rgba(219,234,254,0.6), rgba(191,219,254,0.4));
          border: 1px solid rgba(147,197,253,0.4);
          border-radius: 20px;
          height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
        }
        .cu-map-rings { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .cu-map-ring {
          position: absolute;
          border: 2px solid rgba(59,130,246,0.2);
          border-radius: 50%;
          animation: cu-expand 3s ease-out infinite;
        }
        .cu-map-ring:nth-child(2) { animation-delay: 1s; }
        .cu-map-ring:nth-child(3) { animation-delay: 2s; }
        @keyframes cu-expand {
          0% { width: 20px; height: 20px; opacity: 1; }
          100% { width: 140px; height: 140px; opacity: 0; }
        }
        .cu-map-pin {
          font-size: 28px; z-index: 1;
          filter: drop-shadow(0 4px 8px rgba(37,99,235,0.3));
          animation: cu-pin-bounce 2s ease-in-out infinite;
        }
        @keyframes cu-pin-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .cu-map-text { font-size: 0.82rem; color: #3b82f6; font-weight: 600; z-index: 1; }

        /* ── Form Panel ───────────────────────── */
        .cu-form-panel {
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(147,197,253,0.35);
          border-radius: 28px;
          padding: 44px 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 72px rgba(37,99,235,0.08), 0 2px 8px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
        }
        .cu-form-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa, #3b82f6, #1d4ed8);
          background-size: 200% 100%;
          animation: cu-shimmer 3s linear infinite;
        }
        @keyframes cu-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 600px) {
          .cu-form-panel { padding: 28px 20px; }
        }
        .cu-form-title {
          font-size: 1.45rem; font-weight: 800; color: #1e3a8a;
          margin: 0 0 6px; letter-spacing: -0.02em;
        }
        .cu-form-subtitle { font-size: 0.88rem; color: #6b7280; margin: 0 0 32px; line-height: 1.6; }

        /* ── Form Fields ──────────────────────── */
        .cu-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 560px) { .cu-form-row { grid-template-columns: 1fr; } }
        .cu-field { margin-bottom: 18px; position: relative; }
        .cu-label {
          display: block;
          font-size: 0.8rem; font-weight: 700; color: #374151;
          margin-bottom: 7px; letter-spacing: 0.5px; text-transform: uppercase;
        }
        .cu-label-req { color: #ef4444; margin-left: 2px; }
        .cu-input, .cu-select, .cu-textarea {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid rgba(147,197,253,0.6);
          border-radius: 12px;
          background: rgba(255,255,255,0.8);
          font-size: 0.92rem;
          color: #1e3a8a;
          font-family: inherit;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          outline: none;
          box-sizing: border-box;
        }
        .cu-input::placeholder, .cu-textarea::placeholder { color: #9ca3af; }
        .cu-input:focus, .cu-select:focus, .cu-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
          background: #fff;
        }
        .cu-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
        .cu-select {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 42px;
        }
        .cu-char-count {
          position: absolute; bottom: -20px; right: 4px;
          font-size: 0.72rem; color: #9ca3af;
        }
        .cu-char-count.warn { color: #f59e0b; }

        /* ── Stars ────────────────────────────── */
        .cu-star-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .cu-star {
          font-size: 1.8rem; color: #d1d5db;
          background: none; border: none;
          cursor: pointer;
          transition: color 0.18s, transform 0.18s;
          line-height: 1; padding: 2px;
        }
        .cu-star--active { color: #f59e0b; }
        .cu-star:hover { transform: scale(1.25); }
        .cu-star-label { font-size: 0.82rem; font-weight: 700; color: #2563eb; margin-left: 4px; }

        /* ── Submit Button ────────────────────── */
        .cu-submit-btn {
          width: 100%;
          padding: 15px 24px;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
          color: white; border: none; border-radius: 14px;
          font-size: 1rem; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: transform 0.25s, box-shadow 0.25s, opacity 0.25s;
          position: relative; overflow: hidden;
          letter-spacing: 0.3px;
          margin-top: 8px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .cu-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(37,99,235,0.35);
        }
        .cu-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .cu-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .cu-submit-btn::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: cu-btn-shine 2.5s linear infinite;
        }
        @keyframes cu-btn-shine { to { left: 160%; } }

        /* ── Spinner ──────────────────────────── */
        .cu-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: cu-spin 0.7s linear infinite;
        }
        @keyframes cu-spin { to { transform: rotate(360deg); } }

        /* ── Alerts ───────────────────────────── */
        .cu-alert {
          padding: 14px 18px; border-radius: 12px;
          font-size: 0.88rem; font-weight: 600;
          margin-bottom: 20px;
          display: flex; align-items: flex-start; gap: 10px;
          animation: cu-slide-in 0.3s ease;
        }
        @keyframes cu-slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cu-alert-error {
          background: rgba(254,202,202,0.5);
          border: 1px solid rgba(239,68,68,0.3); color: #b91c1c;
        }

        /* ── Success State ────────────────────── */
        .cu-success-panel {
          text-align: center; padding: 48px 24px;
          animation: cu-pop 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes cu-pop {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .cu-success-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          font-size: 30px;
          box-shadow: 0 12px 36px rgba(37,99,235,0.35);
        }
        .cu-success-title { font-size: 1.5rem; font-weight: 800; color: #1e3a8a; margin: 0 0 8px; }
        .cu-success-text { color: #4b5563; font-size: 0.95rem; margin: 0 0 28px; line-height: 1.6; }
        .cu-back-btn {
          display: inline-block; padding: 12px 28px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: white; border: none; border-radius: 12px;
          font-size: 0.9rem; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cu-back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(37,99,235,0.3);
        }

        /* ── Separator ────────────────────────── */
        .cu-separator { display: flex; align-items: center; gap: 16px; margin: 56px 0 40px; }
        .cu-separator-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent);
        }
        .cu-separator-text {
          font-size: 0.78rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 3px; color: #93c5fd;
          white-space: nowrap;
        }

        /* ── FAQ ──────────────────────────────── */
        .cu-faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
        .cu-faq-card {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(147,197,253,0.35);
          border-radius: 18px; padding: 24px;
          backdrop-filter: blur(10px);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .cu-faq-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(37,99,235,0.1);
        }
        .cu-faq-q { font-size: 0.92rem; font-weight: 700; color: #1e3a8a; margin-bottom: 8px; }
        .cu-faq-a { font-size: 0.83rem; color: #6b7280; line-height: 1.6; }
      `}</style>

      <div className="cu-page">
        <div className="cu-blob cu-blob-1" />
        <div className="cu-blob cu-blob-2" />
        <div className="cu-blob cu-blob-3" />

        <div className="cu-content">
          {/* Hero */}
          <div className="cu-hero">
            <div className="cu-badge">
              <span className="cu-badge-dot" />
              We are here to help
            </div>
            <h1 className="cu-hero-title">
              Get in <span className="cu-title-accent">Touch</span> With Us
            </h1>
            <p className="cu-hero-sub">
              Have a question, suggestion, or want to share your experience?
              We would love to hear from you. Our team typically responds within 24 hours.
            </p>
            <div className="cu-divider">
              <div className="cu-divider-line" />
              <div className="cu-divider-diamond" />
              <div className="cu-divider-line" />
            </div>
          </div>

          {/* Main Grid */}
          <div className="cu-grid">
            {/* Left — Contact Cards */}
            <div className="cu-cards-col">
              {contactInfo.map((item, i) => (
                <div className="cu-card" key={i}>
                  <div className="cu-card-icon" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <div className="cu-card-body">
                    <div className="cu-card-label">{item.label}</div>
                    <div className="cu-card-value">{item.value}</div>
                    <div className="cu-card-sub">{item.sub}</div>
                  </div>
                </div>
              ))}

              {/* Animated Map Placeholder */}
              <div className="cu-map">
                <div className="cu-map-rings">
                  <div className="cu-map-ring" />
                  <div className="cu-map-ring" />
                  <div className="cu-map-ring" />
                </div>
                <div className="cu-map-pin">&#128205;</div>
                <div className="cu-map-text">42 Galle Road, Colombo 03, Sri Lanka</div>
              </div>
            </div>

            {/* Right — Feedback Form */}
            <div className="cu-form-panel">
              {success ? (
                <div className="cu-success-panel">
                  <div className="cu-success-icon">&#10003;</div>
                  <h2 className="cu-success-title">Feedback Received!</h2>
                  <p className="cu-success-text">
                    Thank you for sharing your thoughts with us.<br />
                    Our team will review your message shortly.
                  </p>
                  <button className="cu-back-btn" onClick={() => setSuccess(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="cu-form-title">Share Your Feedback</h2>
                  <p className="cu-form-subtitle">
                    We read every message carefully and use your input to make Digital Mart better.
                  </p>

                  {error && (
                    <div className="cu-alert cu-alert-error">
                      <span>&#9888;</span> {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="cu-form-row">
                      <div className="cu-field">
                        <label className="cu-label" htmlFor="cu-name">
                          Full Name <span className="cu-label-req">*</span>
                        </label>
                        <input
                          id="cu-name"
                          className="cu-input"
                          type="text"
                          name="name"
                          placeholder="John Silva"
                          value={form.name}
                          onChange={handleChange}
                          maxLength={100}
                        />
                      </div>
                      <div className="cu-field">
                        <label className="cu-label" htmlFor="cu-email">
                          Email Address <span className="cu-label-req">*</span>
                        </label>
                        <input
                          id="cu-email"
                          className="cu-input"
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="cu-form-row">
                      <div className="cu-field">
                        <label className="cu-label" htmlFor="cu-subject">
                          Subject <span className="cu-label-req">*</span>
                        </label>
                        <input
                          id="cu-subject"
                          className="cu-input"
                          type="text"
                          name="subject"
                          placeholder="Your subject..."
                          value={form.subject}
                          onChange={handleChange}
                          maxLength={200}
                        />
                      </div>
                      <div className="cu-field">
                        <label className="cu-label" htmlFor="cu-category">
                          Category
                        </label>
                        <select
                          id="cu-category"
                          className="cu-select"
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="cu-field" style={{ marginBottom: '22px' }}>
                      <label className="cu-label">Overall Rating</label>
                      <StarRating value={form.rating} onChange={handleRating} />
                    </div>

                    <div className="cu-field" style={{ marginBottom: '36px' }}>
                      <label className="cu-label" htmlFor="cu-message">
                        Your Message <span className="cu-label-req">*</span>
                      </label>
                      <textarea
                        id="cu-message"
                        className="cu-textarea"
                        name="message"
                        placeholder="Tell us what is on your mind — we would love to hear your thoughts, ideas, or any issues you have faced..."
                        value={form.message}
                        onChange={handleChange}
                        maxLength={2000}
                        rows={5}
                      />
                      <span className={`cu-char-count${charCount > 1800 ? ' warn' : ''}`}>
                        {charCount}/2000
                      </span>
                    </div>

                    <button
                      id="cu-submit-btn"
                      type="submit"
                      className="cu-submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="cu-spinner" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <span>&#128640;</span>
                          Send Feedback
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="cu-separator">
            <div className="cu-separator-line" />
            <div className="cu-separator-text">Frequently Asked Questions</div>
            <div className="cu-separator-line" />
          </div>

          <div className="cu-faq-grid">
            {[
              {
                q: 'How long does delivery take?',
                a: 'Standard delivery takes 3–5 business days. Express delivery options are available at checkout.',
              },
              {
                q: 'Can I return a product?',
                a: 'Yes! We offer a hassle-free 14-day return policy on all items. Visit My Orders to initiate a return.',
              },
              {
                q: 'Is my payment information secure?',
                a: 'Absolutely. We use end-to-end encryption and never store your raw card details on our servers.',
              },
              {
                q: 'How do I track my order?',
                a: 'Once your order ships, you will receive a tracking link by email and can check "My Orders" page.',
              },
            ].map((faq, i) => (
              <div className="cu-faq-card" key={i}>
                <div className="cu-faq-q">&#10067; {faq.q}</div>
                <div className="cu-faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
