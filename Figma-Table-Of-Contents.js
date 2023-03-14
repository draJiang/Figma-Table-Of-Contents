////////////////////////////
// author: jzl666@gmail.com
// site: https://notes.dabing.one/
////////////////////////////

// 判断是否在 Figma 文件中打开
console.log(window.location.href);
if (window.location.href.indexOf("figma.com") < 0) {
    // 提示到 Figma 中打开
    if (document.querySelector(".msg_box")) {
        document.querySelector(".msg_box").innerHTML = "⚠️ Please open it in Figma file ⚠️";
    }
}

// 忽略隐藏的图层
figma.skipInvisibleInstanceChildren = true;

// 创建 UI
let windowEl = ui();

// 设置样式
if (windowEl.querySelector("style") != true) {
    let my_style = document.createElement("style");
    windowEl.appendChild(my_style);

    my_style.innerHTML = `
  
    ::-webkit-scrollbar{
        width: 6px;
        padding:2px;
        background-color:none;
    }
    ::-webkit-scrollbar-thumb {
      
      background-color:var(--color-scrollbar);
      border-radius: 100px;
    }
    ::-webkit-scrollbar-thumb:hover {
      opacity:0.8;
    }

    @media (prefers-color-scheme: dark){
        .close_btn {
            fill: var(--color-text, rgba(255, 255, 255, .8));
        }
    }

    @media (prefers-color-scheme: light){
        .close_btn {
            fill: var(--color-text, rgba(0, 0, 0, .8));
        }
    }

    .close_btn {
        display: flex;
        cursor: pointer;
        text-align: center;
        position
        margin-left: 4px;
        padding: 4px;
      }

    .close_btn svg {
        display:inline-block;
    }

    .result_list {
        overflow: scroll;
        padding: 10px;
    }

    .result_list li {
        margin-bottom:4px;
        cursor: default;
        padding: 4px;
    }

    .result_list li:hover {
        background-color:var(--color-bg-hover, #f0f0f0);
    }

    .result_list .h2 {
        padding-left: 14px;
    }

    .result_list .active {
        border: 1px dashed #ccc;
        border-radius: 2px;
    }

    .titleBox {
        display: flex;
        flex-direction: row-reverse;
        padding: 0 2px;
        box-shadow: 0 1px 0 0 var(--color-border, rgba(0, 0, 0, .1));
    }

  
  `;
}

// 创建 UI
function ui() {
    if (document.querySelector(".my_figma_search")) {
        return;
    }

    // 主容器
    let windowEl = document.createElement("div");
    windowEl.classList.add("my_figma_search");
    // 添加后滚动列表将不被画布截获
    windowEl.classList.add("js-fullscreen-prevent-event-capture");
    document.body.appendChild(windowEl);

    windowEl.style = `
    position: fixed;
      width: 200px;
      height: 40%;
      max-height: 800px;
      min-height: 400px;
      background-color: var(--color-bg, #fff);
      inset: 0px;
      margin: 52px 244px 10px auto;
      z-index: 111;
      overflow: hidden;
      box-shadow: rgb(20 15 35 / 17%) 0px 2px 4px, rgb(17 17 17 / 14%) 0px 10px 23px;
      border-radius: 4px;
      color: var(--text-primary);
      font-family: sans-serif;
      box-sizing: border-box;
      overflow-y: auto;
      font-size: 14px;
      white-space: break-spaces;
      word-break: break-all;
      overflow: auto;
      background-color: var(--color-bg);
      display: flex;
      flex-direction: column;
      `;

    // 标题栏
    let titleBox = document.createElement("div");
    titleBox.classList.add("titleBox");
    windowEl.appendChild(titleBox);


    // 关闭按钮
    let close = document.createElement("a");
    close.innerHTML =
        '<svg t="1663692441621" class="icon" viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7983" width="18" height="18"><path d="M282.517333 213.376l-45.354666 45.162667L489.472 512 237.162667 765.461333l45.354666 45.162667L534.613333 557.354667l252.096 253.269333 45.354667-45.162667-252.288-253.44 252.288-253.482666-45.354667-45.162667L534.613333 466.624l-252.096-253.226667z" p-id="7984"></path></svg>';
    close.classList.add("close_btn");
    titleBox.appendChild(close);

    close.onclick = function () {
        windowEl.parentNode.removeChild(windowEl);
    };

    // 目录列表
    let list = document.createElement("ul");
    list.classList.add("result_list");

    windowEl.appendChild(list);

    let H2List = search_H2()
    setTableOfContent(H2List)

    console.log(H2List)

    return windowEl;
}

function search_H2() {
    let pages = figma.root.children;
    console.log(pages)

    let H2List = []

    // 遍历所有页面
    pages.forEach(page => {

        let obj = { 'page': page, 'h2': [] }

        // 遍历页面下的直接子元素
        page.children.forEach(node => {

            // 只选择特定名称的节点作为二级目录
            if (node.name.indexOf('H2') > -1) {
                obj.h2.push(node)
            }

        })

        H2List.push(obj)

    });

    return H2List
}

function setTableOfContent(pageList) {

    let tableOfContentBox = document.getElementsByClassName('result_list')[0]

    pageList.forEach(page => {

        // 创建一级目录 //
        let h1 = document.createElement("li");
        h1.classList.add("h1");
        h1.innerText = page.page.name
        // 绑定点击事件
        h1.onclick = function (e) {
            figma.currentPage = page.page;
            setActiveStyle(e.target)
        }
        // 将节点插入目录列表中
        tableOfContentBox.appendChild(h1);


        // 创建二级目录 //
        let H2List = page.h2
        // 根据在画布中的位置进行排序
        console.log('paixu:');
        console.log(H2List);
        H2List = H2List.sort((a, b) => {

            if (a.x < b.x) {
                return -1;
            } else if (a.x > b.x) {
                return 1;
            } else {
                return a.y - b.y;
            }

        })
        console.log(H2List);

        H2List.forEach(item => {

            let tableOfContentItem = document.createElement("li");
            tableOfContentItem.classList.add("h2");
            tableOfContentItem.innerText = item.name

            // 绑定点击事件
            tableOfContentItem.onclick = function (e) {
                console.log(item['name'])
                console.log(item['id'])

                // 跳转到目标图层所在的页面 //

                // 当前页面 ID
                let this_page_id = figma.currentPage.id;

                // 目标图层所在的页面 ID
                let this_node_parent_page_id = "";

                let p = item.parent;
                while (true) {
                    if (p.type === "DOCUMENT") {
                        break;
                    }

                    if (p.type === "PAGE") {
                        this_node_parent_page_id = p.id;
                        break;
                    } else {
                        p = p.parent;
                    }
                }

                if (this_node_parent_page_id != "" && this_page_id != this_node_parent_page_id) {
                    // 点击对象不在当前页面，跳转到对应页面
                    let document_children = figma.root.children;
                    let document_children_length = document_children.length;

                    for (let index = document_children_length - 1; index > -1; index--) {
                        if (document_children[index]["id"] == this_node_parent_page_id) {
                            figma.currentPage = document_children[index];
                            break;
                        }
                    }
                }

                // 画布聚焦到对应的图层 //
                figma.viewport.scrollAndZoomIntoView([item]);

                setActiveStyle(e.target)


            }

            // 将节点插入目录列表中
            tableOfContentBox.appendChild(tableOfContentItem);
        });

    });




}

// 标记上一次点击的对象
function setActiveStyle(target) {
    // 清除其他点击样式
    let h2List = document.getElementsByTagName('li')
    for (let i = 0; i < h2List.length; i++) {
        h2List[i].classList.remove('active')
    }
    console.log(h2List);
    // 添加点击后的样式
    console.log(target)
    target.classList.add('active')
}