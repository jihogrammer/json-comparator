import { ModalContainer } from "../components/modal.js";

const modal = new ModalContainer("donation");

const DONATION_IMAGES = ["./img/donation-qr-toss.png", "./img/donation-qr-kakao.jpeg"].map((src) => {
  const img = document.createElement("img");
  img.src = src;
  img.style.display = "block";
  img.style.width = "30vw";
  img.style.objectFit = "cover";
  return img;
});

export const initToolkit = () => {
  document.getElementById("donation").addEventListener("click", () => {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.justifyContent = "center";
    container.style.gap = "1rem";

    for(const img of DONATION_IMAGES) {
      container.appendChild(img);
    }

    modal.activate(container);
  });
};
