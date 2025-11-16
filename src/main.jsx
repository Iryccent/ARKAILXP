import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import '@/i18n'; // Import i18n configuration

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </>
);