import React, { useState } from 'react';
import { Zap, Plus, X, Sparkles, Tag, CheckCircle2 } from 'lucide-react';

export default function VendingMachine({ onDispense, selectedTags, setSelectedTags }) {
  const [customTagInput, setCustomTagInput] = useState('');

  const addTag = (tag) => {
    let cleanTag = tag.trim();
    if (!cleanTag) return;
    if (!cleanTag.startsWith('#')) {
      cleanTag = `#${cleanTag}`;
    }

    if (selectedTags.includes(cleanTag)) return;

    if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, cleanTag]);
    }
  };

  const removeTag = (indexToRemove) => {
    setSelectedTags(selectedTags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (customTagInput) {
      addTag(customTagInput);
      setCustomTagInput('');
    }
  };

  const handleDispenseClick = () => {
    if (selectedTags.length === 0) return;
    onDispense(selectedTags);
  };

  return (
    <div className="vending-machine-wrapper" style={{
      width: '100%',
      minHeight: 'calc(80vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0 40px 0'
    }}>
      {/* Vending Machine Cabinet Card */}
      <div className="vending-cabinet" style={{
        width: '100%',
        maxWidth: '780px',
        background: '#ffffff',
        border: '1.5px solid #e4dcd0',
        borderRadius: '32px',
        padding: '42px 38px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Cabinet Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2.05rem',
            fontWeight: 800,
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            <Sparkles style={{ color: '#059669' }} size={36} />
            READTAG AI 자판기
          </h1>
          <p style={{ fontSize: '1.02rem', color: '#4b5563', margin: 0, lineHeight: '1.5' }}>
            원하는 해시태그를 최대 3개까지 투입하고 나만의 맞춤 독서 영수증을 발급받아보세요.
          </p>
        </div>

        {/* Vending Display Screen Box */}
        <div style={{
          background: '#faf8f2',
          border: '1.5px solid #e4dcd0',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)'
        }}>
          {/* Screen Status Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88rem',
            fontWeight: 700
          }}>
            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              SYSTEM READY
            </span>
            <span style={{ color: '#6b7280', background: '#ffffff', padding: '4px 12px', borderRadius: '999px', border: '1px solid #e4dcd0' }}>
              {selectedTags.length} / 3 SLOTS
            </span>
          </div>

          {/* 3 Tag Slots Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {[0, 1, 2].map((slotIdx) => {
              const tag = selectedTags[slotIdx];
              return (
                <div
                  key={slotIdx}
                  style={{
                    background: tag ? '#fefce8' : '#ffffff',
                    border: tag ? '2px solid #059669' : '2px dashed #c4bcae',
                    borderRadius: '20px',
                    padding: '20px 14px',
                    minHeight: '110px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: tag ? '0 6px 18px rgba(5, 150, 105, 0.12)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: tag ? '#047857' : '#9ca3af',
                    letterSpacing: '1px'
                  }}>
                    SLOT 0{slotIdx + 1}
                  </span>

                  {tag ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                      <span style={{
                        fontSize: '1.08rem',
                        fontWeight: 800,
                        color: '#064e3b',
                        wordBreak: 'break-all'
                      }}>
                        {tag}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTag(slotIdx)}
                        title="해시태그 삭제"
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #059669',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#059669',
                          flexShrink: 0
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#9ca3af' }}>
                      <Plus size={20} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>키워드 대기 중</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom Tag Input Form */}
          <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Tag size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
              <input
                type="text"
                placeholder="해시태그 키워드를 입력하세요 (예: #겨울, #우울, #사랑, #음악)..."
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                disabled={selectedTags.length >= 3}
                style={{
                  width: '100%',
                  padding: '16px 18px 16px 52px',
                  borderRadius: '16px',
                  border: '1.5px solid #c4bcae',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!customTagInput.trim() || selectedTags.length >= 3}
              style={{
                padding: '16px 28px',
                borderRadius: '16px',
                border: 'none',
                background: selectedTags.length >= 3 ? '#9ca3af' : 'linear-gradient(135deg, #047857, #10b981)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: selectedTags.length >= 3 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: selectedTags.length >= 3 ? 'none' : '0 4px 14px rgba(5, 150, 105, 0.3)'
              }}
            >
              <Plus size={20} />
              <span>추가</span>
            </button>
          </form>
        </div>

        {/* Dispense Action Button */}
        <div style={{ marginTop: '28px' }}>
          <button
            type="button"
            onClick={handleDispenseClick}
            disabled={selectedTags.length === 0}
            style={{
              width: '100%',
              padding: '22px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '1.18rem',
              fontWeight: 800,
              background: selectedTags.length > 0 ? 'linear-gradient(135deg, #047857, #10b981)' : '#e4dcd0',
              color: selectedTags.length > 0 ? '#ffffff' : '#9ca3af',
              cursor: selectedTags.length > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: selectedTags.length > 0 ? '0 8px 28px rgba(5, 150, 105, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={26} />
            <span>도서 영수증 처방받기 ({selectedTags.length}/3)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
