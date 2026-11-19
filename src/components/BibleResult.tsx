import React, { useState } from 'react';
import {
  Share2,
  Check,
  RotateCcw,
  Home,
  BookOpen,
  Sparkles,
  Music,
  CheckCircle,
  Circle,
  Calendar,
  Sparkle,
  Smile,
  Compass,
} from 'lucide-react';
import { BibleResultData } from '../types/bible';
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

  const [hasAmenClicked, setHasAmenClicked] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

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

1. 나에게 들려주는 오늘의 말씀
📖 ${verse.reference}
"${verse.text}"

2. 오늘의 묵상과 말씀 살피기
${meditation.reflectionText}

3. 오늘 하루 실천해야 할 작은 일
${action.items.map((it, i) => `${i + 1}) ${it.title}: ${it.description}`).join('\n')}

4. 오늘의 1분 기도
${prayer.body}
(오늘의 한 줄 고백: "${prayer.oneLineConfession}")

5. 오늘의 추천 찬양
🎵 ${christianDaily.recommendedPraise.title} (${christianDaily.recommendedPraise.artist})
"${christianDaily.recommendedPraise.lyricSnippet}"

6. 작은 영적 습관 & 성경 읽기
🌿 ${christianDaily.spiritualHabit}
📖 추천 본문: ${christianDaily.readingSuggestion}

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
      {/* 0. 상단 프로필 & 요약 정보 (망가지지 않는 안정적인 2줄 카드) */}
      <section className="profile-header-card">
        {/* 1번째 줄: 아바타 + 이름 + 생애주기 / 날짜 */}
        <div className="profile-row-primary">
          <div className="profile-left-identity">
            {metrics.snapshotDataUrl ? (
              <img
                src={metrics.snapshotDataUrl}
                alt="스캔 스냅샷"
                className="user-avatar-circle"
              />
            ) : (
              <div className="user-avatar-placeholder">
                <Smile size={18} color="#fbbf24" />
              </div>
            )}
            <div className="user-identity-text">
              <span className="user-name-title">{displayName}</span>
              <span className="stage-badge">{lifeStage.stage} (만 {lifeStage.age}세)</span>
            </div>
          </div>

          <div className="date-badge-wrap">
            <Calendar size={12} />
            <span>{todayDateText}</span>
          </div>
        </div>

        {/* 2번째 줄: 오늘의 얼굴 상태 / 은혜 지수 */}
        <div className="profile-row-secondary">
          <div className="face-expression-pill">
            <Sparkle size={12} color="#fbbf24" />
            <span>{metrics.expression}</span>
          </div>

          <div className="grace-score-pill">
            <span>은혜 지수</span>
            <strong>{spiritualScore}점</strong>
          </div>
        </div>
      </section>

      {/* =========================================================================
          1. 나에게 들려주는 오늘의 말씀 (골드 테두리 강조, 1.5배 큰 글씨, 듣기 버튼 제거)
          ========================================================================= */}
      <section className="ordered-section-card verse-highlight-card">
        <div className="section-header-bar">
          <div className="section-number-badge gold">1</div>
          <h3 className="section-title-text gold">나에게 들려주는 오늘의 말씀</h3>
        </div>

        <div className="verse-card-body">
          <div className="verse-meta-row">
            <span className="testament-pill">{verse.testament}</span>
            <span className="verse-reference-title">{verse.reference}</span>
          </div>

          <div className="verse-theme-quote-tag">
            <span>오늘의 테마: {todayTheme}</span>
          </div>

          {/* 1.5배 커진 위엄 있는 성경 본문 말씀 */}
          <blockquote className="verse-magnified-text">
            “{verse.text}”
          </blockquote>

          <div className="verse-meaning-box">
            <span className="meaning-title">말씀의 은혜 조명</span>
            <p className="meaning-desc">{verse.context}</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. 오늘의 묵상과 말씀 살피기
          ========================================================================= */}
      <section className="ordered-section-card">
        <div className="section-header-bar">
          <div className="section-number-badge">2</div>
          <h3 className="section-title-text">오늘의 묵상과 말씀 살피기</h3>
        </div>

        <div className="section-card-content">
          {/* 얼굴 상태와 마음을 비추는 영적 진단 */}
          <div className="diagnosis-box">
            <p>{meditation.faceSpiritualDiagnosis}</p>
          </div>

          {/* 깊은 묵상 가이드 */}
          <div className="reflection-text-box">
            <h4>묵상 가이드</h4>
            <p>{meditation.reflectionText}</p>
          </div>

          {/* 마음에 품을 질문 */}
          <div className="reflection-questions-wrap">
            <h4>오늘 하루 마음에 품을 묵상 질문</h4>
            <div className="questions-list">
              {meditation.questions.map((q, idx) => (
                <div key={idx} className="question-item">
                  <span className="q-badge">{idx + 1}</span>
                  <span className="q-text">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. 오늘 하루 실천해야 할 작은 일
          ========================================================================= */}
      <section className="ordered-section-card">
        <div className="section-header-bar">
          <div className="section-number-badge green">3</div>
          <h3 className="section-title-text">오늘 하루 실천해야 할 작은 일</h3>
        </div>

        <div className="section-card-content">
          {/* 핵심 미션 */}
          <div className="core-mission-box">
            <span className="mission-tag">오늘의 핵심 실천</span>
            <p className="mission-content">{action.coreMission}</p>
          </div>

          {/* 3가지 실천 체크리스트 */}
          <div className="checklist-group">
            {action.items.map((item) => {
              const isDone = !!checkedActions[item.id];
              return (
                <div
                  key={item.id}
                  className={`check-card ${isDone ? 'checked' : ''}`}
                  onClick={() => handleToggleAction(item.id)}
                >
                  <div className="check-box-icon">
                    {isDone ? (
                      <CheckCircle size={20} color="#34d399" />
                    ) : (
                      <Circle size={20} color="#64748b" />
                    )}
                  </div>
                  <div className="check-text-wrap">
                    <span className="check-title">{item.title}</span>
                    <p className="check-desc">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="checklist-subtip">항목을 터치하여 오늘 실천을 체크해 보세요.</p>
        </div>
      </section>

      {/* =========================================================================
          4. 오늘의 1분 기도 (세련된 아멘 버튼 포함)
          ========================================================================= */}
      <section className="ordered-section-card prayer-highlight-card">
        <div className="section-header-bar">
          <div className="section-number-badge gold">4</div>
          <h3 className="section-title-text gold">{prayer.title}</h3>
        </div>

        <div className="section-card-content">
          <div className="prayer-text-wrap">
            <p className="prayer-content-text">{prayer.body}</p>
            <div className="confession-pill">
              <span>오늘의 고백: </span>
              <strong>"{prayer.oneLineConfession}"</strong>
            </div>
          </div>

          {/* 세련된 아멘 버튼 */}
          <div className="amen-button-container">
            <button
              type="button"
              className={`amen-glow-btn ${hasAmenClicked ? 'amen-done' : ''}`}
              onClick={handleAmenClick}
            >
              <Sparkles size={18} />
              <span>{hasAmenClicked ? '아멘으로 화답하셨습니다 🙏' : '아멘 (말씀을 마음에 품기) 🙏'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. 오늘의 추천 찬양
          ========================================================================= */}
      <section className="ordered-section-card">
        <div className="section-header-bar">
          <div className="section-number-badge blue">5</div>
          <h3 className="section-title-text">오늘의 추천 찬양</h3>
        </div>

        <div className="section-card-content">
          <div className="praise-info-card">
            <div className="praise-header-line">
              <Music size={16} color="#60a5fa" />
              <strong className="praise-title">{christianDaily.recommendedPraise.title}</strong>
              <span className="praise-artist">({christianDaily.recommendedPraise.artist})</span>
            </div>
            <p className="praise-lyric-quote">“{christianDaily.recommendedPraise.lyricSnippet}”</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. 작은 영적 습관 & 성경 읽기
          ========================================================================= */}
      <section className="ordered-section-card">
        <div className="section-header-bar">
          <div className="section-number-badge olive">6</div>
          <h3 className="section-title-text">작은 영적 습관 & 성경 읽기</h3>
        </div>

        <div className="section-card-content">
          <div className="habit-info-card">
            <div className="habit-row">
              <Compass size={15} color="#34d399" />
              <div className="habit-text-group">
                <span className="habit-label">오늘의 작은 영적 습관</span>
                <p className="habit-desc">{christianDaily.spiritualHabit}</p>
              </div>
            </div>

            <div className="reading-row">
              <BookOpen size={15} color="#fbbf24" />
              <div className="habit-text-group">
                <span className="habit-label">추천 성경 본문</span>
                <p className="reading-target">{christianDaily.readingSuggestion}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          하단 공유 및 네비게이션 버튼 (세련된 마스터 버튼)
          ========================================================================= */}
      <footer className="result-actions-footer">
        <button
          type="button"
          className="btn-share-master"
          onClick={handleCopyShare}
        >
          {copiedText ? <Check size={18} color="#0a1128" /> : <Share2 size={18} />}
          <span>{copiedText ? '말씀과 기도가 복사되었습니다!' : '오늘의 말씀 & 기도 복사하여 나누기'}</span>
        </button>

        <div className="sub-nav-buttons-row">
          <button type="button" className="btn-sub-nav" onClick={onRescan}>
            <RotateCcw size={15} />
            <span>다시 스캔하기</span>
          </button>

          <button type="button" className="btn-sub-nav" onClick={onGoHome}>
            <Home size={15} />
            <span>처음으로</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
