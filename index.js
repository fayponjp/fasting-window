const progressOutlineElement = document.getElementById("progressBorder");
const timerDisplay = document.getElementById("timerDisplay");
const finishButton = document.getElementById("finishButton");
const updateButton = document.getElementById("updateButton");
const cancelButton = document.getElementById("cancelButton");
const activeFastElementsArray = [progressOutlineElement, timerDisplay, finishButton, updateButton, cancelButton];

const startButton = document.getElementById("startButton");
const hourOptions = document.querySelector(".hourOptions");
const inactiveFastElementsArray = [startButton, hourOptions];

const fastHourButtons = document.querySelectorAll(".timeButton");

let fastHours = 16;
let loopVariable = "";

function updateFastTimeText(time) {
    const fastTimeText = document.getElementById("fastTime");
    fastTimeText.textContent = time;
}

function getFastEndTime(selectedFastHours, startTime) {
    let dateTimeValue = new Date(startTime);
    dateTimeValue.setTime(startTime.getTime() + selectedFastHours*60*60*1000);

    return dateTimeValue;
}

function getDateTime(time) {
    const day = time.getDate();
    const month = time.getMonth()+1;
    const year = time.getFullYear();

    let hour = time.getHours();
    if(hour<10)hour = "0"+hour;

    let minute = time.getMinutes();
    if(minute<10)minute = "0"+minute;

    let second = time.getSeconds();
    if(second<10)second = "0"+second;

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function updateTimerDisplay(startTime, endTime) {
    const goalSeconds = endTime.getTime() - startTime.getTime();
    console.log(goalSeconds/1000/3600);

    const timeDisplayElement = document.getElementById("timerDisplay");
    const progressBarElement = document.getElementById("progressBar");

    const formattedStartDisplay = getDateTime(startTime);
    const formattedEndDisplay = getDateTime(endTime);

    timeDisplayElement.textContent =`Time Started: ${formattedStartDisplay} | Goal Time: ${formattedEndDisplay}`;

    loopVariable = setInterval(() => {
        const currentTime = new Date();
        const secondsSinceStart = currentTime.getTime() - startTime.getTime();
        const differenceInTimeRatio = (secondsSinceStart / goalSeconds) * 100;

        progressBarElement.style.width = `${differenceInTimeRatio}%`;
        progressBarElement.style.transition = 'width 2s';

        if (differenceInTimeRatio > 100) {
            progressBarElement.style.backgroundColor = '#8cb369';
            progressOutlineElement.style.border = '1px solid #8cb369';
        }

    }, 1000);
}

function clickStartHandler() {
    // const startDateTime = getDateTime();
    let startDateTime = new Date();
    // startDateTime = new Date('February 26, 2025 07:10:00');
    // localStorage.setItem("startTime", startDateTime);
    toggleElementDisplay(inactiveFastElementsArray, activeFastElementsArray);
    const endDateTime = getFastEndTime(fastHours, startDateTime);

    updateTimerDisplay(startDateTime, endDateTime);
}

function cancelFastHandler() {
    clearInterval(loopVariable);
    toggleElementDisplay(activeFastElementsArray, inactiveFastElementsArray);
}

function updateFastHandler() {
    clearInterval(loopVariable);
}

function selectFastHoursHandler(fastHourElement) {
    if (!fastHourElement.classList.contains("selected")) {
        const currentSelectedElement = document.querySelector(".selected");
        if (currentSelectedElement) currentSelectedElement.classList.remove("selected");
        fastHourElement.classList.add("selected");
        fastHours = parseInt(fastHourElement.textContent);
        updateFastTimeText(fastHours);
    }
}

function toggleElementDisplay(arrayToHide, arrayToDisplay) {
    for (let i = 0; i < arrayToHide.length; i++) {
        arrayToHide[i].classList.add("hidden");
    }

    for (let i = 0; i < arrayToDisplay.length; i++) {
        arrayToDisplay[i].classList.remove("hidden");
    }
}


startButton.addEventListener("click", clickStartHandler);
cancelButton.addEventListener("click", cancelFastHandler);
updateButton.addEventListener("click", () => null);

for (let i = 0; i < fastHourButtons.length; i++) {
    fastHourButtons[i].addEventListener("click", () => {
        selectFastHoursHandler(fastHourButtons[i]);
    });
}

updateFastTimeText(fastHours);