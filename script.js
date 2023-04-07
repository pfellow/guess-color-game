import { RGBToHSL, RGBToHex } from "./colorFormatConverter";

let colorFormat = document.querySelector('[name="format"]:checked').value;
let difficulty = document.querySelector('[name="difficulty"]:checked').value;
let difficultySettings = { easy: 75, medium: 50, hard: 25 };
let colorToGuess;
const formatRadios = document.querySelectorAll('[name="format"]');
const difficultyRadios = document.querySelectorAll('[name="difficulty"]');
const colorToGuessDisplay = document.querySelector("[data-string]");
const colorButtons = document.querySelectorAll("[data-button]");
const nextColorButton = document.querySelector("[data-next]");
const result = document.querySelector("[data-result]");
let correctAnswer;

initialize();

function initialize() {
  fillChoices();
  formatRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      colorFormat = e.target.value;
      colorToGuessDisplay.textContent = formatColor(colorToGuess);
    });
  });
  difficultyRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      difficulty = e.target.value;
      anotherRound();
    });
  });

  colorButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      result.textContent =
        e.target.getAttribute("data-button") == correctAnswer
          ? "Correct"
          : "Wrong";
      revealColors();
    });
  });

  nextColorButton.addEventListener("click", anotherRound);
}

function fillChoices() {
  colorToGuess = getRandomColor(
    { min: 0, max: 255 },
    { min: 0, max: 255 },
    { min: 0, max: 255 }
  );

  let colors = [colorToGuess, ...getOtherColors(5)];
  colors = colors.sort(() => Math.random() - 0.5);

  correctAnswer = colors.indexOf(colorToGuess);
  colorToGuessDisplay.textContent = formatColor(colorToGuess);

  for (let buttonNumber = 0; buttonNumber < 6; buttonNumber++) {
    document
      .querySelector(`.button${buttonNumber}`)
      .style.setProperty(
        `--button${buttonNumber}-color`,
        rgbWrap(colors[buttonNumber])
      );
  }
}

function getRandomColor(range1, range2, range3) {
  return [
    randomNumberGenerator(range1),
    randomNumberGenerator(range2),
    randomNumberGenerator(range3),
  ];
}

function getOtherColors(numberOfColors) {
  const colors = [];
  for (let color = 0; color < numberOfColors; color++) {
    let randomColor = getRandomColor(
      calculateMinMaxforRandom(colorToGuess[0]),
      calculateMinMaxforRandom(colorToGuess[1]),
      calculateMinMaxforRandom(colorToGuess[2])
    );
    colors.push(randomColor);
  }
  return colors;
}

function revealColors() {
  colorButtons.forEach((button) => {
    if (button.getAttribute("data-button") != correctAnswer) {
      button.classList.add("wrong");
    }
    button.setAttribute("disabled", true);
  });
}

function anotherRound() {
  result.textContent = "Click a color to guess";
  colorButtons.forEach((button) => {
    button.classList.remove("wrong");
    button.removeAttribute("disabled");
  });
  fillChoices();
}

function calculateMinMaxforRandom(number) {
  if (number - difficultySettings[difficulty] < 0)
    return { min: number + difficultySettings[difficulty], max: 255 };
  if (number + difficultySettings[difficulty] > 255)
    return { min: 0, max: number - difficultySettings[difficulty] };
  return {
    min: 0,
    max: number - difficultySettings[difficulty],
    min1: number + difficultySettings[difficulty],
    max1: 255,
  };
}
function randomNumberGenerator({ min, max, min1, max1 }) {
  let randomNumber1 = Math.floor(Math.random() * (max - min + 1) + min);
  if (!min1) return randomNumber1;
  let randomNumber2 = Math.floor(Math.random() * (max1 - min1 + 1) + min1);
  return [randomNumber1, randomNumber2][
    randomNumberGenerator({ min: 0, max: 1 })
  ];
}

function formatColor(color) {
  switch (colorFormat) {
    case "rgb":
      return rgbWrap(color);
    case "hex":
      return RGBToHex(...color);
    case "hsl":
      return RGBToHSL(...color);
  }
}

function rgbWrap(colorsArray) {
  return `rgb(${colorsArray[0]}, ${colorsArray[1]}, ${colorsArray[2]})`;
}
