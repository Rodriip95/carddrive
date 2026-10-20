import type { LearningProgress } from '../domain/learning';
import { validateLearningProgress } from '../domain/validation';

export const PROGRESS_SCHEMA_VERSION = 1;
const STORAGE_KEY = 'a-conducir:learning-progress';

export interface ProgressRepository {
  load(): ProgressLoadResult;
  save(progress: LearningProgress): boolean;
  reset(): boolean;
}

export type ProgressLoadStatus = 'empty' | 'loaded' | 'migrated' | 'invalid' | 'unsupported' | 'unavailable';

export interface ProgressLoadResult {
  progress: LearningProgress;
  status: ProgressLoadStatus;
}

interface ProgressEnvelope {
  schemaVersion: number;
  progress: LearningProgress;
}

const emptyProgress = (): LearningProgress => ({ modules: [] });

export class LocalStorageProgressRepository implements ProgressRepository {
  load(): ProgressLoadResult {
    const storage = this.getStorage();
    if (!storage) return { progress: emptyProgress(), status: 'unavailable' };

    let storedValue: string | null;
    try {
      storedValue = storage.getItem(STORAGE_KEY);
    } catch {
      return { progress: emptyProgress(), status: 'unavailable' };
    }
    if (storedValue === null) return { progress: emptyProgress(), status: 'empty' };

    let parsed: unknown;
    try {
      parsed = JSON.parse(storedValue);
    } catch {
      return this.discardInvalid(storage);
    }

    if (this.isEnvelope(parsed)) {
      if (parsed.schemaVersion !== PROGRESS_SCHEMA_VERSION) {
        return { progress: emptyProgress(), status: 'unsupported' };
      }
      const validation = validateLearningProgress(parsed.progress);
      if (validation.valid && validation.value) return { progress: validation.value, status: 'loaded' };
      return this.discardInvalid(storage);
    }

    const migration = validateLearningProgress(parsed);
    if (!migration.valid || !migration.value) return this.discardInvalid(storage);
    try {
      this.write(storage, migration.value);
      return { progress: migration.value, status: 'migrated' };
    } catch {
      return { progress: migration.value, status: 'unavailable' };
    }
  }

  save(progress: LearningProgress): boolean {
    const storage = this.getStorage();
    if (!storage || !validateLearningProgress(progress).valid) return false;

    try {
      this.write(storage, progress);
      return true;
    } catch {
      return false;
    }
  }

  reset(): boolean {
    const storage = this.getStorage();
    if (!storage) return false;

    try {
      storage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  private getStorage(): Storage | null {
    try {
      return typeof window === 'undefined' ? null : window.localStorage;
    } catch {
      return null;
    }
  }

  private isEnvelope(value: unknown): value is ProgressEnvelope {
    return typeof value === 'object' && value !== null && 'schemaVersion' in value && 'progress' in value;
  }

  private write(storage: Storage, progress: LearningProgress) {
    const envelope: ProgressEnvelope = { schemaVersion: PROGRESS_SCHEMA_VERSION, progress };
    storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  }

  private discardInvalid(storage: Storage): ProgressLoadResult {
    try {
      storage.removeItem(STORAGE_KEY);
      return { progress: emptyProgress(), status: 'invalid' };
    } catch {
      return { progress: emptyProgress(), status: 'unavailable' };
    }
  }
}
