import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Professional debounce utility for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Professional throttle utility for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Professional format currency utility
 */
export function formatCurrency(
  amount: number,
  currency: string = 'SAR',
  locale: string = 'ar-SA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Professional format date utility
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale: string = 'ar-SA'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Professional relative time utility
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'ar-SA'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 60) {
    return `منذ ${diffMinutes} دقيقة`;
  } else if (diffHours < 24) {
    return `منذ ${diffHours} ساعة`;
  } else if (diffDays === 1) {
    return 'منذ يوم واحد';
  } else if (diffDays < 7) {
    return `منذ ${diffDays} أيام`;
  } else if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7);
    return `منذ ${weeks} أسبوع`;
  } else {
    const months = Math.ceil(diffDays / 30);
    return `منذ ${months} شهر`;
  }
}

/**
 * Professional number formatting utility
 */
export function formatNumber(
  num: number,
  locale: string = 'ar-SA',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, options).format(num);
}

/**
 * Professional file size formatting utility
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Professional validation utilities
 */
export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^(\+966|966|0)?5[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },
  
  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
    }
    if (!/\d/.test(password)) {
      errors.push('يجب أن تحتوي على رقم واحد على الأقل');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
  
  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },
};

/**
 * Professional array utilities
 */
export const arrayUtils = {
  chunk: <T>(array: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  },
  
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },
  
  groupBy: <T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
    return array.reduce((groups, item) => {
      const group = key(item);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  },
  
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },
};

/**
 * Professional object utilities
 */
export const objectUtils = {
  pick: <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },
  
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },
  
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (Array.isArray(obj)) return obj.map(item => objectUtils.deepClone(item)) as any;
    if (Object.prototype.toString.call(obj) === '[object Object]') {
      const clonedObj: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = objectUtils.deepClone((obj as Record<string, any>)[key]);
        }
      }
      return clonedObj as T;
    }
    return obj;
  },
};

/**
 * Professional string utilities
 */
export const stringUtils = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  truncate: (str: string, length: number, suffix: string = '...'): string => {
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },
  
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  generateId: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};

/**
 * Professional URL utilities
 */
export const urlUtils = {
  getQueryParams: (url: string): Record<string, string> => {
    const params = new URLSearchParams(url.split('?')[1] || '');
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },
  
  setQueryParams: (url: string, params: Record<string, string>): string => {
    const urlObj = new URL(url, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
    return urlObj.toString();
  },
  
  removeQueryParams: (url: string, params: string[]): string => {
    const urlObj = new URL(url, window.location.origin);
    params.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  },
};

/**
 * Professional storage utilities
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Professional async utilities
 */
export const asyncUtils = {
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  retry: async <T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await asyncUtils.delay(delay);
        return asyncUtils.retry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  },
  
  timeout: <T>(promise: Promise<T>, ms: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
      ),
    ]);
  },
};

/**
 * Professional DOM utilities
 */
export const domUtils = {
  scrollToTop: (behavior: ScrollBehavior = 'smooth'): void => {
    window.scrollTo({ top: 0, behavior });
  },
  
  scrollToElement: (element: HTMLElement, offset: number = 0): void => {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
  },
  
  isInViewport: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  },
};

/**
 * Professional error handling utilities
 */
export const errorUtils = {
  isError: (error: any): error is Error => {
    return error instanceof Error;
  },
  
  getErrorMessage: (error: any): string => {
    if (errorUtils.isError(error)) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'حدث خطأ غير متوقع';
  },
  
  logError: (error: any, context?: string): void => {
    console.error(`[${context || 'App'}] Error:`, error);
    // In production, you might want to send this to an error tracking service
  },
};

/**
 * Professional performance utilities
 */
export const performanceUtils = {
  measureTime: <T>(fn: () => T): { result: T; time: number } => {
    const start = performance.now();
    const result = fn();
    const time = performance.now() - start;
    return { result, time };
  },
  
  measureTimeAsync: async <T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> => {
    const start = performance.now();
    const result = await fn();
    const time = performance.now() - start;
    return { result, time };
  },
};

/**
 * Professional type guards
 */
export const typeGuards = {
  isString: (value: any): value is string => typeof value === 'string',
  isNumber: (value: any): value is number => typeof value === 'number' && !isNaN(value),
  isBoolean: (value: any): value is boolean => typeof value === 'boolean',
  isFunction: (value: any): value is Function => typeof value === 'function',
  isObject: (value: any): value is object => typeof value === 'object' && value !== null,
  isArray: (value: any): value is any[] => Array.isArray(value),
  isDate: (value: any): value is Date => value instanceof Date,
  isRegExp: (value: any): value is RegExp => value instanceof RegExp,
  isPromise: (value: any): value is Promise<any> => value instanceof Promise,
}; 