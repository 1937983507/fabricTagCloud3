
// 切换菜单-中侧详情窗口
document.addEventListener('DOMContentLoaded', function () {
    const leftMenuItems = document.querySelectorAll('.left-menu-item');
    const midBoxes = document.querySelectorAll('.mid-box');

    leftMenuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 获取当前点击菜单项的ID
            const targetId = item.getAttribute('id').replace('into', '').toLowerCase() + '-box';

            // 隐藏所有的中侧详情栏
            midBoxes.forEach(box => {
                box.style.display = 'none';
            });

            // 显示目标中侧详情栏
            const targetBox = document.getElementById(targetId);
            if (targetBox) {
                targetBox.style.display = 'block';
            }

            // 隐藏所有菜单项的背景色
            leftMenuItems.forEach(menuItem => {
                menuItem.style.backgroundColor = '';
                menuItem.style.border = '';
            });

            // 设置当前菜单项的背景色为灰色
            item.style.backgroundColor = 'rgb(241, 243, 247)';
            // 设置当前菜单项的左边框蓝色
            item.style.borderLeft = '5px solid rgb(57, 156, 279)';
        });
    });
});

// 切换字体-中文英文其他
document.addEventListener("DOMContentLoaded", function () {
    // 获取所有选项对象
    var options = document.querySelectorAll(".mini-typeface-item");
    // 获取所有typeface box
    var typefaceBoxes = document.querySelectorAll(".one-typeface-box");

    // 给每个选项添加点击事件监听
    options.forEach(function (option, index) {
        option.addEventListener("click", function () {
            // 隐藏所有typeface box
            typefaceBoxes.forEach(box => {
                box.style.display = 'none';
            });
            // 移除所有选项的蓝色下边框样式
            options.forEach(opt => {
                opt.style.borderBottom = 'none';
                opt.style.backgroundColor = "";
            });
            // 添加蓝色下边框样式到当前被点击的选项
            option.style.borderBottom = '3px solid rgb(57, 156, 279)';
            option.style.backgroundColor = "rgb(241, 243, 247)";

            // 获取要显示的typeface box的id
            var targetId = "typeface-" + option.getAttribute('id').replace('into', '');
            var targetBox = document.getElementById(targetId);
            // 如果存在目标typeface box，则显示它
            if (targetBox) {
                targetBox.style.display = 'block';
            }
        });
    });
});

// 左右窗口拖拽移动
document.addEventListener('DOMContentLoaded', function () {
    const resize = document.querySelector('#splitter');
    const midBox = document.getElementById('mid-box');
    const mainBox = document.getElementById('tagcloud-box');

    // 记录屏幕总宽度
    const header = document.getElementById('header');
    allwidth = parseFloat(getComputedStyle(header).width);

    let isResizing = false;
    let startX, startWidthMid;

    // 鼠标按下事件
    resize.addEventListener('mousedown', function (e) {
        isResizing = true;
        // 记录初始X
        startX = e.clientX;
        // 记录左窗口初始宽度
        startWidthMid = parseFloat(getComputedStyle(midBox).width);
    });

    // 鼠标移动事件
    document.addEventListener('mousemove', function (e) {
        // 若是正在左右窗口拖拽
        if (isResizing) {
            // 计算移动距离
            const deltaX = e.clientX - startX;
            if (deltaX !== 0) {
                // 若移动距离不为0
                percent = parseFloat((startWidthMid + deltaX) * 100 / allwidth);
                if (percent < 12) return;
                midBox.style.width = percent + '%';
                mainBox.style.width = 100 - percent - 4 + '%';
                resize.style.left = 'calc(' + percent + 4 + '% + 71px)';

                // 修改canvas画布大小
                tem = document.getElementById("tagcloud-box");
                canvas.setWidth(tem.offsetWidth*0.99);
                canvas.setHeight(tem.offsetHeight*0.99);
            }
        }
    });

    // 鼠标松开事件
    document.addEventListener('mouseup', function () {
        isResizing = false;
    });
});
