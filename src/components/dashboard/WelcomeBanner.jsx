import React from 'react';
import { useTranslation } from 'react-i18next';

const WelcomeBanner = ({ userName }) => {
  const { t } = useTranslation();

  return (
    <div className="glass-panel p-6 sm:p-8">
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-text-primary">{t('dashboard.welcome', { name: userName })}</h1>
        <p className="text-base sm:text-lg text-text-secondary">{t('dashboard.welcome_subtitle')}</p>
      </div>
    </div>
  );
};

export default WelcomeBanner;