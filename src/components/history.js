class HistoryManager {
    constructor() {
        this.historyDiv = document.getElementById('history');
        this.historyItems = document.getElementById('history-items');
        this.loadHistory();
    }

    loadHistory() {
        const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
        if (history.length > 0) {
            this.historyDiv.classList.remove('hidden');
            this.renderHistory(history);
        }
    }

    renderHistory(history) {
        this.historyItems.innerHTML = history.map(item => `
            <div class="py-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-base-content opacity-70">${Formatter.formatDate(new Date(item.date))}</span>
                </div>
                <div class="stats bg-base-300 stats-vertical w-full">
                    <div class="stat">
                        <div class="stat-title text-base-content opacity-80">مبلغ اولیه</div>
                        <div class="stat-value text-sm text-base-content">${Formatter.formatCurrency(item.amount)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title text-base-content opacity-80">تخفیف ${Formatter.formatPercentage(item.percentage)}</div>
                        <div class="stat-value text-sm text-error">${Formatter.formatCurrency(item.discountAmount)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title text-base-content opacity-80">مبلغ نهایی</div>
                        <div class="stat-value text-sm text-success">${Formatter.formatCurrency(item.finalAmount)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    addToHistory(item) {
        const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
        history.unshift(item);
        if (history.length > 10) history.pop(); // Keep only last 10 items
        localStorage.setItem('calculationHistory', JSON.stringify(history));
        this.historyDiv.classList.remove('hidden');
        this.renderHistory(history);
    }

    clearHistory() {
        localStorage.removeItem('calculationHistory');
        this.historyDiv.classList.add('hidden');
        this.historyItems.innerHTML = '';
    }
}

// Initialize history manager
window.addEventListener('DOMContentLoaded', () => {
    window.historyManager = new HistoryManager();
});