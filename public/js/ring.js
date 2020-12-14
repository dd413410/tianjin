layui.define(["urls", "form"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url;

	var $ = layui.$,
		form = layui.form;

	var areaId = '';

	function getAreaFn() {
		http({
			url: url.homearea,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.title + '</option>'
				};
				$("#area").html(str);
				form.render("select");
				areaId = data.length > 0 ? data[0].pk : "";
				getBarFn();
			}
		})
	};
	getAreaFn();

	form.on('select(filt)', function(data) {
		areaId = data.value;
		getBarFn();
		return false;
	});
	window.getFn = function() {
		areaId = $("#area").val();
		getBarFn();
	};

	function getBarFn() {
		http({
			url: url.homearea,
			type: 'post',
			data: {
				id: areaId
			},
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
	var lineDom = echarts.init(document.getElementById('main'));

	function initLineFn() {
		var line = {
			backgroundColor: "#08132c",
			title: {
				text: '中心站实时(分钟级)数据接收率统计表',
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
			},
			grid: {
				left: '2%',
				right: '2%',
				top: '8%',
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

	$('#close').click(function() {
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("ring", {})
});
