// IndexedDB Service for Local Data Storage

class LockInDatabase {
  constructor() {
    this.dbName = 'LockInDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'sessionId' });
        }
        if (!db.objectStoreNames.contains('userSettings')) {
          db.createObjectStore('userSettings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('leaves')) {
          db.createObjectStore('leaves', { keyPath: 'date' });
        }
      };
    });
  }

  async saveSetting(setting) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['userSettings'], 'readwrite');
      const store = transaction.objectStore('userSettings');
      const request = store.put({ id: 'settings', ...setting });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getSetting() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['userSettings'], 'readonly');
      const store = transaction.objectStore('userSettings');
      const request = store.get('settings');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result || this.getDefaultSettings());
      };
    });
  }

  getDefaultSettings() {
    return {
      id: 'settings',
      workStart: '09:00',
      workEnd: '18:00',
      requiredHours: 8,
      breakAllocation: 1,
      workingDaysPerMonth: 20,
      salaryCreditStartDate: 1,
      salaryCreditEndDate: 30,
      darkMode: false
    };
  }

  async saveSession(session) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      
      const sessionWithMetadata = {
        ...session,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const request = store.put(sessionWithMetadata);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getSession(sessionId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.get(sessionId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getSessionsByDate(date) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const sessions = request.result.filter(s => s.date === date);
        resolve(sessions);
      };
    });
  }

  async getAllSessions() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async deleteSession(sessionId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.delete(sessionId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async addLeave(leave) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['leaves'], 'readwrite');
      const store = transaction.objectStore('leaves');
      const request = store.put(leave);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getLeaves() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['leaves'], 'readonly');
      const store = transaction.objectStore('leaves');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async deleteLeave(date) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['leaves'], 'readwrite');
      const store = transaction.objectStore('leaves');
      const request = store.delete(date);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async cleanupOldSessions(monthsToKeep = 6) {
    return new Promise((resolve, reject) => {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsToKeep);

      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();

      request.onsuccess = () => {
        const sessionsToDelete = request.result.filter(session => {
          const sessionDate = new Date(session.createdAt);
          return sessionDate < cutoffDate;
        });

        sessionsToDelete.forEach(session => {
          store.delete(session.sessionId);
        });

        resolve(sessionsToDelete.length);
      };

      request.onerror = () => reject(request.error);
    });
  }
}

export default new LockInDatabase();