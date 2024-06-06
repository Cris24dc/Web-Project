// create card
function createImageCard(imageSrc) {
  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "uploaded image";

  const details = document.createElement("div");
  details.classList.add("details");

  const p = document.createElement("p");
  p.textContent = "Image";

  const detailsOptions = document.createElement("div");
  detailsOptions.classList.add("details-options");

  const heartButton = document.createElement("button");
  heartButton.classList.add("card-heart-btn");
  const heartImg = document.createElement("img");
  heartImg.classList.add("card-heart");
  heartImg.src = "../svg/heartOff.svg";
  heartImg.alt = "";
  heartButton.appendChild(heartImg);

  const trashButton = document.createElement("button");
  trashButton.classList.add("card-trash-btn");
  const trashImg = document.createElement("img");
  trashImg.classList.add("card-trash");
  trashImg.src = "../svg/trash.svg";
  trashImg.alt = "";
  trashButton.appendChild(trashImg);

  detailsOptions.appendChild(heartButton);
  detailsOptions.appendChild(trashButton);

  details.appendChild(p);
  details.appendChild(detailsOptions);

  card.appendChild(img);
  card.appendChild(details);

  return card;
}

// verify image file extension
function isImageFile(file) {
  const validImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  return validImageTypes.includes(file.type);
}

// shuffle button
document.addEventListener("DOMContentLoaded", () => {
  const shuffleBtn = document.getElementsByTagName("button")[0];
  const shuffleTxt = document.getElementsByClassName(".shuffle-txt");
  const cardsContainer = document.getElementsByClassName(".cards");
  let shuffleInterval;
  let isShuffling = false;

  function shuffleCards() {
    const cards = Array.from(cardsContainer.children).filter(
      (card) => !card.classList.contains("drop-card")
    );
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    cards.forEach((card) => cardsContainer.appendChild(card));
  }

  function startShuffling() {
    shuffleInterval = setInterval(shuffleCards, 200);
    shuffleTxt.style.backgroundColor = "var(--gray-color)";
    isShuffling = true;
    localStorage.setItem("isShuffling", "true");
  }

  function stopShuffling() {
    clearInterval(shuffleInterval);
    shuffleTxt.style.backgroundColor = "var(--light-gray-color)";
    isShuffling = false;
    localStorage.setItem("isShuffling", "false");
  }

  shuffleBtn.addEventListener("click", () => {
    if (isShuffling) {
      stopShuffling();
    } else {
      startShuffling();
    }
  });

  if (localStorage.getItem("isShuffling") === "true") {
    startShuffling();
  }
});

// add image
document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelector(".options-add");
  const cardsContainer = document.querySelector(".cards");
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  addButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && isImageFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newCard = createImageCard(e.target.result);
        cardsContainer.appendChild(newCard);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }

    fileInput.value = "";
  });
});

// trash bin button
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".cards").addEventListener("click", (event) => {
    if (event.target.closest(".card-trash-btn")) {
      const card = event.target.closest(".card");
      card.remove();
    }
  });
});

// heart button
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".cards").addEventListener("click", (event) => {
    if (event.target.closest(".card-heart-btn")) {
      const heartImg = event.target
        .closest(".card-heart-btn")
        .querySelector(".card-heart");

      if (heartImg.src.includes("heartOff.svg")) {
        heartImg.src = "../svg/heartOn.svg";
      } else {
        heartImg.src = "../svg/heartOff.svg";
      }
    }
  });
});

// drag and drop
document.addEventListener("DOMContentLoaded", () => {
  const dropCard = document.querySelector(".drop-card");
  const cardsContainer = document.querySelector(".cards");

  dropCard.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropCard.classList.add("dragover");
  });

  dropCard.addEventListener("dragleave", () => {
    dropCard.classList.remove("dragover");
  });

  dropCard.addEventListener("drop", (event) => {
    event.preventDefault();
    dropCard.classList.remove("dragover");

    const files = event.dataTransfer.files;
    if (files.length > 0 && isImageFile(files[0])) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const newCard = createImageCard(e.target.result);
        cardsContainer.appendChild(newCard);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please drop a valid image file.");
    }
  });
});
