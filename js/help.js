
// 初始化帮助窗口
function initHelp() {

    // 获取左侧所有导航链接
    var navLinks = document.querySelectorAll('.sidebar ul li a');
    // 添加页面切换事件
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", changeLink);
    }

    // 默认生成概述页面的右侧导航
    var targetPage = document.getElementById("introduction-page");
    generateRightSidebar(targetPage);


    // 星星交互事件
    handleStarEvents();

    // 反馈列表事件
    handFeedbackItemsEvents();

    // 提交反馈事件
    submitEvents();


    // 获取所有的li元素
    const menuItems = document.querySelectorAll('#sidebar-left li a');
    // 添加事件监听器
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            // 移除之前的选中项
            menuItems.forEach(item => {
                item.classList.remove('active');
            });

            // 添加选中样式到当前项
            this.classList.add('active');
        });
    });


    // 获取下载链接
    getDownloadLink();

    // 初始化头部事件
    initHead();

}



// 页面切换事件
function changeLink(event) {
    event.preventDefault(); // 阻止默认行为

    var targetId = this.getAttribute('href').substring(1); // 获取目标页面的ID
    var targetPage = document.getElementById(targetId); // 获取目标页面元素

    // 将所有主要内容页面隐藏
    var pages = document.querySelectorAll('.main-content-page');
    pages.forEach(function (page) {
        page.style.display = 'none';
    });

    // 显示目标页面
    targetPage.style.display = 'block';

    // 滚动到目标页面顶部
    targetPage.scrollTop = 0;

    // 生成右侧目录
    generateRightSidebar(targetPage);
}


// 生成右侧目录
function generateRightSidebar(targetPage) {

    // 获取右侧目录容器
    var sidebarRightList = document.getElementById('aContent');
    // 清空右侧目录
    sidebarRightList.innerHTML = '';

    // 获取页面中的所有标题
    var sections = targetPage.querySelectorAll('section');
    sections.forEach(function (section) {
        var h2Element = section.querySelector('h2');
        if (h2Element) {
            var title = h2Element.textContent;
            var id = section.getAttribute('id');

            // 创建目录项
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.textContent = title;
            link.href = '#' + id;
            listItem.appendChild(link);

            // 添加点击事件监听器，实现滚动到对应部分
            link.addEventListener('click', function (event) {
                event.preventDefault();
                smoothScrollToSection(id);
            });

            // 添加目录项到右侧目录
            sidebarRightList.appendChild(listItem);
        }
    });

    // 默认选中第一个子项
    var firstLink = sidebarRightList.querySelector('a');
    if (firstLink) {
        firstLink.classList.add('active');
    }

    // 添加滚动事件监听器（当页面上下滚动时，改变右侧目录栏的符号样式）
    targetPage.addEventListener('scroll', function () {
        var currentScroll = targetPage.scrollTop + 10;

        sections.forEach(function (section) {
            var id = section.getAttribute('id');
            var sectionTop = section.offsetTop;
            var sectionBottom = sectionTop + section.offsetHeight;

            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                var activeLink = sidebarRightList.querySelector('a.active');
                if (activeLink) {
                    activeLink.classList.remove('active');
                }
                var correspondingLink = sidebarRightList.querySelector('a[href="#' + id + '"]');
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
                return;
            }
        });
    });

    // 平滑滚动到指定的section
    function smoothScrollToSection(id) {
        var targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}



// 星星交互事件
function handleStarEvents() {
    var isStarsChecked = false;
    var isStarsCheckedIndex = -1;

    // 获取星星组件
    const stars = document.querySelectorAll('.stars label');
    stars.forEach((star, index) => {
        // 鼠标移入
        star.addEventListener('mouseover', () => {
            for (let i = 0; i < stars.length; i++) {
                if (i <= index) stars[i].style.color = 'orange';
                else stars[i].style.color = '#ccc';
            }
        });
        // 鼠标移开
        star.addEventListener('mouseout', () => {
            if (!isStarsChecked) {
                // 尚未选中小星星，则将所有星星变灰
                for (let i = 0; i < stars.length; i++) {
                    stars[i].style.color = '#ccc';
                }
            }
            else {
                // 已有选中小星星，则将其前面的部分变灰
                for (let i = 0; i < stars.length; i++) {
                    if (i <= isStarsCheckedIndex) stars[i].style.color = 'orange';
                    else if (i > isStarsCheckedIndex) stars[i].style.color = '#ccc';
                }
            }
        });
        // 鼠标单击
        star.addEventListener('click', () => {
            isStarsChecked = true;
            isStarsCheckedIndex = index;
            for (let i = 0; i <= index; i++) {
                stars[i].style.color = 'orange';
            }
            if (index <= 2) {
                document.getElementById("feedback_bad").style.display = "block";
                document.getElementById("feedback_good").style.display = "none";
            }
            else {
                document.getElementById("feedback_bad").style.display = "none";
                document.getElementById("feedback_good").style.display = "block";
            }
        });
    });
}


// 反馈列表事件
function handFeedbackItemsEvents() {
    // 获取所有反馈列表项
    var feedbackItems = document.querySelectorAll('.a_feedback_list');
    feedbackItems.forEach(function (item) {
        item.addEventListener('click', function () {
            // 检查当前列表项是否已经被选中
            const isSelected = this.classList.contains('selected');

            // 如果已经被选中，则移除选中状态
            if (isSelected) {
                this.classList.remove('selected');
            } else {
                this.classList.add('selected');
            }
        });
    });
}


// 提交反馈事件
function submitEvents() {
    // 提交反馈
    var ctrl_submit_bee = document.getElementById("ctrl_submit_bee");
    ctrl_submit_bee.addEventListener("click", function () {
        document.getElementById("feedback_bad").style.display = "none";
        document.getElementById("feedback_good").style.display = "none";
        window.alert('感谢反馈！！');
    })
    var ctrl_submit_xp = document.getElementById("ctrl_submit_xp");
    ctrl_submit_xp.addEventListener("click", function () {
        document.getElementById("feedback_bad").style.display = "none";
        document.getElementById("feedback_good").style.display = "none";
        window.alert('感谢反馈！！');
    })
    var ctrl_cancel = document.getElementById("ctrl_cancel");
    ctrl_cancel.addEventListener("click", function () {
        document.getElementById("feedback_bad").style.display = "none";
        document.getElementById("feedback_good").style.display = "none";
        window.alert('感谢反馈！！');
    })
    var ctrl_submit = document.getElementById("ctrl_submit");
    ctrl_submit.addEventListener("click", function () {
        document.getElementById("feedback_bad").style.display = "none";
        document.getElementById("feedback_good").style.display = "none";
        window.alert('感谢反馈！！');
    })
}


// 获取下载链接
function getDownloadLink() {
    // 概述文档
    var downloadLink_introduction = document.getElementById('downloadLink_introduction')
    downloadLink_introduction.addEventListener('click', function () {
        // 创建一个虚拟的下载链接
        var link = document.createElement('a');
        link.setAttribute('href', '../doc/地名标签云-概述.pdf'); // 替换为你的文件路径
        link.setAttribute('download', '地名标签云-概述.pdf'); // 替换为你的文件名
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 快速上手文档
    var downloadLink_gettingStarted = document.getElementById('downloadLink_gettingStarted')
    downloadLink_gettingStarted.addEventListener('click', function () {
        // 创建一个虚拟的下载链接
        var link = document.createElement('a');
        link.setAttribute('href', '../doc/地名标签云-快速上手.pdf'); // 替换为你的文件路径
        link.setAttribute('download', '地名标签云-快速上手.pdf'); // 替换为你的文件名
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 入门教程文档
    var downloadLink_gettingStarted = document.getElementById('downloadLink_gettingStarted')
    downloadLink_gettingStarted.addEventListener('click', function () {
        // 创建一个虚拟的下载链接
        var link = document.createElement('a');
        link.setAttribute('href', '../doc/地名标签云-入门教程.pdf'); // 替换为你的文件路径
        link.setAttribute('download', '地名标签云-入门教程.pdf'); // 替换为你的文件名
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 下载示例数据
    var downloadLink_exampleData = document.getElementById('downloadLink_exampleData')
    downloadLink_exampleData.addEventListener('click', function () {
        // 创建一个虚拟的下载链接
        var link = document.createElement('a');
        link.setAttribute('href', '../doc/示例数据.csv'); // 替换为你的文件路径
        link.setAttribute('download', '示例数据.csv'); // 替换为你的文件名
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}