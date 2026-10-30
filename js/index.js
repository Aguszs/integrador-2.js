const navbar = document.querySelector('.navbar');
const searchForm = document.querySelector('.search-form');
const cartItem = document.querySelector('.cart-items-container');
const menuButton = document.querySelector('#menu-btn');
const searchButton = document.querySelector('#search-btn');
const cartButton = document.querySelector('#cart-btn');

function closePanels(except) {
    if (except !== navbar) navbar?.classList.remove('active');
    if (except !== searchForm) searchForm?.classList.remove('active');
    if (except !== cartItem) cartItem?.classList.remove('active');
    menuButton?.setAttribute('aria-expanded', 'false');
}

function togglePanel(panel) {
    const isOpening = !panel.classList.contains('active');
    closePanels(isOpening ? panel : null);
    panel.classList.toggle('active', isOpening);
    if (panel === navbar) menuButton?.setAttribute('aria-expanded', String(isOpening));
}

menuButton?.addEventListener('click', () => togglePanel(navbar));
searchButton?.addEventListener('click', () => {
    togglePanel(searchForm);
    if (searchForm.classList.contains('active')) {
        searchForm.querySelector('input')?.focus();
    }
});
cartButton?.addEventListener('click', () => togglePanel(cartItem));

[menuButton, searchButton, cartButton].forEach(button => {
    button?.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            button.click();
        }
    });
});

const searchInput = document.querySelector('#search-box');
searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim().toLocaleLowerCase('es');
    document.querySelectorAll('#contenedor .box').forEach(card => {
        const name = card.querySelector('h3')?.textContent.toLocaleLowerCase('es') || '';
        card.hidden = !name.includes(query);
    });
});

const readSession = () => {
    try {
        return JSON.parse(localStorage.getItem('login_success')) || null;
    } catch {
        return null;
    }
};

if (!readSession()) {
    window.location.href = 'login.index.html';
}

document.querySelector('#logOut')?.addEventListener('click', () => {
    localStorage.removeItem('login_success');
    window.location.href = 'login.index.html';
});

window.addEventListener('scroll', () => closePanels(null), { passive: true });
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePanels(null);
});
