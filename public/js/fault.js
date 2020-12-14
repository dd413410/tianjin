layui.define(["urls", "form", "laypage", "laytpl"], function(e) {
	// var http = layui.urls.http,
	// 	url = layui.urls.url;

	var urls = layui.urls,
		http = urls.http,
		url = urls.url;

	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form,
		laypage = layui.laypage,
		laytpl = layui.laytpl;


	var look = $("#look").val(),
		type = $("#type").val(),
		page = 1,
		pageSize = 10;

	function getListFn() {
		http({
			url: url.faultlist,
			type: 'get',
			data: {
				name: look,
				type: type,
				pageNum: page,
				pageSize: pageSize
			},
			success: function(res) {
				var data = res.data;
				var count = res.count;
				var getTpl = hand.innerHTML,
					tbody = document.getElementById('tbody');
				laytpl(getTpl).render(data, function(html) {
					tbody.innerHTML = html;
				});
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
	window.getFn = function() {
		look = $("#look").val();
		type = $("#type").val();
		page = 1;
		getListFn();
	};
	$("#load").click(function() {
		urls.load("post", url.faultlist, {
			name: look,
			type: type
		});
	});
	window.openFn = function(id) {
		!id ? $("#add").hide() : "";
		http({
			url: url.faultdata,
			type: 'get',
			data: {
				id: id
			},
			success: function(res) {
				var data = res.data.fields;
				$("#add").show();
				layForm.val('addForm', {
					"id": res.data.pk,
					"station": data.station,
					"dataType": data.dataType,
					"faultType": data.faultType,
					"faultReason": data.faultReason,
					"startTime": data.startTime,
					"handler": data.handler,
					"description": data.description
				});
			}
		});
	};


	layForm.on('submit(sub)', function(data) {
		var data = data.field;
		http({
			url: url.faultchange,
			type: 'post',
			data: data,
			success: function(res) {
				lay.msg('修改成功');
				$("#add").hide();
				getListFn();
			}
		});
		return false;
	});

	window.deleFn = function(id) {
		var infoMsg = lay.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: url.faultdele,
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
	e("fault", {})
});
