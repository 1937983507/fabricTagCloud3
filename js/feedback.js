function initFeedback() {

    // 预览图片
    var previewImg = document.getElementById("previewImg");
    previewImg.addEventListener("click", previewImgFun);

    // 删除图片
    var deleteImg = document.getElementById("deleteImg");
    deleteImg.addEventListener("click", deleteImgFun);

    // 显示隐藏
    show_preview_deleteImg();

    // 隐藏复选框
    window.onclick = function (event) {
        var modal = document.getElementById('myModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // 取消提交
    var cancelSubmitBtn = document.getElementById("cancelSubmitBtn");
    cancelSubmitBtn.addEventListener("click", cancelSubmitFun);

    // 提交
    var submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", submitFun);

    // 初始化头部事件
    initHead();
    
}


// 只选中单一复选框
function updateCheckboxes(checkbox) {
    var checkboxes = document.querySelectorAll('input[name="issue_type"]');
    checkboxes.forEach(function (currentCheckbox) {
        if (currentCheckbox !== checkbox) {
            currentCheckbox.checked = false;
        }
    });
}

// 加载用户上传的图片
function displayFileFun() {
    var fileInput = document.getElementById('file_upload');
    var file_uploadBtn = document.getElementById('file_uploadBtn');
    var fileDisplayImg = document.getElementById('showImg');
    var file = fileInput.files[0];
    var fileType = file.type;

    // 判断文件类型
    if (fileType.includes('image')) {
        var reader = new FileReader();
        reader.onload = function () {
            fileDisplayImg.src = reader.result;
            file_uploadBtn.style.display = "none";
            fileDisplayImg.style.display = "block";
        }
        reader.readAsDataURL(file);
    }
}


// 显示隐藏
function show_preview_deleteImg() {
    var file_display = document.getElementById("file_display");
    var showImg = document.getElementById("showImg");
    var previewDeleteImg = document.getElementById("preview_deleteImg");

    // Event listener for mouse entering showImg
    file_display.addEventListener("mouseover", function () {
        if (showImg.style.display === 'block') {
            previewDeleteImg.style.display = 'block';
            showImg.style.cursor = "pointer";
        }
    });
    // Event listener for mouse leaving showImg
    file_display.addEventListener("mouseout", function () {
        previewDeleteImg.style.display = "none";
        showImg.style.cursor = "auto";
    });
}

// 预览图片
function previewImgFun() {
    var modal = document.getElementById('myModal');
    var fileDisplayImg = document.getElementById('showImg');
    var modalImg = document.getElementById('modalImg');

    modal.style.display = "block";
    modalImg.src = fileDisplayImg.src;

    var naturalWidth = fileDisplayImg.naturalWidth;
    var naturalHeight = fileDisplayImg.naturalHeight;

    // Adjust image size based on screen size
    if (naturalWidth >= naturalHeight) {
        modalImg.style.width = "80%";
        modalImg.style.height = "auto";
    } else {
        modalImg.style.height = "80%";
        modalImg.style.width = "auto";
    }
}

// 删除图片
function deleteImgFun() {
    var file_uploadBtn = document.getElementById('file_uploadBtn');
    var fileDisplayImg = document.getElementById('showImg');
    var preview_deleteImg = document.getElementById("preview_deleteImg");

    fileDisplayImg.src = "";
    file_uploadBtn.style.display = "block";
    fileDisplayImg.style.display = "none";
    preview_deleteImg.style.display = "none";
}


// 取消提交
function cancelSubmitFun() {
    window.location.href = 'index.html';
}


// 检查表单内容
function validateForm() {
    var email_input = document.getElementById("email_input").value;
    var issue_type = document.querySelector('input[name="issue_type"]:checked');
    var issue_title = document.getElementById("issue_title").value;
    var issue_description = document.getElementById("issue_description").value;
    var error_message = document.getElementById("error_message").value;

    // 邮箱格式验证正则表达式
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 用于记录错误信息的变量
    var errorMessage = "";

    // 检查邮箱格式
    if (!emailRegex.test(email_input)) {
        errorMessage += "邮箱格式不正确\n";
    }

    // 检查工单类型是否选择
    if (!issue_type) {
        errorMessage += "请选择工单类型\n";
    }

    // 检查工单标题是否填写
    if (!issue_title.trim()) {
        errorMessage += "工单标题不能为空\n";
    }

    // 检查工单描述是否填写
    if (!issue_description.trim()) {
        errorMessage += "工单描述不能为空\n";
    }

    // 检查报错信息是否填写
    if (!error_message.trim()) {
        errorMessage += "报错信息不能为空\n";
    }

    // 如果有错误信息，则显示错误提示，不提交表单
    if (errorMessage) {
        alert(errorMessage);
        return false;
    }
    // 表单验证通过，提交表单
    return true;
}


// 提交
function submitFun(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    
    // 若是表单未填写完毕，则不予传输
    if(!validateForm())return;

    // 如果通过验证，则手动提交表单
    document.getElementById("feedbackForm").submit();


}