import React, { useState } from 'react';
import { Edit3, CheckCircle, Sparkles, Heart, BookOpen, Star } from 'lucide-react';

const MOOD_OPTIONS = [
  { id: 'comfort', label: '🌿 편안함' },
  { id: 'touching', label: '🔥 깊은 감동' },
  { id: 'lingering', label: '💭 깊은 여운' },
  { id: 'wisdom', label: '💡 삶의 지혜' },
  { id: 'healing', label: '☕ 조용한 힐링' },
  { id: 'thrilling', label: '⚡ 흥미진진' },
  { id: 'night', label: '🌙 밤에 읽기 좋은' },
  { id: 'realization', label: '✨ 새로운 깨달음' },
  { id: 'heartbeat', label: '💘 가슴 설레는' },
  { id: 'philosophical', label: '🌌 철학적 사색' }
];

function cleanHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>?/g, '');
}

export default function ReviewBackSide({ book, onSaveReview, currentReview }) {
  const [reviewText, setReviewText] = useState(currentReview?.text || '');
  const [quoteText, setQuoteText] = useState(
    cleanHtmlEntities(currentReview?.quote || book?.keyQuote || book?.oneLiner || '')
  );
  const [rating, setRating] = useState(currentReview?.rating || 5);
  
  // Multi-select reading mood array
  const [selectedMoods, setSelectedMoods] = useState(
    Array.isArray(currentReview?.moods)
      ? currentReview.moods
      : currentReview?.mood
      ? [currentReview.mood]
      : ['touching', 'comfort']
  );
  
  const [savedStatus, setSavedStatus] = useState(false);

  const toggleMood = (moodId) => {
    if (selectedMoods.includes(moodId)) {
      // Remove if already selected
      setSelectedMoods(selectedMoods.filter(id => id !== moodId));
    } else {
      // Add if under max 4
      if (selectedMoods.length < 4) {
        setSelectedMoods([...selectedMoods, moodId]);
      }
    }
  };

  const handleSave = () => {
    onSaveReview({
      text: reviewText,
      quote: quoteText,
      rating: rating,
      moods: selectedMoods,
      updatedAt: new Date().toLocaleDateString('ko-KR')
    });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  return (
    <div className="receipt-backside-container" style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      {/* Backside Header */}
      <div className="backside-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1.5px dashed #c9c3b4',
        paddingBottom: '12px'
      }}>
        <div className="backside-title-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} style={{ color: '#059669' }} />
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1c1b18' }}>독서 영수증 기록장</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#736e63', fontWeight: 600 }}>
          {new Date().toLocaleDateString('ko-KR')}
        </span>
      </div>

      {/* Quote / Transcribe Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>
          <Sparkles size={16} />
          <span>인상 깊은 문장 (필사)</span>
        </div>
        <textarea
          rows={3}
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder="책 속 맘에 드는 구절을 자유롭게 기록해 보세요..."
          style={{
            width: '100%',
            background: '#fefce8',
            border: '1px solid #fef08a',
            borderLeft: '4px solid #059669',
            borderRadius: '12px',
            padding: '12px 14px',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.92rem',
            lineHeight: '1.55',
            color: '#1c1b18',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      {/* 500-Character Review Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>
            <Heart size={16} />
            <span>나만의 500자 독서 감상평</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#736e63', fontWeight: 600 }}>
            {reviewText.length} / 500자
          </span>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="이 책이 나에게 준 감동과 생각을 담백하게 기록해 보세요 (최대 500자)..."
          style={{
            width: '100%',
            background: '#ffffff',
            border: '1.5px solid #c9c3b4',
            borderRadius: '12px',
            padding: '12px 14px',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.92rem',
            lineHeight: '1.55',
            color: '#1c1b18',
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      {/* MULTI-SELECT STAR RATING & READING MOOD SELECTOR */}
      <div style={{
        background: '#fefce8',
        border: '1px solid #fef08a',
        padding: '14px 16px',
        borderRadius: '14px'
      }}>
        {/* Star Rating Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#064e3b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} style={{ color: '#059669' }} />
            <span>나만의 독서 평점</span>
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((starVal) => (
              <Star
                key={starVal}
                size={18}
                onClick={() => setRating(starVal)}
                style={{
                  cursor: 'pointer',
                  color: starVal <= rating ? '#059669' : '#d1d5db',
                  fill: starVal <= rating ? '#059669' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Reading Mood Tag Title */}
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', marginBottom: '8px' }}>
          독서 감정 스탬프 (복수 선택 가능, 최대 4개)
        </div>

        {/* Multi-Select Reading Mood Tag Selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {MOOD_OPTIONS.map((m) => {
            const isSelected = selectedMoods.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMood(m.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: isSelected ? '1.5px solid #059669' : '1px solid #c9c3b4',
                  background: isSelected ? 'linear-gradient(135deg, #047857, #10b981)' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#374151',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(5, 150, 105, 0.25)' : 'none'
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Proof Stamp */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          border: '2px double #059669',
          color: '#059669',
          padding: '6px 18px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '1.5px', fontWeight: 700 }}>
            READTAG VERIFIED
          </span>
          <span style={{ fontSize: '0.92rem', fontWeight: 800 }}>Proof of Reading</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>독서 인증 완료</span>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        style={{
          width: '100%',
          background: savedStatus ? '#059669' : 'linear-gradient(135deg, #047857, #10b981)',
          color: '#ffffff',
          border: 'none',
          padding: '14px',
          borderRadius: '14px',
          fontWeight: 800,
          fontSize: '0.98rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 6px 18px rgba(5, 150, 105, 0.3)'
        }}
      >
        {savedStatus ? (
          <>
            <CheckCircle size={18} />
            <span>아카이브 기록 저장 완료!</span>
          </>
        ) : (
          <>
            <Edit3 size={18} />
            <span>독서 기록 아카이브에 저장하기</span>
          </>
        )}
      </button>
    </div>
  );
}
