layui.define(["urls", "dtree", "func", "form", "laypage"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		dtree = layui.dtree,
		func = layui.func;

	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form;
	//乱七八糟的在最下面,监听按钮,验证等



	var para = {
		lookType: "",
		typeId: "",
		aid: "",
		bid: "",
		cid: "",
		did: "",
		eid: ""
	};



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
				para.lookType = data.length > 0 ? data[0].pk : "";
				getSiteTypeFn();
				getTy();
			}
		});
	};
	getLookFn();


	function getTy() {
		$("#eid").empty();
		http({
			url: url.sitestype,
			type: 'post',
			data: {
				id: para.lookType
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value=' + data[i].pk + '>' + dataItem.title + '</option>';
				};
				$("#eid").html(str);
				layForm.render("select");
			}
		})
	};
	//监听观测类型选择,只有观测站才有站代码和区站号
	layForm.on('select(filtLook)', function(data) {
		para.lookType = data.value;
		para.lookType == 1 ? $("#isType").show() : $("#isType").hide();
		getSiteTypeFn();
		getTy();
		return false;
	});


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
				$("#typeId").html(str);
				layForm.render("select");
				para.typeId = data.length > 0 ? data[0].pk : "";
				getType();
			}
		});
	};


	// 所属站一级
	window.getType = function() {
		$("#aid").empty();
		http({
			url: url.siteotype,
			type: 'get',
			data: {
				stationType: para.typeId,
				ofCountry: "",
				ofAreaCenter: "",
				ofArea: "",
				ofCenter: ""
			},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value=' + data[i].pk + '>' + dataItem.station + '</option>';
					} else {
						str += '<option value=' + data[i].pk + '>' + dataItem.station + '</option>';
					};
				};
				$("#aid").html(str);
				layForm.render("select");
				para.aid = data.length > 0 ? data[0].pk : "";
				postType();
			}
		})
	};
	// 所属站二级
	window.postType = function() {
		$("#bid").empty();
		http({
			url: url.siteotype,
			type: 'post',
			data: {
				stationType: para.typeId,
				ofCountry: para.aid,
				ofAreaCenter: "",
				ofArea: "",
				ofCenter: ""
			},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value=' + data[i].pk + '>' + dataItem.title + '</option>';
					} else {
						str += '<option value=' + data[i].pk + '>' + dataItem.title + '</option>';
					};
				};
				$("#bid").html(str);
				layForm.render("select");
				para.bid = data.length > 0 ? data[0].pk : "";
				getTypes();
			}
		})
	};
	// 所属站三级
	window.getTypes = function() {
		$("#cid").empty();
		http({
			url: url.sitentype,
			type: 'get',
			data: {
				stationType: para.typeId,
				ofCountry: para.aid,
				ofAreaCenter: para.bid,
				ofArea: "",
				ofCenter: ""
			},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value=' + data[i].pk + '>' + dataItem.station + '</option>';
					} else {
						str += '<option value=' + data[i].pk + '>' + dataItem.station + '</option>';
					};
				};
				$("#cid").html(str);
				layForm.render("select");
				para.cid = data.length > 0 ? data[0].pk : "";
				postTypes();
			}
		})
	};
	// 所属站四级
	window.postTypes = function() {
		$("#did").empty();
		http({
			url: url.sitentype,
			type: 'post',
			data: {
				stationType: para.typeId,
				ofCountry: para.aid,
				ofAreaCenter: para.bid,
				ofArea: para.cid,
				ofCenter: ""
			},
			success: function(res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value=' + data[i].pk + '>' + dataItem.station + '</option>';
					} else {
						str += '<option value=' + data[i].pk + '>' + dataItem.station + '</option>';
					};
				};
				$("#did").html(str);
				layForm.render("select");
				para.did = data.length > 0 ? data[0].pk : "";
			}
		})
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
		nodeData = null, //节点数据
		strNodeTree = ""; //选中后的节点集合

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
	//监听上传节点确定
	$("#treeBtn").click(function() {
		var dom = dtree.getCheckbarNodesParam("nodeTree");
		var arr = [];
		for (var i = 0; i < dom.length; i++) {
			arr.push(dom[i].nodeId)
		};
		strNodeTree = arr.join(",");
		lay.close(layNodeTree);
	});
	//关闭上传节点弹窗
	$("#layNodeTree").click(function() {
		lay.close(layNodeTree);
	});
	// 获取主线路
	var layLineTree = null, //弹出层
		strLine = ""; //选中后的节点id
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
						dtree.chooseDataInit("LineTree", strLine);
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
	var layEl = null, //要素弹出层
		strEl = ""; //选中后的要素集合
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

	// 提交
	layForm.on('submit(sub)', function(data) {
		var data = data.field;
		data.uid = strNodeTree;
		data.Main = strLine || 0;
		data.element = strEl;
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
			url: url.siteAdd,
			type: 'post',
			data: data,
			success: function(res) {
				if (res.code == 1) {
					lay.msg("添加站点成功!");
					setTimeout(function() {
						$('#close').click();
					}, 1500);

				}
			}
		});
		return false;
	});

	/*
	    @@添加站点时的验证
	*/
	layForm.verify({
		station: function(val) {
			if (!func.trimFn(val)) {
				return '请输入站点名';
			}
		},
		stationCode: function(val) {
			if (!func.trimFn(val)) {
				return '请输入站名代码';
			}
		},
		ip: function(val) {
			var reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
			if (!reg.test(val)) {
				return '请输入正确的IP';
			}
		},
		lon: function(val) {
			if (!func.trimFn(val)) {
				return '请输入经度';
			}
		},
		lat: function(val) {
			if (!func.trimFn(val)) {
				return '请输入经度';
			}
		},
		dtime: function(val) {
			if (!func.trimFn(val)) {
				return '请输入延时时间';
			}
		},
		htime: function(val) {
			if (!func.trimFn(val)) {
				return '请输入接收时间';
			}
		},
		ofStation: function(val) {
			var p = $("#lookType").val();
			if (p != 6 && !val) {
				return '请选择所属站点';
			}
		}
	});
	/*
	    @@@添加和修改页面的关闭按钮
	*/
	$('#close').click(function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);

	});
	e("siteAdd", {})
});
