/* 
File: scrabble.js
GUI Assignment: Implementing one line scrabble
Aaron Pratt, Created on December 10, 2023
Email: aaron_pratt@student.uml.edu
Description: Contains scrabble game logic, initializes game, and enables users to snap tiles to the game board and tile holder
*/

/*  File:  /~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
 *  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Copyright (c) 2015 by Jesse M. Heines.  All rights reserved.  May be freely 
 *    copied or excerpted for educational purposes with credit to the author.
 *  updated by JMH on November 21, 2015 at 10:27 AM
 *  updated by JMH on November 25, 2015 at 10:58 AM to add the blank tile
 *  updated by JMH on November 27, 2015 at 10:22 AM to add original-distribution
 */
var ScrabbleTiles = [] ;
ScrabbleTiles["A"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  };
ScrabbleTiles["B"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["C"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["D"] = { "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4  };
ScrabbleTiles["E"] = { "value" : 1,  "original-distribution" : 12, "number-remaining" : 12 };
ScrabbleTiles["F"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["G"] = { "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3  };
ScrabbleTiles["H"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["I"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  };
ScrabbleTiles["J"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["K"] = { "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["L"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  };
ScrabbleTiles["M"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["N"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  };
ScrabbleTiles["O"] = { "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8  };
ScrabbleTiles["P"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["Q"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["R"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  };
ScrabbleTiles["S"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  };
ScrabbleTiles["T"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  };
ScrabbleTiles["U"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  };
ScrabbleTiles["V"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["W"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["X"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["Y"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["Z"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["_"] = { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2  };

var totalScore = 0;
var gameStarted = false;

function shuffle(array) {
    // Filter out letters with 0 remaining tiles
    var validLetters = array.filter(function (letter) {
        return ScrabbleTiles[letter]["number-remaining"] > 0;
    });

    for (let i = validLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [validLetters[i], validLetters[j]] = [validLetters[j], validLetters[i]];
    }

    return validLetters;
}

// Function to initialize the tile holder with random tiles
function initializeTileHolder() {
    var tileHolder = $("#tile_holder");
    tileHolder.empty();

    // Create an array of letters based on the ScrabbleTiles distribution
    var letters = [];
    for (var letter in ScrabbleTiles) {
        for (var i = 0; i < ScrabbleTiles[letter]["original-distribution"]; i++) {
            letters.push(letter);
        }
    }

    // Shuffle the array to get a random order, considering only letters with remaining tiles
    var selectedLetters = shuffle(letters).slice(0, Math.min(7, letters.length));

    // Append the tiles to the tile holder
    for (var i = 0; i < selectedLetters.length; i++) {
        var letter = selectedLetters[i];

        // Display the number of remaining tiles for this letter
        console.log("Remaining " + letter + " tiles: " + ScrabbleTiles[letter]["number-remaining"]);

        // Create the tile image
        var tileImageSrc = "images/scrabble_tiles/Scrabble_Tile_" + letter + ".jpg";
        var tileImage = $("<img>").attr("src", tileImageSrc).attr("data-letter", letter).addClass("draggable-tile");

        // Append the tile to the tile holder
        tileHolder.append(tileImage);
    }

    // Make the tiles draggable
    $(".draggable-tile").draggable({
        revert: "invalid",
        snap: ".board-slot, #tile_holder",  
        snapMode: "inner",                  
        snapTolerance: 10,                
    });

    displayRemainingTiles();
}

// Function to remove tiles from the board
function removeTilesFromBoard() {
    // Iterate through each board slot
    $(".board-slot").each(function () {
        var boardPiece = $(this);
        var droppedTile = boardPiece.data("droppedTile");

        // Check if a tile is dropped on the board piece
        if (droppedTile) {
    
            var droppedLetter = droppedTile.data("letter");
            ScrabbleTiles[droppedLetter]["number-remaining"]--;

            // Remove the dropped tile from the board
            boardPiece.empty().removeData("droppedTile");
        }
    });

    displayRemainingTiles();
}

function calculateTotalScore() {
    var tilesOnBoard = false;   
    var currentWordScore = 0;     
    var wordMultiplier = 1;        
    var consecutiveTiles = true; 

    // Create an array to store the letters used in the current word
    var usedLetters = [];

    // Iterate through each board slot to calculate the total score
    $(".board-slot").each(function (index) {
        var boardPiece = $(this);
        var droppedTile = boardPiece.data("droppedTile");

        if (droppedTile) {
            var tileValue = droppedTile.data("value");

            // Double the value if the letter is on the 7th board piece
            if (index === 6) {
                tileValue *= 2;
            }

            currentWordScore += tileValue;
            tilesOnBoard = true; 

            // Check for consecutive tiles
            if (index !== 0 && index !== lastTileIndex + 1) {
                consecutiveTiles = false;
            }

            // Get the letter of the dropped tile and add it to the usedLetters array
            var letter = droppedTile.data("letter");
            usedLetters.push(letter);

            lastTileIndex = index; 
        }
    });

    // Check if there are tiles on the board and if there are consecutive tiles
    if (tilesOnBoard && consecutiveTiles) {
        // Double the word score if the letter is on the 3rd board piece
        if ($(".board-slot").eq(2).data("droppedTile")) {
            wordMultiplier = 2;
        }

        // Apply the word score multiplier only to the current word score
        currentWordScore *= wordMultiplier;

        // Add the current word score to the total score
        totalScore += currentWordScore;

        // Display the total score
        $("#total_score").text("Total Score: " + totalScore);
        console.log("Total score: " + totalScore);

        // Remove tiles from the board and update remaining tiles
        removeTilesFromBoard(usedLetters);
    }

    // Do not re-shuffle tiles if there are spaces between them
    if (tilesOnBoard && consecutiveTiles) {
        initializeTileHolder();
    }
}

function removeTilesFromBoard(usedLetters) {
    // Iterate through each board slot
    $(".board-slot").each(function () {
        var boardPiece = $(this);
        var droppedTile = boardPiece.data("droppedTile");

        // Check if a tile is dropped on the board piece
        if (droppedTile) {
            // Get the letter of the dropped tile
            var droppedLetter = droppedTile.data("letter");

            // Decrement the number-remaining property for the dropped letter
            if (usedLetters.includes(droppedLetter) && ScrabbleTiles[droppedLetter]["number-remaining"] > 0) {
                ScrabbleTiles[droppedLetter]["number-remaining"]--;

                // Display the updated number of remaining tiles for this letter
                console.log("Remaining " + droppedLetter + " tiles: " + ScrabbleTiles[droppedLetter]["number-remaining"]);
            }

            // Remove the dropped tile from the board
            boardPiece.empty().removeData("droppedTile");
        }
    });

    displayRemainingTiles();

    // Initialize the tile holder only if there are tiles on the board
    if (usedLetters.length > 0) {
        initializeTileHolder(usedLetters.length);
    }
}

function displayRemainingTiles() {
    var remainingTilesCount = 0;

    for (var letter in ScrabbleTiles) {
        remainingTilesCount += ScrabbleTiles[letter]["number-remaining"];
    }

    // Subtract the number of tiles on the tile holder
    remainingTilesCount -= $("#tile_holder img").length;

    console.log("Remaining tiles excluding the tile holder: " + remainingTilesCount);

    $("#remaining_tiles").text("Remaining Tiles: " + remainingTilesCount);
}

$(document).ready(function () {
    // Initialize the tile holder with random tiles
    initializeTileHolder();
    displayRemainingTiles();

    // Make each board piece droppable
    $(".board-slot").droppable({
        accept: ".draggable-tile",
        drop: function (event, ui) {
            handleTileDrop($(this), ui.draggable);
        },
    });

    // Make the tile holder droppable
    $("#tile_holder").droppable({
        accept: ".draggable-tile",
        drop: function (event, ui) {
            handleTileHolderDrop($(this), ui.draggable);
        },
    });

    // Restart Button Logic
    $("#restartButton").on("click", function () {
        restartGame();
    });

    $("#calculateScoreButton").on("click", function () {
        calculateTotalScore();
    });

    // Function to handle the drop event on a board piece
    function handleTileDrop(target, draggableTile) {
        // Identify the letter of the dropped tile using the data attribute
        var droppedLetter = draggableTile.data("letter");
        console.log("Dropped Letter:", droppedLetter);

        // Get information about the dropped tile from ScrabbleTiles
        var tileInfo = ScrabbleTiles[droppedLetter];
        console.log("Tile Info:", tileInfo);

        // Set the data attributes for the dropped tile
        draggableTile.data("value", tileInfo["value"]);
        draggableTile.data("letter", droppedLetter);

        // Log the data attributes of the dropped tile for debugging
        console.log("Dropped Tile Data:", draggableTile.data());

        // Snap the tile to the center of the board piece
        draggableTile.draggable("option", "revert", false);
        draggableTile.position({
            of: target,
            my: "center",
            at: "center",
        });

        target.data("droppedTile", draggableTile);
    }

    // Function to handle the drop event on the tile holder
    function handleTileHolderDrop(target, draggableTile) {
        // Perform actions when a tile is dropped on the tile holder
        console.log("Tile dropped on tile holder");

        // Snap the tile to the center of the tile holder
        draggableTile.draggable("option", "revert", false);
        draggableTile.position({
            of: target,
            my: "center",
            at: "center",
        });
    }

    // Function to restart the game
    function restartGame() {
        
        // Reset game variables
        totalScore = 0;
        remainingTilesCount = 93;
        
        // Reset ScrabbleTiles values to their original distribution
        for (var letter in ScrabbleTiles) {
            ScrabbleTiles[letter]["number-remaining"] = ScrabbleTiles[letter]["original-distribution"];
            ScrabbleTiles[letter]["number-original"] = ScrabbleTiles[letter]["original-distribution"];
        }

        // Clear existing tiles on the board and tile holder
        $("#tile_holder").empty();
        $(".board-slot").empty();

        initializeTileHolder();

        displayRemainingTiles();

        $("#total_score").text("Total Score: " + totalScore);
        $("#remaining_tiles").text("Remaining Tiles: " + remainingTilesCount);
    }

});
