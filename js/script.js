// Add these functions at the beginning of your script section
function numberToWords(num) {
    const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const dahgan = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const dah = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const sadgan = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const levels = ['', 'هزار', 'میلیون', 'میلیارد', 'بیلیون'];

    if (num === 0) return 'صفر';
    if (num < 0) return 'منفی ' + numberToWords(Math.abs(num));

    function convertSection(num) {
        let result = '';
        const sad = Math.floor(num / 100);
        const dah = Math.floor((num % 100) / 10);
        const yek = num % 10;

        if (sad > 0) {
            result += sadgan[sad] + ' و ';
        }
        if (dah === 1) {
            result += dah[yek];
        } else {
            if (dah > 1) {
                result += dahgan[dah];
                if (yek > 0) result += ' و ';
            }
            if (yek > 0) {
                result += yekan[yek];
            }
        }
        return result.trim().replace(/\s+و\s*$/, '');
    }

    const parts = [];
    let level = 0;
    while (num > 0) {
        const section = num % 1000;
        if (section > 0) {
            const words = convertSection(section);
            if (level > 0) {
                parts.unshift(words + ' ' + levels[level]);
            } else {
                parts.unshift(words);
            }
        }
        num = Math.floor(num / 1000);
        level++;
    }

    return parts.join(' و ');
}

let calculations = [];

function formatNumber(num) {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function unformatNumber(str) {
    return parseFloat(str.replace(/,/g, ''));
}

function setPercentage(value) {
    document.getElementById('percentage').value = value;
    const amount = document.getElementById('amount').value;
    if (amount) {
        calculateDiscount();
    }
}

document.getElementById('amount').addEventListener('input', function(e) {
    const cursorPos = e.target.selectionStart;
    const originalLength = e.target.value.length;

    let value = e.target.value.replace(/[^\d]/g, '');

    if (value) {
        const formatted = formatNumber(value);
        e.target.value = formatted;

        const addedCommas = formatted.length - value.length;
        const newPos = cursorPos + (formatted.length - originalLength);

        e.target.setSelectionRange(newPos, newPos);

        // Display amount in words
        const numValue = parseInt(value);
        const wordsElement = document.getElementById('amount-in-words');
        wordsElement.textContent = numberToWords(numValue) + ' تومان';
    } else {
        document.getElementById('amount-in-words').textContent = '';
    }
});

function calculateDiscount() {
    const amountInput = document.getElementById('amount');
    const percentageInput = document.getElementById('percentage');
    const amount = unformatNumber(amountInput.value);
    const percentage = parseFloat(percentageInput.value);

    if (!validateInputs(amount, percentage)) return;

    const discount = (percentage / 100) * amount;
    const finalAmount = amount - discount;

    const result = {
        amount: amount,
        percentage: percentage,
        discount: discount,
        finalAmount: finalAmount,
        timestamp: new Date()
    };

    calculations.unshift(result);
    updateResult(result);
    updateHistory();
    saveToLocalStorage();

    const resultElement = document.getElementById('result');
    resultElement.classList.add('success-animation');
    setTimeout(() => resultElement.classList.remove('success-animation'), 500);

    // Show history container after first calculation
    document.getElementById('history').style.display = 'block';
}

function validateInputs(amount, percentage) {
    let isValid = true;

    if (isNaN(amount) || amount <= 0) {
        showError('amount-error', 'لطفا مبلغ معتبر وارد کنید');
        isValid = false;
    } else {
        hideError('amount-error');
    }

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        showError('percentage-error', 'درصد مبلغ باید بین 0 تا 100 باشد');
        isValid = false;
    } else {
        hideError('percentage-error');
    }

    return isValid;
}

function showError(elementId, messageKey) {
    const lang = document.documentElement.getAttribute('data-language');
    const message = messageKey; //translations[lang][messageKey]; // translations is removed as not defined.
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.opacity = '1';
    element.parentElement.querySelector('input').classList.add('shake');
    setTimeout(() => {
        element.parentElement.querySelector('input').classList.remove('shake');
    }, 500);
}

function hideError(elementId) {
    document.getElementById(elementId).style.opacity = '0';
}

function updateResult(result) {
    if (!result) return;
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
        <div class="amount-display">
            <span>درصد از مبلغ: ${result.discount.toLocaleString('fa-IR')} تومان</span>
            <span class="copy-icon" onclick="copyToClipboard('${result.discount}')">📋</span>
        </div>
        <div class="amount-display">
            <span>مبلغ نهایی: ${result.finalAmount.toLocaleString('fa-IR')} تومان</span>
            <span class="copy-icon" onclick="copyToClipboard('${result.finalAmount}')">📋</span>
        </div>
    `;
}

function updateHistory() {
    const historyElement = document.getElementById('history');
    historyElement.innerHTML = '<h3>تاریخچه محاسبات</h3>';

    calculations.slice(0, 5).forEach((calc, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            مبلغ: ${calc.amount.toLocaleString('fa-IR')} -
            : ${calc.percentage}% -
            نهایی: ${calc.finalAmount.toLocaleString('fa-IR')}
        `;
        historyItem.onclick = () => loadCalculation(index);
        historyElement.appendChild(historyItem);
    });
}

function loadCalculation(index) {
    const calc = calculations[index];
    document.getElementById('amount').value = formatNumber(calc.amount);
    document.getElementById('percentage').value = calc.percentage;
    updateResult(calc);
}

function resetForm() {
    document.getElementById('amount').value = '';
    document.getElementById('percentage').value = '';
    document.getElementById('result').innerHTML = '';
    hideError('amount-error');
    hideError('percentage-error');

    // Close FAQ accordion
    document.getElementById('faqAccordion').classList.remove('show');

    // Hide history if visible
    document.getElementById('history').style.display = 'none';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('مبلغ در کلیپ‌بورد کپی شد');
    });
}

function saveToLocalStorage() {
    if (document.getElementById('autoSave').checked) {
        localStorage.setItem('calculations', JSON.stringify(calculations));
        localStorage.setItem('autoSave', 'true');
    }
}

function toggleSettings() {
    document.getElementById('settings-panel').classList.toggle('show');
    document.getElementById('overlay').classList.toggle('show');
}

function clearHistory() {
    if (confirm('آیا از پاک کردن تاریخچه مطمئن هستید؟')) {
        calculations = [];
        localStorage.removeItem('calculations');
        updateHistory();
        toggleSettings();
    }
}

function toggleFAQ() {
    const accordion = document.getElementById('faqAccordion');
    accordion.classList.toggle('show');
}

function toggleAccordionItem(header) {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');

    // Close all accordion items
    document.querySelectorAll('.accordion-header').forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('calculations');
    if (saved) {
        calculations = JSON.parse(saved);
        updateHistory();
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const autoSaveCheckbox = document.getElementById('autoSave');
    autoSaveCheckbox.checked = localStorage.getItem('autoSave') !== 'false';

    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') calculateDiscount();
    if (e.key === 'Escape') resetForm();

    if (e.altKey) {
        switch (e.key) {
            case '1': setPercentage(10); break;
            case '2': setPercentage(20); break;
            case '3': setPercentage(30); break;
            case '5': setPercentage(50); break;
        }
    }
});