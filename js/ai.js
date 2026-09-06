// ==================================================
// GAMEHUB AI ASSISTANT
// ==================================================

const aiToggle =
    document.getElementById("aiToggle");

const aiBox =
    document.getElementById("aiBox");

const aiClose =
    document.getElementById("aiClose");

const aiInput =
    document.getElementById("aiInput");

const aiSend =
    document.getElementById("aiSend");

const aiMessages =
    document.getElementById("aiMessages");


// ==================================================
// MỞ / ĐÓNG AI
// ==================================================

if (aiToggle) {

    aiToggle.addEventListener(
        "click",
        () => {

            aiBox.classList.toggle("show");

            if (aiBox.classList.contains("show")) {

                aiInput.focus();

            }

        }
    );

}


if (aiClose) {

    aiClose.addEventListener(
        "click",
        () => {

            aiBox.classList.remove("show");

        }
    );

}



// ==================================================
// GỬI CÂU HỎI
// ==================================================

function sendAIMessage() {

    const question =
        aiInput.value.trim();


    if (!question) {
        return;
    }


    // Hiển thị câu hỏi
    addMessage(
        question,
        "user"
    );


    aiInput.value = "";


    // Hiển thị đang suy nghĩ
    const thinking =
        addMessage(
            "🤖 Đang tìm game phù hợp...",
            "bot"
        );


    setTimeout(
        () => {

            thinking.remove();


            const answer =
                generateAIAnswer(question);


            addMessage(
                answer,
                "bot"
            );

        },
        600
    );

}



// ==================================================
// ENTER ĐỂ GỬI
// ==================================================

if (aiInput) {

    aiInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                sendAIMessage();

            }

        }
    );

}


if (aiSend) {

    aiSend.addEventListener(
        "click",
        sendAIMessage
    );

}



// ==================================================
// HIỂN THỊ MESSAGE
// ==================================================

function addMessage(
    text,
    type
) {

    const message =
        document.createElement("div");


    message.className =
        `ai-message ${type}`;


    message.textContent =
        text;


    aiMessages.appendChild(
        message
    );


    aiMessages.scrollTop =
        aiMessages.scrollHeight;


    return message;

}



// ==================================================
// AI GỢI Ý
// ==================================================

function generateAIAnswer(question) {

    const text =
        question.toLowerCase();


    // BẮN SÚNG

    if (
        text.includes("bắn súng") ||
        text.includes("shooter")
    ) {

        return `
🎯 Nếu bạn thích game bắn súng,
GameHub gợi ý bạn tìm các game thuộc
thể loại Shooter.

Bạn có thể vào Games → Bắn súng
để xem danh sách game.
        `;

    }



    // MMORPG

    if (
        text.includes("mmorpg") ||
        text.includes("nhập vai")
    ) {

        return `
🐉 Nếu bạn thích MMORPG,
hãy thử tìm các game có thể loại MMORPG.

Bạn có thể vào Games → MMORPG
để khám phá danh sách.
        `;

    }



    // CHIẾN THUẬT

    if (
        text.includes("chiến thuật") ||
        text.includes("strategy")
    ) {

        return `
♟️ Nếu bạn thích suy nghĩ và lập kế hoạch,
hãy thử các game Strategy.

GameHub có thể giúp bạn lọc
các game chiến thuật.
        `;

    }



    // ĐUA XE

    if (
        text.includes("đua xe") ||
        text.includes("racing")
    ) {

        return `
🏎️ Nếu bạn thích tốc độ,
hãy khám phá thể loại Racing.

Bạn có thể vào Games → Đua xe.
        `;

    }



    // GAME MIỄN PHÍ

    if (
        text.includes("miễn phí") ||
        text.includes("free")
    ) {

        return `
🎮 GameHub sử dụng dữ liệu từ
FreeToGame để khám phá các game
free-to-play.

Bạn có thể vào Games để xem danh sách.
        `;

    }



    // GAME MÁY YẾU

    if (
        text.includes("máy yếu") ||
        text.includes("pc yếu")
    ) {

        return `
💻 Nếu máy bạn không mạnh,
hãy ưu tiên tìm những game có
cấu hình yêu cầu thấp.

Bạn có thể xem thông tin nền tảng
và yêu cầu của từng game trong
trang Games.
        `;

    }



    // CÂU HỎI CHUNG

    return `
🤖 Mình có thể giúp bạn tìm game.

Bạn hãy thử hỏi:

• Gợi ý game bắn súng
• Game MMORPG nào hay?
• Tôi thích game chiến thuật
• Có game đua xe không?
• Gợi ý game cho máy yếu
    `;

}