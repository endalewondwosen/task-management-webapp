# Accessing Local Dev Server from Other Devices

## Your Local IP Address
**192.168.100.55**

## Quick Setup

### 1. Start Backend API
```bash
cd d:\task-management-api
npm run dev
```
API will be available at: `http://192.168.100.55:4000`

### 2. Start Frontend
```bash
cd d:\task-management-webapp
npm run dev
```
Frontend will be available at: `http://192.168.100.55:5173`

### 3. Access from Other Devices

#### From Your Phone:
1. Make sure phone is on the **same WiFi network**
2. Open browser on phone
3. Go to: `http://192.168.100.55:5173`
4. You should see the login page!

#### From Another PC:
1. Make sure PC is on the **same network**
2. Open browser
3. Go to: `http://192.168.100.55:5173`

## Testing Session Management

### Scenario: Test "Revoke All Others"

1. **On Your Main PC:**
   - Login at `http://192.168.100.55:5173`
   - Go to Sessions page
   - You'll see your current session

2. **On Your Phone:**
   - Open browser
   - Go to `http://192.168.100.55:5173`
   - Login with same credentials
   - Now you have 2 active sessions!

3. **Back on Main PC:**
   - Go to Sessions page
   - You'll see 2 sessions:
     - Current session (Main PC)
     - Other session (Phone)
   - Click "Revoke All Others"
   - Phone session is revoked!

4. **On Phone:**
   - Try to refresh or make any request
   - Phone will be logged out immediately ✅

## Important Notes

### Same Network Required
- All devices must be on the **same WiFi network**
- Cannot access from different networks (like mobile data)

### Firewall
- Windows Firewall might block connections
- If it doesn't work, allow ports 4000 and 5173 in Windows Firewall

### API URL Configuration
The frontend is configured to use:
- Local: `http://localhost:4000/api`
- Network: You may need to update `.env` file

### Update Frontend API URL (if needed)

Create/update `.env` file in `d:\task-management-webapp`:
```env
VITE_API_URL=http://192.168.100.55:4000/api
```

Or use environment variable detection:
```env
# For local development
VITE_API_URL=http://localhost:4000/api

# For network access (uncomment when needed)
# VITE_API_URL=http://192.168.100.55:4000/api
```

## Troubleshooting

### Can't Access from Phone

1. **Check Network:**
   - Phone and PC on same WiFi? ✅
   - Check phone's WiFi IP (should be similar: 192.168.100.x)

2. **Check Firewall:**
   ```powershell
   # Allow ports in Windows Firewall
   netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
   netsh advfirewall firewall add rule name="API Server" dir=in action=allow protocol=TCP localport=4000
   ```

3. **Check if Servers are Running:**
   - Backend: `http://192.168.100.55:4000/health`
   - Frontend: `http://192.168.100.55:5173`

4. **Check Browser Console:**
   - Open DevTools on phone (if possible)
   - Check for CORS errors
   - Check network requests

### CORS Errors

If you see CORS errors, the backend CORS is already configured to allow:
- `http://192.168.100.55:5173`
- Any IP in the 192.168.x.x range

### API Connection Issues

If frontend can't connect to API:
1. Check API is running: `http://192.168.100.55:4000/health`
2. Update `.env` file with correct API URL
3. Restart frontend dev server

## Alternative: Use ngrok (For Testing from Different Networks)

If you want to test from a different network (like mobile data):

1. Install ngrok: https://ngrok.com/
2. Start your servers locally
3. Create tunnel:
   ```bash
   ngrok http 5173
   ```
4. Use the ngrok URL on your phone (works from any network)

## Quick Test Checklist

- [ ] Backend running on `http://192.168.100.55:4000`
- [ ] Frontend running on `http://192.168.100.55:5173`
- [ ] Can access from main PC: `http://192.168.100.55:5173`
- [ ] Can access from phone: `http://192.168.100.55:5173`
- [ ] Can login from both devices
- [ ] Can see both sessions in Sessions page
- [ ] Can revoke sessions from one device
- [ ] Revoked device gets logged out

## Your Current Setup

- **Local IP**: 192.168.100.55
- **Frontend Port**: 5173
- **Backend Port**: 4000
- **Frontend URL**: http://192.168.100.55:5173
- **Backend URL**: http://192.168.100.55:4000
- **API Endpoint**: http://192.168.100.55:4000/api

Happy testing! 🎉

