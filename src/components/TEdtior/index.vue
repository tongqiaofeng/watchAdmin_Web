<template>
	<div class="tinymce-boxz">
		<Editor v-model="content" :init="tiny.init" />
	</div>
</template>

<script setup name="TEditor">
import Editor from '@tinymce/tinymce-vue';
import { reactive, ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import config from '@/config/index';
import { uploadFile } from '@/request/api/api';
import { getUploadFileType } from '@/utils/utils';

import '/public/static/tinymce/tinymce.js';
import '/public/static/tinymce/themes/silver/theme';
import '/public/static/tinymce/icons/default/icons.js';

import '/public/static/tinymce/plugins/advlist/plugin';
import '/public/static/tinymce/plugins/anchor/plugin';
import '/public/static/tinymce/plugins/autolink/plugin';
import '/public/static/tinymce/plugins/autoresize/plugin';
import '/public/static/tinymce/plugins/bbcode/plugin';
import '/public/static/tinymce/plugins/charmap/plugin';
import '/public/static/tinymce/plugins/code/plugin';
import '/public/static/tinymce/plugins/codesample/plugin';
import '/public/static/tinymce/plugins/colorpicker/plugin';
import '/public/static/tinymce/plugins/contextmenu/plugin';
import '/public/static/tinymce/plugins/directionality/plugin';
import '/public/static/tinymce/plugins/emoticons/plugin';
import '/public/static/tinymce/plugins/fullpage/plugin';
import '/public/static/tinymce/plugins/fullscreen/plugin';
import '/public/static/tinymce/plugins/help/plugin';
import '/public/static/tinymce/plugins/hr/plugin';
import '/public/static/tinymce/plugins/image/plugin';
import '/public/static/tinymce/plugins/imagetools/plugin';
import '/public/static/tinymce/plugins/importcss/plugin';
import '/public/static/tinymce/plugins/insertdatetime/plugin';
import '/public/static/tinymce/plugins/legacyoutput/plugin';
import '/public/static/tinymce/plugins/link/plugin';
import '/public/static/tinymce/plugins/lists/plugin';
import '/public/static/tinymce/plugins/media/plugin';
import '/public/static/tinymce/plugins/nonbreaking/plugin';
import '/public/static/tinymce/plugins/noneditable/plugin';
import '/public/static/tinymce/plugins/paste/plugin';
import '/public/static/tinymce/plugins/preview/plugin';
import '/public/static/tinymce/plugins/print/plugin';
import '/public/static/tinymce/plugins/quickbars/plugin';
import '/public/static/tinymce/plugins/save/plugin';
import '/public/static/tinymce/plugins/searchreplace/plugin';
import '/public/static/tinymce/plugins/spellchecker/plugin';
import '/public/static/tinymce/plugins/tabfocus/plugin';
import '/public/static/tinymce/plugins/table/plugin';
import '/public/static/tinymce/plugins/template/plugin';
import '/public/static/tinymce/plugins/textcolor/plugin';
import '/public/static/tinymce/plugins/textpattern/plugin';
import '/public/static/tinymce/plugins/toc/plugin';
import '/public/static/tinymce/plugins/visualblocks/plugin';
import '/public/static/tinymce/plugins/visualchars/plugin';
import '/public/static/tinymce/plugins/wordcount/plugin';
import '/public/static/tinymce/plugins/pagebreak/plugin';
import '/public/static/tinymce/plugins/emoticons/js/emojis.js';

const content = ref('');

const props = defineProps({
	content: {
		type: String,
		default: '',
	},
});

watch(
	() => props.content,
	(value) => {
		content.value = value;
	},
	{
		deep: true,
		immediate: true,
	}
);

onMounted(() => {
	Editor.props.init({});
});

const tiny = reactive({
	apiKey: 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc',
	init: {
		language: 'zh_CN',
		placeholder: '请输入内容',
		min_width: 320,
		min_height: 550,
		max_height: 550,
		autoresize_min_height: 550,
		autoresize_max_height: 550,
		fontsize_formats:
			'12px 14px 15px 16px 17px 18px 20px 24px 36px 48px 56px 72px',
		language_url: config.assetsUrl + '/static/tinymce/langs/zh_CN.js',
		skin_url: config.assetsUrl + '/static/tinymce/skins/ui/oxide',
		content_css:
			config.assetsUrl + '/static/tinymce/skins/content/default/content.css',
		resize: 'both', //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
		branding: false,
		default_link_target: '_blank',
		relative_urls: false,
		remove_script_host: false,
		convert_urls: false, // 拒绝转换路径
		link_list: [],
		font_formats:
			'微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;', //字体样式
		plugins:
			'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern emoticons', //插件配置 axupimgs indent2em
		toolbar: [
			'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat ',
			'styleselect formatselect fontselect fontsizeselect |  table image axupimgs media emoticons charmap hr pagebreak insertdatetime  selectall visualblocks searchreplace | code print preview | indent2em lineheight formatpainter',
		],
		menubar: true, // 是否展示菜单栏
		images_upload_credentials: true,
		paste_data_images: true, //图片是否可粘贴
		file_picker_types: 'file image media',
		images_upload_handler: (blobInfo, success, failure) => {
			let files = blobInfo.blob();
			if (files) {
				const _uploadFile = async (file) => {
					const res = await uploadFile(file);
					if (res.errno == 1) {
						ElMessage.warning(res.message);
						failure(res.message);
					} else {
						let url = res.data.url;
						ElMessage.success('上传成功');
						success(config.baseFileUrl + url);
					}
				};
				_uploadFile(files);
			}
		},
		// 自定义上传文件
		file_picker_callback: (callback, value, meta) => {
			if (meta.filetype == 'media') {
				const input = document.createElement('input');
				input.setAttribute('type', 'file');
				input.setAttribute('accept', 'video/*');
				input.onchange = function () {
					const files = this.files[0];
					if (files) {
						const fileType = files.type.split('/')[1];
						const type = getUploadFileType(fileType);
						if (type !== 'video') {
							ElMessage.warning('请选择视频类型文件');
							return;
						} else {
							const _uploadFile = async (file) => {
								const res = await uploadFile(file);
								if (res.errno == 1) {
									ElMessage.warning(res.message);
								} else {
									let url = res.data.url;
									ElMessage.success('上传成功');
									callback(config.baseFileUrl + url, { title: file.name }); //将url显示在弹框输入框中
								}
							};
							_uploadFile(files);
						}
					}
				};
				input.click(); // 自己触发
			} else if (meta.filetype == 'file' || meta.filetype == 'image') {
				// 上传文件
				const input = document.createElement('input');
				input.setAttribute('type', 'file');
				input.onchange = function () {
					const files = this.files[0];
					if (files) {
						const _uploadFile = async (file) => {
							const res = await uploadFile(file);
							if (res.errno == 1) {
								ElMessage.warning(res.message);
							} else {
								let url = res.data.url;
								ElMessage.success('上传成功');
								callback(config.baseFileUrl + url);
							}
						};
						_uploadFile(files);
					}
				};
				input.click(); // 自己触发
			}
		},
	},
});

const getEditorHtml = () => {
	return content.value;
};

const clearEditorContent = () => {
	content.value = '';
};

defineExpose({
	getEditorHtml,
	clearEditorContent,
});
</script>

<style scoped>
.tinymce-boxz>textarea {
	display: none;
}
</style>
<style>
.tox-notifications-container .tox-notification--warning {
	display: none !important;
}

.tox.tox-tinymce {
	max-width: 100%;
}
</style>
