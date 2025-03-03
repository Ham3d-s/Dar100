const numberToWords = (function() {
    const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const dahgan = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const dah = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const sadgan = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const levels = ['', 'هزار', 'میلیون', 'میلیارد', 'بیلیون'];

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

    return function(num) {
        if (num === 0) return 'صفر';
        if (num < 0) return 'منفی ' + numberToWords(Math.abs(num));

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
    };
})();