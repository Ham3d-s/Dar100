class Calculator {
    constructor() {
        this.amountInput = document.getElementById('amount');
        this.percentageInput = document.getElementById('percentage');
        this.resultDiv = document.getElementById('result');
        this.amountError = document.getElementById('amount-error');
        this.percentageError = document.getElementById('percentage-error');
        this.amountInWords = document.getElementById('amount-in-words');
        
        this.setupEventListeners();
        this.setupKeyboardTooltips();
        this.setupEnterNavigation();
    }

    setupEventListeners() {
        this.amountInput.addEventListener('input', () => this.handleAmountInput());
        this.percentageInput.addEventListener('input', () => {
            this.validatePercentage();
            this.updatePercentageButtons(this.percentageInput.value);
        });
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setupKeyboardTooltips() {
        const tooltips = [
            { percentage: 10, key: 'Alt + 1' },
            { percentage: 20, key: 'Alt + 2' },
            { percentage: 30, key: 'Alt + 3' },
            { percentage: 50, key: 'Alt + 5' }
        ];

        tooltips.forEach(({ percentage, key }) => {
            const button = document.querySelector(`[data-percentage="${percentage}"]`);
            if (button) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip tooltip-bottom text-xs opacity-50';
                tooltip.setAttribute('data-tip', key);
                button.parentNode.insertBefore(tooltip, button);
                tooltip.appendChild(button);
            }
        });
    }

    setupEnterNavigation() {
        this.amountInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.ctrlKey) {
                e.preventDefault();
                this.percentageInput.focus();
            }
        });

        this.percentageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.ctrlKey) {
                e.preventDefault();
                this.calculateDiscount();
            }
        });
    }

    handleAmountInput() {
        // Get current cursor position
        const cursorPos = this.amountInput.selectionStart;
        
        // Get current value and convert Persian digits to English
        let value = Formatter.toEnglishDigits(this.amountInput.value);
        
        // Remove all non-digits
        value = value.replace(/[^\d]/g, '');
        
        if (value) {
            // Format the number with commas and convert to Persian digits
            const formattedValue = Formatter.formatNumber(value);
            
            // Only update if the value has changed
            if (this.amountInput.value !== formattedValue) {
                const oldLength = this.amountInput.value.length;
                this.amountInput.value = formattedValue;
                
                // Adjust cursor position based on added/removed characters
                const lengthDiff = formattedValue.length - oldLength;
                const newPos = cursorPos + lengthDiff;
                this.amountInput.setSelectionRange(newPos, newPos);
            }
            
            // Update amount in words
            this.amountInWords.textContent = numberToWords(parseInt(value)) + ' تومان';
            this.amountInput.classList.remove('input-error');
            this.amountError.textContent = '';
        } else {
            this.amountInWords.textContent = '';
            if (this.amountInput.value !== '') {
                this.amountInput.classList.add('input-error');
                this.amountError.textContent = 'لطفاً فقط عدد وارد کنید';
            }
        }
    }

    validateAmount() {
        const amount = Formatter.unformatNumber(this.amountInput.value);
        if (!amount || isNaN(amount)) {
            this.amountInput.classList.add('input-error');
            this.amountError.textContent = 'لطفاً مبلغ را وارد کنید';
            this.amountInput.focus();
            return false;
        }
        this.amountInput.classList.remove('input-error');
        this.amountError.textContent = '';
        return true;
    }

    validatePercentage() {
        const percentage = parseFloat(this.percentageInput.value);
        if (!percentage && percentage !== 0) {
            this.percentageInput.classList.add('input-error');
            this.percentageError.textContent = 'لطفاً درصد را وارد کنید';
            if (!this.amountError.textContent) {
                this.percentageInput.focus();
            }
            return false;
        }
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            this.percentageInput.classList.add('input-error');
            this.percentageError.textContent = 'درصد باید بین ۰ تا ۱۰۰ باشد';
            if (!this.amountError.textContent) {
                this.percentageInput.focus();
            }
            return false;
        }
        this.percentageInput.classList.remove('input-error');
        this.percentageError.textContent = '';
        return true;
    }

    handleKeyboardShortcuts(e) {
        // Allow Ctrl+Enter even when in input fields
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            const calculateBtn = document.querySelector('.btn-primary');
            calculateBtn.classList.add('btn-active');
            setTimeout(() => calculateBtn.classList.remove('btn-active'), 200);
            this.calculateDiscount();
            return;
        }

        // For other shortcuts, ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.altKey) {
            e.preventDefault();
            let percentage;
            switch(e.key) {
                case '1': percentage = 10; break;
                case '2': percentage = 20; break;
                case '3': percentage = 30; break;
                case '5': percentage = 50; break;
                default: return;
            }
            
            const button = document.querySelector(`[data-percentage="${percentage}"]`);
            if (button) {
                button.classList.add('btn-active');
                setTimeout(() => {
                    if (!this.percentageInput.value) {
                        button.classList.remove('btn-active');
                    }
                }, 200);
            }
            setPercentage(percentage);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const resetBtn = document.querySelector('.btn-secondary');
            resetBtn.classList.add('btn-active');
            setTimeout(() => resetBtn.classList.remove('btn-active'), 200);
            this.resetForm();
        }
    }

    calculateDiscount() {
        if (!this.validateAmount() || !this.validatePercentage()) return;

        const amount = Formatter.unformatNumber(this.amountInput.value);
        const percentage = parseFloat(this.percentageInput.value);
        const discountAmount = (amount * percentage) / 100;
        const finalAmount = amount - discountAmount;

        const result = `
            <div class="alert bg-base-300 shadow-xl">
                <div class="flex flex-col w-full">
                    <div class="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-8 w-8" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-lg font-medium">نتیجه محاسبه:</span>
                    </div>
                    <div class="stats bg-base-200 stats-vertical lg:stats-horizontal shadow w-full">
                        <div class="stat">
                            <div class="stat-title text-base-content opacity-80">مبلغ اولیه</div>
                            <div class="stat-value text-base text-base-content">${Formatter.formatCurrency(amount)}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title text-base-content opacity-80">مبلغ تخفیف (${Formatter.formatPercentage(percentage)})</div>
                            <div class="stat-value text-base text-error">${Formatter.formatCurrency(discountAmount)}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title text-base-content opacity-80">مبلغ نهایی</div>
                            <div class="stat-value text-base text-success">${Formatter.formatCurrency(finalAmount)}</div>
                        </div>
                    </div>
                </div>
            </div>`;

        this.resultDiv.innerHTML = result;
        
        // Save to history if enabled
        if (window.historyManager && window.settings.autoSave) {
            window.historyManager.addToHistory({
                amount,
                percentage,
                discountAmount,
                finalAmount,
                date: new Date()
            });
        }
    }

    resetForm() {
        this.amountInput.value = '';
        this.percentageInput.value = '';
        this.resultDiv.innerHTML = '';
        this.amountError.textContent = '';
        this.percentageError.textContent = '';
        this.amountInWords.textContent = '';
        this.amountInput.classList.remove('input-error');
        this.percentageInput.classList.remove('input-error');

        // Remove active state from percentage buttons
        document.querySelectorAll('.percentage-btn').forEach(btn => {
            btn.classList.remove('btn-active');
        });

        // Close FAQ accordion if open
        const faqAccordion = document.getElementById('faqAccordion');
        if (!faqAccordion.classList.contains('hidden')) {
            toggleFAQ();
        }

        // Focus on amount input
        this.amountInput.focus();
    }

    updatePercentageButtons(currentPercentage) {
        const buttons = document.querySelectorAll('.percentage-btn');
        buttons.forEach(btn => {
            const btnPercentage = btn.getAttribute('data-percentage');
            if (btnPercentage === currentPercentage) {
                btn.classList.add('btn-active');
                this.percentageInput.value = currentPercentage;
            } else {
                btn.classList.remove('btn-active');
            }
        });
    }
}

// Make functions globally accessible
window.calculateDiscount = () => window.calculator?.calculateDiscount();
window.resetForm = () => window.calculator?.resetForm();
window.setPercentage = (value) => {
    const percentageInput = document.getElementById('percentage');
    percentageInput.value = value;
    const event = new Event('input');
    percentageInput.dispatchEvent(event);
    window.calculator?.updatePercentageButtons(value.toString());
};

// Initialize calculator
window.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
});