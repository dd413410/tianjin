layui.define(["urls", "form", "laypage"], function(e) {
	var urls = layui.urls,
		http = urls.http,
		url = urls.url;

	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form,
		laypage = layui.laypage;
	//乱七八糟的在最下面,监听按钮,验证等

	var page = 1,
		pageSize = 10;
	var obj = {
		oneId: "",
		twoId: "",
		threeId: "",
		fourId: "",
		fiveId: ""
	};
	// 一级检索接口
	(function() {
		http({
			url: url.sitelisttype,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.title + '</option>'
				};
				$("#oneId").html(str);
				layForm.render("select");
				obj.oneId = data.length > 0 ? data[0].pk : "";
				getErFn();
			}
		});
	})();
	// 二级检索接口
	window.getErFn = function() {
		http({
			url: url.sitelisttype,
			type: 'post',
			data: {
				type: obj.oneId
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.title + '</option>'
				};
				$("#twoId").html(str);
				layForm.render("select");
				obj.twoId = data.length > 0 ? data[0].pk : "";
				getSanFn();
			}
		});
	};
	// 三级检索接口
	window.getSanFn = function() {
		http({
			url: url.sitelistsype,
			type: 'get',
			data: {
				type: obj.oneId,
				ofAreaCenter: obj.twoId
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#threeId").html(str);
				layForm.render("select");
				obj.threeId = data.length > 0 ? data[0].pk : "";
				getSiFn();
			}
		});
	};
	// 四级检索接口
	window.getSiFn = function() {
		http({
			url: url.sitelistsype,
			type: 'post',
			data: {
				type: obj.oneId,
				ofAreaCenter: obj.twoId,
				ofArea: obj.threeId
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#fourId").html(str);
				layForm.render("select");
				obj.fourId = data.length > 0 ? data[0].pk : "";
				getWuFn();
			}
		});
	};
	// 五级检索接口
	window.getWuFn = function() {
		http({
			url: url.sitelist,
			type: 'get',
			data: {
				type: obj.oneId,
				ofAreaCenter: obj.twoId,
				ofArea: obj.threeId,
				ofCenter: obj.fourId
			},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">全部</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#fiveId").html(str);
				layForm.render("select");
				obj.fiveId = "";
			}
		});
	};
	// 检索框选择
	layForm.on('select(filt)', function(data) {
		var t = data.othis[0];
		var fn = $(t).prev().attr('fn');
		var id = $(t).prev().attr('id');
		obj[id] = data.value;
		if (fn == undefined) {
			return false;
		};
		window[fn]();
		return false;
	});
	window.getListFn = function() {
		$('#tbody').empty();
		var data = {
			type: obj.oneId,
			ofAreaCenter: obj.twoId,
			ofArea: obj.threeId,
			ofCenter: obj.fourId,
			id: obj.fiveId,
			pageNum: page,
			pageSize: pageSize,
		};
		http({
			url: url.sitelist,
			type: 'post',
			data: data,
			success: function(res) {
				$('#tbody').empty();
				var data = res.data;
				var count = res.count;
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					var d = dataItem.default;
					var imgSrc = d == 1 ? '../static/51.png' : '../static/52.png';
					var str =
						'<div class="tbody">' +
						'<div class="layui-col-xs1">' + dataItem.station + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.stationType + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.stationCode + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.stationNumCode + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.stationNum + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.lookType + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.lon + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.lat + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.hans + '</div>' +
						'<div class="layui-col-xs1">' + dataItem.ip + '</div>' +
						'<div class="layui-col-xs2">' +
						'<img onclick="clickFn(' + data[i].pk + ')" src="' + imgSrc + '" title="设置默认站点" />' +
						'<img onclick="openFn(' + data[i].pk + ')" src="../static/2.png" title="修改信息" />' +
						'<img onclick="deleFn(' + data[i].pk + ')" src="../static/4.png" title="删除" />' +
						'</div>' +
						'</div>';
					$('#tbody').append(str);
				};
				data = '';
				laypage.render({
					elem: 'pag',
					count: count,
					limit: pageSize,
					curr: page,
					theme: '#5a98de',
					jump: function(obj, is) {
						if (!is) {
							page = obj.curr;
							getListFn();
						}
					}
				});
			}
		});
	};
	// 查询按钮调取站点列表接口
	window.getFn = function() {
		page = 1;
		getListFn();
	};
	// 导出
	window.getFns = function() {
		urls.load("get", url.siteDownload);
	};
	// 设置默认站点
	window.clickFn = function(id) {
		var infoMsg = lay.msg('是否将该站点设为默认站点?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: url.sitedefault,
					type: 'post',
					data: {
						id: id
					},
					success: function(res) {
						lay.msg('设置成功！');
						lay.close(infoMsg);
						getListFn();
					}
				});
			},
			btn2: function() {
				lay.msg('已取消设置。');
			}
		});
	};

	// 添加还是修改,有ID则去修改,无ID则去添加
	window.openFn = function(id) {
		var url = id ? "./siteChange.html?id=" + id : "./siteAdd.html";
		lay.open({
			type: 2,
			title: false,
			closeBtn: 0,
			id: "id",
			area: ["880px", "600px"],
			content: url
		});
	};
	/*
	    @@删除
	*/
	window.deleFn = function(id) {
		var infoMsg = lay.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: url.sitedele,
					type: 'post',
					data: {
						id: id
					},
					success: function(res) {
						lay.msg('删除成功！');
						lay.close(infoMsg);
						getListFn();
					}
				});
			},
			btn2: function() {
				lay.msg('已取消删除。');
			}
		});
	};

	/*
	    @@@添加和修改页面的关闭按钮
	*/
	$('#close').click(function() {
		parent.alrFns();
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	});
	e("site", {})
});
