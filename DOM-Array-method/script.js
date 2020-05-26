const main = document.getElementById("main");
const addUserBtn = document.getElementById("add-user");
const doubleBtn = document.getElementById("double");
const millionaireBtn = document.getElementById("millionaire");
const sortBtn = document.getElementById("sort");
const calculateWealthBtn = document.getElementById("calculate-wealth");

let data = [];

function getRandomUser() {
  fetch(`https://randomuser.me/api`)
    .then((res) => res.json())
    .then((data) => {
      const user = data.results[0];
      // console.log(user.name);

      const newUser = {
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000),
      };

      addData(newUser);
    });
}

function addData(userObject) {
  data.push(userObject);

  updateDOM();
}

function doubleMoney() {
  data = data.map((user) => {
    return { ...user, money: user.money * 2 };
  });
  updateDOM();
}

function filterMillionaire() {
  data = data.filter((user) => user.money > 1000000);
  updateDOM();
}

function sortRichest() {
  data.sort((a, b) => b.money - a.money);
  updateDOM();
}

function totalWealth() {
  const wealth = data.reduce((a, b) => a + b.money, 0);

  const wealthEl = document.createElement("div");
  wealthEl.innerHTML = `<h3>Total wealth: <strong>${formatMoney(
    wealth
  )}</strong></h3>`;
  main.appendChild(wealthEl);
}

function updateDOM(providedData = data) {
  main.innerHTML = "<h2><strong>Person</strong>Wealth</h2>";

  providedData.forEach((item) => {
    const element = document.createElement("div");
    element.classList.add("person");
    element.innerHTML = `<strong>${item.name}</strong>${formatMoney(
      item.money
    )}`;
    main.appendChild(element);
  });
}

function formatMoney(number) {
  return "$" + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

addUserBtn.addEventListener("click", getRandomUser);
doubleBtn.addEventListener("click", doubleMoney);
millionaireBtn.addEventListener("click", filterMillionaire);
sortBtn.addEventListener("click", sortRichest);
calculateWealthBtn.addEventListener("click", totalWealth);
