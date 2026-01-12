# 🚀 API Service - Quick Guide

Professional Production-Level API Service for your project!

---

## 📁 Project Structure

```
src/api/
├── ApiService.js          ⭐ Main API Service (Use this!)
├── axiosInstance.js       🔧 Axios configuration
├── httpEndpoints.js       📍 All API endpoints
├── httpMethods.js         📝 HTTP methods constants
├── authService.js         🔐 Authentication APIs
├── userService.js         👤 User management APIs
├── tradeService.js        💼 Trade APIs
├── reflectionService.js   📊 Reflection APIs
└── README.md             📖 This file
```

---

## 🚀 Quick Start

### Import করুন:
```javascript
import api from './api/ApiService';
```

---

## ✨ Features

- ✅ **GET, POST, PUT, PATCH, DELETE** - সব HTTP methods
- ✅ **File Upload/Download** - Progress tracking সহ
- ✅ **Request Cancellation** - Search এর জন্য perfect
- ✅ **Retry Logic** - Auto retry on failure
- ✅ **Caching** - দ্রুত লোড করার জন্য
- ✅ **Batch Requests** - Multiple requests একসাথে
- ✅ **Error Handling** - Automatic
- ✅ **Toast Messages** - Automatic success/error messages

---

## 📖 Basic Usage

### 1️⃣ GET Request
```javascript
// Simple GET
const response = await api.get('/api/users');

// GET with params
const response = await api.get('/api/users', {
  params: { page: 1, limit: 10 }
});

// GET with cache (5 min)
const response = await api.get('/api/dashboard', { cache: true });
```

### 2️⃣ POST Request
```javascript
// Create new data
const response = await api.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
// ✅ Auto shows success toast

// POST without toast
const response = await api.post('/api/auth/login', data, {
  showToast: false
});
```

### 3️⃣ PUT & PATCH Request
```javascript
// PUT - Full update
const response = await api.put(`/api/users/${id}`, userData);

// PATCH - Partial update
const response = await api.patch(`/api/users/${id}`, { name: 'New Name' });
```

### 4️⃣ DELETE Request
```javascript
const response = await api.delete(`/api/users/${id}`);
// ✅ Auto shows "Successfully deleted" toast
```

### 5️⃣ File Upload
```javascript
// Simple upload
const response = await api.uploadFile('/api/upload', file, 'photo');

// Upload with progress
const response = await api.uploadFile('/api/upload', file, 'photo', {
  onProgress: (percent) => console.log(`${percent}%`)
});
```

### 6️⃣ File Download
```javascript
await api.downloadFile('/api/report', 'report.pdf');
```

### 7️⃣ Batch Requests
```javascript
const results = await api.batchRequests([
  { method: 'get', url: '/api/users' },
  { method: 'get', url: '/api/posts' }
]);
```

### 8️⃣ Request with Retry
```javascript
const response = await api.requestWithRetry('get', '/api/data', null, {
  retries: 3,
  retryDelay: 2000
});
```

### 9️⃣ Request Cancellation (for Search)
```javascript
const token = api.getCancelToken('search');
await api.get('/api/search', { cancelToken: token });

// Cancel later
api.cancelRequest('search');
```

---

## ⚛️ React Component Example

```javascript
import React, { useState, useEffect } from 'react';
import api from './api/ApiService';

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const response = await api.get('/api/users', {
      params: { page: 1, limit: 20 },
      cache: true
    });

    if (response.success) {
      setUsers(response.data);
    }
    setLoading(false);
  };

  // Create user
  const handleCreateUser = async (userData) => {
    const response = await api.post('/api/users', userData);
    
    if (response.success) {
      setUsers([...users, response.data]);
    }
  };

  // Update user
  const handleUpdateUser = async (userId, updates) => {
    const response = await api.patch(`/api/users/${userId}`, updates);
    
    if (response.success) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, ...response.data } : u
      ));
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    const response = await api.delete(`/api/users/${userId}`);
    
    if (response.success) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // Upload photo
  const handleUploadPhoto = async (userId, file) => {
    const response = await api.uploadFile(
      `/api/users/${userId}/photo`,
      file,
      'photo',
      {
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      }
    );
    
    if (response.success) {
      setUploadProgress(0);
      loadUsers();
    }
  };

  return (
    <div>
      {loading ? 'Loading...' : users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleUpdateUser(user.id, { name: 'New' })}>
            Edit
          </button>
          <button onClick={() => handleDeleteUser(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## 📋 Response Format

```javascript
{
  success: true/false,
  data: {...},
  message: "Success message",
  errors: null,
  timestamp: "2025-12-16T..."
}
```

---

## 🎨 Auto Error Handling

All errors show automatic toast messages:
- **Network**: "নেটওয়ার্ক সমস্যা"
- **401**: Auto logout & redirect to login
- **403**: "অনুমতি নেই"
- **404**: "খুঁজে পাওয়া যায়নি"
- **422**: Shows validation errors
- **500**: "সার্ভার সমস্যা"

---

## 🛠️ How to Use in Your Project

### Step 1: Import
```javascript
import api from './api/ApiService';
```

### Step 2: Use in your service files
Look at `authService.js`, `userService.js` for examples.

### Step 3: Use in React components
```javascript
const response = await api.get('/api/users');
if (response.success) {
  // Use response.data
}
```

---

## 📊 Feature Checklist

✅ GET, POST, PUT, PATCH, DELETE  
✅ File Upload/Download  
✅ Progress Tracking  
✅ Request Cancellation  
✅ Retry Logic  
✅ Response Caching  
✅ Batch Requests  
✅ Auto Error Handling  
✅ Auto Toast Messages  
✅ Standard Response Format  

---

## 🎯 Next Steps

1. ✅ **ApiService.js** - Main service (ready to use!)
2. ✅ **axiosInstance.js** - Already configured
3. ✅ **httpEndpoints.js** - Add your endpoints here
4. 📝 Update your service files to use `api` from `ApiService.js`
5. 🚀 Start using in components!

---

**সব কিছু ready! এখন আপনার প্রজেক্টে ব্যবহার শুরু করুন।