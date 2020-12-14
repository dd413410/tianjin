layui.define(function(e) {
	layui.use(["urls", "form", "laydate"], function() {
		var http = layui.urls.http,
			url = layui.urls.url;
			
		var	lay = layui.layer,
			layForm = layui.form,
			laydate = layui.laydate;

		$("#sum-box").niceScroll({
			cursorborder: "#1b84d2",
			cursorcolor: "#1b84d2",
			boxzoom: true
		});

		var date = new Date();
		var year = date.getFullYear();

		laydate.render({
			elem: '#time',
			type: 'year',
			max: 0,
			format: 'yyyy',
			value: year,
			btns: ['confirm'],
			done: function(v) {
				year = v;
			}
		});

		window.getFn = function() {

			getListFn();
			getLineFn(); //折线图
			getColFn();//柱状图
		};

		function getListFn() {
			$("#tbody").empty();
			http({
				url: url.global,
				type: "get",
				data: {
					time: year
				},
				success: function(res) {
					var data = res.data;
					for (var i = 0; i < data.length; i++) {
						var str = '';
						for (var c = 0; c < data[i].length; c++) {
							str += '<div class="layui-col-xs2">' + data[i][c] + '</div>';
						};
						$("#tbody").append('<div class="tbody">' + str + '</div>')
					};
				}
			})
		};





		// 折线图
		function getLineFn() {
			http({
				url: url.global,
				type: "post",
				data: {
					time: year
				},
				success: function(res) {
					var title = res.title;
					var data = res.data;
					var nameArr = [];
					var dataArr = [];
					for (var i = 0; i < data.length; i++) {
						var dataItem = data[i];
						nameArr.push(dataItem.name);
						dataArr.push({
							name: dataItem.name,
							type: 'line',
							smooth: true,
							data: dataItem.data
						})
					};

					line.setOption({
						legend: {
							data: nameArr,
						},
						xAxis: {
							data: title
						},
						series: dataArr
					});
				}

			})
		};
		// 海区柱状图
		function getColFn() {
			http({
				url: url.columnar,
				type: "get",
				data: {
					time: year
				},
				success: function(res) {
					var title=res.title;
					var data=res.data;
					bar.setOption({
						xAxis:{
							data:title
						},
						series: [{
								type: 'bar',
								barWidth: 30,
								data: data
							}
						]
					})
				}
			});
			
			http({
				url: url.columnar,
				type: "post",
				data: {
					time: year
				},
				success: function(res) {
					var title=res.title;
					var data=res.data;
					bars.setOption({
						xAxis:{
							data:title
						},
						series: [{
								type: 'bar',
								barWidth: 30,
								data: data
							}
						]
					})
				}
			});
		};


		var line = echarts.init(document.getElementById('line'));

		function initLineFn() {
			var option = {
				backgroundColor: "#091c42",
				color: ['#e064e8', '#73DEB3', '#FFB761', '#24c864', '#b4badd'],
				title: {
					text: "海区接收率折线图",
					textStyle: {
						color: "#07a6ff"
					},
					left: "center",
					top: 5
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#999'
						},
						lineStyle: {
							type: 'dashed'
						}
					},
					formatter: function(e) {
						var str = '';
						for (var i = 0; i < e.length; i++) {
							str += e[i].marker + e[i].seriesName+':'+e[i].data + '%</br>';
						};
						return str;
					}
				},
				grid: {
					left: '25',
					right: '25',
					bottom: '24',
					top: '35',
					containLabel: true
				},
				legend: {
					data: ['北海', '地方站', '全局情况'],
					icon: "circle",
					right: 20,
					top: 5,
					textStyle: {
						color: "#fff"
					}
				},
				xAxis: {
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
					splitLine: {
						show: false
					},
					axisTick: {
						show: true,
						lineStyle: {
							color: "#07a6ff"
						}
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: "#07a6ff"
						}
					},
				},
				yAxis: {
					min: 0,
					max: 100,
					axisLabel: {
						color: '#07a6ff',
						textStyle: {
							fontSize: 12
						},
						formatter: function(value) {
							return value + '%'
						}
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: "#07a6ff"
						}
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: "#07a6ff"
						}
					}
				},
				// series: [{
				// 		name: '北海',
				// 		type: 'line',
				// 		smooth: true,
				// 		data: [6.53, 6.53]
				// 	},
				// 	{
				// 		name: '地方站',
				// 		type: 'line',
				// 		smooth: true,
				// 		data: [100, 100]
				// 	},
				// 	{
				// 		name: '全局情况',
				// 		type: 'line',
				// 		smooth: true,
				// 		data: [6.53, 6.53]
				// 	}
				// ]
			};
			line.setOption(option);
		};
		initLineFn();


		var bar = echarts.init(document.getElementById('bar'));

		function initBarFn() {
			var option = {
				backgroundColor: '#091c42',
				color: '#38b8f2',
				// color: ['#73A0FA', '#73DEB3', '#FFB761'],
				title: {
					text: "海区接收率柱状图",
					textStyle: {
						color: "#07a6ff"
					},
					left: "center",
					top: 5
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#07a6ff'
						},
						lineStyle: {
							type: 'dashed'
						}
					},
					formatter: function(e) {
						var str = '';
						for (var i = 0; i < e.length; i++) {
							str += e[i].marker + e[i].name+':'+e[i].data + '%</br>';
						};
						return str;
					}
				},
				grid: {
					left: '25',
					right: '25',
					bottom: '24',
					top: '75',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: ['北海', '东海', '南海', '地方站', '全局'],
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: "#07a6ff"
						}
					},
				},
				yAxis: {
					min: 0,
					max: 100,
					axisLabel: {
						color: '#07a6ff',
						textStyle: {
							fontSize: 12
						},
						formatter: function(value) {
							return value + '%'
						}
					},
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: "#07a6ff"
						}
					}
				},
				// series: [{
				// 		type: 'bar',
				// 		barWidth: 30,
				// 		data: [20, 40, 60, 80, 50]
				// 	}
				// ]
			};
			bar.setOption(option);
		};
		initBarFn();




		var bars = echarts.init(document.getElementById('bars'));

		function initBarsFn() {
			var option = {
				backgroundColor: '#091c42',
				color: ['#73A0FA', '#73DEB3', '#FFB761'],
				title: {
					text: "中心站接收率柱状图",
					textStyle: {
						color: "#07a6ff"
					},
					left: "center",
					top: 5
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#07a6ff'
						},
						lineStyle: {
							type: 'dashed'
						}
					},
					formatter:function(e){
						var str = '';
						for (var i = 0; i < e.length; i++) {
							str += e[i].marker + e[i].name+':'+ e[i].data + '%</br>';
						};
						return str;
					}
				},
				grid: {
					left: '25',
					right: '25',
					bottom: '24',
					top: '75',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: ['北海', '东海', '南海', '地方站', '全局'],
					axisLabel: {
						formatter: function(val) {
							return val.split("").join("\n");
						}
					},
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: "#07a6ff"
						}
					},
				},
				yAxis: {
					min: 0,
					max: 100,
					axisLabel: {
						color: '#07a6ff',
						textStyle: {
							fontSize: 12
						},
						formatter: function(value) {
							return value + '%'
						}
					},
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: "#07a6ff"
						}
					}
				},
				// series: [{
				// 		type: 'bar',
				// 		barWidth: 30,
				// 		data: [20, 40, 60, 80, 50]
				// 	}
				// ]
			};
			bars.setOption(option);
		};
		initBarsFn();





		window.toSumFn = function() {
			layer.open({
				type: 2,
				title: false,
				shade: 0.8,
				closeBtn: 0,
				area: ["1320px", "100%"],
				content: "./sum.html",
			});
		};
		$('#close').click(function() {
			var index = parent.layer.getFrameIndex(window.name)
			parent.layer.close(index);
		});
	});
	e("sum", {})
});
