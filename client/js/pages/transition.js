/* =====================================================
   CONVOSPACE — TRANSITION PAGE
===================================================== */


function applySavedTheme() {

    const savedTheme = localStorage.getItem("convospace-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
    }
}

applySavedTheme();


/* =====================================================
   INITIALIZE TRANSITION PAGE
===================================================== */

function initializeTransitionPage() {

    /* ---------------------------------------------
       GET ELEMENTS
    --------------------------------------------- */

    const playerCount =
        document.getElementById("playerCount");

    const topicName =
        document.getElementById("topicName");

    const transitionStatus =
        document.getElementById("transitionStatus");


    /* ---------------------------------------------
       GET DISCUSSION SETUP
    --------------------------------------------- */

    const savedSetup =
        sessionStorage.getItem(
            "discussionSetup"
        );


    /* ---------------------------------------------
       NO DATA FOUND
    --------------------------------------------- */

    if (!savedSetup) {

        console.error(
            "No discussion setup found."
        );

        if (transitionStatus) {

            transitionStatus.textContent =
                "Unable to load discussion setup.";

        }

        return;
    }


    /* ---------------------------------------------
       PARSE SAVED DATA
    --------------------------------------------- */

    let discussionSetup;

    try {

        discussionSetup =
            JSON.parse(savedSetup);

    } catch (error) {

        console.error(
            "Invalid discussion setup:",
            error
        );

        if (transitionStatus) {

            transitionStatus.textContent =
                "Unable to load discussion setup.";

        }

        return;
    }


    /* ---------------------------------------------
       PLAYERS
    --------------------------------------------- */

    if (playerCount) {

        playerCount.textContent =
            discussionSetup.participants ?? "—";

    }


    /* ---------------------------------------------
       TOPIC
    --------------------------------------------- */

    if (topicName) {

        topicName.textContent =
            discussionSetup.topic || "—";

    }


    /* ---------------------------------------------
       INITIAL STATUS
    --------------------------------------------- */

    if (transitionStatus) {

        transitionStatus.textContent =
            "Setting the room...";

    }


    /* =================================================
       TRANSITION STATUS MESSAGES
    ================================================= */

    const statusMessages = [

        "Setting the room...",

        "Gathering your players...",

        "Preparing perspectives...",

        "Almost ready..."

    ];


    let messageIndex = 0;


    const statusInterval =
        setInterval(() => {

            messageIndex++;


            if (
                messageIndex <
                statusMessages.length
            ) {

                transitionStatus.textContent =
                    statusMessages[messageIndex];

            }

        }, 700);


    /* =================================================
       ENTER ARENA
    ================================================= */

    setTimeout(() => {

        clearInterval(
            statusInterval
        );


        if (transitionStatus) {

            transitionStatus.textContent =
                "Entering the discussion...";

        }


        /* ---------------------------------------------
           Small delay before navigation
        --------------------------------------------- */

        setTimeout(() => {

            window.location.href =
                "arena.html";

        }, 350);


    }, 3000);


    /* ---------------------------------------------
       DEBUG
    --------------------------------------------- */

    console.log(
        "Discussion setup loaded:",
        discussionSetup
    );

}


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeTransitionPage
);