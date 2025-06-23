export const enUS = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    copy: 'Copy',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    clearAll: 'Clear All',
    all: 'All',
    none: 'None',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
  },

  // Header
  header: {
    toggleSidebar: 'Toggle Sidebar',
    settings: 'Settings',
    submitColor: 'Submit Color',
    totalColors: 'Total Colors',
    favorites: 'Favorites',
    switchTheme: 'Switch Theme',
    switchViewMode: 'Switch View Mode',
  },

  // Theme
  theme: {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },

  // View Mode
  viewMode: {
    grid: 'Grid',
    list: 'List',
    compact: 'Compact',
    gridView: 'Grid View',
    listView: 'List View',
    compactView: 'Compact View',
  },

  // Language
  language: {
    'zh-CN': '简体中文',
    'en-US': 'English',
  },

  // Settings
  settings: {
    title: 'Settings',
    theme: 'Theme',
    themeDescription: 'Choose interface theme',
    viewMode: 'View Mode',
    viewModeDescription: 'Choose color display mode',
    language: 'Language',
    languageDescription: 'Choose interface language',
  },

  // Search and Filter
  search: {
    placeholder: 'Search colors...',
    noResults: 'No matching colors found',
    noColors: 'No Colors',
    noColorsDescription: 'Start adding some colors to build your palette!',
    categories: 'Categories',
    tags: 'Tags',
    temperature: 'Color Temperature',
    favorites: 'Favorites',
    favoritesOnly: 'Favorites Only',
    warm: 'Warm',
    cool: 'Cool',
    neutral: 'Neutral',
  },

  // Sidebar
  sidebar: {
    colorCategories: 'Color Categories',
    allColors: 'All Colors',
    recentColors: 'Recent Colors',
    favoriteColors: 'Favorite Colors',
  },

  // Color
  color: {
    name: 'Color Name',
    description: 'Description',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    css: 'CSS Variable',
    cssVariable: 'CSS Variable',
    temperature: 'Color Temperature',
    category: 'Category',
    tags: 'Tags',
    favorite: 'Favorite',
    unfavorite: 'Unfavorite',
    copySuccess: 'Copied to clipboard',
    copyFailed: 'Copy failed',
    similarColors: 'Similar Colors',
    colorDetails: 'Color Details',
    usageCount: 'Usage Count',
    usageStats: 'Usage Statistics',
    colorFormats: 'Color Formats',
    categoriesAndTemperature: 'Categories and Temperature',
    isFavorite: 'Favorite',
    show: 'Show',
    hide: 'Hide',
    submitSimilarColor: 'Submit Similar Color',
    clickToCopy: 'Click to copy',
    createdAt: 'Created At',
    unknown: 'Unknown',
    brand: 'Brand',
    ui: 'UI',
    team: 'Team',
    warm: 'Warm',
    cool: 'Cool',
    neutral: 'Neutral',
  },

  // Submit Guide
  submitGuide: {
    title: 'Submit New Color',
    description:
      'Thank you for contributing new colors to the GHS Color project! Please follow these steps to submit your color suggestions.',
    steps: {
      title: 'Submission Steps',
      step1: 'Visit GitHub Repository',
      step1Description:
        'First, visit our GitHub repository to understand the project:',
      step2: 'Create Issue',
      step2Description: 'Create a new Issue on GitHub to submit your color:',
      step3: 'Fill Color Information',
      step3Description:
        'Fill in complete color information according to the template:',
      step4: 'Wait for Review',
      step4Description: 'We will review your submission as soon as possible:',
    },
    colorInfo: {
      title: 'Color Information Format',
      name: 'Color Name (Chinese & English)',
      hex: 'HEX Color Value',
      description: 'Color Description',
      category: 'Color Category',
      tags: 'Related Tags',
    },
    requirements: {
      title: 'Submission Requirements',
      colorRequirements: 'Color Requirements',
      colorReq1: 'Provide valid HEX color value',
      colorReq2: 'Color name should be meaningful and easy to understand',
      colorReq3: 'Avoid submitting duplicate colors',
      colorReq4: 'Ensure the color has practical value',
      descriptionRequirements: 'Description Requirements',
      descReq1: 'Provide Chinese and English names and descriptions',
      descReq2: 'Explain the usage scenarios of the color',
      descReq3: 'Choose appropriate color category',
      descReq4: 'Add relevant tags',
    },
    buttons: {
      visitGitHub: 'Visit GitHub Repository',
      createIssue: 'Create Color Submission Issue',
      contributingGuide: 'Contributing Guide',
      viewIssues: 'View All Issues',
    },
    backToColors: 'Back to Color Management',
    thanks:
      'Thank you for contributing to the GHS Color project! Every color suggestion makes this tool better.',
  },

  // Tools
  tools: {
    title: 'Utility Tools',
    colorConverter: {
      title: 'Color Format Converter',
      description: 'Convert between different color formats',
      input: 'Input Color',
      results: 'Conversion Results',
      preview: 'Color Preview',
      previewDescription: 'Real-time preview of the current color',
      usage:
        'Enter a color value in any format in the input field above, and the system will automatically convert it to other formats.',
      supportedFormats:
        'Supports HEX, RGB, RGBA, HSL, HSLA, HSV, and CSS variable formats.',
      copySuccess: 'Color value copied',
      copyFailed: 'Copy failed',
      invalidFormat: 'Invalid color format',
      invalidValue: 'Invalid value',
      conversionFailed: 'Conversion failed',
      validating: 'Validating...',
    },
    colorConfigGenerator: {
      title: 'Color Config Generator',
      description: 'Generate project-standard color configuration JSON',
      form: {
        id: 'ID Identifier',
        idPlaceholder: 'e.g., my-blue',
        idHelp: 'Unique identifier, use lowercase letters and hyphens',
        name: 'English Name',
        namePlaceholder: 'e.g., My Blue',
        nameZh: 'Chinese Name',
        nameZhPlaceholder: 'e.g., 我的蓝色',
        hex: 'Color Value',
        hexPlaceholder: 'e.g., #1f91dc',
        description: 'English Description',
        descriptionPlaceholder: 'e.g., A beautiful blue color',
        descriptionZh: 'Chinese Description',
        descriptionZhPlaceholder: 'e.g., 一个美丽的蓝色',
        category: 'Category',
        categoryPlaceholder: 'Select category',
        tags: 'Tags',
        tagsPlaceholder: 'Enter tags, press Enter to add',
        tagsHelp: 'Press Enter to add tags, click tags to remove',
      },
      preview: {
        title: 'Color Preview',
        jsonTitle: 'Generated JSON Config',
        copyJson: 'Copy JSON',
        copySuccess: 'JSON config copied to clipboard',
        copyFailed: 'Copy failed',
      },
      validation: {
        idRequired: 'ID identifier is required',
        idInvalid: 'ID can only contain lowercase letters, numbers and hyphens',
        nameRequired: 'English name is required',
        nameZhRequired: 'Chinese name is required',
        hexRequired: 'Color value is required',
        hexInvalid: 'Please enter a valid HEX color value',
        descriptionRequired: 'English description is required',
        descriptionZhRequired: 'Chinese description is required',
        categoryRequired: 'Please select a category',
        formInvalid: 'Please complete the form information first',
      },
      usage: {
        title: 'Usage Instructions',
        step1: '1. Fill in all required color information',
        step2: '2. Select appropriate color category',
        step3: '3. Add relevant tags (optional)',
        step4: '4. Copy the generated JSON config',
        step5: '5. Add the config to config.js file',
      },
    },
  },

  // Error Messages
  error: {
    loadFailed: 'Load failed',
    saveFailed: 'Save failed',
    networkError: 'Network error',
    unknownError: 'Unknown error',
    invalidColor: 'Invalid color value',
    invalidFormat: 'Invalid format',
  },

  // Success Messages
  success: {
    saved: 'Saved successfully',
    copied: 'Copied successfully',
    deleted: 'Deleted successfully',
    updated: 'Updated successfully',
  },
} as const;
