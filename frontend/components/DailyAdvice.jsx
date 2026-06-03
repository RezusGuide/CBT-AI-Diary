import { useState, useEffect } from 'react';
import { useLanguage } from '../src/i18n/LanguageContext';
import { aiApi } from '../src/api/aiApi';

export default function DailyAdvice() {
  const { t } = useLanguage();
  const [advice, setAdvice] = useState('');
  const [exercise, setExercise] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(true);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');

  const MOODS = [
    { label: t('mood_0'), value: 'тревога и беспокойство', emoji: '😰' },
    { label: t('mood_1'), value: 'грусть и уныние',        emoji: '😔' },
    { label: t('mood_2'), value: 'раздражение и злость',   emoji: '😤' },
    { label: t('mood_3'), value: 'усталость и апатия',     emoji: '😴' },
    { label: t('mood_4'), value: 'стресс от работы',       emoji: '😵' },
  ];

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = () => {
    setLoadingAdvice(true);
    aiApi.getDailyAdvice()
      .then(setAdvice)
      .catch(() => setAdvice(t('ai_advice_error')))
      .finally(() => setLoadingAdvice(false));
  };

  const handleGetExercise = async (moodValue) => {
    setSelectedMood(moodValue);
    setLoadingExercise(true);
    try {
      const ex = await aiApi.getCbtExercise(moodValue);
      setExercise(ex);
    } catch {
      setExercise(t('ai_advice_error'));
    } finally {
      setLoadingExercise(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1>{t('ai_title')}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
          {t('ai_advice_subtitle')}
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">✨ {t('ai_daily_advice')}</div>
        {loadingAdvice ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t('loading')}</div>
        ) : (
          <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
            {advice}
          </p>
        )}
        <button className="btn-secondary"
          style={{ marginTop: 14, fontSize: 12 }}
          onClick={fetchAdvice}
          disabled={loadingAdvice}>
          🔄 {t('ai_refresh')}
        </button>
      </div>

      <div className="card">
        <div className="card-header">🧘 {t('ai_exercise_title')}</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
          {t('ai_exercise_subtitle')}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {MOODS.map(mood => (
            <button key={mood.value}
              onClick={() => handleGetExercise(mood.value)}
              style={{
                background: selectedMood === mood.value ? 'var(--accent-primary)' : 'var(--bg-surface-2)',
                color: selectedMood === mood.value ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px', fontSize: 12,
                cursor: 'pointer', transition: 'var(--transition-fast)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>
        {loadingExercise && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t('loading')}</div>
        )}
        {exercise && !loadingExercise && (
          <div style={{
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: 16, fontSize: 14, lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}>
            {exercise}
          </div>
        )}
      </div>
    </div>
  );
}
