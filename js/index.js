const array = [];

const animations = [];
const PRIMARY_COLOR = "#e8871e";
const SECONDARY_COLOR = "#D8EBC1";

const SIZE = 100;
const MIN = 1;
const MAX = 100;
const HEIGHT_MULT = 7;

const FRAME_TIME = 1;

const container = document.getElementById("visualizer-container");
const btnRandomize = document
  .getElementById("btn-randomize")
  .addEventListener("click", randomizeArray);
const btnSort = document
  .getElementById("btn-sort")
  .addEventListener("click", bubbleSort);

randomizeArray();

function randomizeArray() {
  array.length = 0;
  animations.length = 0;
  for (let i = 0; i < SIZE; i++) {
    array.push(Math.floor(Math.random() * (MAX - MIN)) + MIN);
  }
  updateBars();
}

function updateBars() {
  container.innerHTML = "";
  for (const element of array) {
    let elementBar = document.createElement("div");
    elementBar.className = "element-bar";
    elementBar.style.height = element * 0.9 + "vh";
    container.appendChild(elementBar);
  }
}

function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i; j++) {
      if (array[j] > array[j + 1]) {
        swap(array, j, j + 1);
        animations.push([j, j + 1]);
      }
    }
  }
  playAnimation();
}

let currentAnimation = 0;

function playAnimation() {
  currentAnimation = 0;
  playNextAnimation();

  function playNextAnimation() {
    if (animations[currentAnimation] === undefined) {
      return;
    }
    setTimeout(() => {
      const [barA, barB] = animations[currentAnimation];
      swapHeight(barA, barB);
      changeColor(barA, barB);
      currentAnimation++;
      playNextAnimation();
    }, FRAME_TIME);

    function changeColor(barA, barB) {
      container.childNodes[barA].style.backgroundColor = SECONDARY_COLOR;
      container.childNodes[barB].style.backgroundColor = SECONDARY_COLOR;
      setTimeout(() => {
        container.childNodes[barA].style.backgroundColor = PRIMARY_COLOR;
        container.childNodes[barB].style.backgroundColor = PRIMARY_COLOR;
      }, FRAME_TIME);
    }

    function swapHeight(barA, barB) {
      let barAHeignt = container.childNodes[barA].style.height;
      container.childNodes[barA].style.height =
        container.childNodes[barB].style.height;
      container.childNodes[barB].style.height = barAHeignt;
    }
  }
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
