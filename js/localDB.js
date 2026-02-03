// 本地数据库功能实现
// 用于存储处方信息，支持按日期统计、增删改查操作

class LocalPrescriptionDB {
  constructor() {
    this.dbName = 'prescriptionRecords';
    this.initDB();
  }

  // 初始化数据库
  initDB() {
    if (!localStorage.getItem(this.dbName)) {
      localStorage.setItem(this.dbName, JSON.stringify([]));
    }
  }

  // 获取所有处方记录
  getAllRecords() {
    return JSON.parse(localStorage.getItem(this.dbName)) || [];
  }

  // 保存处方记录
  saveRecord(record) {
    const records = this.getAllRecords();
    // 确保记录有唯一ID
    if (!record.id) {
      record.id = `presc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    // 确保记录有创建时间
    if (!record.createTime) {
      record.createTime = new Date().toISOString();
    }
    // 确保记录有支付时间
    if (!record.payTime) {
      record.payTime = new Date().toISOString();
    }
    records.push(record);
    localStorage.setItem(this.dbName, JSON.stringify(records));
    return record;
  }

  // 根据ID获取记录
  getRecordById(id) {
    const records = this.getAllRecords();
    return records.find(record => record.id === id);
  }

  // 根据ID更新记录
  updateRecord(id, updates) {
    const records = this.getAllRecords();
    const index = records.findIndex(record => record.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.dbName, JSON.stringify(records));
      return records[index];
    }
    return null;
  }

  // 根据ID删除记录
  deleteRecord(id) {
    const records = this.getAllRecords();
    const filteredRecords = records.filter(record => record.id !== id);
    if (filteredRecords.length !== records.length) {
      localStorage.setItem(this.dbName, JSON.stringify(filteredRecords));
      return true;
    }
    return false;
  }

  // 按日期范围统计
  getRecordsByDateRange(startDate, endDate) {
    const records = this.getAllRecords();
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return records.filter(record => {
      const payTime = new Date(record.payTime);
      return payTime >= start && payTime <= end;
    });
  }

  // 获取今日记录
  getTodayRecords() {
    const today = new Date().toISOString().split('T')[0];
    return this.getRecordsByDateRange(today, today);
  }

  // 统计指定日期范围的数据
  getStatsByDateRange(startDate, endDate) {
    const records = this.getRecordsByDateRange(startDate, endDate);
    const count = records.length;
    const totalAmount = records.reduce((sum, record) => sum + Number(record.totalAmount), 0).toFixed(2);
    return {
      count,
      totalAmount,
      records
    };
  }

  // 统计今日数据
  getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    return this.getStatsByDateRange(today, today);
  }

  // 清空所有记录
  clearAllRecords() {
    localStorage.setItem(this.dbName, JSON.stringify([]));
  }

  // 导出所有记录为JSON
  exportAsJson() {
    const records = this.getAllRecords();
    const jsonStr = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription_records_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 导入记录从JSON
  importFromJson(jsonStr) {
    try {
      const importedRecords = JSON.parse(jsonStr);
      if (Array.isArray(importedRecords)) {
        const existingRecords = this.getAllRecords();
        const mergedRecords = [...existingRecords, ...importedRecords];
        localStorage.setItem(this.dbName, JSON.stringify(mergedRecords));
        return true;
      }
      return false;
    } catch (error) {
      console.error('导入JSON失败:', error);
      return false;
    }
  }
}

// 导出单例实例
const localDB = new LocalPrescriptionDB();
export default localDB;
export { LocalPrescriptionDB };
