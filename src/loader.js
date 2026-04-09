// src/loader.js

const loader = {
    show: () => {
        // navigator.webdriver räcker oftast för att stoppa testrobotar
        // men låta dig se sidan på din localhost/127.0.0.1
        const isRobot = navigator.webdriver;

        const el = document.getElementById("page-loader");
        if (el && !isRobot) {
            el.style.display = "flex";
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