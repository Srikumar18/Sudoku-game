## 🧩 Sudoku Master

A responsive, feature-rich Sudoku puzzle game built using **HTML**, **CSS**, and **JavaScript**, with core solving logic driven by **Constraint Satisfaction Problem (CSP)** strategies including **Backtracking**, **Forward Checking**, and **AC-3 (Arc Consistency Algorithm 3)**.

This project serves both as an interactive Sudoku game and as a demonstration of algorithmic problem-solving and constraint propagation techniques in action.

---

### 🚀 Features

* 🎯 **DSA-Powered Solver**

  * Solves Sudoku using:

    * ✅ Recursive **Backtracking**
    * 🔍 **Forward Checking** for early failure detection
    * ♻️ **AC-3 Algorithm** for enforcing arc consistency
* 🎮 **Game Features**

  * Choose difficulty (Easy, Medium, Hard) based on number of pre-filled cells
  * Auto-generate new puzzles
  * Track solving time with a live **timer**
  * Highlight incorrect entries dynamically
  * Store player performance (time, score) using `localStorage`
* 💡 **CSP-Based Optimization**

  * Domains reduced during search
  * Inference handled via AC-3 before and during solving

---

### 🧠 Algorithms and DSA Concepts

This project applies and demonstrates:

* 🔁 **Backtracking Search**
* 📉 **Forward Checking**: Eliminates inconsistent domain values early
* 📬 **AC-3 Algorithm**: Prunes the search space by enforcing binary constraints
* 📊 **2D Array Manipulation**
* 🕹️ **State Management** via JavaScript objects and arrays
* 📦 **Browser Storage** with `localStorage`

---

### 🛠 Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | HTML5, CSS3                          |
| Logic      | Vanilla JavaScript                   |
| Algorithms | Backtracking, Forward Checking, AC-3 |
| Storage    | `localStorage`                       |

---

### 📂 Project Structure

```
sudoku-solver-app/
├── game.html           # Game board layout
├── index.html          # Home page layout
├── index.css           # CSS for index.html
├── styles.css          # CSS for game.html
├── script.js           # Game logic, solving algorithms
├── README.md           # You're here!
```

---

### 📚 Use Case

This project is ideal for:

* Students or engineers practicing **Data Structures & Algorithms**
* Demonstrating **CSP-based solving techniques**
* Educational tools to explain constraint satisfaction in games
* Resume or portfolio proof of advanced JavaScript + DSA integration

---

### 🧪 How to Run

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/sudoku-solver-app.git
   cd sudoku-solver-app
   ```

2. Open `index.html` in your browser.

---

### 📈 Future Improvements

* Add visual explanation of solving steps
* Include user input feature
* Leaderboard integration (local or server-based)
* Dark mode & accessibility improvements
