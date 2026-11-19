import React, { useState } from 'react';
import { X, Sparkles, Key, Cpu, Info, Check } from 'lucide-react';
import { AppSettings } from '../types/bible';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (next: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [engine, setEngine] = useState<'local' | 'gemini'>(settings.engine);
  const [apiKey, setApiKey] = useState(settings.geminiApiKey);
  const [model, setModel] = useState(settings.geminiModel);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      engine,
      geminiApiKey: apiKey.trim(),
      geminiModel: model.trim() || 'gemini-2.5-flash',
    });
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={18} color="#fbbf24" />
            <h3>AI 영성 분석 설정</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* 엔진 선택 */}
          <div className="form-group">
            <label className="form-label">
              <Cpu size={14} />
              <span>생성 엔진 선택</span>
            </label>
            <div className="engine-options-row">
              <label className={`engine-option-chip ${engine === 'local' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="engine"
                  value="local"
                  checked={engine === 'local'}
                  onChange={() => setEngine('local')}
                />
                <span className="chip-title">로컬 정밀 엔진 (권장)</span>
                <span className="chip-sub">API 키 없이 100% 무료 즉시 실행</span>
              </label>

              <label className={`engine-option-chip ${engine === 'gemini' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="engine"
                  value="gemini"
                  checked={engine === 'gemini'}
                  onChange={() => setEngine('gemini')}
                />
                <span className="chip-title">Google Gemini API</span>
                <span className="chip-sub">실시간 심층 기도문 & 묵상 생성</span>
              </label>
            </div>
          </div>

          {/* Gemini API Key 설정 */}
          {engine === 'gemini' && (
            <div className="gemini-settings-wrap">
              <div className="form-group">
                <label className="form-label" htmlFor="gemini-key">
                  <Key size={14} />
                  <span>Gemini API Key</span>
                </label>
                <input
                  id="gemini-key"
                  type="password"
                  className="text-input"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gemini-model">
                  <span>사용 모델</span>
                </label>
                <select
                  id="gemini-model"
                  className="select-input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (빠르고 정확)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (깊은 통찰)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                </select>
              </div>

              <div className="info-box">
                <Info size={14} />
                <span>
                  API 키는 사용자 기기 내부(Local Storage)에만 암호화되어 안전하게 보관됩니다.
                </span>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-modal-save">
              {savedSuccess ? <Check size={16} /> : null}
              <span>{savedSuccess ? '저장 완료!' : '설정 저장'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
