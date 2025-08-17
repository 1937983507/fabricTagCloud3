// 表格相关事件

// 单页的项目数量
const itemsPerPage = 10;
// 当前页面
let currentPage = 1;
// 当前选中数量
currentSelectedItem = 0;
// 是否展示全部要素
showAllItem = true;
// 选中的poi项目
selectedPOI = [];
// 未选中的poi项目
noselectedPOI = [];
// 总的项目数量
allPOILength = 0;

// 数据缓存
// tableBuffer = [];

// 初始化数据表格
function initTable() {
    // 初始显示第一页
    if (showAllItem) changePage(currentPage, allPOI);
    else changePage(currentPage, selectedPOI);


    // 监听当前选中的项目数
    disabledClearDelete();

    // 编辑表格
    var toggleEditButton = document.getElementById("toggleEditButton");
    toggleEditButton.addEventListener("click", toggleEdit);

    // 添加新的地点
    // var newLocationBtm = document.getElementById("new-location-btm");
    // newLocationBtm.addEventListener("click", addNewLocation);

    // 切换选择
    var switchSelectBtn = document.getElementById("switchSelectBtn");
    switchSelectBtn.addEventListener("click", switchSelect);

    // 清除所有选择
    var clearSelectedBtn = document.getElementById("clearSelectedBtn");
    clearSelectedBtn.addEventListener("click", clearSelected);

    // 删除所有选择
    var deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
    deleteSelectedBtn.addEventListener("click", deleteSelected);

    // 显示全部项目
    var tableShowAllRecordsBtn = document.getElementById("tableShowAllRecordsBtn");
    tableShowAllRecordsBtn.addEventListener("click", tableShowAllRecords);

    // 显示当前视图内的记录
    // var tableShowRangeRecordsBtn = document.getElementById("tableShowRangeRecordsBtn");
    // tableShowRangeRecordsBtn.addEventListener("click", tableShowRangeRecords);

    // 显示选中的项目
    var tableShowSelectedRecordsBtn = document.getElementById("tableShowSelectedRecordsBtn");
    tableShowSelectedRecordsBtn.addEventListener("click", tableShowSelectedRecords);

}

// 改变页码事件
function changePage(page, data) {
    if (showAllItem) var length = allPOILength;
    else var length = currentSelectedItem;
    // 更新全局变量
    currentPage = page;
    // 阻止页面索引越界
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > Math.ceil(length / itemsPerPage)) {
        currentPage = Math.ceil(length / itemsPerPage);
    }
    // 生成表格
    generateTableRows(currentPage, data);
    // 生成页码索引
    generatePageNumbers(data);
    // 复选框事件
    changeCheckboxes();
    // 表格内容改变事件
    changeTable();
}

// 生成对应页面的表格
function generateTableRows(page, data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    // 若是数据集为空，则不生成该表格
    if (data.length == 0) return;

    if (showAllItem) var length = allPOILength;
    else var length = currentSelectedItem;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, length);

    for (let i = startIndex; i < endIndex; i++) {
        const poi = data[i];
        // if(!showAllItem && !poi.checked) continue;
        const row = `
                <tr class="${poi.selected}">
                    <td class="checkbox-column"><input type="checkbox"></td>
                    <td>${poi.pname}</td>
                    <td>${poi.city}</td>
                    <td>${poi.rankInChina}</td>
                </tr>
            `;
        var tempContainer = document.createElement('tbody'); // 创建临时的 tbody 元素容器
        tempContainer.innerHTML = row; // 将 row 字符串转换为 DOM 元素
        const createdRow = tempContainer.getElementsByTagName("tr")[0]; // 获取创建的行元素
        var checkboxInput = createdRow.getElementsByTagName("input")[0];
        if (data[i].checked) checkboxInput.checked = true;
        // else checkboxInput.checked = false; 
        tableBody.appendChild(createdRow);
    }

    // 获取表格数据
    const dataTable = document.getElementById('data-table');
    // 对表格编辑权限进行更改
    if (isEditable) enableEditing(dataTable);
    else disableEditing(dataTable);

}

// 生成页码数
function generatePageNumbers(data) {
    const pageNumbersContainer = document.getElementById('turnPage');
    pageNumbersContainer.innerHTML = ''; // Clear existing page numbers

    if (showAllItem) var length = allPOILength;
    else var length = currentSelectedItem;

    // 总页码
    const totalPages = Math.ceil(length / itemsPerPage);

    // 更新已选择的项目数组
    changeSelected();

    // Add previous page button
    const prevPage = document.createElement('span');
    prevPage.className = 'prev';
    prevPage.id = 'prevPage';
    prevPage.innerHTML = '<';
    if (showAllItem) prevPage.onclick = () => changePage(currentPage - 1, allPOI);
    else prevPage.onclick = () => changePage(currentPage - 1, selectedPOI);
    // prevPage.onclick = () => changePage(currentPage - 1);
    pageNumbersContainer.appendChild(prevPage);

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            const onespan = document.createElement('span');
            onespan.textContent = i;
            if (showAllItem) onespan.onclick = () => changePage(i, allPOI);
            else onespan.onclick = () => changePage(i, selectedPOI);
            // onespan.onclick = () => changePage(i);
            turnPage.appendChild(onespan);
        }
    }
    else {
        // 总页面数大于5
        if (currentPage <= 3) {
            // 当前页面在开头
            addPageItem(1, 5);
            addEllipsis();
            addPageItem(totalPages - 1, totalPages);
        }
        else if (currentPage > 3 && currentPage <= 6) {
            // 当前页面在开头
            addPageItem(1, currentPage + 2);
            addEllipsis();
            addPageItem(totalPages - 1, totalPages);
        }
        else if (currentPage > 6 && currentPage < (totalPages - 5)) {
            // 当前页面在中间
            addPageItem(1, 2);
            addEllipsis();
            addPageItem(currentPage - 2, currentPage + 2);
            addEllipsis();
            addPageItem(totalPages - 1, totalPages);
        }
        else if (currentPage >= (totalPages - 5) && currentPage <= (totalPages - 3)) {
            // 当前页面在末尾
            addPageItem(1, 2);
            addEllipsis();
            addPageItem(currentPage - 2, totalPages);
        }
        else {
            // 当前页面在末尾
            addPageItem(1, 2);
            addEllipsis();
            addPageItem(totalPages - 4, totalPages);
        }
    }


    // Add next page button
    const nextPage = document.createElement('span');
    nextPage.className = 'next';
    nextPage.id = 'nextPage';
    nextPage.innerHTML = '>';
    if (showAllItem) nextPage.onclick = () => changePage(currentPage + 1, allPOI);
    else nextPage.onclick = () => changePage(currentPage + 1, selectedPOI);
    // nextPage.onclick = () => changePage(currentPage + 1);
    pageNumbersContainer.appendChild(nextPage);

    // 加一段页码
    function addPageItem(startPage, endPage) {
        for (let i = startPage; i <= endPage; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            if (i == currentPage) span.classList.add("selected");
            pageNumbersContainer.appendChild(span);
            if (showAllItem) span.onclick = () => changePage(i, allPOI);
            else span.onclick = () => changePage(i, selectedPOI);
            // span.onclick = () => changePage(i);
        }
    }
    // 加省略号
    function addEllipsis() {
        const span = document.createElement('span');
        span.textContent = "...";
        pageNumbersContainer.appendChild(span);
    }



}



// 编辑表格
let isEditable = false;  // 是否可编辑(默认不可编辑)
function toggleEdit() {
    // 获取编辑按钮对象
    const editButton = document.getElementById('toggleEditButton');
    // 获取表格数据
    const dataTable = document.getElementById('data-table');
    // 获取新地点名文本框
    const newLocationName = document.getElementById('new-location-name');
    // 获取添加地名按钮对象
    const confirmButton = document.getElementById('new-location-btm');
    // 判断当前是否可编辑
    if (isEditable) {
        // 目前为开启编辑，则停止编辑
        editButton.textContent = '编辑表格';
        disableEditing(dataTable);
        newLocationName.setAttribute('disabled', '');
        confirmButton.setAttribute('disabled', '');
    } else {
        // 目前为停止编辑，则开启编辑
        editButton.textContent = '停止编辑';
        enableEditing(dataTable);
        newLocationName.removeAttribute('disabled');
        confirmButton.removeAttribute('disabled');
    }
    // 修改状态
    isEditable = !isEditable;
}
// 开始编辑
function enableEditing(table) {
    // 所有复选框变为可以选中
    // const checkboxes = table.querySelectorAll('.checkbox-column input');
    // checkboxes.forEach(checkbox => {
    //     checkbox.removeAttribute('disabled');
    // });
    // 所有表格数据可以修改
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'true');
    });
    // 数据缓存
    // tableBuffer = allPOI;
}
// 停止编辑
function disableEditing(table) {
    // 所有复选框不可选中
    // const checkboxes = table.querySelectorAll('.checkbox-column input');
    // checkboxes.forEach(checkbox => {
    //     checkbox.setAttribute('disabled', '');
    // });
    // 所有表格数据不可编辑
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'false');
    });
    // 修改写回数据库
    changeDB();
}
// 将用户所做的编辑上传至数据库(这里要继续修改)
function changeDB() {
    // allPOI = tableBuffer;
}




// 添加新的地点
function addNewLocation() {
    // 获取文本对象的内容
    const newName = document.getElementById('new-location-name').value;
    // 若值为空，则进行弹窗提示
    if (newName.trim() === '') {
        alert('请输入一个新的地点');
        return;
    }
    // 创建一个新的POI点
    var tempPOI = {
        pname: newName,
        selected: "selected-row",
        checked: true
    }
    allPOI.push(tempPOI);
    // 更新已选择的项目数组
    changeSelected();
    // 页面切换到最后一页
    currentPage = Math.ceil(allPOILength / itemsPerPage);
    if (showAllItem) changePage(currentPage, allPOI);
    else changePage(currentPage, selectedPOI);
    // changePage(currentPage);

    // 清除文本框的内容
    document.getElementById('new-location-name').value = '';


}



// 复选框事件
function changeCheckboxes() {
    // 对所有的复选框都绑定事件
    const dataTable = document.getElementById('data-table');
    const checkboxes = dataTable.querySelectorAll('.checkbox-column input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}
// 当文本框选中时，设置其背景为蓝色
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const row = checkbox.closest('tr');
    var rowIndex = (currentPage - 1) * itemsPerPage + row.rowIndex - 1;
    if (checkbox.checked) {
        row.classList.add('selected-row');
        // tableBuffer[rowIndex].selected = "true";
        allPOI[rowIndex].selected = "selected-row";
        allPOI[rowIndex].checked = true;
        // 当前选中数量
        currentSelectedItem++;
    } else {
        row.classList.remove('selected-row');
        // tableBuffer[rowIndex].selected = "false";
        allPOI[rowIndex].selected = "";
        allPOI[rowIndex].checked = false;
        // 当前选中数量
        currentSelectedItem--;
    }
    disabledClearDelete();
    // // 更新当前选中的要素
    // selectedPOI.push(allPOI[rowIndex]);
    changeSelected();
}


// 表格事件改变事件
function changeTable() {
    const dataTable = document.getElementById('table-body');
    dataTable.addEventListener('input', function (event) {
        const targetCell = event.target;
        const row = targetCell.closest('tr');
        const rowData = Array.from(row.cells).map(cell => cell.textContent); // Get data from cells
        // 获取表格数据
        var pname = rowData[1];
        var X_gcj02 = rowData[2];
        var Y_gcj02 = rowData[3];
        var rankInChina = rowData[4];
        // console.log('Modified row:', rowData);
        // 获取索引
        var rowIndex = (currentPage - 1) * itemsPerPage + row.rowIndex - 1;
        if (showAllItem) {
            // 若是展示所有数据
            // 更新数据缓存
            allPOI[rowIndex].pname = pname;
            allPOI[rowIndex].X_gcj02 = X_gcj02;
            allPOI[rowIndex].Y_gcj02 = Y_gcj02;
            allPOI[rowIndex].rankInChina = rankInChina;
        }
        else {
            // 若只展示部分数据
            var tempPOI = selectedPOI[rowIndex];
            var newrowIndex = tempPOI.pid;
            allPOI[newrowIndex].pname = pname;
            allPOI[newrowIndex].X_gcj02 = X_gcj02;
            allPOI[newrowIndex].Y_gcj02 = Y_gcj02;
            allPOI[newrowIndex].rankInChina = rankInChina;
        }

    });
}

// 切换选择
function switchSelect() {
    // console.log("切换选择");
    allPOI.forEach(function (poi, index) {
        if (poi.checked) {
            allPOI[index].checked = false;
            allPOI[index].selected = "";
        }
        else {
            allPOI[index].checked = true;
            allPOI[index].selected = "selected-row";
        }
    });
    // 更新当前选中项目数组
    changeSelected();
    // 更新页面
    if (showAllItem) changePage(currentPage, allPOI);
    else changePage(currentPage, selectedPOI);
    // changePage(currentPage);

    // 更新当前所选项目数量
    currentSelectedItem = selectedPOI.length;
    disabledClearDelete();


}


// 监听当前选中的项目数量
function disabledClearDelete() {
    // 清除所选内容-按钮
    const clearSelectedBtn = document.getElementById('clearSelectedBtn');
    // 删除所选项-按钮
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    // 判断当前选中数量
    if (currentSelectedItem > 0) {
        clearSelectedBtn.classList.remove('disabled');
        deleteSelectedBtn.classList.remove('disabled');
    } else {
        clearSelectedBtn.classList.add('disabled');
        deleteSelectedBtn.classList.add('disabled');
    }
    // 更新当前选中的项目数量
    const showSelectedNum = document.getElementById("showSelectedNum");
    showSelectedNum.textContent = "（" + currentSelectedItem + "/" + allPOILength + "已选择）";
}

// 清除所有选择
function clearSelected() {
    // console.log("清除所有选择");

    // 消除已经绘制的圆形范围
    if (userDrawObj) {
        // 若存在已绘制的圆形范围
        userDrawObj.setMap(null);
        userDrawObj = null;
        userDrawEditor.close();
        userDrawEditor = null;
    }

    // 更新当前所选项目
    currentSelectedItem = 0;
    disabledClearDelete();
    // 更新POI数据 
    allPOI.forEach(function (poi, index) {
        allPOI[index].checked = false;
        allPOI[index].selected = "";
    });
    // 更新当前选中的项目数组
    selectedPOI = [];
    // 更新未选中的项目数据
    noselectedPOI = allPOI;
    // 更新表格页面
    if (showAllItem) changePage(currentPage, allPOI);
    else changePage(currentPage, selectedPOI);

    // 高德地图重新加载点
    showPOI();
}

// 更新当前选中的POI数组
function changeSelected() {
    selectedPOI = [];
    noselectedPOI = [];
    // 更新当前选择的POI数组
    for (var i = 0; i < allPOI.length; i++) {
        // 忽略已经删除的POI
        if (allPOI[i].deleted) continue;

        if (allPOI[i].checked) selectedPOI.push(allPOI[i]);
        else noselectedPOI.push(allPOI[i]);
    }

    // console.log(selectedPOI);

    // 高德地图重新加载点
    showPOI();
}


// 删除所选项
function deleteSelected() {
    // console.log("删除所选项");
    // 开始迭代数据
    for (let i = allPOI.length - 1; i >= 0; i--) {
        const poi = allPOI[i];
        if (poi.checked) {
            // 删除该poi
            // allPOI.splice(i, 1);
            allPOI[i].deleted = "true";
            allPOI[i].checked = "false";
            allPOI[i].selected = "";
            // 更新POI总数
            allPOILength--;
        }
    }

    // 更新当前选中的项目数组
    selectedPOI = [];
    // 更新未选中的项目数据
    noselectedPOI = allPOI;
    // 更新表格页面
    if (showAllItem) changePage(currentPage, allPOI);
    else changePage(currentPage, selectedPOI);
    // changePage(currentPage);

    // 更新当前所选项目
    currentSelectedItem = 0;
    disabledClearDelete();

    // // 高德地图重新加载点
    // showPOI();
}

// 显示全部项目
function tableShowAllRecords() {
    var tableShowAllRecordsBtn = document.getElementById("tableShowAllRecordsBtn");
    var tableShowSelectedRecordsBtn = document.getElementById("tableShowSelectedRecordsBtn");
    // var tableShowRangeRecordsBtn = document.getElementById("tableShowRangeRecordsBtn");
    tableShowAllRecordsBtn.classList.add("selected");
    tableShowSelectedRecordsBtn.classList.remove("selected");
    // tableShowRangeRecordsBtn.classList.remove("selected");
    showAllItem = true;
    changePage(currentPage, allPOI);
    // 高德地图重新加载点
    // showPOI();
}

// 显示当前视图内的记录
function tableShowRangeRecords(){

}

// 仅显示选中的项目
function tableShowSelectedRecords() {
    var tableShowAllRecordsBtn = document.getElementById("tableShowAllRecordsBtn");
    var tableShowSelectedRecordsBtn = document.getElementById("tableShowSelectedRecordsBtn");
    // var tableShowRangeRecordsBtn = document.getElementById("tableShowRangeRecordsBtn");
    tableShowAllRecordsBtn.classList.remove("selected");
    tableShowSelectedRecordsBtn.classList.add("selected");
    // tableShowRangeRecordsBtn.classList.remove("selected");
    showAllItem = false;
    changePage(currentPage, selectedPOI);
    // 高德地图重新加载点
    // showPOI();
}