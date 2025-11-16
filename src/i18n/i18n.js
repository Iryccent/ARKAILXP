/**
 * A simple i18n module to load and apply translations.
 */
export const i18n = {
    /**
     * Loads the language file and translates the page.
     * @param {string} lang - The language to load (e.g., 'en', 'es').
     */
    async setLanguage(lang) {
        try {
            const response = await fetch(`./src/i18n/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not load language file: ${lang}.json`);
            }
            const translations = await response.json();
            this.translations = translations;
            this.translatePage();
        } catch (error) {
            console.error("Failed to set language:", error);
        }
    },

    /**
     * Translates the page by finding all elements with a `data-i18n` attribute.
     */
    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.get(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    },

    /**
     * Gets a translation for a given key.
     * @param {string} key - The key to look for (e.g., 'sidebar.dashboard').
     * @returns {string|null} The translated string or null if not found.
     */
    get(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], this.translations) || null;
    }
};