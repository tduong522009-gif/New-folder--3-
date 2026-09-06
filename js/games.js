// =====================================================
// GAMEHUB - GAMES.JS
// =====================================================


// ================= DOM =================

const gameList = document.getElementById("gameList");
const gameSearch = document.getElementById("gameSearch");
const searchBtn = document.getElementById("searchBtn");

let games = [];


// ================= LOCAL STORAGE =================

function getCustomGames() {

    return JSON.parse(
        localStorage.getItem("customGames")
    ) || [];

}


function getFavorites() {

    return JSON.parse(
        localStorage.getItem("favoriteGames")
    ) || [];

}


function saveFavorites(favorites) {

    localStorage.setItem(
        "favoriteGames",
        JSON.stringify(favorites)
    );

}


// ================= CATEGORY =================

// Đọc category từ URL
// Ví dụ:
// games.html?category=mmorpg
// games.html?category=shooter

const urlParams =
    new URLSearchParams(window.location.search);

let currentCategory =
    urlParams.get("category") || "all";


// ================= CHUẨN HÓA CATEGORY =================

function normalizeCategory(category) {

    return String(category || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "");

}


// ================= API =================

async function loadGames() {

    gameList.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Đang tải dữ liệu game...
        </div>
    `;


    try {

        /*
         * Lấy dữ liệu từ FreeToGame API
         */

        const response = await fetch(
            "https://www.freetogame.com/api/games"
        );


        if (!response.ok) {

            throw new Error(
                "Không thể kết nối API"
            );

        }


        const apiGames =
            await response.json();


        // Chuyển dữ liệu API
        games = apiGames.map(game => ({

            id: "api-" + game.id,

            title: game.title,

            category:
                normalizeCategory(game.genre),

            image:
                game.thumbnail,

            rating: 4.5,

            description:
                game.short_description ||
                "Game miễn phí hấp dẫn."

        }));


        // ================= GAME ADMIN =================

        const customGames =
            getCustomGames();


        games = [
            ...customGames,
            ...games
        ];


        // ================= HIỂN THỊ =================

        applyCategory();


    }

    catch (error) {

        console.error(
            "Lỗi API:",
            error
        );


        // API lỗi -> vẫn lấy game Admin

        const customGames =
            getCustomGames();


        if (customGames.length > 0) {

            games = customGames;

            applyCategory();

        }

        else {

            gameList.innerHTML = `

                <div class="loading">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    Không thể tải dữ liệu game.

                    <br><br>

                    Vui lòng kiểm tra kết nối Internet.

                </div>

            `;

        }

    }

}


// ================= LỌC CATEGORY =================

function applyCategory() {

    // Nếu là tất cả
    if (currentCategory === "all") {

        displayGames(games);

        updateActiveCategory();

        return;

    }


    const selectedCategory =
        normalizeCategory(currentCategory);


    /*
     * Dùng === thay vì includes()
     *
     * Ví dụ:
     * mmorpg === mmorpg  -> đúng
     * shooter === shooter -> đúng
     * strategy === strategy -> đúng
     *
     * Không lấy những category gần giống.
     */

    const result =
        games.filter(game => {

            return normalizeCategory(
                game.category
            ) === selectedCategory;

        });


    displayGames(result);

    updateActiveCategory();

}


// ================= HIỂN THỊ GAME =================

function displayGames(data) {

    if (!data.length) {

        gameList.innerHTML = `

            <div class="loading">

                <i class="fa-solid fa-face-frown"></i>

                <h3>
                    Không tìm thấy game
                </h3>

                <p>
                    Không có game thuộc thể loại này.
                </p>

            </div>

        `;

        return;

    }


    const favorites =
        getFavorites();


    gameList.innerHTML =
        data.map(game => {

            const isFavorite =
                favorites.includes(
                    String(game.id)
                );


            return `

                <article class="game-card">

                    <img
                        src="${game.image}"
                        alt="${escapeHTML(game.title)}"
                        class="game-image"
                        loading="lazy"
                        onerror="
                            this.src='https://placehold.co/600x400/121425/ffffff?text=Game'
                        "
                    >


                    <button
                        class="favorite-btn"
                        data-id="${game.id}"
                        title="Yêu thích"
                    >

                        <i class="${
                            isFavorite
                                ? "fa-solid"
                                : "fa-regular"
                        } fa-heart"></i>

                    </button>


                    <div class="game-info">

                        <h3>
                            ${escapeHTML(game.title)}
                        </h3>


                        <p>
                            ${escapeHTML(
                                game.description ||
                                "Game hấp dẫn"
                            )}
                        </p>


                        <div class="game-category">

                            <i class="fa-solid fa-tag"></i>

                            ${escapeHTML(
                                game.category ||
                                "Game"
                            )}

                        </div>


                        <div class="rating">

                            <i class="fa-solid fa-star"></i>

                            ${game.rating || "4.5"}

                            / 5

                        </div>

                    </div>

                </article>

            `;

        }).join("");


    // ================= FAVORITE BUTTON =================

    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    toggleFavorite(
                        button.dataset.id
                    );

                }
            );

        });

}


// ================= FAVORITE =================

function toggleFavorite(id) {

    let favorites =
        getFavorites();


    id = String(id);


    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                item => item !== id
            );

    }

    else {

        favorites.push(id);

    }


    saveFavorites(favorites);


    // Hiển thị lại đúng category hiện tại
    applyCategory();

}


// ================= SEARCH =================

function searchGames() {

    const keyword =
        gameSearch.value
            .trim()
            .toLowerCase();


    /*
     * Nếu không nhập gì:
     * quay lại category hiện tại
     */

    if (!keyword) {

        applyCategory();

        return;

    }


    /*
     * Bước 1:
     * Lọc theo category trước
     */

    let categoryGames;


    if (currentCategory === "all") {

        categoryGames =
            games;

    }

    else {

        const selectedCategory =
            normalizeCategory(
                currentCategory
            );


        categoryGames =
            games.filter(game => {

                return normalizeCategory(
                    game.category
                ) === selectedCategory;

            });

    }


    /*
     * Bước 2:
     * Tìm tên game trong category đó
     */

    const result =
        categoryGames.filter(game => {

            return game.title
                .toLowerCase()
                .includes(keyword);

        });


    displayGames(result);

}


// ================= SEARCH BUTTON =================

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchGames
    );

}


// ================= ENTER SEARCH =================

if (gameSearch) {

    gameSearch.addEventListener(
        "keyup",
        event => {

            if (event.key === "Enter") {

                searchGames();

            }

        }
    );

}


// ================= CATEGORY BUTTON =================

document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;


                /*
                 * Lưu category đang chọn
                 */

                currentCategory =
                    category;


                /*
                 * Đổi nút active
                 */

                document
                    .querySelectorAll(
                        ".category-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active-category"
                        );

                    });


                button.classList.add(
                    "active-category"
                );


                /*
                 * Cập nhật URL
                 */

                if (category === "all") {

                    history.pushState(
                        {},
                        "",
                        "games.html"
                    );

                }

                else {

                    history.pushState(
                        {},
                        "",
                        `games.html?category=${category}`
                    );

                }


                /*
                 * Xóa ô tìm kiếm
                 */

                if (gameSearch) {

                    gameSearch.value = "";

                }


                /*
                 * Hiển thị category
                 */

                applyCategory();

            }
        );

    });


// ================= ACTIVE CATEGORY =================

function updateActiveCategory() {

    document
        .querySelectorAll(".category-btn")
        .forEach(button => {

            const buttonCategory =
                button.dataset.category;


            if (
                buttonCategory ===
                currentCategory
            ) {

                button.classList.add(
                    "active-category"
                );

            }

            else {

                button.classList.remove(
                    "active-category"
                );

            }

        });

}


// ================= HTML SECURITY =================

function escapeHTML(text) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ================= MOBILE MENU =================

const menuBtn =
    document.getElementById("menuBtn");

const mainNav =
    document.getElementById("mainNav");


if (menuBtn && mainNav) {

    menuBtn.addEventListener(
        "click",
        () => {

            mainNav.classList.toggle(
                "show"
            );

        }
    );

}


// ================= START =================

loadGames();