const FREE_TO_GAME_API =
    "https://www.freetogame.com/api/games";


async function loadHomeGames() {

    const gameList =
        document.getElementById("homeGameList");

    if (!gameList) return;


    try {

        const response =
            await fetch(FREE_TO_GAME_API);


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const games =
            await response.json();


        // Chỉ hiển thị 8 game trên trang chủ
        displayHomeGames(
            games.slice(0, 8)
        );


    } catch (error) {

        console.error(
            "Lỗi tải game:",
            error
        );


        gameList.innerHTML = `

            <div class="loading">

                <i
                    class="fa-solid fa-triangle-exclamation"
                ></i>

                <p>
                    Không thể tải dữ liệu game.
                </p>

            </div>

        `;

    }

}



function displayHomeGames(games) {

    const gameList =
        document.getElementById("homeGameList");


    gameList.innerHTML = "";


    games.forEach(game => {

        const card =
            document.createElement("article");


        card.className =
            "game-card";


        card.innerHTML = `

            <img
                src="${game.thumbnail}"
                alt="${game.title}"
                class="game-image"
                loading="lazy"
            >


            <div class="game-info">

                <span class="game-genre">

                    ${game.genre || "Game"}

                </span>


                <h3>
                    ${game.title}
                </h3>


                <p>
                    ${
                        game.short_description ||
                        "Khám phá trò chơi này trên GameHub."
                    }
                </p>


                <div class="game-meta">

                    <span>

                        <i
                            class="fa-solid fa-desktop"
                        ></i>

                        ${game.platform || "PC"}

                    </span>

                </div>


                <a
                    href="${game.game_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="game-button"
                >

                    Xem game

                    <i
                        class="fa-solid fa-arrow-right"
                    ></i>

                </a>

            </div>

        `;


        gameList.appendChild(card);

    });

}



document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadHomeGames();

    }
);
// ==================================================
// GAME SEARCH - GAMEHUB
// ==================================================

const searchInput =
    document.getElementById("gameSearchInput");

const searchButton =
    document.getElementById("gameSearchBtn");

const searchResults =
    document.getElementById("searchResults");


// Danh sách game lấy từ API
let allGames = [];


// ==================================================
// TẢI GAME TỪ API
// ==================================================

async function loadGamesForSearch() {

    try {

        const response = await fetch(
            "https://www.freetogame.com/api/games"
        );


        if (!response.ok) {

            throw new Error(
                "Không thể tải dữ liệu game."
            );

        }


        allGames = await response.json();

        console.log(
            "Đã tải:",
            allGames.length,
            "game"
        );


    } catch (error) {

        console.error(
            "Lỗi API:",
            error
        );

    }

}


// ==================================================
// TÌM GAME
// ==================================================

function searchGames() {

    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    // Nếu không nhập gì
    if (!keyword) {

        searchResults.innerHTML = `
            <p class="search-message">
                🔎 Hãy nhập tên game để tìm kiếm.
            </p>
        `;

        return;

    }


    // Tìm theo tên game
    const results =
        allGames.filter(game =>

            game.title
                .toLowerCase()
                .includes(keyword)

        );


    // Không tìm thấy
    if (results.length === 0) {

        searchResults.innerHTML = `
            <div class="search-empty">

                <i class="fa-solid fa-face-frown"></i>

                <h3>
                    Không tìm thấy game
                </h3>

                <p>
                    Không có game nào phù hợp với
                    "${searchInput.value}"
                </p>

            </div>
        `;

        return;

    }


    // Hiển thị kết quả
    displaySearchResults(results);

}



// ==================================================
// HIỂN THỊ KẾT QUẢ
// ==================================================

function displaySearchResults(games) {

    searchResults.innerHTML = "";


    games.forEach(game => {

        const card =
            document.createElement("div");


        card.className =
            "game-card";


        card.innerHTML = `

            <img
                src="${game.thumbnail}"
                alt="${game.title}"
                loading="lazy"
            >

            <div class="game-card-content">

                <h3>
                    ${game.title}
                </h3>

                <p>
                    ${game.short_description || "Chưa có mô tả."}
                </p>

                <div class="game-info">

                    <span>
                        <i class="fa-solid fa-tag"></i>
                        ${game.genre || "Unknown"}
                    </span>

                    <span>
                        <i class="fa-solid fa-desktop"></i>
                        ${game.platform || "Unknown"}
                    </span>

                </div>

                <a
                    href="${game.game_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="game-btn"
                >
                    Xem game
                </a>

            </div>

        `;


        searchResults.appendChild(card);

    });

}



// ==================================================
// CLICK TÌM KIẾM
// ==================================================

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchGames
    );

}



// ==================================================
// NHẤN ENTER
// ==================================================

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchGames();

            }

        }
    );

}



// ==================================================
// KHỞI ĐỘNG
// ==================================================

loadGamesForSearch();
// ==================================================
// KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
// ==================================================

function updateAuthUI() {

    const authArea =
        document.getElementById("authArea");

    if (!authArea) {
        return;
    }


    // Lấy tài khoản hiện tại
    const currentUser =
        localStorage.getItem("gamehub_currentUser");


    // ==========================================
    // CHƯA ĐĂNG NHẬP
    // ==========================================

    if (!currentUser) {

        authArea.innerHTML = `

            <a
                href="login.html"
                class="login-btn"
            >

                <i class="fa-solid fa-right-to-bracket"></i>

                Đăng nhập

            </a>

        `;

        return;
    }


    // ==========================================
    // ĐÃ ĐĂNG NHẬP
    // ==========================================

    const user =
        JSON.parse(currentUser);


    authArea.innerHTML = `

        <div class="user-menu">

            <button
                class="user-button"
                id="userButton"
                type="button"
            >

                <i class="fa-solid fa-user"></i>

                <span>
                    ${user.name}
                </span>

                <i class="fa-solid fa-chevron-down"></i>

            </button>


            <div
                class="user-dropdown"
                id="userDropdown"
            >

                <a href="profile.html">

                    <i class="fa-solid fa-user"></i>

                    Tài khoản

                </a>


                <button
                    type="button"
                    id="logoutButton"
                >

                    <i class="fa-solid fa-right-from-bracket"></i>

                    Đăng xuất

                </button>

            </div>

        </div>

    `;


    // ==========================================
    // MỞ MENU TÀI KHOẢN
    // ==========================================

    const userButton =
        document.getElementById("userButton");

    const userDropdown =
        document.getElementById("userDropdown");


    userButton.addEventListener(
        "click",
        function() {

            userDropdown.classList.toggle(
                "show"
            );

        }
    );


    // ==========================================
    // ĐĂNG XUẤT
    // ==========================================

    const logoutButton =
        document.getElementById("logoutButton");


    logoutButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "gamehub_currentUser"
            );


            window.location.href =
                "index.html";

        }
    );

}


// Chạy khi trang tải
document.addEventListener(
    "DOMContentLoaded",
    updateAuthUI
);