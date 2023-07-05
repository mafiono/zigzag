let previousOffset = 0;

export default function headerScrollFixer() {
  window.onscroll = function () {
    let now = window.pageYOffset,
      header = document.getElementsByTagName("header")?.[0];

    if (now > 200) {
      if (now - previousOffset > 50) {
        header?.classList?.add("hide");
        previousOffset = now;
      } else if (now - previousOffset < -50) {
        header?.classList?.remove("hide");
        previousOffset = now;
      }
    } else {
      header?.classList?.remove("hide");
      previousOffset = 0;
    }
  };
}
