let scrollDown;
let lastScrollTop = 0;

window.addEventListener("scroll", function() {
  let st = window.pageYOffset || document.documentElement.scrollTop;
  scrollDown = st > lastScrollTop;
  lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);

function getIndex(id) {
  let sections = document.querySelectorAll(['h1[id]','h2[id]']);
  for (let i = 0; i < sections.length; ++i) {
    if (sections[i].id == id) {
      return i;
    }
  }
  return -1;
}

window.addEventListener('DOMContentLoaded', () => {
  let els =  document.querySelectorAll(['h1[id]','h2[id]']);
  let tocEls = document.querySelectorAll(`.table-of-contents ul a`);
  for (let i = 0; i < els.length; ++i) {
    const tag = els[i].tagName.toLowerCase();
    els[i].id = tag+"-"+i; // anti-scroll offending line
    tocEls[i].id = tag+"-"+i;
  }

  let lastItems = [];
  const observer = new IntersectionObserver(entries => {
    let tocEls = document.querySelectorAll(`.table-of-contents ul a`);
    tocEls.forEach(tocEl => {
      tocEl.classList.remove('active');
    });
    // let el = document.querySelector(`.table-of-contents ul a[id*="${id}"]`);
    for (let i = 0; i < entries.length; ++i) {
      let entry = entries[i];
      const id = entry.target.getAttribute('id');
      let el = document.querySelector(`.table-of-contents ul a[id*="${id}"]`);

      if (entry.intersectionRatio > 0) {
        el?.classList.add('active');
      } else {
        el?.classList.remove('active');
      }

      if (entries.length == 1 && entry.intersectionRatio == 0) {
        let ii = getIndex(id);
        let index = Math.max(scrollDown ? ii : ii-1, 0);
        let newId = tocEls[index].classList.add('active');;
      }
    }

  });

  // Track all sections that have an `id` applied
  document.querySelectorAll(['h1[id]','h2[id]']).forEach((section) => {
    observer.observe(section);
  });
});