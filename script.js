const expressionElement = document.getElementById("expression");
const resultElement = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");
const operatorButtons = document.querySelectorAll(".btn-operator");

let currentInput = "";
let justEvaluated = false;

const operators = ["+", "-", "*", "/"];

function updateDisplay() {
  expressionElement.textContent = currentInput || "0";
}

function highlightActiveOperator() {
  const lastChar = currentInput.slice(-1);

  operatorButtons.forEach((button) => {
    if (button.dataset.value === lastChar) {
      button.classList.add("active-op");
    } else {
      button.classList.remove("active-op");
    }
  });
}

function getLastNumberSegment(input) {
  const parts = input.split(/[+\-*/]/);
  return parts[parts.length - 1];
}

function appendValue(value) {
  const lastChar = currentInput.slice(-1);

  if (justEvaluated && !operators.includes(value)) {
    currentInput = "";
    resultElement.textContent = "0";
  }

  if (operators.includes(value)) {
    justEvaluated = false;

    if (!currentInput) {
      if (value === "-") {
        currentInput = "-";
      }
      updateDisplay();
      highlightActiveOperator();
      return;
    }

    if (operators.includes(lastChar)) {
      // Prevent multiple operators in sequence.
      currentInput = currentInput.slice(0, -1) + value;
    } else {
      currentInput += value;
    }

    updateDisplay();
    highlightActiveOperator();
    return;
  }

  if (value === ".") {
    const lastNumber = getLastNumberSegment(currentInput);
    if (lastNumber.includes(".")) {
      return;
    }

    if (!currentInput || operators.includes(lastChar)) {
      currentInput += "0.";
    } else {
      currentInput += ".";
    }
  } else {
    if (justEvaluated) {
      currentInput = value;
      justEvaluated = false;
    } else {
      currentInput += value;
    }
  }

  updateDisplay();
  highlightActiveOperator();
}

function clearAll() {
  currentInput = "";
  justEvaluated = false;
  expressionElement.textContent = "0";
  resultElement.textContent = "0";
  highlightActiveOperator();
}

function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }

  currentInput = currentInput.slice(0, -1);
  updateDisplay();
  highlightActiveOperator();
}

function evaluateExpression() {
  if (!currentInput) {
    return;
  }

  const lastChar = currentInput.slice(-1);
  if (operators.includes(lastChar)) {
    return;
  }

  try {
    const result = eval(currentInput);

    if (!Number.isFinite(result)) {
      resultElement.textContent = "Error";
      justEvaluated = true;
      return;
    }

    resultElement.textContent = String(Number(result.toFixed(10)));
    currentInput = String(resultElement.textContent);
    expressionElement.textContent = currentInput;
    justEvaluated = true;
    highlightActiveOperator();
  } catch (error) {
    resultElement.textContent = "Error";
    justEvaluated = true;
  }
}

function pressAnimationForValue(value) {
  const target = [...buttons].find((button) => button.dataset.value === value);
  if (!target) {
    return;
  }

  target.classList.add("pressed");
  setTimeout(() => target.classList.remove("pressed"), 120);
}

function pressAnimationForAction(action) {
  const target = [...buttons].find((button) => button.dataset.action === action);
  if (!target) {
    return;
  }

  target.classList.add("pressed");
  setTimeout(() => target.classList.remove("pressed"), 120);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.innerText.trim();
    const value = button.dataset.value || label;
    const action = button.dataset.action;

    if ((value >= "0" && value <= "9") || value === "." || operators.includes(value)) {
      appendValue(value);
      return;
    }

    if (action === "clear" || label === "C") {
      clearAll();
    } else if (action === "delete" || label === "DEL") {
      deleteLast();
    } else if (action === "equals" || label === "=") {
      evaluateExpression();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const { key, code } = event;

  if ((key >= "0" && key <= "9") || operators.includes(key) || key === ".") {
    appendValue(key);
    pressAnimationForValue(key);
    return;
  }

  if (key === "Enter" || code === "NumpadEnter" || key === "=") {
    event.preventDefault();
    evaluateExpression();
    pressAnimationForAction("equals");
    return;
  }

  if (key === "Backspace") {
    deleteLast();
    pressAnimationForAction("delete");
    return;
  }

  if (key.toLowerCase() === "c" || key === "Escape") {
    clearAll();
    pressAnimationForAction("clear");
  }
});

updateDisplay();
highlightActiveOperator();
