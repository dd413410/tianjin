layui.define(["urls", "func", "form", "laypage"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		func = layui.func;
	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form,
		laypage = layui.laypage;
		
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
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
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
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
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
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#threeId").html(str);
				layForm.render("select");
			}
		});
	};
	// 检索框选择
	layForm.on('select(filt)', function(data) {
		infoDeta = null;
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
			url: url.infoadd,
			type: 'post',
			data: data,
			success: function(res) {
				lay.msg("添加人员成功");
				setTimeout(function() {
					$('#close').click();
				}, 1500);
			}
		});
		return false;
	});
	
	layForm.verify({
		personnel: function(val) {
			if (!func.user(val) || val.length <= 0) {
				return '请输入正确的人员姓名!';
			}
		}
	});

	$('#close').click(function() {
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("infoAdd", {})
});
