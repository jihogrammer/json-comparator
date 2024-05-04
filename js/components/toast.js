export const toast = (htmlText, timeout) => {
  const toastContainerId = "toast-" + crypto.randomUUID();
  const toastContainer = document.createElement("div");
  const toastStyle = document.createElement("style");
  const toastContent = document.createElement("div");

  toastContainer.id = toastContainerId;

  toastStyle.innerHTML = `
    #${toastContainerId} {
      position: fixed;
      bottom: 0.5rem;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: all ${timeout * 0.7}ms ease;
      width: 100vw;
      opacity: 1;
      display: flex;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0%);
    }
    #${toastContainerId} > div {
      border-radius: 0.5rem;
      padding: 1rem 0.5rem;
      background-color: var(--accent-2-color);
      color: var(--white-color);
    }
    #${toastContainerId} > div * {
      background-color: inherit;
      color: var(--white-color);
    }
  `;

  toastContent.innerHTML = htmlText;

  toastContainer.appendChild(toastStyle);
  toastContainer.appendChild(toastContent);
  document.body.appendChild(toastContainer);

  setTimeout(() => toastContainer.style.opacity = 0, timeout * 0.3);
  setTimeout(() => toastContainer.remove(), timeout);
};
