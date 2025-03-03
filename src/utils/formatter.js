const Formatter = {
    // Replace English digits with Persian digits
    toPersianDigits(str) {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.toString().replace(/\d/g, x => persianDigits[x]);
    },

    // Replace Persian digits with English digits
    toEnglishDigits(str) {
        const englishDigits = {
            '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
            '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
        };
        return str.split('').map(c => englishDigits[c] || c).join('');
    },

    formatNumber(number) {
        // First format with commas
        const withCommas = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // Then convert to Persian digits
        return this.toPersianDigits(withCommas);
    },

    unformatNumber(formattedNumber) {
        // First convert to English digits
        const englishDigits = this.toEnglishDigits(formattedNumber);
        // Then remove commas and convert to number
        return parseInt(englishDigits.replace(/,/g, '')) || 0;
    },

    formatCurrency(amount) {
        return this.formatNumber(amount) + ' تومان';
    },

    formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            calendar: 'persian'
        };
        return new Intl.DateTimeFormat('fa-IR', options).format(date);
    },

    formatPercentage(percentage) {
        return this.toPersianDigits(percentage.toString()) + '٪';
    },

    formatNumberOrPercentage(number, isPercentage = false) {
        if (isPercentage) {
            return this.formatPercentage(number);
        }
        return this.formatNumber(number);
    }
};