layui.define(["urls", "dtree", "form", "laypage"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		dtree = layui.dtree;

	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form,
		laypage = layui.laypage;

	var page = 1,
		pageSize = 10,
		user = '';
	window.getListFn = function() {
		$("#tbody").empty();
		http({
			url: url.limitList,
			data: {
				name: user,
				pageNum: page,
				pageSize: pageSize
			},
			success: function(res) {
				var data = res.data;
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					var item = dataItem.fields;
					var deta = JSON.stringify(dataItem).replace(/"/g, '&quot;');
					var limit = item.limit == 1 ? "管理员" : "普通用户";
					var str = '<div class="tbody">' +
						'<div class="layui-col-xs3">' + item.userName + '</div>' +
						'<div class="layui-col-xs3">' + limit + '</div>' +
						'<div class="layui-col-xs3">' + item.Time + '</div>' +
						'<div class="layui-col-xs3">' +
						'<img onclick="limitFn(1,' + deta + ')" src="../static/3.png" title="站点分配" />' +
						'<img onclick="openFn(' + dataItem.pk + ')" src="../static/2.png" title="修改信息" />' +
						'<img onclick="deleFn(' + dataItem.pk + ')" src="../static/4.png" title="删除" />' +
						'</div>' +
						'</div>';
					$("#tbody").append(str);
				};
				var count = res.count;
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
		})
	};
	getListFn();
	// 查询按钮
	window.getFn = function() {
		page = 1, user = $("#user").val();
		getListFn();
	};
	// 添加还是修改,有ID则去修改,无ID则去添加
	window.openFn = function(id) {
		var url = id ? "./limitChange.html?id=" + id : "./limitAdd.html";
		lay.open({
			type: 2,
			title: false,
			closeBtn: 0,
			id: "id",
			area: ["500px", "520px"],
			content: url
		});
	};
	// 站点分配
	var listItem = null;
	var layTree = null;
	window.limitFn = function(x, obj) {
		if (x == 0) {
			lay.close(layTree);
			return false;
		};
		listItem = obj;
		getTreeFn();
	};

	function getTreeFn() {
		http({
			url: url.limittree,
			success: function(res) {
				var data = res.data;
				var DTree = dtree.render({
					elem: "#elemTree",
					dataStyle: "layuiStyle",
					width: 310,
					data: data,
					initLevel: 5,
					skin: "laySimple",
					nodeIconArray: {
						"3": {
							"open": "dtree-icon-jian",
							"close": "dtree-icon-jia"
						}
					},
					ficon: ["3", "7"],
					checkbar: true,
					checkbarType: "all",
					done: function() {
						dtree.chooseDataInit("elemTree", listItem.fields.stations);
					}
				});

				layForm.val('limitForm', {
					"id": listItem.pk,
					"userName": listItem.fields.userName
				});

				layTree = lay.open({
					type: 1,
					title: false,
					closeBtn: 0,
					resize: false,
					shade: 0.5,
					id: "1",
					area: ['400px', '500px'],
					shadeClose: false,
					content: $('#limit')
				});
			}
		});
	};
	layForm.on('submit(elBtn)', function(data) {
		var dom = dtree.getCheckbarNodesParam("elemTree");
		var arr = [];
		for (var i = 0; i < dom.length; i++) {
			arr.push(dom[i].nodeId)
		};
		var data = data.field;
		data.stations = arr.join(",");
		delete data.userName;
		http({
			url: url.limittree,
			type: "post",
			data: data,
			success: function(res) {
				lay.msg("修改成功!");
				limitFn('0');
				getListFn();
			}
		})
		return false;
	});
	// 删除
	window.deleFn = function(id) {
		var infoMsg = lay.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: url.limitDele,
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
	$('#close').click(function() {
		parent.alrFns();
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("limit", {})
});
