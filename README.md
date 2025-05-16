# foxtool
放一些PDF工具，脚本，项目

## pic2pdf.js

- 功能: mutool支持的js脚本，用来将 输入的图片，生成 指定页面大小[a3|a4|a5]，页面方向根据图片方向决定 的新PDF

- 用法: `mutool run pic2pdf.js a5 1.jpg 2.png n.jpg`

## newSMQNW.js  推荐用这个

- 功能: mutool支持的js脚本，用来将 扫描全能王 生成的PDF中的 最大图片 提取并生成 干净的新PDF

- 用法: `mutool run newSMQNW.js input.pdf`

- 其他: 见下面

## delSMQNW.js 不推荐使用，删的不干净

- 功能: mutool支持的js脚本，用来将 扫描全能王 生成的PDF中的 二维码，文字，链接移除（不显示，部分对象应该还会残留在PDF中）

- 用法: `mutool run delSMQNW.js input.pdf`

- mutool下载: https://www.mupdf.com/releases  例如: mupdf-1.25.2-windows.zip

- https://mupdf.readthedocs.io/en/latest/mutool-run.html#example-scripts

- https://mupdf.readthedocs.io/en/latest/mupdf-js.html

- 移除水印有两种方法: 移除多余的对象（现有的），或新建PDF（复制image对象）

## mutool 命令行用法

- 打印PDF中的页面为DPI为300的图片: `mutool draw -r 300 -o 300_DPI.png input.pdf`

- 提取pdf中的图片: `mutool extract input.pdf`

- 合并图片为PDF: `mutool convert -o output.pdf input_01.jpg input_01.jpg`

## PDF 文件格式解析

- https://www.cnblogs.com/theyangfan/p/17074647.html

## PDF 一些开源工具

- https://github.com/wmjordan/PDFPatcher

- https://github.com/ArtifexSoftware/mupdf

## PDF 一些开源golang项目

- gofpdf: https://pkg.go.dev/github.com/phpdave11/gofpdf

- gofpdf停更: https://pkg.go.dev/github.com/jung-kurt/gofpdf/v2

- pdfcpu（疑似更擅长cli，API有点蛋疼）: https://pdfcpu.io/

- unipdf（商业产品）

## 其他

- 老马(FreePic2PDF作者): https://www.cnblogs.com/stronghorse

