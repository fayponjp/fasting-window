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
    const hiddenInputEl = document.getElementById("modal-hidden-input");
    if (e.target === document.getElementById("cancelButton")) {
        modalDisplayHandler("Cancel fast?", false, false);
        hiddenInputEl.value = "cancel";
    } else if (e.target === document.getElementById("updateButton")) {
        modalDisplayHandler("Update start time?", false, false);
        hiddenInputEl.value = "update";
    } else if (e.target === finishButton) {
        modalDisplayHandler("Complete Fast?", false, false);
        hiddenInputEl.value = "complete";
    }
});

document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalConfirm")) {
        modalDecisionHandler(document.getElementById("modal-hidden-input").value);
    } else if (e.target === document.getElementById("modalCancel")) {
        modalDisplayHandler("", true, false);
    } else if (e.target === document.getElementById("modal-update-btn")) {
        updateFastHandler();
    }
});

function startFastTimer() {
    const startDateTime = new Date();
    // new Date('March 14, 2025 14:12:00');

    const endDateTime = getFastEndTime(fastHours, startDateTime);
    localStorage.setItem("startTime", startDateTime);
    localStorage.setItem("endTime", endDateTime);

    updateTimerDisplay(startDateTime, endDateTime);
}

function toggleFastDisplay() {
    document.getElementById("active-fast").classList.toggle("hidden");
    document.getElementById("no-active-fast").classList.toggle("hidden");
    finishButtonContainer.classList.remove("complete");
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
        timerDisplayElement.textContent = "Fast Complete!";
        timerDisplayElement.classList.remove("hidden");
        updateLocalHistory(true);

        endFastHandler();
    } else {
        updateLocalHistory(false);
        endFastHandler();
    }

}

function updateLocalHistory(bool) {
    const localFastHistory = localStorage.getItem("fastHistory");
    if (localFastHistory) {
        const historyObject = JSON.parse(localFastHistory);
        historyObject.push({
            startTime: localStorage.getItem("startTime"), 
            endTime: localStorage.getItem("endTime"),
            completed: bool
        });

        localStorage.setItem("fastHistory", JSON.stringify(historyObject));
    } else {
        localStorage.setItem("fastHistory", JSON.stringify([{
            startTime: localStorage.getItem("startTime"), 
            endTime: localStorage.getItem("endTime"),
            completed: bool
        }]));
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

    finishButtonContainer.classList.remove("complete");
    const progressBarElement = document.getElementById("progressBar");

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


        // will need to put these into classes
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
    modalDisplayHandler("", true, false);
}

function updateFastHandler() {
    if (document.getElementById("new-time-input").checkValidity()) {
        const inputElementValue = document.getElementById("new-time-input").value;

        localStorage.setItem("startTime", new Date(inputElementValue));
        modalDisplayHandler("", true, false);
        clearInterval(setIntervalVariable);

        updateTimerDisplay(new Date(localStorage.getItem("startTime")), getFastEndTime(fastHours, new Date(localStorage.getItem("startTime"))));
    }
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

    modalTextEl.textContent = confirmationMessage;

    if (hideModal && !isUpdate) {
        modalContentEl.classList.remove("hidden");
        modalUpdateEl.classList.add("hidden");

        modalElement.classList.add("hidden");
    } else if (!hideModal && !isUpdate) {
        modalContentEl.classList.remove("hidden");
        modalUpdateEl.classList.add("hidden");

        modalElement.classList.remove("hidden");
    } else if (!hideModal && isUpdate) {
        modalContentEl.classList.add("hidden");
        modalUpdateEl.classList.remove("hidden");

        modalElement.classList.remove("hidden");

        const cleanStartDate = new Date(localStorage.getItem("startTime"));
        const maxDate = new Date();
        cleanStartDate.setMinutes(cleanStartDate.getMinutes() - cleanStartDate.getTimezoneOffset());
        maxDate.setMinutes(maxDate.getMinutes() - maxDate.getTimezoneOffset());

        const timeInput = document.getElementById("new-time-input");
        timeInput.value = cleanStartDate.toISOString().slice(0,16);
        timeInput.max = maxDate.toISOString().slice(0, 16);
        console.log(timeInput)
    }
}

function modalDecisionHandler(arg) {
    switch (arg) {
        case "cancel":
            endFastHandler();
            break;
        case "update":
            modalDisplayHandler("Update Start Time", false, true);
            break;
        case "complete":
            completeFastHandler();
            break;
        default: 
            break;
    }
}

function startExtension() {
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
//  a. update localStorage. maybe put it in a list for history? DONE
//  b. if done that way, also add a time since last fast?
// 2. update fast input with start time 
// 3. update display under x-hour fast or under the bar to show time started
// 4. refactor? 