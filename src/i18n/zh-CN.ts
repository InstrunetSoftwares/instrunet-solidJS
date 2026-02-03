import {Ii18n} from "./Ii18n";

const Instrunet  = {
	TITLE: "伴奏网",
	DESC: "AI支持的，免费的伴奏分享网站",
	SLOGAN: "听点什么？",
	ALL: "全部",
	QUEUE: "队列",
	CONTACT: "联系",
	DONATE: "打赏",
	FORUM: "反馈",
	GIT: "GitHub",
	SECRET: "网易下载",

	COVER: "封面",
	SONG_NAME: "歌名",
	ALBUM_NAME: "专辑",
	ARTIST: "艺术家",
	KIND:  [
		"去和声伴奏",
		"和声伴奏",
		"无和声人声",
		"贝斯",
		"鼓",
		"和声人声",
		"吉他"
	],
	KIND_SELF: "种类",
	DOC_TITLE:{
		START: "播放队列：",  END: " ｜ 伴奏网"
	},PITCHING: "变调", LOGIN_REQ: "请登录", LRC: "歌词",
	QUEUE_TITLE: "队列 ｜ 伴奏网",
	SEARCH_TITLE:{
		START: "搜索：",
		ZENBU: "全部",
		END: " ｜ 伴奏网"
	}
}
const STT  = {
	TITLE: "语音转文字工具",
	DESC: "“不大可用”于歌词类“带有旋律”的语音音频。"
}
const Sanctuary = {
	TITLE: "Sanctuary",
	DESC: "反馈论坛",
}
const MusicUnlock = {
	TITLE: "音乐解锁",
	DESC: "VIP平台下载音乐解锁",
}
const JustTalk = {
	TITLE: "Just Talk",
	DESC: "极客，，，",
}
const General = {
	ACCESS: "访问",
	LOGIN: "登录",
	REG: "注册",
	USERNAME: "用户名",
	EMAIL: "电子邮箱",
	PASSWORD: "密码",
	INFO_LOGIN_ERROR: "登录失败，请检查用户名和密码是否正确。",
	INFO_LOGIN_SUCCESS: "登录成功，正在跳转……",
	INFO_REG_SUCCESS:"注册成功，正在跳转……",
	INFO_REG_ERROR: "因未知因素，注册失败。",
	OPTIONAL: "可选",
	 LOADING: "正在加载",
	DEL: "删除", DEL_CONFIRM: "确定？", ACTION: "操作",
	FRONT: "前", DOWNLOAD:"下载", COMMENT: "评论", SEND: "发送", UPLOAD_TIME: "上传时间", EMPTY: "空" , SEARCH: "搜索", UPLOAD: "上传"
}

export const ZHCN: Ii18n = {
	Instrunet, STT, Sanctuary, MusicUnlock, JustTalk, General
}