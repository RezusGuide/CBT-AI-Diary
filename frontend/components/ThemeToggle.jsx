import { useTheme } from '../src/context/ThemeContext';
import { useLanguage } from '../src/i18n/LanguageContext';

export default function ThemeToggle({ collapsed }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? t('theme_light') : t('theme_dark')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 8,
        justifyContent: collapsed ? 'center' : 'flex-start',
        width: '100%',
        padding: collapsed ? '9px 0' : '9px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        color: 'var(--text-secondary)',
        fontSize: 13.5,
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-overlay)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>
        {isDark ? '☀️' : '🌙'}
      </span>
      {!collapsed && (
        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {isDark ? t('theme_light') : t('theme_dark')}
        </span>
      )}
    </button>
  );
}
