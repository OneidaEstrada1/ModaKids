// ================================
// MODAKIDS - JAVASCRIPT PRINCIPAL
// ================================

// Menú móvil
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Modal sencillo para las categorías
const categoryInfo = {
  "Vestidos": "Un vestido es una prenda que normalmente cubre el cuerpo y tiene una parte de falda. ¡Puede tener muchos colores y estilos!",
  "Camisetas": "Una camiseta es una prenda cómoda que usamos en la parte superior del cuerpo. Es perfecta para el día a día.",
  "Pantalones": "Los pantalones son prendas que cubren las piernas y normalmente tienen dos partes, una para cada pierna.",
  "Faldas": "Una falda es una prenda que cubre la parte inferior del cuerpo y puede ser corta, larga o de muchos estilos.",
  "Chaquetas": "Una chaqueta es una prenda que ayuda a protegernos del frío o del viento.",
  "Accesorios": "Los accesorios complementan la ropa. Algunos ejemplos son sombreros, lazos, bolsos y gorras."
};

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    alert(`${category} 💗\n\n${categoryInfo[category]}`);
  });
});

// Mini juego
const gameOptions = document.querySelectorAll("#gameOptions button");
const gameFeedback = document.getElementById("gameFeedback");
const scoreElement = document.getElementById("score");
const nextQuestion = document.getElementById("nextQuestion");

let score = 0;
let answered = false;

gameOptions.forEach(option => {
  option.addEventListener("click", () => {
    if (answered) return;
    answered = true;

    if (option.dataset.answer === "correct") {
      score++;
      scoreElement.textContent = score;
      gameFeedback.textContent = "¡Correcto! 🎉 ¡Muy bien!";
      option.style.borderColor = "#83b996";
    } else {
      gameFeedback.textContent = "Casi... 💗 ¡Inténtalo de nuevo!";
      option.style.borderColor = "#e5a5b1";
    }
  });
});

nextQuestion.addEventListener("click", () => {
  answered = false;
  gameFeedback.textContent = "";
  gameOptions.forEach(option => {
    option.style.borderColor = "transparent";
  });
});
