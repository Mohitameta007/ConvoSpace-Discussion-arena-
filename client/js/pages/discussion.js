/* =====================================================
   CONVOSPACE — DISCUSSION SETUP
===================================================== */

import { TOPIC_POOL } from "../data/topics.js";


/* =====================================================
   DISCUSSION STATE
===================================================== */

const discussionState = {

    participants: 3,

    topic: "",

    topicCategory: "GENERAL",

    roleMode: "default",

    roles: []

};


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

        initializeDiscussionPage();

    }
);

/* =====================================================
   THEME TOGGLE
===================================================== */

function initializeTheme() {

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );

    const themeIcon =
        document.getElementById(
            "themeIcon"
        );


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


    /*
        Load saved theme
    */

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


    /*
        Theme button
    */

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
   PARTICIPANTS
===================================================== */

function initializeParticipants() {

    const participantOptions =
        document.querySelectorAll(
            ".participant-option"
        );


    const summaryPlayers =
        document.getElementById(
            "summaryPlayers"
        );


    participantOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    /*
                        Remove previous selection
                    */

                    participantOptions.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /*
                        Select current option
                    */

                    option.classList.add(
                        "active"
                    );


                    /*
                        Save participant count
                    */

                    discussionState.participants =
                        Number(
                            option.dataset.participants
                        );


                    /*
                        Update summary
                    */

                    if (summaryPlayers) {

                        summaryPlayers.textContent =
                            discussionState.participants;

                    }


                    /*
                        Update roles according
                        to number of participants.
                    */

                    updateRolesForParticipants();

                }
            );

        }
    );

}


/* =====================================================
   TOPIC ELEMENTS
===================================================== */

function getTopicElements() {

    return document.querySelectorAll(
        ".topic-option, .topic-choice"
    );

}


/* =====================================================
   GET RANDOM TOPICS
===================================================== */

function getRandomTopics(
    count = 3,
    excludedTopics = []
) {

    /*
        Convert excluded topics into Set
        for faster lookup.
    */

    const excluded =
        new Set(
            excludedTopics
        );


    /*
        Don't immediately show the same
        topics after refresh.
    */

    let availableTopics =
        TOPIC_POOL.filter(
            topic =>
                !excluded.has(
                    topic.text
                )
        );


    /*
        Safety fallback
    */

    if (
        availableTopics.length < count
    ) {

        availableTopics =
            [...TOPIC_POOL];

    }


    /*
        Fisher-Yates shuffle
    */

    for (
        let i =
            availableTopics.length - 1;

        i > 0;

        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            availableTopics[i],
            availableTopics[randomIndex]
        ] =
        [
            availableTopics[randomIndex],
            availableTopics[i]
        ];

    }


    return availableTopics.slice(
        0,
        count
    );

}


/* =====================================================
   RENDER TOPICS
===================================================== */

function renderTopics() {

    const topicChoices =
        getTopicElements();


    if (!topicChoices.length) {

        console.warn(
            "ConvoSpace: No topic elements found."
        );

        return;

    }


    /*
        Get currently visible topics.
    */

    const currentVisibleTopics =
        Array
            .from(topicChoices)
            .map(
                choice =>
                    choice.dataset.topic
            )
            .filter(Boolean);


    /*
        Generate fresh topics.
    */

    const topics =
        getRandomTopics(
            topicChoices.length,
            currentVisibleTopics
        );


    /*
        Remove previous active state.
    */

    topicChoices.forEach(
        choice => {

            choice.classList.remove(
                "active"
            );

        }
    );


    /*
        Render new topics.
    */

    topicChoices.forEach(
        (choice, index) => {

            const topic =
                topics[index];


            if (!topic) {
                return;
            }


            const textElement =
                choice.querySelector(
                    ".topic-text"
                );


            const categoryElement =
                choice.querySelector(
                    ".topic-category"
                ) ||
                choice.querySelector(
                    "small"
                );


            /*
                Topic text
            */

            if (textElement) {

                textElement.textContent =
                    topic.text;

            }


            /*
                Topic category
            */

            if (categoryElement) {

                categoryElement.textContent =
                    topic.category;

            }


            /*
                Save topic information
                in HTML dataset.
            */

            choice.dataset.topic =
                topic.text;


            choice.dataset.category =
                topic.category;

        }
    );


    /*
        Automatically select first topic.
    */

    const firstTopic =
        topicChoices[0];


    if (firstTopic) {

        firstTopic.classList.add(
            "active"
        );


        discussionState.topic =
            firstTopic.dataset.topic;


        discussionState.topicCategory =
            firstTopic.dataset.category ||
            "GENERAL";

    }


    /*
        Update current topic UI.
    */

    updateTopicUI();

}


/* =====================================================
   TOPIC SELECTION
===================================================== */

function initializeTopicSelection() {

    const topicChoices =
        getTopicElements();


    if (!topicChoices.length) {
        return;
    }


    topicChoices.forEach(
        choice => {

            choice.addEventListener(
                "click",
                () => {

                    /*
                        Remove previous active state.
                    */

                    topicChoices.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /*
                        Activate selected topic.
                    */

                    choice.classList.add(
                        "active"
                    );


                    /*
                        Save selected topic.
                    */

                    discussionState.topic =
                        choice.dataset.topic;


                    discussionState.topicCategory =
                        choice.dataset.category ||
                        "GENERAL";


                    /*
                        Update UI.
                    */

                    updateTopicUI();


                    /*
                        Close manual topic area.
                    */

                    closeManualTopic();

                }
            );

        }
    );

}


/* =====================================================
   UPDATE TOPIC UI
===================================================== */

function updateTopicUI() {

    const selectedTopic =
        document.getElementById(
            "selectedTopic"
        );


    const currentTopic =
        document.querySelector(
            ".current-topic strong"
        );


    const summaryTopic =
        document.getElementById(
            "summaryTopic"
        );


    const topicIndicator =
        document.getElementById(
            "topicIndicator"
        );


    /*
        Main selected topic
    */

    if (selectedTopic) {

        selectedTopic.textContent =
            discussionState.topic;

    }


    /*
        Current topic
    */

    if (currentTopic) {

        currentTopic.textContent =
            discussionState.topic;

    }


    /*
        Summary
    */

    if (summaryTopic) {

        summaryTopic.textContent =
            getShortTopic(
                discussionState.topic
            );

    }


    /*
        Selected / custom indicator
    */

    if (topicIndicator) {

        topicIndicator.textContent =
            discussionState.topicCategory ===
            "CUSTOM"

                ? "CUSTOM"

                : "SELECTED";

    }

}


/* =====================================================
   REFRESH TOPICS
===================================================== */

function initializeTopicRefresh() {

    const refreshButton =
        document.getElementById(
            "refreshTopics"
        );


    if (!refreshButton) {
        return;
    }


    refreshButton.addEventListener(
        "click",
        () => {

            /*
                Refresh animation
            */

            refreshButton.classList.add(
                "refreshing"
            );


            /*
                Generate new topics.
            */

            renderTopics();


            /*
                Close manual topic.
            */

            closeManualTopic();


            /*
                Remove animation class.
            */

            setTimeout(
                () => {

                    refreshButton.classList.remove(
                        "refreshing"
                    );

                },
                400
            );

        }
    );

}


/* =====================================================
   MANUAL TOPIC
===================================================== */

function initializeManualTopic() {

    const manualTopicButton =
        document.getElementById(
            "manualTopicButton"
        );


    const manualTopicArea =
        document.getElementById(
            "manualTopicArea"
        );


    const manualTopic =
        document.getElementById(
            "manualTopic"
        );


    const applyTopic =
        document.getElementById(
            "applyTopic"
        );


    /*
        Open / close manual topic
    */

    if (manualTopicButton) {

        manualTopicButton.addEventListener(
            "click",
            () => {

                manualTopicArea?.classList.toggle(
                    "open"
                );


                manualTopicButton.classList.toggle(
                    "active"
                );


                /*
                    Focus textarea after opening.
                */

                if (
                    manualTopicArea?.classList.contains(
                        "open"
                    )
                ) {

                    setTimeout(
                        () => {

                            manualTopic?.focus();

                        },
                        250
                    );

                }

            }
        );

    }


    /*
        Apply custom topic
    */

    if (applyTopic) {

        applyTopic.addEventListener(
            "click",
            () => {

                const value =
                    manualTopic?.value.trim();


                /*
                    Don't allow empty topic.
                */

                if (!value) {

                    manualTopic?.focus();

                    return;

                }


                /*
                    Remove active state
                    from preset topics.
                */

                getTopicElements().forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                    Save custom topic.
                */

                discussionState.topic =
                    value;


                discussionState.topicCategory =
                    "CUSTOM";


                /*
                    Update UI.
                */

                updateTopicUI();


                /*
                    Close manual topic.
                */

                closeManualTopic();

            }
        );

    }

}


/* =====================================================
   CLOSE MANUAL TOPIC
===================================================== */

function closeManualTopic() {

    const manualTopicArea =
        document.getElementById(
            "manualTopicArea"
        );


    const manualTopicButton =
        document.getElementById(
            "manualTopicButton"
        );


    manualTopicArea?.classList.remove(
        "open"
    );


    manualTopicButton?.classList.remove(
        "active"
    );

}


/* =====================================================
   SHORT TOPIC
===================================================== */

function getShortTopic(topic) {

    if (!topic) {

        return "";

    }


    const cleanTopic =
        topic
            .replace(
                /[?!.,]/g,
                ""
            )
            .trim();


    const words =
        cleanTopic
            .split(/\s+/)
            .slice(
                0,
                4
            )
            .join(" ");


    if (words.length > 20) {

        return (
            words.substring(
                0,
                20
            ) +
            "…"
        ).toUpperCase();

    }


    return words.toUpperCase();

}


/* =====================================================
   ROLE MODE
===================================================== */

function initializeRoleMode() {

    const roleModeButtons =
        document.querySelectorAll(
            ".role-mode-button"
        );


    const defaultRoles =
        document.getElementById(
            "defaultRoles"
        );


    const customRoles =
        document.getElementById(
            "customRoles"
        );


    const roleIndicator =
        document.getElementById(
            "roleIndicator"
        );


    roleModeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    /*
                        Remove previous active state.
                    */

                    roleModeButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    /*
                        Activate current mode.
                    */

                    button.classList.add(
                        "active"
                    );


                    /*
                        Save mode.
                    */

                    discussionState.roleMode =
                        button.dataset.mode;


                    /* =================================
                       DEFAULT ROLES
                    ================================== */

                    if (
                        discussionState.roleMode ===
                        "default"
                    ) {

                        if (defaultRoles) {

                            defaultRoles.style.display =
                                "flex";

                        }


                        customRoles?.classList.remove(
                            "open"
                        );


                        if (roleIndicator) {

                            roleIndicator.textContent =
                                "DEFAULT";

                        }


                        /*
                            Automatically assign
                            default roles according
                            to participant count.
                        */

                        discussionState.roles =
                            getDefaultRoles();


                        updateRoleSummary();

                    }


                    /* =================================
                       CHOOSE ROLES
                    ================================== */

                    else {

                        if (defaultRoles) {

                            defaultRoles.style.display =
                                "none";

                        }


                        customRoles?.classList.add(
                            "open"
                        );


                        if (roleIndicator) {

                            roleIndicator.textContent =
                                "CHOOSE";

                        }


                        updateRoleSelectors();

                    }

                }
            );

        }
    );

}


/* =====================================================
   DEFAULT ROLES
===================================================== */

function getDefaultRoles() {

    const aiCount =
        discussionState.participants - 1;


    const defaultRoles = [

        "Optimist",

        "Challenger",

        "Analyst"

    ];


    return defaultRoles.slice(
        0,
        aiCount
    );

}


/* =====================================================
   GET ROLE SELECTORS
===================================================== */

function getRoleSelectors() {

    return document.querySelectorAll(
        ".role-select"
    );

}


/* =====================================================
   UPDATE ROLE SELECTOR VISIBILITY
===================================================== */

function updateRoleSelectors() {

    const selectors =
        getRoleSelectors();


    const aiCount =
        discussionState.participants - 1;


    selectors.forEach(
        (select, index) => {

            const roleContainer =
                select.closest(
                    ".role-selector"
                );


            if (!roleContainer) {

                return;

            }


            /*
                2P → 1 AI
                3P → 2 AI
                4P → 3 AI
            */

            if (index < aiCount) {

                roleContainer.style.display =
                    "flex";

            }

            else {

                roleContainer.style.display =
                    "none";

                select.value = "";

                discussionState.roles[index] =
                    "";

            }

        }
    );


    updateRoleAvailability();

}


/* =====================================================
   PREVENT DUPLICATE ROLES
===================================================== */

function updateRoleAvailability() {

    const selectors =
        getRoleSelectors();


    /*
        Get all selected roles.
    */

    const selectedRoles =
        Array
            .from(selectors)
            .map(
                select =>
                    select.value
            )
            .filter(Boolean);


    selectors.forEach(
        currentSelect => {

            const currentValue =
                currentSelect.value;


            Array
                .from(
                    currentSelect.options
                )
                .forEach(
                    option => {

                        /*
                            Ignore placeholder.
                        */

                        if (!option.value) {

                            return;

                        }


                        /*
                            Disable role if another
                            selector already uses it.
                        */

                        const usedElsewhere =
                            selectedRoles.includes(
                                option.value
                            ) &&
                            option.value !==
                                currentValue;


                        option.disabled =
                            usedElsewhere;

                    }
                );

        }
    );

}


/* =====================================================
   ROLE SELECT LISTENERS
===================================================== */

function initializeRoleSelectors() {

    const selectors =
        getRoleSelectors();


    selectors.forEach(
        select => {

            select.addEventListener(
                "change",
                () => {

                    const index =
                        Number(
                            select.dataset.roleIndex
                        );


                    /*
                        Save selected role.
                    */

                    discussionState.roles[index] =
                        select.value;


                    /*
                        Prevent duplicate roles.
                    */

                    updateRoleAvailability();


                    /*
                        Update summary.
                    */

                    updateRoleSummary();

                }
            );

        }
    );


    /*
        Initial visibility.
    */

    updateRoleSelectors();

}

/* =====================================================
   UPDATE DEFAULT ROLE VISIBILITY
===================================================== */

function updateDefaultRoles() {

    const roleItems =
        document.querySelectorAll(
            "#defaultRoles .role-item"
        );

    const aiCount =
        discussionState.participants - 1;


    roleItems.forEach(
        (role, index) => {

            if (index < aiCount) {

                role.style.display =
                    "flex";

            } else {

                role.style.display =
                    "none";

            }

        }
    );

}


/* =====================================================
   UPDATE ROLES WHEN PARTICIPANTS CHANGE
===================================================== */

function updateRolesForParticipants() {

    const aiCount =
        discussionState.participants - 1;


    /* =================================
       DEFAULT MODE
    ================================== */

    if (
    discussionState.roleMode ===
    "default"
) {

    discussionState.roles =
        getDefaultRoles();

    updateDefaultRoles();

    updateRoleSummary();

    return;
}


    /* =================================
       CHOOSE ROLES MODE
    ================================== */

    const selectors =
        getRoleSelectors();


    selectors.forEach(
        (select, index) => {

            const roleContainer =
                select.closest(
                    ".role-selector"
                );


            if (!roleContainer) {

                return;

            }


            if (index < aiCount) {

                roleContainer.style.display =
                    "flex";

            }

            else {

                roleContainer.style.display =
                    "none";

                select.value = "";

                discussionState.roles[index] =
                    "";

            }

        }
    );


    updateRoleAvailability();

    updateRoleSummary();

}


/* =====================================================
   ROLE SUMMARY
===================================================== */

function updateRoleSummary() {

    const summaryRoles =
        document.getElementById(
            "summaryRoles"
        );


    if (!summaryRoles) {
        return;
    }


    /*
        Default mode
    */

    if (
        discussionState.roleMode ===
        "default"
    ) {

        summaryRoles.textContent =
            "DEFAULT";

        return;

    }


    /*
        Choose roles mode
    */

    const selectedRoles =
        discussionState.roles
            .filter(Boolean);


    if (!selectedRoles.length) {

        summaryRoles.textContent =
            "CHOOSE";

        return;

    }


    summaryRoles.textContent =
        `${selectedRoles.length} SELECTED`;

}


/* =====================================================
   INITIAL STATE
===================================================== */

function initializeInitialState() {

    /*
        Participants
    */

    const activeParticipant =
        document.querySelector(
            ".participant-option.active"
        );


    if (activeParticipant) {

        discussionState.participants =
            Number(
                activeParticipant.dataset.participants
            );

    }


    /*
        Role mode
    */

    const activeRoleMode =
        document.querySelector(
            ".role-mode-button.active"
        );


    if (activeRoleMode) {

        discussionState.roleMode =
            activeRoleMode.dataset.mode;

    }


    /*
        Default roles
    */

    discussionState.roles =
        getDefaultRoles();


    /*
        Update UI
    */

    updateRoleSelectors();

updateDefaultRoles();

updateRoleSummary();

updateTopicUI();

}


/* =====================================================
   ENTER ARENA
===================================================== */

/* =====================================================
   INITIALIZE ENTER ARENA
===================================================== */
function initializeEnterArena() {

    const enterArena =
        document.getElementById("enterArena");

    if (!enterArena) {
        return;
    }

    enterArena.addEventListener("click", () => {

        /* =================================
           VALIDATE CUSTOM ROLES
        ================================== */

        if (discussionState.roleMode === "custom") {

            const requiredRoles =
                discussionState.participants - 1;

            const selectedRoles =
                discussionState.roles
                    .slice(0, requiredRoles)
                    .filter(Boolean);

            if (
                selectedRoles.length !==
                requiredRoles
            ) {

                alert(
                    "Please choose a role for every AI participant."
                );

                return;
            }
        }


        /* =================================
           SAVE SETUP
        ================================== */

        sessionStorage.setItem(
            "discussionSetup",
            JSON.stringify({
                participants:
                    discussionState.participants,

                topic:
                    discussionState.topic,

                topicCategory:
                    discussionState.topicCategory,

                roleMode:
                    discussionState.roleMode,

                roles:
                    discussionState.roles
                        .slice(
                            0,
                            discussionState.participants - 1
                        )
            })
        );


        /* =================================
           GO TO TRANSITION
        ================================== */

        window.location.href =
            "transition.html";

    });
}

/* =====================================================
   MAIN PAGE INITIALIZATION
===================================================== */

function initializeDiscussionPage() {

    /*
        Topics
    */

    renderTopics();

    initializeTopicSelection();

    initializeTopicRefresh();


    /*
        Participants
    */

    initializeParticipants();


    /*
        Manual topic
    */

    initializeManualTopic();


    /*
        Roles
    */

    initializeRoleMode();

    initializeRoleSelectors();


    /*
        Enter arena
    */

    initializeEnterArena();


    /*
        Initial state
    */

    initializeInitialState();

}