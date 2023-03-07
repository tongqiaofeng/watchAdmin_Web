/**
 * 系统配置
 */

const mode = import.meta.env.MODE;

const baseUrl = 'http://171.221.210.114:9876';
// const baseUrl = 'http://192.168.0.164:8085';
// const baseUrl = 'https://www.eci-metro.cn';

let assetsUrl;
if (mode == 'development') {
	assetsUrl = '/public';
} else {
	assetsUrl = baseUrl + '/admin';
}

const config = {
	title: '易初明通后台管理系统', // 网站标题
	baseUrl: baseUrl + '/api', // 请求地址
	baseFileUrl: baseUrl + '/api/file/',
	timeout: 10 * 1000, //请求超时时长
	editorReplaceFlag: '/_file_/', // 富文本编辑器域名替换地址标志

	// DL6BZ-2TPWD-WP24E-HUZ6W-CZAUF-Z6FGI
	txMapKey: 'NM7BZ-Q2Y32-O42UI-CI7OQ-E3XQ7-TXFFO',
	// 左侧菜单配置
	menu: {
		bgColor: '#fff',
		textColor: '#1A1A1A',
		activeTextColor: '#DEA600',
		activeMenuBgColor: '#FAF5E1',
	},
	assetsUrl,
};

export default config;
