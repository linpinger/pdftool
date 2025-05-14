// 功能: 提取 扫描全能王 中的图片，生成新PDF
// 用法: mutool run newSMQNW.js input.pdf
// 文档: https://mupdf.readthedocs.io/en/latest/mupdf-js.html

var iName = scriptArgs[0];

var doc = new mupdf.PDFDocument(iName);
var pdf = new mupdf.PDFDocument(); // 保存到新PDF中

var pageCount = doc.countPages();

for (var n = 0; n < pageCount; ++n) {
	var oPage = doc.findPage(n).resolve(); // ret: PDFObject :更接近底层原始结构
	var pageW = oPage.get('MediaBox')[2];
	var pageH = oPage.get('MediaBox')[3];

//	print("#"+n, oPage);
//	oPage.forEach(function(value,key){console.log("- "+key+" : "+value)});

	// 最大图片(比较宽度)的信息，重设图片比例并居中
	var maxName = '';
	var maxWidth = 0;
	var maxHeight = 0;
	oPage.get('Resources').get('XObject').forEach(function(v,k){
//		print('- ', k, ":", v.resolve());
		if ( v.resolve().get('Width') >= maxWidth ) {
			maxName = k;
			maxWidth = v.resolve().get('Width');
			maxHeight = v.resolve().get('Height');
		}
//		v.resolve().forEach(function(vv,kk){ print('  - ', kk, ":", vv); });
	});
	var newW = maxWidth / maxHeight * pageH;
	var newH = maxHeight / maxWidth * pageW;
	var newX = ( pageW - newW ) / 2;
	var newY = ( pageH - newH ) / 2;
	if ( newW > pageW ) { newW = pageW; newX = 0; }
	if ( newH > pageH ) { newH = pageH; newY = 0; }
//	print('--', maxName, maxWidth, maxHeight, pageW, pageH);
//	print('--', maxName, newW, newH, newX, newY);

	// 最大图片写入新pdf中
	var jpg = doc.loadImage( oPage.get('Resources').get('XObject').get(maxName) );
	var resources = pdf.addObject({ XObject: { ImX: pdf.addImage(jpg) } });
	var contents = "q " + newW + " 0 0 " + newH + " " + newX + " " + newY + " cm /ImX Do Q";
	var page = pdf.addPage([0, 0, pageW, pageH], 0, resources, contents);
	pdf.insertPage(-1, page);

}

pdf.save(iName + 'new.pdf', "pretty,compress-images");


