'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const allSections = document.querySelectorAll('.section');
const allImages = document.querySelectorAll('.features__img');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////
//  PAGE NAVIGATION   //
////////////////////////

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link'))
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////
//  TABBED COMPONENT  //
////////////////////////

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;
  // Remove active class
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate class
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////
// MENU FADE ANIMATION //
/////////////////////////

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(sibling => {
      if (sibling !== link) {
        sibling.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5)); //value goes to this keyword

nav.addEventListener('mouseout', handleHover.bind(1)); //value goes to this keyword

//////////////////////////
//  STICKY NAVIGATION  //
/////////////////////////

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const entry = entries[0];

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`,
});
headerObserver.observe(header);

//////////////////////////
//   REVEAL SECTIONS   //
/////////////////////////

const revealSection = function (entries, observer) {
  // const entry = entries.find(entry => entry.isIntersecting === true);
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////////
// LAZY LOADING IMAGES //
/////////////////////////

const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.setAttribute('src', entry.target.dataset.src);

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

allImages.forEach(image => {
  imageObserver.observe(image);
});

////////////////////
//    SLIDER     //
///////////////////

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

const dotsContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  });
};
createDots();

const goToSlide = function (s) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - s)}%)`;
  });
};

goToSlide(0);

const nextSlide = function () {
  if (curSlide === maxSlide - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
  activateDots(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;
  goToSlide(curSlide);
  activateDots(curSlide);
};

const activateDots = function (s) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${s}"]`)
    .classList.add('dots__dot--active');
};
activateDots(0);

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

dotsContainer.addEventListener('click', function (e) {
  const dot = e.target;
  if (!dot.classList.contains('dots__dot')) return;

  goToSlide(dot.dataset.slide);
  activateDots(dot.dataset.slide);
});

// const slide1 = document.querySelector('.slide--1');
// const slide2 = document.querySelector('.slide--2');
// const slide3 = document.querySelector('.slide--3');

// slide1.style.transform = `translateX(${0}%)`;
// slide2.style.transform = `translateX(${100}%)`;
// slide3.style.transform = `translateX(${200}%)`;
// const header = document.querySelector('.header');
// const navHeight = nav.getBoundingClientRect().height;

// const stickyNav = function (entries) {
//   const [entry] = entries;

//   if (!entry.isIntersecting) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// };

// const headerObserver = new IntersectionObserver(stickyNav, {
//   root: null,
//   threshold: 0,
//   rootMargin: `${-navHeight}px`,
// });
// headerObserver.observe(header);

// const observerFunction = function (entries, observer) {
//   console.log('header out of view');
// };

// const observerOptions = {
//   root: null,
//   threshold: 0,
// };

// const observer = new IntersectionObserver(observerFunction, observerOptions);
// observer.observe(header);

// const tabs = document.querySelectorAll('.operations__tab');
// const tabsContainer = document.querySelector('.operations__tab-container');
// const tabsContent = document.querySelectorAll('.operations__content');

// tabsContainer.addEventListener('click', function (e) {
//   const clicked = e.target.closest('.operations__tab');

//   if (!clicked) return;

//   //Remove active classes
//   tabs.forEach(tab => tab.classList.remove('operatons__tab--active'));
//   tabsContent.forEach(content =>
//     content.classList.remove('operations__content--active')
//   );

//   //Activate class
//   clicked.classList.add('operations__tab--active');
//   document
//     .querySelector(`.operations__content--${clicked.dataset.tab}`)
//     .classList.add('operations__content--active');
// });

////////////////////////////

// const navLinks = document.querySelectorAll('.nav__link');

// navLinks.forEach(navLink => {
//   navLink.addEventListener('click', function (e) {
//     e.preventDefault();

//     document
//       .querySelector(this.getAttribute('href'))
//       .scrollIntoView({ behavior: 'smooth' });

// document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
// document
//   .querySelector(this.getAttribute('href'))
//   .scrollIntoView({ behavior: 'smooth' });

// section1.scrollIntoView({ behavior: 'smooth' });
//   });
// });
// navLink.addEventListener('click', function (e) {
//   console.log('helo');
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = "I'am a message";
// message.innerHTML =
//   'We use cookie to do it <button class="btn btn-cookies">Got it</button>';
// // console.log(message);

// const header = document.querySelector('.header');

// // header.prepend(message);

// // header.append(message.cloneNode(true));
// header.append(message);

// document.querySelector('.btn-cookies').addEventListener('click', function () {
//   message.remove();
// });

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height);
// console.log(message.style.backgroundColor);
// console.log(message.style.width);

// console.log(getComputedStyle(message).height);

// // const h = Number.parseFloat(getComputedStyle(message).height) + 100 + 'px';

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// console.log(message.style.height);

// // message.style.height =
// //   Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';
// // message.style.height =
// //   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
// // console.log(getComputedStyle(message).height);

// // const n = '40.777px';

// // console.log(n);
// // console.log(Number.parseFloat(n) + 10 + 'px');

// document.documentElement.style.setProperty('--color-primary', 'red');

// const logo = document.querySelector('.nav__logo');

// console.log(logo.src);
// console.log(logo.alt);
// logo.alt = 'Bootiful logo';

// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));

// console.log(logo.className);

// logo.setAttribute('name', 'nnnon');

// console.log();

// console.log(logo.dataset.versionNumber);

// const logo = document.querySelector('.nav__logo');

// const alertLogo = e => {
//   alert('hahahah ');
// };
// logo.addEventListener('mouseenter', alertLogo);

// setTimeout(() => logo.removeEventListener('mouseenter', alertLogo), 3000);

// logo.onmouseenter = () => alert('hahaha1');

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min)) + 1 + min;

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // e.stopPropagation();
//   console.log('link', e.target);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // e.stopPropagation();
//   console.log('list', e.target);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('nav', e.target);
// });

// const h1 = document.querySelector('h1');

// // console.log(h1.children);

// // console.log(h1.firstElementChild);
// // console.log(h1.lastElementChild);

// h1.lastElementChild.style.color = 'var(--color-secondary-darker)';

// //parents

// console.log(h1.parentElement);
// console.log(h1.closest('.header__title'));

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
