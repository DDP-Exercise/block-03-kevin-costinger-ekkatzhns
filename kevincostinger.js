"use strict";
/*******************************************************
 *     kevincostinger.js - 100p.
 *
 *     This is Kevin. Kevin keeps track of your expenses
 *     and costs. To add an expense, pick a date, declare
 *     the amount and add a short description.
 *
 *     When you submit the form, all fields are validated.
 *     If Kevin is not happy with your inputs, the least
 *     he will do is, bring you back to the field where
 *     you made a mistake. But who knows? Maybe he can
 *     even provide some excellent User experience?
 *     (+5 Bonus points available)
 *
 *     These are the rules for the form validation:
 *      - Date is valid, if it's not empty.
 *      - Amount is valid, if it's at least 0.01.
 *      - Text is valid, if it's at least 3 letters long.
 *
 *     If everything is okay, Kevin adds a new table row,
 *     containing the expense. The table row also contains
 *     a button, which deletes the expense, once you click
 *     it. After adding a table row, the form is reset and
 *     ready for the next input.
 *
 *     At the bottom of the expense tracker, you can see
 *     a small number. It represents the sum of all expenses,
 *     which are currently tracked. It is always accurate!
 *
 *     Have a look at the pictures provided. They demonstrate
 *     how the software looks like. Notice the details, like
 *     the perfectly formatted currency! Isn't that great?
 *
 *     By the way...
 *     Kevin is a clean guy. He is free of code duplications.
 *     Kevin defines his quality by using functions and
 *     events, to keep his sourcecode clean af. He understands
 *     the scope of his variables and of course, makes use of
 *     event delegation, to keep his event listeners tidied up!
 *
 *     You - 2026-03-25
 *******************************************************/
let sumExpenses = 0; //Use this variable to keep the sum up to date.

// Attach event listeners once the DOM is ready. This ensures all elements exist
window.addEventListener('DOMContentLoaded', () => {
    // Grab the form inside the expense tracker. There are nested form tags in
    // index.html, so select the last one to access the actual inputs.
    const forms = document.querySelectorAll('#expenseTracker form');
    const form = forms[forms.length - 1];
    form.addEventListener('submit', submitForm);

    // Event delegation for delete buttons on the expense table.
    const expenseTableBody = document.querySelector('#expenses tbody');
    expenseTableBody.addEventListener('click', handleDeleteClick);

    // Inject custom styles for error highlighting. This avoids modifying the
    // existing CSS file directly and keeps the UI responsive. The style
    // applies a red border and subtle shadow to any element with the
    // 'error' class.
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
      .error {
        border: 2px solid #dc3545 !important;
        outline: none;
        box-shadow: 0 0 3px rgba(220, 53, 69, 0.6);
      }
    `;
    document.head.appendChild(errorStyle);
});

/**
 * Handles clicks on the expense table. Uses event delegation to
 * identify if a delete button was clicked and removes the corresponding row.
 * @param {MouseEvent} e
 */
function handleDeleteClick(e) {
    const target = e.target;
    // Only act if the clicked element has the class 'delete'
    if (target.classList.contains('delete')) {
        const row = target.closest('tr');
        // Skip header row or undefined rows
        if (!row || !row.dataset.amount) return;
        const amount = parseFloat(row.dataset.amount);
        // Subtract from the running total and update the displayed sum
        if (!isNaN(amount)) {
            sumExpenses -= amount;
            if (sumExpenses < 0) sumExpenses = 0;
            updateExpenseSum();
        }
        // Remove the row from the table
        row.remove();
    }
}


function submitForm(e){
    // Prevent the form from performing a page reload
    e.preventDefault();

    // Reference to the form and its input fields
    const form = e.target;
    const dateInput = form.querySelector('#date');
    const amountInput = form.querySelector('#amount');
    const textInput = form.querySelector('#expense');

    // Remove previous error states
    [dateInput, amountInput, textInput].forEach((el) => {
        if (el) el.classList.remove('error');
    });

    // Extract values
    const dateVal = dateInput ? dateInput.value : '';
    const amountVal = amountInput ? amountInput.value : '';
    const textVal = textInput ? textInput.value : '';

    // Validation flags
    let isValid = true;

    // Validate date
    if (isEmpty(dateVal)) {
        if (dateInput) {
            dateInput.classList.add('error');
            dateInput.focus();
        }
        isValid = false;
    }

    // Validate amount (must be a number >= 0.01)
    const amountNumber = parseFloat(amountVal);
    if (isNaN(amountNumber) || amountNumber < 0.01) {
        if (isValid && amountInput) amountInput.focus();
        if (amountInput) amountInput.classList.add('error');
        isValid = false;
    }

    // Validate text (minimum 3 characters excluding whitespace)
    const trimmedText = textVal.trim();
    if (trimmedText.length < 3) {
        if (isValid && textInput) textInput.focus();
        if (textInput) textInput.classList.add('error');
        isValid = false;
    }

    // If any validation failed, abort
    if (!isValid) {
        return;
    }

    // All validations passed; create a new table row
    const row = document.createElement('tr');
    // Store numeric amount for accurate subtraction later
    row.dataset.amount = amountNumber.toString();

    // Create and populate cells
    const dateCell = document.createElement('td');
    dateCell.textContent = dateVal;

    const amountCell = document.createElement('td');
    amountCell.textContent = formatEuro(amountNumber);

    const textCell = document.createElement('td');
    textCell.textContent = trimmedText;

    const deleteCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'X';
    deleteCell.appendChild(deleteBtn);

    // Append cells to row
    row.appendChild(dateCell);
    row.appendChild(amountCell);
    row.appendChild(textCell);
    row.appendChild(deleteCell);

    // Append the new row to the table body
    const tbody = document.querySelector('#expenses tbody');
    tbody.appendChild(row);

    // Update the running total and display the new sum
    sumExpenses += amountNumber;
    updateExpenseSum();

    // Reset the form fields
    form.reset();
    // Optionally focus the first input after reset
    if (dateInput) dateInput.focus();
}


/*****************************
 * DO NOT CHANGE CODE BELOW.
 * USE IT.
 ****************************/


/*******************************************************
 *     Checks if variable is empty
 *     @param {any} variable - Variable which you want to check.
 *     @return {Boolean} Empty or not.
 ******************************************************/
let isEmpty = function(variable) {
    if(Array.isArray(variable))
        return (variable.length === 0);
    else if(typeof variable === "object")
        return (Object.entries(variable).length === 0);
    else
        return (typeof variable === "undefined" || variable == null || variable === "");
};

/*******************************************************
 *     Converts number into currency string.
 *     @param {Number} number - Any numeric value.
 *     @return {String} Well formatted currency string.
 ******************************************************/
function formatEuro(number) {
    return number.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

/**
 * Updates the displayed sum of all logged expenses using the global
 * sumExpenses variable.
 */
function updateExpenseSum() {
    const sumElement = document.getElementById('expenseSum');
    if (sumElement) {
        sumElement.textContent = formatEuro(sumExpenses);
    }
}