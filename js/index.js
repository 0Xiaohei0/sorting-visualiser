const array = [];

const animations = [];
const PRIMARY_COLOR = "#e8871e";
const SECONDARY_COLOR = "#D8EBC1";

let currentAlgorithm = "0";

const SIZE = 100;
const MIN = 1;
const MAX = 100;
const HEIGHT_MULT = 7;

const SCRAMBLE_TIME = 200;

let FRAME_TIME_MAX = 1000;
let FRAME_TIME = 1;

const container = document.getElementById("visualizer-container");
const btnRandomize = document.getElementById("btn-randomize");
const btnSort = document.getElementById("btn-sort");
const speedSlider = document.getElementById("slider-speed");
const algorithmSelect = document.getElementById("algorithm-select");

btnSort.addEventListener("click", sort);
btnRandomize.addEventListener("click", scrambleArray);
speedSlider.addEventListener("input", () => {
  FRAME_TIME = FRAME_TIME_MAX - 500 - speedSlider.value;
  console.log(FRAME_TIME);
});

//randomizeArray();
buildArray();

function randomizeArray() {
  array.length = 0;
  animations.length = 0;
  for (let i = 0; i < SIZE; i++) {
    array.push(Math.floor(Math.random() * (MAX - MIN)) + MIN);
  }
  updateBars();
}

function buildArray() {
  array.length = 0;
  for (let i = 1; i <= SIZE; i++) {
    array.push(i);
  }
  updateBars();
  scrambleArray();
}

function scrambleArray() {
  for (let i = 0; i <= SCRAMBLE_TIME; i++) {
    let randomA = Math.floor(Math.random() * SIZE);
    let randomB = Math.floor(Math.random() * SIZE);
    swap(array, randomA, randomB);
    animations.push([randomA, randomB]);
  }
  playAnimation();
}

function updateBars() {
  container.innerHTML = "";
  for (const element of array) {
    createBar(element);
  }
  function createBar(height) {
    let elementBar = document.createElement("div");
    elementBar.className = "element-bar";
    elementBar.style.height = height * 0.9 + "vh";
    container.appendChild(elementBar);
  }
}

function disableButtons(state) {
  btnSort.disabled = state;
  btnRandomize.disabled = state;
}

function sort() {
  currentAlgorithm = algorithmSelect.value;
  if (currentAlgorithm === "0") {
    bubbleSort();
  } else if (currentAlgorithm === "1") {
    quickSort(0, array.length - 1);
  }
  playAnimation();
}

function quickSort(start, end) {
  if (start >= end) {
    return;
  }
  let index = partition();
  quickSort(start, index - 1);
  quickSort(index + 1, end);

  function partition() {
    let pivotIndex = start;
    let pivotValue = array[end];
    for (let i = start; i < end; i++) {
      if (array[i] < pivotValue) {
        swap(array, i, pivotIndex);
        animations.push([i, pivotIndex]);
        pivotIndex++;
      }
    }
    swap(array, pivotIndex, end);
    animations.push([pivotIndex, end]);
    return pivotIndex;
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
}

function playAnimation() {
  console.log(animations.length);
  let currentAnimation = 0;
  disableButtons(true);
  playNextAnimation();

  function playNextAnimation() {
    setTimeout(() => {
      if (animations[currentAnimation] === undefined) {
        animationFinish();
        return;
      }
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
    function animationFinish() {
      disableButtons(false);
      animations.length = 0;
    }
  }
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
