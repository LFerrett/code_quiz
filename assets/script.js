// Declares global variables
var navBar = document.querySelector("nav");
var container = document.getElementById("container");
var highscoresLink = document.getElementById("highscores-link");
var startButton = document.getElementById("start-button");
var timerDisplay = document.getElementById("timer");
var title = document.getElementById("title");
var text = document.getElementById("text");
var quizAnswers = document.getElementById("quiz-answers");
var answerBtns = document.getElementsByClassName("answer-button");
var answerMsg = document.getElementById("answer-message");
var inputField = document.getElementById("input-field");
var initials = document.getElementById("initials");
var submitBtn = document.getElementById("submit-button");

// Creates an array of questions
var questions = [
  {
    title: "The first two letters/numbers in a hex code refers to what color?",
    choices: ["red", "green", "yellow", "blue"],
    answer: "red",
  },
  {
    title: "Letters are used in hex color codes when?",
    choices: ["you run out of numbers", "the value of the color is higher than nine", "they aren't used", "the value of the color is lower than 0"],
    answer: "the value of the color is higher than nine",
  },
  {
    title:
      "What hex code would display a bright green color?",
    choices: [
      "#0000ff",
      "#ff0000",
      "#00ff00",
      "#000000",
    ],
    answer: "#00ff00",
  },
  {
    title:
    "What hex code would display black?",
    choices: ["#fff", "Both #fff and #FFFFFF", "#000", "Both #000 and #000000"],
    answer: "Both #000 and #000000",
  },
  {
    title:
      "Colors in hex codes are represented from 0 to:",
    choices: ["144", "256", "12", "999"],
    answer: "256",
  },
];

// Declares timer and score variables
var timerSecs = 0;
var currentQuestion = 0;
var score = 0;
var scoreArray = [];
var timerInterval = false;

// Creates a function to start the quiz with 45 seconds on the clock
function startQuiz() {
  timerSecs = 45;
  timerDisplay.textContent = timerSecs;
  countdown();
  nextQuestion();
  startButton.style.display = "none";
}

// Clicks to the next question if there are any left
function nextQuestion() {
  container.className = "results-page";
  title.textContent = "Question " + (currentQuestion + 1);
  title.setAttribute("class", "h2");
  text.textContent = questions[currentQuestion].title;
  text.className = "h4";
  text.setAttribute(
    "style",
    "border-top: 1px double #ba251a; padding-top: 20px;"
  );

  // Displays the answers 
  quizAnswers.style.display = "block";
  quizAnswers.style.fontWeight = "800";
  answerBtns[0].textContent = questions[currentQuestion].choices[0];
  answerBtns[1].textContent = questions[currentQuestion].choices[1];
  answerBtns[2].textContent = questions[currentQuestion].choices[2];
  answerBtns[3].textContent = questions[currentQuestion].choices[3];

  for (i = 0; i < answerBtns.length; i++) {
    answerBtns[i].addEventListener("click", checkAnswer);
  }
}

// Function to check to see if the user chose the correct answer, subtracts time for a wrong answer, and displays a message for the wrong or right answer
function checkAnswer(event) {
  // console.log("User chose: " + event.target.textContent);
  // console.log("Correct answer: " + questions[currentQuestion].answer);

  if (event.target.textContent === questions[currentQuestion].answer) {
    answerMsg.style.display = "block";
    answerMsg.textContent = "That's correct!";
    answerMsg.className = "answer-message";
    currentQuestion++;
    score++;

    setTimeout(function () {
      answerMsg.style.display = "none";
    }, 800);

    if (currentQuestion === questions.length) {
      endGame();
    } else {
      nextQuestion();
    }
  } else {
    currentQuestion++;
    answerMsg.style.display = "block";
    answerMsg.textContent = "Sorry, you're wrong!";
    answerMsg.className = "answer-message";

    setTimeout(function () {
      answerMsg.style.display = "none";
    }, 500);

    if (timerSecs < 10) {
      timerSecs -= 10;
      endGame();
    } else if (currentQuestion === 5) {
      endGame();
    } else {
      timerSecs -= 5;
      nextQuestion();
    }
  }
}

// Finishes the game (if the time runs out or the questions are finished) displaying final score 
function endGame() {
  quizAnswers.style.display = "none";
  container.className = "quiz-page mt-5";
  title.setAttribute("class", "h2");
  text.setAttribute("style", "border-top: 0");
  text.removeAttribute("class");
  text.textContent =
    "You finished with a score of " +
    score +
    "! Input your initials to see the high scores.";
  inputField.style.display = "block";

  if (timerSecs <= 0) {
    title.textContent = "Time's up!";
  } else {
    title.textContent = "Congratulations, you've finished";
  }

  submitBtn.addEventListener("click", storeScores);
}

// Stores the score and the initials of the user to local storage and displays them on the high score screen
function storeScores(event) {
  event.preventDefault();

  if (initials.value.length === 0) {
    return;
  } else {
    newScore = {
      userName: initials.value.trim(),
      userScore: score,
    };
    scoreArray.push(newScore);
    scoreArray.sort((a, b) => b.userScore - a.userScore);
    localStorage.setItem("score", JSON.stringify(scoreArray));
  showScores();
  }
}

function loadHighScore() {
  storedScores = JSON.parse(localStorage.getItem("score"));
  if (storedScores !== null) {
    scoreArray = storedScores;
    return scoreArray;
  }
}

function showScores() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // creates the high score "page"
  container.className = "score-page";
  var ul = document.createElement("ul");
  var returnButton = document.createElement("button");
  var clearButton = document.createElement("button");
  // returnButton.classList.add("btn btn-info");
  returnButton.textContent = "Go Back";
  clearButton.textContent = "Clear High Scores";
  container.appendChild(ul);
  container.appendChild(returnButton);
  container.appendChild(clearButton);

  startButton.style.display = "none";
  navBar.style.visibility = "hidden";
  title.textContent = "High Scores";
  text.textContent = "";
  text.setAttribute("style", "border-top: 0");
  quizAnswers.style.display = "none";
  inputField.style.display = "none";

  for (i = 0; i < scoreArray.length; i++) {
    var score = scoreArray[i].userName + " : " + scoreArray[i].userScore;

    li = document.createElement("li");
    li.textContent = score;
    ul.appendChild(li);
  }

  returnButton.addEventListener("click", function () {
    location.href = "index.html";
  });

  clearButton.addEventListener("click", function () {
    localStorage.clear();
    ul.innerHTML = "";
  });
}

// timer
function countdown() {
  timerInterval = setInterval(function () {
    timerSecs--;
    timerDisplay.textContent = timerSecs;

    if (timerSecs < 1) {
      timerDisplay.textContent = 0;
      endGame();
      clearInterval(timerInterval);
    }

    if (currentQuestion === 5) {
      timerDisplay.textContent = timerSecs;
      clearInterval(timerInterval);
    }
  }, 1000);
}

function handleFirstTab(e) {
  if (e.keyCode === 9) {
    document.body.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
  }
}

// Adds event listeners
window.addEventListener("keydown", handleFirstTab);
loadHighScore();
startButton.addEventListener("click", startQuiz);
highscoresLink.addEventListener("click", showScores);
