const timerDisplayElement = document.getElementById("timerDisplay");
const finishButtonContainer = document.getElementById("finishButtonContainer");
const finishButton = document.getElementById("finishButton");

const modalElement = document.querySelector(".modal");

let fastHours = 16;
let setIntervalVariable = "";

document.getElementById("no-active-fast").addEventListener("click", (e) => {
    if (e.target === document.getElementById("startButton")) {
        startFastTimer();
        toggleFastDisplay();
    } else if (e.target.classList.contains("timeButton")) {
        selectFastHoursHandler(e.target);
    }
});

document.getElementById("active-fast").addEventListener("click", (e) => {
    if (e.target === document.getElementById("cancelButton")) {
        modalDisplayHandler("Cancel fast?", false, false);
    } else if (e.target === document.getElementById("updateButton")) {
        modalDisplayHandler("Update start time?", false, false);
    } else if (e.target === finishButton) {
        completeFastHandler();
    }
});

document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalConfirm")) {
        modalDisplayHandler("Update Start Time", false, true);
    } else if (e.target === document.getElementById("modalCancel")) {
        modalDisplayHandler("", true, false);
    }
});

function startFastTimer() {
    const startDateTime = new Date();
    // new Date('March 13, 2025 07:10:00');

    const endDateTime = getFastEndTime(fastHours, startDateTime);
    localStorage.setItem("startTime", startDateTime);
    localStorage.setItem("endTime", endDateTime);

    updateTimerDisplay(startDateTime, endDateTime);
}

function toggleFastDisplay() {
    document.getElementById("active-fast").classList.toggle("hidden");
    document.getElementById("no-active-fast").classList.toggle("hidden");
}

function getFastEndTime(selectedFastHours, startTime) {
    let dateTimeValue = new Date(startTime);
    dateTimeValue.setTime(startTime.getTime() + selectedFastHours*60*60*1000);

    return dateTimeValue;
}

function updateFastTimeText(time) {
    const fastTimeText = document.getElementById("fastTime");
    fastTimeText.textContent = time;
}

function completeFastHandler() {
    if (finishButtonContainer.classList.contains("complete")) {
        endFastHandler();
        timerDisplayElement.textContent = "Fast Complete!";
        timerDisplayElement.classList.remove("hidden");
        // add fast time to localStorage
        // update display to show time since last fast
    } else {
        endFastHandler();
    }
}

// function getDateTime(time) {
//     const day = time.getDate();
//     const month = time.getMonth()+1;
//     const year = time.getFullYear();

//     let hour = time.getHours();
//     if(hour<10)hour = "0"+hour;

//     let minute = time.getMinutes();
//     if(minute<10)minute = "0"+minute;

//     let second = time.getSeconds();
//     if(second<10)second = "0"+second;

//     return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
// }

function updateTimerDisplay(startTime, endTime) {
    const goalSeconds = endTime.getTime() - startTime.getTime();

    const progressBarElement = document.getElementById("progressBar");

    // const formattedStartDisplay = getDateTime(startTime);
    // const formattedEndDisplay = getDateTime(endTime);

    setIntervalVariable = setInterval(() => {
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

        timerDisplayElement.innerHTML =`<span>Time Elapsed:</span> ${hours}:${minutes}:${seconds}`;

        progressBarElement.style.width = `${differenceInTimeRatio}%`;
        progressBarElement.style.transition = 'width 0.4s';

        if (differenceInTimeRatio >= 100) {
            progressBarElement.style.backgroundColor = '#8cb369';
            document.getElementById("progressBorder").style.border = '1px solid #8cb369';
            finishButton.textContent = 'COMPLETE FAST';
            finishButtonContainer.classList.add("complete");
        }

    }, 1000);
}

function endFastHandler() {
    clearLocalStorage();
    toggleFastDisplay();
    modalElement.classList.add("hidden");
}

function updateFastHandler() {
    clearLocalStorage();

    modalElement.classList.add("hidden");
}

function clearLocalStorage() {
    clearInterval(setIntervalVariable);

    localStorage.removeItem("startTime");
    localStorage.removeItem("endTime");
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

function modalDisplayHandler(confirmationMessage, hideModal, isUpdate) {
    const modalContentEl = document.getElementById("modal-content");
    const modalUpdateEl = document.getElementById("modal-update");
    const modalTextEl = document.querySelector(".modal-container-text");

    if (hideModal && !isUpdate) {
        modalTextEl.textContent = "";

        modalContentEl.classList.remove("hidden");
        modalUpdateEl.classList.add("hidden");

        modalElement.classList.add("hidden");
    } else if (!hideModal && !isUpdate) {
        modalTextEl.textContent = confirmationMessage

        modalContentEl.classList.remove("hidden");
        modalUpdateEl.classList.add("hidden");

        modalElement.classList.remove("hidden");
    } else if (!hideModal && isUpdate) {
        modalTextEl.textContent = confirmationMessage

        modalContentEl.classList.add("hidden");
        modalUpdateEl.classList.remove("hidden");

        modalElement.classList.remove("hidden");
    }
}

function startExtension() {
    const fastHistory = localStorage.getItem("fastHistory");
    const startDateTime = localStorage.getItem("startTime");
    if (startDateTime) {
        const endDateTime = localStorage.getItem("endTime");
        toggleFastDisplay();
        updateTimerDisplay(new Date(startDateTime), new Date(endDateTime));
    }
    updateFastTimeText(fastHours);
}

startExtension();

// remaining to do:
// 1. complete fast 
//  a. update localStorage. maybe put it in a list for history?
//  b. if done that way, also add a time since last fast?
// 2. update fast input with start time 
// 3. update display under x-hour fast or under the bar to show time started
// 4. refactor? 