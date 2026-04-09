// src/loader.js

const loader = {
    show: () => {
        const isTest = navigator.webdriver ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === 'localhost';

        const el = document.getElementById("page-loader");

        // Visa bara om det INTE är ett test
        if (el && !isTest) {
            el.style.display = "flex";
            // En liten timeout så att display: flex hinner registreras innan vi tonar in
            setTimeout(() => { el.style.opacity = "1"; }, 10);
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

// --- VIKTIGT: Kör show direkt när skriptet laddas ---
loader.show();

window.addEventListener('load', () => {
    setTimeout(() => {
        loader.hide();
    }, 500);
});