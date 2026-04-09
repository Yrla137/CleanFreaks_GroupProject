// src/loader.js

const loader = {
    show: () => {
        // Hårdkoll: Om vi är på GitHub Actions eller lokal test-URL, avbryt DIREKT
        if (window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost')) {
            console.log("Testmiljö detekterad - Loadern inaktiverad");
            return;
        }

        const el = document.getElementById("page-loader");
        if (el) {
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