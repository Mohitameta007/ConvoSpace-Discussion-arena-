

/* =====================================================
   ARENA PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =================================
       GET DISCUSSION SETUP
    ================================= */

    const savedSetup =
        sessionStorage.getItem("discussionSetup");


    if (!savedSetup) {

        window.location.href =
            "discussion.html";

        return;

    }


    const setup =
        JSON.parse(savedSetup);


    /* =================================
       GET ELEMENTS
    ================================= */

    const arenaTopic =
        document.getElementById("arenaTopic");

    const conversationTopic =
        document.getElementById("conversationTopic");

    const arenaPlayerCount =
        document.getElementById("arenaPlayerCount");

    const participantsList =
        document.getElementById("participantsList");

    const messagesContainer =
        document.getElementById("messagesContainer");

    const messageInput =
        document.getElementById("messageInput");

    const sendMessage =
        document.getElementById("sendMessage");

    const leaveArena =
        document.getElementById("leaveArena");

    const yourRole =
        document.getElementById("yourRole");


    /* =================================
       TOPIC
    ================================= */

    const topic =
        setup.topic || "Open Discussion";


    arenaTopic.textContent =
        topic;


    conversationTopic.textContent =
        topic;


    /* =================================
       PLAYERS
    ================================= */

    const totalPlayers =
        Number(setup.participants) || 1;


    arenaPlayerCount.textContent =
        totalPlayers;


    /* =================================
       CREATE PARTICIPANTS
    ================================= */

    renderParticipants(
        totalPlayers,
        setup
    );


    /* =================================
       USER ROLE
    ================================= */

    if (
        setup.roleMode === "custom" &&
        setup.roles &&
        setup.roles.length > 0
    ) {

        yourRole.textContent =
            "Participant";

    }


    /* =================================
       SEND MESSAGE
    ================================= */

    sendMessage.addEventListener(
        "click",
        handleSendMessage
    );


    messageInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                handleSendMessage();

            }

        }
    );


    /* =================================
       LEAVE ARENA
    ================================= */

    leaveArena.addEventListener(
        "click",
        () => {

            const confirmLeave =
                confirm(
                    "Leave this discussion?"
                );


            if (confirmLeave) {

                sessionStorage.removeItem(
                    "discussionSetup"
                );

                window.location.href =
                    "discussion.html";

            }

        }
    );


    /* =================================
       SEND MESSAGE FUNCTION
    ================================= */

    function handleSendMessage() {

        const text =
            messageInput.value.trim();


        if (!text) {
            return;
        }


        /* Remove welcome message */

        const welcome =
            messagesContainer.querySelector(
                ".welcome-message"
            );


        if (welcome) {
            welcome.remove();
        }


        addMessage(
            "You",
            text,
            true
        );


        messageInput.value = "";


        /*
            AI/backend response
            will be connected later.
        */

    }


    /* =================================
       ADD MESSAGE
    ================================= */

    function addMessage(
        name,
        text,
        isUser = false
    ) {

        const message =
            document.createElement("div");


        message.className =
            "chat-message";


        if (isUser) {

            message.classList.add(
                "user"
            );

        }


        message.innerHTML = `

            <div class="message-avatar">
                ${name.charAt(0)}
            </div>

            <div class="message-content">

                <span class="message-name">
                    ${name}
                </span>

                <div class="message-text">
                    ${escapeHTML(text)}
                </div>

            </div>

        `;


        messagesContainer.appendChild(
            message
        );


        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;

    }


    /* =================================
       PARTICIPANTS
    ================================= */

    function renderParticipants(
        count,
        setup
    ) {

        participantsList.innerHTML = "";


        /*
            First participant = You
        */

        createParticipant(
            "You",
            "Participant",
            true
        );


        /*
            Remaining participants
            are AI for now.
        */

        for (
            let i = 1;
            i < count;
            i++
        ) {

            let role =
                "Perspective";

            if (
                setup.roles &&
                setup.roles[i - 1]
            ) {

                role =
                    setup.roles[i - 1];

            }


            createParticipant(
                `Player ${i + 1}`,
                role,
                false
            );

        }

    }


    /* =================================
       CREATE PARTICIPANT
    ================================= */

    function createParticipant(
        name,
        role,
        isUser
    ) {

        const element =
            document.createElement("div");


        element.className =
            "participant";


        element.innerHTML = `

            <div class="participant-avatar">
                ${name.charAt(0)}
            </div>

            <div class="participant-info">

                <span class="participant-name">
                    ${name}
                </span>

                <span class="participant-role">
                    ${role}
                </span>

            </div>

        `;


        participantsList.appendChild(
            element
        );

    }


    /* =================================
       ESCAPE HTML
    ================================= */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }

});