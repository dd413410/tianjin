layui.define(["urls", "func", "form"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		func = layui.func;
	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form;


	var userId = func.locaStr("id"),
		is = 1;

	var para = {
		ofCountry: "",
		ofArea: "",
		ofCenter: ""
	};

	// 获取人员详情
	var userData = null;

	function getUserFn() {
		http({
			url: url.infochange,
			data: {
				id: userId
			},
			async: false,
			type: "get",
			success: function(res) {
				userData = res.data;
				var data = userData.fields;
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
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>';
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
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>';
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
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>';
				};
				$("#ofCenter").html(str);
				layForm.render("select");
				is == 1 ? setDataFn() : "";
			}
		});
	};
	// 赋值
	function setDataFn() {
		var data = userData.fields;
		var duty = data.onDuty.split(",");
		var check = $("#duty").find('input[type="checkbox"]');
		for (var d = 0; d < duty.length; d++) {
			var m = duty[d];
			for (var k = 0; k < check.length; k++) {
				var v = check[k].value;
				if (v == m) {
					$(check[k]).attr('checked', true);
				}
			}
		};
		layForm.val('layForm', {
			"id": userData.pk,
			"personnel": data.personnel,
			"ofCountry": data.ofCountry,
			"ofArea": data.ofArea,
			"ofCenter": data.ofCenter,
			"description": data.description
		});
		is = 2;
	}
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

	layForm.on('submit(sub)', function(data) {
		var data = data.field;
		data.ofStation = data.ofCenter ? data.ofCenter : data.ofArea ? data.ofArea : data.ofCountry;
		var arr = [];
		$("#duty").find("input[type=checkbox]").each(function() {
			var is = $(this).is(":checked");
			if (is) {
				var val = $(this).val();
				arr.push(val);
			}
		});
		var str = arr.join(",");
		data.onDuty = str;
		http({
			url: url.infochange,
			type: 'post',
			data: data,
			success: function(res) {
				lay.msg("修改人员信息成功");
				setTimeout(function() {
					$('#close').click();
				}, 1500);
			}
		});
		return false;
	});
	$('#close').click(function() {
		parent.getListFn();
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("infoChange", {})
});
