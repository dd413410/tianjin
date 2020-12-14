layui.define(["urls", "func", "form", "laydate", "laypage", "laytpl"], function(e) {
	var urls = layui.urls,
		http = urls.http,
		url = urls.url,
		func = layui.func;
	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form,
		laydate = layui.laydate,
		laypage = layui.laypage,
		laytpl = layui.laytpl;

	var start = func.initDate();
	var end = func.initDate();

	laydate.render({
		elem: '#time',
		range: "~",
		max: func.initDate(),
		format: 'yyyy-MM-dd',
		value: func.initDate() + "\xa0" + "~" + "\xa0" + func.initDate(),
		btns: ['confirm'],
		done: function(v) {
			var idx = v.indexOf('~');
			start = v.substring(0, idx).trim();
			end = v.substring(idx + 1).trim();
		}
	});
	var aid = '';

	function getMenuFn() {
		http({
			url: url.dataMenu,
			type: 'get',
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					str += '<option value=' + dataItem.pk + '>' + dataItem.fields.title + '</option>';
				};
				$("#area").html(str);
				layForm.render("select");
				if (data.length > 0) {
					aid = data[0].pk;
					getMenuFns();
				}
			}
		})
	};
	getMenuFn();

	layForm.on("select(filtArea)", function(e) {
		aid = e.value;
		getMenuFns();
	})



	function getMenuFns() {
		$("#center").empty();
		http({
			url: url.dataMenu,
			type: 'post',
			data: {
				id: aid
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					str += '<option value=' + dataItem.pk + '>' + dataItem.fields.station + '</option>';
				};
				$("#center").html(str);
				layForm.render("select");
			}
		})
	};

	function getTypeFn() {
		http({
			url: url.dataType,
			type: 'get',
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					str += '<option value=' + dataItem.pk + '>' + dataItem.fields.Type + '</option>';
				};
				$("#type").html(str);
				layForm.render("select");
			}
		})
	};
	getTypeFn();

	var page = 1,
		pageSize = 10;

	function getListFn() {
		$("#tbody").empty();
		http({
			url: url.dataList,
			type: 'get',
			data: {
				id: $("#center").val(),
				type: $("#type").val(),
				start: start,
				end: end,
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

	$("#query").click(function() {
		page = 1;
		getListFn();
	});
	$("#load").click(function() {
		urls.load("post", url.dataList, {
			id: $("#center").val(),
			type: $("#type").val(),
			start: start,
			end: end,
		});
	});
	
	window.toSumFn = function() {
		layer.open({
			type: 2,
			title: false,
			shade: 0.8,
			closeBtn: 0,
			area: ["1320px", "680px"],
			scrollbar: false,
			content: "./sum.html",
		});
	};
	$('#close').click(function() {
		parent.alrFns();
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});

	e("rates", {})
});
