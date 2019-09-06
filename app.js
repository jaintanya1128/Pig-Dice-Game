/*********** global variables: ************/
var gameScore = 0;
var currentScore = 0;
var activePlayerId;
var isGameActive = false;
var hasWinner = false;
var counter = 0;
var oldGameScore;
/*********** GLOBAL FUNCTIONS: ************/
function setGameScore() {
  if (gameScore < 20) {
    //prompt for game score and then activate the GAME
    gameScore = prompt('Please enter game score', 'value should be grater than 20');
    if (gameScore >= 20 && gameScore != null) {
      isGameActive = true
    } else {
      isGameActive = false;
    }
    if (isGameActive) {
      document.querySelector('.main-score').value = gameScore;
      document.querySelector('input[name="main-score"]').disabled = true;
    } else {
      document.querySelector('.dice-wrappper').style.display = 'none';
      document.querySelector('.btn-roll').disabled = true;
      document.querySelector('.btn-hold').disabled = true;
    }

  } else {
    isGameActive = true;
  }
}

//set every thing to its initial stage when game starts
function init() {
  //set all score to 0
  document.querySelectorAll('.player-score').forEach(function(el) {
    el.textContent = '0';
  });
  document.querySelectorAll('.current-score').forEach(function(el) {
    el.textContent = '0';
  });

  //player 0 to be active
  document.querySelector('.player-1').classList.contains('active') ? document.querySelector('.player-1').classList.remove('active') : '';
  document.querySelector('.player-0').classList.add('active');
  activePlayerId = 0;
  gameScore = 0;

  //both dice to be hidden
  document.querySelector('.dice-wrappper').style.display = 'none';

  //Set the game score
  var isGameScoreSet = confirm('Do you what to set custom game score?');

  if (isGameScoreSet) {
    document.querySelector('input[name="main-score"]').disabled = false;
  } else {
    setGameScore();
    document.querySelector('input[name="main-score"]').disabled = true;
  }

  document.querySelector('input[name="main-score"]').value = gameScore;
}

function nextPlayer() {
  document.querySelector(`.player-${activePlayerId}`).classList.remove('active');
  activePlayerId == 0 ? activePlayerId = 1 : activePlayerId = 0;
  document.querySelector(`.player-${activePlayerId}`).classList.add('active');

  //both dice to be hidden
  document.querySelector('.dice-wrappper').style.display = 'none';
}

/*********** event listeners: ************/
document.querySelector('input[name="main-score"]').addEventListener('focus', function() {
  oldGameScore = document.querySelector('input[name="main-score"]').value;
});

document.querySelector('input[name="main-score"]').addEventListener('change', function() {
  if (!isGameActive) {
    gameScore = this.value;
    setGameScore();
  }
});

document.querySelector('.btn-new').addEventListener('click', function() {
  //initial the game again
  init();

  //Enable both the game playing buttons when its a new game
  document.querySelector('.btn-roll').disabled = false;
  document.querySelector('.btn-hold').disabled = false;

  //reset the player names
  document.querySelector('.player-0 .player-name').textContent = 'Player 1';
  document.querySelector('.player-1 .player-name').textContent = 'Player 2';

  document.querySelectorAll('.player-name').forEach(function(el) {
    el.removeAttribute('style');
  });
});


document.querySelector('.btn-roll').addEventListener('click', function() {
  if (isGameActive) {
    //generate random number for dice
    var dice1 = Math.floor(Math.random() * 6 + 1);
    var dice2 = Math.floor(Math.random() * 6 + 1);

    //display dice image for the same
    document.querySelector('.dice-wrappper').style.display = 'block';
    document.querySelector('#dice-1').src = `images/dice-${dice1}.png`;
    document.querySelector('#dice-2').src = `images/dice-${dice2}.png`;

    //RULE: if the player rolls a 1 on any dice, all his CURRENT score gets lost. After that, it's the next player's turn
    if (dice1 == 1 || dice2 == 1) {
      currentScore = 0;
      document.querySelector(`.player-${activePlayerId} .current-score`).textContent = currentScore;
      nextPlayer();
    } else {
      //update the current score with the sum totals
      currentScore = document.querySelector(`.player-${activePlayerId} .current-score`).textContent;
      currentScore = Number(currentScore) + dice1 + dice2;
      document.querySelector(`.player-${activePlayerId} .current-score`).textContent = currentScore;
    }
  } else {
    //initial the game again
    init();
  }

});

document.querySelector('.btn-hold').addEventListener('click', function() {
  if (isGameActive) {
    //add the player score and current score and update the player score
    var playerScore = document.querySelector(`.player-${activePlayerId} .player-score`).textContent;
    currentScore = document.querySelector(`.player-${activePlayerId} .current-score`).textContent;

    playerScore = Number(playerScore) + Number(currentScore);

    document.querySelector(`.player-${activePlayerId} .player-score`).textContent = playerScore;
    document.querySelector(`.player-${activePlayerId} .current-score`).textContent = 0;

    //TEST for WINNER
    if (playerScore >= gameScore) {
      document.querySelector(`.player-${activePlayerId} .player-name`).textContent = 'WINNER';
      document.querySelector(`.player-${activePlayerId} .player-name`).style.color = '#de7c70';

      isGameActive = false;
      document.querySelector('.dice-wrappper').style.display = 'none';
      document.querySelector('.btn-roll').disabled = true;
      document.querySelector('.btn-hold').disabled = true;
    } else {
      nextPlayer();
    }
  } else {
    //initial the game again
    init();
  }
});

/********* GLOBAL function call ***********/
init();