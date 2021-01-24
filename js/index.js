let array = [];

const swapAnimations = [];
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
const btnCancel = document.getElementById("btn-cancel");
const speedSlider = document.getElementById("slider-speed");
const algorithmSelect = document.getElementById("algorithm-select");

btnSort.addEventListener("click", sort);
btnRandomize.addEventListener("click", scrambleArray);
speedSlider.addEventListener("input", () => {
  FRAME_TIME = FRAME_TIME_MAX - 500 - speedSlider.value;
});

//randomizeArray();
buildArray();

function randomizeArray() {
  array.length = 0;
  swapAnimations.length = 0;
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
    swapAnimations.push([randomA, randomB]);
  }
  playSwapAnimation();
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
  console.log(array);
  switch (currentAlgorithm) {
    case "0":
      bubbleSort();
      break;
    case "1":
      quickSort(0, array.length - 1);
      break;
    case "2":
      selectionSort();
      break;
    case "3":
      insertionSort();
      break;
    case "4":
      array = mergeSort(array);
      break;
  }
  console.log(array);
  playSwapAnimation();
}

function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i; j++) {
      if (array[j] > array[j + 1]) {
        swap(array, j, j + 1);
        swapAnimations.push([j, j + 1]);
      }
    }
  }
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
        swapAnimations.push([i, pivotIndex]);
        pivotIndex++;
      }
    }
    swap(array, pivotIndex, end);
    swapAnimations.push([pivotIndex, end]);
    return pivotIndex;
  }
}

function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let min = array[i];
    let minIndex = i;
    for (let j = i; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        min = array[j];
        minIndex = j;
      }
    }
    swap(array, i, minIndex);
    swapAnimations.push([i, minIndex]);
  }
}

function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let insert = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > insert) {
      array[j + 1] = array[j];
      swapAnimations.push([j + 1, j]);
      j--;
    }
    array[j + 1] = insert;
  }
}

function mergeSort(arr) {
  if (arr.length < 2) {
    return;
  }
  let pivotIndex = Math.floor(arr.length / 2);
  let firstHalf = arr.slice(0, pivotIndex);
  let secondHalf = arr.slice(pivotIndex, arr.length);
  mergeSort(firstHalf);
  mergeSort(secondHalf);
  return merge(firstHalf, secondHalf, arr);

  function merge(arr1, arr2, result) {
    let index1 = 0;
    let index2 = 0;
    while (index1 < arr1.length && index2 < arr2.length) {
      if (arr1[index1] < arr2[index2]) {
        result.push(arr1[index1++]);
      } else {
        result.push(arr2[index2++]);
      }
    }
    while (index1 < arr1.length) {
      result.push(arr1[index1++]);
    }
    while (index2 < arr2.length) {
      result.push(arr2[index2++]);
    }
    return result;
  }
}
function playSwapAnimation() {
  let currentAnimation = 0;
  disableButtons(true);
  playNextAnimation();

  function playNextAnimation() {
    setTimeout(() => {
      if (swapAnimations[currentAnimation] === undefined) {
        animationFinish();
        return;
      }
      const [barA, barB] = swapAnimations[currentAnimation];
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
      swapAnimations.length = 0;
    }
  }
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
