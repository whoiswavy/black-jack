var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; // (A, 2) -- (A, 2, K) -> (11 + 2) -- (1 + 2 + 10)

var hidden;
var deck;

var canHit = true; // allows the player (you) to draw while total yourSum <= 21

window.onload = function () {
    clearDeck()
    buildDeck();
    shuffleDeck();
    startGame();
}

function clearDeck() {
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;

    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./cards/BACK.png" />';
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("your-sum").innerHTML = "";
    document.getElementById("dealer-sum").innerHTML = "";
    document.getElementById("results").innerHTML = "";
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "Q", "J"];
    let types = ["C", "D", "S", "H"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); // A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // math.random() will give a number 0-1 which we will multiply by the deck length (52) which will give a number (1-52)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden)
    document.getElementById("replay").disabled = true;
    // console.log(hidden);
    // console.log(dealerSum);

    while (dealerSum < 17) {
        let cardImg = document.createElement('img'); // create <img>
        let card = deck.pop(); // get card from deck
        cardImg.src = "./cards/" + card + ".png"; // <img src="./cards/4-C.png"/>
        dealerSum += getValue(card); // increment the dealerSum
        dealerAceCount += checkAce(card); // check ace count
        document.getElementById("dealer-cards").append(cardImg); // add the card to the dealer's cards
    }
    // console.log(dealerSum)

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement('img'); // create <img>
        let card = deck.pop(); // get card from deck
        cardImg.src = "./cards/" + card + ".png"; // <img src="./cards/4-C.png"/>
        yourSum += getValue(card); // increment the yourSum
        yourAceCount += checkAce(card); // check ace count
        document.getElementById("your-cards").append(cardImg); // add the card to the player's cards
    }

    // console.log(yourSum);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
}

function hit() {
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement('img'); // create <img>
    let card = deck.pop(); // get card from deck
    cardImg.src = "./cards/" + card + ".png"; // <img src="./cards/4-C.png"/>
    yourSum += getValue(card); // increment the yourSum
    yourAceCount += checkAce(card); // check ace count
    document.getElementById("your-cards").append(cardImg); // add the card to the player's cards

    if (reduceAce(yourSum, yourAceCount) > 21) { //
        canHit = false;
    }
}

function stand() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lost!";
    }
    else if (dealerSum > 21) {
        message = "You Won!🥳";
    }
    // both you and the dealer have sums <= 21
    else if (dealerSum == yourSum) {
        message = "Tie";
    }
    else if (yourSum > dealerSum) {
        message = "You Won!🥳";

    }
    else if (yourSum < dealerSum) {
        message = "You Lost!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

    document.getElementById("replay").disabled = false;
    document.getElementById("replay").addEventListener("click", () => {
        clearDeck();
        buildDeck();
        shuffleDeck();
        startGame();
    });
}

function getValue(card) {
    let data = card.split('-'); // "4-C" (value-type) -> ["4", "C"]
    let value = data[0]

    if (isNaN(value)) { // A K Q J
        if (value == "A") {
            return 11;
        }
        return 10;
    }

    return parseInt(value)
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    if (playerSum > 21 && playerAceCount < 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}