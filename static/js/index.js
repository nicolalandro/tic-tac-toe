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
        "0", "0", "0",
        "0", "0", "0",
        "0", "0", "0"
      ];

  function resetBoard() {
    board = ["0", "0", "0","0", "0", "0","0", "0", "0"];
    $('.tile').removeClass('full');
    turns = 0;
    addSymbols();
  }

function setMessage(str) {
    $('.message').text(str);
  }

function startGame() {
    resetBoard();

     userSign = "1";
     compSign = "2";
     setMessage('Click a tile to start');
     userTurn = true;

    round += 1;

    if(round > 0 && userSign == "1") {
      setMessage('Your move');
      userTurn = true;
    } else if(round > 0 && userSign == "2") {
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
        
        if(userSign == "1") {
          drawCross(t);
          userTurn = false;
        } else {
          drawNaught(t);
          userTurn = false;
        }

        board.splice(tileInd[1], 1, userSign);
        turns += 1;
        t.addClass('full');

//        console.log("train data: [" + board + "," + turns + "]");

        if(win(board) === userSign) {
          setMessage('YOU WIN!');
          setTimeout(startGame, 2000);
        } else if(turns === 9) {

          setMessage('No winners this time');
          setTimeout(startGame, 2000);

        } else {
          setMessage('Computers move');
//          setTimeout(compMoveWithMinMax,1000);
          compMove();
        }
      }
    });
  }

function compMove() {
    $.ajax({
                        url: "/api/decision_tree_for_o",
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(board),
                        success: function(res) {
                            console.log(res);
                            console.log(board[parseInt(res.results)]);

                            if(board[parseInt(res.results)] === "0"){
                                console.log("My AI");
                                var id = "#t" + res.results;
                                console.log(id);
                                var t = $(id);
                                drawNaught(t);
                                board[parseInt(res.results)] = "2"
                                t.addClass('full');

                                turns += 1;
                                userTurn = true;

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
                            else{
                                console.log("Other AI");
                                compMoveWithMinMax();
                            }

                        }
            });
}

function compMoveWithMinMax() {
    minimax();

    $('.tile').each(function(i) {
      var t = $(this);

      if(board[i] === compSign) {
        if(compSign == "1") {
          drawCross(t);
        } else {
          drawNaught(t);
        }
        t.addClass('full');
      }
    });

    turns += 1;
    userTurn = true;
//    console.log(board + " " + turns);
//    console.log("train target: [" + board + "]");

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
      if(tempPlayer === "1") {
        tempPlayer = "2";
      } else {
        tempPlayer = "1";
      }

      // find all empty board states and fill
      // them with current tempPlayer, then
      // use the results to make array of scores
      for(var i = 0; i < tempBoard.length; i++) {
        var newBoard = tempBoard.slice();
        if(newBoard[i] === "0") {
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
      if (winner !== "0"){
        return winner;
      }
    }
   return winner;
  }

  function check(testBoard, place1, place2, place3) {
    if (testBoard[place1] !== "0" && testBoard[place1] === testBoard[place2] && testBoard[place1] === testBoard[place3]){
      return testBoard[place1];
    } else {
      return "0";
    }
  }

startGame();
playerMove();