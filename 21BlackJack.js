//This is a jQuery method that selects the entire HTML docuemtn and waits for it to be fully loaded 
$(document).ready(function() {
    //Arrays with the decks to keep track of the cards. 
    let dealerHand = [];
    let playerHand = [];
    // Game Variables, some to store the sums, to keep the game running and implement new game logic and Ace logic, etc.
    let gameOn = true; 
    let score = 0;
    let playerSum = 0;
    let dealerSum = 0;
    let playerAceCount = 0;
    let playerAceDeducted = 0;
    let dealerAceCount = 0;
    let dealerAceDeducted = 0;
    let hiddenCard;
    //Game status: "new", "ongoing", "playerBusted", "dealerBusted", "playerWon", "dealerWon"
    let gameStatus = "new"; 

    // The first function that must be called is to create a new deck
    function createDeck() {
        let deck = [];
        //We are going to create to arrays to populate the deck
        let values = ['2','3','4','5','6','7','8','9','10','Jack','Queen','King','Ace'];
        let cardType = ['Clubs','Diamonds','Hearts','Spades'];
        //Using two for loops to append the cards to the deck. 
        for(let i = 0; i < values.length; i++){
            for(let j = 0; j < cardType.length; j++){
                let card = values[i] + '-' + cardType[j] + '.png'
                deck.push(card)
            }
        }
        console.log('New Deck has been created!');
        console.log(deck);
        console.log('');
        return deck
    }

    // Shufle the deck
    function shuffleDeck(deck) {
        for(let i = 0; i < deck.length; i++){
            //generate a random number between 0-51
            let n = Math.floor(Math.random()*deck.length);
            //store the card that will be changed
            let store = deck[i];
            //Change the card
            deck[i] = deck[n];
            //Switch the stored card with the one used to replace it. 
            deck[n] = store;
        }
        console.log('The Deck has been Shuffled!');
        console.log(deck);
    }

    // Function to start the game 
    function newGame() {
        deck = createDeck();
        shuffleDeck(deck);
        //Logic for the dealer
        //We will use .pop() to extract the last card from the deck.
        //Get the hidden card 
        hiddenCard = deck.pop();
        dealerSum +=  cardValue(hiddenCard);
        dealerAceCount += checkAce(hiddenCard);
        dealerHand.push(hiddenCard);
        //Add the other card.
        let secondCard = deck.pop();
        dealerSum +=  cardValue(secondCard);
        dealerAceCount += checkAce(secondCard);
        dealerHand.push(secondCard);

        //Create the element for the image of the new card, using jQuery 
        //from "var newImage" to ".append(newImage);" were mostly taken from chatGPT.
        var newImage = $('<img>', {
            id: "dealer-card",
            src: 'cards/' + secondCard  
        });
        // Insert the new image inside the #dealer-cards div
        $('#dealer-cards').append(newImage);

        console.log('Hidden: ', hiddenCard);
        console.log('Dealer sum: ', dealerSum);
        console.log('Dealer Ace Count: ', dealerAceCount);
        console.log('Dealer Deck: ', dealerHand);
        ////////////////////////////////////////////////////////////////////
        //Logic for the Player 
        for (let n = 0; n < 2; n++){
            let playerCard = deck.pop();
            playerSum +=  cardValue(playerCard);
            playerAceCount += checkAce(playerCard);
            playerHand.push(playerCard);
            //Create the element for the image of the new card, using jQuery 
            //from "var newImage" to ".append(newImage);" were mostly taken from chatGPT.
            var newImage = $('<img>', {
                src: 'cards/' + playerCard  
            });
            // Insert the new image inside the id="player-cards" div
            $('#player-cards').append(newImage);

            //Check for a black jack
            if (playerSum === 21) {
                //call for the end of the game 
                $('#hidden-card').attr('src', 'cards/' + hiddenCard);
                endGame();
            }
        }
        console.log('player sum: ', playerSum);
        console.log('Player Ace Count: ', playerAceCount);
        console.log('Player Deck: ', playerHand);
       
    }

    // Function to calculate the value of the card.
    function cardValue(card) {
        let value;
        let str_value;
        cardArray = card.split('-')
        //Create an option for all the cards worth 10
        //Then for the ace and a logic to convert the string to numbers. 
        const options10 = ['10', 'Jack', 'Queen', 'King'];
        if (options10.includes(cardArray[0])) {
            value = 10;
        } else if (cardArray[0] === 'Ace') {
            value = 11;
        } else {
            str_value = cardArray[0];
            value = Number(str_value);
        }
        return value
    }

    // Function to check if it is an Ace
    function checkAce(card) {
        if (card[0] === 'A') {
            return 1;
        } else {
            return 0;
        }
    }

    //Add the card when the hit button is clicked 
    function hit() {
        //Condition to let hit
        if (playerSum < 21) {
            let playerCard = deck.pop();
            playerSum +=  cardValue(playerCard);
            playerAceCount += checkAce(playerCard);
            playerHand.push(playerCard);
            //Create the element for the image of the new card, using jQuery 
            //from "var newImage" to ".append(newImage);" were mostly taken from chatGPT.
            var newImage = $('<img>', {
                id: "player-card",
                src: 'cards/' + playerCard  
            });
            // Insert the new image inside the id="player-cards" div
            $('#player-cards').append(newImage);

            //check if  the sum is more than 21 or if it is 21 to end the game. 
            if (playerSum == 21) {
                endDealer();
                endGame();
            } else if (playerSum > 21) {
                //if it is more than 21 check for Ace and make sure it has already not been deducted 
                if (playerAceCount > playerAceDeducted) {
                    //subtract 10
                    playerSum -= 10;
                    //add a value to the deducted aces so that it does not infinetly deducted 10 every time it pases 21 if it has an ace
                    playerAceDeducted += 1;
                } else {
                    //the player busted end the game 
                    // Replace the hidden image with the actual card
                    $('#hidden-card').attr('src', 'cards/' + hiddenCard);
                    endGame();
                }
            }
            console.log('player sum: ', playerSum);
            console.log('Player Ace Count: ', playerAceCount);
            console.log('Player Deck: ', playerHand);
        } //if the player starts with double Aces
        else {
            //player busted becuase he had double Aces 
            if (playerAceCount > playerAceDeducted) {
                //subtract 10
                playerSum -= 10;
                //add a value to the deducted aces so that it does not infinetly deducted 10 every time it pases 21 if it has an ace
                playerAceDeducted += 1;

                //If it came this far it is because the player requested a card 
                //give the player the card 
                let playerCard = deck.pop();
                playerSum +=  cardValue(playerCard);
                playerAceCount += checkAce(playerCard);
                playerHand.push(playerCard);
                //Create the element for the image of the new card, using jQuery 
                //from "var newImage" to ".append(newImage);" were mostly taken from chatGPT.
                var newImage = $('<img>', {
                    id: "player-card",
                    src: 'cards/' + playerCard  
                });
                // Insert the new image inside the id="player-cards" div
                $('#player-cards').append(newImage);
                //Since he had double haces now he has 12 so he may bust again.
                //we need to check that again to see if another 10 may need to be subtracted 
                if (playerSum > 21) {
                    //subtract 10
                    playerSum -= 10;
                    //add a value to the deducted aces so that it does not infinetly deducted 10 every time it pases 21 if it has an ace
                    playerAceDeducted += 1;
                    //No need for new card 
                }
            }
        }
    }

    //stay Function 
    function stay() {
        endDealer();
        endGame();
    }

    //Function to end the dealer with at least 17 in cards 
    function endDealer() {
        //First we need to uncover the hidden card.
        // Replace the hidden image with the actual card
        $('#hidden-card').attr('src', 'cards/' + hiddenCard);

        while (dealerSum < 17) {
            //Add the other card.
            let dealerCard = deck.pop();
            dealerSum +=  cardValue(dealerCard);
            dealerAceCount += checkAce(dealerCard);
            dealerHand.push(dealerCard);

            //Create the element for the image of the new card, using jQuery 
            //from "var newImage" to ".append(newImage);" were mostly taken from chatGPT.
            var newImage = $('<img>', {
                id: "dealer-card",
                src: 'cards/' + dealerCard  
            });
            // Insert the new image inside the #dealer-cards div
            $('#dealer-cards').append(newImage);

            if (dealerSum > 21 && dealerAceCount > dealerAceDeducted) {
                //logic for subtracting 10.
                //subtract 10
                dealerSum -= 10;
                //add a value to the deducted aces so that it does not infinetly deducted 10 every time it pases 21 if it has an ace
                dealerAceDeducted += 1;
            }
        }
        //If condition for when the dealer has two Aces 
        if (dealerSum > 21 && dealerAceCount > dealerAceDeducted) {
            //logic for subtracting 10.
            //subtract 10
            dealerSum -= 10;
            //add a value to the deducted aces so that it does not infinetly deducted 10 every time it pases 21 if it has an ace
            dealerAceDeducted += 1;
        }
        
        console.log('Dealer sum: ', dealerSum);
        console.log('Dealer Ace Count: ', dealerAceCount);
        console.log('Dealer Deck: ', dealerHand);
    }

    //function to end the game 
    function endGame() {
        gameOn = false;
        $("#dealer-sum").text(dealerSum);
        $("#player-sum").text(playerSum);
        //If player bust 
        if (playerSum > 21) {
            score -= 1;
            $("#Winner").text("Winner: Dealer");
            console.log('Player lost');
        //if the player has more than the dealer or the dealer bust.
        } else if (playerSum > dealerSum || dealerSum > 21) {
            score += 1;
            //Check for a black jack 
            if (playerSum === 21 && playerHand.length === 2) {
                $("#Winner").text("Player Blackjack!!!");
                console.log('Player Blackjack!!!');
            } else {
                $("#Winner").text("You Won!!!");
                console.log('Player Won!!!');
            }
        //if the dealer has more than the player and didn't bust.
        } else if (playerSum < dealerSum && dealerSum <= 21) {
            score -= 1;
            //Check for a black jack 
            if (dealerSum === 21 && dealerHand.length === 2) {
                $("#Winner").text("Dealer Blackjack");
                console.log('Dealer Blackjack');
            } else {
                $("#Winner").text("Winner: Dealer");
                console.log('Winner: Dealer');
            }
        //If they got the same 
        } else if (playerSum === dealerSum) {
            //Check if one has black jack and the other dosen't
            if (playerSum === 21 && playerHand.length === 2 && dealerHand.length > 2) {
                score += 1;
                $("#Winner").text("Player Blackjack!!!");
                console.log('Player Blackjack!!!');
            } else if (dealerSum === 21 && dealerHand.length === 2 && playerHand.length > 2) {
                score -= 1;
                $("#Winner").text("Dealer Blackjack!!!");
                console.log('Dealer Blackjack!!!');
            } else {
                $("#Winner").text("It is a tie!");
                console.log('It is a tie!');
            }
        }
        //update the score 
        $('#playerScore').text(score);
        //Call fucntion to get options to reset the game 
        resetGame();
    }

    //function to reset the game 
    function resetGame() {
        //give an option to continue to play or to end the game and reload the page.
        // option to continue playing 
        var again = $('<button>', {
            text: 'Play Again',
            id: 'btnAgain',
            css: {
                width: '150px',
                height: '50px',
                fontSize: '20px',
                margin: '2px',
                borderRadius: '10px'
            }
        }).click(function() {
            //Reset all the variables and clean the log
            dealerHand = [];
            playerHand = [];
            gameOn = true; 
            playerSum = 0;
            dealerSum = 0;
            playerAceCount = 0;
            playerAceDeducted = 0;
            dealerAceCount = 0;
            dealerAceDeducted = 0;
            //Delete the images and text added in the previus game.
            $("img").remove();
            //reset the Text 
            $("#dealer-sum").empty();
            $("#player-sum").empty();
            $("#Winner").empty();
            //Reset the back card 
            var backCard = $('<img>', {
                id: "hidden-card",
                src: 'cards/Back.png' 
            });
            // Insert the back img 
            $('#dealer-cards').append(backCard);
            //clear the log and call for a new game 
            console.clear();
            //call for a new game
            newGame();
            // Make button disappear on the new game 
            $('#btnAgain, #btnEnd').hide();  
        });

        // Create button 2
        var end = $('<button>', {
            text: 'End Game',
            id: 'btnEnd',
            css: {
                width: '150px',
                height: '50px',
                fontSize: '20px',
                margin: '2px',
                borderRadius: '10px'
            }
        }).click(function() {
            
            // Reload the page
            location.reload();
            console.log("End button clicked");
            // Make button disappear
            $('#btnAgain, #btnEnd').hide();
            
        });

        // Append buttons to the container
        $('#resetBTN').append(again, end);
    }

    //Fucntion to play the game 
    function playGame() {

        //set up the game 
        if (gameStatus === 'new') {
            newGame();
            gameStatus = 'onGoing';
        }
        //logic for the on going game 
        $("#hit").click(function() {
            if (gameOn === true) {
                hit();
            }
        }); 
        $("#stay").click(function() {
            if (gameOn === true) {
                stay();
            }
        }); 
    }
    playGame();


    // // Function to calculate hand value, considering Ace logic
    // function calculateHandValue(hand) {
    //     // ... Implement hand value calculation
    // }

    // // Function to update the UI based on game state
    // function updateUI() {
    //     // ... Implement UI update logic
    // }


    // $("#standButton").click(function() {
    //     // ... Implement stand logic
    // });

});
