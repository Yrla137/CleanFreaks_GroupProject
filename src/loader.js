// src/loader.js

const loader = {
    show: () => {
        const el = document.getElementById("page-loader");
        if (el) {
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