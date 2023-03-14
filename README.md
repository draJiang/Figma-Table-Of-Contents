# Figma-Table-of-Contents

支持根据图层名称自动生成目录，点击可定位。

![工具示意图](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2023-03-1412.08.2320230314120830.png)

## 使用方法

1. 在 Figma 中，在目标 Frame 的名称中添加 `H2` 字符
     ![图层名称添加 H2 字符](https://jiangzilong-image.oss-cn-beijing.aliyuncs.com/uPic/CleanShot2023-03-1412.10.2120230314121047.png)
2. 复制这个链接，添加到书签栏
    ``` javascript
    javascript:(function()%7Bfetch("https://raw.githubusercontent.com/draJiang/Figma-Table-Of-Contents/main/Figma-Table-Of-Contents.js").then((r) %3D> r.text().then((c) %3D> eval(c)))%7D)()
    ```

    ![添加到书签栏的示意图](https://user-images.githubusercontent.com/38482112/190867843-898d7dd0-3502-4ac6-acbb-1492954a061c.png)

3. 点击此书签即可打开工具