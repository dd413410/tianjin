function load() {
	window.location.reload();
};

function outFn() {
	window.location.href = '../index.html';
};

layui.define(['urls', 'form', 'laydate'], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url;
	var lay = layui.layer,
		layForm = layui.form,
		laydate = layui.laydate;

	$("#user").html(sessionStorage.user);

	var setTime = null,
		introl = null;
	var sh = 40;
	var speed = 30;

	function getStateFn() {
		$("#roll").empty();
		http({
			url: url.alarms,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					var str = '<ul class="item">' +
						'<li>' + dataItem.station + dataItem.faultReason + '</li>' +
						'<li>' + dataItem.startTime + '</li>' +
						'</ul>';
					$("#roll").append(str);
				};
				if ($("#roll").height() <= $("#deta").height()) {
					window.clearInterval(setTime);
				} else {
					window.clearInterval(setTime);
					setTime = setInterval(function() {
						setRollFn();
					}, speed);
				};
			},
			complete: function() {
				setTimeout(getStateFn, 60000);
			}
		});
	};
	getStateFn();

	function setRollFn() {
		$("#roll").animate({
			marginTop: '-=1'
		}, 0, function() {
			var s = Math.abs(parseInt($(this).css("margin-top")));
			if (s >= sh) {
				$(this).find("ul").slice(0, 1).appendTo($(this));
				$(this).css("margin-top", 0);
			}
		});
		$("#deta").hover(function() {
			window.clearTimeout(setTime);
			window.clearInterval(introl);
		}, function() {
			window.clearInterval(setTime);
			window.clearTimeout(introl);
			setTime = setInterval(function() {
				setRollFn();
			}, speed);
			introl = setTimeout(getStateFn, 30000);
		});
	};
	// 获取默认站点
	var siteId = null;
	var siteName = '';

	function getSiteFn() {
		http({
			url: url.sitedefault,
			type: 'get',
			data: {},
			success: function(res) {
				siteId = res.id;
				siteName = res.name;
				$("#site").html(siteName);
				fileFn();
			}
		});
	};
	getSiteFn();

	function fileFn() {
		http({
			url: url.receive,
			type: 'get',
			data: {
				id: siteId
			},
			success: function(res) {
				var data = res.data;
				$("#dataTime").html(data.time);
				$("#file").html(data.dir);
				$("#fileNum").html(data.dunit);
				$("#data").html(data.size);
				$("#dataNum").html(data.sunit);
				var list = data.list;
				var str = '';
				for (var i = 0; i < list.length; i++) {
					str += '<div>' +
						'<p>' + list[i].key + '</p>' +
						'<p>' + list[i].val + '</p>' +
						'</div>';
				};
				$("#rtTop").html(str);
			}
		});
	};



	// 监听异常
	var stationId = null;
	var siteType = null;
	var alarmId = null;
	var inspTime = null;

	function inspFn() {
		http({
			url: url.faultpush,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				console.log(data)
				stationId = data.stationId;
				if (stationId > -1) {
					clickFn();
				} else {
					inspTime = setTimeout(inspFn, 30000);
				}
			}
		});
	};
	inspFn();


	laydate.render({
		elem: '#time',
		type: 'datetime',
		trigger: 'click'
	});
	var layAlr = null;

	function clickFn() {
		window.clearTimeout(inspTime);
		http({
			url: url.homeclock,
			type: 'get',
			data: {
				id: stationId
			},
			success: function(res) {
				siteType = res.type;
				alarmId = res.alarmId;
				var data = res.data;
				
				$("#layForm")[0].reset();
				layForm.val('detaForms', {
					"station": data.station,
					"seat": data.seat,
					"ip": data.ip,
					"newTime": data.newTime,
					"minuteFile": data.minuteFile,
					"hourFile": data.hourFile,
					"punctualityFile": data.punctualityFile
				});

				if (siteType > -1) {
					layForm.val('detaForm', {
						"fault": data.fault,
						"faulCconfirm": data.faulCconfirm,
						"handler": data.handler,
						"desc": data.desc,
						"endTime": data.endTime
					});
					var text = siteType == 1 ? "推送" : "提交";
					$("#subbtn").html(text);
					$("#hideBtm").show();
				} else {
					$("#hideBtm").hide();
				};
				layAlr = lay.open({
					type: 1,
					skin: 'drop-demo',
					area: "350px",
					offset: "150px",
					shade: 0,
					resize: false,
					content: $('#hide-box'),
					success: function() {
						$(".layui-layer-title")[0].innerHTML = data.station;
						console.log("弹出成功")
					},
					cancel: function() {
						http({
							url: url.close,
							type: 'get',
							data: {
								id: stationId
							},
							success: function(res) {
								lay.close(layAlr);
								setTimeout(function() {
									inspFn();
								}, 500);
							}
						});
					}
				});
			}
		})
	};
	layForm.on('submit(sub)', function(data) {
		var d = data.field;
		var data = {
			id: alarmId,
			type: siteType,
			faulCconfirm: d.faulCconfirm,
			handler: d.handler,
			endTime: d.endTime,
			desc: d.desc
		};
		http({
			url: url.homeclock,
			type: 'post',
			data: data,
			success: function(res) {
				lay.close(layAlr);
				setTimeout(function() {
					inspFn();
				}, 500);
			}
		});
		return false;
	});

	// 获取右侧站类型

	var type = "";
	var checkArr = [6];

	function getTypeFn() {
		http({
			url: url.siteType,
			type: 'get',
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < 5; i++) {
					var dataItem = data[i].fields;
					str += '<input type="checkbox" value="' + data[i].pk + '" lay-skin="primary" lay-filter="check" title="' +
						dataItem.title + '" checked />';
					checkArr.push(data[i].pk)
				};
				$("#check").html(str);
				layForm.render("checkbox");
				type = checkArr.join(',');
				mapDataFn();
			}
		});
	};
	getTypeFn();
	// 监听类型选择
	var mapInt = null,
		mapTime = 30000;
	layForm.on('checkbox(check)', function(data) {
		clearInterval(mapInt);
		var tempVal = Number(data.value);
		var tempIs = data.elem.checked;
		if (tempIs) {
			checkArr.push(tempVal)
		} else {
			var idx = checkArr.indexOf(tempVal);
			checkArr.splice(idx, 1);
		};
		type = checkArr.join(',');
		mapDataFn();
		return false;
	});

	var station;
	var zoom = 1;

	function mapDataFn() {
		http({
			url: url.homeindex,
			type: 'get',
			data: {
				type: type,
				num: zoom
			},
			success: function(res) {
				station = res.data;
				var lineData = res.line;
				var scatData = scatConvert();
				myChart.setOption({
					series: [{
						data: scatData
					}, {
						data: lineData
					}]
				});
			},
			complete: function() {
				mapInt = setTimeout(mapDataFn, 60000);
			}
		});
	};
	/*
		@@字段区分
		name:站点名
		id:站点ID
		type用于区分类别,1-6对应:1台站、2浮标、3雷达、4志愿船、5gps、6管理单位
		val是空值圈的颜色 1:正常(绿色),2维护(灰色),3异常(红色)
		line控制线的颜色	0为绿色 1为红色
	*/
	function scatConvert() {
		var temp = [];
		for (var i = 0; i < station.length; i++) {
			var dataItem = station[i];
			var img = "image://../static/icon" + dataItem.type + dataItem.val + ".png";

			var site = dataItem.fontsize == 0 ? "" : dataItem.name;

			// var img = "image://../static/h11.png";
			var obj = {
				name: site,
				site: dataItem.name,
				value: dataItem.from,
				val: dataItem.val,
				id: dataItem.id,
				type: dataItem.type,
				symbolSize: dataItem.size,
				symbol: img,
				label: {
					normal: {
						textStyle: {
							fontSize: dataItem.fontsize
						}
					}
				}

			};
			temp.push(obj)
		};
		return temp;
	};
	//初始化中间地图
	var colorArr = ['#33CC00', '#f00', '#ffde00', '#808080'];
	var myChart = echarts.init(document.getElementById('maps'));

	function initEchartFn() {
		var option = {
			tooltip: {
				trigger: 'item',
				borderColor: '#FFFFCC',
				hideDelay: 0,
				transitionDuration: 0,
				extraCssText: 'z-index:100',
				textStyle: {
					color: '#fff'
				},
				formatter: function(params) {
					var data = params.data;
					return data.site;
				}
			},
			geo: {
				map: 'china',
				zoom: zoom,
				scaleLimit: {
					min: 1,
					max: 56
				},
				center: [108, 34],
				label: {
					emphasis: {
						show: false
					}
				},
				roam: true,
				silent: true,
				itemStyle: {
					normal: {
						areaColor: "rgba(0,0,0,0.1)",
						color: '#334559',
						// borderColor: '#00b8fd',
						// shadowColor: '#00b8fd',
						borderColor: '#1422CA',
						shadowColor: '#010B1D',
						borderWidth: 1,
						shadowOffsetX: -2,
						shadowOffsetY: 2,
						shadowBlur: 10
					},
					emphasis: {
						color: '#252b3d'
					}
				},
				regions: [{
					name: '南海诸岛',
					itemStyle: {
						normal: {
							opacity: 0
						}
					}
				}]
			},
			series: [{
				type: 'scatter',
				coordinateSystem: 'geo',
				zlevel: 3,
				label: {
					normal: {
						show: true,
						position: 'right',
						textStyle: {
							color: '#fff',
							fontStyle: 'normal',
							fontFamily: 'arial',
							// fontSize: 14
						},
						formatter: '{b}'
					}
				},
				itemStyle: {
					normal: {
						show: false,
						color: function(item) {
							var val = item.data.val;
							return colorArr[val];
						}
					}
				}
			}, {
				type: 'lines',
				tooltip: {
					formatter: function(e) {
						//这里必须写,要不然鼠标放在线上会显示undefined
						return '';
					}
				},
				zlevel: 3,
				effect: {
					show: true,
					period: 7,
					symbolSize: 2,
					trailLength: 0.02,
					constantSpeed: 50,
					color: 'rgba(255,255,255,0.1)',
					shadowBlur: 8
				},
				lineStyle: {
					normal: {
						curveness: 0.2,
						color: function(item) {
							var line = item.data.line;
							var clr = line == 0 ? "rgba(51,204,0,0.1)" : "rgba(255,0,0,0.1)";
							return clr;
						}
					}
				}
			}]
		};
		myChart.setOption(option);
		myChart.on('georoam', function(e) {
			var _option = myChart.getOption();
			var _zoom = _option.geo[0].zoom;
			zoom = Math.round(_zoom);
			clearInterval(mapInt);
			mapInt = setTimeout(mapDataFn, 1000)
		});
		myChart.on('click', function(e) {
			if (e.data) {
				if (e.data.val > -1) {
					siteId = e.data.id;
					stationId = e.data.id;
					siteName = e.data.site;
					$("#site").html(siteName);
					clickFn();
					fileFn();
				}
			};
		});
	};
	initEchartFn();

	// 初始化右侧的折线图
	var lineDom = echarts.init(document.getElementById('main'));

	function initLineFn() {
		var line = {
			backgroundColor: "#010B1D",
			title: {
				text: '海区实时(分钟级)数据接收率统计表',
				x: 'center',
				textStyle: {
					fontSize: 14,
					color: '#fff'
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					label: {
						backgroundColor: '#010B1D',
					},
				},
				position: ['50%', '10%'],
				// formatter: function(value) {

				// }
			},
			grid: {
				left: '5%',
				right: '5%',
				top: '10%',
				bottom: '5%',
				containLabel: true
			},
			xAxis: [{
				type: "category",
				// data: ["上海", "宁波", "杭州", "厦门", "天津"],
				axisLine: {
					lineStyle: {
						color: '#35A0C9'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#fff'
					}
				}
			}],
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value}',
					textStyle: {
						color: '#35A0C9'
					}
				},
				splitLine: {
					lineStyle: {
						color: '#35A0C9',
						type: 'dashed'
					}
				},
				axisLine: {
					lineStyle: {
						color: '#35A0C9'
					}
				}
			},
			series: [{
					type: 'bar',
					barWidth: "12",
					barGap: 0,
					// data: [],
					itemStyle: {
						normal: {
							color: "#05B8FF"
						}
					},
					label: {
						normal: {
							show: true,
							fontWeight: 'bold',
							color: '#fff',
							position: 'top',
						}
					}
				},
				{
					type: 'bar',
					barWidth: "12",
					barGap: 0,
					// data: [],
					itemStyle: {
						normal: {
							color: "#FEA735"
						}
					},
					label: {
						normal: {
							show: true,
							fontWeight: 'bold',
							color: '#fff',
							position: 'top',
						}
					}
				}
			]
		};
		lineDom.setOption(line);
	};
	initLineFn();

	function getBarFn() {
		http({
			url: url.bar,
			type: 'get',
			data: {},
			success: function(res) {
				var deta = res.data;
				var name = [];
				var old = [];
				var news = [];
				for (var i = 0; i < deta.length; i++) {
					var detaItem = deta[i];
					var o = detaItem.old;
					var n = detaItem.new;
					name.push(detaItem.name);
					old.push(o);
					news.push(n);
				};
				var min = Number(res.min);
				var max = Number(res.max);
				var min = Math.floor(min * 0.8) == 0 ? 0 : Math.floor(min * 0.8);
				var max = Math.ceil(max * 1.2) == 0 ? 0 : Math.ceil(max * 1.2);
				lineDom.setOption({
					xAxis: [{
						data: name
					}],
					yAxis: {
						min: min,
						max: max
					},
					series: [{
							data: old
						},
						{
							data: news
						}
					]
				});
			}
		});
	};
	getBarFn();

	layForm.verify({
		handler: function(val) {
			if (!/^[\u4E00-\u9FA5a-zA-Z]*$/.test(val)) {
				return '请输入正确的故障处理人!';
			}
		},
		// endTime: function(val) {
		// 	if (val.length <= 0) {
		// 		return '请选择故障处理时间!';
		// 	}
		// },
	});
	var layHtm = null;
	window.alrFn = function(url, w, h) {
		var url = url || '',
			w = w || "1320px",
			h = h || "680px";
		lay.closeAll();
		layHtm = lay.open({
			type: 2,
			title: false,
			shade: 0.8,
			closeBtn: 0,
			area: [w, h],
			content: url,
			success: function() {
				window.clearTimeout(inspTime);
			}
		});
	};
	// alrFn('./confs.html');
	window.alrFns = function() {
		layAlr = null, layHtm = null;
		setTimeout(function() {
			inspFn();
		}, 500);
	};
	e("home", {})
});
