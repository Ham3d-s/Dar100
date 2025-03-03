class ThemeManager {
    constructor() {
        this.themes = ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk'];
        this.currentThemeIndex = this.themes.indexOf(localStorage.getItem('theme')) || 0;
        this.applyTheme();
    }

    applyTheme() {
        const theme = this.themes[this.currentThemeIndex];
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    cycleTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        this.applyTheme();
    }
}

function toggleTheme() {
    window.themeManager.cycleTheme();
}

// Initialize theme manager
window.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});