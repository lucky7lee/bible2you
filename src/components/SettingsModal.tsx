import React, { useState } from 'react';
import { X, Sparkles, Key, Cpu, Info, Check } from 'lucide-react';
import { AppSettings, Language } from '../types/bible';
import { UI_TEXT } from '../lib/i18n';

interface SettingsModalProps {
  lang: Language;
  settings: AppSettings;
  onSave: (next: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  lang,
  settings,
  onSave,
  onClose,
}) => {
  const t = UI_TEXT[lang];
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
            <h3>{t.settingsHeader}</h3>
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
              <span>{t.engineLabel}</span>
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
                <span className="chip-title">{t.engineLocalTitle}</span>
                <span className="chip-sub">{t.engineLocalSub}</span>
              </label>

              <label className={`engine-option-chip ${engine === 'gemini' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="engine"
                  value="gemini"
                  checked={engine === 'gemini'}
                  onChange={() => setEngine('gemini')}
                />
                <span className="chip-title">{t.engineGeminiTitle}</span>
                <span className="chip-sub">{t.engineGeminiSub}</span>
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
                  <span>{t.modelLabel}</span>
                </label>
                <select
                  id="gemini-model"
                  className="select-input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                </select>
              </div>

              <div className="info-box">
                <Info size={14} />
                <span>{t.apiKeyNote}</span>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              {t.cancelBtn}
            </button>
            <button type="submit" className="btn-modal-save">
              {savedSuccess ? <Check size={16} /> : null}
              <span>{savedSuccess ? t.savedBtn : t.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
