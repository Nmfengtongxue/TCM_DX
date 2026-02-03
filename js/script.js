import { medicineData } from './data.js';
import { getPinyinFirstLetter, getFullPinyin } from './utils.js';

// DOM元素 - 初始化为null，在DOM加载完成后获取
let prescriptionInput = null;
let searchBtn = null;
let resetBtn = null;
let medicineList = null;
let doseInput = null;
let subtotalPriceElement = null;
let shippingFeeInput = null;
let shippingFeeLabel = null;
let totalPriceElement = null;
let customerName = null;
let customerAge = null;
let customerPhone = null;
let saveJsonBtn = null;
let saveTxtBtn = null;
let saveImageBtn = null;

// 结算弹窗相关元素
let settlementBtn = null;
let settlementModal = null;
let settlementClose = null;
let cancelSettlementBtn = null;
let confirmSettlementBtn = null;
let modalCustomerName = null;
let modalCustomerAge = null;
let modalCustomerPhone = null;
let modalPrescriptionDate = null;
let modalDose = null;
let modalMedicinesList = null;
let modalSubtotal = null;
let modalShippingFee = null;
let modalTotal = null;

// 支付二维码弹窗相关元素
let paymentModal = null;
let paymentClose = null;
let closePaymentBtn = null;
let paymentAmount = null;
let helpBtn = null;
let helpModal = null;
let helpClose = null;
let closeHelpBtn = null;

// 在DOM加载完成后获取所有元素
document.addEventListener('DOMContentLoaded', function() {
  prescriptionInput = document.getElementById('prescriptionInput');
  searchBtn = document.getElementById('searchBtn');
  resetBtn = document.getElementById('resetBtn');
  medicineList = document.getElementById('medicineList');
  doseInput = document.getElementById('doseInput');
  subtotalPriceElement = document.getElementById('subtotalPrice');
  shippingFeeInput = document.getElementById('shippingFeeInput');
  shippingFeeLabel = document.getElementById('shippingFeeLabel');
  totalPriceElement = document.getElementById('totalPrice');
  customerName = document.getElementById('customerName');
  customerAge = document.getElementById('customerAge');
  customerPhone = document.getElementById('customerPhone');
  saveJsonBtn = document.getElementById('saveJsonBtn');
  saveTxtBtn = document.getElementById('saveTxtBtn');
  saveImageBtn = document.getElementById('saveImageBtn');

  // 结算弹窗相关元素
  settlementBtn = document.getElementById('settlementBtn');
  settlementModal = document.getElementById('settlementModal');
  settlementClose = document.getElementById('settlementClose');
  cancelSettlementBtn = document.getElementById('cancelSettlementBtn');
  confirmSettlementBtn = document.getElementById('confirmSettlementBtn');
  modalCustomerName = document.getElementById('modalCustomerName');
  modalCustomerAge = document.getElementById('modalCustomerAge');
  modalCustomerPhone = document.getElementById('modalCustomerPhone');
  modalPrescriptionDate = document.getElementById('modalPrescriptionDate');
  modalDose = document.getElementById('modalDose');
  modalMedicinesList = document.getElementById('modalMedicinesList');
  modalSubtotal = document.getElementById('modalSubtotal');
  modalShippingFee = document.getElementById('modalShippingFee');
  modalTotal = document.getElementById('modalTotal');

  // 支付二维码弹窗相关元素
  paymentModal = document.getElementById('paymentModal');
  paymentClose = document.getElementById('paymentClose');
  closePaymentBtn = document.getElementById('closePaymentBtn');
  paymentAmount = document.getElementById('paymentAmount');
  
  // 使用说明弹窗相关元素
  helpBtn = document.getElementById('helpBtn');
  helpModal = document.getElementById('helpModal');
  helpClose = document.getElementById('helpClose');
  closeHelpBtn = document.getElementById('closeHelpBtn');

  // 初始化事件监听器
  initEventListeners();
});

// 当前处方数据
let currentPrescription = { dose: 1, medicines: [] };

// 运费默认值
const DEFAULT_SHIPPING_FEE = 20;
const FREE_SHIPPING_THRESHOLD = 200;

// 传统剂量单位转换表（转换为克）
const traditionalUnitConversion = {
    '两': 30,
    '钱': 3,
    '分': 0.3,
    '厘': 0.03,
    '斤': 500,
    'g': 1,
    '克': 1
};

// 将传统剂量转换为克
function convertTraditionalToGram(quantity, unit) {
    const conversionFactor = traditionalUnitConversion[unit];
    return conversionFactor ? quantity * conversionFactor : quantity;
}

// 解析传统剂量（如"三两"、"十二枚"）
function parseTraditionalDose(doseText) {
    // 匹配数字+单位格式（如"三两"、"9g"）
    const numberUnitRegex = /(\d+(?:\.\d+)?)([\u4e00-\u9fa5a-zA-Z]+)/;
    const match = doseText.match(numberUnitRegex);
    if (match) {
        const quantity = parseFloat(match[1]);
        const unit = match[2].trim();
        return { quantity, unit };
    }
    // 匹配特殊格式（如"十二枚"）
    const specialFormatRegex = /(\d+)([\u4e00-\u9fa5]+)/;
    const specialMatch = doseText.match(specialFormatRegex);
    if (specialMatch) {
        const quantity = parseFloat(specialMatch[1]);
        const unit = specialMatch[2].trim();
        return { quantity, unit };
    }
    return { quantity: 0, unit: '' };
}

// 中药词典（按长度降序排列，确保长的药名优先匹配）
const HERB_DICT = [
    '炙黄芪', '生黄芪', '赤芍', '白芍', '桂枝', '肉桂', '甘草',
    '干姜', '红枣', '当归', '龟甲', '龟板', '党参', '丁香', '黄芪',
    '大枣', '炙甘草', '甘草片'
].sort((a, b) => b.length - a.length);

// 药材别名映射
const medicineAliases = {
    '红枣': ['大枣'],
    '生黄芪': ['黄芪'],
    '甘草': ['甘草', '炙甘草', '甘草片']
};

// 获取药材的所有可能名称（包括别名）
function getAllPossibleNames(medicineName) {
    if (medicineAliases[medicineName]) {
        return [medicineName, ...medicineAliases[medicineName]];
    }
    return [medicineName];
}

// 从单个条目提取药名和剂量
function extractHerbAndDose(str) {
    // 匹配：药名 + 数字 + [g]
    const match = str.match(/^([\u4e00-\u9fa5]+)\s*(\d+(\.\d+)?)\s*g?$/i);
    if (match) {
        const herb = match[1];
        const dose = parseFloat(match[2]);
        // 可选：验证 herb 是否在词典中（提高准确率）
        if (HERB_DICT.some(h => h === herb)) {
            return { drug: herb, quantity: dose, unit: 'g' };
        }
    }
    return null;
}

// 解析单行处方
function parseLine(line) {
    // 移除"7剂"等
    line = line.replace(/\d+\s*剂/g, '').trim();
    if (!line) return [];

    const results = [];

    // 情况1：逗号分隔（如 "桂枝20g，肉桂10g"）
    if (line.includes('，') || line.includes(',')) {
        const items = line.split(/[,，]\s*/);
        for (let item of items) {
            const res = extractHerbAndDose(item.trim());
            if (res) {
                results.push(res);
            } else {
                // 尝试解析只有药名的情况
                const herbMatch = item.trim().match(/^([\u4e00-\u9fa5]+)$/);
                if (herbMatch) {
                    const herb = herbMatch[1];
                    if (HERB_DICT.some(h => h === herb)) {
                        results.push({ drug: herb, quantity: 0, unit: '' });
                    }
                }
            }
        }
        return results;
    }

    // 情况2：单行（可能含多个药？先尝试整体匹配）
    const res = extractHerbAndDose(line);
    if (res) {
        return [res];
    }

    // 情况3：复杂空格分隔（如 "当归 龟 党参 10"）→ 启发式处理
    // 先提取最后一个数字作为剂量
    const doseMatch = line.match(/(\d+(\.\d+)?)\s*g?\s*$/i);
    if (doseMatch) {
        const dose = parseFloat(doseMatch[1]);
        const prefix = line.slice(0, doseMatch.index).trim();
        // 尝试从词典中匹配 prefix 中的所有药名（贪心）
        let rest = prefix;
        while (rest) {
            let matched = false;
            for (const herb of HERB_DICT) {
                if (rest.startsWith(herb)) {
                    results.push({ drug: herb, quantity: dose, unit: 'g' });
                    rest = rest.slice(herb.length).trim();
                    matched = true;
                    break;
                }
            }
            if (!matched) break; // 无法识别，跳出
        }
        if (results.length > 0) return results;
    }

    // 情况4：只有药名（如 "当归"、"龟"）
    const herbMatch = line.match(/^([\u4e00-\u9fa5]+)$/);
    if (herbMatch) {
        const herb = herbMatch[1];
        if (HERB_DICT.some(h => h === herb)) {
            results.push({ drug: herb, quantity: 0, unit: '' });
        }
    }

    return results;
}

// 预处理处方输入，将连续的A类和B类元素分割成合理的行
function preprocessPrescription(inputText) {
    // 定义A类和B类的正则表达式
    const aClassRegex = /[\u4e00-\u9fa5a-zA-Z]+/g;
    const bClassRegex = /\d+(?:\.\d+)?(?:[a-zA-Z一-龥]+)?/g;
    
    // 提取所有A类和B类元素
    const aMatches = [];
    const bMatches = [];
    let match;
    
    while ((match = aClassRegex.exec(inputText)) !== null) {
        aMatches.push({
            text: match[0],
            index: match.index
        });
    }
    
    while ((match = bClassRegex.exec(inputText)) !== null) {
        bMatches.push({
            text: match[0],
            index: match.index
        });
    }
    
    // 合并并按位置排序
    const allMatches = [...aMatches.map(m => ({ ...m, type: 'A' })), ...bMatches.map(m => ({ ...m, type: 'B' }))];
    allMatches.sort((a, b) => a.index - b.index);
    
    // 处理分割逻辑
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < allMatches.length; i++) {
        const current = allMatches[i];
        const next = allMatches[i + 1];
        
        currentLine += current.text;
        
        // 检查是否需要分割
        if (next) {
            if (current.type === 'A' && next.type === 'A') {
                // A类后面还是A类，中间分行
                lines.push(currentLine);
                currentLine = '';
            } else if (current.type === 'B' && next.type === 'A') {
                // B类后面是A类，当前行结束
                lines.push(currentLine);
                currentLine = '';
            }
        } else {
            // 最后一个元素，添加到最后一行
            lines.push(currentLine);
        }
    }
    
    return lines.join('\n');
}

// 解析处方格式，提取药材名称、数量和单位，以及剂数
function parsePrescription(inputText) {
    // 解析剂数（如"7剂"）
    const doseRegex = /(\d+)\s*剂/g;
    let dose = 1; // 默认1剂
    const doseMatch = doseRegex.exec(inputText);
    if (doseMatch) {
        dose = parseInt(doseMatch[1]);
    }
    
    // 预处理处方输入
    const preprocessedText = preprocessPrescription(inputText);
    
    // 使用新的解析方法
    const lines = preprocessedText.split('\n');
    const parsedMedicines = [];
    
    for (const line of lines) {
        const items = parseLine(line);
        for (const item of items) {
            parsedMedicines.push({
                name: item.drug,
                quantity: item.quantity,
                unit: item.unit
            });
        }
    }
    
    // 如果没有匹配到任何药材，尝试简单分割
    if (parsedMedicines.length === 0) {
        return {
            medicines: inputText.split(/[,，\s]+/).filter(name => name.trim() !== '').map(name => ({
                name: name,
                quantity: 0,
                unit: ''
            })),
            dose: dose
        };
    }
    
    return {
        medicines: parsedMedicines,
        dose: dose
    };
}

// 检索药材
function searchMedicines() {
    const inputText = prescriptionInput.value.trim();
    if (!inputText) {
        medicineList.innerHTML = '<div class="not-found">请输入药材名称</div>';
        return;
    }

    // 解析处方
    const prescriptionData = parsePrescription(inputText);
    const parsedMedicines = prescriptionData.medicines;
    const dose = prescriptionData.dose;
    
    // 更新当前处方的剂量
    currentPrescription.dose = dose;
    // 更新剂量输入框
    doseInput.value = dose;
    
    // 查找匹配的药材
    const allMatchedMedicines = [];
    const notFoundMedicines = [];
    const multipleMatchMedicines = [];
    
    for (const parsed of parsedMedicines) {
        const matched = medicineData.filter(med => {
            // 过滤掉合计项和包含NaN值的项
            if (med.商品名称 === '合计' || med.商品编码 === NaN) {
                return false;
            }
            
            // 获取所有可能的名称（包括别名）
            const possibleNames = getAllPossibleNames(parsed.name);
            
            // 检查是否有任何名称匹配
            let nameMatch = false;
            for (const name of possibleNames) {
                if (med.商品名称.includes(name) || (med.国家医保名称 && med.国家医保名称.includes(name))) {
                    nameMatch = true;
                    break;
                }
            }
            
            // 全拼搜索
            const fullPinyinMatch = getFullPinyin(med.商品名称).includes(parsed.name.toLowerCase()) || 
                                    (med.国家医保名称 && getFullPinyin(med.国家医保名称).includes(parsed.name.toLowerCase()));
            
            // 拼音首字母搜索
            const firstLetterMatch = getPinyinFirstLetter(med.商品名称).includes(parsed.name.toLowerCase()) || 
                                     (med.国家医保名称 && getPinyinFirstLetter(med.国家医保名称).includes(parsed.name.toLowerCase()));
            
            return nameMatch || fullPinyinMatch || firstLetterMatch;
        });
        
        if (matched.length > 0) {
            // 每个匹配的药材关联解析出的数量
            allMatchedMedicines.push({
                parsed: parsed,
                medicines: matched
            });
            
            // 记录找到多个匹配的药材
            if (matched.length > 1) {
                multipleMatchMedicines.push({
                    name: parsed.name,
                    count: matched.length,
                    matches: matched.map(med => med.商品名称)
                });
            }
        } else {
            // 记录未找到的药材
            notFoundMedicines.push({
                name: parsed.name,
                quantity: parsed.quantity,
                unit: parsed.unit
            });
        }
    }
    
    // 构建提示信息
    let alertHtml = '';
    
    // 未找到药材的提示
    if (notFoundMedicines.length > 0) {
        const notFoundList = notFoundMedicines.map(med => `"${med.name}"`).join('、');
        alertHtml += `<div class="alert alert-warning">未找到以下药材：${notFoundList}，请检查输入是否正确。</div>`;
    }
    
    // 找到多个药材的提示
    if (multipleMatchMedicines.length > 0) {
        const multipleMatchList = multipleMatchMedicines.map(med => `"${med.name}"`).join('、');
        alertHtml += `<div class="alert alert-info">以下药材找到多个匹配结果（${multipleMatchList}），您可以通过下拉菜单手动选择。</div>`;
    }

    // 显示结果
    if (allMatchedMedicines.length === 0) {
        medicineList.innerHTML = alertHtml + '<div class="not-found">未找到匹配的药材</div>';
        return;
    }

    // 构建HTML
    let html = alertHtml;
    let index = 0;
    
    allMatchedMedicines.forEach((item, itemIndex) => {
        const { parsed, medicines } = item;
        
        if (medicines.length === 1) {
            // 只有一个匹配结果，直接使用
            const med = medicines[0];
            const pricePerUnit = parseFloat(med.售价);
            const dose = currentPrescription.dose;
            const singlePrice = parsed.quantity * pricePerUnit;
            const totalPrice = singlePrice * dose;
            
            html += `
                <div class="medicine-item">
                    <div class="medicine-info">
                        <div class="medicine-name">${med.商品名称}</div>
                        <div class="medicine-details">单位: ${med.单位} | 单价: ¥${pricePerUnit.toFixed(3)}</div>
                    </div>
                    <input type="number" min="0" step="0.1" value="${parsed.quantity}" class="quantity-input" data-item-index="${index}" data-medicine-index="0" data-all-medicines='${JSON.stringify(medicines)}'>
                    <div class="medicine-price">¥${totalPrice.toFixed(2)}</div>
                    <button class="add-to-prescription-btn" data-item-index="${index}" data-all-medicines='${JSON.stringify(medicines)}' data-quantity="${parsed.quantity}">添加到处方</button>
                </div>
            `;
            index++;
        } else {
            // 多个匹配结果，显示下拉选择
            html += `
                <div class="medicine-item">
                    <div class="medicine-info">
                        <div class="medicine-name">
                            <select class="medicine-select" data-item-index="${index}" data-all-medicines='${JSON.stringify(medicines)}' data-quantity="${parsed.quantity}">
            `;
            
            medicines.forEach((med, medIndex) => {
                const selected = medIndex === 0 ? 'selected' : '';
                html += `<option value="${medIndex}" ${selected}>${med.商品名称}</option>`;
            });
            
            const defaultMed = medicines[0];
            const pricePerUnit = parseFloat(defaultMed.售价);
            const dose = currentPrescription.dose;
            const quantity = parsed.quantity;
            
            // 计算价格
            const prices = calculatePrice(pricePerUnit, quantity, dose);
            
            html += `
                            </select>
                        </div>
                        <div class="medicine-details">单位: ${defaultMed.单位} | 单价: ¥${pricePerUnit.toFixed(3)} <span class="multiple-match-hint">（找到${medicines.length}个匹配结果）</span></div>
                    </div>
                    <input type="number" min="0" step="0.1" value="${parsed.quantity}" class="quantity-input" data-item-index="${index}" data-all-medicines='${JSON.stringify(medicines)}' data-medicine-index="0">
                    <div class="medicine-price">¥${prices.totalPrice.toFixed(2)}</div>
                    <button class="add-to-prescription-btn" data-item-index="${index}" data-all-medicines='${JSON.stringify(medicines)}' data-quantity="${parsed.quantity}">添加到处方</button>
                </div>
            `;
            
            index++;
        }
    });
    
    medicineList.innerHTML = html;
    
    // 添加事件监听器（搜索结果中的数量输入）
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('input', updateSearchResultQuantity);
    });

    // 更新搜索结果中的数量
    function updateSearchResultQuantity(e) {
        const quantity = parseFloat(e.target.value) || 0;
        const allMedicines = JSON.parse(e.target.dataset.allMedicines);
        const medicineIndex = parseInt(e.target.dataset.medicineIndex) || 0;
        const selectedMed = allMedicines[medicineIndex];
        const pricePerUnit = parseFloat(selectedMed.售价);
        const dose = currentPrescription.dose;
        
        // 计算价格
        const prices = calculatePrice(pricePerUnit, quantity, dose);
        
        // 更新显示价格
        const priceElement = e.target.nextElementSibling;
        priceElement.textContent = `¥${prices.totalPrice.toFixed(2)}`;
        
        // 更新按钮上的数量
        const addBtn = e.target.closest('.medicine-item').querySelector('.add-to-prescription-btn');
        if (addBtn) {
            addBtn.dataset.quantity = quantity;
        }
        
        // 更新选择框上的数量
        const select = e.target.closest('.medicine-item').querySelector('.medicine-select');
        if (select) {
            select.dataset.quantity = quantity;
        }
    }
    
    // 添加下拉选择事件监听器（搜索结果中的选择）
    document.querySelectorAll('.medicine-select').forEach(select => {
        select.addEventListener('change', (e) => {
            updateSearchResultPrice(e.target);
        });
    });
    

    
    // 更新剂数输入框的值
    doseInput.value = currentPrescription.dose;
    
    updateTotalPrice();
}

// 更新数量
function updateQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    const quantity = parseFloat(e.target.value) || 0;
    const pricePerUnit = parseFloat(currentPrescription.medicines[index].售价);
    const dose = currentPrescription.dose;
    const singlePrice = quantity * pricePerUnit;
    const totalPrice = singlePrice * dose;
    
    currentPrescription.medicines[index].quantity = quantity;
    currentPrescription.medicines[index].singlePrice = singlePrice;
    currentPrescription.medicines[index].totalPrice = totalPrice;
    
    // 更新显示价格
    const priceElement = e.target.nextElementSibling;
    priceElement.textContent = `¥${totalPrice.toFixed(2)}`;
    
    updateTotalPrice();
}

// 更新总价
function updateTotalPrice() {
    // 计算商品总价
    const subtotal = currentPrescription.medicines.reduce((sum, item) => sum + item.totalPrice, 0);
    subtotalPriceElement.textContent = subtotal.toFixed(2);
    
    // 根据商品总价计算运费
    let shippingFee = 0;
    if (subtotal < FREE_SHIPPING_THRESHOLD) {
        shippingFee = DEFAULT_SHIPPING_FEE;
        shippingFeeLabel.textContent = "（不满200元需支付运费）";
    } else {
        shippingFee = 0;
        shippingFeeLabel.textContent = "（满200元免运费）";
    }
    
    // 更新运费输入框的值，但不触发事件
    shippingFeeInput.value = shippingFee;
    
    // 计算应付总额
    const total = subtotal + parseFloat(shippingFeeInput.value);
    totalPriceElement.textContent = total.toFixed(2);
}

// 重置表单
function resetForm() {
    prescriptionInput.value = '';
    customerName.value = '';
    customerAge.value = '';
    customerPhone.value = '';
    medicineList.innerHTML = '<div class="not-found">请输入药材名称并点击检索</div>';
    subtotalPriceElement.textContent = '0.00';
    shippingFeeInput.value = '0';
    shippingFeeLabel.textContent = '（满200元免运费）';
    totalPriceElement.textContent = '0.00';
    doseInput.value = '1';
    currentPrescription = { dose: 1, medicines: [] };
}

// 手动修改运费时更新总额
function updateShippingFee() {
    updateTotalPrice();
}

// 更新剂数并重新计算价格
function updateDose() {
    const dose = parseInt(doseInput.value) || 1;
    currentPrescription.dose = dose;
    
    // 更新所有药材的总价
    currentPrescription.medicines.forEach(item => {
        const pricePerUnit = parseFloat(item.售价);
        const quantity = item.quantity;
        
        // 计算价格
        const prices = calculatePrice(pricePerUnit, quantity, dose);
        
        item.singlePrice = prices.singlePrice;
        item.totalPrice = prices.totalPrice;
    });
    
    // 更新UI中的价格显示
    const priceElements = document.querySelectorAll('.medicine-price');
    priceElements.forEach((element, index) => {
        if (index < currentPrescription.medicines.length) {
            element.textContent = `¥${currentPrescription.medicines[index].totalPrice.toFixed(2)}`;
        }
    });
    
    // 更新搜索结果中的价格
    document.querySelectorAll('.quantity-input').forEach(input => {
        const allMedicines = JSON.parse(input.dataset.allMedicines);
        const medicineIndex = parseInt(input.dataset.medicineIndex) || 0;
        const selectedMed = allMedicines[medicineIndex];
        const pricePerUnit = parseFloat(selectedMed.售价);
        const quantity = parseFloat(input.value) || 0;
        
        // 计算价格
        const prices = calculatePrice(pricePerUnit, quantity, dose);
        
        // 更新显示价格
        const priceElement = input.nextElementSibling;
        priceElement.textContent = `¥${prices.totalPrice.toFixed(2)}`;
    });
    
    updateTotalPrice();
}

// 保存为JSON
function saveAsJson() {
    if (currentPrescription.medicines.length === 0) {
        alert('请先检索并填写处方信息');
        return;
    }
    
    const prescriptionData = {
        customer: {
            name: customerName.value,
            age: customerAge.value,
            phone: customerPhone.value
        },
        dose: currentPrescription.dose,
        medicines: currentPrescription.medicines.map(item => ({
            name: item.商品名称,
            unit: item.单位,
            quantity: item.quantity,
            pricePerUnit: parseFloat(item.售价),
            singlePrice: item.singlePrice,
            totalPrice: item.totalPrice
        })),
        subtotal: parseFloat(subtotalPriceElement.textContent),
        shippingFee: parseFloat(shippingFeeInput.value),
        totalAmount: parseFloat(totalPriceElement.textContent)
    };
    
    const jsonStr = JSON.stringify(prescriptionData, null, 2);
    downloadFile('prescription.json', jsonStr, 'application/json');
}

// 保存为TXT
function saveAsTxt() {
    if (currentPrescription.medicines.length === 0) {
        alert('请先检索并填写处方信息');
        return;
    }
    
    let txtContent = '中药饮片处方\n';
    txtContent += '====================\n';
    txtContent += `顾客姓名: ${customerName.value || '未填写'}\n`;
    txtContent += `年龄: ${customerAge.value || '未填写'}\n`;
    txtContent += `联系方式: ${customerPhone.value || '未填写'}\n`;
    txtContent += `剂数: ${currentPrescription.dose}剂\n`;
    txtContent += '-------------------\n';
    txtContent += '药材清单:\n';
    
    currentPrescription.medicines.forEach(item => {
        if (item.quantity > 0) {
            txtContent += `${item.商品名称} ${item.quantity}${item.单位} × ${currentPrescription.dose}剂 = ¥${item.totalPrice.toFixed(2)}\n`;
        }
    });
    
    txtContent += '-------------------\n';
    txtContent += `商品总价: ¥${parseFloat(subtotalPriceElement.textContent).toFixed(2)}\n`;
    txtContent += `运费: ¥${parseFloat(shippingFeeInput.value).toFixed(2)}\n`;
    txtContent += `总计: ¥${parseFloat(totalPriceElement.textContent).toFixed(2)}\n`;
    txtContent += '\n处方日期: ' + new Date().toLocaleDateString('zh-CN');
    
    downloadFile('prescription.txt', txtContent, 'text/plain');
}

// 保存为图片
function saveAsImage() {
    if (currentPrescription.medicines.length === 0) {
        alert('请先检索并填写处方信息');
        return;
    }
    
    // 创建一个临时div用于生成图片
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    tempDiv.style.borderRadius = '10px';
    tempDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    tempDiv.style.width = '500px';
    tempDiv.style.fontFamily = '"Microsoft YaHei", sans-serif';
    
    let html = '<h2 style="text-align:center; color:#2c3e50; margin-bottom:20px;">中药饮片处方</h2>';
    html += `<p><strong>顾客姓名:</strong> ${customerName.value || '未填写'}</p>`;
    html += `<p><strong>年龄:</strong> ${customerAge.value || '未填写'}</p>`;
    html += `<p><strong>联系方式:</strong> ${customerPhone.value || '未填写'}</p>`;
    html += `<p><strong>剂数:</strong> ${currentPrescription.dose}剂</p>`;
    html += '<table style="width:100%; border-collapse:collapse; margin:20px 0;">';
    html += '<thead>';
    html += '<tr style="background-color:#f8f9ff;">';
    html += '<th style="border:1px solid #ddd; padding:8px; text-align:left;">药材名称</th>';
    html += '<th style="border:1px solid #ddd; padding:8px; text-align:right;">数量</th>';
    html += '<th style="border:1px solid #ddd; padding:8px; text-align:right;">单价</th>';
    html += '<th style="border:1px solid #ddd; padding:8px; text-align:right;">金额</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    
    currentPrescription.medicines.forEach(item => {
        if (item.quantity > 0) {
            html += '<tr>';
            html += `<td style="border:1px solid #ddd; padding:8px;">${item.商品名称}</td>`;
            html += `<td style="border:1px solid #ddd; padding:8px; text-align:right;">${item.quantity}${item.单位}</td>`;
            html += `<td style="border:1px solid #ddd; padding:8px; text-align:right;">¥${parseFloat(item.售价).toFixed(2)}</td>`;
            html += `<td style="border:1px solid #ddd; padding:8px; text-align:right;">¥${item.totalPrice.toFixed(2)}</td>`;
            html += '</tr>';
        }
    });
    
    html += '<tr style="background-color:#f8f9ff; font-weight:bold;">';
    html += '<td style="border:1px solid #ddd; padding:8px; text-align:right;" colspan="3">商品总价:</td>';
    html += `<td style="border:1px solid #ddd; padding:8px; text-align:right;">¥${parseFloat(subtotalPriceElement.textContent).toFixed(2)}</td>`;
    html += '</tr>';
    html += '<tr style="background-color:#f8f9ff; font-weight:bold;">';
    html += '<td style="border:1px solid #ddd; padding:8px; text-align:right;" colspan="3">运费:</td>';
    html += `<td style="border:1px solid #ddd; padding:8px; text-align:right;">¥${parseFloat(shippingFeeInput.value).toFixed(2)}</td>`;
    html += '</tr>';
    html += '<tr style="background-color:#f8f9ff; font-weight:bold;">';
    html += '<td style="border:1px solid #ddd; padding:8px; text-align:right;" colspan="3">总计:</td>';
    html += `<td style="border:1px solid #ddd; padding:8px; text-align:right;">¥${parseFloat(totalPriceElement.textContent).toFixed(2)}</td>`;
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';
    html += `<p style="text-align:right; margin-top:20px;">处方日期: ${new Date().toLocaleDateString('zh-CN')}</p>`;
    
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);
    
    // 使用html2canvas库将div转换为图片（需要先引入html2canvas库）
    if (typeof html2canvas !== 'undefined') {
        html2canvas(tempDiv).then(canvas => {
            const link = document.createElement('a');
            link.download = 'prescription.png';
            link.href = canvas.toDataURL();
            link.click();
            document.body.removeChild(tempDiv);
        });
    } else {
        alert('请先引入html2canvas库以使用保存图片功能');
        document.body.removeChild(tempDiv);
    }
}

// 下载文件
function downloadFile(filename, content, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}



// 初始化事件监听器函数
function initEventListeners() {
    // 基本功能事件监听器
    searchBtn.addEventListener('click', searchMedicines);
    resetBtn.addEventListener('click', resetForm);
    saveJsonBtn.addEventListener('click', saveAsJson);
    saveTxtBtn.addEventListener('click', saveAsTxt);
    saveImageBtn.addEventListener('click', saveAsImage);



    // 回车键检索
    prescriptionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMedicines();
        }
    });

    // 运费输入框事件监听器
    shippingFeeInput.addEventListener('input', updateShippingFee);

    // 剂数输入框事件监听器
    doseInput.addEventListener('input', updateDose);

    // 结算相关事件监听器
    settlementBtn.addEventListener('click', showSettlementModal);
    settlementClose.addEventListener('click', closeSettlementModal);
    cancelSettlementBtn.addEventListener('click', closeSettlementModal);
    confirmSettlementBtn.addEventListener('click', showPaymentModal);
    paymentClose.addEventListener('click', closePaymentModal);
    closePaymentBtn.addEventListener('click', closePaymentModal);
    
    // 使用说明弹窗相关事件监听器
    helpBtn.addEventListener('click', showHelpModal);
    helpClose.addEventListener('click', closeHelpModal);
    closeHelpBtn.addEventListener('click', closeHelpModal);

    // 点击模态框外部关闭弹窗
    window.addEventListener('click', (e) => {
        if (e.target === settlementModal) {
            closeSettlementModal();
        }
        if (e.target === paymentModal) {
            closePaymentModal();
        }
        if (e.target === helpModal) {
            closeHelpModal();
        }
    });
}

// 监听添加到处方按钮点击事件
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-prescription-btn')) {
        e.preventDefault();
        addToPrescription(e.target);
    }
    
    // 监听删除处方药材按钮点击事件
    if (e.target.classList.contains('remove-from-prescription-btn')) {
        e.preventDefault();
        removeFromPrescription(e.target);
    }
});

// 监听搜索结果中的下拉选择变化
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('medicine-select')) {
        updateSearchResultPrice(e.target);
    }
});

// 计算价格的统一函数
function calculatePrice(pricePerUnit, quantity, dose) {
    const singlePrice = quantity * pricePerUnit;
    const totalPrice = singlePrice * dose;
    return {
        singlePrice: singlePrice,
        totalPrice: totalPrice
    };
}

// 更新搜索结果中的价格
function updateSearchResultPrice(select) {
    const selectedIndex = parseInt(select.value);
    const allMedicines = JSON.parse(select.dataset.allMedicines);
    const quantityInput = select.closest('.medicine-item').querySelector('.quantity-input');
    const quantity = parseFloat(quantityInput.value) || 0;
    const selectedMed = allMedicines[selectedIndex];
    const pricePerUnit = parseFloat(selectedMed.售价);
    const dose = currentPrescription.dose;
    
    // 计算价格
    const prices = calculatePrice(pricePerUnit, quantity, dose);
    
    // 更新显示单价（小数点后3位）
    const medicineDetails = select.closest('.medicine-item').querySelector('.medicine-details');
    const unit = selectedMed.单位;
    medicineDetails.innerHTML = `单位: ${unit} | 单价: ¥${pricePerUnit.toFixed(3)} <span class="multiple-match-hint">（找到${allMedicines.length}个匹配结果）</span>`;
    
    // 更新显示价格
    const medicinePrice = select.closest('.medicine-item').querySelector('.medicine-price');
    medicinePrice.textContent = `¥${prices.totalPrice.toFixed(2)}`;
    
    // 更新相关元素的数据
    quantityInput.dataset.medicineIndex = selectedIndex;
    select.dataset.quantity = quantity;
    
    // 更新按钮上的数据
    const addBtn = select.closest('.medicine-item').querySelector('.add-to-prescription-btn');
    addBtn.dataset.medicineIndex = selectedIndex;
    addBtn.dataset.allMedicines = JSON.stringify(allMedicines);
    addBtn.dataset.quantity = quantity;
}

// 添加药材到处方
function addToPrescription(btn) {
    // 检查是否是已添加状态，如果是则执行撤回操作
    if (btn.classList.contains('added')) {
        withdrawFromPrescription(btn);
        return;
    }
    
    const itemIndex = parseInt(btn.dataset.itemIndex);
    const medicineIndex = parseInt(btn.dataset.medicineIndex) || 0;
    const allMedicines = JSON.parse(btn.dataset.allMedicines);
    const selectedMed = allMedicines[medicineIndex];
    
    // 获取数量
    let quantity = parseFloat(btn.dataset.quantity);
    const quantityInput = btn.closest('.medicine-item').querySelector('.quantity-input');
    if (quantityInput) {
        quantity = parseFloat(quantityInput.value) || quantity;
    }
    
    const pricePerUnit = parseFloat(selectedMed.售价);
    const dose = currentPrescription.dose;
    
    // 计算价格
    const prices = calculatePrice(pricePerUnit, quantity, dose);
    
    // 创建药材对象
    const medicineToAdd = {
        ...selectedMed,
        quantity: quantity,
        singlePrice: prices.singlePrice,
        totalPrice: prices.totalPrice,
        // 添加唯一标识符，用于撤回操作
        uniqueId: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    };
    
    // 如果是多选的药材，添加allMatches属性
    if (allMedicines.length > 1) {
        medicineToAdd.allMatches = allMedicines;
    }
    
    // 添加到处方
    currentPrescription.medicines.push(medicineToAdd);
    
    // 存储唯一标识符到按钮
    btn.dataset.uniqueId = medicineToAdd.uniqueId;
    
    // 显示成功提示
    btn.innerHTML = '<i class="fa fa-undo"></i> 已添加';
    btn.disabled = false;
    btn.classList.add('added');
    
    // 更新处方显示
    showPrescriptionDetails();
    
    // 更新总价
    updateTotalPrice();
    
    // 更新剂数输入框
    doseInput.value = currentPrescription.dose;
}

// 从处方中撤回药材
function withdrawFromPrescription(btn) {
    const uniqueId = btn.dataset.uniqueId;
    
    if (uniqueId) {
        // 从处方中找到并删除对应的药材
        const indexToRemove = currentPrescription.medicines.findIndex(med => med.uniqueId === uniqueId);
        if (indexToRemove !== -1) {
            currentPrescription.medicines.splice(indexToRemove, 1);
            
            // 更新按钮状态
            btn.innerHTML = '添加到处方';
            btn.disabled = false;
            btn.classList.remove('added');
            btn.dataset.uniqueId = '';
            
            // 更新处方显示
            showPrescriptionDetails();
            
            // 更新总价
            updateTotalPrice();
        }
    }
}

// 从处方中删除药材
function removeFromPrescription(btn) {
    const index = parseInt(btn.dataset.index);
    
    // 从处方中删除
    currentPrescription.medicines.splice(index, 1);
    
    // 更新处方显示
    showPrescriptionDetails();
    
    // 更新总价
    updateTotalPrice();
}

// 显示处方详情
function showPrescriptionDetails() {
    const prescriptionDetailsElement = document.getElementById('prescription-details');
    
    if (!prescriptionDetailsElement) {
        // 如果处方详情元素不存在，创建一个
        const container = document.querySelector('.container');
        if (container) {
            const prescriptionSection = document.createElement('div');
            prescriptionSection.id = 'prescription-section';
            prescriptionSection.className = 'section';
            prescriptionSection.innerHTML = `
                <h2>处方详情</h2>
                <div id="prescription-details" class="prescription-details"></div>
            `;
            
            // 插入到处方输入和结果列表之间
            const prescriptionInputContainer = document.querySelector('.prescription-input-container');
            if (prescriptionInputContainer) {
                container.insertBefore(prescriptionSection, prescriptionInputContainer.nextSibling);
            } else {
                container.appendChild(prescriptionSection);
            }
        }
    }
    
    // 更新处方详情
    const detailsElement = document.getElementById('prescription-details');
    if (currentPrescription.medicines.length === 0) {
        detailsElement.innerHTML = '<div class="empty-prescription">处方为空，请添加药材</div>';
        return;
    }
    
    let html = '<div class="prescription-medicines">';
    currentPrescription.medicines.forEach((med, index) => {
        const pricePerUnit = parseFloat(med.售价);
        html += `
            <div class="prescription-medicine-item">
                <div class="medicine-info">
                    <div class="medicine-name">${med.商品名称}</div>
                    <div class="medicine-details">单位: ${med.单位} | 单价: ¥${pricePerUnit.toFixed(2)}</div>
                </div>
                <input type="number" min="0" step="0.1" value="${med.quantity}" class="quantity-input" data-index="${index}">
                <div class="medicine-price">¥${med.totalPrice.toFixed(2)}</div>
                <button class="remove-from-prescription-btn" data-index="${index}"><i class="fa fa-times"></i> 删除</button>
            </div>
        `;
    });
    html += '</div>';
    
    detailsElement.innerHTML = html;
    
    // 添加数量输入事件监听器
    document.querySelectorAll('#prescription-details .quantity-input').forEach(input => {
        input.addEventListener('input', updatePrescriptionQuantity);
    });
}

// 更新处方中药材的数量
function updatePrescriptionQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    const quantity = parseFloat(e.target.value) || 0;
    const medicine = currentPrescription.medicines[index];
    const pricePerUnit = parseFloat(medicine.售价);
    const dose = currentPrescription.dose;
    const singlePrice = quantity * pricePerUnit;
    const totalPrice = singlePrice * dose;
    
    // 更新处方数据
    medicine.quantity = quantity;
    medicine.singlePrice = singlePrice;
    medicine.totalPrice = totalPrice;
    
    // 更新显示价格
    const priceElement = e.target.nextElementSibling;
    priceElement.textContent = `¥${totalPrice.toFixed(2)}`;
    
    // 更新总价
    updateTotalPrice();
}

// 显示结算弹窗
function showSettlementModal() {
    if (currentPrescription.medicines.length === 0) {
        alert('请先检索并填写处方信息');
        return;
    }
    
    // 填充顾客信息
    modalCustomerName.textContent = customerName.value || '未填写';
    modalCustomerAge.textContent = customerAge.value || '未填写';
    modalCustomerPhone.textContent = customerPhone.value || '未填写';
    
    // 填充处方日期和剂数
    modalPrescriptionDate.textContent = new Date().toLocaleDateString('zh-CN');
    modalDose.textContent = currentPrescription.dose;
    
    // 填充药材列表
    let html = '';
    currentPrescription.medicines.forEach(item => {
        if (item.quantity > 0) {
            html += `
                <tr>
                    <td>${item.商品名称}</td>
                    <td>${item.quantity}${item.单位}</td>
                    <td>¥${parseFloat(item.售价).toFixed(2)}</td>
                    <td>¥${item.totalPrice.toFixed(2)}</td>
                </tr>
            `;
        }
    });
    modalMedicinesList.innerHTML = html;
    
    // 填充价格信息
    modalSubtotal.textContent = `¥${parseFloat(subtotalPriceElement.textContent).toFixed(2)}`;
    modalShippingFee.textContent = `¥${parseFloat(shippingFeeInput.value).toFixed(2)}`;
    modalTotal.textContent = `¥${parseFloat(totalPriceElement.textContent).toFixed(2)}`;
    
    // 显示弹窗
    settlementModal.style.display = 'block';
}

// 关闭结算弹窗
function closeSettlementModal() {
    settlementModal.style.display = 'none';
}

// 显示使用说明弹窗
function showHelpModal() {
    helpModal.style.display = 'block';
}

// 关闭使用说明弹窗
function closeHelpModal() {
    helpModal.style.display = 'none';
}

// 保存处方信息到数据库
async function savePrescriptionToDatabase() {
    console.log('开始保存处方信息到数据库...');
    
    // 构建处方数据结构
    const prescriptionData = {
        customer: {
            name: customerName.value || '未填写',
            age: customerAge.value || '未填写',
            phone: customerPhone.value || '未填写'
        },
        doctor: {
            name: '未知医生'
        },
        prescriptionDate: new Date().toISOString(),
        dose: currentPrescription.dose,
        medicines: currentPrescription.medicines.map(item => ({
            name: item.商品名称,
            unit: item.单位,
            quantity: item.quantity,
            pricePerUnit: parseFloat(item.售价),
            singlePrice: item.singlePrice,
            totalPrice: item.totalPrice
        })),
        pricing: {
            subtotal: parseFloat(subtotalPriceElement.textContent),
            shippingFee: parseFloat(shippingFeeInput.value),
            totalAmount: parseFloat(totalPriceElement.textContent)
        },
        status: 'pending' // 订单状态：pending, paid, shipped, delivered
    };
    
    console.log('处方数据:', prescriptionData);
    
    try {
        // 模拟保存到数据库
        // 实际项目中，这里应该是一个API调用，例如：
        // const response = await fetch('/api/prescriptions', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(prescriptionData)
        // });
        // const result = await response.json();
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟保存成功
        const savedPrescription = {
            ...prescriptionData,
            id: 'presc_' + Date.now(),
            savedAt: new Date().toISOString()
        };
        
        console.log('处方信息保存成功:', savedPrescription);
        
        // 保存到localStorage以便后续使用
        localStorage.setItem('lastSavedPrescription', JSON.stringify(savedPrescription));
        
        return savedPrescription;
    } catch (error) {
        console.error('保存处方信息失败:', error);
        throw new Error('保存处方信息失败，请重试');
    }
}

// 显示支付二维码弹窗
async function showPaymentModal() {
    try {
        // 保存处方信息到数据库
        await savePrescriptionToDatabase();
        
        // 填充支付金额
        paymentAmount.textContent = `¥${parseFloat(totalPriceElement.textContent).toFixed(2)}`;
        
        // 隐藏结算弹窗，显示支付弹窗
        closeSettlementModal();
        paymentModal.style.display = 'block';
        
        console.log('显示支付二维码弹窗');
    } catch (error) {
        console.error('处理结算失败:', error);
        alert('保存处方信息失败，请重试');
    }
}

// 返回之前的页面
function navigateBack() {
    console.log('准备返回之前的页面...');
    
    // 检查是否有来源页面信息
    const referrer = document.referrer;
    const previousPage = localStorage.getItem('previousPage');
    
    console.log('页面来源:', referrer);
    console.log('之前保存的页面:', previousPage);
    
    // 确定返回的目标页面
    let targetPage = '中医智能分析系统.html'; // 默认返回中医智能分析系统页面
    
    if (previousPage && previousPage !== window.location.href) {
        // 如果有保存的之前页面且不是当前页面，则返回该页面
        targetPage = previousPage;
    } else if (referrer && !referrer.includes(window.location.hostname + '/index.html')) {
        // 如果有来源页面且不是当前页面，则返回来源页面
        targetPage = referrer;
    }
    
    console.log('返回目标页面:', targetPage);
    
    // 跳转到目标页面
    window.location.href = targetPage;
}

// 支付成功的核心回调函数
async function paySuccessCallback(payResult, prescriptionInfo, customerInfo) {
  try {
    // 步骤1：构造完整的待保存数据（合并支付、处方、顾客信息，加唯一标识和时间）
    const saveData = {
      id: Date.now() + Math.floor(Math.random() * 1000), // 唯一ID（时间戳+随机数）
      payNo: 'pay_' + Date.now(), // 支付单号（关联支付记录）
      totalAmount: parseFloat(totalPriceElement.textContent), // 结算金额
      payTime: new Date().toISOString(), // 支付时间（标准化格式）
      prescription: prescriptionInfo, // 处方信息（含药品、剂量、处方号等）
      customer: customerInfo, // 顾客信息（含姓名、电话、身份证号等）
      createTime: new Date().toISOString()
    };

    // 步骤2：保存到localStorage（持久化，刷新/重启浏览器不丢失）
    try {
      // 获取现有记录
      const existingRecords = JSON.parse(localStorage.getItem('prescriptionRecords') || '[]');
      // 添加新记录
      existingRecords.push(saveData);
      // 保存回localStorage
      localStorage.setItem('prescriptionRecords', JSON.stringify(existingRecords));
      console.log('本地保存处方信息成功:', saveData.id);
    } catch (localError) {
      console.error('本地保存失败：', localError);
    }

    // 步骤3：同步保存到服务器（Axios请求，需提前引入Axios）
    try {
      // 检查是否有Axios库
      if (typeof axios !== 'undefined') {
        const res = await axios.post('/api/prescription/save', saveData, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.data.code === 200) {
          console.log('服务器保存处方信息成功');
        } else {
          console.error('服务器保存失败：', res.data.msg);
          alert('结算成功，本地信息已保存，服务器同步失败，请稍后手动同步');
        }
      } else {
        // 如果没有Axios，使用fetch API
        const response = await fetch('/api/prescription/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(saveData)
        });
        
        const res = await response.json();
        if (res.code === 200) {
          console.log('服务器保存处方信息成功');
        } else {
          console.error('服务器保存失败：', res.msg);
          alert('结算成功，本地信息已保存，服务器同步失败，请稍后手动同步');
        }
      }
    } catch (error) {
      console.error('服务器保存异常：', error);
      alert('结算成功，本地信息已保存，服务器请求失败');
    }
  } catch (error) {
    console.error('保存信息异常：', error);
    alert('结算成功，本地信息已保存，服务器请求失败');
  }
}

// 关闭支付二维码弹窗
function closePaymentModal() {
    paymentModal.style.display = 'none';
    
    // 构造处方和顾客信息
    const prescriptionInfo = {
        dose: currentPrescription.dose,
        medicines: currentPrescription.medicines.map(item => ({
            name: item.商品名称,
            quantity: item.quantity,
            unit: item.单位,
            pricePerUnit: parseFloat(item.售价),
            totalPrice: item.totalPrice
        })),
        subtotal: parseFloat(subtotalPriceElement.textContent),
        shippingFee: parseFloat(shippingFeeInput.value),
        totalAmount: parseFloat(totalPriceElement.textContent)
    };
    
    const customerInfo = {
        name: customerName.value || '未填写',
        age: customerAge.value || '未填写',
        phone: customerPhone.value || '未填写'
    };
    
    // 模拟支付成功结果
    const payResult = {
        success: true,
        payNo: 'pay_' + Date.now(),
        totalAmount: parseFloat(totalPriceElement.textContent)
    };
    
    // 调用支付成功回调，保存数据
    paySuccessCallback(payResult, prescriptionInfo, customerInfo);
    
    // 显示提示信息
    alert('结算完成！');
    
    // 重置表单，以便用户可以继续使用系统
    setTimeout(() => {
        resetForm();
    }, 1000);
}


