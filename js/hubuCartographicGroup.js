// 页面切换
function showPage(pageId) {
    // 隐藏所有页面
    var pages = document.querySelectorAll('.page');
    pages.forEach(function (page) {
        page.style.display = 'none';
    });

    // 滚动页面到顶部
    scrollToTop();    
    
    // 显示指定页面
    document.getElementById(pageId).style.display = 'block';


}


// 滚动页面到顶部
function scrollToTop() {
    var containerRight = document.getElementsByClassName('container-right')[0];
    containerRight.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滚动
    });
}