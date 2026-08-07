import React, { useState } from 'react';
import { RefreshCw, Download, Bookmark, Check, ArrowRight, BookOpen, Sparkles, Tag, Barcode } from 'lucide-react';
import ReviewBackSide from './ReviewBackSide';
import { exportReceiptToImage } from '../utils/canvasExporter';

function cleanHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>?/g, '');
}

export default function ReceiptCard({
  prescription,
  selectedTags = [],
  onSaveToArchive,
  isSavedInArchive = false,
  onSelectDerivativeTag
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const primaryBook = prescription?.primaryBook;
  const secondaryBooks = prescription?.secondaryBooks || [];
  const derivativeTags = prescription?.derivativeTags || [];

  if (!primaryBook) {
    return null;
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await exportReceiptToImage('readtag-printable-receipt', `ReadTag_${primaryBook.title}.png`);
    setIsDownloading(false);
  };

  const handleSaveReview = (reviewData) => {
    setCurrentReview(reviewData);
    if (onSaveToArchive) {
      onSaveToArchive({
        id: `rec_${Date.now()}`,
        date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        book: primaryBook,
        selectedTags,
        review: reviewData
      });
    }
  };

  const cleanQuote = cleanHtmlEntities(primaryBook.keyQuote || primaryBook.oneLiner);
  const cleanSummary = cleanHtmlEntities(primaryBook.summary);

  return (
    <div className="receipt-section" style={{ width: '100%', maxWidth: '460px', margin: '0 auto' }}>
      {/* Action Toolbar */}
      <div className="receipt-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '22px' }}>
        <button
          type="button"
          onClick={handleFlip}
          style={{
            padding: '12px 18px',
            borderRadius: '14px',
            border: isFlipped ? 'none' : '1.5px solid #059669',
            background: isFlipped ? 'linear-gradient(135deg, #047857, #10b981)' : '#fefce8',
            color: isFlipped ? '#ffffff' : '#064e3b',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.18)'
          }}
        >
          <RefreshCw size={18} style={{ transform: isFlipped ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          <span>{isFlipped ? '앞면 영수증 보기' : '뒷면 필사/리뷰 쓰기 (Card Flip)'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          style={{
            padding: '12px 18px',
            borderRadius: '14px',
            border: '1.5px solid #c4bcae',
            background: '#ffffff',
            color: '#111827',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Download size={18} />
          <span>{isDownloading ? '생성 중...' : 'SNS 이미지 저장'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!currentReview) {
              handleSaveReview({
                text: '자판기에서 바로 발급받은 취향 저격 도서 영수증!',
                quote: primaryBook.keyQuote,
                userName: '독서가 수영'
              });
            } else if (onSaveToArchive) {
              onSaveToArchive({
                id: `rec_${Date.now()}`,
                date: new Date().toLocaleDateString('ko-KR'),
                book: primaryBook,
                selectedTags,
                review: currentReview
              });
            }
          }}
          style={{
            padding: '12px 18px',
            borderRadius: '14px',
            border: 'none',
            background: isSavedInArchive ? '#059669' : 'linear-gradient(135deg, #047857, #10b981)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
          }}
        >
          {isSavedInArchive ? (
            <>
              <Check size={18} />
              <span>아카이브 보관 완료</span>
            </>
          ) : (
            <>
              <Bookmark size={18} />
              <span>아카이브에 저장</span>
            </>
          )}
        </button>
      </div>

      {/* 3D Flip Perspective Wrapper */}
      <div className="receipt-3d-perspective">
        <div className={`receipt-card-flipper ${isFlipped ? 'flipped' : ''}`}>
          
          {/* ================= FRONT SIDE (VINTAGE THERMAL RECEIPT) ================= */}
          <div className="receipt-card-front" id="readtag-printable-receipt">
            <div className="serrated-edge serrated-top" />

            <div className="receipt-paper-body">
              {/* Receipt Shop Banner Header */}
              <div style={{ textAlign: 'center', paddingBottom: '14px', borderBottom: '1.5px dashed #c9c3b4' }}>
                <h2 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  color: '#111827',
                  margin: '0 0 2px 0'
                }}>
                  READTAG
                </h2>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#059669',
                  letterSpacing: '1px',
                  margin: '0 0 4px 0'
                }}>
                  BOOK PRESCRIPTION RECEIPT
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#6b7280', margin: 0 }}>
                  {new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Book Official Cover Frame */}
              <div style={{ textAlign: 'center', margin: '18px 0 16px 0' }}>
                <div style={{
                  width: '124px',
                  height: '178px',
                  margin: '0 auto',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 22px rgba(0, 0, 0, 0.14)',
                  border: '1px solid #c4bcae',
                  background: '#f8f5eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {primaryBook.cover ? (
                    <img
                      src={primaryBook.cover}
                      alt={primaryBook.title}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{ color: '#059669', textAlign: 'center' }}>
                      <BookOpen size={36} />
                      <div style={{ fontSize: '11px', marginTop: '4px', fontWeight: 'bold' }}>{primaryBook.title}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Book Info & Category Badge */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  background: '#fefce8',
                  color: '#064e3b',
                  fontWeight: 800,
                  border: '1px solid #fef08a',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  {primaryBook.category || '세계문학 클래식'}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                  {primaryBook.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 800, margin: '0 0 10px 0' }}>
                  {primaryBook.author} {primaryBook.publishedYear ? `(${primaryBook.publishedYear})` : ''}
                </p>
                
                {/* Selected Tag Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
                  {selectedTags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#f8f5eb',
                        border: '1px solid #e4dcd0',
                        color: '#374151',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderBottom: '1.5px dashed #c9c3b4', margin: '14px 0' }} />

              {/* Prescribed Quote Card */}
              <div style={{
                background: '#fefce8',
                border: '1px solid #fef08a',
                borderLeft: '5px solid #059669',
                borderRadius: '14px',
                padding: '16px 18px',
                marginBottom: '16px'
              }}>
                <blockquote style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  color: '#1c1b18',
                  lineHeight: '1.55',
                  margin: '0 0 10px 0'
                }}>
                  "{cleanQuote}"
                </blockquote>
                <p style={{
                  fontSize: '0.88rem',
                  color: '#374151',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {cleanSummary}
                </p>
              </div>

              {/* Secondary Recommended Books */}
              {secondaryBooks.length > 0 && (
                <>
                  <div style={{ borderBottom: '1.5px dashed #c9c3b4', margin: '14px 0' }} />
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', display: 'block', marginBottom: '8px' }}>
                      [ 함께 읽으면 좋은 연관 세계문학 ]
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {secondaryBooks.map((sb, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f5eb', padding: '8px 12px', borderRadius: '10px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: '#059669' }}>
                            0{i + 2}.
                          </span>
                          <div style={{
                            width: '28px',
                            height: '40px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#e4dcd0'
                          }}>
                            {sb.cover ? (
                              <img
                                src={sb.cover}
                                alt={sb.title}
                                referrerPolicy="no-referrer"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <BookOpen size={14} color="#059669" />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>{sb.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{sb.author}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Receipt Footer with Barcode & Derivative Tags */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1.5px dashed #c9c3b4', textAlign: 'center' }}>
                {/* Barcode Graphic */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    height: '32px',
                    marginBottom: '4px'
                  }}>
                    {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 1, 4, 2].map((w, i) => (
                      <div key={i} style={{ width: `${w * 1.5}px`, height: '100%', background: '#111827' }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#6b7280', letterSpacing: '1px', fontWeight: 700 }}>
                    READTAG VERIFIED #2026-0806
                  </span>
                </div>

                {/* Integrated Next Discovery Tags */}
                {derivativeTags.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', display: 'block', marginBottom: '6px' }}>
                      연관 키워드로 더 알아보기 →
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {derivativeTags.slice(0, 3).map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectDerivativeTag) onSelectDerivativeTag(tag);
                          }}
                          style={{
                            background: '#fefce8',
                            color: '#064e3b',
                            border: '1px solid #fef08a',
                            padding: '5px 12px',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flip Hint */}
                <button
                  type="button"
                  onClick={handleFlip}
                  style={{
                    background: '#f8f5eb',
                    border: '1px solid #e4dcd0',
                    color: '#059669',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px'
                  }}
                >
                  <RefreshCw size={14} />
                  <span>↺ 탭하여 뒷면에 필사 및 독서 감상평 적기</span>
                </button>
              </div>
            </div>

            <div className="serrated-edge serrated-bottom" />
          </div>

          {/* ================= BACK SIDE (REVIEW NOTE) ================= */}
          <div className="receipt-card-back">
            <div className="serrated-edge serrated-top" />

            <div className="receipt-paper-body">
              <ReviewBackSide
                book={primaryBook}
                onSaveReview={handleSaveReview}
                currentReview={currentReview}
              />
            </div>

            <div className="serrated-edge serrated-bottom" />
          </div>

        </div>
      </div>
    </div>
  );
}
