// 上方按钮事件


function initHead() {
    // 首页
    var homeBtn = document.getElementById("homeBtn");
    homeBtn.addEventListener("click", homeFun);

    // 文件
    var fileBtn = document.getElementById("fileBtn");
    fileBtn.addEventListener("click", fileFun);

    // 保存
    var saveFileBtn = document.getElementById("saveFileBtn");
    saveFileBtn.addEventListener("click", saveFileFun);

    // 上传到云端
    var uploadFileBtn = document.getElementById("uploadFileBtn");
    uploadFileBtn.addEventListener("click", uploadFileFun);

    // 分享
    var shareTagCloudBtn = document.getElementById("shareTagCloudBtn");
    shareTagCloudBtn.addEventListener("click", shareTagCloudFun);

    // 帮助
    var helpBtn = document.getElementById("helpBtn");
    helpBtn.addEventListener("click", helpFun);

    // 反馈
    var feedbackBtn = document.getElementById("feedbackBtn");
    feedbackBtn.addEventListener("click", feedbackFun);

    // 关于我们
    var aboutusBtn = document.getElementById("aboutusBtn");
    aboutusBtn.addEventListener("click", aboutusFun);

    // 登录注册
    var LoginAndRegisterBtn = document.getElementById("LoginAndRegisterBtn");
    LoginAndRegisterBtn.addEventListener("click", LoginAndRegisterFun);
}

// 回到首页
function homeFun(){
    window.location.href = 'index.html';
}

// 文件
function fileFun() {
    window.alert('功能尚待开放');
    console.log("aaaa");
}

// 保存
function saveFileFun() {
    window.alert('功能尚待开放');
}

// 上传到云端
function uploadFileFun() {
    window.alert('功能尚待开放');
}

// 分享
function shareTagCloudFun() {
    window.alert('功能尚待开放');
}

// 下载
async function downloadFun() {
    try {
        const opts = {
            types: [
                {
                    description: '便携式网络图形',
                    accept: {
                        'image/png': ['.png'],
                    }
                },
                {
                    description: '图形交换格式',
                    accept: {
                        'image/gif': ['.gif'],
                    }
                },
                {
                    description: 'JPEG文件交换格式',
                    accept: {
                        'image/jpeg': ['.jpeg', '.jpg'],
                    }
                },
                {
                    description: 'Windows位图',
                    accept: {
                        'image/bmp': ['.bmp'],
                    }
                },
                {
                    description: 'TIFF格式',
                    accept: {
                        'image/tiff': ['.tif', '.tiff'],
                    }
                },
                {
                    description: '可缩放的向量图形',
                    accept: {
                        'image/svg+xml': ['.svg']
                    }
                }
            ],

            excludeAcceptAllOption: true
        };

        const handle = await window.showSaveFilePicker(opts); // 打开保存文件对话框
        const writable = await handle.createWritable(); // 创建可写入的文件对象

        // 检查选择的文件类型是否为SVG
        const fileType = handle.name.split('.').pop().toLowerCase();
        let blob;

        if (fileType === 'svg') {
            // 获取画布的SVG数据
            const svgData = canvas.toSVG();
            // 将SVG数据转换为Blob对象
            blob = new Blob([svgData], { type: 'image/svg+xml' });
        } else {
            // 获取画布的数据URL
            const dataURL = canvas.toDataURL({
                format: 'image/' + fileType,
                multiplier: 3 // 图片分辨率倍数
            });
            // 将数据URL转换为Blob对象
            blob = await (await fetch(dataURL)).blob();
        }

        // 将Blob对象写入文件
        await writable.write(blob);
        await writable.close();

        console.log('文件保存成功');
        window.alert('保存成功');
    } catch (error) {
        console.error('文件保存失败:', error);
        window.alert('保存失败');
    }
}

// 帮助
function helpFun() {
    window.location.href = 'help.html';
}

// 反馈
function feedbackFun() {
    window.location.href = 'feedback.html';
}

// 关于我们
function aboutusFun(){
    window.location.href = 'hubuCartographicGroup.html';
}

// 登录注册
function LoginAndRegisterFun() {
    window.location.href = 'login_register.html';
}