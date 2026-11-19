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
  Bookmark,
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
    themeSubtitle,
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
      // 체크되는 순간 가벼운 파티클
      if (next[id]) {
        triggerBlessingConfetti();
      }
      return next;
    });
  };

  // 전체 말씀 및 기도문 텍스트 클립보드 복사
  const handleCopyShare = async () => {
    const text = `[오늘 성경 말씀 To You - ${user.name || '성도'}님을 위한 은혜의 선물]

📖 오늘의 말씀: ${verse.reference}
"${verse.text}"

🌿 오늘의 묵상:
${meditation.reflectionText}

✨ 오늘 실천할 작은 일:
${action.items.map((it, i) => `${i + 1}. ${it.title} - ${it.description}`).join('\n')}

🙏 오늘의 1분 기도:
${prayer.body}

🎵 추천 찬양: ${christianDaily.recommendedPraise.title} (${christianDaily.recommendedPraise.artist})
- 오늘 성경 말씀 To You (https://lucky7lee.github.io/bible2you/)`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const displayName = user.name ? `${user.name} ${user.title || '성도'}님` : `${user.title || '성도'}님`;

  return (
    <div className="result-container">
      {/* 1. 상단 사용자 뱃지 & 오늘의 은혜 테마 */}
      <section className="result-header-card">
        <div className="profile-top-row">
          <div className="user-info-chip">
            {metrics.snapshotDataUrl ? (
              <img
                src={metrics.snapshotDataUrl}
                alt="얼굴 스캔 스냅샷"
                className="user-snapshot-avatar"
              />
            ) : (
              <div className="user-default-avatar">
                <Heart size={16} color="#fbbf24" />
              </div>
            )}
            <div className="user-text-info">
              <span className="user-name-title">{displayName}</span>
              <span className="user-lifestage">
                {lifeStage.stage} (만 {lifeStage.age}세) · {metrics.expression}
              </span>
            </div>
          </div>

          <div className="date-chip">
            <Calendar size={12} />
            <span>{todayDateText}</span>
          </div>
        </div>

        {/* 은혜 점수 링 & 메인 테마 타이틀 */}
        <div className="spiritual-score-box">
          <div className="score-ring">
            <span className="score-number">{spiritualScore}</span>
            <span className="score-label">은혜 지수</span>
          </div>

          <div className="theme-text-wrap">
            <span className="theme-badge">오늘의 영적 비전</span>
            <h2 className="today-main-theme">{todayTheme}</h2>
            <p className="today-sub-theme">{themeSubtitle}</p>
          </div>
        </div>

        {/* 얼굴에서 읽어낸 은혜의 특징 3가지 */}
        <div className="highlights-pills">
          {metrics.faceHighlights.map((hl, idx) => (
            <span key={idx} className="highlight-pill">
              <Sparkle size={12} color="#fbbf24" />
              <span>{hl}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 2. 핵심: 나에게 해당하는 오늘의 성경 말씀 카드 */}
      <section className="verse-sacred-card">
        <div className="verse-header-bar">
          <div className="verse-tag">
            <Bookmark size={15} />
            <span>오늘의 성경 말씀 · {verse.testament}</span>
          </div>

          <button
            type="button"
            className={`tts-button ${isPlayingTTS ? 'playing' : ''}`}
            onClick={handleToggleTTS}
            title={isPlayingTTS ? '낭독 멈추기' : '말씀 듣기'}
          >
            {isPlayingTTS ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isPlayingTTS ? '낭독 중지' : '말씀 듣기'}</span>
          </button>
        </div>

        <div className="verse-content-box">
          <div className="verse-ref-badge">{verse.reference}</div>
          <blockquote className="verse-bible-text">
            “{verse.text}”
          </blockquote>
        </div>

        {/* 말씀 배경 및 은혜의 조명 */}
        <div className="verse-context-box">
          <div className="context-label">말씀의 은혜 조명</div>
          <p className="context-text">{verse.context}</p>
        </div>
      </section>

      {/* 3. 오늘 해야 할 묵상 내용 카드 */}
      <section className="meditation-card">
        <div className="card-section-title">
          <BookOpen size={18} color="#f59e0b" />
          <h3>오늘의 마음 진단과 묵상</h3>
        </div>

        <div className="spiritual-diagnosis-box">
          <p>{meditation.faceSpiritualDiagnosis}</p>
        </div>

        <div className="reflection-guide-box">
          <h4>깊은 묵상의 길</h4>
          <p>{meditation.reflectionText}</p>
        </div>

        <div className="reflection-questions-box">
          <h4>오늘 마음에 품을 3가지 질문</h4>
          <ul className="questions-list">
            {meditation.questions.map((q, idx) => (
              <li key={idx} className="question-item">
                <span className="q-number">{idx + 1}</span>
                <span className="q-text">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. 오늘 하루 실천해야 할 작은 일 (체크리스트) */}
      <section className="action-card">
        <div className="card-section-title">
          <CheckCircle size={18} color="#34d399" />
          <h3>오늘 하루 실천해야 할 작은 일</h3>
        </div>

        <div className="core-mission-banner">
          <span className="mission-label">핵심 미션</span>
          <p className="mission-text">{action.coreMission}</p>
        </div>

        <div className="action-items-list">
          {action.items.map((item) => {
            const isDone = !!checkedActions[item.id];
            return (
              <div
                key={item.id}
                className={`action-item-card ${isDone ? 'done' : ''}`}
                onClick={() => handleToggleAction(item.id)}
              >
                <div className="check-box-icon">
                  {isDone ? (
                    <CheckCircle size={20} color="#34d399" />
                  ) : (
                    <Circle size={20} color="#94a3b8" />
                  )}
                </div>
                <div className="action-text-wrap">
                  <h4 className="action-title">{item.title}</h4>
                  <p className="action-desc">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="action-tip">항목을 탭하여 실천 완료를 표시해 보세요.</p>
      </section>

      {/* 5. 오늘의 1분 기도문 카드 */}
      <section className="prayer-sacred-card">
        <div className="card-section-title">
          <Sparkles size={18} color="#fbbf24" />
          <h3>{prayer.title}</h3>
        </div>

        <div className="prayer-body-box">
          <p className="prayer-text">{prayer.body}</p>
          <div className="prayer-confession-pill">
            <span>오늘의 한 줄 고백: </span>
            <strong>"{prayer.oneLineConfession}"</strong>
          </div>
        </div>

        {/* 아멘 버튼 */}
        <div className="amen-button-wrap">
          <button
            type="button"
            className={`amen-btn ${hasAmenClicked ? 'amen-done' : ''}`}
            onClick={handleAmenClick}
          >
            <Sparkles size={18} />
            <span>{hasAmenClicked ? '아멘으로 화답하셨습니다 🙏' : '아멘 (말씀을 마음에 품기) 🙏'}</span>
          </button>
        </div>
      </section>

      {/* 6. 기독교인이 오늘 해야 할 일 (찬양, 감사, 영적 습관) */}
      <section className="daily-christian-card">
        <div className="card-section-title">
          <Heart size={18} color="#f472b6" />
          <h3>오늘 기독교인을 위한 은혜의 선물</h3>
        </div>

        <div className="christian-tips-grid">
          {/* 오늘의 추천 찬양 */}
          <div className="tip-box">
            <div className="tip-header">
              <Music size={15} color="#60a5fa" />
              <strong>오늘의 추천 찬양</strong>
            </div>
            <p className="praise-title-artist">
              {christianDaily.recommendedPraise.title}{' '}
              <span>({christianDaily.recommendedPraise.artist})</span>
            </p>
            <p className="praise-lyric">“{christianDaily.recommendedPraise.lyricSnippet}”</p>
          </div>

          {/* 오늘 챙길 작은 영적 습관 */}
          <div className="tip-box">
            <div className="tip-header">
              <Sparkle size={15} color="#fbbf24" />
              <strong>오늘의 작은 영적 습관</strong>
            </div>
            <p className="tip-desc">{christianDaily.spiritualHabit}</p>
            <p className="reading-tag">📖 추천 성경 읽기: {christianDaily.readingSuggestion}</p>
          </div>
        </div>
      </section>

      {/* 7. 하단 공유 및 액션 버튼들 */}
      <footer className="result-bottom-actions">
        <button
          type="button"
          className="btn-share-gold"
          onClick={handleCopyShare}
        >
          {copiedText ? <Check size={18} color="#34d399" /> : <Share2 size={18} />}
          <span>{copiedText ? '말씀과 기도가 복사되었습니다!' : '오늘의 말씀 & 기도 복사하여 나누기'}</span>
        </button>

        <div className="result-nav-buttons">
          <button type="button" className="btn-rescan" onClick={onRescan}>
            <RotateCcw size={16} />
            <span>다시 스캔하기</span>
          </button>

          <button type="button" className="btn-home" onClick={onGoHome}>
            <Home size={16} />
            <span>처음으로</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
