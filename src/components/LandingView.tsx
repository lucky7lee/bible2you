import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  ImagePlus,
  ShieldCheck,
  Sparkles,
  Calendar,
  User,
  Heart,
  Sparkle,
  Loader2,
} from 'lucide-react';
import { ChristianTitle, Language, UserProfile } from '../types/bible';
import { getTodayDateText } from '../lib/bibleEngine';
import { TITLE_LABELS, UI_TEXT } from '../lib/i18n';

interface LandingViewProps {
  lang: Language;
  user: UserProfile;
  hasTodayWord: boolean;
  onChangeUser: (next: UserProfile) => void;
  onStartCamera: () => void;
  onViewTodayWord: () => void;
  onUploadPhoto: (file: File) => void;
  onSkipScan: () => void;
  isPhotoAnalyzing: boolean;
  photoError: string | null;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1920 + 1 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const CHRISTIAN_TITLES: ChristianTitle[] = [
  '성도',
  '청년',
  '형제',
  '자매',
  '집사',
  '권사',
  '장로',
  '목회자',
];

export const LandingView: React.FC<LandingViewProps> = ({
  lang,
  user,
  hasTodayWord,
  onChangeUser,
  onStartCamera,
  onViewTodayWord,
  onUploadPhoto,
  onSkipScan,
  isPhotoAnalyzing,
  photoError,
}) => {
  const t = UI_TEXT[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    setValidationError(null);
  }, [lang]);

  useEffect(() => {
    if (user.birthDate) {
      const parts = user.birthDate.split('-');
      if (parts.length === 3) {
        setSelectedYear(parts[0]);
        setSelectedMonth(String(Number(parts[1])));
        setSelectedDay(String(Number(parts[2])));
      }
    }
  }, [user.birthDate]);

  const maxDays =
    selectedYear && selectedMonth
      ? new Date(Number(selectedYear), Number(selectedMonth), 0).getDate()
      : 31;
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    onChangeUser({ ...user, name: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeUser({ ...user, title: e.target.value as ChristianTitle });
  };

  const handleBirthChange = (y: string, m: string, d: string) => {
    setValidationError(null);
    setSelectedYear(y);
    setSelectedMonth(m);

    let validDay = d;
    if (y && m && d) {
      const limit = new Date(Number(y), Number(m), 0).getDate();
      if (Number(d) > limit) {
        validDay = String(limit);
      }
    }
    setSelectedDay(validDay);

    if (y && m && validDay) {
      const padM = m.padStart(2, '0');
      const padD = validDay.padStart(2, '0');
      onChangeUser({ ...user, birthDate: `${y}-${padM}-${padD}` });
    } else {
      onChangeUser({ ...user, birthDate: '' });
    }
  };

  const validateInput = (): boolean => {
    if (!user.name || !user.name.trim()) {
      setValidationError(t.errNameRequired);
      return false;
    }
    if (!selectedYear || !selectedMonth || !selectedDay) {
      setValidationError(t.errBirthRequired);
      return false;
    }
    return true;
  };

  const handleCameraClick = () => {
    if (!validateInput()) return;
    onStartCamera();
  };

  const handleUploadClick = () => {
    if (!validateInput()) return;
    fileInputRef.current?.click();
  };

  const handleSkipScanClick = () => {
    if (!validateInput()) return;
    onSkipScan();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPhoto(file);
      e.target.value = '';
    }
  };

  const todayText = getTodayDateText(lang);

  return (
    <div className="landing-container">
      {/* 1. 상단 성스러운 헤더 엠블럼 */}
      <header className="sacred-header">
        <div className="cross-badge-compact">
          <svg className="holy-cross-icon" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 4 L16 28 M9 12 L23 12"
              stroke="url(#crossGold)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle cx="16" cy="12" r="2" fill="#ffffff" />
            <defs>
              <linearGradient id="crossGold" x1="9" y1="4" x2="23" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.5" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="date-pill">
          <Calendar size={12} />
          <span>{todayText}</span>
        </div>

        <h1 className="landing-title">
          {t.appTitlePrefix}
          <span className="gold-text">{t.appTitleAccent}</span>
        </h1>
        <p className="landing-subtitle">
          {t.landingSubtitleBefore}
          <strong>{t.landingSubtitleBold}</strong>
        </p>
      </header>

      {/* 2. 사용자 정보 입력 카드 */}
      <section className="input-card">
        {/* 이름 & 직분 */}
        <div className="form-group-row">
          <div className="form-group" style={{ flex: 1.5 }}>
            <label className="form-label" htmlFor="user-name">
              <User size={13} />
              <span>{t.nameLabel}</span>
            </label>
            <input
              id="user-name"
              type="text"
              className="text-input"
              placeholder={t.namePlaceholder}
              value={user.name}
              onChange={handleNameChange}
              maxLength={24}
              autoComplete="off"
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="user-title">
              <Heart size={13} />
              <span>{t.titleLabel}</span>
            </label>
            <select
              id="user-title"
              className="select-input"
              value={user.title || '성도'}
              onChange={handleTitleChange}
            >
              {CHRISTIAN_TITLES.map((titleKey) => (
                <option key={titleKey} value={titleKey}>
                  {TITLE_LABELS[lang][titleKey]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 생년월일 (년/월/일 드롭다운) */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={13} />
            <span>{t.birthLabel}</span>
          </label>
          <div className="birth-select-grid">
            <select
              className="select-input"
              value={selectedYear}
              onChange={(e) => handleBirthChange(e.target.value, selectedMonth, selectedDay)}
            >
              <option value="">{t.yearPlaceholder}</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                  {t.yearSuffix}
                </option>
              ))}
            </select>

            <select
              className="select-input"
              value={selectedMonth}
              onChange={(e) => handleBirthChange(selectedYear, e.target.value, selectedDay)}
            >
              <option value="">{t.monthPlaceholder}</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                  {t.monthSuffix}
                </option>
              ))}
            </select>

            <select
              className="select-input"
              value={selectedDay}
              onChange={(e) => handleBirthChange(selectedYear, selectedMonth, e.target.value)}
            >
              <option value="">{t.dayPlaceholder}</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                  {t.daySuffix}
                </option>
              ))}
            </select>
          </div>
        </div>

        {validationError && (
          <div className="alert-box error">
            <span>{validationError}</span>
          </div>
        )}

        {photoError && (
          <div className="alert-box error">
            <span>{photoError}</span>
          </div>
        )}

        {/* 3. 스캔 시작 액션 버튼 영역 */}
        <div className="action-buttons-group">
          <button
            type="button"
            className="primary-scan-button"
            onClick={handleCameraClick}
            disabled={isPhotoAnalyzing}
          >
            <div className="btn-glow" />
            <Camera size={19} />
            <div className="btn-text-wrap">
              <span className="btn-main-text">{t.scanBtnMain}</span>
              <span className="btn-sub-text">{t.scanBtnSub}</span>
            </div>
          </button>

          {/* 오늘 말씀 확인하기 (가로=스캔하기와 동일, 높이·스타일=사진 업로드와 동일) */}
          <button
            type="button"
            className={`view-today-button ${hasTodayWord ? 'enabled' : 'disabled'}`}
            onClick={onViewTodayWord}
            disabled={!hasTodayWord || isPhotoAnalyzing}
          >
            <svg
              className="bible-grace-icon"
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 6.5C2.5 5.4 3.4 4.5 4.5 4.5H9.2C10.7 4.5 12 5.4 12 6.8V19.5C12 18.4 10.9 17.6 9.5 17.6H4.5C3.4 17.6 2.5 16.7 2.5 15.6V6.5Z"
                stroke={hasTodayWord ? '#fbbf24' : '#64748b'}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M21.5 6.5C21.5 5.4 20.6 4.5 19.5 4.5H14.8C13.3 4.5 12 5.4 12 6.8V19.5C12 18.4 13.1 17.6 14.5 17.6H19.5C20.6 17.6 21.5 16.7 21.5 15.6V6.5Z"
                stroke={hasTodayWord ? '#fbbf24' : '#64748b'}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M12 1.8V4.2M10.8 3H13.2"
                stroke={hasTodayWord ? '#fef08a' : '#64748b'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="view-today-text-wrap">
              <span className="view-today-main">{t.viewTodayBtnMain}</span>
              <span className="view-today-sub">{t.viewTodayBtnSub}</span>
            </div>
          </button>

          <div className="secondary-buttons-row">
            <button
              type="button"
              className="secondary-action-button"
              onClick={handleUploadClick}
              disabled={isPhotoAnalyzing}
            >
              {isPhotoAnalyzing ? (
                <Loader2 size={15} className="spin-icon" />
              ) : (
                <ImagePlus size={15} color="#93c5fd" />
              )}
              <span>{isPhotoAnalyzing ? t.uploadingBtn : t.uploadBtn}</span>
            </button>

            <button
              type="button"
              className="demo-action-button"
              onClick={handleSkipScanClick}
              disabled={isPhotoAnalyzing}
            >
              <Sparkles size={15} color="#fbbf24" />
              <span>{t.skipScanBtn}</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* 4. 프라이버시 안심 안내 */}
        <div className="privacy-badge-compact">
          <ShieldCheck size={13} color="#34d399" />
          <span>{t.privacyNote}</span>
        </div>
      </section>

      {/* 5. 간결한 서비스 핵심 요약 태그 바 */}
      <div className="service-tags-bar">
        <span className="service-tag-item">
          <Sparkle size={12} color="#fbbf24" /> {t.tagWord}
        </span>
        <span className="service-tag-divider">·</span>
        <span className="service-tag-item">{t.tagMeditation}</span>
        <span className="service-tag-divider">·</span>
        <span className="service-tag-item">{t.tagAction}</span>
        <span className="service-tag-divider">·</span>
        <span className="service-tag-item">{t.tagPrayer}</span>
      </div>
    </div>
  );
};
