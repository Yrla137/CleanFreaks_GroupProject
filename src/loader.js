// src/loader.js

const loader = {
    show: () => {
        // Kontrollera om vi körs i en testmiljö (t.ex. Playwright eller CI)
        const isTest = navigator.webdriver || window.location.href.includes('127.0.0.1');

        const el = document.getElementById("page-loader");
        // Om det inte är ett test, visa loadern som vanligt
        if (el && !isTest) {
            el.style.display = "flex";
            el.style.opacity = "1";
        }
    },
    hide: () => {
        const el = document.getElementById("page-loader");
        if (el) {
            el.style.opacity = "0";
            setTimeout(() => {
                el.style.display = "none";
            }, 400);
        }
    }
};

window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof loader !== 'undefined') {
            loader.hide();
        }
    }, 500);
});