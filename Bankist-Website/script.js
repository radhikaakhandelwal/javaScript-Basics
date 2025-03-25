'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////// Cookies alert message //////////
let message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'This website uses cookies for improved functionality and analytics <button class = "btn btn--cookie-close">Got it!</button>';

message.style.backgroundColor = '#37838d';
message.style.width = '105%';

let header = document.querySelector('.header');
header.append(message);

// deleting element on clickig btn
document
  .querySelector('.btn--cookie-close')
  .addEventListener('click', () => message.remove());

////////// 'Learn more' button -> scroll to section1 //////////
let learnMoreBtn = document.querySelector('.btn--scroll-to');
let section1 = document.querySelector('#section--1');

learnMoreBtn.addEventListener('click', function () {
  // console.log(section1.getBoundingClientRect());
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////// NavBar list click -> scroll to respective sections //////////

// the problem here is we created copies (3 here) of the same event listening fucntion for each link which is time consuming and not ideal in case of many links like 100

// document.querySelectorAll('.nav__link').forEach(function (link, i) {
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     // let section = `#section--${i + 1}`;
//     let section = this.getAttribute('href');
//     document.querySelector(section).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// EVENT DELEGATION
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    let section = e.target.getAttribute('href');
    document.querySelector(section).scrollIntoView({ behavior: 'smooth' });
  }
});

////////// understanding 'closest' method
// let h1 = document.querySelector('h1');
// h1.closest('.header').style.background = 'pink';

////////// Operations sections -> Tabbed component //////////
let tabs = document.querySelectorAll('.operations__tab'); //buttons
let tabsContainer = document.querySelector('.operations__tab-container'); //container of buttons
let content = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  // we want to be able to click on button and the span in button to get desired result, therefore;
  let clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // we get null for places where button is not there, to avoid cannot read null property
  if (!clicked) return;

  //remove active tab from all buttons
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  // add active tab to active button
  clicked.classList.add('operations__tab--active');

  //activate content
  let activeNum = clicked.dataset.tab;
  let activeTab = document.querySelector(`.operations__content--${activeNum}`);

  //remove active class from all content
  content.forEach(c => c.classList.remove('operations__content--active'));

  // add active tab to active button
  activeTab.classList.add('operations__content--active');
});

////////// Menu/NavBar link fade animation //////////
let nav = document.querySelector('.nav');

let handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    let link = e.target;
    let siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log(siblings);

    siblings.forEach(s => {
      if (s !== link) s.style.opacity = opacity;
    });
  }
};
nav.addEventListener('mouseover', e => handleHover(e, 0.5));
nav.addEventListener('mouseout', e => handleHover(e, 1));

////////// Sticky Menu/NavBar //////////
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function (entries) {
  entries.forEach(e => {
    // console.log(entries);

    //jab tak 0% se zada visible hai on viewport it will return true
    // the moment 0% se less visible it returns false
    if (!e.isIntersecting) {
      nav.classList.add('sticky');
    } else nav.classList.remove('sticky');
  });
};
const obsOptions = {
  root: null,
  threshold: 0,
  // rootMargin: '-90px',
  // rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

////////// sections getting visible on scroll animation //////////
const secCallback = function (entries, observer) {
  entries.forEach(e => {
    console.log(e);
    if (e.isIntersecting) {
      e.target.classList.remove('section--hidden');
      observer.unobserve(e.target);
    }
  });
};

const secOptions = {
  root: null,
  threshold: 0.25,
};

let allSection = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(secCallback, secOptions);
allSection.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

////////// Lazy image loading //////////
let lazyImg = document.querySelectorAll('img[data-src]');
let imgCallback = function (entries, observer) {
  entries.forEach(e => {
    console.log(e.target);
    if (!e.isIntersecting) return;

    //replce src with data.src when image is on screen
    e.target.src = e.target.dataset.src;

    // e.target.classList.remove('lazy-img');

    // we want to remove lazy after the good image is loaded
    e.target.addEventListener('load', () =>
      e.target.classList.remove('lazy-img')
    );
    observer.unobserve(e.target);
  });
};

let imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0.5,
});
lazyImg.forEach(img => imgObserver.observe(img));

////////// Slider //////////
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let currSlide = 0;
const maxSlide = slides.length;

let goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);

let rightSlide = function () {
  if (currSlide === maxSlide - 1) currSlide = 0;
  else currSlide++;
  goToSlide(currSlide);
  activeDot(currSlide);
};

let leftSlide = function () {
  if (currSlide === 0) currSlide = maxSlide - 1;
  else currSlide--;
  goToSlide(currSlide);
  activeDot(currSlide);
};

btnRight.addEventListener('click', rightSlide);
btnLeft.addEventListener('click', leftSlide);

////////// Slider dots //////////
let dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const activeDot = function (slideNum) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide = "${slideNum}"]`)
    .classList.add('dots__dot--active');
};
activeDot(0);

dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  let slideNum = Number(e.target.dataset.slide);
  console.log(slideNum);
  goToSlide(slideNum);
  activeDot(slideNum);
});

////////// Are you sure - exit msg //////////
window.addEventListener('beforeunload', e => {
  e.preventDefault();
  e.returnValue = '';
});
