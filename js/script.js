// 拼音转换辅助函数
function getPinyinFirstLetter(str) {
    // 简单的拼音首字母映射表（仅包含常用汉字）
    const pinyinMap = {
        '丁': 'd', '香': 'x', '三': 's', '七': 'q', '粉': 'f', '棱': 'l',
        '丝': 's', '瓜': 'g', '络': 'l', '丹': 'd', '参': 's', '乌': 'w',
        '梅': 'm', '药': 'y', '蛇': 's', '九': 'j', '节': 'j', '菖': 'c',
        '蒲': 'p', '五': 'w', '倍': 'b', '子': 'z', '灵': 'l', '脂': 'z',
        '人': 'r', '参': 's', '片': 'p', '仙': 'x', '茅': 'm', '鹤': 'h',
        '草': 'c', '伸': 's', '筋': 'j', '佛': 'f', '手': 's', '佩': 'p',
        '兰': 'l', '侧': 'c', '柏': 'b', '叶': 'y', '炭': 't', '党': 'd',
        '全': 'q', '蝎': 'x', '六': 'l', '神': 's', '曲': 'q', '冬': 'd',
        '瓜': 'g', '子': 'z', '葵': 'k', '决': 'j', '明': 'm', '刘': 'l',
        '寄': 'j', '奴': 'n', '制': 'z', '何': 'h', '首': 's', '乌': 'w',
        '天': 't', '南': 'n', '星': 'x', '前': 'q', '胡': 'h', '化': 'h',
        '橘': 'j', '红': 'h', '北': 'b', '柴': 'c', '胡': 'h', '沙': 's',
        '参': 's', '败': 'b', '酱': 'j', '草': 'c', '千': 'q', '年': 'n',
        '健': 'j', '升': 's', '麻': 'm', '半': 'b', '枝': 'z', '莲': 'l',
        '边': 'b', '厚': 'h', '朴': 'p', '合': 'h', '欢': 'h', '皮': 'p',
        '花': 'h', '吴': 'w', '茱': 'z', '萸': 'y', '土': 't', '茯': 'f',
        '苓': 'l', '鳖': 'b', '虫': 'c', '地': 'd', '榆': 'y', '肤': 'f',
        '骨': 'g', '皮': 'p', '龙': 'l', '墨': 'm', '旱': 'h', '莲': 'l',
        '夏': 'x', '枯': 'k', '草': 'c', '大': 'd', '枣': 'z', '腹': 'f',
        '皮': 'p', '蓟': 'j', '血': 'x', '藤': 't', '黄': 'h', '天': 't',
        '冬': 'd', '花': 'h', '粉': 'f', '麻': 'm', '子': 'z', '太': 't',
        '子': 'z', '参': 's', '女': 'n', '贞': 'z', '姜': 'j', '半': 'b',
        '夏': 'x', '威': 'w', '灵': 'l', '仙': 'x', '密': 'm', '蒙': 'm',
        '花': 'h', '射': 's', '干': 'g', '小': 'x', '楂': 'z', '山': 's',
        '药': 'y', '川': 'c', '牛': 'n', '膝': 'x', '芎': 'x', '贝': 'b',
        '母': 'm', '干': 'g', '姜': 'j', '益': 'y', '母': 'm', '草': 'c',
        '广': 'g', '藿': 'h', '香': 'x', '建': 'j', '曲': 'q', '当': 'd',
        '归': 'g', '徐': 'x', '长': 'c', '卿': 'q', '忍': 'r', '冬': 'd',
        '藤': 't', '扁': 'b', '豆': 'd', '新': 'x', '疆': 'j', '紫': 'z',
        '草': 'c', '旋': 'x', '覆': 'f', '花': 'h', '昆': 'k', '布': 'b',
        '木': 'm', '蝴': 'h', '蝶': 'd', '贼': 'z', '通': 't', '香': 'x',
        '杜': 'd', '仲': 'z', '板': 'b', '蓝': 'l', '根': 'g', '枯': 'k',
        '矾': 'f', '枳': 'z', '壳': 'q', '枸': 'g', '杞': 'q', '子': 'z',
        '柏': 'b', '子': 'z', '仁': 'r', '柯': 'k', '子': 'z', '肉': 'r',
        '栀': 'z', '子': 'z', '桂': 'g', '枝': 'z', '桑': 's', '叶': 'y',
        '寄': 'j', '生': 's', '枝': 'z', '椹': 's', '螵': 'p', '蛸': 'x',
        '桔': 'j', '梗': 'g', '棕': 'z', '榈': 'l', '椿': 'c', '皮': 'p',
        '楮': 'c', '实': 's', '槐': 'h', '花': 'h', '槟': 'b', '榔': 'l',
        '槲': 'h', '橘': 'j', '核': 'h', '水': 's', '牛': 'n', '角': 'j',
        '沉': 'c', '香': 'x', '沙': 's', '苑': 'y', '子': 'z', '法': 'f',
        '泽': 'z', '兰': 'l', '浙': 'z', '贝': 'b', '母': 'm', '浮': 'f',
        '小': 'x', '麦': 'm', '萍': 'p', '草': 'c', '海': 'h', '桐': 't',
        '皮': 'p', '藻': 'z', '螵': 'p', '蛸': 'x', '金': 'j', '沙': 's',
        '风': 'f', '藤': 't', '淡': 'd', '竹': 'z', '叶': 'y', '豉': 'c',
        '清': 'q', '半': 'b', '夏': 'x', '滑': 'h', '石': 's', '粉': 'f',
        '火': 'h', '麻': 'm', '仁': 'r', '灯': 'd', '芯': 'x', '草': 'c',
        '炒': 'c', '僵': 'j', '蚕': 'c', '川': 'c', '楝': 'l', '子': 'z',
        '芥': 'j', '子': 'z', '苍': 'c', '耳': 'e', '苏': 's', '子': 'z',
        '苦': 'k', '杏': 'x', '仁': 'r', '莱': 'l', '菔': 'f', '子': 'z',
        '蒲': 'p', '黄': 'h', '蒺': 'j', '藜': 'l', '谷': 'g', '芽': 'y',
        '酸': 's', '枣': 'z', '仁': 'r', '鸡': 'j', '内': 'n', '金': 'j',
        '麦': 'm', '芽': 'y', '黑': 'h', '芝': 'z', '麻': 'm', '炙': 'z',
        '川': 'c', '乌': 'w', '淫': 'y', '羊': 'y', '藿': 'h', '草': 'c',
        '甘': 'g', '草': 'c', '白': 'b', '前': 'q', '附': 'f', '子': 'z',
        '草': 'c', '乌': 'w', '黄': 'h', '芪': 'q', '黑': 'h', '附': 'f',
        '子': 'z', '炮': 'p', '姜': 'j', '水': 's', '蛭': 'z', '骨': 'g',
        '碎': 's', '补': 'b', '焦': 'j', '山': 's', '楂': 'z', '栀': 'z',
        '子': 'z', '槟': 'b', '榔': 'l', '神': 's', '曲': 'q', '麦': 'm',
        '芽': 'y', '煅': 'd', '牡': 'm', '蛎': 'l', '瓦': 'w', '楞': 'l',
        '磁': 'c', '石': 's', '自': 'z', '然': 'r', '铜': 't', '龙': 'l',
        '骨': 'g', '熟': 's', '地': 'd', '黄': 'h', '燀': 'ch', '桃': 't',
        '仁': 'r', '片': 'p', '姜': 'j', '黄': 'h', '牛': 'n', '膝': 'x',
        '蒡': 'b', '子': 'z', '牡': 'm', '丹': 'd', '皮': 'p', '独': 'd',
        '活': 'h', '猪': 'z', '苓': 'l', '猫': 'm', '爪': 'z', '草': 'c',
        '玄': 'x', '参': 's', '玉': 'y', '竹': 'z', '米': 'm', '玉': 'y',
        '竹': 'z', '须': 'x', '王': 'w', '不': 'b', '留': 'l', '行': 'x',
        '玫': 'm', '瑰': 'g', '花': 'h', '珍': 'z', '珠': 'z', '母': 'm',
        '透': 't', '骨': 'g', '草': 'c', '琥': 'h', '珀': 'p', '瓜': 'g',
        '蒌': 'l', '皮': 'p', '甘': 'g', '草': 'c', '片': 'p', '生': 's',
        '何': 'h', '首': 's', '乌': 'w', '地': 'd', '榆': 'y', '生': 's',
        '地': 'd', '黄': 'h', '蒲': 'p', '黄': 'h', '番': 'f', '泻': 'x',
        '叶': 'y', '白': 'b', '及': 'j', '术': 's', '果': 'g', '仁': 'r',
        '芍': 's', '药': 'y', '花': 'h', '蛇': 's', '舌': 's', '草': 'c',
        '芷': 'z', '茅': 'm', '根': 'g', '芦': 'l', '根': 'g', '金': 'j',
        '银': 'y', '花': 'h', '连': 'l', '翘': 'q', '青': 'q', '翘': 'q',
        '蜂': 'f', '房': 'f', '蝉': 'c', '蜕': 't', '补': 'b', '骨': 'g',
        '脂': 'z', '西': 'x', '洋': 'y', '参': 's', '青': 'q', '风': 'f',
        '藤': 't', '韭': 'j', '菜': 'c', '子': 'z', '预': 'y', '知': 'z',
        '子': 'z', '首': 's', '乌': 'w', '藤': 't', '香': 'x', '橼': 'y',
        '薷': 'r', '马': 'm', '齿': 'c', '苋': 'x', '高': 'g', '良': 'l',
        '姜': 'j', '鱼': 'y', '腥': 'x', '草': 'c', '鸡': 'j', '冠': 'g',
        '花': 'h', '矢': 's', '藤': 't', '血': 'x', '藤': 't', '鹅': 'e',
        '不': 'b', '食': 's', '草': 'c', '鹿': 'l', '衔': 'x', '草': 'c',
        '角': 'j', '胶': 'j', '霜': 's', '麦': 'm', '冬': 'd', '芽': 'y',
        '麸': 'f', '炒': 'c', '山': 's', '药': 'y', '枳': 'z', '实': 's',
        '白': 'b', '术': 's', '白': 'b', '芍': 's', '药': 'y', '芡': 'q',
        '实': 's', '苍': 'c', '术': 's', '薏': 'y', '苡': 'y', '仁': 'r',
        '麻': 'm', '黄': 'h', '根': 'g', '黄': 'h', '柏': 'b', '芩': 'q',
        '连': 'l', '片': 'p', '龙': 'l', '眼': 'y', '肉': 'r', '胆': 'd',
        '龙': 'l', '骨': 'g', '齿': 'c', '龟': 'g', '甲': 'j', '胶': 'j'
    };
    
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (/[a-zA-Z]/.test(char)) {
            result += char.toLowerCase();
        } else if (/[0-9]/.test(char)) {
            result += char;
        } else if (pinyinMap[char]) {
            result += pinyinMap[char];
        } else {
            // 对于不在映射表中的汉字，返回空字符串
            result += '';
        }
    }
    return result;
}

function getFullPinyin(str) {
    // 简单的全拼映射表（仅包含常用汉字）
    const pinyinMap = {
        '丁': 'ding', '香': 'xiang', '三': 'san', '七': 'qi', '粉': 'fen',
        '棱': 'leng', '丝': 'si', '瓜': 'gua', '络': 'luo', '丹': 'dan',
        '参': 'shen', '乌': 'wu', '梅': 'mei', '药': 'yao', '蛇': 'she',
        '九': 'jiu', '节': 'jie', '菖': 'chang', '蒲': 'pu', '五': 'wu',
        '倍': 'bei', '子': 'zi', '灵': 'ling', '脂': 'zhi', '人': 'ren',
        '片': 'pian', '仙': 'xian', '茅': 'mao', '鹤': 'he', '草': 'cao',
        '伸': 'shen', '筋': 'jin', '佛': 'fo', '手': 'shou', '佩': 'pei',
        '兰': 'lan', '侧': 'ce', '柏': 'bai', '叶': 'ye', '炭': 'tan',
        '党': 'dang', '全': 'quan', '蝎': 'xie', '六': 'liu', '神': 'shen',
        '曲': 'qu', '冬': 'dong', '葵': 'kui', '决': 'jue', '明': 'ming',
        '刘': 'liu', '寄': 'ji', '奴': 'nu', '制': 'zhi', '何': 'he',
        '首': 'shou', '天': 'tian', '南': 'nan', '星': 'xing', '前': 'qian',
        '胡': 'hu', '化': 'hua', '橘': 'ju', '红': 'hong', '北': 'bei',
        '柴': 'chai', '沙': 'sha', '败': 'bai', '酱': 'jiang', '千': 'qian',
        '年': 'nian', '健': 'jian', '升': 'sheng', '麻': 'ma', '半': 'ban',
        '枝': 'zhi', '莲': 'lian', '边': 'bian', '厚': 'hou', '朴': 'pu',
        '合': 'he', '欢': 'huan', '吴': 'wu', '茱': 'zhu', '萸': 'yu',
        '土': 'tu', '茯': 'fu', '苓': 'ling', '鳖': 'bie', '虫': 'chong',
        '地': 'di', '榆': 'yu', '肤': 'fu', '骨': 'gu', '龙': 'long',
        '墨': 'mo', '旱': 'han', '夏': 'xia', '枯': 'ku', '大': 'da',
        '枣': 'zao', '腹': 'fu', '蓟': 'ji', '血': 'xue', '藤': 'teng',
        '黄': 'huang', '花': 'hua', '麻': 'ma', '太': 'tai', '女': 'nv',
        '贞': 'zhen', '姜': 'jiang', '威': 'wei', '灵': 'ling', '仙': 'xian',
        '密': 'mi', '蒙': 'meng', '射': 'she', '干': 'gan', '小': 'xiao',
        '楂': 'zha', '山': 'shan', '川': 'chuan', '牛': 'niu', '膝': 'xi',
        '芎': 'xiong', '贝': 'bei', '母': 'mu', '广': 'guang', '藿': 'huo',
        '香': 'xiang', '建': 'jian', '当': 'dang', '归': 'gui', '徐': 'xu',
        '长': 'chang', '卿': 'qing', '忍': 'ren', '冬': 'dong', '扁': 'bian',
        '豆': 'dou', '新': 'xin', '疆': 'jiang', '紫': 'zi', '旋': 'xuan',
        '覆': 'fu', '昆': 'kun', '布': 'bu', '木': 'mu', '蝴': 'hu',
        '蝶': 'die', '贼': 'zei', '通': 'tong', '杜': 'du', '仲': 'zhong',
        '板': 'ban', '蓝': 'lan', '根': 'gen', '枯': 'ku', '矾': 'fan',
        '枳': 'zhi', '壳': 'qiao', '枸': 'gou', '杞': 'qi', '柏': 'bai',
        '子': 'zi', '仁': 'ren', '柯': 'ke', '栀': 'zhi', '桂': 'gui',
        '枝': 'zhi', '桑': 'sang', '寄': 'ji', '生': 'sheng', '椹': 'shen',
        '螵': 'piao', '蛸': 'xiao', '桔': 'jie', '梗': 'geng', '棕': 'zong',
        '榈': 'lv', '椿': 'chun', '楮': 'chu', '实': 'shi', '槐': 'huai',
        '槟': 'bin', '榔': 'lang', '槲': 'hu', '水': 'shui', '角': 'jiao',
        '沉': 'chen', '沙': 'sha', '苑': 'yuan', '法': 'fa', '泽': 'ze',
        '浙': 'zhe', '浮': 'fu', '麦': 'mai', '萍': 'ping', '海': 'hai',
        '桐': 'tong', '藻': 'zao', '金': 'jin', '风': 'feng', '淡': 'dan',
        '竹': 'zhu', '豉': 'chi', '清': 'qing', '滑': 'hua', '石': 'shi',
        '火': 'huo', '麻': 'ma', '仁': 'ren', '灯': 'deng', '芯': 'xin',
        '炒': 'chao', '僵': 'jiang', '蚕': 'can', '楝': 'lian', '芥': 'jie',
        '苍': 'cang', '耳': 'er', '苏': 'su', '苦': 'ku', '杏': 'xing',
        '莱': 'lai', '菔': 'fu', '蒺': 'ji', '藜': 'li', '谷': 'gu',
        '酸': 'suan', '鸡': 'ji', '内': 'nei', '金': 'jin', '黑': 'hei',
        '芝': 'zhi', '炙': 'zhi', '淫': 'yin', '羊': 'yang', '甘': 'gan',
        '白': 'bai', '前': 'qian', '附': 'fu', '黄': 'huang', '芪': 'qi',
        '炮': 'pao', '水': 'shui', '蛭': 'zhi', '骨': 'gu', '碎': 'sui',
        '补': 'bu', '焦': 'jiao', '煅': 'duan', '牡': 'mu', '蛎': 'li',
        '瓦': 'wa', '楞': 'leng', '磁': 'ci', '自': 'zi', '然': 'ran',
        '铜': 'tong', '熟': 'shu', '桃': 'tao', '片': 'pian', '姜': 'jiang',
        '蒡': 'bang', '牡': 'mu', '丹': 'dan', '独': 'du', '活': 'huo',
        '猪': 'zhu', '苓': 'ling', '猫': 'mao', '爪': 'zhua', '玄': 'xuan',
        '玉': 'yu', '米': 'mi', '王': 'wang', '不': 'bu', '留': 'liu',
        '行': 'xing', '玫': 'mei', '瑰': 'gui', '珍': 'zhen', '珠': 'zhu',
        '透': 'tou', '琥': 'hu', '珀': 'po', '瓜': 'gua', '蒌': 'lou',
        '生': 'sheng', '番': 'fan', '泻': 'xie', '及': 'ji', '术': 'shu',
        '芍': 'shao', '花': 'hua', '蛇': 'she', '舌': 'she', '芷': 'zhi',
        '茅': 'mao', '根': 'gen', '芦': 'lu', '金': 'jin', '银': 'yin',
        '连': 'lian', '翘': 'qiao', '青': 'qing', '蜂': 'feng', '房': 'fang',
        '蝉': 'chan', '蜕': 'tui', '补': 'bu', '骨': 'gu', '脂': 'zhi',
        '西': 'xi', '洋': 'yang', '风': 'feng', '藤': 'teng', '韭': 'jiu',
        '菜': 'cai', '预': 'yu', '知': 'zhi', '首': 'shou', '藤': 'teng',
        '香': 'xiang', '橼': 'yuan', '薷': 'ru', '马': 'ma', '齿': 'chi',
        '苋': 'xian', '高': 'gao', '良': 'liang', '鱼': 'yu', '腥': 'xing',
        '鸡': 'ji', '冠': 'guan', '矢': 'shi', '鹅': 'e', '食': 'shi',
        '鹿': 'lu', '衔': 'xian', '角': 'jiao', '胶': 'jiao', '霜': 'shuang',
        '麸': 'fu', '苍': 'cang', '薏': 'yi', '苡': 'yi', '麻': 'ma',
        '黄': 'huang', '根': 'gen', '柏': 'bai', '芩': 'qin', '连': 'lian',
        '龙': 'long', '眼': 'yan', '胆': 'dan', '齿': 'chi', '龟': 'gui',
        '甲': 'jia'
    };
    
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (/[a-zA-Z]/.test(char)) {
            result += char.toLowerCase();
        } else if (/[0-9]/.test(char)) {
            result += char;
        } else if (pinyinMap[char]) {
            result += pinyinMap[char];
        } else {
            // 对于不在映射表中的汉字，返回原字符
            result += char;
        }
    }
    return result;
}

// 中药饮片数据
const medicineData = [
    {
        "商品名称": "丁香",
        "商品编码": "T000700200",
        "商品类型": "中草药",
        "国家医保编码": "T000700200",
        "国家医保名称": "丁香",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.525
    },
    {
        "商品名称": "三七粉",
        "商品编码": "T001100659",
        "商品类型": "中草药",
        "国家医保编码": "T001100659",
        "国家医保名称": "三七粉",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 1.0
    },
    {
        "商品名称": "三棱",
        "商品编码": "T001200658",
        "商品类型": "中草药",
        "国家医保编码": "T001200658",
        "国家医保名称": "三棱",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.125
    },
    {
        "商品名称": "丝瓜络",
        "商品编码": "T001200715",
        "商品类型": "中草药",
        "国家医保编码": "T001200715",
        "国家医保名称": "丝瓜络",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.35
    },
    {
        "商品名称": "丹参",
        "商品编码": "T001200177",
        "商品类型": "中草药",
        "国家医保编码": "T001200177",
        "国家医保名称": "丹参",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.2
    },
    {
        "商品名称": "乌梅",
        "商品编码": "T001800764",
        "商品类型": "中草药",
        "国家医保编码": "T001800764",
        "国家医保名称": "乌梅",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.15
    },
    {
        "商品名称": "乌药",
        "商品编码": "T000800773",
        "商品类型": "中草药",
        "国家医保编码": "T000800773",
        "国家医保名称": "乌药",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.175
    },
    {
        "商品名称": "当归",
        "商品编码": "T001700173",
        "商品类型": "中草药",
        "国家医保编码": "T001700173",
        "国家医保名称": "当归",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.425
    },
    {
        "商品名称": "黄芪",
        "商品编码": "T001700233",
        "商品类型": "中草药",
        "国家医保编码": "T001700233",
        "国家医保名称": "黄芪",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.2
    },
    {
        "商品名称": "党参",
        "商品编码": "T001700174",
        "商品类型": "中草药",
        "国家医保编码": "T001700174",
        "国家医保名称": "党参",
        "生产厂家": "饮片",
        "规格": "选",
        "单位": "克",
        "售价": 0.15
    }
];

// 本地存储处方记录的功能实现
class LocalPrescriptionDB {
    constructor() {
        this.dbName = 'prescriptionDB';
        this.storeName = 'prescriptions';
        this.db = null;
        this.initDB();
    }

    initDB() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
                return;
            }

            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                console.error('数据库打开失败');
                reject('数据库打开失败');
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    }

    async saveRecord(record) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add({
                ...record,
                createdAt: new Date().toISOString()
            });

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject('保存失败');
            });
        } catch (error) {
            console.error('保存记录失败:', error);
            // 降级到localStorage
            this.saveToLocalStorage(record);
            return null;
        }
    }

    saveToLocalStorage(record) {
        try {
            const records = JSON.parse(localStorage.getItem('prescriptions') || '[]');
            records.push({
                ...record,
                id: Date.now(),
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('prescriptions', JSON.stringify(records));
        } catch (error) {
            console.error('保存到localStorage失败:', error);
        }
    }

    async getAllRecords() {
        try {
            const db = await this.initDB();
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject('获取记录失败');
            });
        } catch (error) {
            console.error('获取记录失败:', error);
            // 从localStorage获取
            return JSON.parse(localStorage.getItem('prescriptions') || '[]');
        }
    }

    async deleteRecord(id) {
        try {
            const db = await this.initDB();
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject('删除失败');
            });
        } catch (error) {
            console.error('删除记录失败:', error);
            // 从localStorage删除
            this.deleteFromLocalStorage(id);
            return false;
        }
    }

    deleteFromLocalStorage(id) {
        try {
            const records = JSON.parse(localStorage.getItem('prescriptions') || '[]');
            const filteredRecords = records.filter(record => record.id !== id);
            localStorage.setItem('prescriptions', JSON.stringify(filteredRecords));
        } catch (error) {
            console.error('从localStorage删除失败:', error);
        }
    }
}

// 初始化本地数据库
const prescriptionDB = new LocalPrescriptionDB();

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 绑定检索按钮点击事件
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchMedicines);
    }

    // 绑定重置按钮点击事件
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }

    // 绑定剂数输入变化事件
    const doseInput = document.getElementById('doseInput');
    if (doseInput) {
        doseInput.addEventListener('input', updatePrices);
    }

    // 绑定运费输入变化事件
    const shippingFeeInput = document.getElementById('shippingFeeInput');
    if (shippingFeeInput) {
        shippingFeeInput.addEventListener('input', updatePrices);
    }

    // 绑定结算按钮点击事件
    const settlementBtn = document.getElementById('settlementBtn');
    if (settlementBtn) {
        settlementBtn.addEventListener('click', openSettlementModal);
    }

    // 绑定关闭结算弹窗按钮点击事件
    const settlementClose = document.getElementById('settlementClose');
    if (settlementClose) {
        settlementClose.addEventListener('click', closeSettlementModal);
    }

    // 绑定取消结算按钮点击事件
    const cancelSettlementBtn = document.getElementById('cancelSettlementBtn');
    if (cancelSettlementBtn) {
        cancelSettlementBtn.addEventListener('click', closeSettlementModal);
    }

    // 绑定确认结算按钮点击事件
    const confirmSettlementBtn = document.getElementById('confirmSettlementBtn');
    if (confirmSettlementBtn) {
        confirmSettlementBtn.addEventListener('click', confirmSettlement);
    }

    // 绑定关闭支付弹窗按钮点击事件
    const paymentClose = document.getElementById('paymentClose');
    if (paymentClose) {
        paymentClose.addEventListener('click', closePaymentModal);
    }

    // 绑定关闭支付按钮点击事件
    const closePaymentBtn = document.getElementById('closePaymentBtn');
    if (closePaymentBtn) {
        closePaymentBtn.addEventListener('click', closePaymentModal);
    }

    // 绑定使用说明按钮点击事件
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', openHelpModal);
    }

    // 绑定关闭使用说明弹窗按钮点击事件
    const helpClose = document.getElementById('helpClose');
    if (helpClose) {
        helpClose.addEventListener('click', closeHelpModal);
    }

    // 绑定关闭使用说明按钮点击事件
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    if (closeHelpBtn) {
        closeHelpBtn.addEventListener('click', closeHelpModal);
    }

    // 绑定保存为JSON按钮点击事件
    const saveJsonBtn = document.getElementById('saveJsonBtn');
    if (saveJsonBtn) {
        saveJsonBtn.addEventListener('click', saveAsJson);
    }

    // 绑定保存为TXT按钮点击事件
    const saveTxtBtn = document.getElementById('saveTxtBtn');
    if (saveTxtBtn) {
        saveTxtBtn.addEventListener('click', saveAsTxt);
    }

    // 绑定保存为图片按钮点击事件
    const saveImageBtn = document.getElementById('saveImageBtn');
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', saveAsImage);
    }
});

// 搜索药材函数
function searchMedicines() {
    const prescriptionInput = document.getElementById('prescriptionInput');
    const medicineList = document.getElementById('medicineList');
    
    if (!prescriptionInput || !medicineList) {
        console.error('找不到必要的DOM元素');
        return;
    }

    const prescriptionText = prescriptionInput.value.trim();
    if (!prescriptionText) {
        alert('请输入药材名称');
        return;
    }

    // 解析处方文本
    const medicines = parsePrescription(prescriptionText);
    
    // 搜索药材
    const results = searchMedicineData(medicines);
    
    // 显示搜索结果
    displaySearchResults(results);
    
    // 更新价格
    updatePrices();
}

// 解析处方文本
function parsePrescription(text) {
    // 支持多种格式：
    // 1. 现代格式：当归10g、黄芪20g
    // 2. 传统格式：桂枝(9g)、芍药(9g)
    // 3. 简单格式：当归 黄芪 党参（空格分隔）
    // 4. 逗号分隔：当归,黄芪,党参
    
    const medicines = [];
    
    // 替换所有可能的分隔符为空格
    let normalizedText = text.replace(/[，,、；;]/g, ' ');
    
    // 匹配现代格式：当归10g
    const modernPattern = /([\u4e00-\u9fa5]+)(\d+(?:\.\d+)?)[g克]/g;
    let match;
    while ((match = modernPattern.exec(normalizedText)) !== null) {
        medicines.push({
            name: match[1].trim(),
            amount: parseFloat(match[2])
        });
        // 从文本中移除已匹配的部分
        normalizedText = normalizedText.replace(match[0], '');
    }
    
    // 匹配传统格式：桂枝(9g)
    const traditionalPattern = /([\u4e00-\u9fa5]+)\((\d+(?:\.\d+)?)[g克]\)/g;
    while ((match = traditionalPattern.exec(normalizedText)) !== null) {
        medicines.push({
            name: match[1].trim(),
            amount: parseFloat(match[2])
        });
        // 从文本中移除已匹配的部分
        normalizedText = normalizedText.replace(match[0], '');
    }
    
    // 处理剩余的简单格式：当归 黄芪 党参
    const simplePattern = /[\u4e00-\u9fa5]+/g;
    while ((match = simplePattern.exec(normalizedText)) !== null) {
        const name = match[0].trim();
        if (name && !medicines.some(m => m.name === name)) {
            medicines.push({
                name: name,
                amount: 10 // 默认10g
            });
        }
    }
    
    return medicines;
}

// 搜索药材数据
function searchMedicineData(medicines) {
    const results = [];
    
    medicines.forEach(medicine => {
        // 精确匹配
        let matched = medicineData.find(item => 
            item["商品名称"] === medicine.name
        );
        
        // 如果没有精确匹配，尝试模糊匹配
        if (!matched) {
            matched = medicineData.find(item => 
                item["商品名称"].includes(medicine.name)
            );
        }
        
        // 如果还是没有匹配，尝试拼音匹配
        if (!matched) {
            const pinyin = getFullPinyin(medicine.name);
            matched = medicineData.find(item => 
                getFullPinyin(item["商品名称"]).includes(pinyin)
            );
        }
        
        if (matched) {
            results.push({
                ...matched,
                amount: medicine.amount
            });
        } else {
            // 没有找到匹配的药材
            results.push({
                "商品名称": medicine.name,
                "商品编码": "",
                "售价": 0,
                amount: medicine.amount,
                notFound: true
            });
        }
    });
    
    return results;
}

// 显示搜索结果
function displaySearchResults(results) {
    const medicineList = document.getElementById('medicineList');
    if (!medicineList) return;
    
    if (results.length === 0) {
        medicineList.innerHTML = '<div class="not-found">未找到匹配的药材</div>';
        return;
    }
    
    let html = '';
    results.forEach((medicine, index) => {
        if (medicine.notFound) {
            html += `
                <div class="medicine-item not-found-item">
                    <div class="medicine-info">
                        <h3>${medicine["商品名称"]}</h3>
                        <p class="not-found-message">未找到该药材</p>
                    </div>
                    <div class="medicine-amount">
                        <input type="number" min="0" step="0.1" value="${medicine.amount}" 
                               class="amount-input" data-index="${index}">
                        <span>g</span>
                    </div>
                    <div class="medicine-price">
                        <span>¥0.00</span>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="medicine-item">
                    <div class="medicine-info">
                        <h3>${medicine["商品名称"]}</h3>
                        <p class="medicine-code">编码: ${medicine["商品编码"]}</p>
                    </div>
                    <div class="medicine-amount">
                        <input type="number" min="0" step="0.1" value="${medicine.amount}" 
                               class="amount-input" data-index="${index}">
                        <span>g</span>
                    </div>
                    <div class="medicine-price">
                        <span>¥${(medicine["售价"] * medicine.amount).toFixed(2)}</span>
                    </div>
                </div>
            `;
        }
    });
    
    medicineList.innerHTML = html;
    
    // 绑定数量输入变化事件
    const amountInputs = document.querySelectorAll('.amount-input');
    amountInputs.forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.dataset.index);
            if (!isNaN(index) && results[index]) {
                results[index].amount = parseFloat(this.value) || 0;
                updatePrices();
                // 更新当前行的价格显示
                const priceElement = this.closest('.medicine-item').querySelector('.medicine-price span');
                if (priceElement && results[index].notFound === false) {
                    priceElement.textContent = `¥${(results[index]["售价"] * results[index].amount).toFixed(2)}`;
                }
            }
        });
    });
    
    // 保存结果到全局变量，用于后续价格计算和结算
    window.searchResults = results;
}

// 更新价格
function updatePrices() {
    if (!window.searchResults || window.searchResults.length === 0) {
        // 重置价格显示
        document.getElementById('subtotalPrice').textContent = '0.00';
        document.getElementById('totalPrice').textContent = '0.00';
        return;
    }
    
    // 获取剂数
    const doseInput = document.getElementById('doseInput');
    const dose = parseInt(doseInput.value) || 1;
    
    // 获取运费
    const shippingFeeInput = document.getElementById('shippingFeeInput');
    let shippingFee = parseFloat(shippingFeeInput.value) || 0;
    
    // 计算商品总价
    let subtotal = 0;
    window.searchResults.forEach(medicine => {
        if (!medicine.notFound) {
            subtotal += medicine["售价"] * medicine.amount * dose;
        }
    });
    
    // 检查是否免运费（满200免运费）
    if (subtotal >= 200) {
        shippingFee = 0;
        document.getElementById('shippingFeeLabel').textContent = '（满200免运费）';
    } else {
        document.getElementById('shippingFeeLabel').textContent = '（满200免运费）';
    }
    
    // 更新运费输入框的值
    shippingFeeInput.value = shippingFee;
    
    // 计算应付总额
    const total = subtotal + shippingFee;
    
    // 更新价格显示
    document.getElementById('subtotalPrice').textContent = subtotal.toFixed(2);
    document.getElementById('totalPrice').textContent = total.toFixed(2);
}

// 重置表单
function resetForm() {
    // 清空处方输入
    document.getElementById('prescriptionInput').value = '';
    
    // 清空顾客信息
    document.getElementById('customerName').value = '';
    document.getElementById('customerAge').value = '';
    document.getElementById('customerPhone').value = '';
    
    // 重置剂数
    document.getElementById('doseInput').value = 1;
    
    // 重置运费
    document.getElementById('shippingFeeInput').value = 0;
    
    // 清空药材列表
    document.getElementById('medicineList').innerHTML = '<div class="not-found">请输入药材名称并点击检索</div>';
    
    // 重置价格
    document.getElementById('subtotalPrice').textContent = '0.00';
    document.getElementById('totalPrice').textContent = '0.00';
    
    // 清空搜索结果
    window.searchResults = [];
}

// 打开结算弹窗
function openSettlementModal() {
    if (!window.searchResults || window.searchResults.length === 0) {
        alert('请先检索药材');
        return;
    }
    
    // 获取顾客信息
    const customerName = document.getElementById('customerName').value || '未填写';
    const customerAge = document.getElementById('customerAge').value || '未填写';
    const customerPhone = document.getElementById('customerPhone').value || '未填写';
    
    // 获取剂数
    const dose = parseInt(document.getElementById('doseInput').value) || 1;
    
    // 获取价格信息
    const subtotal = parseFloat(document.getElementById('subtotalPrice').textContent) || 0;
    const shippingFee = parseFloat(document.getElementById('shippingFeeInput').value) || 0;
    const total = parseFloat(document.getElementById('totalPrice').textContent) || 0;
    
    // 更新弹窗内容
    document.getElementById('modalCustomerName').textContent = customerName;
    document.getElementById('modalCustomerAge').textContent = customerAge;
    document.getElementById('modalCustomerPhone').textContent = customerPhone;
    document.getElementById('modalPrescriptionDate').textContent = new Date().toLocaleDateString();
    document.getElementById('modalDose').textContent = dose;
    document.getElementById('modalSubtotal').textContent = `¥${subtotal.toFixed(2)}`;
    document.getElementById('modalShippingFee').textContent = `¥${shippingFee.toFixed(2)}`;
    document.getElementById('modalTotal').textContent = `¥${total.toFixed(2)}`;
    
    // 生成药材列表
    const modalMedicinesList = document.getElementById('modalMedicinesList');
    if (modalMedicinesList) {
        let html = '';
        window.searchResults.forEach(medicine => {
            if (!medicine.notFound) {
                const itemTotal = medicine["售价"] * medicine.amount * dose;
                html += `
                    <tr>
                        <td>${medicine["商品名称"]}</td>
                        <td>${medicine.amount}g × ${dose}剂</td>
                        <td>¥${medicine["售价"].toFixed(3)}</td>
                        <td>¥${itemTotal.toFixed(2)}</td>
                    </tr>
                `;
            }
        });
        modalMedicinesList.innerHTML = html;
    }
    
    // 显示弹窗
    document.getElementById('settlementModal').style.display = 'block';
}

// 关闭结算弹窗
function closeSettlementModal() {
    document.getElementById('settlementModal').style.display = 'none';
}

// 确认结算
function confirmSettlement() {
    // 获取顾客信息
    const customerName = document.getElementById('customerName').value || '未填写';
    const customerAge = document.getElementById('customerAge').value || '未填写';
    const customerPhone = document.getElementById('customerPhone').value || '未填写';
    
    // 获取剂数
    const dose = parseInt(document.getElementById('doseInput').value) || 1;
    
    // 获取价格信息
    const subtotal = parseFloat(document.getElementById('subtotalPrice').textContent) || 0;
    const shippingFee = parseFloat(document.getElementById('shippingFeeInput').value) || 0;
    const total = parseFloat(document.getElementById('totalPrice').textContent) || 0;
    
    // 创建处方记录
    const prescriptionRecord = {
        customerName,
        customerAge,
        customerPhone,
        dose,
        subtotal,
        shippingFee,
        total,
        medicines: window.searchResults.filter(m => !m.notFound),
        prescriptionDate: new Date().toISOString()
    };
    
    // 保存处方记录
    prescriptionDB.saveRecord(prescriptionRecord).then(id => {
        console.log('处方记录保存成功:', id);
    }).catch(error => {
        console.error('处方记录保存失败:', error);
    });
    
    // 关闭结算弹窗
    closeSettlementModal();
    
    // 显示支付弹窗
    document.getElementById('paymentAmount').textContent = `¥${total.toFixed(2)}`;
    document.getElementById('paymentModal').style.display = 'block';
    
    // 模拟生成支付二维码（实际项目中应该调用后端API生成）
    setTimeout(() => {
        const qrCodeImg = document.getElementById('paymentQrCode');
        if (qrCodeImg) {
            // 使用一个占位的二维码图片
            qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TCM_PAYMENT_${total.toFixed(2)}_${Date.now()}`;
        }
    }, 500);
}

// 关闭支付弹窗
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// 打开使用说明弹窗
function openHelpModal() {
    document.getElementById('helpModal').style.display = 'block';
}

// 关闭使用说明弹窗
function closeHelpModal() {
    document.getElementById('helpModal').style.display = 'none';
}

// 保存为JSON
function saveAsJson() {
    if (!window.searchResults || window.searchResults.length === 0) {
        alert('请先检索药材');
        return;
    }
    
    const prescriptionRecord = {
        customerName: document.getElementById('customerName').value || '未填写',
        customerAge: document.getElementById('customerAge').value || '未填写',
        customerPhone: document.getElementById('customerPhone').value || '未填写',
        dose: parseInt(document.getElementById('doseInput').value) || 1,
        subtotal: parseFloat(document.getElementById('subtotalPrice').textContent) || 0,
        shippingFee: parseFloat(document.getElementById('shippingFeeInput').value) || 0,
        total: parseFloat(document.getElementById('totalPrice').textContent) || 0,
        medicines: window.searchResults,
        prescriptionDate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(prescriptionRecord, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `处方_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// 保存为TXT
function saveAsTxt() {
    if (!window.searchResults || window.searchResults.length === 0) {
        alert('请先检索药材');
        return;
    }
    
    let txtContent = `处方单\n`;
    txtContent += `日期: ${new Date().toLocaleString()}\n`;
    txtContent += `顾客姓名: ${document.getElementById('customerName').value || '未填写'}\n`;
    txtContent += `年龄: ${document.getElementById('customerAge').value || '未填写'}\n`;
    txtContent += `联系方式: ${document.getElementById('customerPhone').value || '未填写'}\n`;
    txtContent += `剂数: ${parseInt(document.getElementById('doseInput').value) || 1}\n\n`;
    txtContent += `药材明细:\n`;
    txtContent += `----------------------------------------\n`;
    
    window.searchResults.forEach(medicine => {
        if (!medicine.notFound) {
            const itemTotal = medicine["售价"] * medicine.amount * (parseInt(document.getElementById('doseInput').value) || 1);
            txtContent += `${medicine["商品名称"]}: ${medicine.amount}g × ${medicine["售价"].toFixed(3)}元/g = ${itemTotal.toFixed(2)}元\n`;
        } else {
            txtContent += `${medicine["商品名称"]}: 未找到\n`;
        }
    });
    
    txtContent += `----------------------------------------\n`;
    txtContent += `商品总价: ¥${parseFloat(document.getElementById('subtotalPrice').textContent) || 0}\n`;
    txtContent += `运费: ¥${parseFloat(document.getElementById('shippingFeeInput').value) || 0}\n`;
    txtContent += `应付总额: ¥${parseFloat(document.getElementById('totalPrice').textContent) || 0}\n`;
    
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `处方_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// 保存为图片
function saveAsImage() {
    if (!window.html2canvas) {
        alert('保存图片功能需要html2canvas库');
        return;
    }
    
    const prescriptionResult = document.querySelector('.prescription-result');
    if (!prescriptionResult) {
        alert('找不到处方结果元素');
        return;
    }
    
    html2canvas(prescriptionResult, {
        scale: 2, // 提高清晰度
        useCORS: true, // 允许跨域图片
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `处方_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('保存图片失败:', error);
        alert('保存图片失败，请重试');
    });
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const settlementModal = document.getElementById('settlementModal');
    const paymentModal = document.getElementById('paymentModal');
    const helpModal = document.getElementById('helpModal');
    
    if (event.target === settlementModal) {
        settlementModal.style.display = 'none';
    }
    
    if (event.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
    
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
};