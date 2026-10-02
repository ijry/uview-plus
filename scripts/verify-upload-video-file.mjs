#!/usr/bin/env node

/**
 * Verification script for issue #801
 *
 * H5下用upload组件选视频，组件只把 blob: 地址交给调用方：formatVideo 把整个
 * chooseVideo 结果对象塞进了 item.file，而真正的 File（res.tempFile）没有透出。
 * 于是无论是业务代码还是组件自带的自动上传，都得让 uni.uploadFile 把 blob: 地址
 * 再读回二进制——而部分 webview（如微信内置浏览器）读 blob: 会拿到空内容，
 * uni.uploadFile 直接以 "uploadFile:fail file error" 失败。
 *
 * 本脚本按条件编译分别产出H5/非H5两份代码并真的执行：
 *   1. formatVideo 在H5下把真实 File 透出到 item.file（且 formatImage 不回归）
 *   2. uploadFileParams 在H5下把 File 直接交给 uni.uploadFile（files 形式）
 *   3. 没有 File 的条目、以及非H5平台，仍然走 filePath，行为不变
 *   4. 两处 uni.uploadFile 调用都改用了 uploadFileParams
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const compDir = join(projectRoot, 'src/uni_modules/uview-plus/components/u-upload')

console.log('Verifying u-upload H5 video File exposure (issue #801)...\n')

const issues = []
const ok = (msg) => console.log('✓ ' + msg)
const bad = (msg) => issues.push('❌ ' + msg)

/** 极简条件编译：支持 #ifdef/#ifndef/#else/#endif 和 `A || B` 形式的平台列表。 */
function preprocess(source, platform) {
	const out = []
	const stack = []
	for (const line of source.split(/\r?\n/)) {
		const m = /^\s*\/\/\s*#(ifdef|ifndef|else|endif)\b\s*(.*)$/.exec(line)
		if (m) {
			const [, kind, rest] = m
			if (kind === 'ifdef' || kind === 'ifndef') {
				const hit = rest.split('||').map((s) => s.trim()).filter(Boolean).includes(platform)
				stack.push(kind === 'ifdef' ? hit : !hit)
			} else if (kind === 'else') {
				stack[stack.length - 1] = !stack[stack.length - 1]
			} else {
				stack.pop()
			}
			continue
		}
		if (stack.every(Boolean)) out.push(line)
	}
	return out.join('\n')
}

/** 从源码里取出一个对象方法（含函数体），按大括号配平截断。 */
function extractMethod(source, name) {
	const at = new RegExp('\\n\\s*' + name + '\\s*\\(').exec(source)
	if (!at) return null
	const start = source.indexOf(name, at.index)
	let depth = 0
	for (let i = source.indexOf('{', start); i < source.length; i++) {
		if (source[i] === '{') depth++
		else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1)
	}
	return null
}

// ---------------------------------------------------------------- utils.js
const utilsSrc = readFileSync(join(compDir, 'utils.js'), 'utf-8')
// chooseFile 之后的部分依赖 uni/test，格式化函数在它之前，单独取出即可执行。
const formatters = utilsSrc.slice(0, utilsSrc.indexOf('export function chooseFile'))
const h5Formatters =
	preprocess(formatters, 'H5').replace(/^import .*$/gm, '') +
	'\nexport { formatImage, formatVideo };\n'
const { formatImage, formatVideo } = await import(
	'data:text/javascript;charset=utf-8,' + encodeURIComponent(h5Formatters)
)

const videoFile = new File([new Uint8Array(64)], 'movie.mp4', { type: 'video/mp4' })
const chooseVideoRes = {
	tempFilePath: 'blob:http://localhost/aaaa-bbbb',
	tempFile: videoFile,
	size: videoFile.size,
	duration: 3,
	width: 160,
	height: 120,
	name: 'movie.mp4',
	errMsg: 'chooseVideo:ok',
}
const videoItem = formatVideo(chooseVideoRes)[0]
if (videoItem.file instanceof File && videoItem.file === videoFile) {
	ok('formatVideo: item.file 是 chooseVideo 返回的真实 File')
} else {
	bad(
		'formatVideo: item.file 不是 File，而是 ' +
			Object.prototype.toString.call(videoItem.file) +
			'（调用方只能退回去读 blob: 地址）',
	)
}
if (videoItem.url === chooseVideoRes.tempFilePath && videoItem.size === videoFile.size) {
	ok('formatVideo: url/size 等原有字段保持不变')
} else {
	bad('formatVideo: url/size 字段被改动了')
}

const imageFile = new File([new Uint8Array(32)], 'pic.png', { type: 'image/png' })
imageFile.path = 'blob:http://localhost/cccc-dddd'
const imageItem = formatImage({ tempFiles: [imageFile] })[0]
if (imageItem.file === imageFile) {
	ok('formatImage: item.file 仍然是真实 File（无回归）')
} else {
	bad('formatImage: item.file 不再是真实 File')
}

// ------------------------------------------------------------ u-upload.vue
const vueSrc = readFileSync(join(compDir, 'u-upload.vue'), 'utf-8')
const method = extractMethod(vueSrc, 'uploadFileParams')
if (!method) {
	bad('u-upload.vue: 找不到 uploadFileParams 方法')
} else {
	const build = (platform) =>
		new Function('return (function ' + preprocess(method, platform) + ')')()

	const h5 = build('H5')
	const withFile = h5({ file: videoFile, url: 'blob:http://localhost/aaaa-bbbb' })
	if (
		Array.isArray(withFile.files) &&
		withFile.files.length === 1 &&
		withFile.files[0].file === videoFile &&
		withFile.files[0].name === 'file' &&
		withFile.filePath === undefined
	) {
		ok('uploadFileParams(H5): 带 File 的条目直接以 files 形式上传，不再经过 blob: 地址')
	} else {
		bad('uploadFileParams(H5): 带 File 的条目没有走 files，得到 ' + JSON.stringify(Object.keys(withFile)))
	}

	const onlyTempFile = h5({ tempFile: videoFile, url: 'blob:http://localhost/aaaa-bbbb' })
	if (onlyTempFile.files && onlyTempFile.files[0].file === videoFile) {
		ok('uploadFileParams(H5): 只带 tempFile 的旧数据同样能取到 File')
	} else {
		bad('uploadFileParams(H5): 只带 tempFile 的条目没取到 File')
	}

	const remote = h5({ url: 'https://cdn.example.com/1.jpg' })
	if (remote.filePath === 'https://cdn.example.com/1.jpg' && remote.files === undefined) {
		ok('uploadFileParams(H5): 没有 File 的条目仍走 filePath')
	} else {
		bad('uploadFileParams(H5): 没有 File 的条目行为被改变')
	}

	const mp = build('MP-WEIXIN')({ file: videoFile, url: 'http://tmp/movie.mp4' })
	if (mp.filePath === 'http://tmp/movie.mp4' && mp.files === undefined && mp.name === 'file') {
		ok('uploadFileParams(非H5): 条件编译后只剩 filePath，小程序/App 行为不变')
	} else {
		bad('uploadFileParams(非H5): 非H5平台的参数被改变了 ' + JSON.stringify(mp))
	}
}

const usedByCallSites = (vueSrc.match(/\.\.\.this\.uploadFileParams\(lists\[j\]\)/g) || []).length
if (usedByCallSites === 2) {
	ok('两处 uni.uploadFile（local/oss）都改用了 uploadFileParams')
} else {
	bad('只有 ' + usedByCallSites + '/2 处 uni.uploadFile 使用了 uploadFileParams')
}
if (/filePath:\s*lists\[j\]\.url/.test(vueSrc)) {
	bad('仍有 uni.uploadFile 直接使用 filePath: lists[j].url')
} else {
	ok('自动上传不再直接把 blob: 地址当 filePath 传出去')
}

console.log('')
if (issues.length === 0) {
	console.log('✅ All checks passed - issue #801 is fixed')
	process.exit(0)
} else {
	console.log('❌ Verification failed:\n')
	issues.forEach((i) => console.log('  ' + i))
	process.exit(1)
}
