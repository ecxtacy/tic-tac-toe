

let turns = 0;

let winCode = -1;
/*
  winCode = 1 --> right to left diagonal
  winCode = 2 --> left to right diagonal

  winCode = rx --> xth row
  winCode = cx --> xth column
*/


// * A module of Gameboard which contains the gameboard object
const gameboard = (() => {

  // this will represent the state of blocks, 'X' or 'O'
  // null if neither 'X' nor 'O'

  let blockState = [];

  // will store all block objects as array, indexed 0 to 8
  let blockObjects = [];

  //* adding the DOM objects to the blockObjects[] array
  for(let i = 0; i < 9;  i++) {
    const currentBlock = document.querySelector(`.gameboard > .box-${i}`);
    blockObjects.push(currentBlock);
  }



  // function just for debugging
  // prints the blockObjects array
  const printBlockArray = () => {
    console.log(blockObjects);
  };



  // function to check who wins
  // returns either 'x' or 'o' who won
  // otherwise returns 'draw'
  function checkWin() {
    
    let someoneWon = false;
    let whoWon = null;

    // check diagonals

    let diagwin = false;

    let bx = gameboard.blockObjects;

    if(
      (bx[0].textContent == bx[4].textContent &&
      bx[4].textContent == bx[8].textContent &&
      bx[4].textContent != '') 
      ||
      (bx[2].textContent == bx[4].textContent &&
      bx[4].textContent == bx[6].textContent)
    ) {
      someoneWon = true;
      whoWon = bx[4].textContent

      if(bx[0].textContent == bx[4].textContent) {
        winCode = 1;
      }
      else {
        winCode = 2;
      }

    }

    let bnum = 0;

    for(let i = 0; i < 9; i+=3)
    {
      if(
        (bx[i].textContent == bx[i+1].textContent &&
        bx[i+1].textContent == bx[i+2].textContent &&
        bx[i+1].textContent != '')
      ) {
        someoneWon = true;
        whoWon = bx[i].textContent;

        winCode = `r${Math.floor(i/3)}`;

        break;
      }
    }




    for(let i = 0; i < 3; i++)
    {
      if(
        (bx[i].textContent == bx[i+3].textContent &&
        bx[i+3].textContent == bx[i+6].textContent &&
        bx[i+3].textContent != '')
      ) {
        someoneWon = true;
        whoWon = gameboard.blockObjects[i].textContent;

        winCode = `c${i}`;

        break;
      }
    }


    if(someoneWon) {
      return whoWon.toLowerCase();
    }
    else if(!someoneWon && (turns >= 9)){
      return 'draw';
    }
    else {
      return 'none won';
    }
  }


  function displayWinAnimation(winCode) {

    let bx = gameboard.blockObjects;
    if(winCode == 1) {
      bx[0].classList.add('winbox');
      bx[4].classList.add('winbox');
      bx[8].classList.add('winbox');

    }
    else if (winCode == 2) {
      bx[2].classList.add('winbox');
      bx[4].classList.add('winbox');
      bx[6].classList.add('winbox');
    }
    else if (winCode[0] ==  'r') {
      let num = 3*Number(winCode[1]);
      bx[num].classList.add('winbox');
      bx[num+1].classList.add('winbox');
      bx[num+2].classList.add('winbox');

    } 
    else if (winCode[0] == 'c') {
      let num = Number(winCode[1]);
      bx[num].classList.add('winbox');
      bx[num+3].classList.add('winbox');
      bx[num+6].classList.add('winbox');
    }
  }
  


  return {
    blockObjects,
    printBlockArray,
    checkWin,
    displayWinAnimation
  };



  
})();

gameboard.printBlockArray();









//! ---------------------- displayController Module -------------------

// controls the event-logic and renders the DOM accordingly
const displayController = ((gameboard) => {
  
  function initDisplayControl() {
    
  }

  function renderTurn(blockNumber, choice) {

    
    gameboard.blockObjects[blockNumber].textContent = choice.toUpperCase();
    console.log("turns is " + turns);


    let winStatus = gameboard.checkWin();
    // console.log('playerchoice is ' + player.getPlayerChoice())

    let compChoice = (player.getPlayerChoice() == 'x') ? 'o' : 'x';
    // console.log('compchoice is ' + compChoice)
    if(winStatus == player.getPlayerChoice()) {
      console.log("you won");

      console.log('winCode is ' + winCode);
      gameboard.displayWinAnimation(winCode);

      // now display the play again modal
      modalController.displayPlayAgainModal(0);
      
    }
    else if(winStatus == 'draw') {
      console.log('current draw');
      modalController.displayPlayAgainModal(1);
      

      // now display the play again modal
    }
    else if(winStatus == compChoice){
      console.log('computer won');

      console.log(winCode);
      gameboard.displayWinAnimation(winCode);



      // now display the play again modal
      modalController.displayPlayAgainModal(2);
      
    }



    if(turns == 9) {
      setTimeout(() => {
          console.log("over");
      }, 150);
    }
  }

  function displayTurn(playerName, boxNumber, choice) {
    if(playerName == 'computer') {

    }
    else {

    }
  }


  /*
  function getPlayerTurn(playerName, choice) {
    if(playerName == 'computerPlayer')
    {
      computerPlayer.
    }
    else {
      
    }
  }
  */



  return (
    {
      initDisplayControl,
      renderTurn
    }
  );


})(gameboard);


//! initialize the displayControl 
// displayController.initDisplayControl();



















//! ----------- ChoiceButton Module to fetch X or O choice ------------

/*
- basically returns playerChance, whether player is first or not
*/
const xButton = document.querySelector('.btn-choose.cross button');
const oButton = document.querySelector('.btn-choose.hole button');

const choiceButton = ((xButton, oButton) => {

  // select the DOM buttons

  
  // changes the button color by altering the css class, as it saves the bullshit cause by inline css to the DOM
  function changeButtonColor(button, color) {

    // reset
    if(color == null)
    {
      button.className = "";
      return;
    }
    
    // change color
    button.className = 'selected';
  }

  let choice = null;
  
  // what to do when button clicked
  function buttonSelect(event) {
    

    // if xButton selected change its color and reset oButton
    if(event.target == xButton) {
      if(xButton.className == "")
      {
        changeButtonColor(xButton, 'lightgreen');
        changeButtonColor(oButton, null);

        // we have the choice
        choice = 'x';
        getChoice();
      }
    }
    else {
        // if oButton selected change its color and reset xButton
        changeButtonColor(oButton, 'lightgreen');
        changeButtonColor(xButton, null);

        // we have the choice
        choice = 'o';
        getChoice();

    }
  }


  //! add the event listeners to the X and O buttons

  function addChoiceBtnEvent() {
    xButton.addEventListener('click', buttonSelect);
    oButton.addEventListener('click', buttonSelect);
  }

  function getChoice() {
    // console.log("choice is " + choice);
    return choice
  }

    return {
      addChoiceBtnEvent,
      getChoice,
    };
  
})(xButton, oButton);


// execute -->
choiceButton.addChoiceBtnEvent();
























//! --------- computerPlayer ------------

let computerPlayer = (() => {

  let computerChoice;
  
  // returns the choice of computer according to choice of player
  function getComputerChoice() {
    computerChoice = (choiceButton.getChoice() == 'x') ? 'o' : 'x';
    return computerChoice;
  }



  function playTurn() {
    turns++;
    let targetBoxNumber = randomNumber(9);
    let targetBox = gameboard.blockObjects[targetBoxNumber];
    while(targetBox.textContent != "") {
      if((turns > 9)) {
        break;
      }
      targetBoxNumber = randomNumber(9);
      targetBox = gameboard.blockObjects[targetBoxNumber];
    }
      return targetBoxNumber;
  }


  // returns a random integer less than the argument maxNum and >= 0
  function randomNumber(maxNum) {
    return Math.floor(((Math.random()*1000) % maxNum));
  }

  return (
    {
      playTurn,
      getComputerChoice
    }
  );

})();













//! ----------------- Player object Factory Function ------------------

let Player = (playerName, firstChance) => {

  let playerChoice; 

  function getPlayerName() {
    return playerName;
  }

  function isFirst() {
    return firstChance;
  }


  function onPlayerTurn(event) {

    // displayController.renderTurn();
    let playerBoxClass = event.target.classList[1];
    let playerBoxNumber = playerBoxClass[playerBoxClass.length-1];

    console.log(event.target);


    // only if valid turn ie. not already played
    if(gameboard.blockObjects[playerBoxNumber].textContent == '') {


      displayController.renderTurn(playerBoxNumber, ((firstChance) ? 'x' : 'o'));
      turns++;
      
      
          // checkWinStatus();

          if(turns == 9) {
            let won = gameboard.checkWin();
            if(won == 'draw') {
              modalController.displayPlayAgainModal(1);
            }
          }
          else {

            setTimeout(() => {
        
              // if(turns == 9) {
              //   alert("over");
              // }
        
              // computer selects which block to play
              let computerBlock = computerPlayer.playTurn();
              console.log("computerBlock is " + computerBlock);
        
              // checkWinStatus();
          
              // render the computer's turn here
              
              displayController.renderTurn(computerBlock, computerPlayer.getComputerChoice());
        
            }, 300);
          }
      
    


    }



  }

  function getPlayerChoice() {
    return playerChoice;
  }


  // basically on player turn, player clicks the box, then computer plays
  function playTurn() {

    playerChoice = (firstChance) ? 'x' : 'o';

    for(let i = 0; i < 9; i++) {
      gameboard.blockObjects[i].addEventListener('click', onPlayerTurn);
    }

  }

  return {
    getPlayerName,
    isFirst,
    playTurn,
    getPlayerChoice
  }
};







// to create player on x or o button selection
// let dc = Player('dhruv chouhan', true);

// console.log(dc.getPlayerName());
// console.log(dc.isFirst());


// player
let dc;















let player;

// Game module

const Game = (() => {
  let startBtn = document.querySelector('button.start');

  let playerTurn;

  function onStart(event) {
    // console.log(choiceButton.choice);
    if(choiceButton.getChoice() == null) {
      alert("please select either X or O");
    }
    else
    {
      if(choiceButton.getChoice() == 'x') {
        player = Player('dc', true);
        playerTurn = true;
        startGame();
      }
      else {
        player = Player('dc', false);
        playerTurn = false;
        startGame();
      }
    }
  }

  function addStartFunction() {
    startBtn.addEventListener('click', onStart);
  }

  function startGame() {
    if(playerTurn) {
      player.playTurn();
    }
    else {
      turns = 0;
      setTimeout(() => {
        // computer selects which block to play
        let computerBlock = computerPlayer.playTurn();
        console.log("computerBlock is " + computerBlock);
    
        // render the computer's turn here
        displayController.renderTurn(computerBlock, computerPlayer.getComputerChoice());
      }, 300);

      player.playTurn();


    }
  }

  return (
    {
      addStartFunction,
      // startGame
    }
  );

})();


// adds event listener to startButton
Game.addStartFunction();
// Game.startGame();










//! ---------- TESTING ------------ 

// let testarray = [
//                 'x', '', '',
//                 '', 'o', '',
//                 '', '', 'x'
//               ]

// for(let i = 0; i < 9; i++) {

//   gameboard.blockObjects[i].textContent = testarray[i];
//   console.log(i + " done")
// }

// alert(gameboard.checkWin());















let modalController = (() => {
  let playAgainModal = document.querySelector('.modal-container>*:nth-child(1)');

  
  function putWinnerStatus(winnerCode) {
    let span = document.querySelector('.playagain-modal > span');
    span.classList.add('dis-style');

    if(winnerCode == 0) {
      span.textContent = 'You Won !';
    }
    else if (winnerCode == 1) {
      span.textContent = 'Draw !';
      // draw
    }
    else {
      span.textContent = 'You Lose !';
    }

  }

  function displayPlayAgainModal(winnerCode) {

    /*
    note: winner code is as follows
    0 - player won
    1 - draw
    2 - computer won
    */

    putWinnerStatus(winnerCode);

    setTimeout(() => {
      console.log('exec')
      console.log(playAgainModal);
      playAgainModal.style.display = 'flex';
      playAgainModal.parentNode.style.display = 'block';      
    }, 1000);

  }

  // document.querySelector('.x').addEventListener('click', displayPlayAgainModal);
  
  function addPlayAgainFeature() {
    let playAgain = document.querySelector('.again');
    let notAnymore = document.querySelector('.enough');

    playAgain.addEventListener('click', playAgainFunction);
    notAnymore.addEventListener('click', () => {window.close()})
  }

  function playAgainFunction() {
    location.reload();
  }

  // addPlayAgainFeature();

  return (
    {
      addPlayAgainFeature,
      displayPlayAgainModal
    }
  );

})();

modalController.addPlayAgainFeature();



let resetButton = (() => {
  let resetBtn = document.querySelector('button.reset');
  function reloadPage() {
    location.reload();
  }

  resetBtn.addEventListener(('click'), reloadPage);


  return (
    {
      
    }
  );
  
})();