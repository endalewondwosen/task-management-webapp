# Token & Session Management Concepts Explained

## Table of Contents
1. [Refresh Tokens with Automatic Rotation](#refresh-tokens-with-automatic-rotation)
2. [Session Revocation](#session-revocation)
3. [Automatic Token Refresh](#automatic-token-refresh)

---

## 1. Refresh Tokens with Automatic Rotation

### What is a Refresh Token?

A **refresh token** is a long-lived credential (7-30 days) used to obtain new access tokens without requiring the user to log in again.

### The Problem It Solves

**Without Refresh Tokens:**
```
User logs in → Gets access token (15 minutes)
After 15 minutes → Token expires → User must log in again ❌
```

**With Refresh Tokens:**
```
User logs in → Gets access token (15 min) + refresh token (7 days)
After 15 minutes → Access token expires
→ System automatically uses refresh token to get new access token
→ User stays logged in seamlessly ✅
```

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Logs In                                         │
│    ├─ Server creates:                                  │
│    │  • Access Token (15 min) - for API requests      │
│    │  • Refresh Token (7 days) - stored in cookie     │
│    └─ Both sent to client                              │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 2. User Makes API Request                               │
│    ├─ Access token in Authorization header             │
│    └─ Server validates token                           │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 3. After 15 Minutes - Access Token Expires              │
│    ├─ API request fails with 401 Unauthorized          │
│    └─ Frontend detects 401 error                       │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Automatic Token Refresh                               │
│    ├─ Frontend sends refresh token (from cookie)       │
│    ├─ Server validates refresh token                   │
│    ├─ Server generates NEW access token                │
│    ├─ Server generates NEW refresh token (ROTATION)    │
│    └─ Old refresh token is invalidated                 │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Retry Original Request                                │
│    ├─ New access token used                             │
│    └─ Request succeeds                                  │
└─────────────────────────────────────────────────────────┘
```

### What is Token Rotation?

**Token Rotation** means that every time you use a refresh token, you get a **new** refresh token, and the old one becomes invalid.

#### Why Rotate Tokens?

**Without Rotation (Security Risk):**
```
1. User gets refresh token: "abc123"
2. Attacker steals "abc123"
3. Attacker can use it forever until it expires (7 days) ❌
4. User can't revoke it
```

**With Rotation (Secure):**
```
1. User gets refresh token: "abc123"
2. User uses it → Gets new token: "xyz789", "abc123" is invalidated
3. If attacker stole "abc123", it's already invalid ✅
4. Only the latest token works
```

### Example Flow

```typescript
// Initial Login
POST /api/auth/login
Response: {
  token: "access_token_abc",      // 15 min
  refreshToken: "refresh_xyz"     // 7 days (in cookie)
}

// After 15 minutes, access token expires
GET /api/tasks
Response: 401 Unauthorized

// Automatic refresh
POST /api/auth/refresh
Cookie: refreshToken=refresh_xyz
Response: {
  token: "access_token_new",      // New 15 min token
  // New refresh token in cookie: "refresh_abc" (old "xyz" invalidated)
}

// Retry original request
GET /api/tasks
Authorization: Bearer access_token_new
Response: 200 OK (tasks data)
```

### Benefits

✅ **Security**: If a refresh token is stolen, it can only be used once  
✅ **Detection**: Unauthorized use is immediately detected  
✅ **Revocation**: Old tokens become invalid automatically  
✅ **User Experience**: Seamless, no frequent logins

---

## 2. Session Revocation

### What is Session Revocation?

**Session Revocation** is the ability to immediately invalidate a user's login session, logging them out instantly.

### Why It's Important

**Without Session Revocation:**
```
1. User logs in on their phone
2. Phone gets stolen
3. Attacker has access until token expires (7 days) ❌
4. User can't do anything about it
```

**With Session Revocation:**
```
1. User logs in on their phone
2. Phone gets stolen
3. User goes to Sessions page on computer
4. User revokes phone session
5. Phone is logged out immediately ✅
```

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│ User Has Multiple Sessions                              │
│                                                          │
│ 1. Desktop (Chrome) - Session ID: "abc123"             │
│ 2. Mobile (Safari) - Session ID: "xyz789"              │
│ 3. Tablet (Chrome) - Session ID: "def456"             │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ User Notices Suspicious Activity                        │
│ Goes to /sessions page                                  │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ User Clicks "Revoke" on Mobile Session                  │
│ DELETE /api/auth/sessions/xyz789                        │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Backend:                                                │
│ 1. Finds session "xyz789" in database                  │
│ 2. Deletes session record                               │
│ 3. Refresh token "xyz789" is now invalid               │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Next Time Mobile Tries to Refresh Token:                │
│ POST /api/auth/refresh                                  │
│ Cookie: refreshToken=xyz789                             │
│                                                          │
│ Server: Session not found → 401 Unauthorized            │
│ Mobile: Logged out immediately ✅                        │
└─────────────────────────────────────────────────────────┘
```

### Types of Revocation

#### 1. Revoke Single Session
```typescript
// User revokes one specific device
DELETE /api/auth/sessions/:sessionId

// Example: Revoke mobile session
DELETE /api/auth/sessions/xyz789
```

#### 2. Revoke All Other Sessions
```typescript
// Keep current session, revoke all others
DELETE /api/auth/sessions/revoke-others

// Useful when:
// - User notices suspicious activity
// - User wants to log out from all devices except current
```

#### 3. Revoke All Sessions (Logout)
```typescript
// Revoke current session (logout)
POST /api/auth/logout

// Revokes the session you're currently using
```

### Implementation Details

**Database:**
```sql
-- When session is revoked
DELETE FROM "Session" WHERE id = 'xyz789';

-- Next refresh attempt
SELECT * FROM "Session" WHERE refreshToken = 'hashed_token';
-- Returns: No rows (session doesn't exist)
-- Result: 401 Unauthorized
```

**Frontend:**
```typescript
// User clicks "Revoke Session"
const revokeSession = async (sessionId: string) => {
  await api.delete(`/auth/sessions/${sessionId}`);
  // Session is immediately invalid
  // That device will be logged out on next refresh attempt
};
```

### Use Cases

1. **Lost/Stolen Device**: Revoke session immediately
2. **Suspicious Activity**: See unknown device, revoke it
3. **Security Audit**: Review all active sessions
4. **Account Compromise**: Revoke all sessions, change password
5. **Device Upgrade**: Revoke old device sessions

### Benefits

✅ **Immediate Control**: Log out devices instantly  
✅ **Security**: Prevent unauthorized access  
✅ **Transparency**: See all logged-in devices  
✅ **Peace of Mind**: Know where you're logged in

---

## 3. Automatic Token Refresh

### What is Automatic Token Refresh?

**Automatic Token Refresh** is the process where the frontend automatically obtains a new access token when the current one expires, without user interaction.

### The Problem It Solves

**Without Automatic Refresh:**
```
1. User is working on tasks
2. Access token expires (15 minutes)
3. Next API request fails with 401
4. User sees error message
5. User must manually refresh page or log in again ❌
```

**With Automatic Refresh:**
```
1. User is working on tasks
2. Access token expires (15 minutes)
3. Next API request fails with 401
4. System automatically gets new token
5. Request retries and succeeds
6. User doesn't notice anything ✅
```

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│ User Makes API Request                                  │
│ GET /api/tasks                                          │
│ Authorization: Bearer expired_token                     │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Server Response: 401 Unauthorized                       │
│ "Token expired"                                         │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Frontend Interceptor Detects 401                        │
│                                                          │
│ if (error.response?.status === 401) {                  │
│   // Don't retry login/refresh endpoints                │
│   if (isLoginRequest) return reject(error);             │
│                                                          │
│   // Check if already refreshing                        │
│   if (isRefreshing) {                                    │
│     // Queue this request                               │
│     return queueRequest();                              │
│   }                                                     │
│                                                          │
│   // Start refresh process                              │
│   isRefreshing = true;                                  │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Automatic Refresh Request                                │
│ POST /api/auth/refresh                                   │
│ Cookie: refreshToken=xyz789 (httpOnly)                  │
│                                                          │
│ Server:                                                  │
│ 1. Validates refresh token                               │
│ 2. Rotates refresh token (new one)                      │
│ 3. Generates new access token                           │
│ 4. Returns new tokens                                   │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Frontend Receives New Token                             │
│                                                          │
│ localStorage.setItem('token', newAccessToken);          │
│                                                          │
│ // Update original request                              │
│ originalRequest.headers.Authorization =                  │
│   `Bearer ${newAccessToken}`;                           │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Retry Original Request                                   │
│ GET /api/tasks                                           │
│ Authorization: Bearer newAccessToken                    │
│                                                          │
│ Server: 200 OK (tasks data) ✅                          │
└─────────────────────────────────────────────────────────┘
```

### Request Queuing

When multiple requests fail simultaneously, they're queued:

```
Request 1 (GET /api/tasks) → 401
Request 2 (GET /api/projects) → 401
Request 3 (GET /api/users) → 401
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ All requests detect 401                                 │
│                                                          │
│ Request 1: Starts refresh process                       │
│ Request 2: Sees refresh in progress → Queued           │
│ Request 3: Sees refresh in progress → Queued            │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Refresh Completes                                        │
│                                                          │
│ Request 1: Retries with new token                       │
│ Request 2: Gets new token from queue → Retries          │
│ Request 3: Gets new token from queue → Retries          │
└─────────────────────────────────────────────────────────┘
```

### Code Implementation

```typescript
// Axios Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If 401 and not a login/refresh request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }
      
      // Start refresh
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Get new token
        const response = await axios.post('/auth/refresh', {}, {
          withCredentials: true // Include refresh token cookie
        });
        
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Process queued requests
        processQueue(null, token);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - logout
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
```

### Edge Cases Handled

1. **Multiple Simultaneous Requests**
   - Only one refresh request is made
   - Other requests are queued
   - All retry after refresh completes

2. **Refresh Token Expired**
   - Refresh request fails
   - User is logged out
   - Redirected to login page

3. **Login/Refresh Endpoints**
   - Don't retry these endpoints
   - Prevent infinite loops

4. **Network Errors**
   - Refresh attempt fails
   - Original error is returned
   - User sees appropriate error message

### Benefits

✅ **Seamless UX**: User never notices token expiration  
✅ **No Interruptions**: Work continues without breaks  
✅ **Efficient**: Only one refresh for multiple requests  
✅ **Secure**: Tokens still expire, just auto-renewed

---

## Summary Comparison

| Feature | Without | With |
|---------|---------|------|
| **Token Expiration** | User must log in every 15 min | Auto-refreshed, seamless |
| **Stolen Token** | Valid until expiration | Can be revoked immediately |
| **Multiple Devices** | Can't see or control | View and revoke any device |
| **Security** | Limited control | Full control and visibility |
| **User Experience** | Frequent interruptions | Smooth, uninterrupted |

---

## Real-World Analogy

Think of it like a **hotel key card system**:

### Refresh Tokens = Long-Term Pass
- You get a 7-day pass (refresh token)
- You use it to get daily room keys (access tokens)
- Each day you get a new key, but the pass stays the same
- If pass is stolen, hotel can revoke it immediately

### Automatic Refresh = Automatic Key Renewal
- Your room key expires at midnight (access token expires)
- Hotel automatically gives you a new key (auto-refresh)
- You don't have to go to front desk (no user action)
- You can keep using your room seamlessly

### Session Revocation = Canceling Access
- You lost your phone with the hotel app (stolen device)
- You call hotel to cancel that device's access (revoke session)
- That device can't get new keys anymore (logged out)
- Your other devices still work (other sessions active)

---

This system provides **security** (short-lived tokens, revocation) with **convenience** (automatic refresh, no interruptions).

---

## 4. What Happens When Refresh Token Expires?

### The 7-Day Lifecycle

```
Day 1: User logs in
├─ Access Token: Expires in 15 minutes
└─ Refresh Token: Expires in 7 days

Day 1-7: User actively using the app
├─ Access tokens expire every 15 minutes
├─ Refresh token automatically gets new access tokens
└─ Refresh token is rotated on each use
    └─ Expiration date stays at 7 days from login

Day 7: Refresh token is about to expire
├─ Last refresh token expires at end of day 7
└─ User is still logged in (if active)

Day 8: Refresh token has expired
└─ What happens next? (See below)
```

### What Happens on Day 8?

#### Scenario 1: User is Active (Using the App)

```
┌─────────────────────────────────────────────────────────┐
│ Day 8 - User Makes API Request                          │
│ GET /api/tasks                                           │
│ Authorization: Bearer expired_access_token              │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Server: 401 Unauthorized (Access token expired)         │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Frontend: Tries to Refresh Token                        │
│ POST /api/auth/refresh                                   │
│ Cookie: refreshToken=expired_refresh_token              │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Server Checks Refresh Token:                             │
│                                                          │
│ SELECT * FROM "Session"                                  │
│ WHERE refreshToken = 'hashed_token'                     │
│ AND expiresAt > NOW()                                    │
│                                                          │
│ Result: No rows found (expired) ❌                       │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Server Response: 401 Unauthorized                        │
│ "Refresh token expired"                                  │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Frontend: Refresh Failed                                 │
│                                                          │
│ 1. Clear access token from localStorage                  │
│ 2. Clear refresh token cookie (if possible)              │
│ 3. Redirect to login page                                │
│ 4. Show message: "Your session has expired.              │
│    Please log in again."                                 │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ User Must Log In Again                                   │
│                                                          │
│ - Enter email and password                               │
│ - Get new access token (15 min)                          │
│ - Get new refresh token (7 days)                         │
│ - Session starts fresh                                   │
└─────────────────────────────────────────────────────────┘
```

#### Scenario 2: User is Inactive (Not Using the App)

```
Day 8: Refresh token expires
└─ Nothing happens immediately (user isn't using the app)

Day 9: User returns to the app
├─ Opens browser/app
├─ Tries to load data
└─ Same flow as Scenario 1
    └─ Must log in again
```

### Code Implementation

**Backend - Refresh Token Validation:**
```typescript
export async function validateRefreshToken(token: string) {
  // Find session with this token
  const sessions = await prisma.session.findMany({
    where: {
      expiresAt: {
        gt: new Date(), // Only not-expired sessions
      },
    },
  });

  // Check if token matches
  for (const session of sessions) {
    const isValid = await compare(token, session.refreshToken);
    if (isValid) {
      return { sessionId: session.id, userId: session.userId };
    }
  }

  // Token expired or invalid
  return null; // ❌ Expired
}
```

**Frontend - Handling Expired Refresh Token:**
```typescript
// In API interceptor
try {
  // Try to refresh
  const response = await axios.post('/auth/refresh', {}, {
    withCredentials: true
  });
  
  // Success - got new tokens
  const { token } = response.data;
  localStorage.setItem('token', token);
  
} catch (refreshError) {
  // Refresh failed - token expired
  if (refreshError.response?.status === 401) {
    // Clear everything
    localStorage.removeItem('token');
    
    // Redirect to login
    window.location.href = '/login';
    
    // Optional: Show message
    toast.error('Your session has expired. Please log in again.');
  }
}
```

### Remember Me Extension

If user checked "Remember Me" during login:

```
Normal Session: 7 days
Remember Me: 30 days

Day 8 (Normal): Must log in again
Day 31 (Remember Me): Must log in again
```

### Automatic Cleanup

**Backend Cleanup Job (Optional):**
```typescript
// Run periodically (e.g., daily cron job)
export async function cleanupExpiredSessions() {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(), // Expired sessions
      },
    },
  });
  
  console.log(`Cleaned up ${result.count} expired sessions`);
}
```

### User Experience Flow

```
┌─────────────────────────────────────────────────────────┐
│ Day 1-7: Seamless Experience                            │
│                                                          │
│ ✅ Access tokens auto-refresh                           │
│ ✅ No interruptions                                     │
│ ✅ User doesn't notice token expiration                 │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Day 8: Session Expires                                  │
│                                                          │
│ ⚠️ User makes request                                    │
│ ⚠️ Refresh token expired                                 │
│ ⚠️ Redirected to login page                             │
│                                                          │
│ Message: "Your session has expired.                      │
│           Please log in again."                          │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ User Logs In Again                                       │
│                                                          │
│ ✅ New 7-day session starts                             │
│ ✅ All data loads normally                              │
│ ✅ User continues working                                │
└─────────────────────────────────────────────────────────┘
```

### Why 7 Days?

**Security vs. Convenience Balance:**

| Duration | Security | Convenience |
|----------|----------|------------|
| 1 day | Very Secure | Frequent logins |
| 7 days | Good Balance | ✅ Recommended |
| 30 days | Less Secure | Very Convenient |
| 90 days | Risky | Too Convenient |

**7 days is optimal because:**
- ✅ Long enough for normal usage patterns
- ✅ Short enough to limit exposure if compromised
- ✅ Forces periodic re-authentication
- ✅ Industry standard

### Best Practices

1. **Show Warning Before Expiration**
   ```typescript
   // Check if session expires soon
   if (sessionExpiresIn < 24 hours) {
     showWarning("Your session expires soon. Consider logging in again.");
   }
   ```

2. **Graceful Logout**
   ```typescript
   // Don't just redirect - save user's work
   if (refreshTokenExpired) {
     // Save draft data
     saveDraftData();
     
     // Show friendly message
     toast.info("Session expired. Redirecting to login...");
     
     // Redirect
     setTimeout(() => {
       window.location.href = '/login';
     }, 2000);
   }
   ```

3. **Remember User's Last Location**
   ```typescript
   // Before redirecting to login
   localStorage.setItem('redirectAfterLogin', window.location.pathname);
   
   // After login
   const redirectTo = localStorage.getItem('redirectAfterLogin');
   navigate(redirectTo || '/dashboard');
   ```

### Summary

**After 7 Days:**
1. ✅ Refresh token expires
2. ✅ Next API request fails
3. ✅ Auto-refresh attempt fails
4. ✅ User is redirected to login
5. ✅ User must log in again
6. ✅ New 7-day session starts

**This is by design:**
- 🔒 Security: Limits exposure time
- 🔄 Forces periodic re-authentication
- ✅ Prevents indefinite access
- ✅ Industry best practice

**With "Remember Me":**
- Same process, but after 30 days instead of 7

