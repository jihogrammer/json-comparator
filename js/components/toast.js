export const toast = (htmlText, timeout) => {
  const toastContainerId = "toast-" + crypto.randomUUID();
  const toastContainer = document.createElement("div");
  const toastStyle = document.createElement("style");
  const toastContent = document.createElement("div");

  toastContainer.id = toastContainerId;
  toastContainer.style.position = "fixed";
  toastContainer.style.bottom = "0.5rem";
  toastContainer.style.left = "50%";
  toastContainer.style.transform = "translate(-50%, -50%)";
  toastContainer.style.transition = `all ${timeout * 0.7}ms ease`;
  toastContainer.style.width = "100vw";
  toastContainer.style.opacity = 1;
  toastContainer.style.display = "flex";
  toastContainer.style.justifyContent = "center";
  toastContainer.style.backgroundColor = "rgba(0, 0, 0, 0%)";

  toastStyle.innerHTML = `
    #${toastContainerId} > div {
      border-radius: 0.5rem;
      padding: 1rem 0.5rem;
      background-color: var(--accent-3-color);
      color: white;
    }
    #${toastContainerId} > div * {
      background-color: inherit;
      color: white;
    }
  `;

  toastContent.innerHTML = htmlText;

  toastContainer.appendChild(toastStyle);
  toastContainer.appendChild(toastContent);
  document.body.appendChild(toastContainer);

  setTimeout(() => toastContainer.style.opacity = 0, timeout * 0.3);
  setTimeout(() => toastContainer.remove(), timeout);
};
