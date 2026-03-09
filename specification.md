
```markdown
# 6-Letter Word Guessing Game — Software Specification

## 1. Overview

### 1.1 Purpose
This document specifies the requirements for a browser-based word puzzle game where the player must guess a **6-letter word within six attempts**.

The game will evaluate each guess and provide feedback through colored tiles indicating:

- **Green** → correct letter in the correct position  
- **Yellow** → correct letter but wrong position  
- **Gray** → letter not in the word  

The gameplay is similar to the mechanics used in :contentReference[oaicite:0]{index=0} but limited to **6-letter words only**.

---

## 2. Platform and Technology

| Component | Technology |
|---|---|
| Platform | Web Browser |
| Programming Language | JavaScript |
| UI | HTML + CSS |
| Word Source | Online Dictionary API |
| Input Methods | Physical keyboard + On-screen keyboard |

---

# 3. Gameplay Rules

1. The game retrieves a **random valid 6-letter word** from an online dictionary API.
2. The player is presented with **6 rows of tiles**.
3. Each row contains **6 square letter tiles**.
4. The player types a guess using either:
   - a physical keyboard
   - an on-screen keyboard
5. A guess is **finalized when 6 letters are entered and the player presses Enter or Spacebar**.
6. The game evaluates the guess and colors the tiles.
7. The player has **6 total guesses**.
8. If the word is guessed correctly, the player wins.
9. If the player fails after six guesses, the game ends.
10. After a win or loss, a **Play Again** button appears.

---

# 4. Game Board Layout

The game board contains **6 rows × 6 columns**.

Example layout:

```

□ □ □ □ □ □
□ □ □ □ □ □
□ □ □ □ □ □
□ □ □ □ □ □
□ □ □ □ □ □
□ □ □ □ □ □

```

Each tile represents one letter.

---

# 5. Functional Requirements

## 5.1 Word Retrieval

The game must retrieve a **random valid 6-letter word** from an online dictionary API.

### Process
1. Request a random word from the API.
2. Validate:
   - word length is exactly 6
3. Store word as the **target word**.

### Acceptance Criteria

- A word is successfully retrieved from the API.
- The word contains exactly **6 letters**.
- The word is stored internally and not visible to the player.

---

## 5.2 Player Input

Players can input letters using:

- physical keyboard
- on-screen keyboard

### Rules

- Only alphabetic characters are accepted.
- Maximum letters per guess: **6**.

### Acceptance Criteria

- Player can type letters into tiles.
- Tiles fill from **left to right**.
- No more than 6 letters can be entered per row.

---

## 5.3 Guess Submission

A guess becomes final when:

- 6 letters are entered
- player presses **Enter** or **Spacebar**

### Acceptance Criteria

- Guess cannot be submitted if fewer than 6 letters are entered.
- Submitted guess becomes locked.
- Game evaluates the guess.

---

# 6. Guess Evaluation Algorithm

The guess is compared to the target word using **Wordle-style duplicate letter rules**.

### Evaluation Process

Step 1 — Mark correct letters in correct position (Green)

Step 2 — Mark correct letters in wrong position (Yellow)

Step 3 — Remaining letters are Gray

### Example

Target word:

```

LETTER

```

Guess:

```

BETTER

````

Result:

| Letter | Result |
|---|---|
| B | Gray |
| E | Green |
| T | Green |
| T | Green |
| E | Green |
| R | Green |

---

### Acceptance Criteria

- Letters in correct position turn **Green**.
- Correct letters in wrong position turn **Yellow**.
- Letters not present turn **Gray**.
- Duplicate letter rules match Wordle logic.

---

# 7. Tile Coloring

Each tile can be in one of four states.

| State | Description |
|---|---|
| Empty | No letter entered |
| Gray | Letter not in target word |
| Yellow | Letter exists in word but wrong position |
| Green | Letter is correct and correctly positioned |

---

# 8. Turn Progression

1. Player enters letters.
2. Guess is submitted.
3. Game evaluates guess.
4. Tiles change color.
5. Next row becomes active.

---

### Acceptance Criteria

- Only **one row is active at a time**.
- After evaluation, next row activates automatically.

---

# 9. Win Condition

The player wins when the guess exactly matches the target word.

### Acceptance Criteria

- All tiles in the row are **Green**.
- Game displays a **win message**.
- **Play Again** button appears.

---

# 10. Loss Condition

The player loses when:

- 6 guesses have been used
- the target word was not guessed

### Acceptance Criteria

- Game displays **Game Over message**.
- Correct word is revealed.
- **Play Again** button appears.

---

# 11. Game Reset

When the player presses **Play Again**:

1. Game board resets
2. New word retrieved from API
3. Guess counter resets
4. Game statistics update

---

### Acceptance Criteria

- Board clears all letters.
- Tile colors reset.
- New word is selected.

---

# 12. Game Statistics

The game tracks the following metrics:

| Statistic | Description |
|---|---|
| Games Played | Total games started |
| Wins | Total games won |
| Win Streak | Consecutive wins |

---

### Acceptance Criteria

- Statistics update after each game.
- Statistics persist during the session.

---

# 13. Data Structures

### Game State

```javascript
GameState = {
  targetWord: "STRING",
  currentRow: 0,
  guesses: [],
  maxGuesses: 6,
  wordLength: 6
}
````

### Player Statistics

```javascript
Stats = {
  gamesPlayed: 0,
  wins: 0,
  winStreak: 0
}
```

---

# 14. User Interface Components

| Component          | Description        |
| ------------------ | ------------------ |
| Game Board         | 6×6 grid of tiles  |
| On-Screen Keyboard | clickable keyboard |
| Statistics Panel   | shows game stats   |
| Play Again Button  | restarts game      |

---

# 15. Error Handling

| Scenario                 | Behavior         |
| ------------------------ | ---------------- |
| API fails                | retry request    |
| word length incorrect    | request new word |
| invalid characters typed | ignore input     |

---

# 16. Non-Functional Requirements

### Performance

* Game should respond to input within **100 ms**.

### Compatibility

Game must work in:

* Chrome
* Firefox
* Edge
* Safari

---

# 17. Example Game Flow

1. Game loads.
2. Word retrieved from API.
3. Player types first guess.
4. Guess evaluated.
5. Tiles colored.
6. Player continues guessing.
7. Win or loss condition triggered.
8. Player presses **Play Again**.

---

# 18. Acceptance Criteria for Complete Game

The application is considered complete when:

* Random **6-letter word** is retrieved from API
* Game board renders **6×6 tile grid**
* Player can type guesses
* Guess submission works
* Tile colors correctly reflect evaluation
* Duplicate letter rules are implemented
* Game detects win/loss conditions
* Play Again button resets the game
* Game statistics update correctly
