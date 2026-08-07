import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function InfiniteLoopTags({ derivativeTags = [], onSelectDerivativeTag }) {
  if (!derivativeTags || derivativeTags.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      maxWidth: '480px',
      margin: '20px auto 0 auto',
      background: '#ffffff',
      border: '1.5px solid #e4dcd0',
      borderRadius: '24px',
      padding: '24px 22px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
      textAlign: 'center'
    }}>
      {/* Card Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Compass size={22} style={{ color: '#059669' }} />
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>
            연관 해시태그로 다음 처방전 탐색
          </h4>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#4b5563', margin: 0, lineHeight: '1.4' }}>
          추천받은 도서와 연결된 감성 키워드를 눌러 새로운 독서를 이어가세요.
        </p>
      </div>

      {/* Derivative Tag Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
        {derivativeTags.map((tag, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectDerivativeTag(tag)}
            style={{
              background: 'linear-gradient(135deg, #047857, #10b981)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '999px',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} />
            <span>{tag}</span>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
