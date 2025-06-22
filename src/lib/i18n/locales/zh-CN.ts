export const zhCN = {
  // 通用
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    close: '关闭',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    copy: '复制',
    search: '搜索',
    filter: '筛选',
    clear: '清除',
    clearAll: '清除全部',
    all: '全部',
    none: '无',
    yes: '是',
    no: '否',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '提交',
    reset: '重置',
  },

  // 头部导航
  header: {
    toggleSidebar: '切换侧边栏',
    settings: '设置',
    submitColor: '提交颜色',
    totalColors: '总颜色',
    favorites: '收藏',
    switchTheme: '切换主题',
    switchViewMode: '切换视图模式',
  },

  // 主题
  theme: {
    light: '浅色',
    dark: '深色',
    system: '跟随系统',
  },

  // 视图模式
  viewMode: {
    grid: '网格',
    list: '列表',
    compact: '紧凑',
    gridView: '网格视图',
    listView: '列表视图',
    compactView: '紧凑视图',
  },

  // 语言
  language: {
    'zh-CN': '简体中文',
    'en-US': 'English',
  },

  // 设置
  settings: {
    title: '设置',
    theme: '主题',
    themeDescription: '选择界面主题',
    viewMode: '视图模式',
    viewModeDescription: '选择颜色显示方式',
    language: '语言',
    languageDescription: '选择界面语言',
  },

  // 搜索和筛选
  search: {
    placeholder: '搜索颜色...',
    noResults: '未找到匹配的颜色',
    noColors: '暂无颜色',
    noColorsDescription: '开始添加一些颜色来构建您的调色板吧！',
    categories: '分类',
    tags: '标签',
    temperature: '颜色温度',
    favorites: '收藏',
    favoritesOnly: '只显示收藏',
    warm: '暖色',
    cool: '冷色',
    neutral: '中性色',
  },

  // 侧边栏
  sidebar: {
    colorCategories: '颜色分类',
    allColors: '全部颜色',
    recentColors: '最近使用',
    favoriteColors: '收藏颜色',
  },

  // 颜色相关
  color: {
    name: '颜色名称',
    description: '描述',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    css: 'CSS变量',
    cssVariable: 'CSS Variable',
    temperature: '颜色温度',
    category: '分类',
    tags: '标签',
    favorite: '收藏',
    unfavorite: '取消收藏',
    copySuccess: '已复制到剪贴板',
    copyFailed: '复制失败',
    similarColors: '相似颜色',
    colorDetails: '颜色详情',
    usageCount: '使用次数',
    usageStats: '使用统计',
    colorFormats: '颜色格式',
    categoriesAndTemperature: '分类和温度',
    isFavorite: '收藏',
    show: '显示',
    hide: '隐藏',
    submitSimilarColor: '提交类似颜色',
    clickToCopy: '点击复制',
    createdAt: '创建时间',
    unknown: '未知',
    brand: '品牌色',
    ui: 'UI色彩',
    team: '团队色彩',
    warm: '暖色',
    cool: '冷色',
    neutral: '中性色',
  },

  // 提交指南
  submitGuide: {
    title: '提交新颜色',
    description: '感谢您为 GHS Color 项目贡献新的颜色！请按照以下步骤提交您的颜色建议。',
    steps: {
      title: '提交步骤',
      step1: '访问 GitHub 仓库',
      step1Description: '首先访问我们的 GitHub 仓库了解项目：',
      step2: '创建 Issue',
      step2Description: '在 GitHub 上创建一个新的 Issue 来提交您的颜色：',
      step3: '填写颜色信息',
      step3Description: '按照模板填写完整的颜色信息：',
      step4: '等待审核',
      step4Description: '我们会尽快审核您的提交：',
    },
    colorInfo: {
      title: '颜色信息格式',
      name: '颜色名称（中英文）',
      hex: 'HEX 颜色值',
      description: '颜色描述',
      category: '颜色分类',
      tags: '相关标签',
    },
    requirements: {
      title: '提交要求',
      colorRequirements: '颜色要求',
      colorReq1: '提供有效的 HEX 颜色值',
      colorReq2: '颜色名称要有意义且易懂',
      colorReq3: '避免提交重复的颜色',
      colorReq4: '确保颜色有实际使用价值',
      descriptionRequirements: '描述要求',
      descReq1: '提供中英文名称和描述',
      descReq2: '说明颜色的使用场景',
      descReq3: '选择合适的颜色分类',
      descReq4: '添加相关的标签',
    },
    buttons: {
      visitGitHub: '访问 GitHub 仓库',
      createIssue: '创建颜色提交 Issue',
      contributingGuide: '贡献指南',
      viewIssues: '查看所有 Issues',
    },
    backToColors: '返回颜色管理',
    thanks: '感谢您对 GHS Color 项目的贡献！您的每一个颜色建议都让这个工具变得更好。',
  },

  // 工具
  tools: {
    title: '实用工具',
    colorConverter: {
      title: '颜色格式转换',
      description: '在不同颜色格式之间进行转换',
      input: '输入颜色',
      results: '转换结果',
      preview: '颜色预览',
      previewDescription: '当前颜色的实时预览',
      usage: '在上方输入框中输入任意格式的颜色值，系统将自动转换为其他格式。',
      supportedFormats: '支持 HEX、RGB、RGBA、HSL、HSLA、HSV 和 CSS 变量格式。',
      copySuccess: '颜色值已复制',
      copyFailed: '复制失败',
      invalidFormat: '无效的颜色格式',
      invalidValue: '无效值',
      conversionFailed: '转换失败',
      validating: '正在验证...',
    },
  },

  // 错误信息
  error: {
    loadFailed: '加载失败',
    saveFailed: '保存失败',
    networkError: '网络错误',
    unknownError: '未知错误',
    invalidColor: '无效的颜色值',
    invalidFormat: '格式错误',
  },

  // 成功信息
  success: {
    saved: '保存成功',
    copied: '复制成功',
    deleted: '删除成功',
    updated: '更新成功',
  },
} as const;
