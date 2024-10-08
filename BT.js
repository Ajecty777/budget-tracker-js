const transactionsForm = document.querySelector("form");
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem ("transactions")): [] ;
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");


function updateStatistics(){
  const updatedIncome = transactions.filter(transaction => transaction.amount > 0).reduce((total, transaction)=>
                                      total = total + Number(transaction.amount), 0);
  console.log(updatedIncome);
  const updatedExpense = transactions.filter(transaction => transaction.amount > 0).reduce((total, transaction)=>
    total = total + Math.abs(Number(transaction.amount)), 0);
  
  updatedBalance = updatedIncome-updatedExpense;
  income.textContent = updatedIncome;
  expense.textContent = updatedExpense;
  balance.textContent = updatedBalance;
}

updateStatistics();

function generateTemplate(id, source, amount, time){
  return `<li data-id="${id}">
  <p class="income-type">
    <span> ${source}</span>
    <span id="time">${time}</span>
  </p>
  $<span class="income-amount">${Math.abs(amount)}</span>
  <i class="bi bi-trash-fill delete"></i>
 </li>`
}

function addTransactionDOM(id, source, amount, time){

  if (amount >= 0){

    incomeList.innerHTML = incomeList.innerHTML + generateTemplate(id, source, amount, time);

  }else{
    expenseList.innerHTML = expenseList.innerHTML + generateTemplate(id, source, amount, time);

  }
  

}

function addTransaction(source,amount){
  const time= new Date();
  const transaction = {
    id: Math.floor(Math.random()*100000),
    source: source,
    amount: amount,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
  };
  transactions.push(transaction)
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDOM(transaction.id, source, amount, transaction.time);
}

transactionsForm.addEventListener('submit', (event)=>{
  event.preventDefault();
  if(transactionsForm.source.value.trim() === '' || transactionsForm.amount.value.trim()){
    return alert("Please add proper values");

  }
  addTransaction(transactionsForm.source.value.trim(), Number(transactionsForm.amount.value));
  updateStatistics();
  transactionsForm.reset();

})

function getTransaction(){
  transactions.forEach(transaction=>{
    if(transaction.amount >=0){
      incomeList.innerHTML = incomeList.innerHTML + generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
    }else{
      expenseList.innerHTML = expenseList.innerHTML + generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
    }
  })
}

getTransaction();

function deleteTransaction(id){
transactions = transactions.filter(transaction =>{
  return transaction.id !== id;
})
localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener('click', event=>{
  if(event.target.classList.contains('delete')){
   event.target.parentElement.remove();
   deleteTransaction(Number(event.target.parentElement.dataset.id));
   updateStatistics();
  }
});

expenseList.addEventListener('click', event=>{
  if(event.target.classList.contains('delete')){
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
})


