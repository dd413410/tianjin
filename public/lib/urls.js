layui.define(['jquery', 'layer'], function(exports) {
	var $ = layui.$,
		lay = layui.layer,
		baseUrl = 'http://192.168.1.156:8004';


	// var $ = layui.$,
	// 	curPath = window.document.location.href,
	// 	pathName = window.document.location.pathname,
	// 	pos = curPath.indexOf(pathName),
	// 	baseUrl = curPath.substring(0, pos);

	var urls = {
		http: function(val) {
			if (val.type == 'post') {
				val.contentType = 'application/x-www-form-urlencoded';
			};
			var token = sessionStorage.token || '';
			var url = val.url || '';
			var type = val.type || 'get';
			var data = val.data || {};
			var dataType = val.dataType || 'json';
			var async = val.async || true;
			$.ajax({
				url: url,
				type: type,
				headers: {
					'Content-Type': val.contentType,
					'token': token
				},
				data: data,
				dataType: dataType,
				async: async,
				beforeSend: function(bef) {
					val.beforeSend && val.beforeSend();
				},
				success: function(res) {
					val.success && val.success(res);
				},
				error: function(err) {
					var code = err.status;
					if (code == 400) {
						val.error && val.error(code);
						lay.msg(err.responseJSON.msg);
					} else if (code == 404) {
						val.error && val.error(code);
						lay.msg('请求地址不存在!');
					} else if (code == 500) {
						val.error && val.error(code);
						// lay.msg('服务器错误!');
					} else if (code == 502) {
						// var url = window.location.origin + '/dist/index.html'
						var url = window.location.origin + '/static/dist/index.html'
						window.top.location.href = url;
					} else {
						val.error && val.error(code);
					};
				},
				complete: function(r) {
					val.complete && val.complete(r.responseJSON);
				}
			});
		},
		isClick: true,
		load: function(met, u, data) {
			var that = this;
			if (that.isClick) {
				that.isClick = false;
				setTimeout(function() {
					that.isClick = true;
				}, 2000);
				that.http({
					url: u || "",
					type: met || "get",
					data: data || {},
					success: function(res) {
						window.location.href = res.url;
					},
					error: function(err) {
						lay.msg("下载失败!")
					}
				});
			};
		},

		url: {
			login: baseUrl + '/limit/login/',
			homeindex: baseUrl + '/home/index/',
			homeclock: baseUrl + '/home/clock/',
			homearea: baseUrl + '/home/bar/area/',
			receive: baseUrl + '/home/receive/',
			alarms: baseUrl + '/home/alarms/',
			bar: baseUrl + '/home/bar/',
			
			close:baseUrl + '/fault/close/',
			// 权限管理
			limitList: baseUrl + '/limit/list/',
			limitAdd: baseUrl + '/limit/add/',
			limitDele: baseUrl + '/limit/dele/',
			climit: baseUrl + '/limit/change/',
			branch: baseUrl + '/limit/branch/',
			limittree: baseUrl + '/limit/tree/',
			//人员信息
			infolist: baseUrl + '/info/list/',
			infotype: baseUrl + '/info/type/',
			infstype: baseUrl + '/info/stype/',
			infoadd: baseUrl + '/info/add/',
			infodele: baseUrl + '/info/dele/',
			infochange: baseUrl + '/info/change/',
			// 站点管理
			siteotype: baseUrl + '/site/otype/',
			sitentype: baseUrl + '/site/ntype/',
			sitestype: baseUrl + '/site/stype/',
			siteel: baseUrl + '/site/el/',

			sitemain: baseUrl + '/site/main/',


			sitelisttype: baseUrl + '/site/list/type/',
			sitelistsype: baseUrl + '/site/list/stype/',
			sitelist: baseUrl + '/site/list/',
			siteType: baseUrl + '/site/type/',
			siteTree: baseUrl + '/site/tree/',
			sitedeta: baseUrl + '/site/data/',
			siteAdd: baseUrl + '/site/add/',
			sitechange: baseUrl + '/site/change/',
			sitedele: baseUrl + '/site/dele/',

			sitedefault: baseUrl + '/site/default/',
			
			siteDownload: baseUrl + '/site/download/',

			// 观测接口
			buoy: baseUrl + '/data/buoy/',
			radarType: baseUrl + '/radar/type/',
			radar: baseUrl + '/data/radar/',
			gps: baseUrl + '/data/gps/',
			boat: baseUrl + '/data/boat/',
			// 数据接收率
			dataMenu: baseUrl + '/data/menu/',
			dataType: baseUrl + '/data/type/',
			dataList: baseUrl + '/data/list/',
			// 汇总统计
			global: baseUrl + '/data/global/',
			columnar: baseUrl + '/data/columnar/',
			// 故障统计
			faultlist: baseUrl + '/fault/list/',
			faultdata: baseUrl + '/fault/data/',
			faultchange: baseUrl + '/fault/change/',
			faultpush: baseUrl + '/fault/push/',
			faultdele: baseUrl + '/fault/dele/',



			// 配置页面
			trslist: baseUrl + '/trs/list/',

			trsdele: baseUrl + '/trs/dele/',

			trsadd: baseUrl + '/trs/change/',
			trstree: baseUrl + '/trs/tree/',
			recall: baseUrl + '/trs/recall/',

			config: baseUrl + '/trs/config/',


		}
	};
	exports('urls', urls);
});
