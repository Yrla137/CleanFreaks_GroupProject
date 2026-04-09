const header = document.querySelector(".header");

if (header) {
  const menuBtn = header.querySelector(".menu-btn");
  const menu = header.querySelector(".menu");
  const searchIcon = header.querySelector(".header-search-icon");
  const form = header.querySelector("form");

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menuBtn.classList.toggle("active");
      menu.hidden = !isOpen;
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      const clickedInsideMenu = menu.contains(e.target);
      const clickedButton = menuBtn.contains(e.target);

      if (!clickedInsideMenu && !clickedButton) {
        menu.hidden = true;
        menuBtn.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (searchIcon && form) {
    searchIcon.addEventListener("click", () => {
      form.submit();
    });
  }
}