layui.define(["urls", "form"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url;

	var $ = layui.$,
		lay = layui.layer,
		layForm = layui.form;


	function getDataFn() {
		http({
			url: url.config,
			type: 'get',
			data: {},
			success: function(res) {
				var data = res.data;
				layForm.val('filePath', {
					"receivePath": data.receivePath,
					"commandPath": data.commandPath,
					"logPath": data.logPath
				});
			}
		});
	};
	getDataFn();


	layForm.on('submit(change)', function(data) {
		
		var data=data.field;
		http({
			url: url.config,
			type: 'post',
			data: data,
			success: function(res) {
				layer.msg("修改成功");
				getDataFn();
			}
		});
	});

	$('#close').click(function() {
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("filePath", {})
});
