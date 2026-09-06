// ==================================================
// AUTH SYSTEM - GAMEHUB
// ==================================================


// Lấy danh sách tài khoản
function getUsers() {

    const users =
        localStorage.getItem("gamehub_users");

    if (!users) {
        return [];
    }

    return JSON.parse(users);
}



// Lưu danh sách tài khoản
function saveUsers(users) {

    localStorage.setItem(
        "gamehub_users",
        JSON.stringify(users)
    );

}



// ==================================================
// ĐĂNG KÝ
// ==================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // Lấy dữ liệu
            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );



            // ===============================
            // KIỂM TRA DỮ LIỆU
            // ===============================

            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                message.textContent =
                    "Vui lòng nhập đầy đủ thông tin.";

                return;
            }


            // Kiểm tra mật khẩu
            if (password.length < 6) {

                message.textContent =
                    "Mật khẩu phải có ít nhất 6 ký tự.";

                return;
            }


            // Kiểm tra xác nhận mật khẩu
            if (password !== confirmPassword) {

                message.textContent =
                    "Mật khẩu xác nhận không khớp.";

                return;
            }



            // ===============================
            // LẤY USERS
            // ===============================

            const users = getUsers();



            // Kiểm tra email đã tồn tại
            const existingUser =
                users.find(
                    user => user.email === email
                );


            if (existingUser) {

                message.textContent =
                    "Email này đã được đăng ký.";

                return;
            }



            // ===============================
            // TẠO USER
            // ===============================

            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                password: password,

                favorites: [],

                createdAt:
                    new Date().toISOString()

            };



            // Thêm tài khoản
            users.push(newUser);



            // Lưu Local Storage
            saveUsers(users);



            // ===============================
            // THÔNG BÁO
            // ===============================

            message.textContent =
                "Đăng ký thành công! Đang chuyển đến trang đăng nhập...";


            // Xóa form
            registerForm.reset();


            // Chuyển sang login
            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1200
            );

        }
    );

}



// ==================================================
// ĐĂNG NHẬP
// ==================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const users = getUsers();


            // Tìm tài khoản
            const user =
                users.find(
                    user =>
                        user.email === email &&
                        user.password === password
                );


            // Không tìm thấy
            if (!user) {

                message.textContent =
                    "Email hoặc mật khẩu không chính xác.";

                return;
            }



            // ===============================
            // LƯU USER ĐANG ĐĂNG NHẬP
            // ===============================

            localStorage.setItem(
                "gamehub_currentUser",
                JSON.stringify(user)
            );


            message.textContent =
                "Đăng nhập thành công!";


            // Chuyển về trang chủ
            setTimeout(
                function() {

                    window.location.href =
                        "index.html";

                },
                800
            );

        }
    );

}



// ==================================================
// ĐĂNG XUẤT
// ==================================================

function logout() {

    localStorage.removeItem(
        "gamehub_currentUser"
    );


    window.location.href =
        "login.html";

}



// ==================================================
// LẤY USER HIỆN TẠI
// ==================================================

function getCurrentUser() {

    const user =
        localStorage.getItem(
            "gamehub_currentUser"
        );


    if (!user) {
        return null;
    }


    return JSON.parse(user);

}