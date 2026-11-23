import React, { useState, useEffect } from 'react';
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
  Gift,
  PlayCircle,
  Users,
  Briefcase,
  Heart,
  Moon,
  Loader2,
} from 'lucide-react';
import { BibleResultData, Language } from '../types/bible';
import { triggerBlessingConfetti } from '../lib/confetti';
import { EXPRESSION_LABELS, TITLE_LABELS, UI_TEXT } from '../lib/i18n';
import { getBonusGraceData } from '../lib/bonusGrace';

interface BibleResultProps {
  lang: Language;
  data: BibleResultData;
  initialCheckedActions?: Record<string, boolean>;
  initialAmenClicked?: boolean;
  initialBonusUnlocked?: boolean;
  onProgressChange?: (
    checkedActions: Record<string, boolean>,
    hasAmenClicked: boolean,
    hasUnlockedBonus: boolean
  ) => void;
  onRescan: () => void;
  onGoHome: () => void;
}

export const BibleResult: React.FC<BibleResultProps> = ({
  lang,
  data,
  initialCheckedActions,
  initialAmenClicked = false,
  initialBonusUnlocked = false,
  onProgressChange,
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

  // 이전 저장 데이터 호환용 폴백 포함
  const bonus = data.bonus || getBonusGraceData(metrics.dominantMood || 'peace', lang);

  const [hasAmenClicked, setHasAmenClicked] = useState(initialAmenClicked);
  const [bonusUnlocked, setBonusUnlocked] = useState(initialBonusUnlocked);
  const [isLoadingRewardAd, setIsLoadingRewardAd] = useState(false);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>(
    initialCheckedActions || {}
  );

  // Android 보상형 광고 완료/취소 글로벌 콜백 등록
  useEffect(() => {
    const win = window as unknown as {
      __onDayBibleRewardEarned?: () => void;
      __onDayBibleRewardCancelled?: () => void;
    };

    win.__onDayBibleRewardEarned = () => {
      setIsLoadingRewardAd(false);
      setRewardNotice(null);
      setBonusUnlocked(true);
      triggerBlessingConfetti();
      if (onProgressChange) {
        onProgressChange(checkedActions, hasAmenClicked, true);
      }
      setTimeout(() => {
        document.getElementById('sec-7')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    };

    win.__onDayBibleRewardCancelled = () => {
      setIsLoadingRewardAd(false);
      setRewardNotice(t.rewardCancelMsg);
    };

    return () => {
      delete win.__onDayBibleRewardEarned;
      delete win.__onDayBibleRewardCancelled;
    };
  }, [checkedActions, hasAmenClicked, onProgressChange, t.rewardCancelMsg]);

  // 보상형 애드몹 버튼 클릭 핸들러
  const handleWatchRewardedAd = () => {
    if (isLoadingRewardAd || bonusUnlocked) return;
    setRewardNotice(null);
    setIsLoadingRewardAd(true);

    const bridge = (
      window as unknown as {
        DayBibleAndroid?: { showRewardedAd?: () => void };
      }
    ).DayBibleAndroid;

    if (bridge && typeof bridge.showRewardedAd === 'function') {
      // Android 네이티브 Google AdMob 보상형 광고 실행
      try {
        bridge.showRewardedAd();
      } catch {
        setIsLoadingRewardAd(false);
        setBonusUnlocked(true);
        triggerBlessingConfetti();
        onProgressChange?.(checkedActions, hasAmenClicked, true);
      }
    } else {
      // 웹 브라우저 환경에서는 짧은 연출 후 바로 심층 은혜 잠금 해제
      window.setTimeout(() => {
        setIsLoadingRewardAd(false);
        setBonusUnlocked(true);
        triggerBlessingConfetti();
        if (onProgressChange) {
          onProgressChange(checkedActions, hasAmenClicked, true);
        }
        setTimeout(() => {
          document.getElementById('sec-7')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }, 900);
    }
  };

  // 아멘 버튼 클릭 (축복의 빛 이펙트 & 감사 상태 영속 저장)
  const handleAmenClick = () => {
    triggerBlessingConfetti();
    setHasAmenClicked(true);
    if (onProgressChange) {
      onProgressChange(checkedActions, true, bonusUnlocked);
    }
  };

  // 실천 과제 체크박스 토글 (영속 저장)
  const handleToggleAction = (id: string) => {
    setCheckedActions((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        triggerBlessingConfetti();
      }
      if (onProgressChange) {
        onProgressChange(next, hasAmenClicked, bonusUnlocked);
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

  const completedCount = action.items.filter((it) => checkedActions[it.id]).length;
  const totalActions = action.items.length;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

        {/* 2번째 줄: 오늘의 얼굴 상태(또는 기본 정보 묵상) / 은혜 지수 게이지 */}
        <div className="profile-row-secondary">
          <div className="face-expression-pill">
            <Sparkle size={12} color="#fbbf24" />
            <span>{expressionLabel}</span>
          </div>

          <div className="grace-score-pill">
            <span>{t.graceScoreLabel}</span>
            <div className="grace-mini-bar" aria-hidden="true">
              <div
                className="grace-mini-fill"
                style={{ width: `${Math.min(100, Math.max(0, spiritualScore))}%` }}
              />
            </div>
            <strong>
              {spiritualScore}
              {t.scoreUnit}
            </strong>
          </div>
        </div>
      </section>

      {/* 한눈에 보는 6단계 빠른 목차 바 */}
      <nav className="quick-nav-strip" aria-label="Quick navigation">
        <button type="button" className="quick-nav-pill gold" onClick={() => scrollToSection('sec-1')}>
          {t.nav1}
        </button>
        <button type="button" className="quick-nav-pill" onClick={() => scrollToSection('sec-2')}>
          {t.nav2}
        </button>
        <button type="button" className="quick-nav-pill" onClick={() => scrollToSection('sec-3')}>
          {t.nav3}
        </button>
        <button type="button" className="quick-nav-pill" onClick={() => scrollToSection('sec-4')}>
          {t.nav4}
        </button>
        <button type="button" className="quick-nav-pill" onClick={() => scrollToSection('sec-5')}>
          {t.nav5}
        </button>
        <button type="button" className="quick-nav-pill" onClick={() => scrollToSection('sec-6')}>
          {t.nav6}
        </button>
      </nav>

      {/* =========================================================================
          1. 나에게 들려주는 오늘의 말씀 (골드 테두리 강조, 1.5배 큰 글씨)
          ========================================================================= */}
      <section id="sec-1" className="ordered-section-card verse-highlight-card">
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
      <section id="sec-2" className="ordered-section-card">
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
      <section id="sec-3" className="ordered-section-card">
        <div className="section-header-bar">
          <div className="section-number-badge green">3</div>
          <h3 className="section-title-text">{t.sec3Title}</h3>
          <span className={`done-count-pill ${completedCount === totalActions ? 'all-done' : ''}`}>
            {t.doneCount(completedCount, totalActions)}
          </span>
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
      <section id="sec-4" className="ordered-section-card prayer-highlight-card">
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
      <section id="sec-5" className="ordered-section-card">
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
      <section id="sec-6" className="ordered-section-card">
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
          보상형 애드몹 버튼 (잠금 해제 전) 또는 7~10번 심층 은혜 카드 (잠금 해제 후)
          ========================================================================= */}
      {!bonusUnlocked ? (
        <section className="reward-unlock-card">
          <div className="reward-badge-row">
            <Gift size={14} color="#fef08a" />
            <span>{t.rewardCardBadge}</span>
          </div>

          <h3 className="reward-card-title">{t.rewardCardTitle}</h3>
          <p className="reward-card-desc">{t.rewardCardDesc}</p>

          <div className="reward-preview-chips">
            <span className="reward-preview-chip">7. {t.sec7Title}</span>
            <span className="reward-preview-chip">8. {t.sec8Title}</span>
            <span className="reward-preview-chip">9. {t.sec9Title}</span>
            <span className="reward-preview-chip">10. {t.sec10Title}</span>
          </div>

          {rewardNotice && (
            <div className="reward-notice-text">{rewardNotice}</div>
          )}

          <button
            type="button"
            className="reward-watch-btn"
            onClick={handleWatchRewardedAd}
            disabled={isLoadingRewardAd}
          >
            {isLoadingRewardAd ? (
              <Loader2 size={18} className="spin-icon" />
            ) : (
              <PlayCircle size={18} />
            )}
            <span>{isLoadingRewardAd ? t.rewardBtnLoading : t.rewardBtn}</span>
          </button>
        </section>
      ) : (
        <>
          <div className="reward-unlocked-banner">{t.rewardUnlockedBanner}</div>

          {/* 7. 연관 성경 구절 & 성경 인물 이야기 */}
          <section id="sec-7" className="ordered-section-card bonus-section-card">
            <div className="section-header-bar">
              <div className="section-number-badge purple">7</div>
              <h3 className="section-title-text">{t.sec7Title}</h3>
            </div>

            <div className="section-card-content">
              <div className="companion-verse-box">
                <span className="bonus-sub-label">
                  {t.companionVerseLabel} · {bonus.companionVerseRef}
                </span>
                <p className="companion-verse-text">“{bonus.companionVerseText}”</p>
              </div>

              <div className="biblical-figure-box">
                <span className="bonus-sub-label">
                  {t.biblicalFigureLabel} — {bonus.biblicalFigureName}
                </span>
                <p className="bonus-body-text">{bonus.biblicalFigureStory}</p>
              </div>
            </div>
          </section>

          {/* 8. 오늘의 인간관계 & 일터의 지혜 */}
          <section id="sec-8" className="ordered-section-card bonus-section-card">
            <div className="section-header-bar">
              <div className="section-number-badge purple">8</div>
              <h3 className="section-title-text">{t.sec8Title}</h3>
            </div>

            <div className="section-card-content">
              <div className="wisdom-item-row">
                <Users size={15} color="#93c5fd" style={{ flexShrink: 0, marginTop: 2 }} />
                <div className="habit-text-group">
                  <span className="habit-label">{t.relationWisdomLabel}</span>
                  <p className="bonus-body-text">{bonus.relationshipWisdom}</p>
                </div>
              </div>

              <div className="wisdom-item-row">
                <Briefcase size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
                <div className="habit-text-group">
                  <span className="habit-label">{t.workWisdomLabel}</span>
                  <p className="bonus-body-text">{bonus.workWisdom}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 9. 오늘의 감사 노트 3가지 & 마음 다스림 */}
          <section id="sec-9" className="ordered-section-card bonus-section-card">
            <div className="section-header-bar">
              <div className="section-number-badge purple">9</div>
              <h3 className="section-title-text">{t.sec9Title}</h3>
            </div>

            <div className="section-card-content">
              <div className="gratitude-seeds-wrap">
                <span className="bonus-sub-label">{t.gratitudeSeedsLabel}</span>
                <div className="questions-list">
                  {bonus.gratitudeSeeds.map((seed, idx) => (
                    <div key={idx} className="question-item">
                      <span className="q-badge">{idx + 1}</span>
                      <span className="q-text">{seed}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="peace-tip-box">
                <Heart size={14} color="#f472b6" style={{ flexShrink: 0, marginTop: 2 }} />
                <div className="habit-text-group">
                  <span className="habit-label">{t.peaceTipLabel}</span>
                  <p className="bonus-body-text">{bonus.peaceTip}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. 하루를 마감하는 저녁 축복 기도 */}
          <section id="sec-10" className="ordered-section-card bonus-section-card evening-prayer-card">
            <div className="section-header-bar">
              <div className="section-number-badge gold">10</div>
              <h3 className="section-title-text gold">{bonus.eveningPrayerTitle}</h3>
            </div>

            <div className="section-card-content">
              <div className="prayer-text-wrap">
                <p className="prayer-content-text">{bonus.eveningPrayerBody}</p>
                <div className="confession-pill">
                  <Moon size={13} color="#fef08a" style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
                  <span>{t.eveningBlessingLabel}</span>
                  <strong>"{bonus.eveningBlessingLine}"</strong>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

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
