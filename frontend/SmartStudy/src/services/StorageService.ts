import type { StorageService as IStorageService } from '../types';

// Storage error types
export class StorageError extends Error {
  public code: string;
  public originalError?: Error;

  constructor(message: string, code: string, originalError?: Error) {
    super(message);
    this.name = 'StorageError';
    this.code = code;
    this.originalError = originalError;
  }
}

export class StorageUnavailableError extends StorageError {
  constructor(originalError?: Error) {
    super('localStorage is not available', 'STORAGE_UNAVAILABLE', originalError);
  }
}

export class StorageQuotaExceededError extends StorageError {
  constructor(originalError?: Error) {
    super('localStorage quota exceeded', 'QUOTA_EXCEEDED', originalError);
  }
}

export class DataCorruptionError extends StorageError {
  constructor(key: string, originalError?: Error) {
    super(`Data corruption detected for key: ${key}`, 'DATA_CORRUPTION', originalError);
  }
}

// Migration interface
interface MigrationFunction<T = unknown> {
  version: number;
  migrate: (data: T) => T;
}

class StorageService implements IStorageService {
  private prefix = 'studyplanner_';
  private versionKey = 'version';
  private currentVersion = 1;
  private migrations: MigrationFunction[] = [];

  constructor() {
    this.checkStorageAvailability();
    this.runMigrations();
  }

  /**
   * Check if localStorage is available and functional
   */
  private checkStorageAvailability(): void {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (error) {
      throw new StorageUnavailableError(error as Error);
    }
  }

  /**
   * Get the full key with prefix
   */
  private getFullKey(key: string): string {
    return this.prefix + key;
  }

  /**
   * Check if error is quota exceeded
   */
  private isQuotaExceededError(error: Error): boolean {
    const errWithCode = error as Error & { code?: number };
    return error.name === 'QuotaExceededError' || 
           error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
           errWithCode.code === 22;
  }

  /**
   * Save data to localStorage with comprehensive error handling
   */
  async save<T>(key: string, data: T): Promise<void> {
    try {
      this.checkStorageAvailability();
      
      const serializedData = JSON.stringify(data);
      const fullKey = this.getFullKey(key);
      
      // Try to save the data
      localStorage.setItem(fullKey, serializedData);
      
      // Verify the data was saved correctly
      const verification = localStorage.getItem(fullKey);
      if (verification !== serializedData) {
        throw new StorageError('Data verification failed after save', 'VERIFICATION_FAILED');
      }
      
    } catch (error) {
      const err = error as Error;
      
      if (this.isQuotaExceededError(err)) {
        throw new StorageQuotaExceededError(err);
      }
      
      if (err instanceof StorageError) {
        throw err;
      }
      
      throw new StorageError(`Failed to save data for key: ${key}`, 'SAVE_FAILED', err);
    }
  }

  /**
   * Load data from localStorage with error handling and validation
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      this.checkStorageAvailability();
      
      const fullKey = this.getFullKey(key);
      const serializedData = localStorage.getItem(fullKey);
      
      if (serializedData === null) {
        return null;
      }
      
      try {
        const parsedData = JSON.parse(serializedData) as T;
        return parsedData;
      } catch (parseError) {
        // Data is corrupted, remove it and return null
        console.warn(`Corrupted data detected for key: ${key}, removing...`);
        await this.remove(key);
        throw new DataCorruptionError(key, parseError as Error);
      }
      
    } catch (error) {
      const err = error as Error;
      
      if (err instanceof StorageError) {
        throw err;
      }
      
      console.error(`Failed to load data for key: ${key}`, err);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   */
  async remove(key: string): Promise<void> {
    try {
      this.checkStorageAvailability();
      
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
      
    } catch (error) {
      const err = error as Error;
      
      if (err instanceof StorageError) {
        throw err;
      }
      
      throw new StorageError(`Failed to remove data for key: ${key}`, 'REMOVE_FAILED', err);
    }
  }

  /**
   * Clear all application data from localStorage
   */
  async clear(): Promise<void> {
    try {
      this.checkStorageAvailability();
      
      const keys = Object.keys(localStorage);
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      for (const key of appKeys) {
        localStorage.removeItem(key);
      }
      
    } catch (error) {
      const err = error as Error;
      
      if (err instanceof StorageError) {
        throw err;
      }
      
      throw new StorageError('Failed to clear localStorage', 'CLEAR_FAILED', err);
    }
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<{ used: number; available: number; total: number }> {
    try {
      this.checkStorageAvailability();
      
      let used = 0;
      const keys = Object.keys(localStorage);
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      for (const key of appKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
      
      // Estimate total localStorage capacity (usually 5-10MB)
      const total = 5 * 1024 * 1024; // 5MB estimate
      const available = total - used;
      
      return { used, available, total };
      
    } catch (error) {
      throw new StorageError('Failed to get storage info', 'STORAGE_INFO_FAILED', error as Error);
    }
  }

  /**
   * Register a migration function
   */
  registerMigration(migration: MigrationFunction): void {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version - b.version);
  }

  /**
   * Run pending migrations
   */
  private async runMigrations(): Promise<void> {
    try {
      const currentVersion = await this.load<number>(this.versionKey) || 0;
      
      if (currentVersion >= this.currentVersion) {
        return; // No migrations needed
      }
      
      const pendingMigrations = this.migrations.filter(m => m.version > currentVersion);
      
      for (const migration of pendingMigrations) {
        console.log(`Running migration to version ${migration.version}`);
        
        // Get all app data
        const keys = Object.keys(localStorage);
        const appKeys = keys.filter(key => key.startsWith(this.prefix) && !key.endsWith(this.versionKey));
        
        for (const fullKey of appKeys) {
          const key = fullKey.replace(this.prefix, '');
          const data = await this.load(key);
          
          if (data !== null) {
            const migratedData = migration.migrate(data);
            await this.save(key, migratedData);
          }
        }
      }
      
      // Update version
      await this.save(this.versionKey, this.currentVersion);
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw new StorageError('Data migration failed', 'MIGRATION_FAILED', error as Error);
    }
  }

  /**
   * Backup all application data
   */
  async exportData(): Promise<string> {
    try {
      this.checkStorageAvailability();
      
      const backup: Record<string, unknown> = {};
      const keys = Object.keys(localStorage);
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      
      for (const fullKey of appKeys) {
        const key = fullKey.replace(this.prefix, '');
        const data = localStorage.getItem(fullKey);
        if (data) {
          backup[key] = JSON.parse(data);
        }
      }
      
      backup._exportDate = new Date().toISOString();
      backup._version = this.currentVersion;
      
      return JSON.stringify(backup, null, 2);
      
    } catch (error) {
      throw new StorageError('Failed to export data', 'EXPORT_FAILED', error as Error);
    }
  }

  /**
   * Restore data from backup
   */
  async importData(backupData: string): Promise<void> {
    try {
      this.checkStorageAvailability();
      
      const backup = JSON.parse(backupData);
      
      // Validate backup format
      if (!backup._exportDate || !backup._version) {
        throw new StorageError('Invalid backup format', 'INVALID_BACKUP');
      }
      
      // Clear existing data
      await this.clear();
      
      // Restore data
      for (const [key, value] of Object.entries(backup)) {
        if (!key.startsWith('_')) { // Skip metadata
          await this.save(key, value);
        }
      }
      
      // Run migrations if needed
      await this.runMigrations();
      
    } catch (error) {
      const err = error as Error;
      
      if (err instanceof StorageError) {
        throw err;
      }
      
      throw new StorageError('Failed to import data', 'IMPORT_FAILED', err);
    }
  }
}

export default new StorageService();