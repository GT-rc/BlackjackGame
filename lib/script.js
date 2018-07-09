/* Blackjack App
    - GT-rc */

// Card Variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let vals = [ 'Ace', 'King', 'Queen', 'Jack', 
            'Ten', 'Nine', 'Eight', 'Seven', 
            'Six', 'Five', 'Four', 'Three', 'Two'];

// DOM Variables
let textArea = document.getElementById('text-area');
let newGame = document.getElementById('new-game');
let hitButton = document.getElementById('hit');
let stayButton = document.getElementById('stay');

// Game Variables
let gameStarted = false,
    gameOver = false, 
    playerWon = false, 
    dealerCards = [], 
    playerCards = [], 
    dealerScore = 0,
    playerScore = 0, 
    deck = [];

// Starting Styling
hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

// Set up a New Game
newGame.addEventListener("click", function() {
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck(suits, vals);
    shuffleDeck(deck);
    dealerCards = [ getNextCard(deck), getNextCard(deck) ];
    playerCards = [ getNextCard(deck), getNextCard(deck) ];

    newGame.style.display = "none";
    hitButton.style.display = "inline";
    stayButton.style.display = "inline";
    showStatus();
});

// Play
hitButton.addEventListener("click", function() {
    playerCards.push(getNextCard(deck));
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener("click", function() {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});

function createDeck(lsuits, lvals) {
    let ldeck = [];
    for (let lsuitIdx = 0; lsuitIdx < lsuits.length; lsuitIdx++) {
        for (lvalIdx = 0; lvalIdx < lvals.length; lvalIdx++) {
            let tempCard = {
                suit:  lsuits[lsuitIdx],
                val: lvals[lvalIdx]
            };
            ldeck.push(tempCard);
        }
    }
    return ldeck;
}

function showStatus() {
    if (!gameStarted) {
        textArea.innerText = "Welcome to Blackjack";
        return;
    }

    let dealerCardString = '';
    for (let i = 0; i< dealerCards.length;i++) {
        dealerCardString += getCardString(dealerCards[i]) + '\n';
    }

    let playerCardString = '';
    for (let i=0;i<playerCards.length;i++) {
        playerCardString += getCardString(playerCards[i]) + '\n';
    }

    updateScore();

    textArea.innerText = 
        'Dealer has: \n' + 
        dealerCardString + 
        '(score: ' + dealerScore + ')\n\n' +

        'Player has: \n' + 
        playerCardString + 
        '(score: ' + playerScore + ')\n\n';

    if (gameOver) {
        if (playerWon) {
            textArea.innerText += "YOU WIN!!";
        }
        else {
            textArea.innerText += "Dealer Wins."
        }
        newGame.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}

function getNextCard(ldeck) {
    return ldeck.shift();
}

function getCardString(aCard) {
    return "the " + aCard.val + " of " + aCard.suit;
}

function shuffleDeck(aDeck) {
    for (let i = 0; i < aDeck.length; i++) {
        let swapIdx = Math.trunc(Math.random() * aDeck.length);
        let tmp = aDeck[swapIdx];
        aDeck[swapIdx] = aDeck[i];
        aDeck[i] = tmp;
    }
}

function updateScore() {
    dealerScore += getScore(dealerCards);
    playerScore += getScore(playerCards);
}

function getScore(cardArray) {
    let lscore = 0;
    let hasAce = false;
    for (let i=0; i<cardArray.length;i++) {
        let card1 = cardArray[i];
        lscore += getCardNumericalValue(card1);
        if (card1.val === "Ace") {
            hasAce = true;
        }
        if (hasAce && lscore + 11 <= 21) {
            return lscore + 11;
        }
    }
    return lscore;
}

function getCardNumericalValue(theCard) {
    switch (theCard.val) {
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}

function checkForEndOfGame() {
    updateScore();

    if (gameOver) {
        // let dealer take cards
        while (dealerScore < playerScore 
                && playerScore < 21 
                && dealerScore < 21) {
            dealerCards.push(getNextCard(deck));
            updateScore();
        }
    }

    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    }
    else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    }
    else if (gameOver) {
        if (playerScore > dealerScore) {
            playerWon = true;
            gameOver = true;
        }
        else {
            playerWon = false;
            gameOver = true;
        }
    }
}