import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Share2,
  Check,
  RotateCcw,
  Home,
  BookOpen,
  Heart,
  Sparkles,
  Music,
  CheckCircle,
  Circle,
  Calendar,
  Sparkle,
} from 'lucide-react';
import { BibleResultData } from '../types/bible';
import { BibleTTS } from '../lib/tts';
import { triggerBlessingConfetti } from '../lib/confetti';

interface BibleResultProps {
  data: BibleResultData;
  onRescan: () => void;
  onGoHome: () => void;
}

export const BibleResult: React.FC<BibleResultProps> = ({
  data,
  onRescan,
  onGoHome,
}) => {
  const {
    user,
    lifeStage,
    todayDateText,
    todayTheme,
    spiritualScore,
    verse,
    meditation,
    action,
    prayer,
    christianDaily,
    metrics,
  } = data;

  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [hasAmenClicked, setHasAmenClicked] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  // TTS 음성 재생 토글 (말씀 본문 + 1분 기도문 낭독)
  const handleToggleTTS = () => {
    if (isPlayingTTS) {
      BibleTTS.stop();
      setIsPlayingTTS(false);
    } else {
      const readText = `오늘의 성경 말씀. ${verse.reference}. ${verse.text}. 오늘의 1분 기도문. ${prayer.title}. ${prayer.body}`;
      setIsPlayingTTS(true);
      BibleTTS.speak(
        readText,
        () => setIsPlayingTTS(false),
        () => setIsPlayingTTS(false)
      );
    }
  };

  // 아멘 버튼 클릭 (축복의 빛 이펙트 & 감사 상태)
  const handleAmenClick = () => {
    triggerBlessingConfetti();
    setHasAmenClicked(true);
  };

  // 실천 과제 체크박스 토글
  const handleToggleAction = (id: string) => {
    setCheckedActions((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        triggerBlessingConfetti();
      }
      return next;
    });
  };

  // 전체 말씀 및 기도문 텍스트 클립보드 복사
  const handleCopyShare = async () => {
    const text = `[오늘 성경 말씀 To You]
${user.name ? `${user.name} 성도님` : '성도님'}을 위한 오늘 하루의 말씀과 기도입니다.

📖 오늘의 말씀: ${verse.reference}
"${verse.text}"

🌿 오늘의 묵상:
${meditation.reflectionText}

✨ 오늘 실천할 작은 일:
${action.items.map((it, i) => `${i + 1}. ${it.title}: ${it.description}`).join('\n')}

🙏 오늘의 1분 기도:
${prayer.body}

🎵 추천 찬양: ${christianDaily.recommendedPraise.title} (${christianDaily.recommendedPraise.artist})
- 오늘 성경 말씀 To You: https://lucky7lee.github.io/bible2you/`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const displayName = user.name
    ? `${user.name} ${user.title || '성도'}님`
    : `${user.title || '성도'}님`;

  return (
    <div className="result-container">
      {/* 1. 상단 사용자 요약 헤더 (한눈에 단정하게) */}
      <section className="profile-summary-bar">
        <div className="profile-left">
          {metrics.snapshotDataUrl ? (
            <img
              src={metrics.snapshotDataUrl}
              alt="스캔 스냅샷"
              className="user-avatar-circle"
            />
          ) : (
            <div className="user-avatar-placeholder">
              <Heart size={16} color="#fbbf24" />
            </div>
          )}
          <div className="profile-names">
            <div className="user-main-line">
              <strong>{displayName}</strong>
              <span className="stage-pill">{lifeStage.stage}</span>
            </div>
            <div className="user-sub-line">
              <span>{metrics.expression}</span>
              <span className="dot">·</span>
              <span className="score-text">은혜 지수 {spiritualScore}점</span>
            </div>
          </div>
        </div>

        <div className="date-badge-small">
          <Calendar size={11} />
          <span>{todayDateText}</span>
        </div>
      </section>

      {/* 2. 핵심: 오늘의 성경 말씀 카드 (가장 돋보이고 집중되는 카드) */}
      <section className="holy-verse-master-card">
        <div className="verse-top-row">
          <div className="verse-badge-group">
            <span className="verse-testament-pill">{verse.testament}</span>
            <h2 className="verse-reference-text">{verse.reference}</h2>
          </div>

          <button
            type="button"
            className={`verse-listen-btn ${isPlayingTTS ? 'speaking' : ''}`}
            onClick={handleToggleTTS}
            title={isPlayingTTS ? '낭독 정지' : '말씀 듣기'}
          >
            {isPlayingTTS ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isPlayingTTS ? '정지' : '말씀 듣기'}</span>
          </button>
        </div>

        <div className="verse-theme-caption">
          <Sparkle size={13} color="#fbbf24" />
          <span>{todayTheme}</span>
        </div>

        <blockquote className="verse-main-quote">
          “{verse.text}”
        </blockquote>

        <div className="verse-grace-meaning">
          <div className="meaning-tag">
            <Sparkle size={12} color="#fbbf24" />
            <span>오늘 내게 주시는 은혜의 의미</span>
          </div>
          <p>{verse.context}</p>
        </div>
      </section>

      {/* 3. 오늘 해야 할 묵상 내용 (마음 진단 & 묵상 질문) */}
      <section className="clean-section-card">
        <div className="section-title-row">
          <BookOpen size={16} color="#fbbf24" />
          <h3>오늘의 묵상과 마음 살피기</h3>
        </div>

        {/* 얼굴 상태와 마음을 비추는 따뜻한 진단 */}
        <div className="mind-reflection-box">
          <p className="diagnosis-paragraph">{meditation.faceSpiritualDiagnosis}</p>
          <p className="reflection-paragraph">{meditation.reflectionText}</p>
        </div>

        {/* 묵상 질문 3가지 */}
        <div className="questions-clean-list">
          <span className="questions-title">오늘 마음에 품을 묵상 질문</span>
          {meditation.questions.map((q, idx) => (
            <div key={idx} className="question-clean-item">
              <span className="q-badge">{idx + 1}</span>
              <span className="q-content">{q}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 오늘 하루 실천해야 할 작은 일 (체크리스트) */}
      <section className="clean-section-card">
        <div className="section-title-row">
          <CheckCircle size={16} color="#34d399" />
          <h3>오늘 하루 실천해야 할 작은 일</h3>
        </div>

        <div className="action-mission-headline">
          <span className="mission-tag">오늘의 미션</span>
          <strong>{action.coreMission}</strong>
        </div>

        <div className="checklist-container">
          {action.items.map((item) => {
            const isDone = !!checkedActions[item.id];
            return (
              <div
                key={item.id}
                className={`check-card ${isDone ? 'checked' : ''}`}
                onClick={() => handleToggleAction(item.id)}
              >
                <div className="check-indicator">
                  {isDone ? (
                    <CheckCircle size={19} color="#34d399" />
                  ) : (
                    <Circle size={19} color="#64748b" />
                  )}
                </div>
                <div className="check-info">
                  <h4 className="check-title">{item.title}</h4>
                  <p className="check-description">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. 오늘의 1분 기도문 & 세련된 아멘 버튼 */}
      <section className="clean-section-card prayer-card-highlight">
        <div className="section-title-row">
          <Sparkles size={16} color="#fbbf24" />
          <h3>{prayer.title}</h3>
        </div>

        <div className="prayer-clean-body">
          <p className="prayer-full-text">{prayer.body}</p>
          <div className="confession-banner">
            <span>오늘의 고백: </span>
            <strong>"{prayer.oneLineConfession}"</strong>
          </div>
        </div>

        {/* 아멘 버튼 (더 세련되고 와이드하게) */}
        <div className="amen-btn-area">
          <button
            type="button"
            className={`amen-glow-button ${hasAmenClicked ? 'active' : ''}`}
            onClick={handleAmenClick}
          >
            <Sparkles size={17} />
            <span>{hasAmenClicked ? '아멘으로 화답하셨습니다 🙏' : '아멘 (말씀을 마음에 품기) 🙏'}</span>
          </button>
        </div>
      </section>

      {/* 6. 추천 찬양 & 오늘의 영적 습관 (단정한 보너스 카드) */}
      <section className="praise-habit-compact-card">
        <div className="praise-part">
          <div className="part-label">
            <Music size={13} color="#60a5fa" />
            <span>오늘의 추천 찬양</span>
          </div>
          <p className="praise-main-text">
            <strong>{christianDaily.recommendedPraise.title}</strong>{' '}
            <span className="praise-artist">({christianDaily.recommendedPraise.artist})</span>
          </p>
          <p className="praise-lyric-quote">“{christianDaily.recommendedPraise.lyricSnippet}”</p>
        </div>

        <div className="habit-part">
          <div className="part-label">
            <Sparkle size={13} color="#fbbf24" />
            <span>작은 영적 습관 & 성경 읽기</span>
          </div>
          <p className="habit-text">{christianDaily.spiritualHabit}</p>
          <p className="reading-tag">📖 추천 본문: {christianDaily.readingSuggestion}</p>
        </div>
      </section>

      {/* 7. 하단 공유 & 네비게이션 버튼 (세련된 버튼 그룹) */}
      <footer className="result-footer-actions">
        <button
          type="button"
          className="btn-share-master"
          onClick={handleCopyShare}
        >
          {copiedText ? <Check size={18} color="#0a1128" /> : <Share2 size={18} />}
          <span>{copiedText ? '말씀과 기도가 복사되었습니다!' : '오늘의 말씀 & 기도 복사하여 나누기'}</span>
        </button>

        <div className="sub-nav-row">
          <button type="button" className="sub-btn" onClick={onRescan}>
            <RotateCcw size={15} />
            <span>다시 스캔하기</span>
          </button>

          <button type="button" className="sub-btn" onClick={onGoHome}>
            <Home size={15} />
            <span>처음으로</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
