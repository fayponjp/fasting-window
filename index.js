const progressOutlineElement = document.getElementById("progressBorder");
const timerDisplay = document.getElementById("timerDisplay");
const finishButton = document.getElementById("finishButton");
const updateButton = document.getElementById("updateButton");
const cancelButton = document.getElementById("cancelButton");
const activeFastElementsArray = [progressOutlineElement, timerDisplay, finishButton, updateButton, cancelButton];

const startButton = document.getElementById("startButton");
const hourOptions = document.querySelector(".hourOptions");
const inactiveFastElementsArray = [startButton, hourOptions];

const modalElement = document.querySelector(".modal");

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

    const timeDisplayElement = document.getElementById("timerDisplay");
    const progressBarElement = document.getElementById("progressBar");

    const formattedStartDisplay = getDateTime(startTime);
    const formattedEndDisplay = getDateTime(endTime);

    loopVariable = setInterval(() => {
        const currentTime = new Date();
        const secondsSinceStart = currentTime.getTime() - startTime.getTime();
        const differenceInTimeRatio = (secondsSinceStart / goalSeconds) * 100;

        let totalSeconds = Math.round(secondsSinceStart/1000);
        let hours = Math.floor(totalSeconds / 3600);
        if(hours<10)hours = "0"+hours;
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        if(minutes<10)minutes = "0"+minutes;
        let seconds = totalSeconds % 60;
        if(seconds<10)seconds = "0"+seconds;

        timeDisplayElement.textContent =`${hours}:${minutes}:${seconds}`;

        progressBarElement.style.width = `${differenceInTimeRatio}%`;
        progressBarElement.style.transition = 'width 0.4s';

        if (differenceInTimeRatio > 100) {
            progressBarElement.style.backgroundColor = '#8cb369';
            progressOutlineElement.style.border = '1px solid #8cb369';
            finishButton.textContent = 'COMPLETE FAST'
        }

    }, 1000);
}

function clickStartHandler() {
    const startDateTime = new Date();
    // new Date('March 03, 2025 07:10:00');

    toggleElementDisplay(inactiveFastElementsArray, activeFastElementsArray);
    const endDateTime = getFastEndTime(fastHours, startDateTime);
    localStorage.setItem("startTime", startDateTime);
    localStorage.setItem("endTime", endDateTime);

    updateTimerDisplay(startDateTime, endDateTime);
}

function cancelFastHandler() {
    clearInterval(loopVariable);

    localStorage.removeItem("startTime");
    localStorage.removeItem("endTime");

    toggleElementDisplay(activeFastElementsArray, inactiveFastElementsArray);
    modalElement.classList.add("hidden");
}

function updateFastHandler() {
    clearInterval(loopVariable);
    modalElement.classList.add("hidden");
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
        arrayToHide[i].classList.toggle("hidden");
    }

    for (let i = 0; i < arrayToDisplay.length; i++) {
        arrayToDisplay[i].classList.toggle("hidden");
    }
}

function startExtension() {
    const startDateTime = localStorage.getItem("startTime");
    if (startDateTime) {
        const endDateTime = localStorage.getItem("endTime");
        toggleElementDisplay(inactiveFastElementsArray, activeFastElementsArray);
        console.log(new Date(startDateTime));
        updateTimerDisplay(new Date(startDateTime), new Date(endDateTime));
    }
    updateFastTimeText(fastHours);
}

function modalHandler(callback, confirmationMessage) {
    modalElement.classList.remove("hidden");
    document.querySelector(".modal-container-text").textContent = confirmationMessage;

    document.getElementById("modalConfirm").addEventListener("click", () => callback());
    document.getElementById("modalCancel").addEventListener("click", () => callback());
}

startButton.addEventListener("click", clickStartHandler);
cancelButton.addEventListener("click", () => modalHandler(cancelFastHandler, "Cancel fast?"));
updateButton.addEventListener("click", () => modalHandler(updateFastHandler, "Update start time?"));

for (let i = 0; i < fastHourButtons.length; i++) {
    fastHourButtons[i].addEventListener("click", () => {
        selectFastHoursHandler(fastHourButtons[i]);
    });
}

startExtension();