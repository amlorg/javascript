/*
	textTypeCtrl 文本类型控制
	可以作为事件函数赋给带有text属性的控件，如edittext的onChanging事件，或者作为文本辅助函数来使用
	阿木亮
	2016/2/13

	textTypeCtrl( type[, length[, fnAfterCheck]])
	type:
		文本框字符类型：
			int：	整型
			uint：	无符号整型
			float：	浮点型
			digit：	数字
			alpha：	字母
			varname:变量名
	length:
		可选，文本长度
	fnAfterCheck:
		可选，检测之后才会执行的函数，第一个参数是this(控件本身)或者新的文本，第二个参数是原来的文本

	返回值：
		function
		（1）可以作为事件函数使用如:
			edittext1.onChanging = textTypeCtrl('int', 8, function(e) {
				if(parseInt(e.text) > 100) e.text = '100';
			});
		（2）也可以作为实用的函数使用如：
			var isDigit = textTypeCtrl('digit', 0, function(newText, oldText) {
				return newText == oldText;
			});
			var isValidVarName = textTypeCtrl('varname', 0, function(newText, oldText) {
				return newText == oldText;
			});
			isDigit('123rt56') // false
			isDigit('3445678') // true
			isValidVarName('123abc') // false
			isValidVarName('_abc123') // true
		（3）亦或者仅仅是一个过滤文本的函数：
			var newText = textTypeCtrl('alpha')('12et5yh8'); // newText = 'etyh'

	获取类型：
		textTypeCtrl.getTypes() //返回结果：['int', 'uint', 'float', 'digit', 'alpha', 'varname']
		用户当然可以自己添加类型：
			textTypeCtrl.ctrlFns[your_type_name] = your_ctrl_function;
			your_ctrl_function需要传进一个字符串参数，最后返回一个字符串：
			function your_ctrl_function(oldText) {
				var newText;
				//------your code----------
				return newText;
			}
*/

;var textTypeCtrl = (function() {
if(textTypeCtrl) return textTypeCtrl;
var textTypeCtrl = function(type, length, fn) {
	return function(text) {
		if(this && this.text) text = this.text;
		var newText = textTypeCtrl.ctrlFns[type](text);
		if(length && length > 0 && newText.length > length) newText = newText.substr(0, length);
		if(this && this.text) {
			if(newText != text) this.text = newText;
			if(fn) return fn(this, text);
		}else {
			if(fn) return fn(newText, text);
		}
		return newText;
	}
}
textTypeCtrl.ctrlFns = {
	'int': function(e) {
		var index = e.search(/[\+\-\d]/);
		if(index != -1) {
			var indexStr = e[index];
			e = e.substr(index).match(/\d*/g).join('').match(/\d([1-9]\d*)?/);
			e = e ? e[0] : '';
			if(!indexStr.match(/\d/)) e = indexStr + e;
		}else {
			e = ''
		}
		return e;
	},
	'uint': function(e) {
		return e.match(/\d*/g).join('').match(/([1-9]\d*)?/)[0];
	},
	'float': function(e) {
		var textArr = e.split('.');
		e = textTypeCtrl.ctrlFns['int'](textArr.shift());
		if(textArr.length) {
			e = e + '.' + textTypeCtrl.ctrlFns['digit'](textArr.join(''));
		}
		return e;
	},
	'digit': function(e) {
		return e.match(/\d*/g).join('');
	},
	'alpha': function(e) {
		return e.match(/[a-zA-Z]*/g).join('');
	},
	'varname': function(e) {
		return e.match(/([_a-zA-Z]\w*)?/g).join('');
	},
}
textTypeCtrl.getTypes = function() {
	var types = [];
	for(var i in textTypeCtrl.ctrlFns) {
		types.push(i);
	}
	return types;
}
return textTypeCtrl;
})();
