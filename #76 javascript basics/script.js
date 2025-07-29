let userName = prompt("What is your name?");

alert("Hello " + userName + "! Welcome to the page");

document.getElementById("output").innerHTML = "Hi <b>" + userName + "</b>! Try clicking the buttons below.";


function changeBackgroundColor() {

  let colors = ["#f0f8ff", "#ffcccb", "#d1ffd6", "#ffffcc", "#e6e6fa", "#cce7ff"];

  let randomColor = colors[Math.floor(Math.random() * colors.length)];

  document.body.style.backgroundColor = randomColor;

  document.getElementById("output").innerHTML = "Background color changed!";
}


function rollDice() {

  let diceNumber = Math.floor(Math.random() * 6) + 1;

  console.log("You rolled a " + diceNumber);

  document.getElementById("output").innerHTML = "You rolled a <b>" + diceNumber + "</b>! (Check console too!)";
}

