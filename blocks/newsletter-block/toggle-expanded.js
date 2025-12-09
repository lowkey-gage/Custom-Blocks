document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".toggle-button").forEach((button) => {
        button.addEventListener("click", () => {
            // Find the closest block container, then the expanded-text inside it.
            const block = button.closest('.wp-block-custom-blocks-plugin-newsletter-block') || button.closest('.newsletter-block') || button.closest('[data-type="custom-blocks-plugin/newsletter-block"]') || document;
            const expandedText = block.querySelector('.expanded-text');
            if (!expandedText) return; // nothing to toggle

            const isHidden = expandedText.hasAttribute('hidden');
            if (isHidden) {
                expandedText.removeAttribute('hidden');
                button.setAttribute('aria-expanded', 'true');
                button.textContent = 'Read Less ▲';
            } else {
                expandedText.setAttribute('hidden', '');
                button.setAttribute('aria-expanded', 'false');
                button.textContent = 'Read More ▼';
            }
        });
    });
});
