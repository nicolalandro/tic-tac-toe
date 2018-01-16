/*===============================================
The SVG chalk filter was found in a pen by Johan Gorter.
The AI was heavily 'inspired' by Alex Wilkerson(free code camp).


==================================================*/



//Draw the grid lines----------------------------------
$('#v1').delay(500).animate({'stroke-dashoffset': 0},500);
$('#v2').delay(1000).animate({'stroke-dashoffset': 0},500);
$('#h1').delay(1500).animate({'stroke-dashoffset': 0},500);
$('#h2').delay(2000).animate({'stroke-dashoffset': 0},500);

function drawCross(tile) {
  tile.find('#d1').animate({'stroke-dashoffset': 0},300);
  tile.find('#d2').delay(300).animate({'stroke-dashoffset': 0},300);
}

function drawNaught(tile) {
  tile.find('#c').animate({'stroke-dashoffset': 0}, 500);
}

//Add 'X' and 'O' to every tile so they can be animated--------
function addSymbols() {
  var first = $('#cross1').html();
  var second = $('#cross2').html();
  var circ = $('#circleDiv').html();
  $('.tile').html(first + second + circ);
}

var userTurn, userSign, compSign, turns, round = 0,
      board = [
        "E", "E", "E",
        "E", "E", "E",
        "E", "E", "E"
      ];

  function resetBoard() {
    board = ["E", "E", "E","E", "E", "E","E", "E", "E"];
    $('.tile').removeClass('full');
    turns = 0;
    addSymbols();
  }

function setMessage(str) {
    $('.message').text(str);
  }

function startGame() {
    resetBoard();

    //Should user be able to choose symbol every game????
    if(round < 1) {
      //prevent game starting before grid lines 'drawn'
      setTimeout(function() {
        
        $('.ex').click(function() {
          userSign = "X";
          compSign = "O";
          setMessage('Click a tile to start');
          userTurn = true;
        });

        $('.oh').click(function() {
          userSign = "O";
          compSign = "X";
          setMessage('Computer will begin');
          userTurn = false;
          setTimeout(compMove, 1000);
        });
      },3000);
    }

    round += 1;

    if(round > 0 && userSign == "X") {
      setMessage('Your move');
      userTurn = true;
    } else if(round > 0 && userSign == "O") {
      setMessage('Computers move');
      userTurn = false;
      compMove();
    }
  }

function playerMove() {
    $('.tile').click(function() {

      var t = $(this);
      var tileInd = t.attr('id').split("");

      if(t.hasClass('full')) {
        setMessage("Choose an empty tile");
      } else if(userTurn){
        
        if(userSign == "X") {
          drawCross(t);
          userTurn = false;
        } else {
          drawNaught(t);
          userTurn = false;
        }

        board.splice(tileInd[1], 1, userSign);
        turns += 1;
        t.addClass('full');

        if(win(board) === userSign) {

          setMessage('YOU WIN!');
          setTimeout(startGame, 2000);
        } else if(turns === 9) {

          setMessage('No winners this time');
          setTimeout(startGame, 2000);

        } else {
          setMessage('Computers move');
          setTimeout(compMove,1000);
        }
      }
    });
  }

function compMove() {
    minimax();

    $('.tile').each(function(i) {
      var t = $(this);

      if(board[i] === compSign) {
        if(compSign == "X") {
          drawCross(t);
        } else {
          drawNaught(t);
        }
        t.addClass('full');
      }
    });

    turns += 1;
    userTurn = true;
    //console.log(board + " " + turns);

    if(win(board) === compSign) {

      setMessage('You Lose :(');
      setTimeout(startGame, 2000);
    } else if(turns === 9) {

      setMessage('This game is a tie');
      setTimeout(startGame, 2000);
    } else {
      setMessage('Your move');
    }
  }

function minimax() {
    var move;
    recur(board, userSign, 0);
    board[move] = compSign;

    function recur(tempBoard, tempPlayer, currentDepth) {
      if(win(tempBoard) === compSign) {
        return 10 - currentDepth;
      } else if(win(tempBoard) === userSign) {
        return currentDepth - 10
      }

      var moves = [],
          scores = [];

      //change player
      if(tempPlayer === "X") {
        tempPlayer = "O";
      } else {
        tempPlayer = "X";
      }

      // find all empty board states and fill
      // them with current tempPlayer, then
      // use the results to make array of scores
      for(var i = 0; i < tempBoard.length; i++) {
        var newBoard = tempBoard.slice();
        if(newBoard[i] === "E") {
          newBoard[i] = tempPlayer;
          moves.push(i);
          scores.push(recur(newBoard, tempPlayer, currentDepth + 1));
        }
      }

      //the comp's move
      if(currentDepth === 0) {
        move = moves[scores.indexOf(Math.max.apply(null, scores))];
      } else {
        //reached a draw state
        if(moves.length === 0) {
          return 0;
        }

        if(tempPlayer === compSign) {
          return Math.max.apply(Math, scores);
        } else {
          return Math.min.apply(Math, scores);
        }
      }
    }
  }

function win(testBoard) {
    var winStates = [[0,1,2], [3,4,5], [6,7,8],
                     [0,3,6], [1,4,7], [2,5,8],
                     [0,4,8], [2,4,6]];
    var winner;

    for (var i = 0; i < winStates.length; i++) {
      winner = check(testBoard, winStates[i][0], winStates[i][1], winStates[i][2]);
      if (winner !== "E"){
        return winner;
      }
    }
   return winner;
  }

  function check(testBoard, place1, place2, place3) {
    if (testBoard[place1] !== "E" && testBoard[place1] === testBoard[place2] && testBoard[place1] === testBoard[place3]){
      return testBoard[place1];
    } else {
      return "E";
    }
  }

startGame();
  playerMove();