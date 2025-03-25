'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const accounts = [account1, account2, account3, account4];

////////// Creating username using name //////////
const createusernames = function (user) {
  let names = user.toLowerCase().split(' ');
  let username = names.map(name => name[0]).join('');
  return username;
};

accounts.forEach(function (account) {
  account.username = createusernames(account.owner);
  console.log(account);
});

////////// display movements - transactions //////////
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    let type = mov > 0 ? 'deposit' : 'withdrawal';
    let html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

////////// display movements - sort button //////////
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(curAcc.movements, !sorted);
  sorted = !sorted;
});

////////// display account Balance //////////
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = acc.balance + ' EUR';
};

////////// display max movement //////////
const displayMaxMov = function (movements) {
  let maxMov = movements.reduce(function (acc, mov) {
    return Math.max(acc, mov);
  }, 0);
  console.log(maxMov);
};

////////// display transaction summery (in, out, interest) //////////
let displaySummery = function (movements, interestRate) {
  let income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = income + ' €';

  let outgo = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = Math.abs(outgo) + ' €';

  // interest is paid on each deposit = 1.2%
  // interest is paid only if interest amount is greater than 1 for that transaction
  let interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = interest + ' €';
};

////////// login functionality //////////
let curAcc;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  curAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (curAcc?.pin === Number(inputLoginPin.value)) {
    // display UI and welcome msg
    labelWelcome.textContent = `Welcome back, ${curAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    // clear input field
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    // display movements, balance and account summary of current account
    updateUI(curAcc);
  }
});

//////// update UI //////////
const updateUI = function (acc) {
  displayMovements(acc.movements);
  displayBalance(acc);
  displaySummery(acc.movements, acc.interestRate);
};

//////// transfer money //////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  let transferAmt = Number(inputTransferAmount.value);
  let transferToAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    transferAmt > 0 &&
    transferAmt < curAcc.balance &&
    transferToAcc?.username !== curAcc.username
  ) {
    curAcc.movements.push(-transferAmt);
    transferToAcc.movements.push(transferAmt);
    updateUI(curAcc);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

//////// request loan //////////
// the bank gives loan only if there is at least 1 deposit greater than or equal to 10% of the loan requested
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  let minTransRequired = 0.1 * Number(inputLoanAmount.value);
  let loanEligibily = curAcc.movements.some(mov => mov >= minTransRequired);

  if (loanEligibily) {
    curAcc.movements.push(Number(inputLoanAmount.value));
    updateUI(curAcc);
  }
  inputLoanAmount.value = '';
});

//////// close account //////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    curAcc.username === inputCloseUsername.value &&
    curAcc.pin === Number(inputClosePin.value)
  ) {
    let index = accounts.findIndex(acc => acc.username === curAcc.username);

    // delete acc
    accounts.splice(index, 1);
    // hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// for (let movement of movements) {
//   if (movement > 0) {
//     console.log(`${movement} credited`);
//   } else console.log(`${Math.abs(movement)} debited`);
// }

// currencies.forEach(function (value, key, map) {
//   console.log(value, key);
// });

////////Practise of above using map
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// let movementDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementDescription);
