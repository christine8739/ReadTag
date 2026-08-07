import React, { useState } from 'react';
import { Disc, Play, Pause, Volume2, Sparkles } from 'lucide-react';

export default function AudioTeaserDesign({ audioData }) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="audio-teaser-card">
      <div className="audio-teaser-header">
        <div className="audio-tag-badge">
          <Sparkles className="badge-sparkle-icon" />
          <span>1분 오디오북 티저</span>
        </div>
        <span className="audio-duration">01:00</span>
      </div>

      <div className="audio-player-body">
        {/* Cassette / Disc Icon */}
        <div className={`cassette-container ${isPlaying ? 'spinning' : ''}`}>
          <Disc className="cassette-icon" />
        </div>

        {/* Info & Waves */}
        <div className="audio-info-column">
          <div className="audio-title-row">
            <span className="audio-title">{audioData?.title || '1분 독파민 음성 처방전'}</span>
            <span className="audio-narrator">ReadTag AI</span>
          </div>

          {/* Cute Animated Equalizer Waves */}
          <div className="equalizer-container">
            {(audioData?.waveform || [40, 75, 30, 90, 60, 100, 45, 80, 65, 30, 85, 95, 50, 70, 40]).map((h, i) => (
              <span
                key={i}
                className={`eq-bar ${isPlaying ? 'animating' : ''}`}
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i % 5) * 0.15}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Cute Play/Pause Button (Visual Preview) */}
        <button
          type="button"
          className="audio-play-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "일시정지 (디자인용)" : "재생 (디자인용)"}
        >
          {isPlaying ? <Pause className="btn-icon" /> : <Play className="btn-icon" />}
        </button>
      </div>

      <div className="audio-footer-note">
        <Volume2 className="vol-icon" />
        <span>"완독 부담 NO! 1분 오디오북으로 책의 핵심 맛보기"</span>
      </div>
    </div>
  );
}
