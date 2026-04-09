const loader = {
    show: () => {
        const el = document.getElementById("page-loader");
        if (el) el.style.display = "flex";
    },
    hide: () => {
        const el = document.getElementById("page-loader");
        if (el) {
            el.style.opacity = "0";
            setTimeout(() => {
                el.style.display = "none";
            }, 400); // Vänta på att animationen ska bli klar
        }
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    loader.show();

    const allData = await getAllSearchData();

    loader.hide();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof loader !== 'undefined') {
            loader.hide();
        }
    }, 1500);
});