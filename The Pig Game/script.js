'use strict';

// Selecting elements
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');
const diceEl = document.querySelector('.dice');

const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');

score0El.textContent = 0;
score1El.textContent = 0;

let currentScore = 0;
let activePlayer = 0;
let score = [0, 0];
let playing = true;

//to switch a player
const switchPlayer = function () {
  score[activePlayer] += currentScore;
  currentScore = 0;

  //If a player wins
  if (score[activePlayer] >= 100) {
    playing = false;
    diceEl.classList.add('hidden');

    document
      .querySelector(`.player--${activePlayer}`)
      .classList.add('player--winner');
  } else {
    //toggle between the active player
    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
  }

  document.getElementById(`score--${activePlayer}`).textContent =
    score[activePlayer];
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
};

btnRoll.addEventListener('click', function (event) {
  if (playing) {
    // Generate Dice roll number
    let diceNumber = Math.trunc(Math.random() * 6) + 1;
    console.log(diceNumber);

    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${diceNumber}.png`;

    //Check for dice roll number 1
    if (diceNumber === 1) {
      //switch player
      switchPlayer();

      // }
    } else {
      //add dice roll number to current score
      currentScore += diceNumber;
      document.getElementById(
        `current--${activePlayer}`
      ).textContent = currentScore;
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    switchPlayer();
  }
});

//resetting the game --> click new game

btnNew.addEventListener('click', function () {
  currentScore = 0;
  activePlayer = 0;
  score = [0, 0];
  playing = true;
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  if (!player0El.classList.contains('player--active')) {
    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');
  }

  if (player0El.classList.contains('player--winner'))
    player0El.classList.remove('player--winner');
  if (player1El.classList.contains('player--winner'))
    player1El.classList.remove('player--winner');
});
