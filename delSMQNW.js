// 功能: 删除 扫描全能王 中的二维码，文字，链接的 显示（二维码图片，字体啥的还在里面）
// 用法: mutool run delSMQNW.js input.pdf
// 文档: https://mupdf.readthedocs.io/en/latest/mupdf-js.html
// TODO: 删除无用obj，例如Font

var iName = scriptArgs[0];

var doc = new mupdf.PDFDocument(iName);

doc.setMetaData('Author',   'xxxx');
doc.setMetaData('Producer', 'oooo');

var pageCount = doc.countPages();

//print('# trailer:', doc.getTrailer());


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
	oPage.Contents.writeRawStream( getBufferQ2(newW, newH, newX, newY, maxName) );

//	oPage.get('Resources').get('XObject').get(maxName).readRawStream().save(n+'_'+maxName+'.jpg'); // 输出图片
//	var jpg = doc.loadImage( oPage.get('Resources').get('XObject').get(maxName) );

	if ( null != oPage.get('Annots') ) { // 有链接删除
		doc.deleteObject(oPage.get('Annots')[0].asIndirect()); // 删除底层对象, TODO: annots里面可能不止一个
		oPage.delete('Annots'); // 删除字典中某元素
	}

	if ( null != oPage.get('Resources').get('Font') ) { // 有字体删除字体, TODO: 不一定是F1，还需要递归找到关联obj
		doc.deleteObject(oPage.get('Resources').get('Font').get('F1').asIndirect()); // 删除底层对象
		oPage.get('Resources').delete('Font'); // 删除字典中某元素
	}

	if ( null != oPage.get('Resources').get('XObject').get('X1') ) { // 删除图片 X1, TODO: 不一定是X1
		doc.deleteObject(oPage.get('Resources').get('XObject').get('X1').asIndirect()); // 删除底层对象
		oPage.get('Resources').get('XObject').delete('X1'); // 删除字典中某元素
	}

	// 显示指令部分，只保留X2
//	oPage.Contents.writeRawStream( getBufferQ8(pageW, pageH, 'X2') ); // 只保留X2, TODO: 不一定名字是X2
//	oPage.Contents.writeRawStream( getBufferQ9( oPage.Contents.readRawStream().asString() ) );

}

doc.save(iName + 'mod.pdf');


// --------------------- 函数

function getBufferQ2(cmA, cmD, cmE, cmF, imgName) {
	var buffer = new mupdf.Buffer();
	buffer.writeLine('q');
	buffer.writeLine(cmA + ' 0 0 ' + cmD + ' ' + cmE + ' ' + cmF + ' cm');
	buffer.writeLine('/' + imgName + ' Do');
	buffer.writeLine('Q');
	return buffer;
}


// 可能无用

function getBufferQ8(cmA, cmD, imgName) {
	var buffer = new mupdf.Buffer();
	buffer.writeLine('q');
	buffer.writeLine(cmA + ' 0 0 ' + cmD + ' 0 0 cm');
	buffer.writeLine('/' + imgName + ' Do');
	buffer.writeLine('Q');
	return buffer;
}


function getBufferQ9(bufStr) {
	var buffer = new mupdf.Buffer();
	var qBlocks = extractQBlocks(bufStr);
	var lines = qBlocks[0].split(/\r\n|\r|\n/);
	for ( var ln = 0; ln < lines.length; ln++ ) {
	    buffer.writeLine(lines[ln]);
	}
	return buffer;
}

function extractQBlocks(bufStr) {
	var regex = /q([\s\S]*?)Q/g ; // 匹配最外层的q...Q块（非贪婪模式）
	var matches = [];

	var match;
	while ((match = regex.exec(bufStr)) !== null) {
		if ( match[0].indexOf('/X1 ') == -1 ) { // 删除X1，这个可能有BUG
			matches.push(match[0]); // 完整匹配（包括q和Q）
		}
		// 若只需中间内容，使用match[1]
	}

    return matches;
}


/*

//			另一种删除链接的方法
	var pPage = doc.loadPage(n) ; // ret: PDFPage: 抽象出的Page
//	print("# ", pPage.getBounds());
	var links = pPage.getLinks();
//	print('- Page', n, ": Links Len =", links.length, ", Link[0] =", links[0].getURI());
	pPage.deleteLink(links[0]); // 删除链接

*/


