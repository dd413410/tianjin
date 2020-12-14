layui.define(["urls", "form"], function(e) {
	var http = layui.urls.http,
		url = layui.urls.url,
		layForm = layui.form;

	function trimFn(name) {
		var reg = /\S/;
		if (!name) {
			return false;
		} else {
			name.trim();
			return reg.test(name);
		}
	};
	layForm.verify({
		user: function(val) {
			if (!trimFn(val)) {
				return '请输入用户名!';
			}
		},
		pass: function(val) {
			if (!trimFn(val)) {
				return '请输入密码!';
			}
		}
	});
	layForm.on('submit(login)', function(data) {
		// sessionStorage.token = "11";
		
		// window.location.href = './pages/home.html';
		
		http({
			url: url.login,
			type: 'post',
			data: {
				userName: data.field.user,
				passWord: data.field.pass
			},
			success: function(res) {
				sessionStorage.clear();
				sessionStorage.user = data.field.user;
				sessionStorage.token = res.token;
				sessionStorage.limit = res.limit;
				window.location.href = './pages/home.html';
			}
		});
		return false;
	});

	e("index", {})
});
