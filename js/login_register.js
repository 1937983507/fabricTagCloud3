// 初始化登录注册界面
function initLoginRegister(){
    // 登录注册窗口
    var loginContainer = document.getElementById('login-container');
    var registerContainer = document.getElementById('register-container');
    // 登录/注册窗口互转
    var registerLink = document.getElementById('registerLink');
    var loginLink = document.getElementById('loginLink');
    // 显示隐藏密码
    var loginPasswordToggle = document.getElementById('loginPasswordToggle');
    var registerPasswordToggle = document.getElementById('registerPasswordToggle');
    var confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    // 存储用户信息
    var users = [];

    // 切换到注册
    registerLink.addEventListener('click', function () {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });
    // 切换到登录
    loginLink.addEventListener('click', function () {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });


    // 显示隐藏密码（小眼睛）
    loginPasswordToggle.addEventListener('click', loginPasswordFun);
    registerPasswordToggle.addEventListener('click', registerPasswordFun);
    confirmPasswordToggle.addEventListener('click', confirmPasswordFun)


    // 单击登录
    var loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', loginFormFun);


    // 单击注册
    var registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', registerFormFun) 

    // 初始化头部事件
    initHead();

}



// 隐藏显示密码（小眼睛）
function loginPasswordFun() {
    var passwordField = document.getElementById('loginPassword');
    var icon = loginPasswordToggle.querySelector('img');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.src = '../img/eye-open.png';
        icon.alt = 'Open Eye';                
    } else {
        passwordField.type = 'password';
        icon.src = '../img/eye-close.png';
        icon.alt = 'Close Eye';
    }
};
function registerPasswordFun() {
    var passwordField = document.getElementById('registerPassword');
    var icon = registerPasswordToggle.querySelector('img');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.src = '../img/eye-open.png';
        icon.alt = 'Open Eye';
    } else {
        passwordField.type = 'password';
        icon.src = '../img/eye-close.png';
        icon.alt = 'Close Eye';
    }
};
function confirmPasswordFun() {
    var passwordField = document.getElementById('confirmPassword');
    var icon = confirmPasswordToggle.querySelector('img');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.src = '../img/eye-open.png';
        icon.alt = 'Open Eye';                
    } else {
        passwordField.type = 'password';
        icon.src = '../img/eye-close.png';
        icon.alt = 'Close Eye';
    }
};



// 单击登录
function loginFormFun (event) {
    event.preventDefault();
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    // 在这里执行登录验证逻辑，这里仅打印值
    console.log('登录用户名: ' + username);
    console.log('登录密码: ' + password);

    window.location.href = 'index.html';
};


// 单击注册
function registerFormFun(event) {
    event.preventDefault();
    var username = document.getElementById('registerUsername').value;
    var email = document.getElementById('registerEmail').value;
    var phone = document.getElementById('registerPhone').value;
    var password = document.getElementById('registerPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("确认密码不一致，请重新输入。");
        return;
    }
    
    var newUser = {
        username: username,
        email: email,
        phone: phone,
        password: password
    };

    // 将新用户添加到用户数组中
    users.push(newUser);
    console.log('注册成功。用户信息：', newUser);
};