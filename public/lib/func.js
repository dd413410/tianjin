layui.define(['jquery'], function (exports) {
	var $ = layui.$;
	var func = {
		locaStr: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURI(r[2]);
			return null;
		},
		initDate: function () {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var d = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
			var dateStr = y + '-' + m + '-' + d;
			return dateStr;
		},
		initM: function () {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var init = y + '-' + m;
			return init;
		},
		initH: function () {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var d = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
			var h = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();

			var dateStr = y + '-' + m + '-' + d + '-' + h;
			return dateStr;
		},
		reg: function (val) {
			return (/^1[3456789]\d{9}$/.test(val))
		},
		trimFn: function (name) {
			var reg = /\S/;
			if (!name) {
				return false;
			} else {
				name.trim();
				return reg.test(name);
			}
		},
		user: function (val) {
			return (/^[\u4E00-\u9FA5a-zA-Z]*$/.test(val))
		},
		base: function () {
			var curPath = window.document.location.href;
			var pathName = window.document.location.pathname;
			var pos = curPath.indexOf(pathName);
			var localhostPath = curPath.substring(0, pos);
			var projectName = pathName.substring(
				0,
				pathName.substr(1).indexOf("/") + 1
			);
			var url = localhostPath + projectName;
			return url;
		}
	};

	exports('func', func);
});
