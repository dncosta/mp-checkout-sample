/* index-ui.js — purely cosmetic enhancements; no payment logic touched */
(function () {
    const $ = (id) => document.getElementById(id);

    // Restore selected country from storage on load
    const saved = localStorage.getItem('selectedCountry');
    if (saved) {
        const sel = document.querySelector('.country-select');
        if (sel) sel.value = saved;
    }

    // Mirror currency label next to price
    function syncCurrency() {
        const map = { MEXICO: 'MXN', BRAZIL: 'BRL', ARGENTINA: 'ARS' };
        const sel = document.querySelector('.country-select');
        const el = $('priceCurrency');
        if (sel && el) el.textContent = map[sel.value] || 'USD';
    }
    syncCurrency();
    document.querySelector('.country-select')?.addEventListener('change', syncCurrency);

    // Cart badge count — tracks quantity input
    function syncCartCount() {
        const q = parseInt($('quantity')?.value || '0', 10) || 0;
        const dot = $('cartCount');
        if (!dot) return;
        dot.textContent = q;
        dot.dataset.empty = q === 0 ? 'true' : 'false';
    }
    syncCartCount();
    $('quantity')?.addEventListener('change', syncCartCount);
    $('quantity')?.addEventListener('input', syncCartCount);

    // Wire backdrop visibility via class on sidebar (CSS adjacent sibling handles it,
    // but ensure body scroll locks while cart is open)
    const sidebar = $('cartSidebar');
    if (sidebar) {
        const obs = new MutationObserver(() => {
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
            // Bump cart count when first added
            if (sidebar.classList.contains('open')) syncCartCount();
        });
        obs.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    // Close cart on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
})();
