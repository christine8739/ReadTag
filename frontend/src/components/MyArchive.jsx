import React, { useState } from 'react';
import { Bookmark, Sparkles, Trash2, Eye, Calendar, BookOpen, Heart, Search } from 'lucide-react';

export default function MyArchive({ archiveList, onDeleteItem, onSelectArchiveItem }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('ALL');

  const totalCount = archiveList.length;
  const tagCountMap = {};
  archiveList.forEach(item => {
    (item.selectedTags || []).forEach(t => {
      tagCountMap[t] = (tagCountMap[t] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const filteredList = archiveList.filter(item => {
    const matchesSearch =
      item.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.book?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.review?.text || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag =
      selectedTagFilter === 'ALL' ||
      (item.selectedTags || []).includes(selectedTagFilter);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="archive-dashboard-container" style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Dashboard Stats Banner */}
      <div className="archive-stats-banner">
        <div className="stat-card">
          <Bookmark className="stat-icon" style={{ color: '#059669' }} />
          <div className="stat-info">
            <span className="stat-value">{totalCount}개</span>
            <span className="stat-label">보관된 독서 영수증</span>
          </div>
        </div>

        <div className="stat-card">
          <Sparkles className="stat-icon" style={{ color: '#059669' }} />
          <div className="stat-info">
            <span className="stat-value">{topTags.length > 0 ? topTags[0][0] : '#세계문학'}</span>
            <span className="stat-label">최애 해시태그</span>
          </div>
        </div>

        <div className="stat-card">
          <BookOpen className="stat-icon" style={{ color: '#059669' }} />
          <div className="stat-info">
            <span className="stat-value">100%</span>
            <span className="stat-label">Proof of Reading</span>
          </div>
        </div>
      </div>

      {/* Search Bar & Hashtag Filter Cloud */}
      <div className="archive-filter-bar" style={{
        background: '#ffffff',
        border: '1.5px solid #e4dcd0',
        borderRadius: '20px',
        padding: '20px 24px',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)'
      }}>
        <div className="search-box-input-wrap" style={{ position: 'relative', marginBottom: topTags.length > 0 ? '16px' : '0' }}>
          <Search className="search-icon" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} size={20} />
          <input
            type="text"
            className="archive-search-input"
            placeholder="도서 제목, 저자, 한 줄 평 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: '14px',
              border: '1.5px solid #c4bcae',
              background: '#fffdf8',
              fontSize: '0.98rem',
              color: '#111827',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {topTags.length > 0 && (
          <div className="tag-filters-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedTagFilter('ALL')}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: selectedTagFilter === 'ALL' ? '2px solid #059669' : '1.5px solid #e4dcd0',
                background: selectedTagFilter === 'ALL' ? '#fefce8' : '#f8f5eb',
                color: selectedTagFilter === 'ALL' ? '#064e3b' : '#374151',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              전체 ({totalCount})
            </button>
            {topTags.map(([tag, count], idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTagFilter(tag)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: selectedTagFilter === tag ? '2px solid #059669' : '1.5px solid #e4dcd0',
                  background: selectedTagFilter === tag ? '#fefce8' : '#f8f5eb',
                  color: selectedTagFilter === tag ? '#064e3b' : '#374151',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                {tag} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Title */}
      <div className="archive-section-title" style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
          나만의 독서 영수증 갤러리
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#4b5563', margin: 0 }}>
          자판기에서 수집한 나만의 감성 독서 영수증과 기록장 목록입니다.
        </p>
      </div>

      {filteredList.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px 24px',
          background: '#ffffff',
          border: '1.5px dashed #c4bcae',
          borderRadius: '24px'
        }}>
          <Bookmark size={44} style={{ color: '#059669', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 8px 0' }}>
            저장된 독서 영수증이 없습니다
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#4b5563', margin: 0 }}>
            AI 자판기에서 해시태그를 입력하고 나만의 첫 번째 영수증을 발행해 보관해 보세요!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '26px'
        }}>
          {filteredList.map((item) => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="mini-serrated-edge mini-serrated-top" />

              <div style={{
                background: '#fffefb',
                borderLeft: '1px solid #e2dac7',
                borderRight: '1px solid #e2dac7',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.05)'
              }}>
                {/* Date & Delete Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#615c52', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} />
                    {item.date}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    title="영수증 삭제"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div style={{ borderBottom: '1.5px dashed #c9c3b4' }} />

                {/* Book Preview */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '92px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                    border: '1px solid #e2dac7',
                    background: '#f0ebd9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.book?.cover ? (
                      <img
                        src={item.book.cover}
                        alt={item.book.title}
                        referrerPolicy="no-referrer"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <BookOpen size={24} style={{ color: '#059669' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1c1b18', margin: '0 0 4px 0', lineHeight: '1.35' }}>
                      {item.book?.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#595449', fontWeight: 600, margin: 0 }}>
                      {item.book?.author}
                    </p>
                  </div>
                </div>

                {/* Selected Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(item.selectedTags || []).map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#fefce8',
                        color: '#064e3b',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        border: '1px solid #fef08a'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Review Text Snippet */}
                {item.review?.text && (
                  <div style={{
                    background: '#f8f5eb',
                    borderLeft: '4px solid #059669',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <Heart size={15} style={{ color: '#059669', marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.86rem', color: '#1c1b18', margin: 0, lineHeight: '1.45', fontWeight: 600 }}>
                      "{item.review.text}"
                    </p>
                  </div>
                )}

                {/* Action View Button */}
                <button
                  type="button"
                  onClick={() => onSelectArchiveItem(item)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #047857, #10b981)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '14px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                    marginTop: '4px'
                  }}
                >
                  <Eye size={18} />
                  <span>영수증 자세히 보기</span>
                </button>
              </div>

              <div className="mini-serrated-edge mini-serrated-bottom" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
