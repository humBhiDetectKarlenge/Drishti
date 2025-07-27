'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    const addTranslateScript = () => {
      if (document.getElementById('google-translate-script')) return;

      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.id = 'google-translate-script';
      script.async = true;

      script.onload = () => {
        console.log('[Google Translate] Script loaded successfully.');
      };

      script.onerror = () => {
        console.error('[Google Translate] Failed to load the script. Check network or CSP settings.');
      };

      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,ja,fr',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
        // console.log('[Google Translate] Widget initialized.');
      } catch (error) {
        console.error('[Google Translate] Initialization error:', error);
      }
    };

    addTranslateScript();
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: 'absolute',
        top: 70,
        right: 40,
        zIndex: 1000
      }}
    >
      <noscript>Please enable JavaScript to view this translation widget.</noscript>
    </div>
  );
}
