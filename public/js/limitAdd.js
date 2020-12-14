layui.define(["urls", "func", "form", "laypage"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		func = layui.func;

	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form;
		
	var para = {
		oneId: "",
		twoId: "",
		threeId: ""
	};
	// 一级所属站
	window.getYiFn = function() {
		http({
			url: url.infotype,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value="' + data[i].pk + '">' + dataItem.station + '</option>'
					} else {
						str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
					};
				};
				$("#oneId").html(str);
				layForm.render("select");
				para.oneId = data.length > 0 ? data[0].pk : "";
				getErFn();
			}
		});
	};
	getYiFn();
	// 二级所属站
	window.getErFn = function() {
		http({
			url: url.infotype,
			type: 'post',
			data: {
				type: para.oneId
			},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value="' + data[i].pk + '">' + dataItem.station + '</option>'
					} else {
						str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
					};
				};
				$("#twoId").html(str);
				layForm.render("select");
				para.twoId = data.length > 0 ? data[0].pk : "";
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
				type: para.twoId
			},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value="' + data[i].pk + '">' + dataItem.station + '</option>'
					} else {
						str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
					};
				};
				$("#threeId").html(str);
				layForm.render("select");
			}
		});
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
		delete data.newPass;
		http({
			url: url.limitAdd,
			data: data,
			type: "post",
			success: function(res) {
				lay.msg("添加用户成功!");
				setTimeout(function(){
					$('#close').click();
				},1500);
			}
		})
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
			if (!func.trimFn(val) || val.length < 4 || val.length > 20) {
				return '请输入4位以上20位以下的密码,并且不可存在空格';
			}
		},
		newPass: function(val) {
			var pass = $('#pass').val();
			if (pass != '' && val !== pass) {
				return '两次输入密码不一致';
			}
		},
	});
	/*
	    @@@添加和修改页面的关闭按钮
	*/
	$('#close').click(function() {
		parent.getListFn();
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);

	});
	e("limitAdd", {})
});
