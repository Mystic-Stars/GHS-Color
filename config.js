/**
 * GHS Color Next 配置文件
 *
 * 此文件包含应用的颜色数据和分类数据配置
 * 通过修改此文件并提交到GitHub，可以更新应用的颜色数据
 */

/**
 * 颜色数据配置
 * 每个颜色对象包含以下属性：
 * - id: 唯一标识符
 * - name: 英文名称
 * - nameZh: 中文名称
 * - hex: HEX颜色值
 * - description: 英文描述
 * - descriptionZh: 中文描述
 * - category: 分类ID (brand/ui/team)
 * - tags: 标签数组
 */
const colors = [
  {
    id: "box-yellow",
    name: "Box Yellow",
    nameZh: "盒子黄",
    hex: "#f6dc50",
    description: "The exclusive yellow color of BoxWorld, the logo color of GHS.",
    descriptionZh: "盒王的专属黄色，GHS的标志颜色。",
    category: "brand",
    tags: ["yellow", "logo", "ghs"]
  },
  {
    id: "mysticstars-yellow",
    name: "MysticStars Yellow",
    nameZh: "星星黄",
    hex: "#ffc91a",
    description: "Little cute stars.",
    descriptionZh: "可爱小星星超级标志黄色。",
    category: "team",
    tags: ["yellow", "stars", "cute"]
  },
  {
    id: "zzh-blue",
    name: "zzh Blue",
    nameZh: "周周蓝",
    hex: "#1f91dc",
    description: "Turquoise depths with azure meet, A sea's calm whisper, soft and sweet.",
    descriptionZh: "碧水深流，海面一抹幽蓝。",
    category: "team",
    tags: ["blue", "ocean", "calm"]
  },
  {
    id: "final-black",
    name: "Final Black",
    nameZh: "终末黑",
    hex: "#000205",
    description: "The final colour, the echo of the world.",
    descriptionZh: "终末的色彩，世间的残响。",
    category: "team",
    tags: ["black", "final", "echo"]
  },
  {
    id: "lafcadian-blue",
    name: "Lafcadian Blue",
    nameZh: "氿月蓝",
    hex: "#66ccff",
    description: "The color of Highness Tianyi.",
    descriptionZh: "即天依蓝",
    category: "team",
    tags: ["blue", "tianyi", "special"]
  }
];

/**
 * 分类数据配置
 * 每个分类对象包含以下属性：
 * - id: 唯一标识符
 * - name: 英文名称
 * - nameZh: 中文名称
 * - description: 描述
 * - icon: 图标emoji
 * - color: 分类颜色
 * - order: 排序顺序
 */
const categories = [
  {
    id: "brand",
    name: "Brand Colors",
    nameZh: "品牌色",
    description: "Primary brand colors",
    icon: "🎨",
    color: "#6366F1",
    order: 1
  },
  {
    id: "ui",
    name: "UI Colors",
    nameZh: "UI色彩",
    description: "User interface colors",
    icon: "🖥️",
    color: "#10B981",
    order: 2
  },
  {
    id: "team",
    name: "Team Colors",
    nameZh: "团队色彩",
    description: "Team member colors",
    icon: "👥",
    color: "#F59E0B",
    order: 3
  }
];

/**
 * 导出配置对象
 */
module.exports = {
  colors,
  categories
};
