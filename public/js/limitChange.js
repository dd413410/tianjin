layui.define(["urls", "func", "form"], function(e) {

	var http = layui.urls.http,
		url = layui.urls.url,
		func = layui.func;

	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form;

	var limitId = func.locaStr("id"),
		is = 1;
	var para = {
		ofCountry: "",
		ofArea: "",
		ofCenter: ""
	};

	// 获取用户详情
	var liminData = null;

	function getUserFn() {
		http({
			url: url.climit,
			data: {
				id: limitId
			},
			async: false,
			type: "get",
			success: function(res) {
				liminData = res.data;
				var data = liminData.fields;
				para.ofCountry = data.ofCountry;
				para.ofArea = data.ofArea;
				para.ofCenter = data.ofCenter;
				getYiFn();
			}
		});
	};
	getUserFn();


	// 一级所属站
	window.getYiFn = function() {
		http({
			url: url.infotype,
			type: 'get',
			data: {},
			async: false,
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#ofCountry").html(str);
				getErFn();
			}
		});
	};

	// 二级所属站
	window.getErFn = function() {
		http({
			url: url.infotype,
			type: 'post',
			data: {
				type: para.ofCountry
			},
			async: false,
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#ofArea").html(str);
				getSanFn();
			}
		});
	};
	// 三级所属站
	window.getSanFn = function() {
		http({
			url: url.infstype,
			type: 'get',
			data: {
				type: para.ofArea
			},
			async: false,
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#ofCenter").html(str);
				layForm.render("select");
				is == 1 ? setDataFn() : "";
			}
		});
	};

	function setDataFn() {
		var data = liminData.fields;
		layForm.val('layForm', {
			"id": liminData.pk,
			"userName": data.userName,
			"limit": data.limit,
			"ofCountry": data.ofCountry,
			"ofArea": data.ofArea,
			"ofCenter": data.ofCenter
		});
		is = 2;
	};
	// 检索框选择
	layForm.on('select(filt)', function(data) {
		var t = data.othis[0];
		var id = $(t).prev().attr('id');
		para[id] = data.value;
		var fn = $(t).prev().attr('fn');
		if (fn == undefined) {
			return false;
		};
		window[fn]();
		return false;
	});


	layForm.on('submit(addSub)', function(data) {
		var data = data.field;
		data.ofStation = data.ofCenter ? data.ofCenter : data.ofArea ? data.ofArea : data.ofCountry;
		delete data.newPass2;
		delete data.userName;
		var passWord = data.passWord;
		if (passWord == "") {
			delete data.passWord;
			delete data.newPass;
		};
		http({
			url: url.climit,
			data: data,
			type: "post",
			success: function(res) {
				lay.msg("修改成功!");
				setTimeout(function() {
					$('#close').click();
				}, 1500);
			}
		});
		return false;
	});
	// 正则验证
	layForm.verify({
		userName: function(val) {
			var userReg = /[a-zA-Z][1-9\._]*/;
			if (!func.trimFn(val) || !userReg.test(val)) {
				return '请输入账号,不可存在汉字或全为数字';
			} else {
				if (val.length > 8 || val.length < 5) {
					return '账号长度请保持在5-8位';
				}
			}
		},
		passWord: function(val) {
			if (func.trimFn(val) && val.length < 4 || val.length > 20) {
				return '请输入4位以上20位以下的密码,并且不可存在空格';
			};
		},
		newPass: function(val) {
			var passWord = $('#passWord').val();
			if (func.trimFn(passWord) && !func.trimFn(val)) {
				return '请输入新密码';
			}
		},
		newPass2: function(val) {
			var newPass = $('#newPass').val();
			if (newPass != val) {
				return '两次密码不一致,请重新输入';
			}
		}
	});



	$('#close').click(function() {
		parent.getListFn();
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);

	});
	e("limitChange", {})
});
