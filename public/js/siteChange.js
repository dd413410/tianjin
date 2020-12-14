layui.define(["urls", "dtree", "func", "form", "laypage"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		func = layui.func,
		dtree = layui.dtree;

	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form;

	var siteId = func.locaStr("id"),
		is = 1;

	var para = {
		lookType: "",
		stationType: "",
		ofCountry: "",
		ofAreaCenter: "",
		ofArea: "",
		ofCenter: "",
		stationRange: ""
	};

	//获取站点详情
	var siteData = null;

	function getDataFn() {
		http({
			url: url.sitedeta,
			type: 'post',
			data: {
				id: siteId
			},
			success: function(res) {
				siteData = res.data;
				var data = siteData.fields;
				para.lookType = data.lookType;
				para.stationType = data.stationType;
				para.ofCountry = data.ofCountry;
				para.ofAreaCenter = data.ofAreaCenter;
				para.ofArea = data.ofArea;
				para.ofCenter = data.ofCenter;
				stationRange = data.stationRange;
				para.lookType == 1 ? $("#isType").show() : $("#isType").hide();
				getLookFn();
			}
		});
	};
	getDataFn();

	// 获取观测类型
	function getLookFn() {
		http({
			url: url.siteType,
			type: 'get',
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.title + '</option>'
				};
				$("#lookType").html(str);
				layForm.render("select");
				getTy();
				getSiteTypeFn();
			}
		});
	};
	
	// 站点范围
	function getTy() {
		$("#stationRange").empty();
		http({
			url: url.sitestype,
			type: 'post',
			data: {
				id: para.lookType
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var e = 0; e < data.length; e++) {
					var dataItem = data[e].fields;
					str += '<option value=' + data[e].pk + '>' + dataItem.title + '</option>';
				};
				$("#stationRange").html(str);
				layForm.render("select");
			}
		})
	};

	//获取站点类型接口
	function getSiteTypeFn() {
		http({
			url: url.sitestype,
			type: 'get',
			data: {
				id: para.lookType
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.title + '</option>'
				};
				$("#stationType").html(str);
				getType();
			}
		});
	};

	// 所属站一级
	window.getType = function() {
		http({
			url: url.siteotype,
			type: 'get',
			data:para,
			// data: {
			// 	stationType: para.stationType,
			// 	ofCountry: "",
			// 	ofAreaCenter: "",
			// 	ofArea: "",
			// 	ofCenter: ""
			// },
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var a = 0; a < data.length; a++) {
					var dataItem = data[a].fields;
					str += '<option value=' + data[a].pk + '>' + dataItem.station + '</option>';
				};
				$("#ofCountry").html(str);
				is == 2 && data.length > 0 ? para.ofCountry = data[0].pk : "";
				postType();
			}
		})
	};
	// 所属站二级
	window.postType = function() {
		$("#ofAreaCenter").empty();
		http({
			url: url.siteotype,
			type: 'post',
			data:para,
			// data: {
			// 	stationType: para.stationType,
			// 	ofCountry: para.ofCountry,
			// 	ofAreaCenter: "",
			// 	ofArea: "",
			// 	ofCenter: ""
			// },
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var b = 0; b < data.length; b++) {
					var dataItem = data[b].fields;
					str += '<option value=' + data[b].pk + '>' + dataItem.title + '</option>';
				};
				$("#ofAreaCenter").html(str);
				is == 2 && data.length > 0 ? para.ofAreaCenter = data[0].pk : "";
				getTypes();
			}
		})
	};
	// 所属站三级
	window.getTypes = function() {
		$("#ofArea").empty();
		http({
			url: url.sitentype,
			type: 'get',
			data:para,
			// data: {
			// 	stationType: para.stationType,
			// 	ofCountry: para.ofCountry,
			// 	ofAreaCenter: para.ofAreaCenter,
			// 	ofArea: "",
			// 	ofCenter: ""
			// },
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var c = 0; c < data.length; c++) {
					var dataItem = data[c].fields;
					str += '<option value=' + data[c].pk + '>' + dataItem.station + '</option>';
				};
				$("#ofArea").html(str);
				is == 2 && data.length > 0 ? para.ofArea = data[0].pk : "";
				postTypes();
			}
		})
	};
	// 所属站四级
	window.postTypes = function() {
		$("#ofCenter").empty();
		http({
			url: url.sitentype,
			type: 'post',
			data: {
				stationType: para.stationType,
				ofCountry: para.ofCountry,
				ofAreaCenter: para.ofAreaCenter,
				ofArea: para.ofArea,
				ofCenter: ""
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d].fields;
					str += '<option value=' + data[d].pk + '>' + dataItem.station + '</option>';
				};
				$("#ofCenter").html(str);
				layForm.render("select");
				is == 1 ? setDataFn() : "";
			}
		})
	};

	// 表单赋值
	var strNodeTree = null, //上传节点
		strLine = null, //主线路
		strEl = null; //要素选择

	function setDataFn() {
		var data = siteData.fields;
		strNodeTree = data.uid;
		strEl = data.element;
		strLine = data.Main;
		layForm.val('layForm', {
			"id": siteData.pk,
			"lookType": data.lookType,
			"station": data.station,
			"stationType": data.stationType,
			"stationCode": data.stationCode,
			"stationNum": data.stationNum,
			"stationNumCode": data.stationNumCode,
			"ip": data.ip,
			"lon": data.lon,
			"lat": data.lat,
			"dtime": data.dtime,
			"htime": data.htime,


			"ofCountry": data.ofCountry,
			"ofAreaCenter": data.ofAreaCenter,
			"ofArea": data.ofArea,
			"ofCenter": data.ofCenter,

			"stationRange": data.stationRange,
			"uphold": data.uphold,
			"control": data.control,
			"resident": data.resident,
		});
		is = 2;
	};


	// 检索框选择
	layForm.on('select(filts)', function(data) {
		var t = data.othis[0];
		var fn = $(t).prev().attr('fn');
		var id = $(t).prev().attr('id');
		para[id] = data.value;
		if (fn == undefined) {
			return false;
		};
		window[fn]();
		return false;
	});



	//获取节点接口
	var layNodeTree = null, //弹出层
		tempNode = null, //全部的节点ID,全选时用到
		nodeData = null; //节点数据
	window.layNodeFn = function() {
		http({
			url: url.siteTree,
			type: 'get',
			data: {},
			success: function(res) {
				nodeData = res.data;
				tempNode = res.ids;
				var DTree = dtree.render({
					elem: "#nodeTree",
					dataStyle: "layuiStyle",
					width: 320,
					data: nodeData,
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
						dtree.chooseDataInit("nodeTree", strNodeTree);
					}
				});
				layNodeTree = lay.open({
					type: 1,
					title: false,
					closeBtn: 0,
					resize: false,
					shade: 0.5,
					area: ['300px', '400px'],
					shadeClose: false,
					content: $('#nodeTreeBox')
				});
			}
		});
	};
	// 监听上传节点全选
	layForm.on('checkbox(treeChek)', function(data) {
		var is = data.elem.checked;
		if (is) {
			dtree.chooseDataInit("nodeTree", tempNode);
		} else {
			dtree.reload("nodeTree", {
				data: nodeData,
				done: function() {
					dtree.chooseDataInit("nodeTree", "");
				}
			});
		};
		return false;
	});

	$("#treeBtn").click(function() {
		var dom = dtree.getCheckbarNodesParam("nodeTree");
		var arr = [];
		for (var i = 0; i < dom.length; i++) {
			arr.push(dom[i].nodeId)
		};
		strNodeTree = arr.join(",");
		lay.close(layNodeTree);
	});
	// 关闭上传节点弹窗
	$("#layNodeTree").click(function() {
		lay.close(layNodeTree);
	});



	// 获取主线路
	var layLineTree = null; //主线路弹出层
	window.layLineFn = function() {
		http({
			url: url.sitemain,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				var lineTree = dtree.render({
					elem: "#LineTree",
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
					checkbarType: "only",
					done: function() {
						dtree.chooseDataInit("LineTree", strLine.toString());
					}
				});
				layLineTree = lay.open({
					type: 1,
					title: false,
					closeBtn: 0,
					resize: false,
					shade: 0.5,
					area: ['300px', '400px'],
					shadeClose: false,
					content: $('#lineTreeBox')
				});
			}
		});
	};

	//监听主线路点确定
	$("#lineBtn").click(function() {
		var dom = dtree.getCheckbarNodesParam("LineTree");
		var arr = [];
		for (var i = 0; i < dom.length; i++) {
			arr.push(dom[i].nodeId)
		};
		strLine = arr.join(",");
		lay.close(layLineTree);
	});
	//关闭主线路弹窗
	$("#layLineTree").click(function() {
		lay.close(layLineTree);
	});




	//获取要素接口
	var layEl = null; //要素弹出层

	window.layElFn = function() {
		http({
			url: url.siteel,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<p><input type="checkbox" class="elItem" lay-skin="primary" value=' + dataItem.element + ' title=' +
						dataItem.elName + '></p>';
				};
				$("#elemBox").html(str);
				if (strEl.length > 0) {
					var fdata = strEl.split(",");
					var check = $("#elemBox").find('[type="checkbox"]');
					for (var c = 0; c < fdata.length; c++) {
						var m = fdata[c];
						for (var k = 0; k < check.length; k++) {
							var v = check[k].value;
							if (v == m) {
								$(check[k]).attr('checked', true)
							}
						}
					}
				};
				layForm.render("checkbox");
				layEl = lay.open({
					type: 1,
					title: false,
					closeBtn: 0,
					resize: false,
					shade: 0.5,
					area: ['400px', '400px'],
					shadeClose: false,
					content: $('#elBox')
				});
			}
		});
	};
	// 监听要素全选
	layForm.on('checkbox(elChek)', function(data) {
		var is = data.elem.checked;
		$(".elItem").prop("checked", is);
		layForm.render("checkbox");
		return false;
	});
	// 要素选择后确定
	$("#elBtn").click(function() {
		var arr = [];
		$(".elItem").each(function() {
			var is = $(this).is(":checked");
			if (is) {
				var val = $(this).val();
				arr.push(val)
			}
		});
		strEl = arr.join(",");
		lay.close(layEl);
	});
	// 关闭要素弹窗
	$("#layEl").click(function() {
		lay.close(layEl);
	});

	layForm.on('submit(sub)', function(data) {
		var data = data.field;
		data.uid = strNodeTree;
		data.element = strEl;
		data.Main = strLine || 0;
		var t = data.lookType;
		if (t != 1) {
			delete data.stationCode;
			delete data.stationNum;
		};
		var s = data.stationType;
		if (s == 5) {
			delete data.ofId;
			delete data.ofStation;
		};

		http({
			url: url.sitechange,
			type: 'post',
			data: data,
			success: function(res) {
				lay.msg("修改站点成功!");
				setTimeout(function() {
					$('#close').click();
				}, 1500);
			}
		});
		return false;
	});
	$('#close').click(function() {
		parent.getListFn();
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);

	});
	e("siteChange", {})
});
