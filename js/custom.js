let scrollDown;
let lastScrollTop = 0;
const selectors = ['h1[id]','h2[id]'];
let manualHeader = -1;

window.addEventListener("scroll", function() {
  let st = window.pageYOffset || document.documentElement.scrollTop;
  scrollDown = st > lastScrollTop;
  lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);

function getIndex(id) {
  let sections = document.querySelectorAll(selectors);
  for (let i = 0; i < sections.length; ++i) {
    if (sections[i].id == id) {
      return i;
    }
  }
  return -1;
}

window.addEventListener('DOMContentLoaded', () => {
  let els =  document.querySelectorAll(selectors);
  let tocEls = document.querySelectorAll(`.table-of-contents ul a`);
  for (let i = 0; i < els.length; ++i) {
    const headerText = i + "-" + els[i].innerHTML.toLowerCase()
      .split(' ').join('-')
      .split('?').join('')
      .split('(').join('')
      .split(')').join('')
      .split('!').join('');
    els[i].id = headerText;
    const nextA = els[i].nextSibling;
    nextA.id = headerText;
    tocEls[i].href = "#" + headerText;
    tocEls[i].id = headerText + "-toc";
  }

  let onScreen = new Array(els.length);
  onScreen.forEach(x => { x = 0; });
  let lastOnScreen = new Array(els.length);
  lastOnScreen.forEach(x => { x = 0; });


  const observer = new IntersectionObserver(entries => {
    // Get all teh table of content items and clear their active class
    let tocEls = document.querySelectorAll(`.table-of-contents ul a`);

    // Go through all the intersecting elements on the page and
    for (let i = 0; i < entries.length; ++i) {
      let entry = entries[i];
      const id = entry.target.getAttribute('id');
      let el = document.querySelector(`.table-of-contents ul a[id*="${id}"]`);
      let hNum = getIndex(id);

      if (entry.intersectionRatio > 0) {
        el?.classList.add('active');
        onScreen[hNum] = 1;
      } else {
        el?.classList.remove('active');
        onScreen[hNum] = 0;
      }
    }

    let sum = onScreen.reduce(function(a, b) { return a + b }, 0);
    if (sum == 0) {
      for (let i = 0; i < onScreen.length; ++i) {
        if (lastOnScreen[i] == 1 && onScreen[i] == 0) {
          // Found header that just left screen
          if (scrollDown) {
            tocEls[i].classList.add('active');
            manualHeader = i;
          } else {
            tocEls[i-1].classList.add('active');
            manualHeader = i-1;
          }

        }
      }
    }
    if (sum > 0 && manualHeader >= 0 && onScreen[manualHeader] == 0) {
      tocEls[manualHeader].classList.remove('active');
    }
    lastOnScreen = onScreen.slice();

  });

  // Track all sections that have an `id` applied
  document.querySelectorAll(selectors).forEach((section) => {
    observer.observe(section);
  });
});