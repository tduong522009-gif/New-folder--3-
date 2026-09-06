// ==================================================
// GAMEHUB PROFILE
// ==================================================


// Lấy tài khoản hiện tại
const currentUserJSON =
    localStorage.getItem("gamehub_currentUser");


// ==================================================
// KIỂM TRA ĐĂNG NHẬP
// ==================================================

if (!currentUserJSON) {

    // Chưa đăng nhập
    alert(
        "Bạn cần đăng nhập để xem Profile."
    );

    window.location.href =
        "login.html";

}


// ==================================================
// LẤY THÔNG TIN USER
// ==================================================

const currentUser =
    JSON.parse(currentUserJSON);



// ==================================================
// HIỂN THỊ PROFILE
// ==================================================

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileUsername =
    document.getElementById(
        "profileUsername"
    );

const profileEmailInfo =
    document.getElementById(
        "profileEmailInfo"
    );

const profileDate =
    document.getElementById(
        "profileDate"
    );


// Tên
if (profileName) {

    profileName.textContent =
        currentUser.name;

}


// Email
if (profileEmail) {

    profileEmail.textContent =
        currentUser.email;

}


// Username
if (profileUsername) {

    profileUsername.textContent =
        currentUser.name;

}


// Email
if (profileEmailInfo) {

    profileEmailInfo.textContent =
        currentUser.email;

}


// Ngày tham gia
if (
    profileDate &&
    currentUser.createdAt
) {

    const date =
        new Date(
            currentUser.createdAt
        );


    profileDate.textContent =
        date.toLocaleDateString(
            "vi-VN"
        );

}



// ==================================================
// ĐĂNG XUẤT
// ==================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            const confirmLogout =
                confirm(
                    "Bạn có muốn đăng xuất không?"
                );


            if (!confirmLogout) {
                return;
            }


            localStorage.removeItem(
                "gamehub_currentUser"
            );


            window.location.href =
                "login.html";

        }
    );

}