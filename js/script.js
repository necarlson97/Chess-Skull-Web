var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.start();
recognition.onresult = function(event) {
    var spoken = event.results[event.results.length-1][0].transcript.trim();
    input.value = spoken;
    trigger();
};

var input;
var board;
window.onload = function() {
    input = document.getElementById('input');
    board = ChessBoard('board', 'start');
}

function trigger() {
    var text = input.value;
    if(text == "stop" || text == "shut up") {
        responsiveVoice.cancel();
        speak("stopping");
    } else makeMove(text);
}

var game = new Chess();
var grunt;
var gruntArray = ["lets see...", "ahhhhh...", "let me think...", "this could work...", "hows this?", "how about...", "what if..."];
var aiWorker = new Worker('js/chessAI.js');
aiWorker.onmessage = function(e) {
    var aiMove = e.data;
    clearTimeout(grunt);
    game.move(aiMove, {sloppy: true});
    board.move(aiMove);
    speak(aiMove.replace("-", " to "));
    if(game.in_check()) speak("check");
    if(game.in_checkmate()) speak("checkmate");
    if(game.game_over()) gameOver();
}

function makeMove(s) {
    s = s.toLowerCase().replace(" to ", "-");
    var move = game.move(s, {sloppy: true});
    if(move != null) {
        aiWorker.postMessage(s);
        board.move(s);
        grunt = setTimeout(speak, 2000, gruntArray.random());
    } else {
        speak("Sorry");
    }
}

function gameOver() {
    speak("Good game, resetting board.");
    board = ChessBoard('board', 'start');
    game.reset();;
}

function speak(s) {
    console.log("SPREAKING: "+s);
    responsiveVoice.speak(s, "UK English Male", {rate: 1, pitch: .5});
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}




