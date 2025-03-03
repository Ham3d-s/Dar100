class Settings {
    constructor() {
        this.autoSaveCheckbox = document.getElementById('autoSave');
        this.settingsModal = document.getElementById('settings_modal');
        this.loadSettings();
        this.setupEventListeners();
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('settings') || '{"autoSave": true}');
        this.autoSaveCheckbox.checked = settings.autoSave;
        window.settings = settings;
    }

    saveSettings() {
        const settings = {
            autoSave: this.autoSaveCheckbox.checked
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        window.settings = settings;
    }

    setupEventListeners() {
        this.autoSaveCheckbox.addEventListener('change', () => this.saveSettings());
    }
}

function toggleSettings() {
    const modal = document.getElementById('settings_modal');
    if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
    }
}

function closeSettings() {
    const modal = document.getElementById('settings_modal');
    modal.close();
}

function clearHistory() {
    if (confirm('آیا از پاک کردن تاریخچه مطمئن هستید؟')) {
        if (window.historyManager) {
            window.historyManager.clearHistory();
            document.getElementById('settings_modal').close();
        }
    }
}

function toggleFAQ() {
    const faqSection = document.getElementById('faqAccordion');
    if (faqSection.classList.contains('hidden')) {
        faqSection.classList.remove('hidden');
        // Give time for the hidden class to be removed before adding visible styles
        requestAnimationFrame(() => {
            faqSection.style.opacity = '1';
            faqSection.style.transform = 'translateY(0)';
        });
    } else {
        faqSection.style.opacity = '0';
        faqSection.style.transform = 'translateY(-10px)';
        // Wait for animation to complete before hiding
        setTimeout(() => {
            faqSection.classList.add('hidden');
        }, 300);
    }
}

// Initialize settings
window.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new Settings();
});