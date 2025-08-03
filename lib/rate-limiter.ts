interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RequestRecord {
  timestamp: number;
  count: number;
}

class RateLimiter {
  private requests: Map<string, RequestRecord[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Too many requests. Please wait before trying again.',
      ...config,
    };
  }

  isAllowed(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get existing requests for this identifier
    let userRequests = this.requests.get(identifier) || [];
    
    // Remove expired requests
    userRequests = userRequests.filter(req => req.timestamp > windowStart);
    
    // Count total requests in current window
    const totalRequests = userRequests.reduce((sum, req) => sum + req.count, 0);
    
    if (totalRequests >= this.config.maxRequests) {
      // Find the oldest request to determine reset time
      const oldestRequest = userRequests[0];
      const resetTime = oldestRequest ? oldestRequest.timestamp + this.config.windowMs : now + this.config.windowMs;
      
      return {
        allowed: false,
        resetTime,
        remaining: 0,
      };
    }
    
    // Add current request
    userRequests.push({ timestamp: now, count: 1 });
    this.requests.set(identifier, userRequests);
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - totalRequests - 1,
    };
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(req => req.timestamp > windowStart);
    const totalRequests = validRequests.reduce((sum, req) => sum + req.count, 0);
    
    return Math.max(0, this.config.maxRequests - totalRequests);
  }

  getResetTime(identifier: string): number | null {
    const userRequests = this.requests.get(identifier);
    if (!userRequests || userRequests.length === 0) {
      return null;
    }
    
    const oldestRequest = userRequests[0];
    return oldestRequest.timestamp + this.config.windowMs;
  }

  clear(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

// Create rate limiter instances for different use cases
export const apiRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
  message: 'Too many API requests. Please wait a minute before trying again.',
});

export const userRateLimiter = new RateLimiter({
  maxRequests: 50,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Hourly limit reached. Please try again later.',
});