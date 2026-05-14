/* Checkout UI enhancements (purely cosmetic — never touches form validation) */
(function () {
    const $ = (id) => document.getElementById(id);

    function syncMobileTotals() {
        const total = $('checkoutTotal')?.textContent || '0.00';
        const qty = $('checkoutQuantity')?.textContent || '1';
        if ($('mobileTotal')) $('mobileTotal').textContent = total;
        if ($('mobileQty')) $('mobileQty').textContent = qty;
        if ($('payButtonAmount')) $('payButtonAmount').textContent = total;
    }

    function syncCurrency() {
        const map = { MEXICO: 'MXN', BRAZIL: 'BRL', ARGENTINA: 'ARS' };
        const sel = document.querySelector('.country-select');
        const el = $('totalCurrency');
        if (sel && el) el.textContent = map[sel.value] || 'USD';
    }

    // Toggle CC form visibility (mirrors original logic with a nicer reveal)
    function syncPaymentToggle() {
        const checked = document.querySelector('input[name="paymentMethod"]:checked');
        const form = $('creditCardForm');
        if (!form || !checked) return;
        form.style.display = (checked.value === 'Credit Card') ? 'grid' : 'none';
    }

    // Live card preview
    function updateCardPreview() {
        const num = $('cardNumber')?.value || '';
        const name = $('cardName')?.value || '';
        const exp = $('cardExpDate')?.value || '';
        const padded = (num + '••••••••••••••••').slice(0, 19);
        const grouped = padded.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || padded;
        if ($('ccPreviewNum')) $('ccPreviewNum').textContent = grouped;
        if ($('ccPreviewName')) $('ccPreviewName').textContent = (name || 'Your name').toUpperCase();
        if ($('ccPreviewExp')) $('ccPreviewExp').textContent = exp || 'MM/YY';
    }

    // Hide / show shipping hint when options become visible
    function watchShipping() {
        const opts = $('shippingOptions');
        const hint = $('shippingHint');
        if (!opts || !hint) return;
        const obs = new MutationObserver(() => {
            const visible = opts.style.display !== 'none';
            hint.style.display = visible ? 'none' : '';
        });
        obs.observe(opts, { attributes: true, attributeFilter: ['style'] });
    }

    // Mirror enable/disable state to mobile CTA
    function watchPayBtn() {
        const pay = $('payButton');
        const mobile = document.querySelector('.mobile-cta__btn');
        if (!pay || !mobile) return;
        const obs = new MutationObserver(() => { mobile.disabled = pay.disabled; });
        obs.observe(pay, { attributes: true, attributeFilter: ['disabled'] });
        mobile.disabled = pay.disabled;
    }

    function init() {
        // Initial sync
        syncCurrency();
        syncMobileTotals();
        syncPaymentToggle();
        updateCardPreview();
        watchShipping();
        watchPayBtn();

        document.querySelector('.country-select')?.addEventListener('change', syncCurrency);
        document.querySelectorAll('input[name="paymentMethod"]').forEach(el =>
            el.addEventListener('change', syncPaymentToggle)
        );
        ['cardNumber', 'cardName', 'cardExpDate'].forEach(id =>
            $(id)?.addEventListener('input', updateCardPreview)
        );

        // Re-sync totals whenever any input changes (covers shipping selection + qty)
        document.addEventListener('input', syncMobileTotals);
        document.addEventListener('change', syncMobileTotals);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
