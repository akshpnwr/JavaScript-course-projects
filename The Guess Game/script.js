'use strict';

let numberToGuess = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
document.querySelector('.check').addEventListener('click', function () {
  let guess = Number(document.querySelector('.guess').value);

  if (!guess) {
    document.querySelector('.message').textContent = '👀 No number !!';
  } else if (guess == numberToGuess) {
    document.querySelector('.message').textContent = '❤ Correct Answer!!';

    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').textContent = numberToGuess;
    document.querySelector('.number').style.width = '30rem';
    if (score > highscore) highscore = score;
    document.querySelector('.highscore').textContent = highscore;
  } else {
    if (score <= 1) {
      score = 0;
      document.querySelector('.message').textContent = '😢 You lost the game!!';
    } else {
      if (guess < numberToGuess) {
        document.querySelector('.message').textContent = '📈 Too low';
      } else if (guess > numberToGuess) {
        document.querySelector('.message').textContent = '📉Too high';
      }
      score--;
    }
    document.querySelector('.score').textContent = score;
  }
});

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  numberToGuess = Math.trunc(Math.random() * 20) + 1;

  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.message').textContent = 'Start guessing...';
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.guess').value = '';
});
