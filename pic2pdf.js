// 功能: 根据输入的图片，生成 指定页面大小[a3|a4|a5]，页面方向根据图片方向决定 的新PDF
// 用法: mutool run pic2pdf.js a4 1.jpg 2.png
// 其他: mutool extract input.pdf 可以提取pdf中的图片，然后用本脚本或mutool convert -o n.pdf 1.jpg 2.jpg合成新的pdf
// 文档: https://mupdf.readthedocs.io/en/latest/mupdf-js.html

if ( scriptArgs.length < 2 ) { print('Usage: mutool run pic2pdf.js a5 1.jpg 2.png n.jpg'); quit(); }

var pageWH = 4;  // A3=3, A4=4, A5=5
if ( scriptArgs[0] == "a3" ) { pageWH = 3; }
if ( scriptArgs[0] == "a4" ) { pageWH = 4; }
if ( scriptArgs[0] == "a5" ) { pageWH = 5; }

var pdf = new PDFDocument();

for (var i = 1; i < scriptArgs.length; ++i) {
	print('- Add', i, scriptArgs[i]);
	var img = new Image(scriptArgs[i]); var imgW = img.getWidth(); var imgH = img.getHeight();
	var page = pdf.addPage(getMediaBox(pageWH, imgW, imgH), 0, pdf.addObject({ XObject: { ImX: pdf.addImage(img) } }), getContentsStr(pageWH, imgW, imgH));
	pdf.insertPage(-1, page);
}

pdf.save("pic.pdf", "pretty,compress-images");

// -------------

function getMediaBox(pageSize, imgW, imgH) {
	var pageW = 595; var pageH = 842;
	if ( 5 == pageSize ) { if ( imgW > imgH ) { pageW = 595; pageH = 420; } else { pageH = 595; pageW = 420; } }
	if ( 4 == pageSize ) { if ( imgW > imgH ) { pageW = 842; pageH = 595; } else { pageH = 842; pageW = 595; } }
	if ( 3 == pageSize ) { if ( imgW > imgH ) { pageW = 1191; pageH = 842; } else { pageH = 1191; pageW = 842; } }
	return [0, 0, pageW, pageH];
}

function getContentsStr(pageSize, imgW, imgH) {
	var pageW = 595; var pageH = 842;
	if ( 5 == pageSize ) { if ( imgW > imgH ) { pageW = 595; pageH = 420; } else { pageH = 595; pageW = 420; } }
	if ( 4 == pageSize ) { if ( imgW > imgH ) { pageW = 842; pageH = 595; } else { pageH = 842; pageW = 595; } }
	if ( 3 == pageSize ) { if ( imgW > imgH ) { pageW = 1191; pageH = 842; } else { pageH = 1191; pageW = 842; } }
	var newW = imgW / imgH * pageH;
	var newH = imgH / imgW * pageW;
	var newX = ( pageW - newW ) / 2;
	var newY = ( pageH - newH ) / 2;
	if ( newW > pageW ) { newW = pageW; newX = 0; }
	if ( newH > pageH ) { newH = pageH; newY = 0; }
	return "q " + newW + " 0 0 " + newH + " " + newX + " " + newY + " cm /ImX Do Q";
}

