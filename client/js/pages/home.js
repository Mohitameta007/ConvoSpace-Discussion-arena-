/* =========================================
   CONVOSPACE — HOME / LOBBY
========================================= */


/* =========================================
   THEME
========================================= */

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");


function updateThemeIcon() {

    const isLight =
        document.body.classList.contains(
            "light-theme"
        );

    themeIcon.textContent =
        isLight
            ? "☾"
            : "☼";

    themeToggle.setAttribute(
        "aria-label",
        isLight
            ? "Switch to dark mode"
            : "Switch to light mode"
    );
}


/* Load saved theme */

const savedTheme =
    localStorage.getItem(
        "convospace-theme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );
}


updateThemeIcon();


/* Toggle theme */

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


/* =========================================
   TOPICS
========================================= */

const topics = [

    "Should AI replace traditional education?",

    "Does social media actually connect us?",

    "Should practical skills matter more than grades?",

    "Is remote work really the future?",

    "Does technology make life easier or harder?"

];


let currentTopic = 0;


const topicTitle =
    document.getElementById(
        "topicTitle"
    );


const topicNumber =
    document.querySelector(
        ".topic-number"
    );


const topicDots =
    document.getElementById(
        "topicDots"
    );


const previousTopic =
    document.getElementById(
        "previousTopic"
    );


const nextTopic =
    document.getElementById(
        "nextTopic"
    );


/* Create topic dots */

topics.forEach(
    (_, index) => {

        const dot =
            document.createElement(
                "span"
            );

        dot.classList.add(
            "topic-dot"
        );

        dot.addEventListener(
            "click",
            () => {

                currentTopic = index;

                updateTopic();

            }
        );

        topicDots.appendChild(dot);

    }
);


function updateTopic() {

    topicTitle.style.opacity = "0";

    topicTitle.style.transform =
        "translateY(6px)";


    setTimeout(
        () => {

            topicTitle.textContent =
                topics[currentTopic];

            topicNumber.textContent =
                `${String(currentTopic + 1).padStart(2, "0")} / ${String(topics.length).padStart(2, "0")}`;

            topicTitle.style.opacity = "1";

            topicTitle.style.transform =
                "translateY(0)";

            updateDots();

        },
        150
    );
}


function updateDots() {

    const dots =
        document.querySelectorAll(
            ".topic-dot"
        );

    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentTopic
            );

        }
    );
}


previousTopic.addEventListener(
    "click",
    () => {

        currentTopic--;

        if (currentTopic < 0) {

            currentTopic =
                topics.length - 1;
        }

        updateTopic();

    }
);


nextTopic.addEventListener(
    "click",
    () => {

        currentTopic++;

        if (
            currentTopic >=
            topics.length
        ) {

            currentTopic = 0;
        }

        updateTopic();

    }
);


updateDots();


/* =========================================
   MODALS
========================================= */

const participantsButton =
    document.getElementById(
        "participantsButton"
    );


const rulesButton =
    document.getElementById(
        "rulesButton"
    );


const participantsModal =
    document.getElementById(
        "participantsModal"
    );


const rulesModal =
    document.getElementById(
        "rulesModal"
    );


function openModal(modal) {

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closeModal(modal) {

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}


participantsButton.addEventListener(
    "click",
    () => {

        openModal(
            participantsModal
        );

    }
);


rulesButton.addEventListener(
    "click",
    () => {

        openModal(
            rulesModal
        );

    }
);


/* Close buttons */

document
    .querySelectorAll("[data-close]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const modal =
                        document.getElementById(
                            button.dataset.close
                        );

                    closeModal(modal);

                }
            );

        }
    );


/* Close when clicking outside */

document
    .querySelectorAll(".modal-overlay")
    .forEach(
        overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        overlay
                    ) {

                        closeModal(
                            overlay
                        );

                    }

                }
            );

        }
    );


/* ESC */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            document
                .querySelectorAll(
                    ".modal-overlay.open"
                )
                .forEach(
                    modal => {

                        closeModal(
                            modal
                        );

                    }
                );

        }

    }
);


/* =========================================
   START DISCUSSION
========================================= */

const startButton =
    document.getElementById(
        "startButton"
    );


function startDiscussion() {

    window.location.href =
        "./pages/discussion.html";
}


startButton.addEventListener(
    "click",
    startDiscussion
);


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        const modalOpen =
            document.querySelector(
                ".modal-overlay.open"
            );

        if (modalOpen) {
            return;
        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousTopic.click();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextTopic.click();

        }


        if (
            event.key ===
            "Enter"
        ) {

            startDiscussion();

        }

    }
);