// =====================================================
// GAMEHUB - ADMIN.JS
// CRUD GAME
// =====================================================


// ================= ELEMENTS =================

const gameForm =
    document.getElementById(
        "gameForm"
    );

const gameId =
    document.getElementById(
        "gameId"
    );

const gameTitle =
    document.getElementById(
        "gameTitle"
    );

const gameCategory =
    document.getElementById(
        "gameCategory"
    );

const gameImage =
    document.getElementById(
        "gameImage"
    );

const gameRating =
    document.getElementById(
        "gameRating"
    );

const adminGameList =
    document.getElementById(
        "adminGameList"
    );

const saveGameBtn =
    document.getElementById(
        "saveGameBtn"
    );

const cancelEditBtn =
    document.getElementById(
        "cancelEditBtn"
    );


// ================= STORAGE =================

function getGames() {

    return JSON.parse(
        localStorage.getItem(
            "customGames"
        )
    ) || [];

}


function saveGames(games) {

    localStorage.setItem(
        "customGames",
        JSON.stringify(games)
    );

}


// ================= READ =================

function displayAdminGames() {

    const games =
        getGames();


    updateStatistics(games);


    if (!games.length) {

        adminGameList.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        padding:30px;
                        text-align:center;
                        color:#77798e;
                    "
                >

                    Chưa có game nào.

                </td>

            </tr>

        `;

        return;

    }


    adminGameList.innerHTML =
        games.map(game => `

            <tr
                style="
                    border-top:
                    1px solid
                    rgba(255,255,255,.06);
                "
            >

                <td style="padding:15px;">

                    ${game.id}

                </td>


                <td style="padding:15px;">

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                        "
                    >

                        <img
                            src="${game.image}"
                            alt="${game.title}"
                            style="
                                width:60px;
                                height:40px;
                                object-fit:cover;
                                border-radius:7px;
                            "
                        >

                        <strong>
                            ${escapeHTML(
                                game.title
                            )}
                        </strong>

                    </div>

                </td>


                <td style="padding:15px;">

                    ${escapeHTML(
                        game.category
                    )}

                </td>


                <td style="padding:15px;">

                    <i
                        class="fa-solid fa-star"
                        style="color:#ffd43b;"
                    ></i>

                    ${game.rating}

                </td>


                <td style="padding:15px;">

                    <button
                        class="btn-secondary edit-btn"
                        data-id="${game.id}"
                        style="
                            border:none;
                            margin-right:5px;
                        "
                    >

                        <i
                            class="fa-solid fa-pen"
                        ></i>

                    </button>


                    <button
                        class="btn-secondary delete-btn"
                        data-id="${game.id}"
                        style="
                            border:none;
                        "
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                    </button>

                </td>

            </tr>

        `).join("");


    // EDIT

    document
        .querySelectorAll(".edit-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    editGame(
                        button.dataset.id
                    );

                }
            );

        });


    // DELETE

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteGame(
                        button.dataset.id
                    );

                }
            );

        });

}


// ================= CREATE / UPDATE =================

gameForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const title =
            gameTitle.value.trim();

        const category =
            gameCategory.value;

        const image =
            gameImage.value.trim();

        const rating =
            Number(
                gameRating.value
            );


        if (
            !title ||
            !category ||
            !image
        ) {

            alert(
                "Vui lòng nhập đầy đủ thông tin."
            );

            return;

        }


        let games =
            getGames();


        // UPDATE

        if (gameId.value) {

            games =
                games.map(game => {

                    if (
                        String(game.id) ===
                        String(gameId.value)
                    ) {

                        return {

                            ...game,

                            title,

                            category,

                            image,

                            rating

                        };

                    }

                    return game;

                });


            alert(
                "Cập nhật game thành công!"
            );

        }

        // CREATE

        else {

            const newGame = {

                id:
                    Date.now(),

                title,

                category,

                image,

                rating,

                description:
                    "Game được thêm bởi Admin."

            };


            games.unshift(
                newGame
            );


            alert(
                "Thêm game thành công!"
            );

        }


        saveGames(games);

        resetForm();

        displayAdminGames();

    }
);


// ================= UPDATE =================

function editGame(id) {

    const games =
        getGames();


    const game =
        games.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!game) {

        return;

    }


    gameId.value =
        game.id;

    gameTitle.value =
        game.title;

    gameCategory.value =
        game.category;

    gameImage.value =
        game.image;

    gameRating.value =
        game.rating;


    saveGameBtn.innerHTML = `

        <i class="fa-solid fa-save"></i>

        Lưu thay đổi

    `;


    cancelEditBtn.style.display =
        "inline-flex";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ================= DELETE =================

function deleteGame(id) {

    const confirmDelete =
        confirm(
            "Bạn có chắc muốn xóa game này?"
        );


    if (!confirmDelete) {

        return;

    }


    let games =
        getGames();


    games =
        games.filter(
            game =>
                String(game.id) !==
                String(id)
        );


    saveGames(games);


    // Xóa khỏi favorite

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "favoriteGames"
            )
        ) || [];


    favorites =
        favorites.filter(
            item =>
                String(item) !==
                String(id)
        );


    localStorage.setItem(
        "favoriteGames",
        JSON.stringify(favorites)
    );


    displayAdminGames();


    alert(
        "Đã xóa game!"
    );

}


// ================= RESET =================

function resetForm() {

    gameForm.reset();

    gameId.value = "";


    saveGameBtn.innerHTML = `

        <i class="fa-solid fa-plus"></i>

        Thêm game

    `;


    cancelEditBtn.style.display =
        "none";

}


cancelEditBtn.addEventListener(
    "click",
    resetForm
);


// ================= STATISTICS =================

function updateStatistics(games) {

    const totalGames =
        document.getElementById(
            "totalGames"
        );


    const totalFavorites =
        document.getElementById(
            "totalFavorites"
        );


    const totalUsers =
        document.getElementById(
            "totalUsers"
        );


    if (totalGames) {

        totalGames.textContent =
            games.length;

    }


    const favorites =
        JSON.parse(
            localStorage.getItem(
                "favoriteGames"
            )
        ) || [];


    if (totalFavorites) {

        totalFavorites.textContent =
            favorites.length;

    }


    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || [];


    if (totalUsers) {

        totalUsers.textContent =
            users.length;

    }

}


// ================= SECURITY =================

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ================= MOBILE MENU =================

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const mainNav =
    document.getElementById(
        "mainNav"
    );


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

displayAdminGames();