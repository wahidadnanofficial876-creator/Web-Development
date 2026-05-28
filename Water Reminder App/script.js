const onboarding = document.getElementById("onboarding");
const app = document.getElementById("app");

const startBtn = document.getElementById("startBtn");

const ageInput = document.getElementById("age");
const weightInput = document.getElementById("weight");

const progressCircle = document.getElementById("progressCircle");
const progressRing = document.getElementById("progressRing");

const waterAmount = document.getElementById("waterAmount");
const goalText = document.getElementById("goalText");

const resetBtn = document.getElementById("resetBtn");

const themeToggle = document.getElementById("themeToggle");

const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const historyList = document.getElementById("historyList");

const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");

const saveSettings = document.getElementById("saveSettings");
const frequencySelect = document.getElementById("frequencySelect");

const motivation = document.getElementById("motivation");

const messages = [
  "Hydration is your superpower 💧",
  "Water fuels greatness 🚀",
  "Small sips. Big health ❤️",
  "Your body loves water 💙",
  "Stay fresh and energized ✨"
];

let currentWater = 0;
let waterGoal = 2500;
let notificationInterval;

const circumference = 691;

function initialize() {

  const user = JSON.parse(localStorage.getItem("user"));

  if(user){

    waterGoal = user.goal;

    onboarding.classList.remove("active");
    app.classList.add("active");

    currentWater = Number(localStorage.getItem("water")) || 0;

    updateUI();

    startNotifications();

  }

}

initialize();

startBtn.addEventListener("click", () => {

  const age = Number(ageInput.value);
  const weight = Number(weightInput.value);

  if(age >100)
  {
    alert("invalid Age!!");
    return;
  }
  if(!age || !weight){
    alert("Please enter valid data");
    return;
  }

  waterGoal = (weight * 30) + (age * 2);

  localStorage.setItem("user", JSON.stringify({
    age,
    weight,
    goal: waterGoal
  }));

  onboarding.classList.remove("active");
  app.classList.add("active");

  updateUI();

  startNotifications();

});

function updateUI(){

  const progress = currentWater / waterGoal;

  const offset = circumference - progress * circumference;

  progressCircle.style.strokeDashoffset = offset;

  waterAmount.innerText = `${(currentWater / 1000).toFixed(1)}L`;

  goalText.innerText = `/ ${(waterGoal / 1000).toFixed(1)}L`;

  motivation.innerText =
    messages[Math.floor(Math.random() * messages.length)];

  localStorage.setItem("water", currentWater);

}

progressRing.addEventListener("click", () => {

  currentWater += 200;

  if(navigator.vibrate){
    navigator.vibrate(100);
  }

  updateUI();

  saveHistory();

});

resetBtn.addEventListener("click", () => {

  currentWater = 0;

  updateUI();

});

function saveHistory(){

  let history =
    JSON.parse(localStorage.getItem("history")) || [];

  const today = new Date().toDateString();

  history = history.filter(item => item.date !== today);

  history.push({
    date: today,
    amount: currentWater
  });

  localStorage.setItem("history", JSON.stringify(history));

}

historyBtn.addEventListener("click", () => {

  historyModal.style.display = "flex";

  loadHistory();

});

function closeHistory(){

  historyModal.style.display = "none";

}

function loadHistory(){

  const history =
    JSON.parse(localStorage.getItem("history")) || [];

  historyList.innerHTML = "";

  const latest = history.slice(-7).reverse();

  latest.forEach(item => {

    const div = document.createElement("div");

    div.className = "history-item";

    div.innerHTML = `
      <span>${item.date}</span>
      <span>${item.amount} ml</span>
    `;

    historyList.appendChild(div);

  });

  const ctx = document.getElementById("historyChart");

  new Chart(ctx,{
    type:"line",
    data:{
      labels: latest.map(item => item.date),
      datasets:[{
        label:"Water Intake",
        data: latest.map(item => item.amount),
        tension:0.4
      }]
    }
  });

}

settingsBtn.addEventListener("click", () => {

  settingsModal.style.display = "flex";

});

function closeSettings(){

  settingsModal.style.display = "none";

}

saveSettings.addEventListener("click", () => {

  const hours = Number(frequencySelect.value);

  localStorage.setItem("frequency", hours);

  startNotifications();

  alert("Settings Saved!");

});

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){
    themeToggle.innerText = "☀️";
  }else{
    themeToggle.innerText = "🌙";
  }

});

function startNotifications(){

  if(notificationInterval){
    clearInterval(notificationInterval);
  }

  const hours =
    Number(localStorage.getItem("frequency")) || 2;

  notificationInterval = setInterval(() => {

    if(Notification.permission === "granted"){

      new Notification("💧 Drink Water",{
        body:"Stay hydrated and keep your energy high!"
      });

    }

  }, hours * 60 * 60 * 1000);

}

if("Notification" in window){

  Notification.requestPermission();

}
const restartBtn =document.getElementById("restartBtn");
restartBtn.addEventListener("click", () => {

  const confirmReset =
    confirm(
      "Reset profile and enter age & weight again?"
    );

  if(!confirmReset) return;

  localStorage.removeItem("user");
  localStorage.removeItem("water");

  currentWater = 0;
  waterGoal = 2500;

  app.classList.remove("active");
  onboarding.classList.add("active");

  ageInput.value = "";
  weightInput.value = "";

});