// src/utils/dataManager.js
class DataManager {
  constructor() {
    this.cache = new Map();
    this.promises = new Map();
  }

  async get(key, apiCall) {
    // Nếu đã có data trong cache, trả về ngay
    if (this.cache.has(key)) {
      console.log(`📦 DataManager: Returning cached data for ${key}`);
      return this.cache.get(key);
    }

    // Nếu đang fetch, đợi promise hiện tại
    if (this.promises.has(key)) {
      console.log(`📦 DataManager: Waiting for existing promise for ${key}`);
      return this.promises.get(key);
    }

    // Tạo promise mới
    console.log(`📦 DataManager: Fetching new data for ${key}`);
    const promise = apiCall().then(data => {
      this.cache.set(key, data);
      this.promises.delete(key);
      console.log(`📦 DataManager: Cached data for ${key}`, data);
      return data;
    }).catch(error => {
      this.promises.delete(key);
      throw error;
    });

    this.promises.set(key, promise);
    return promise;
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
      this.promises.delete(key);
    } else {
      this.cache.clear();
      this.promises.clear();
    }
  }
}

export const dataManager = new DataManager();
