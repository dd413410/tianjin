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


	laydate.render({
		elem: '#time',
		range: "~",
		value: func.initDate() + "\xa0" + "~" + "\xa0" + func.initDate(),
		max: func.initDate(),
		btns: ['confirm']
	});
	
	var startTime = func.initDate(),
		endTime = func.initDate(),
		page = 1,
		pageSize = 10;

	(function() {
		http({
			url: url.radarType,
			type: 'get',
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					str += '<option value=' + dataItem.pk + '>' + dataItem.fields.title + '</option>';
				};
				$("#type").html(str);
				layForm.render("select");
				getListFn();
			}
		})
	})();
	
	function getListFn() {
		http({
			url: url.radar,
			type: 'post',
			data: {
				type: $("#type").val(),
				startTime: startTime,
				endTime: endTime,
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
		var time = $("#time").val();
		var idx = time.indexOf("~");
		if(idx==-1){
			lay.msg("请选择日期范围!")
			return false;
		}
		startTime = time.substring(0, idx).trim();
		endTime = time.substring(idx + 1).trim();
		getListFn();
	});
	$("#load").click(function() {
		var time = $("#time").val();
		var idx = time.indexOf("~");
		if(idx==-1){
			lay.msg("请选择日期范围!")
			return false;
		};
		startTime = time.substring(0, idx).trim();
		endTime = time.substring(idx + 1).trim();
		
		urls.load("get", url.radar, {
			type: $("#type").val(),
			startTime: startTime,
			endTime: startTime
		});
	});
	
	$('#close').click(function() {
		parent.alrFns();
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("radar", {})
});
