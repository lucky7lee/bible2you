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
import { BibleResultData, Language } from '../types/bible';
import { triggerBlessingConfetti } from '../lib/confetti';
import { EXPRESSION_LABELS, TITLE_LABELS, UI_TEXT } from '../lib/i18n';

interface BibleResultProps {
  lang: Language;
  data: BibleResultData;
  onRescan: () => void;
  onGoHome: () => void;
}

export const BibleResult: React.FC<BibleResultProps> = ({
  lang,
  data,
  onRescan,
  onGoHome,
}) => {
  const t = UI_TEXT[lang];
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

  const titleKey = user.title || '성도';
  const displayName =
    lang === 'en'
      ? user.name?.trim()
        ? `${user.name.trim()} (${TITLE_LABELS.en[titleKey]})`
        : TITLE_LABELS.en[titleKey]
      : user.name?.trim()
      ? `${user.name.trim()} ${TITLE_LABELS.ko[titleKey]}님`
      : `${TITLE_LABELS.ko[titleKey]}님`;

  const expressionLabel = metrics.expressionKey
    ? EXPRESSION_LABELS[lang][metrics.expressionKey]
    : metrics.isSkippedScan
    ? EXPRESSION_LABELS[lang].skipped
    : lang === 'en'
    ? EXPRESSION_LABELS.en.peaceful
    : metrics.expression;

  // 전체 말씀 및 기도문 텍스트 클립보드 복사
  const handleCopyShare = async () => {
    const text =
      lang === 'en'
        ? `[${t.appName}]
Today's Word & Prayer for ${displayName}

1. ${t.sec1Title}
📖 ${verse.reference}
"${verse.text}"

2. ${t.sec2Title}
${meditation.reflectionText}

3. ${t.sec3Title}
${action.items.map((it, i) => `${i + 1}) ${it.title}: ${it.description}`).join('\n')}

4. ${prayer.title}
${prayer.body}
(${t.confessionLabel}"${prayer.oneLineConfession}")

5. ${t.sec5Title}
🎵 ${christianDaily.recommendedPraise.title} (${christianDaily.recommendedPraise.artist})
"${christianDaily.recommendedPraise.lyricSnippet}"

6. ${t.sec6Title}
🌿 ${christianDaily.spiritualHabit}
📖 ${t.readingLabel}: ${christianDaily.readingSuggestion}

- ${t.appName}: https://lucky7lee.github.io/bible2you/`
        : `[${t.appName}]
${displayName}을 위한 오늘 하루의 말씀과 기도입니다.

1. ${t.sec1Title}
📖 ${verse.reference}
"${verse.text}"

2. ${t.sec2Title}
${meditation.reflectionText}

3. ${t.sec3Title}
${action.items.map((it, i) => `${i + 1}) ${it.title}: ${it.description}`).join('\n')}

4. ${prayer.title}
${prayer.body}
(${t.confessionLabel}"${prayer.oneLineConfession}")

5. ${t.sec5Title}
🎵 ${christianDaily.recommendedPraise.title} (${christianDaily.recommendedPraise.artist})
"${christianDaily.recommendedPraise.lyricSnippet}"

6. ${t.sec6Title}
🌿 ${christianDaily.spiritualHabit}
📖 ${t.readingLabel}: ${christianDaily.readingSuggestion}

- ${t.appName}: https://lucky7lee.github.io/bible2you/`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      alert(t.copyFailAlert);
    }
  };

  return (
    <div className="result-container">
      {/* 0. 상단 프로필 & 요약 정보 (안정적인 2줄 카드) */}
      <section className="profile-header-card">
        {/* 1번째 줄: 아바타 + 이름 + 생애주기 / 날짜 */}
        <div className="profile-row-primary">
          <div className="profile-left-identity">
            {metrics.snapshotDataUrl ? (
              <img
                src={metrics.snapshotDataUrl}
                alt="Snapshot"
                className="user-avatar-circle"
              />
            ) : (
              <div className="user-avatar-placeholder">
                <Smile size={18} color="#fbbf24" />
              </div>
            )}
            <div className="user-identity-text">
              <span className="user-name-title">{displayName}</span>
              <span className="stage-badge">
                {lifeStage.stage} ({t.ageText(lifeStage.age)})
              </span>
            </div>
          </div>

          <div className="date-badge-wrap">
            <Calendar size={12} />
            <span>{todayDateText}</span>
          </div>
        </div>

        {/* 2번째 줄: 오늘의 얼굴 상태(또는 기본 정보 묵상) / 은혜 지수 */}
        <div className="profile-row-secondary">
          <div className="face-expression-pill">
            <Sparkle size={12} color="#fbbf24" />
            <span>{expressionLabel}</span>
          </div>

          <div className="grace-score-pill">
            <span>{t.graceScoreLabel}</span>
            <strong>
              {spiritualScore}
              {t.scoreUnit}
            </strong>
          </div>
        </div>
      </section>

      {/* =========================================================================
          1. 나에게 들려주는 오늘의 말씀 (골드 테두리 강조, 1.5배 큰 글씨)
          ========================================================================= */}
      <section className="ordered-section-card verse-highlight-card">
        <div className="section-header-bar">
          <div className="section-number-badge gold">1</div>
          <h3 className="section-title-text gold">{t.sec1Title}</h3>
        </div>

        <div className="verse-card-body">
          <div className="verse-meta-row">
            <span className="testament-pill">{verse.testament}</span>
            <span className="verse-reference-title">{verse.reference}</span>
          </div>

          <div className="verse-theme-quote-tag">
            <span>
              {t.themeLabel} {todayTheme}
            </span>
          </div>

          <blockquote className="verse-magnified-text">
            “{verse.text}”
          </blockquote>

          <div className="verse-meaning-box">
            <span className="meaning-title">{t.meaningTitle}</span>
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
          <h3 className="section-title-text">{t.sec2Title}</h3>
        </div>

        <div className="section-card-content">
          <div className="diagnosis-box">
            <p>{meditation.faceSpiritualDiagnosis}</p>
          </div>

          <div className="reflection-text-box">
            <h4>{t.meditationGuideTitle}</h4>
            <p>{meditation.reflectionText}</p>
          </div>

          <div className="reflection-questions-wrap">
            <h4>{t.meditationQuestionsTitle}</h4>
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
          <h3 className="section-title-text">{t.sec3Title}</h3>
        </div>

        <div className="section-card-content">
          <div className="core-mission-box">
            <span className="mission-tag">{t.coreMissionTag}</span>
            <p className="mission-content">{action.coreMission}</p>
          </div>

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
          <p className="checklist-subtip">{t.checklistTip}</p>
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
              <span>{t.confessionLabel}</span>
              <strong>"{prayer.oneLineConfession}"</strong>
            </div>
          </div>

          <div className="amen-button-container">
            <button
              type="button"
              className={`amen-glow-btn ${hasAmenClicked ? 'amen-done' : ''}`}
              onClick={handleAmenClick}
            >
              <Sparkles size={18} />
              <span>{hasAmenClicked ? t.amenDoneBtn : t.amenBtn}</span>
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
          <h3 className="section-title-text">{t.sec5Title}</h3>
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
          <h3 className="section-title-text">{t.sec6Title}</h3>
        </div>

        <div className="section-card-content">
          <div className="habit-info-card">
            <div className="habit-row">
              <Compass size={15} color="#34d399" />
              <div className="habit-text-group">
                <span className="habit-label">{t.habitLabel}</span>
                <p className="habit-desc">{christianDaily.spiritualHabit}</p>
              </div>
            </div>

            <div className="reading-row">
              <BookOpen size={15} color="#fbbf24" />
              <div className="habit-text-group">
                <span className="habit-label">{t.readingLabel}</span>
                <p className="reading-target">{christianDaily.readingSuggestion}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          하단 공유 및 네비게이션 버튼 ("처음으로" 먼저, "다시 스캔하기" 다음!)
          ========================================================================= */}
      <footer className="result-actions-footer">
        <button
          type="button"
          className="btn-share-master"
          onClick={handleCopyShare}
        >
          {copiedText ? <Check size={18} color="#0a1128" /> : <Share2 size={18} />}
          <span>{copiedText ? t.shareCopiedBtn : t.shareBtn}</span>
        </button>

        <div className="sub-nav-buttons-row">
          <button type="button" className="btn-sub-nav" onClick={onGoHome}>
            <Home size={15} />
            <span>{t.homeBtn}</span>
          </button>

          <button type="button" className="btn-sub-nav" onClick={onRescan}>
            <RotateCcw size={15} />
            <span>{t.rescanBtn}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
