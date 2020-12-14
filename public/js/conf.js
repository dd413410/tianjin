layui.define(["urls", "func", "form"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		func = layui.func;

	var $ = layui.$,
		layer = layui.layer,
		form = layui.form;

	$("#swiper1").show();

	var ip = func.locaStr("ip");

	var taskArr = new Array;
	var taskIp = null;

	var taskDeta = null;

	var taskData = {
		DataPath: [],
		Destination: [],
		Links: [],
		Rules: {
			Type: 0,
			UpDataPath: [],
			Value: "*.*"
		}
	};
	//获取任务列表
	function getTaskFn() {
		http({
			url: url.trslist,
			type: 'get',
			data: {
				ip: ip
			},
			success: function(res) {
				taskArr = res.data;
				taskIp = res.ip;
				setTaskFn();
			}
		});
	};
	getTaskFn();
	//赋值任务列表
	function setTaskFn() {
		var str = '';
		for (var i = 0; i < taskArr.length; i++) {
			var taskItem = taskArr[i];
			var className = taskIdx == i ? "add" : "";
			str += '<div class="side-list-item ' + className + '" id="' + taskItem.id + '" idx="' + i + '">' +
				'<p class="lt lt-p">' + Number(i + 1) + '</p>' +
				'<p class="rt rt-p">' + taskItem.name + '</p>' +
				'</div>';
		};
		$("#task").html(str);
	};
	// 添加任务
	$("#addTask").click(function() {
		layer.prompt({
			title: '传输任务名称'
		}, function(taskName, index) {
			taskArr.push({
				name: taskName,
				id: ""
			});
			setTaskFn();
			layer.close(index);
		});
	});
	var taskIdx = null;
	var taskId = null;
	$("#task").on("click", "div", function() {
		$(this).siblings().removeClass("add");
		$(this).addClass("add");
		taskIdx = $(this).attr("idx");
		taskId = $(this).attr("id");


		$("#AForm")[0].reset();
		$(".btn1").show();

		$("#swiper p").removeClass("add");
		$("#swiper p").eq(0).addClass("add");
		$(".swiper-box").hide();
		$("#swiper1").show();

		if (taskId) {
			getTaskDetaFn();
		} else {
			taskDeta = taskData;
			setTaskAFn();
		};
	});
	var swIdx = 1;
	$("#swiper p").click(function() {
		if (!taskDeta) {
			layer.msg("请先选择任务!")
			return false;
		};
		swIdx = $(this).attr("idx");
		$(".swiper-box").hide();
		$("#swiper" + swIdx).show();
		$("#swiper p").removeClass("add");
		$(this).addClass("add");
		
		switch (swIdx) {
			case "1":
				setTaskAFn();
				break;
			case "2":
				setTaskBFn();
				break;
			case "3":
				setTaskCFn();
				break;
			default:
				setTaskDFn();
		}
	});
	// 获取任务参数
	// var taskDeta = null;

	function getTaskDetaFn() {
		http({
			url: url.trslist,
			type: 'post',
			data: {
				ip: taskIp,
				id: taskId
			},
			success: function(res) {
				taskDeta = res.data;
				setTaskAFn();
			}
		});
	};
	// 第一步操作
	// 数据目录赋值
	function setTaskAFn() {
		$("#AForm")[0].reset();
		$("#swiper-box-a").empty();
		var data = taskDeta.DataPath;
		var str = '';
		for (var a = 0; a < data.length; a++) {
			var dataItem = data[a];
			str += '<div class="swiper-list-item">' +
				'<p><input type="radio" name="a" value="' + a + '" lay-filter="pickA"></p>' +
				'<p title="' + dataItem.Name + '">' + dataItem.Name + '</p>' +
				'<p title="' + dataItem.TaskDir + '">' + dataItem.TaskDir + '</p>' +
				'<p title="' + dataItem.TaskFile + '">' + dataItem.TaskFile + '</p>' +
				'<p title="' + dataItem.Path + '">' + dataItem.Path + '</p>' +
				'</div>';
		};
		$("#swiper-box-a").html(str);
		form.render("radio");
	};
	// 选中的下标
	var pickAIdx = null;
	form.on('radio(pickA)', function(data) {
		pickAIdx = data.value;
		pickAIdx ? $("#btn12").show() : "";
		// var pickItem = taskDeta.DataPath[pickAIdx];
		// var c = pickItem.TaskDir == "是" ? true : false;
		// $("#check").attr('checked', c);
		// form.val('AForm', {
		// 	Name: pickItem.Name,
		// 	Path: pickItem.Path,
		// 	TaskFile: pickItem.TaskFile
		// });
		// form.render("checkbox");
		return false;
	});
	// 删除第一步的配置
	$("#btn12").click(function() {
		taskDeta.DataPath.splice(pickAIdx, 1);
		$("#btn12").hide();
		setTaskAFn();
	});
	form.on('submit(formASub)', function(data) {
		var data = data.field;
		data.TaskDir ? data.TaskDir = "是" : data.TaskDir = "否";
		taskDeta.DataPath.push(data);
		pickAIdx = null;
		$("#btn12").hide();
		$("#AForm")[0].reset();
		setTaskAFn();
		return false;
	});

	// 第二部操作
	function setTaskBFn() {
		$("#BForm")[0].reset();
		$("#subForm")[0].reset();
		$("#swiper-box-b").empty();
		var rules = taskDeta.Rules;
		var temp = taskDeta.DataPath;
		var str = '';
		for (var t = 0; t < temp.length; t++) {
			var tempItem = temp[t];
			str += '<option value="' + tempItem.Name + '">' + tempItem.Name + '</option>'
		};
		$("#pickB").html(str);
		var data = taskDeta.Rules.UpDataPath;
		var strs = '';
		for (var b = 0; b < data.length; b++) {
			var dataItem = data[b];
			strs += '<div class="swiper-list-item">' +
				'<p><input type="radio" name="b" value="' + b + '" lay-filter="pickB"></p>' +
				'<p>' + dataItem.Item + '</p>' +
				'</div>';
		};
		$("#swiper-box-b").html(strs);
		form.val('subForm', {
			Type: rules.Type,
			Value: rules.Value
		});
		form.render();
	};
	// 选中的下标
	var pickBIdx = null;
	form.on('radio(pickB)', function(data) {
		pickBIdx = data.value;
		pickBIdx ? $("#btn22").show() : "";
		return false;
	});
	$("#btn22").click(function() {
		taskDeta.Rules.UpDataPath.splice(pickBIdx, 1);
		$("#btn22").hide();
		setTaskBFn();
	});
	form.on('submit(formBSub)', function(data) {
		var data = data.field;
		taskDeta.Rules.UpDataPath.push(data);
		pickBIdx = null;
		$("#btn22").hide();
		$("#BForm")[0].reset();
		setTaskBFn();
		return false;
	});


	// 第三部操作
	function setTaskCFn() {
		$("#CForm")[0].reset();
		$("#swiper-box-c").empty();
		var data = taskDeta.Destination;
		var str = '';
		for (var c = 0; c < data.length; c++) {
			var dataItem = data[c];
			str += '<div class="swiper-list-item">' +
				'<p><input type="radio" name="c" value="' + c + '" lay-filter="pickC"></p>' +
				'<p title="' + dataItem.Name + '">' + dataItem.Name + '</p>' +
				'<p title="' + dataItem.Type + '">' + dataItem.Type + '</p>' +
				'<p title="' + dataItem.KeepPath + '">' + dataItem.KeepPath + '</p>' +
				'<p title="' + dataItem.IP + '">' + dataItem.IP + '</p>' +
				'<p title="' + dataItem.Port + '">' + dataItem.Port + '</p>' +
				'<p title="' + dataItem.Path + '">' + dataItem.Path + '</p>' +
				'</div>'
		};
		$("#swiper-box-c").html(str);
		form.render("radio");
	};

	var pickCIdx = null;
	form.on('radio(pickC)', function(data) {
		pickCIdx = data.value;
		pickCIdx ? $("#btn32").show() : "";
		return false;
	});
	$("#btn32").click(function() {
		taskDeta.Destination.splice(pickCIdx, 1);
		$("#btn32").hide();
		setTaskCFn();
	});
	form.on('submit(formCSub)', function(data) {
		var data = data.field;
		var datas = {
			Name: data.cName,
			Type: data.cType,
			IP: data.cIp,
			Port: data.cPort,
			Path: data.cPath,
		};
		data.cKeep ? datas.KeepPath = "是" : datas.KeepPath = "否";
		taskDeta.Destination.push(datas);
		setTaskCFn();
		return false;
	});
	// 第四步操作
	function setTaskDFn() {
		$("#DForm")[0].reset();
		$("#swiper-box-d").empty();
		var data = taskDeta.Links;
		var str = '';
		for (var d = 0; d < data.length; d++) {
			var dataItem = data[d];
			str += '<div class="swiper-list-item">' +
				'<p>' +
				'<input type="radio" name="d" value="' + d + '" lay-filter="pickD">' +
				'<button class="layui-btn" onclick="domMoveFn(1,' + d + ')">上移</button>' +
				'<button class="layui-btn" onclick="domMoveFn(2,' + d + ')">下移</button>' +
				'</p>' +
				'<p title="' + Number(d + 1) + '">' + Number(d + 1) + '</p>' +
				'<p title="' + dataItem.Name + '">' + dataItem.Name + '</p>' +
				'<p title="' + dataItem.IP + '">' + dataItem.IP + '</p>' +
				'<p title="' + dataItem.Gateway + '">' + dataItem.Gateway + '</p>' +
				'</div>';
		};
		$("#swiper-box-d").html(str);
		form.render("radio");
	};
	var pickDIdx = null;
	form.on('radio(pickD)', function(data) {
		pickDIdx = data.value;
		pickDIdx ? $("#btn42").show() : "";
		return false;
	});
	$("#btn42").click(function() {
		taskDeta.Links.splice(pickDIdx, 1);
		$("#btn42").hide();
		setTaskDFn();
	});

	form.on('submit(formDSub)', function(data) {
		var data = data.field;
		var datas = {
			Name: data.dName,
			IP: data.dIp,
			Gateway: data.dGateway
		};
		taskDeta.Links.push(datas);
		setTaskDFn();
		return false;
	});

	window.domMoveFn = function(x, i) {
		if (x == 1 && i == 0) {
			return false;
		};
		var lth = taskDeta.Links.length - 1;
		if (x == 2 && i == lth) {
			return false;
		};
		var r = x == 1 ? Number(i - 1) : Number(i + 1);
		swapFn(i, r);
	};

	function swapFn(i, r) {
		var data = taskDeta.Links;
		data[i] = data.splice(r, 1, data[i])[0];
		taskDeta.Links = data;
		setTaskDFn();
	};

	// 删除传输任务
	$("#deleTask").click(function() {
		if (!taskIdx) {
			layer.msg("请先选择任务");
			return false;
		};
		var infoMsg = layer.msg('是否确认删除此传输任务?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				if (!taskId) {
					taskArr.splice(taskIdx, 1);
					layer.msg('删除成功！');
					layer.close(infoMsg);
					taskIdx = null;
					setTaskFn();
					return false;
				};
				http({
					url: url.trsdele,
					type: 'post',
					data: {
						ip: taskIp,
						id: taskId
					},
					success: function() {
						layer.msg('删除成功！');
						layer.close(infoMsg);
						taskIdx = null;
						taskId = null;
						getTaskFn();
					}
				});
			},
			btn2: function() {
				layer.msg('已取消删除。');
			}
		});
	});
	// 保存应用
	$("#saveBtn").click(function() {
		var obj = {
			"DataPath": taskDeta.DataPath,
			"Destination": taskDeta.Destination,
			"Links": taskDeta.Links,
			"Rules": {
				"Type": taskDeta.Rules.Type,
				"Value": taskDeta.Rules.Value,
				"UpDataPath": taskDeta.Rules.UpDataPath,
			}
		};
		http({
			url: url.trsadd,
			type: 'post',
			data: {
				ip: taskIp,
				id: taskId,
				Name: taskArr[taskIdx].name,
				data: JSON.stringify(obj)
			},
			success: function(res) {
				layer.msg("保存应用成功")
			}
		});
	});

	form.verify({
		Name: function(val) {
			if (!func.trimFn(val)) {
				return '请输入数据类型';
			}
		},
		Path: function(val) {
			if (!func.trimFn(val)) {
				return '请输入目录';
			}
		},
		// 第三步验证
		cName: function(val) {
			if (!func.trimFn(val)) {
				return '请输入名称';
			}
		},
		cPort: function(val) {
			if (!func.trimFn(val)) {
				return '请输入端口号';
			}
		},
		cPath: function(val) {
			if (!func.trimFn(val)) {
				return '请输入目录';
			}
		},
		cIp: function(val) {
			var reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
			if (func.trimFn(val)) {
				if (!reg.test(val)) {
					return '请输入正确的目标IP';
				}
			}
		},

		// 第四步验证
		dName: function(val) {
			if (!func.trimFn(val)) {
				return '请输入名称';
			}
		},
		dIp: function(val) {
			var reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
			if (func.trimFn(val)) {
				if (!reg.test(val)) {
					return '请输入正确的IP地址';
				}
			}
		},
		dGateway: function(val) {
			var reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
			if (func.trimFn(val)) {
				if (!reg.test(val)) {
					return '请输入正确的网管';
				}
			}
		}
	});



	$('#close').click(function() {
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});



	e("conf", {})
});
