document.addEventListener("DOMContentLoaded", () => {
  checkDeviceW();
});

/* check the width of device */
let checkDeviceW = () => {
  /* remove flex to allow scroll on small devices */
  let removeFlex = () => {
    if (window.innerWidth < 992) {
      document.querySelector("main").classList.remove("d-flex", "flex-nowrap");
      document.querySelector(".section-closed").classList.remove("text-rotate");
    } else {
      document.querySelector("main").classList.add("d-flex", "flex-nowrap");
      document.querySelector(".section-closed").classList.add("text-rotate");
    };
  };
  /* on document ready */
  removeFlex();
  /* on resize */
  window.addEventListener("resize", () => {
    removeFlex();
  });
};