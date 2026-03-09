(function () {
  "use strict";

  const ROWS = 6;
  const COLS = 6;
  const MAX_RETRIES = 3;
  const WORD_API = "https://random-word-api.vercel.app/api?words=1&length=6";

  // Fallback 6-letter words if API fails
  const FALLBACK_WORDS = [
    "BETTER", "LETTER", "MATTER", "RANDOM", "SAMPLE", "WINDOW", "GARDEN",
    "PERSON", "NUMBER", "CHANGE", "SILVER", "GOLDEN", "BRIDGE", "CIRCLE",
    "DOUBLE", "FAMILY", "GALAXY", "HARBOR", "ISLAND", "JUNGLE", "KETTLE",
    "MONKEY", "NATURE", "ORANGE", "PURPLE", "QUARTZ", "RABBIT", "SPRING",
    "TIGER", "VIOLET", "WINTER", "YELLOW", "ACTIVE", "BRIGHT", "CLEVER",
    "DREAMY", "FLOWER", "EAGLES", "GALAXY", "HARBOR", "ISLAND", "JUNGLE"
  ];

  const GameState = {
    targetWord: "",
    currentRow: 0,
    currentCol: 0,
    guesses: [],
    evaluations: [],
    maxGuesses: ROWS,
    wordLength: COLS,
    isGameOver: false,
    isWon: false
  };

  const Stats = {
    gamesPlayed: 0,
    wins: 0,
    winStreak: 0
  };

  const KEY_ROWS = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    "ZXCVBNM".split("")
  ];

  var boardEl, messageEl, playAgainEl, keyboardEl;
  var gamesPlayedEl, winsEl, winStreakEl;

  function getEl(id) {
    return document.getElementById(id);
  }

  function createBoard() {
    boardEl = getEl("gameBoard");
    boardEl.innerHTML = "";
    for (var r = 0; r < ROWS; r++) {
      var row = document.createElement("div");
      row.className = "row";
      row.setAttribute("data-row", r);
      for (var c = 0; c < COLS; c++) {
        var tile = document.createElement("div");
        tile.className = "tile";
        tile.setAttribute("data-row", r);
        tile.setAttribute("data-col", c);
        tile.setAttribute("aria-label", "Tile " + (r + 1) + " " + (c + 1));
        row.appendChild(tile);
      }
      boardEl.appendChild(row);
    }
  }

  function evaluateGuess(guess) {
    var target = GameState.targetWord.toUpperCase();
    var result = [];
    var remaining = target.split("");

    for (var i = 0; i < COLS; i++) {
      result[i] = "gray";
    }
    for (var i = 0; i < COLS; i++) {
      if (guess[i] === target[i]) {
        result[i] = "green";
        remaining[i] = null;
      }
    }
    for (var i = 0; i < COLS; i++) {
      if (result[i] === "green") continue;
      var idx = remaining.indexOf(guess[i]);
      if (idx !== -1) {
        result[i] = "yellow";
        remaining[idx] = null;
      }
    }
    return result;
  }

  function applyEvaluation(rowIndex, letters, evals) {
    var row = boardEl.querySelector('.row[data-row="' + rowIndex + '"]');
    var tiles = row.querySelectorAll(".tile");
    for (var i = 0; i < COLS; i++) {
      var t = tiles[i];
      t.textContent = letters[i];
      t.classList.remove("filled", "gray", "yellow", "green");
      t.classList.add("evaluated", evals[i]);
    }
  }

  function updateKeyColors() {
    var keyEls = keyboardEl.querySelectorAll(".key[data-key]");
    var best = {};
    for (var r = 0; r < GameState.evaluations.length; r++) {
      var letters = GameState.guesses[r].split("");
      var evals = GameState.evaluations[r];
      for (var i = 0; i < COLS; i++) {
        var letter = letters[i];
        var status = evals[i];
        if (!best[letter] || status === "green" || (status === "yellow" && best[letter] === "gray")) {
          best[letter] = status;
        }
      }
    }
    keyEls.forEach(function (k) {
      var letter = k.getAttribute("data-key");
      k.classList.remove("gray", "yellow", "green");
      if (best[letter]) {
        k.classList.add(best[letter]);
      }
    });
  }

  function submitGuess() {
    if (GameState.currentCol !== COLS || GameState.isGameOver) return;

    var letters = [];
    var row = boardEl.querySelector('.row[data-row="' + GameState.currentRow + '"]');
    var tiles = row.querySelectorAll(".tile");
    for (var c = 0; c < COLS; c++) {
      letters.push(tiles[c].textContent);
    }
    var word = letters.join("").toUpperCase();
    GameState.guesses[GameState.currentRow] = word;
    var evals = evaluateGuess(word);
    GameState.evaluations[GameState.currentRow] = evals;

    applyEvaluation(GameState.currentRow, letters, evals);
    updateKeyColors();

    if (word === GameState.targetWord) {
      GameState.isGameOver = true;
      GameState.isWon = true;
      Stats.gamesPlayed++;
      Stats.wins++;
      Stats.winStreak++;
      saveStats();
      showMessage("You win!", "win");
      showPlayAgain();
      return;
    }

    GameState.currentRow++;
    GameState.currentCol = 0;

    if (GameState.currentRow >= ROWS) {
      GameState.isGameOver = true;
      Stats.gamesPlayed++;
      Stats.winStreak = 0;
      saveStats();
      showMessage("Game over. The word was: " + GameState.targetWord, "loss");
      showPlayAgain();
    }
  }

  function addLetter(letter) {
    if (GameState.isGameOver) return;
    if (GameState.currentCol >= COLS) return;
    var row = boardEl.querySelector('.row[data-row="' + GameState.currentRow + '"]');
    var tile = row.querySelector('.tile[data-col="' + GameState.currentCol + '"]');
    tile.textContent = letter.toUpperCase();
    tile.classList.add("filled");
    tile.classList.remove("gray", "yellow", "green");
    GameState.currentCol++;
  }

  function removeLetter() {
    if (GameState.isGameOver) return;
    if (GameState.currentCol <= 0) return;
    GameState.currentCol--;
    var row = boardEl.querySelector('.row[data-row="' + GameState.currentRow + '"]');
    var tile = row.querySelector('.tile[data-col="' + GameState.currentCol + '"]');
    tile.textContent = "";
    tile.classList.remove("filled");
  }

  function fetchWord() {
    return new Promise(function (resolve, reject) {
      var attempt = 0;
      function tryFetch() {
        attempt++;
        fetch(WORD_API)
          .then(function (res) { return res.json(); })
          .then(function (arr) {
            var word = Array.isArray(arr) ? arr[0] : (arr.word || arr.randomWord || "");
            if (typeof word !== "string") word = "";
            word = word.toUpperCase().replace(/[^A-Z]/g, "");
            if (word.length === 6) {
              resolve(word);
            } else if (attempt < MAX_RETRIES) {
              tryFetch();
            } else {
              var fallback = FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
              resolve(fallback || "LETTER");
            }
          })
          .catch(function () {
            if (attempt < MAX_RETRIES) {
              tryFetch();
            } else {
              var fallback = FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
              resolve(fallback || "LETTER");
            }
          });
      }
      tryFetch();
    });
  }

  function resetGame() {
    GameState.targetWord = "";
    GameState.currentRow = 0;
    GameState.currentCol = 0;
    GameState.guesses = [];
    GameState.evaluations = [];
    GameState.isGameOver = false;
    GameState.isWon = false;

    messageEl.textContent = "";
    messageEl.className = "message";
    playAgainEl.classList.add("hidden");

    createBoard();
    updateKeyColors();

    messageEl.textContent = "Loading word…";
    fetchWord().then(function (word) {
      GameState.targetWord = word;
      messageEl.textContent = "";
      updateStats();
    });
  }

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = "message " + (type || "");
  }

  function showPlayAgain() {
    playAgainEl.classList.remove("hidden");
  }

  function loadStats() {
    try {
      var s = localStorage.getItem("wordle6stats");
      if (s) {
        var o = JSON.parse(s);
        Stats.gamesPlayed = o.gamesPlayed || 0;
        Stats.wins = o.wins || 0;
        Stats.winStreak = o.winStreak || 0;
      }
    } catch (e) {}
  }

  function saveStats() {
    try {
      localStorage.setItem("wordle6stats", JSON.stringify(Stats));
    } catch (e) {}
  }

  function updateStats() {
    if (gamesPlayedEl) gamesPlayedEl.textContent = Stats.gamesPlayed;
    if (winsEl) winsEl.textContent = Stats.wins;
    if (winStreakEl) winStreakEl.textContent = Stats.winStreak;
  }

  function buildKeyboard() {
    keyboardEl = getEl("keyboard");
    keyboardEl.innerHTML = "";
    KEY_ROWS.forEach(function (rowLetters) {
      var row = document.createElement("div");
      row.className = "keyboard-row";
      rowLetters.forEach(function (letter) {
        var key = document.createElement("button");
        key.type = "button";
        key.className = "key";
        key.setAttribute("data-key", letter);
        key.textContent = letter;
        key.addEventListener("click", function () {
          if (/^[A-Z]$/.test(letter)) addLetter(letter);
        });
        row.appendChild(key);
      });
      keyboardEl.appendChild(row);
    });
    var backRow = document.createElement("div");
    backRow.className = "keyboard-row";
    var back = document.createElement("button");
    back.type = "button";
    back.className = "key wide";
    back.textContent = "Back";
    back.addEventListener("click", removeLetter);
    backRow.appendChild(back);
    var enter = document.createElement("button");
    enter.type = "button";
    enter.className = "key wide";
    enter.textContent = "Enter";
    enter.addEventListener("click", submitGuess);
    backRow.appendChild(enter);
    keyboardEl.appendChild(backRow);
  }

  function onKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var key = e.key.toUpperCase();
    if (e.key === "Backspace") {
      e.preventDefault();
      removeLetter();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      submitGuess();
      return;
    }
    if (key.length === 1 && /^[A-Z]$/.test(key)) {
      e.preventDefault();
      addLetter(key);
    }
  }

  function init() {
    messageEl = getEl("message");
    playAgainEl = getEl("playAgain");
    gamesPlayedEl = getEl("gamesPlayed");
    winsEl = getEl("wins");
    winStreakEl = getEl("winStreak");

    loadStats();
    createBoard();
    buildKeyboard();
    updateStats();

    playAgainEl.addEventListener("click", function () {
      resetGame();
    });

    document.addEventListener("keydown", onKeyDown);
    resetGame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
