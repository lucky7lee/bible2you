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
} from 'lucide-react';
import { ChristianTitle, UserProfile } from '../types/bible';
import { getTodayDateText } from '../lib/bibleEngine';

interface LandingViewProps {
  user: UserProfile;
  onChangeUser: (next: UserProfile) => void;
  onStartCamera: () => void;
  onUploadPhoto: (file: File) => void;
  onTryDemo: () => void;
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
  user,
  onChangeUser,
  onStartCamera,
  onUploadPhoto,
  onTryDemo,
  isPhotoAnalyzing,
  photoError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

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
      setValidationError('성명(이름)을 입력해 주세요.');
      return false;
    }
    if (!selectedYear || !selectedMonth || !selectedDay) {
      setValidationError('생년월일을 모두 선택해 주세요.');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPhoto(file);
      e.target.value = '';
    }
  };

  const todayText = getTodayDateText();

  return (
    <div className="landing-container">
      {/* 1. 상단 성스러운 헤더 엠블럼 (컴팩트 & 세련) */}
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
          오늘 성경 말씀 <span className="gold-text">To You</span>
        </h1>
        <p className="landing-subtitle">
          오늘 나의 얼굴 표정과 생애주기에 맞춘 <strong>말씀과 묵상, 1분 기도</strong>
        </p>
      </header>

      {/* 2. 사용자 정보 입력 카드 (한 화면에 쏙 들어오게 슬림화) */}
      <section className="input-card">
        {/* 이름 & 직분 */}
        <div className="form-group-row">
          <div className="form-group" style={{ flex: 1.6 }}>
            <label className="form-label" htmlFor="user-name">
              <User size={13} />
              <span>성명</span>
            </label>
            <input
              id="user-name"
              type="text"
              className="text-input"
              placeholder="예: 홍길동"
              value={user.name}
              onChange={handleNameChange}
              maxLength={20}
              autoComplete="off"
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label" htmlFor="user-title">
              <Heart size={13} />
              <span>직분</span>
            </label>
            <select
              id="user-title"
              className="select-input"
              value={user.title || '성도'}
              onChange={handleTitleChange}
            >
              {CHRISTIAN_TITLES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 생년월일 (년/월/일 드롭다운) */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={13} />
            <span>생년월일 (양력)</span>
          </label>
          <div className="birth-select-grid">
            <select
              className="select-input"
              value={selectedYear}
              onChange={(e) => handleBirthChange(e.target.value, selectedMonth, selectedDay)}
            >
              <option value="">출생년도</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>

            <select
              className="select-input"
              value={selectedMonth}
              onChange={(e) => handleBirthChange(selectedYear, e.target.value, selectedDay)}
            >
              <option value="">월</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>

            <select
              className="select-input"
              value={selectedDay}
              onChange={(e) => handleBirthChange(selectedYear, selectedMonth, e.target.value)}
            >
              <option value="">일</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}일
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
              <span className="btn-main-text">오늘의 얼굴 스캔하기</span>
              <span className="btn-sub-text">3초 카메라 스캔으로 은혜의 말씀 찾기</span>
            </div>
          </button>

          <div className="secondary-buttons-row">
            <button
              type="button"
              className="secondary-action-button"
              onClick={handleUploadClick}
              disabled={isPhotoAnalyzing}
            >
              <ImagePlus size={15} />
              <span>사진 파일 업로드</span>
            </button>

            <button
              type="button"
              className="demo-action-button"
              onClick={onTryDemo}
              disabled={isPhotoAnalyzing}
            >
              <Sparkles size={15} />
              <span>체험 데모</span>
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

        {/* 4. 프라이버시 안심 안내 (1줄 미니멀) */}
        <div className="privacy-badge-compact">
          <ShieldCheck size={13} color="#34d399" />
          <span>안심하세요: 얼굴 영상 및 사진은 서버로 전송되지 않습니다.</span>
        </div>
      </section>

      {/* 5. 간결한 서비스 핵심 요약 태그 바 (한 화면에 깔끔하게) */}
      <div className="service-tags-bar">
        <span className="service-tag-item">
          <Sparkle size={12} color="#fbbf24" /> 맞춤 성경 말씀
        </span>
        <span className="service-tag-divider">·</span>
        <span className="service-tag-item">깊은 묵상</span>
        <span className="service-tag-divider">·</span>
        <span className="service-tag-item">작은 실천</span>
        <span className="service-tag-divider">·</span>
        <span className="service-tag-item">1분 기도</span>
      </div>
    </div>
  );
};
