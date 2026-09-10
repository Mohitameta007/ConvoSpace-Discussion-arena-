/* =====================================================
   CONVOSPACE — DISCUSSION ARENA
===================================================== */

/* =====================================================
   THEME
===================================================== */

function initializeTheme() {

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");


    function updateThemeIcon() {

        const isLight =
            document.body.classList.contains(
                "light-theme"
            );

        if (themeIcon) {

            themeIcon.textContent =
                isLight
                    ? "☾"
                    : "☼";

        }

    }


    /* ---------------------------------------------
       LOAD SAVED THEME
    --------------------------------------------- */

    const savedTheme =
        localStorage.getItem(
            "convospace-theme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light-theme"
        );

    } else {

        document.body.classList.remove(
            "light-theme"
        );

    }


    updateThemeIcon();


    /* ---------------------------------------------
       THEME BUTTON
    --------------------------------------------- */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-theme"
                );


                const isLight =
                    document.body.classList.contains(
                        "light-theme"
                    );


                localStorage.setItem(
                    "convospace-theme",
                    isLight
                        ? "light"
                        : "dark"
                );


                updateThemeIcon();

            }
        );

    }

}

/* =====================================================
   LOAD SAVED THEME
===================================================== */

const savedTheme = localStorage.getItem("convospace-theme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
} else {
    document.body.classList.remove("light-theme");
}

/* =====================================================
   ARENA STATE
===================================================== */

let timerInterval = null;
let remainingSeconds = 0;
let discussionStarted = false;


/* =====================================================
   ELEMENTS
===================================================== */

const arenaTopic =
    document.getElementById("arenaTopic");

const arenaPlayerCount =
    document.getElementById("arenaPlayerCount");

const participantsList =
    document.getElementById("participantsList");

const timerDisplay =
    document.getElementById("timerDisplay");

const timerMinutes =
    document.getElementById("timerMinutes");

const startTimer =
    document.getElementById("startTimer");

const resetTimer =
    document.getElementById("resetTimer");

const messageInput =
    document.getElementById("messageInput");

const sendMessage =
    document.getElementById("sendMessage");

const messagesContainer =
    document.getElementById("messagesContainer");

const yourRole =
    document.getElementById("yourRole");

const leaveArena =
    document.getElementById("leaveArena");


/* =====================================================
   LEAVE MODAL ELEMENTS
===================================================== */

const leaveModal =
    document.getElementById("leaveModal");

const cancelLeave =
    document.getElementById("cancelLeave");

const confirmLeave =
    document.getElementById("confirmLeave");


/* =====================================================
   DISCUSSION SETUP
===================================================== */

function getDiscussionSetup() {

    /*
        discussion.html saves the setup using
        "discussionSetup".
    */

    const savedDiscussion =
        sessionStorage.getItem(
            "discussionSetup"
        );

    if (!savedDiscussion) {
        return null;
    }

    try {

        return JSON.parse(
            savedDiscussion
        );

    } catch (error) {

        console.error(
            "Unable to read discussion setup:",
            error
        );

        return null;
    }
}


/* =====================================================
   LOAD ARENA DATA
===================================================== */

function loadArenaData() {

    const discussion =
        getDiscussionSetup();

    if (!discussion) {

        console.warn(
            "No discussion setup found."
        );

        return;
    }


    /* Topic */

    if (arenaTopic) {

        arenaTopic.textContent =
            discussion.topic ||
            "Discussion";
    }


    /* Players */

    const playerCount =
        Number(
            discussion.participants
        ) || 1;


    if (arenaPlayerCount) {

        arenaPlayerCount.textContent =
            playerCount;
    }


    /* Participants */

    if (participantsList) {

        participantsList.innerHTML = "";


        /* User */

        addParticipant(
            "You",
            "Participant",
            true
        );


        /* AI Players */

        const roles =
            Array.isArray(
                discussion.roles
            )
                ? discussion.roles
                : [];


        for (
            let index = 0;
            index < playerCount - 1;
            index++
        ) {

            const role =
                roles[index] ||
                `Player ${index + 2}`;


            addParticipant(
                `Player ${index + 2}`,
                role,
                false
            );
        }
    }


    /* Your role */

    if (yourRole) {

        yourRole.textContent =
            "Participant";
    }
}


/* =====================================================
   ADD PARTICIPANT
===================================================== */

function addParticipant(
    name,
    role,
    isUser
) {

    const participant =
        document.createElement("div");

    participant.className =
        "participant";


    const avatar =
        document.createElement("div");

    avatar.className =
        "participant-avatar";

    avatar.textContent =
        isUser
            ? "Y"
            : name.charAt(
                name.length - 1
            );


    const info =
        document.createElement("div");

    info.className =
        "participant-info";


    const participantName =
        document.createElement("span");

    participantName.className =
        "participant-name";

    participantName.textContent =
        name;


    const participantRole =
        document.createElement("span");

    participantRole.className =
        "participant-role";

    participantRole.textContent =
        role;


    info.appendChild(
        participantName
    );

    info.appendChild(
        participantRole
    );


    participant.appendChild(
        avatar
    );

    participant.appendChild(
        info
    );


    participantsList.appendChild(
        participant
    );
}


/* =====================================================
   TIMER DISPLAY
===================================================== */

function updateTimerDisplay() {

    if (!timerDisplay) {
        return;
    }


    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/* =====================================================
   ENABLE / DISABLE DISCUSSION
===================================================== */

function setDiscussionState(started) {

    discussionStarted =
        started;


    if (messageInput) {

        /*
            Keep textarea clickable even when
            discussion has not started.

            This allows the timer reminder popup
            to appear.
        */

        messageInput.disabled = false;


        if (!started) {

            messageInput.classList.add(
                "chat-disabled"
            );

        } else {

            messageInput.classList.remove(
                "chat-disabled"
            );
        }
    }


    if (sendMessage) {

        sendMessage.disabled =
            !started;
    }
}


/* =====================================================
   TIMER REMINDER
===================================================== */

function showTimerReminder() {

    const existingReminder =
        document.querySelector(
            ".timer-reminder"
        );


    if (existingReminder) {
        existingReminder.remove();
    }


    const reminder =
        document.createElement("div");


    reminder.className =
        "timer-reminder";


    reminder.innerHTML = `
        <strong>Start the timer first</strong>
        <span>Set the discussion time and start the timer before sending a message.</span>
    `;


    document.body.appendChild(
        reminder
    );


    setTimeout(() => {

        reminder.classList.add(
            "show"
        );

    }, 10);


    setTimeout(() => {

        reminder.classList.remove(
            "show"
        );


        setTimeout(() => {

            if (reminder.parentNode) {
                reminder.remove();
            }

        }, 260);

    }, 3000);
}


/* =====================================================
   ADD MESSAGE
===================================================== */

function addMessage(
    name,
    text,
    type = "lead"
) {

    if (!messagesContainer) {
        return;
    }


    const previousMessage =
        messagesContainer.lastElementChild;


    const sameSender =
        previousMessage &&
        previousMessage.dataset.sender === name &&
        previousMessage.dataset.type === type;


    const message =
        document.createElement("div");


    message.className =
        "chat-message";


    message.dataset.sender =
        name;

    message.dataset.type =
        type;


    if (type === "user") {

        message.classList.add(
            "user"
        );
    }


    const avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";


    avatar.textContent =
        type === "user"
            ? "Y"
            : "C";


    const content =
        document.createElement("div");


    content.className =
        "message-content";


    const nameElement =
        document.createElement("span");


    nameElement.className =
        "message-name";


    nameElement.textContent =
        name;


    const textElement =
        document.createElement("div");


    textElement.className =
        "message-text";


    textElement.textContent =
        text;


    /*
        Same person continuously messaging:
        hide repeated name and avatar.
    */

    if (sameSender) {

        message.classList.add(
            "continued"
        );
    }


    content.appendChild(
        nameElement
    );

    content.appendChild(
        textElement
    );


    message.appendChild(
        avatar
    );

    message.appendChild(
        content
    );


    messagesContainer.appendChild(
        message
    );


    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


/* =====================================================
   START DISCUSSION
===================================================== */

function startDiscussion() {

    const minutes =
        Number(
            timerMinutes?.value
        );


    /* Validate timer */

    if (
        !Number.isFinite(minutes) ||
        minutes < 1 ||
        minutes > 180
    ) {

        alert(
            "Please enter a time between 1 and 180 minutes."
        );


        timerMinutes?.focus();


        return;
    }


    /* Stop any previous timer */

    clearInterval(
        timerInterval
    );


    timerInterval =
        null;


    /* Convert minutes to seconds */

    remainingSeconds =
        Math.floor(
            minutes * 60
        );


    updateTimerDisplay();


    /* Start discussion */

    setDiscussionState(
        true
    );


    /* Disable timer input */

    if (timerMinutes) {

        timerMinutes.disabled =
            true;
    }


    /* Disable start button */

    if (startTimer) {

        startTimer.disabled =
            true;

        startTimer.textContent =
            "Running";
    }


    /* Lead message */

    addMessage(
        "Arena Guide",
        "Your time begins. Share your perspective and respond to the discussion."
    );


    /* Start countdown */

    timerInterval =
        setInterval(() => {

            remainingSeconds--;

            updateTimerDisplay();


            if (
                remainingSeconds <= 0
            ) {

                finishDiscussion();
            }

        }, 1000);
}


/* =====================================================
   FINISH DISCUSSION
===================================================== */

function finishDiscussion() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        null;


    remainingSeconds =
        0;


    updateTimerDisplay();


    setDiscussionState(
        false
    );


    if (timerMinutes) {

        timerMinutes.disabled =
            false;
    }


    if (startTimer) {

        startTimer.disabled =
            false;

        startTimer.textContent =
            "Start";
    }


    addMessage(
        "Arena Guide",
        "Time is up. The discussion has ended."
    );
}


/* =====================================================
   RESET DISCUSSION
===================================================== */

function resetDiscussion() {

    /*
        Stop timer.
    */

    clearInterval(
        timerInterval
    );


    timerInterval =
        null;


    /*
        Reset timer to zero.
    */

    remainingSeconds =
        0;


    updateTimerDisplay();


    /*
        Stop chat.
    */

    setDiscussionState(
        false
    );


    /*
        Enable timer input.
    */

    if (timerMinutes) {

        timerMinutes.disabled =
            false;
    }


    /*
        Reset Start button.
    */

    if (startTimer) {

        startTimer.disabled =
            false;

        startTimer.textContent =
            "Start";
    }
}


/* =====================================================
   SEND USER MESSAGE
===================================================== */

function sendUserMessage() {

    if (!discussionStarted) {

        showTimerReminder();

        return;
    }


    if (!messageInput) {
        return;
    }


    const text =
        messageInput.value.trim();


    if (!text) {
        return;
    }


    addMessage(
        "You",
        text,
        "user"
    );


    messageInput.value =
        "";


    messageInput.focus();
}


/* =====================================================
   ENTER KEY
===================================================== */

function handleMessageKeydown(
    event
) {

    /*
        Enter = send
        Shift + Enter = new line
    */

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendUserMessage();
    }
}


/* =====================================================
   LEAVE DISCUSSION
===================================================== */

function leaveDiscussion() {

    /*
        Do not leave immediately.
        Show confirmation modal first.
    */

    if (leaveModal) {

        leaveModal.classList.add(
            "show"
        );
    }
}


/* =====================================================
   CANCEL LEAVE
===================================================== */

function cancelLeaving() {

    if (leaveModal) {

        leaveModal.classList.remove(
            "show"
        );
    }
}


/* =====================================================
   CONFIRM LEAVE
===================================================== */

function confirmLeaving() {

    /*
        Stop timer.
    */

    clearInterval(
        timerInterval
    );


    timerInterval =
        null;


    /*
        Clear discussion session.
    */

    sessionStorage.removeItem(
        "discussionSetup"
    );


    /*
        Return to home page.
    */

    window.location.href =
        "../index.html";
}


/* =====================================================
   CLOSE MODAL ON BACKDROP CLICK
===================================================== */

function handleModalClick(event) {

    if (
        event.target === leaveModal
    ) {

        cancelLeaving();
    }
}


/* =====================================================
   ESCAPE KEY FOR MODAL
===================================================== */

function handleEscapeKey(event) {

    if (
        event.key === "Escape" &&
        leaveModal &&
        leaveModal.classList.contains("show")
    ) {

        cancelLeaving();
    }
}


/* =====================================================
   INITIALIZE ARENA
===================================================== */
function initializeArena() {

    /* =================================================
       LOAD SAVED THEME
    ================================================= */

    initializeTheme();


    /* =================================================
       LOAD DISCUSSION SETUP
    ================================================= */

    loadArenaData();


    /* =================================================
       DISCUSSION INITIALLY STOPPED
    ================================================= */

    setDiscussionState(
        false
    );


    /* =================================================
       INITIAL TIMER
    ================================================= */

    remainingSeconds =
        0;

    updateTimerDisplay();


    /* =================================================
       START TIMER
    ================================================= */

    if (startTimer) {

        startTimer.addEventListener(
            "click",
            startDiscussion
        );
    }


    /* =================================================
       RESET TIMER
    ================================================= */

    if (resetTimer) {

        resetTimer.addEventListener(
            "click",
            resetDiscussion
        );
    }


    /* =================================================
       SEND MESSAGE
    ================================================= */

    if (sendMessage) {

        sendMessage.addEventListener(
            "click",
            sendUserMessage
        );
    }


    /* =================================================
       MESSAGE INPUT
    ================================================= */

    if (messageInput) {

        messageInput.addEventListener(
            "click",
            () => {

                if (!discussionStarted) {

                    showTimerReminder();
                }
            }
        );


        messageInput.addEventListener(
            "keydown",
            handleMessageKeydown
        );
    }


    /* =================================================
       LEAVE BUTTON
    ================================================= */

    if (leaveArena) {

        leaveArena.addEventListener(
            "click",
            leaveDiscussion
        );
    }


    /* =================================================
       LEAVE MODAL
    ================================================= */

    if (cancelLeave) {

        cancelLeave.addEventListener(
            "click",
            cancelLeaving
        );
    }


    if (confirmLeave) {

        confirmLeave.addEventListener(
            "click",
            confirmLeaving
        );
    }


    if (leaveModal) {

        leaveModal.addEventListener(
            "click",
            handleModalClick
        );
    }


    /* =================================================
       ESCAPE KEY
    ================================================= */

    document.addEventListener(
        "keydown",
        handleEscapeKey
    );
}


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeArena
);