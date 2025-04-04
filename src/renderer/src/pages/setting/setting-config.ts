import { SettingMenu, SettingSubMenu } from '@renderer/types'
import { DocDir } from '@renderer/utils'

const commonNames = {
  '--': {
    title: '基础设置'
  },
  'save-path': {
    type: 'directory',
    title: '文档保存路径',
    value: DocDir
  }
}

const cssClassNames = {
  '--': {
    title: '代码块设置'
  },
  'hljs-comment': {
    title: '代码注释',
    value: '#616161'
  },
  'hljs-quote': {
    title: '引用内容',
    value: '#616161'
  },
  'hljs-variable': {
    title: '变量',
    value: '#f98181'
  },
  'hljs-template-variable': {
    title: '模板变量',
    value: '#f98181'
  },
  'hljs-attribute': {
    title: 'HTML属性/特性',
    value: '#f98181'
  },
  'hljs-tag': {
    title: 'HTML标签',
    value: '#f98181'
  },
  'hljs-regexp': {
    title: '正则表达式',
    value: '#f98181'
  },
  'hljs-link': {
    title: '超链接',
    value: '#f98181'
  },
  'hljs-name': {
    title: '名称（如标签名）',
    value: '#f98181'
  },
  'hljs-selector-id': {
    title: 'CSS ID选择器',
    value: '#f98181'
  },
  'hljs-selector-class': {
    title: 'CSS类选择器',
    value: '#f98181'
  },
  'hljs-number': {
    title: '数字',
    value: '#fbbc88'
  },
  'hljs-meta': {
    title: '元信息（如预处理指令）',
    value: '#fbbc88'
  },
  'hljs-built_in': {
    title: '内置对象/函数',
    value: '#fbbc88'
  },
  'hljs-builtin-name': {
    title: '内置名称（如关键字）',
    value: '#fbbc88'
  },
  'hljs-literal': {
    title: '字面量（如true/false）',
    value: '#fbbc88'
  },
  'hljs-type': {
    title: '类型（如数据类型）',
    value: '#fbbc88'
  },
  'hljs-params': {
    title: '函数参数',
    value: '#fbbc88'
  },
  'hljs-string': {
    title: '字符串',
    value: '#b9f18d'
  },
  'hljs-symbol': {
    title: '符号（如Ruby的符号）',
    value: '#b9f18d'
  },
  'hljs-bullet': {
    title: '列表项标记（如Markdown列表）',
    value: '#b9f18d'
  },
  'hljs-title': {
    title: '标题（如函数名）',
    value: '#faf594'
  },
  'hljs-section': {
    title: '代码区块标题',
    value: '#faf594'
  },
  'hljs-keyword': {
    title: '编程语言关键字',
    value: '#70cff8'
  },
  'hljs-selector-tag': {
    title: 'CSS标签选择器',
    value: '#70cff8'
  },
  'hljs-emphasis': {
    title: '强调文本（斜体）'
  },
  'hljs-strong': {
    title: '强调文本（粗体）'
  }
}

const classMenus: SettingMenu[] = [
  {
    name: '编辑器配置',
    content: [
      ...(Object.keys(commonNames).map((v) => ({
        type: commonNames[v].type,
        title: commonNames[v].title,
        name: v,
        value: commonNames[v].value
      })) as SettingSubMenu[]),
      ...(Object.keys(cssClassNames).map((v) => ({
        type: 'color',
        title: cssClassNames[v].title,
        name: v,
        value: cssClassNames[v].value
      })) as SettingSubMenu[])
    ]
  },
  {
    name: '关于',
    content: [
      {
        type: 'text',
        title: '本软件为开源软件',
        name: 'about1',
        value: ''
      },
      {
        type: 'text',
        title: '开源地址：https://github.com/xiaoxustudio/zero-note',
        name: 'about2',
        value: ''
      }
    ]
  }
]

export default classMenus
