
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let expression = "";
let justCalculated = false;

function updateDisplay() {
    display.value = expression || "0";
}

function calculate() {
    if (!expression) return;

    try {
        // Allow only numbers and arithmetic operators.
        if (!/^[0-9+\-*/.()\s]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        expression = String(
            Number(result.toPrecision(12))
        );

        justCalculated = true;
        updateDisplay();
    } catch {
        display.value = "Error";
        expression = "";
        justCalculated = false;
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            expression = "";
            justCalculated = false;
            updateDisplay();
            return;
        }

        if (action === "delete") {
            if (justCalculated) {
                expression = "";
                justCalculated = false;
            } else {
                expression = expression.slice(0, -1);
            }

            updateDisplay();
            return;
        }

        if (action === "calculate") {
            calculate();
            return;
        }

        if (action === "decimal") {
            if (justCalculated) {
                expression = "";
                justCalculated = false;
            }

            const currentNumber = expression.split(/[+\-*/]/).pop();

            if (!currentNumber.includes(".")) {
                expression += currentNumber === "" ? "0." : ".";
            }

            updateDisplay();
            return;
        }

        if (value !== undefined) {
            if (justCalculated && /[0-9]/.test(value)) {
                expression = "";
            }

            justCalculated = false;
            expression += value;
            updateDisplay();
        }
    });
});

// Support keyboard input too.
document.addEventListener("keydown", event => {
    if (/^[0-9+\-*/.]$/.test(event.key)) {
        event.preventDefault();

        if (justCalculated && /[0-9.]/.test(event.key)) {
            expression = "";
        }

        justCalculated = false;
        expression += event.key;
        updateDisplay();
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    } else if (event.key === "Backspace") {
        expression = expression.slice(0, -1);
        justCalculated = false;
        updateDisplay();
    } else if (event.key === "Escape") {
        expression = "";
        justCalculated = false;
        updateDisplay();
    }
});
