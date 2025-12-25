# Quick Network Access Setup

## Your Local IP Address
**192.168.100.55**

## Step-by-Step Instructions

### 1. Start Backend Server
```bash
cd d:\task-management-api
npm run dev
```

**You'll see:**
```
🚀 Server ready at http://localhost:4000
🌐 Network access: http://192.168.100.55:4000
```

### 2. Start Frontend Server
```bash
cd d:\task-management-webapp
npm run dev
```

**You'll see:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.100.55:5173/
```

### 3. Access from Your Phone

1. **Make sure your phone is on the same WiFi network**
2. **Open browser on phone**
3. **Go to:** `http://192.168.100.55:5173`
4. **You should see the login page!**

### 4. Test Session Management

#### Login from Multiple Devices:

1. **Main PC:** Login at `http://192.168.100.55:5173`
2. **Phone:** Login at `http://192.168.100.55:5173` (same credentials)
3. **Go to Sessions page** on either device
4. **You'll see 2 active sessions!**
5. **Click "Revoke All Others"** on one device
6. **The other device will be logged out immediately!** ✅

## How It Works

### Auto-Detection
The frontend automatically detects if you're accessing via:
- **localhost** → Uses `http://localhost:4000/api`
- **IP address** (192.168.100.55) → Uses `http://192.168.100.55:4000/api`

No configuration needed! 🎉

### Manual Override (Optional)

If you need to override, create `.env.local` file:
```env
VITE_API_URL=http://192.168.100.55:4000/api
```

## Troubleshooting

### Can't Access from Phone?

1. **Check WiFi:** Phone and PC must be on same network
2. **Check Firewall:** Windows might block connections
   ```powershell
   # Allow ports (run as Administrator)
   netsh advfirewall firewall add rule name="Vite" dir=in action=allow protocol=TCP localport=5173
   netsh advfirewall firewall add rule name="API" dir=in action=allow protocol=TCP localport=4000
   ```
3. **Test Backend:** Open `http://192.168.100.55:4000/health` on phone
4. **Test Frontend:** Open `http://192.168.100.55:5173` on phone

### CORS Errors?

Already configured! The backend allows:
- `http://localhost:5173`
- `http://192.168.100.55:5173`
- Any IP in `192.168.x.x` range

## URLs Summary

| Service | Local | Network |
|---------|-------|---------|
| **Frontend** | http://localhost:5173 | http://192.168.100.55:5173 |
| **Backend** | http://localhost:4000 | http://192.168.100.55:4000 |
| **API** | http://localhost:4000/api | http://192.168.100.55:4000/api |

## Testing Checklist

- [ ] Backend running and accessible
- [ ] Frontend running and accessible
- [ ] Can access from phone browser
- [ ] Can login from phone
- [ ] Can see multiple sessions
- [ ] Can revoke sessions
- [ ] Revoked device gets logged out

Ready to test! 🚀

