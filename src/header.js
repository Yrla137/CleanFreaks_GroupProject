/*     // HAMBURGARMENY //
    const menuBtn = document.querySelector(".menu-btn");
    const menu = document.querySelector(".menu");
    // Skapar variabler för meny-knappen och själva menyn

    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("active");
        // Lägger på/tar bort klassen "active" på både knappen och menyn när man klickar på knappen
        if (menu.classList.contains("active")) {
        // Om menyn har klassen "active" → aria-label = "Stäng meny"
            menuBtn.setAttribute("aria-label", "Stäng meny");
        } else {
            menuBtn.setAttribute("aria-label", "Öppna meny");
        // Om menyn inte har klassen "active" → aria-label = "Öppna meny"
        }
    });

    const links = menu.querySelectorAll("a");
    // Alla länkar i menyn
    links.forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            menuBtn.setAttribute("aria-label", "Öppna meny");
            // När man klickar på en länk i menyn → döljs menyn och aria-label ändras tillbaka till "Öppna meny"
        });
        }); */
        
        const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");

menuBtn.addEventListener("click", () => {
  const isOpen = menuBtn.classList.toggle("active");
  menu.hidden = !isOpen;
  menuBtn.setAttribute("aria-expanded", isOpen);
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

        document.querySelector(".icon").addEventListener("click", () => {
            // kör sökning
            
        });
