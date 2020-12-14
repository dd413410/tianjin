layui.define(["urls", "dtree", "func", "form", "laypage"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		dtree = layui.dtree,
		func = layui.func;

	var $ = layui.$,
		layer = layui.layer,
		form = layui.form,
		laypage = layui.laypage;

	var limit = sessionStorage.limit;
	limit == 1 ? $("#path").show() : $("#path").hide();

	var types = "";

	function getTreeFn() {
		http({
			url: url.trstree,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				var ids = res.id;
				var DTree = dtree.render({
					elem: "#elemTree",
					dataStyle: "layuiStyle",
					width: 320,
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
					checkbarType: "self",
					done: function() {
						dtree.chooseDataInit("elemTree", ids);
					}
				});
			}
		});
	};
	getTreeFn();

	$("#treeBtn").click(function() {
		var dom = dtree.getCheckbarNodesParam("elemTree");
		var arr = [];
		for (var i = 0; i < dom.length; i++) {
			arr.push(dom[i].nodeId)
		};
		var strTree = arr.join(",");
		var loading = null;
		http({
			url: url.recall,
			type: 'get',
			data: {
				data: strTree
			},
			beforeSend: function(bef) {
				loading = layer.load(2, {
					shade: [0.3, '#fff']
				});
			},
			success: function(res) {
				page = 1;
				types = "读取";
				getRigFn();
				layer.close(loading);
			},
			error: function() {
				layer.msg("召回失败!");
				layer.close(loading);
			}
		});
	});
	// 传输文件路径
	$("#path").click(function() {
		layer.open({
			type: 2,
			title: "传输文件路径配置",
			skin: "lay-path",
			shade: 0.8,
			closeBtn: 1,
			area: ["400px", "300px"],
			content: './filePath.html'
		});
	});

	var page = 1,
		pageSize = 10;
	var load = null;

	function getRigFn() {
		$("#treeChek").prop("checked", false);
		http({
			url: url.trstree,
			type: 'post',
			data: {
				pageNum: page,
				pageSize: pageSize,
				type: types
			},
			beforeSend: function(bef) {
				load = layer.load(2, {
					shade: [0.3, '#fff']
				});
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d].fields;
					var type = dataItem.Style + dataItem.Type;
					var btn = type == "读取失败" ? "" :
						'<button type="button" class="layui-btn layui-btn-sm layui-btn-normal" ip=' + dataItem.Ip +
						' name="conf">配置</button>' +
						'<button type="button" class="layui-btn layui-btn-sm layui-btn-normal" ip=' + dataItem.Ip +
						' name="lss">下发</button>';
					str += '<div class="tbody">' +
						'<div class="layui-col-xs2">' +
						'<input type="checkbox" lay-skin="primary" ip=' + dataItem.Ip + '>' +
						'</div>' +
						'<div class="layui-col-xs3">' + dataItem.station + '</div>' +
						'<div class="layui-col-xs3">' + dataItem.Ip + '</div>' +
						'<div class="layui-col-xs2">' + dataItem.Style + dataItem.Type + '</div>' +
						'<div class="layui-col-xs2">' + btn + '</div>' +
						'</div>';
				};
				$("#tbody").html(str);
				layer.close(load);
				form.render("checkbox");
				var count = res.count;
				laypage.render({
					elem: 'pag',
					count: count,
					limit: 10,
					curr: page,
					theme: '#5a98de',
					jump: function(obj, is) {
						if (!is) {
							page = obj.curr;
							types = "";
							$("#treeChek").prop("checked", false);
							getRigFn();
						}
					}
				});
			},
			error: function() {
				layer.msg("加载失败!")
				layer.close(load);
			}
		});
	};
	getRigFn();


	//配置
	$("#tbody").on("click", "[name=conf]", function() {
		var ip = $(this).attr("ip");
		if (!ip) {
			layer.msg("请设置IP");
			return false;
		};
		var url = './conf.html?ip=' + ip;
		layer.open({
			type: 2,
			title: false,
			shade: 0.8,
			closeBtn: 0,
			area: ["1320px", "680px"],
			content: url
		});
	});
	//下发
	$("#tbody").on("click", "[name=lss]", function() {
		var ip = $(this).attr("ip");
		if (!ip) {
			layer.msg("请设置IP");
			return false;
		};
		recallFn(ip);
	});

	// 批量下发
	$("#batch").click(function() {
		var $dom = $("#tbody").find($("input[type=checkbox]"));
		var arr = [];
		$dom.each(function() {
			var is = $(this).is(":checked");
			if (is) {
				var val = $(this).attr('ip');
				arr.push(val)
			};
		});
		var domIp = arr.join(",");
		if (domIp.length <= 0) {
			layer.msg("请至少选择一个站点!");
			return false;
		};
		recallFn(domIp);
	});

	// 全选
	form.on('checkbox(treeChek)', function(data) {
		var is = data.elem.checked;
		var $dom = $("#tbody").find($("input[type=checkbox]"));
		if (is) {
			$dom.prop("checked", true);
		} else {
			$dom.prop("checked", false);
		};
		form.render('checkbox');
		return false;
	});
	//下发
	function recallFn(ip) {
		http({
			url: url.recall,
			type: 'post',
			data: {
				data: ip
			},
			success: function(res) {
				if (res.code == 200) {
					types = "下发";
					getRigFn();
				};
			}
		});
	};
	$('#close').click(function() {
		parent.alrFns();
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("confs", {})
});
