import React, { useState } from 'react';
import { Sparkles, Bookmark, Zap, BookOpen, Search, User, LogOut, X, Heart, Edit2, Lock, Mail, CheckCircle2 } from 'lucide-react';

const GENRE_OPTIONS = [
  '🏛️ 세계문학전집',
  '🏆 노벨문학상 수상작',
  '📖 실존주의 & 현대소설',
  '☕ 수필 & 에세이',
  '🌌 철학 & 인문학'
];

export default function Navbar({ activeTab, setActiveTab, archiveCount }) {
  const [showMyPage, setShowMyPage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authMode, setAuthMode] = useState('login');

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    nickname: '카프카의변신중',
    email: 'kafka@readtag.kr',
    rank: '👑 클래식 독서 마스터 (Lv.5)',
    favoriteGenre: '🏛️ 세계문학전집'
  });

  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // Form Inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');

  const [signupNickname, setSignupNickname] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupGenre, setSignupGenre] = useState('🏛️ 세계문학전집');
  const [signupSuccessMsg, setSignupSuccessMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPw) return;
    setUserProfile(prev => ({
      ...prev,
      email: loginEmail,
      nickname: loginEmail.split('@')[0] || '독서탐험가'
    }));
    setIsLoggedIn(true);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupNickname || !signupEmail || !signupPw) return;
    setUserProfile({
      nickname: signupNickname,
      email: signupEmail,
      rank: '🌱 신규 고전 탐험가 (Lv.1)',
      favoriteGenre: signupGenre
    });
    setSignupSuccessMsg(`'${signupNickname}' 님, 회원가입이 완료되었습니다! 자동 로그인됩니다.`);
    setTimeout(() => {
      setIsLoggedIn(true);
      setSignupSuccessMsg('');
    }, 1200);
  };

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => setActiveTab('vending')}>
            <div className="brand-icon-box">
              <BookOpen className="brand-icon" />
            </div>
            <div className="brand-title-wrap">
              <span className="brand-title">ReadTag</span>
              <span className="brand-subtitle">AI 해시태그 독서 자판기</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === 'vending' ? 'active' : ''}`}
              onClick={() => setActiveTab('vending')}
            >
              <Zap className="nav-icon" />
              <span>AI 해시태그 자판기</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <Search className="nav-icon" />
              <span>도서 검색</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'receipt' ? 'active' : ''}`}
              onClick={() => setActiveTab('receipt')}
            >
              <Sparkles className="nav-icon" />
              <span>디지털 영수증</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'archive' ? 'active' : ''}`}
              onClick={() => setActiveTab('archive')}
            >
              <Bookmark className="nav-icon" />
              <span>독서 아카이브</span>
              {archiveCount > 0 && (
                <span className="archive-badge">{archiveCount}</span>
              )}
            </button>

            {/* Compact Sleek User Profile Icon Button */}
            <button
              type="button"
              onClick={() => setShowMyPage(true)}
              title="마이페이지 / 로그인"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                border: '1.5px solid #059669',
                background: '#fefce8',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: '6px',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.15)'
              }}
            >
              <User size={22} style={{ color: '#059669' }} />
            </button>
          </nav>
        </div>
      </header>

      {/* Sign Up & Login Modal Drawer */}
      {showMyPage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #e4dcd0',
            borderRadius: '28px',
            maxWidth: '460px',
            width: '100%',
            padding: '32px 28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowMyPage(false)}
              style={{
                position: 'absolute',
                top: '22px',
                right: '22px',
                background: '#f8f5eb',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4b5563'
              }}
            >
              <X size={20} />
            </button>

            {isLoggedIn ? (
              /* ================= LOGGED IN PROFILE VIEW ================= */
              <div>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #047857, #10b981)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px auto',
                    boxShadow: '0 6px 18px rgba(5, 150, 105, 0.3)'
                  }}>
                    <User size={36} />
                  </div>

                  {/* Editable Nickname */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                    {isEditingNickname ? (
                      <input
                        type="text"
                        value={userProfile.nickname}
                        onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
                        onBlur={() => setIsEditingNickname(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingNickname(false)}
                        autoFocus
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#111827',
                          border: '1.5px solid #059669',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          textAlign: 'center',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                          {userProfile.nickname}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsEditingNickname(true)}
                          title="닉네임 수정"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#059669',
                            padding: '4px'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                      </>
                    )}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#059669', fontWeight: 800, margin: 0 }}>
                    {userProfile.rank}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                    {userProfile.email}
                  </p>
                </div>

                {/* Reading Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    background: '#fefce8',
                    border: '1px solid #fef08a',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <Bookmark size={22} style={{ color: '#059669', marginBottom: '4px' }} />
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>
                      {archiveCount}개
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#615c52', fontWeight: 700 }}>
                      보관된 독서 영수증
                    </div>
                  </div>

                  <div style={{
                    background: '#fefce8',
                    border: '1px solid #fef08a',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <Heart size={22} style={{ color: '#059669', marginBottom: '4px' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
                      {userProfile.favoriteGenre}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#615c52', fontWeight: 700, marginTop: '2px' }}>
                      선호 장르
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setShowMyPage(false);
                      setActiveTab('archive');
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #047857, #10b981)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.98rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    <Bookmark size={18} />
                    <span>독서 아카이브 보러가기</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '14px',
                      border: '1.5px solid #e4dcd0',
                      background: '#ffffff',
                      color: '#6b7280',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <LogOut size={16} />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ================= LOGIN & SIGN UP TABBED VIEW ================= */
              <div>
                {/* Modal Title & Tab Switcher */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <BookOpen size={36} style={{ color: '#059669', marginBottom: '8px' }} />
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 14px 0' }}>
                    READTAG 독서 회원 서비스
                  </h3>

                  {/* Login / Sign Up Tabs */}
                  <div style={{
                    display: 'flex',
                    background: '#f8f5eb',
                    padding: '4px',
                    borderRadius: '14px',
                    border: '1px solid #e4dcd0'
                  }}>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '10px',
                        border: 'none',
                        background: authMode === 'login' ? '#ffffff' : 'transparent',
                        color: authMode === 'login' ? '#047857' : '#6b7280',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      로그인
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '10px',
                        border: 'none',
                        background: authMode === 'signup' ? '#ffffff' : 'transparent',
                        color: authMode === 'signup' ? '#047857' : '#6b7280',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        boxShadow: authMode === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      회원가입
                    </button>
                  </div>
                </div>

                {signupSuccessMsg ? (
                  <div style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: '#ecfdf5',
                    border: '1.5px solid #6ee7b7',
                    color: '#065f46',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                    {signupSuccessMsg}
                  </div>
                ) : authMode === 'login' ? (
                  /* ===== LOGIN FORM ===== */
                  <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
                      <input
                        type="email"
                        placeholder="이메일 주소 (예: reader@readtag.kr)"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '14px 16px 14px 46px',
                          borderRadius: '14px',
                          border: '1.5px solid #c4bcae',
                          fontSize: '0.95rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
                      <input
                        type="password"
                        placeholder="비밀번호"
                        value={loginPw}
                        onChange={(e) => setLoginPw(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '14px 16px 14px 46px',
                          borderRadius: '14px',
                          border: '1.5px solid #c4bcae',
                          fontSize: '0.95rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '15px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #047857, #10b981)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                        marginTop: '4px'
                      }}
                    >
                      🔑 READTAG 로그인
                    </button>

                    <div style={{ borderBottom: '1px solid #e4dcd0', margin: '8px 0' }} />

                    {/* Social Logins */}
                    <button
                      type="button"
                      onClick={() => setIsLoggedIn(true)}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: '#fee500',
                        color: '#000000',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer'
                      }}
                    >
                      💬 카카오 1초 간편 로그인
                    </button>
                  </form>
                ) : (
                  /* ===== SIGN UP FORM ===== */
                  <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
                      <input
                        type="text"
                        placeholder="닉네임 (예: 카프카의변신중, 텍스트힙스터, 밤샘독서러)..."
                        value={signupNickname}
                        onChange={(e) => setSignupNickname(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '13px 16px 13px 46px',
                          borderRadius: '14px',
                          border: '1.5px solid #c4bcae',
                          fontSize: '0.92rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
                      <input
                        type="email"
                        placeholder="이메일 주소 (예: kafka@readtag.kr)"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '13px 16px 13px 46px',
                          borderRadius: '14px',
                          border: '1.5px solid #c4bcae',
                          fontSize: '0.92rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#059669' }} />
                      <input
                        type="password"
                        placeholder="비밀번호 설정"
                        value={signupPw}
                        onChange={(e) => setSignupPw(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '13px 16px 13px 46px',
                          borderRadius: '14px',
                          border: '1.5px solid #c4bcae',
                          fontSize: '0.92rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Favorite Genre Selection */}
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', display: 'block', marginBottom: '6px' }}>
                        선호하는 독서 장르 선택:
                      </span>
                      <select
                        value={signupGenre}
                        onChange={(e) => setSignupGenre(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: '1.5px solid #c4bcae',
                          background: '#ffffff',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#111827',
                          outline: 'none'
                        }}
                      >
                        {GENRE_OPTIONS.map((g, idx) => (
                          <option key={idx} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '15px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #047857, #10b981)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                        marginTop: '4px'
                      }}
                    >
                      ✨ 1초 만에 회원가입 완료하기
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
