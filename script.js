// ========================================
// TRANSACTION ARRAY
// ========================================

let transactions = [];

let editingId = null;

let financeChart = null;


// ========================================
// GET HTML ELEMENTS
// ========================================

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const typeInput =
    document.getElementById("type");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const addBtn =
    document.getElementById("addBtn");

const transactionList =
    document.getElementById("transactionList");

const searchInput =
    document.getElementById("searchInput");

const filterType =
    document.getElementById("filterType");


// Summary elements
const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expensesElement =
    document.getElementById("expenses");


// Chart element
const financeChartCanvas =
    document.getElementById("financeChart");


// ========================================
// LOAD FROM LOCAL STORAGE
// ========================================

const savedTransactions =
    localStorage.getItem("transactions");

if (savedTransactions) {

    transactions =
        JSON.parse(savedTransactions);

}


// ========================================
// INITIAL DISPLAY
// ========================================

displayTransactions();

updateSummary();

updateChart();


// ========================================
// ADD / UPDATE TRANSACTION
// ========================================

addBtn.addEventListener("click", function () {

    const description =
        descriptionInput.value.trim();

    const amount =
        Number(amountInput.value);

    const type =
        typeInput.value;

    const category =
        categoryInput.value;

    const date =
        dateInput.value;


    // Validation
    if (
        description === "" ||
        amount <= 0 ||
        date === ""
    ) {

        alert("⚠️ Please fill in all fields correctly.");

        return;
    }


    // ====================================
    // UPDATE
    // ====================================

    if (editingId !== null) {

        const transaction =
            transactions.find(function (transaction) {

                return transaction.id === editingId;

            });


        if (transaction) {

            transaction.description =
                description;

            transaction.amount =
                amount;

            transaction.type =
                type;

            transaction.category =
                category;

            transaction.date =
                date;

        }


        editingId = null;

        addBtn.textContent =
            "Add Transaction";

    }


    // ====================================
    // ADD NEW
    // ====================================

    else {

        const transaction = {

            id: Date.now(),

            description: description,

            amount: amount,

            type: type,

            category: category,

            date: date

        };


        transactions.push(transaction);

    }


    // Save
    saveTransactions();


    // Update everything
    displayTransactions();

    updateSummary();

    updateChart();


    // Reset form
    resetForm();

});


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    descriptionInput.value = "";

    amountInput.value = "";

    typeInput.value = "income";

    categoryInput.value = "Salary";

    dateInput.value = "";

    editingId = null;

    addBtn.textContent =
        "Add Transaction";

}


// ========================================
// DISPLAY TRANSACTIONS
// ========================================

function displayTransactions() {

    transactionList.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedFilter =
        filterType.value;


    const filteredTransactions =
        transactions.filter(function (transaction) {


            const matchesSearch =

                transaction.description
                    .toLowerCase()
                    .includes(searchText)

                ||

                transaction.category
                    .toLowerCase()
                    .includes(searchText)

                ||

                transaction.type
                    .toLowerCase()
                    .includes(searchText);


            const matchesFilter =

                selectedFilter === "all"

                ||

                transaction.type === selectedFilter;


            return matchesSearch && matchesFilter;

        });


    // No transactions
    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <p class="no-transactions">
                No transactions found.
            </p>
        `;

        return;
    }


    // Display transactions
    filteredTransactions.forEach(function (transaction) {

        const transactionDiv =
            document.createElement("div");


        transactionDiv.className =
            `transaction-card ${transaction.type}`;


        transactionDiv.innerHTML = `

            <div class="transaction-info">

                <h3>
                    ${transaction.description}
                </h3>

                <p>
                    🏷️ ${transaction.category}
                </p>

                <p>
                    📅 ${transaction.date}
                </p>

            </div>


            <div class="transaction-right">

                <p class="transaction-amount">

                    ${transaction.type === "income" ? "+" : "-"}

                    ₹${transaction.amount}

                </p>


                <p class="transaction-type">

                    ${transaction.type === "income"
                        ? "Income"
                        : "Expense"}

                </p>


                <div class="transaction-buttons">

                    <button
                        class="edit-btn"
                        onclick="editTransaction(${transaction.id})"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </div>

        `;


        transactionList.appendChild(transactionDiv);

    });

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", function () {

    displayTransactions();

});


// ========================================
// FILTER
// ========================================

filterType.addEventListener("change", function () {

    displayTransactions();

});


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            income += transaction.amount;

        }

        else {

            expenses += transaction.amount;

        }

    });


    const balance =
        income - expenses;


    incomeElement.textContent =
        `₹${income}`;

    expensesElement.textContent =
        `₹${expenses}`;

    balanceElement.textContent =
        `₹${balance}`;

}


// ========================================
// UPDATE CHART
// ========================================

function updateChart() {

    let income = 0;

    let expenses = 0;


    // Calculate totals
    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            income += transaction.amount;

        }

        else {

            expenses += transaction.amount;

        }

    });


    const balance =
        income - expenses;


    // If chart already exists,
    // destroy it before creating a new one

    if (financeChart !== null) {

        financeChart.destroy();

    }


    // Create chart

    financeChart =
        new Chart(financeChartCanvas, {

            type: "bar",

            data: {

                labels: [
                    "Income",
                    "Expenses",
                    "Balance"
                ],

                datasets: [

                    {
                        label: "Amount",

                        data: [
                            income,
                            expenses,
                            balance
                        ]
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: true
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

}


// ========================================
// DELETE TRANSACTION
// ========================================

function deleteTransaction(id) {

    transactions =
        transactions.filter(function (transaction) {

            return transaction.id !== id;

        });


    saveTransactions();

    displayTransactions();

    updateSummary();

    updateChart();

}


// ========================================
// EDIT TRANSACTION
// ========================================

function editTransaction(id) {

    const transaction =
        transactions.find(function (transaction) {

            return transaction.id === id;

        });


    if (!transaction) {

        return;

    }


    descriptionInput.value =
        transaction.description;

    amountInput.value =
        transaction.amount;

    typeInput.value =
        transaction.type;

    categoryInput.value =
        transaction.category;

    dateInput.value =
        transaction.date;


    editingId = id;


    addBtn.textContent =
        "Update Transaction";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ========================================
// SAVE TO LOCAL STORAGE
// ========================================

function saveTransactions() {

    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );

}