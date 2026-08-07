import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Sparkles, RefreshCw, AlertCircle, Bookmark, Star, Library, ChevronDown, Shuffle } from 'lucide-react';
import { searchBooksFromApi, fetchBestsellersFromApi } from '../api/readTagApi';

const DYNAMIC_THEME_POOL = [
  { id: 'all', label: '전체 세계문학 280', query: '세계문학전집', icon: Bookmark, color: '#059669' },
  { id: 'nobel', label: '🏆 노벨문학상 수상작', query: '노벨문학상', icon: Star, color: '#ca8a04' },
  { id: 'kafka', label: '📖 카프카 & 실존주의', query: '카프카', icon: Star, color: '#0284c7' },
  { id: 'hesse', label: '📜 헤르만 헤세 전집', query: '헤르만 헤세', icon: Star, color: '#9333ea' },
  { id: 'romance', label: '💖 클래식 로맨스 & 사랑', query: '사랑 소설', icon: Star, color: '#e11d48' },
  { id: 'russia', label: '🪆 러시아 대문호 (톨스토이)', query: '도스토옙스키', icon: Star, color: '#d97706' },
  { id: 'dystopia', label: '🕵️ 디스토피아 & 1984', query: '조지오웰', icon: Star, color: '#4f46e5' },
  { id: 'sea', label: '🌊 바다 & 헤밍웨이', query: '헤밍웨이', icon: Star, color: '#0284c7' },
  { id: 'art', label: '🎨 예술 & 달과 6펜스', query: '세계문학', icon: Star, color: '#059669' },
  { id: 'france', label: '🇫🇷 프랑스 감성 문학', query: '알베르 카뮈', icon: Star, color: '#2563eb' }
];

function shuffleArray(array) {
  if (!array || array.length === 0) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function AladinBookSearch({ onSelectBookForReceipt }) {
  const [keyword, setKeyword] = useState('');
  const [books, setBooks] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState('🏛️ 세계문학전집 라이브 컬렉션');
  const [activeFilter, setActiveFilter] = useState('all');
  const [errorMsg, setErrorMsg] = useState(null);

  // Dynamic Theme Preset Buttons State
  const [activePresets, setActivePresets] = useState(DYNAMIC_THEME_POOL.slice(0, 4));

  useEffect(() => {
    loadCollection('세계문학전집', '🏛️ 세계문학전집 라이브 컬렉션', 'all');
  }, []);

  const loadCollection = async (searchQuery, title, filterKey) => {
    setLoading(true);
    setErrorMsg(null);
    setActiveFilter(filterKey);
    setSearchTitle(title);
    setDisplayCount(20);

    const results = await searchBooksFromApi(searchQuery);
    if (results && results.length > 0) {
      setBooks(shuffleArray(results));
    } else {
      setBooks([]);
      setErrorMsg('도서 목록을 불러오는 중입니다...');
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const query = keyword.trim();
    if (!query) {
      loadCollection('세계문학전집', '🏛️ 세계문학전집 라이브 컬렉션', 'all');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setActiveFilter('search');
    setSearchTitle(`🔍 '${query}' 도서 검색 결과`);
    setDisplayCount(20);

    let results = await searchBooksFromApi(query);
    if (results && results.length > 0) {
      setBooks(shuffleArray(results));
    } else {
      setBooks([]);
      setErrorMsg(`'${query}'에 대한 도서 검색 결과가 없습니다.`);
    }
    setLoading(false);
  };

  const handleShuffleBooks = () => {
    if (books.length > 0) {
      setBooks(shuffleArray(books));
    }

    // Dynamically shuffle preset filter buttons as well!
    const alwaysAll = DYNAMIC_THEME_POOL[0]; // Keep '전체 세계문학 280' as first
    const poolOthers = DYNAMIC_THEME_POOL.slice(1);
    const shuffledOthers = shuffleArray(poolOthers).slice(0, 3);
    setActivePresets([alwaysAll, ...shuffledOthers]);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  const visibleBooks = books.slice(0, displayCount);

  return (
    <div className="aladin-search-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px 0' }}>
      {/* Header Banner - Warm Ivory Card */}
      <div className="search-header-card" style={{
        background: '#ffffff',
        border: '1.5px solid #e4dcd0',
        borderRadius: '28px',
        padding: '36px 32px',
        marginBottom: '28px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #047857, #10b981)',
              padding: '16px',
              borderRadius: '20px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)'
            }}>
              <Library size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
                도서 검색
              </h2>
              <p style={{ fontSize: '0.98rem', color: '#4b5563', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                세계문학전집 280여 권의 다채로운 고전 라이브 도서를 검색하고 영수증으로 처방받아보세요.
              </p>
            </div>
          </div>

          {/* Clean Shuffle Button (No blue icon, just '셔플') */}
          <button
            onClick={handleShuffleBooks}
            style={{
              padding: '14px 24px',
              borderRadius: '16px',
              border: '1.5px solid #059669',
              background: '#fefce8',
              color: '#064e3b',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.12)'
            }}
          >
            <Shuffle size={20} style={{ color: '#059669' }} />
            <span>셔플</span>
          </button>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginTop: '26px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} size={24} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="도서 제목, 작가 이름, 해시태그를 입력하세요 (예: 설국, 변신, 카뮈, 소설)..."
              style={{
                width: '100%',
                padding: '18px 20px 18px 58px',
                borderRadius: '18px',
                border: '1.5px solid #c4bcae',
                background: '#ffffff',
                color: '#111827',
                fontSize: '1.05rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '18px 32px',
              borderRadius: '18px',
              border: 'none',
              background: 'linear-gradient(135deg, #047857, #10b981)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)'
            }}
          >
            <Search size={22} />
            <span>도서 검색</span>
          </button>
        </form>

        {/* Dynamic Collection Preset Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          {activePresets.map((preset) => {
            const IconComp = preset.icon || Star;
            const isActive = activeFilter === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => loadCollection(preset.query, `🏛️ ${preset.label}`, preset.id)}
                style={{
                  padding: '12px 18px',
                  borderRadius: '14px',
                  border: isActive ? '2px solid #059669' : '1.5px solid #e4dcd0',
                  background: isActive ? '#fefce8' : '#f8f5eb',
                  color: isActive ? '#064e3b' : '#374151',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconComp size={18} color={preset.color || '#059669'} />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {searchTitle}
          {loading && <RefreshCw className="animate-spin" size={22} style={{ color: '#059669' }} />}
        </h3>
        <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 700 }}>현재 {visibleBooks.length}권 표시 중 (전체 {books.length}권)</span>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div style={{
          padding: '20px',
          borderRadius: '18px',
          background: '#fef2f2',
          border: '1.5px solid #fca5a5',
          color: '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '28px'
        }}>
          <AlertCircle size={24} />
          <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{errorMsg}</span>
        </div>
      )}

      {/* Book Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '26px'
      }}>
        {visibleBooks.map((book, idx) => (
          <div
            key={book.id || idx}
            style={{
              background: '#ffffff',
              border: '1.5px solid #e4dcd0',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease-in-out',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div>
              {/* Cover Image & Book Details */}
              <div style={{ display: 'flex', gap: '18px', marginBottom: '18px' }}>
                <div style={{
                  width: '98px',
                  height: '140px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e4dcd0',
                  background: '#f8f5eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        if (e.target.parentNode) {
                          e.target.parentNode.style.background = 'linear-gradient(135deg, #047857, #064e3b)';
                          e.target.parentNode.innerHTML = `<div style="color:#fef08a;textAlign:center;padding:8px;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg><div style="fontSize:10px;marginTop:4px;fontWeight:bold;">${book.title.substring(0, 8)}</div></div>`;
                        }
                      }}
                    />
                  ) : (
                    <div style={{ color: '#059669', textAlign: 'center' }}>
                      <BookOpen size={30} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{
                      fontSize: '0.78rem',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: '#fefce8',
                      color: '#064e3b',
                      fontWeight: 800,
                      display: 'inline-block',
                      marginBottom: '8px',
                      border: '1px solid #fef08a'
                    }}>
                      세계문학 클래식
                    </span>
                    <h4 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#111827', margin: '0 0 4px 0', lineHeight: '1.35' }}>
                      {book.title}
                    </h4>
                  </div>

                  <div>
                    <p style={{ fontSize: '0.88rem', color: '#047857', fontWeight: 800, margin: 0 }}>
                      {book.author}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '3px 0 0 0' }}>
                      {book.publishedYear ? `(${book.publishedYear})` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p style={{
                fontSize: '0.88rem',
                color: '#374151',
                lineHeight: '1.6',
                margin: '0 0 20px 0',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {book.summary || book.oneLiner || '세계문학전집 영원한 고전입니다.'}
              </p>
            </div>

            {/* Prescribe Action Button */}
            <button
              onClick={() => onSelectBookForReceipt(book)}
              style={{
                width: '100%',
                padding: '16px 0',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #047857, #10b981)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)'
              }}
            >
              <Sparkles size={20} />
              <span>이 고전으로 영수증 처방받기</span>
            </button>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {displayCount < books.length && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: '16px 36px',
              borderRadius: '16px',
              border: '1.5px solid #c4bcae',
              background: '#ffffff',
              color: '#111827',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
            }}
          >
            <ChevronDown size={22} />
            <span>더 많은 세계문학 보기 (20권 더 보기)</span>
          </button>
        </div>
      )}
    </div>
  );
}
