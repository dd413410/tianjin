layui.define(["urls", "form", "laypage"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url;
	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form,
		laypage = layui.laypage;

	var arr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
	var retr = "",
		page = 1;

	window.getListFn = function() {
		$("#tbody").empty();
		http({
			url: url.infolist,
			type: 'get',
			data: {
				name: retr,
				pageNum: page,
				pageSize: 10
			},
			success: function(res) {
				var data = res.data;
				var total = res.count;
				$("#total").html(total);
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					var temp = dataItem.onDuty.split(",");
					var day = [];
					for (var d = 0; d < temp.length; d++) {
						day.push(arr[temp[d] - 1]);
					};
					dataItem.onDuty = day.join("，");
					str += '<div class="tbody">' +
						'<div class="layui-col-xs2">' + dataItem.personnel + '</div>' +
						'<div class="layui-col-xs2">' + dataItem.hans + '</div>' +
						'<div class="layui-col-xs3">' + dataItem.onDuty + '</div>' +
						'<div class="layui-col-xs3">' + dataItem.description + '</div>' +
						'<div class="layui-col-xs2">' +
						'<img onclick="openFn(' + data[i].pk + ')" src="../static/2.png" title="修改信息" />' +
						'<img onclick="deleFn(' + data[i].pk + ')" src="../static/4.png" title="删除" />' +
						'</div>' +
						'</div>';
				};
				$("#tbody").html(str);
				data = '';
				laypage.render({
					elem: 'pag',
					count: total,
					limit: 10,
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

	window.getFn = function() {
		retr = $("#retr").val();
		page = 1;
		getListFn();
	};

	// 添加还是修改,有ID则去修改,无ID则去添加
	window.openFn = function(id) {
		var url = id ? "./infoChange.html?id=" + id : "./infoAdd.html";
		lay.open({
			type: 2,
			title: false,
			closeBtn: 0,
			id: "id",
			area: ["680px", "450px"],
			content: url
		});
	};
	// 删除
	window.deleFn = function(id) {
		var infoMsg = lay.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: url.infodele,
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
	e("info", {})
});
