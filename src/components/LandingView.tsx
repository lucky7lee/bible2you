import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  ImagePlus,
  ShieldCheck,
  Sparkles,
  Calendar,
  User,
  Heart,
  BookOpen,
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
      {/* 1. 상단 성스러운 헤더 엠블럼 */}
      <header className="sacred-header">
        <div className="cross-badge">
          <svg className="holy-cross-icon" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 5 L20 35 M11 15 L29 15"
              stroke="url(#crossGold)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="15" r="2.5" fill="#ffffff" />
            <defs>
              <linearGradient id="crossGold" x1="11" y1="5" x2="29" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.5" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="date-pill">
          <Calendar size={13} />
          <span>{todayText}</span>
        </div>

        <h1 className="landing-title">
          오늘 성경 말씀 <span className="gold-text">To You</span>
        </h1>
        <p className="landing-subtitle">
          오늘 나의 얼굴 표정과 삶의 자리를 비추어
          <br />
          주님이 예비하신 <strong>맞춤 말씀과 묵상, 1분 기도</strong>를 전합니다
        </p>
      </header>

      {/* 2. 사용자 정보 입력 카드 */}
      <section className="input-card">
        <div className="input-card-header">
          <div className="header-tag">
            <BookOpen size={14} />
            <span>은혜의 나눔 정보 입력</span>
          </div>
          <p className="input-tip">
            나이와 생애주기에 맞는 은혜의 말씀과 기도를 찾아드립니다.
          </p>
        </div>

        {/* 이름 & 직분 */}
        <div className="form-group-row">
          <div className="form-group" style={{ flex: 1.6 }}>
            <label className="form-label" htmlFor="user-name">
              <User size={14} />
              <span>성명 (이름)</span>
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
              <Heart size={14} />
              <span>직분 / 호칭</span>
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
            <Calendar size={14} />
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
            <Camera size={20} />
            <div className="btn-text-wrap">
              <span className="btn-main-text">오늘의 얼굴 상태 스캔하기</span>
              <span className="btn-sub-text">카메라로 평안과 은혜의 빛 측정 (3초)</span>
            </div>
          </button>

          <div className="secondary-buttons-row">
            <button
              type="button"
              className="secondary-action-button"
              onClick={handleUploadClick}
              disabled={isPhotoAnalyzing}
            >
              <ImagePlus size={16} />
              <span>사진 업로드로 분석</span>
            </button>

            <button
              type="button"
              className="demo-action-button"
              onClick={onTryDemo}
              disabled={isPhotoAnalyzing}
            >
              <Sparkles size={16} />
              <span>체험 데모 보기</span>
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
        <div className="privacy-badge">
          <ShieldCheck size={14} color="#34d399" />
          <span>
            얼굴 영상 및 사진은 <strong>외부 서버로 전송되지 않으며</strong>, 오직 기기 내부에서만 안전하게 분석됩니다.
          </span>
        </div>
      </section>

      {/* 5. 프로그램 특징 카드 3종 안내 */}
      <section className="feature-grid">
        <div className="feature-item">
          <div className="feature-icon gold">
            <Sparkle size={18} />
          </div>
          <div className="feature-text">
            <strong>오늘의 맞춤 말씀</strong>
            <p>나이와 얼굴 표정을 분석해 오늘 꼭 필요한 생명의 말씀을 매칭합니다.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon olive">
            <BookOpen size={18} />
          </div>
          <div className="feature-text">
            <strong>마음 진단과 묵상</strong>
            <p>오늘의 수고와 기쁨을 보듬는 따뜻한 묵상 가이드와 질문을 전합니다.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon blue">
            <Heart size={18} />
          </div>
          <div className="feature-text">
            <strong>하루 실천 & 1분 기도</strong>
            <p>오늘 실천할 작은 일 3가지와 은혜로운 1분 기도문으로 하루를 채웁니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
