'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-12-26T14:11:59.604Z',
    '2020-12-28T17:01:17.194Z',
    '2020-12-29T23:36:17.929Z',
    '2020-12-31T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const movementsDate = document.querySelector('.movements__date');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatDate = function (date, locale) {
  const calcDisplayDate = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));

  const daysPassed = calcDisplayDate(new Date(), date);

  if (daysPassed <= 7) {
    if (daysPassed === 0) return 'Today';
    else if (daysPassed === 1) return 'Yesterday';
    else return `${daysPassed} days ago`;
  } else {
    //   const year = date.getFullYear();
    //   const month = `${date.getMonth()}`.padStart(2, 0);
    //   const day = `${date.getDate()}`.padStart(2, 0);
    //   displayDate = `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatNumber = function (number, locale, curr) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
  }).format(number);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // const displayDate = `${displayDate.getDate()}/${displayDate.getMonth()}/${displayDate.getFullYear()}  `;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatDate(date, acc.locale);

    const formatMov = formatNumber(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatNumber(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatNumber(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatNumber(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatNumber(
    interest,
    acc.locale,
    acc.currency
  );
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//fake logged in always
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

///////

const startTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min} : ${sec}`;

    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';

      clearInterval(timer);
    }
    time--;
  };
  //time in seconds
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    const now = new Date(); ///current date
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Update UI
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = startTimer();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';

  clearInterval(timer);
  timer = startTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(Math.sqrt(25));

// console.log(25 ** 0.5);

// const randomNumber = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;

// const diceRoll = Array.from({ length: 10 }, num => randomNumber(10, 20));

// console.log(diceRoll);

// const now = new Date();

// console.log(now);

// console.log(new Date('August 16 2000 8:10:45'));

// console.log(new Date('Dec 2015 10 1:1:1'));

// console.log(new Date(2040, 1, 20, 5, 54, 12));

// const fuckture = new Date(2077, 7, 16, 9, 30, 20);

// console.log(fuckture);
// console.log(fuckture.getFullYear());
// console.log(fuckture.getMonth());
// console.log(fuckture.getDay());

// console.log(fuckture.getTime());

// console.log(fuckture.toISOString());

// console.log(new Date(3396312020000));

// console.log(account1.movementsDates[0]);

// console.log(new Date(account1.movementsDates[0]).getFullYear());

// const calcDate = (date1, date2) =>
//   Math.abs(date2 - date1) / (24 * 60 * 60 * 1000);

// const d1 = new Date(2077, 7, 28);
// const d2 = new Date(2077, 7, 16);

// console.log(calcDate(d1, d2));

// const now = new Date();
// const options = {
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric',
//   hour: 'numeric',
//   minute: 'numeric',
//   weekday: 'long',
// };

// console.log(new Intl.DateTimeFormat('en-US', options).format(now));

// const num = 2132134.2121;

// const options = {
//   style: 'unit',
//   unit: 'mile-per-hour',
// };

// console.log(new Intl.NumberFormat('hi-IN', options).format(num));

// console.log(new Intl.NumberFormat('en-US', options).format(num));

// setTimeout(
//   (name1, name2) =>
//     console.log(`let's go!!! new year daaru with ${name1} and ${name2} `),
//   2000,
//   'gnja',
//   'sumit'
// );

// console.log('wiaitng');
// //
// setInterval(() => {
//   const now = new Date();
//   console.log(new Intl.DateTimeFormat('eng-US').format(now));
// }, 1000);

// let now = new Date();
// const ogMin = now.getMinutes();
// const ogSec = now.getSeconds();

// setInterval(function () {
//   console.log(`${now.getMinutes()}:${now.getSeconds()}`);
//   now.setSeconds(now.getSeconds() - 1);

// }, 1000);
