const progressOutlineElement = document.getElementById("progressBorder");
const timerDisplay = document.getElementById("timerDisplay");
const finishButton = document.getElementById("finishButton");
const cancelButton = document.getElementById("cancelButton");
const activeFastElementsArray = [progressOutlineElement, timerDisplay, finishButton, cancelButton];

const startButton = document.getElementById("startButton");
const hourOptions = document.querySelector(".hourOptions");
const inactiveFastElementsArray = [startButton, hourOptions];

const fastHourButtons = document.querySelectorAll(".timeButton");

let fastHours = 16;

startButton.addEventListener("click", clickStartHandler);

for (let i = 0; i < fastHourButtons.length; i++) {
    fastHourButtons[i].addEventListener("click", () => {
        selectFastHoursHandler(fastHourButtons[i]);
    });
}

function getFastEndTime(selectedFastHours, startTime) {
    let dateTimeValue = new Date(startTime);
    dateTimeValue.setTime(dateTimeValue.getTime() + selectedFastHours*60*60*1000);
    console.log(dateTimeValue);
}

function getDateTime() {
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth()+1;
    const year = today.getFullYear();

    let hour = today.getHours();
    if(hour<10)hour = "0"+hour;

    let minute = today.getMinutes();
    if(minute<10)minute = "0"+minute;

    let second = today.getSeconds();
    if(second<10)second = "0"+second;

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function updateTimerDisplay() {
    const timeDisplayElement = document.getElementById("timerDisplay");
    const dateTimeValue = getDateTime();

    timeDisplayElement.textContent =`Time Started: ${dateTimeValue}`;

    // setInterval("updateTimerDisplay()", 1000);
}

function clickStartHandler() {
    const startDateTime = getDateTime();
    // startDateTime = '2025-2-23 12:50:30';
    localStorage.setItem("startTime", startDateTime);
    toggleElementDisplay(inactiveFastElementsArray, activeFastElementsArray);
    getFastEndTime(fastHours, startDateTime);
    // updateTimerDisplay();
}

function selectFastHoursHandler(fastHourElement) {
    if (!fastHourElement.classList.contains("selected")) {
        const currentSelectedElement = document.querySelector(".selected");
        if (currentSelectedElement) currentSelectedElement.classList.remove("selected");
        fastHourElement.classList.add("selected");
        fastHours = parseInt(fastHourElement.textContent);
    }
}

function toggleElementDisplay(arrayToHide, arrayToDisplay) {
    console.log(arrayToHide);
    for (let i = 0; i < arrayToHide.length; i++) {
        arrayToHide[i].classList.add("hidden");
    }

    for (let i = 0; i < arrayToDisplay.length; i++) {
        arrayToDisplay[i].classList.remove("hidden");
    }
}

function toggleNoFastElements() {

}