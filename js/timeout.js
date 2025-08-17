// 设置倒计时初始时间（单位：秒）
var countdownTime = 5;

    
// 更新倒计时函数
function updateCountdown() {


    // 获取倒计时元素
    var countdownElement = document.getElementById("countdown");
    
    // 更新倒计时元素的文本内容
    countdownElement.textContent = "页面将在 " + countdownTime + " 秒后自动返回";

    // 更新倒计时时间
    countdownTime--;

    // 当倒计时时间为0时，跳转页面
    if (countdownTime < 0) {
        window.location.href = 'index.html';
    } else {
        // 每隔一秒更新一次倒计时
        setTimeout(updateCountdown, 1000);
    }
    
    // 提早跳转
    if (countdownTime < 2) {
        window.location.href = 'index.html';
    }
}


