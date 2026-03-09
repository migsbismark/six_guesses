```markdown id="v7c3s8"
# 6-Letter Word Guessing Game — Implementation TODO List

This TODO list breaks the project into **incremental development steps ordered from easiest to hardest**.  
Each item includes **acceptance criteria** so it is clear when the task is complete.

---

# Phase 1 — Project Setup

## 1. Create Project Structure

**Tasks**
- Create project folder
- Create `index.html`
- Create `styles.css`
- Create `app.js`
- Link CSS and JS to the HTML page

**Acceptance Criteria**

- Opening `index.html` loads without errors
- Browser console shows no JavaScript errors
- CSS and JS files are successfully loaded

---

## 2. Create Basic Page Layout

**Tasks**

- Add title for the game
- Add container for game board
- Add container for keyboard
- Add container for statistics
- Add Play Again button (hidden initially)

**Acceptance Criteria**

- Page displays title and empty containers
- Layout renders correctly in browser
- Play Again button exists but is hidden

---

# Phase 2 — Game Board

## 3. Generate the 6×6 Game Grid

**Tasks**

- Create grid with 6 rows
- Each row contains 6 tiles
- Use square tile layout

Example structure:

```

□ □ □ □ □ □
□ □ □ □ □ □
□ □ □ □ □ □
□ □ □ □ □ □
□ □ □ □ □ □
□ □ □ □ □ □

````

**Acceptance Criteria**

- 36 tiles appear on screen
- Tiles are arranged in 6 rows and 6 columns
- Tiles are square and evenly spaced

---

## 4. Implement Tile Styling

**Tasks**

Create CSS styles for tile states:

- empty
- gray
- yellow
- green

**Acceptance Criteria**

- Tiles change color correctly when classes are applied
- Colors match expected states

---

# Phase 3 — Game State

## 5. Create Game State Object

**Tasks**

Create a JavaScript object to store game data.

Example:

```javascript
GameState = {
  targetWord: "",
  currentRow: 0,
  currentCol: 0,
  guesses: [],
  maxGuesses: 6,
  wordLength: 6
}
````

**Acceptance Criteria**

* GameState object exists
* Game state variables can be updated

---

# Phase 4 — Word Retrieval

## 6. Connect to Word API

**Tasks**

* Call online dictionary API
* Retrieve a word
* Ensure word length = 6

**Acceptance Criteria**

* API request succeeds
* Retrieved word contains exactly 6 letters
* Word stored as `targetWord`

---

## 7. Handle API Failures

**Tasks**

* Retry request if API fails
* Reject invalid words

**Acceptance Criteria**

* Game retries when API fails
* Game never starts with invalid word length

---

# Phase 5 — Player Input

## 8. Enable Physical Keyboard Input

**Tasks**

* Capture keyboard events
* Accept letters A–Z
* Ignore invalid keys

**Acceptance Criteria**

* Player can type letters
* Letters appear in tiles
* Only alphabetic characters are accepted

---

## 9. Implement Tile Filling Logic

**Tasks**

* Letters fill left to right
* Maximum of 6 letters per row

**Acceptance Criteria**

* Tiles fill sequentially
* Cannot exceed 6 letters

---

## 10. Implement Backspace

**Tasks**

* Allow player to delete last letter

**Acceptance Criteria**

* Pressing backspace removes last letter
* Cursor moves back correctly

---

# Phase 6 — Guess Submission

## 11. Implement Enter/Space Submission

**Tasks**

* Detect Enter or Spacebar
* Submit guess when row has 6 letters

**Acceptance Criteria**

* Guess cannot submit if fewer than 6 letters
* Guess locks when submitted
* Game evaluates guess

---

# Phase 7 — Word Evaluation

## 12. Implement Green Letter Logic

**Tasks**

* Compare guessed letters to target word
* Mark correct letters in correct position

**Acceptance Criteria**

* Correct letters turn green

---

## 13. Implement Yellow Letter Logic

**Tasks**

* Detect correct letters in wrong position

**Acceptance Criteria**

* Correct letter but wrong position turns yellow

---

## 14. Implement Duplicate Letter Rules

**Tasks**

* Follow Wordle-style duplicate handling

**Acceptance Criteria**

* Duplicate letters are evaluated correctly
* Colors match Wordle behavior

---

## 15. Apply Tile Colors

**Tasks**

* Update tile classes based on evaluation

**Acceptance Criteria**

* Tiles display correct color feedback

---

# Phase 8 — Turn Progression

## 16. Advance to Next Row

**Tasks**

* Increment row counter after guess

**Acceptance Criteria**

* Next row becomes active
* Previous row becomes locked

---

# Phase 9 — Win/Loss Logic

## 17. Implement Win Detection

**Tasks**

* Check if guess matches target word

**Acceptance Criteria**

* Game displays win message
* Play Again button appears

---

## 18. Implement Loss Detection

**Tasks**

* Detect when 6 guesses are used

**Acceptance Criteria**

* Game displays game over message
* Target word revealed
* Play Again button appears

---

# Phase 10 — Play Again System

## 19. Reset Game

**Tasks**

* Clear board
* Reset game state
* Retrieve new word

**Acceptance Criteria**

* Board clears
* New word generated
* Game restarts correctly

---

# Phase 11 — Statistics

## 20. Track Games Played

**Tasks**

* Increment counter each game

**Acceptance Criteria**

* Games played increases after each game

---

## 21. Track Wins

**Tasks**

* Increment win counter

**Acceptance Criteria**

* Wins increase after successful guess

---

## 22. Track Win Streak

**Tasks**

* Increment streak on win
* Reset streak on loss

**Acceptance Criteria**

* Win streak behaves correctly

---

# Phase 12 — On-Screen Keyboard

## 23. Create On-Screen Keyboard

**Tasks**

* Display clickable keyboard

**Acceptance Criteria**

* Keys appear for all letters
* Keys are clickable

---

## 24. Connect Keyboard to Input System

**Tasks**

* Clicking keys adds letters

**Acceptance Criteria**

* On-screen keyboard behaves same as physical keyboard

---

# Phase 13 — UI Polish

## 25. Animate Tile Feedback

**Tasks**

* Add flip animation or color transition

**Acceptance Criteria**

* Tiles animate smoothly when evaluated

---

# Final Milestone

## 26. Complete Playable Game

The game is complete when:

* Random 6-letter word is retrieved from API
* Player can type guesses
* Tile grid updates correctly
* Letter colors follow Wordle rules
* Game detects wins and losses
* Statistics track correctly
* Play Again resets the game
* Physical and on-screen keyboards work

