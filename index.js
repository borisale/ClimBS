document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const form = document.getElementById("contact_form");

    if (menuToggle && navLinks) {
        const setMenuOpen = (isOpen) => {
            navLinks.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Cerrar menú" : "Abrir menú"
            );
        };

        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
            setMenuOpen(isOpen);
        });

        navLinks.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                setMenuOpen(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        });
    }

    //Validación formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Formulario enviado correctamente");
    });

});
