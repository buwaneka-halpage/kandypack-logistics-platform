# Admin Management - Quick Start Guide

## 🚀 What Was Implemented

Full CRUD functionality for managing system users (admins) with real backend API integration.

---

## ✅ Features

### **View All Users**
- Real-time data from backend `/users/` endpoint
- Shows: User ID, Username, Role, Created date
- Loading spinner while fetching
- Error handling with retry button

### **Filter Users**
- Filter by Username (dynamic list)
- Filter by Role (6 system roles)
- Combines both filters

### **Add New Admin**
- Form fields: Username, Role, Password, Confirm Password
- Validation: All required, password min 6 chars, passwords must match
- Backend creates user with hashed password
- Success/error toast notifications

### **Edit Admin**
- Pre-filled form with current user data
- Can change: Username, Role, Password (optional)
- Validation: Same as create
- Toast notifications

### **Delete Admin**
- Confirmation dialog with user details
- Shows warning message
- Backend checks for dependencies
- Toast notifications

---

## 📁 Files Created/Modified

### **New Files:**
```
frontend/UI/app/components/admin/
  ├── AddAdminDialog.tsx       (Create user dialog)
  ├── EditAdminDialog.tsx      (Update user dialog)
  └── DeleteAdminDialog.tsx    (Delete confirmation)

frontend/UI/app/components/ui/
  ├── toast.tsx                (Toast notification component)
  └── toaster.tsx              (Toast provider)

frontend/UI/app/hooks/
  └── use-toast.ts             (Toast hook)

ADMIN_MANAGEMENT_IMPLEMENTATION.md    (Full documentation)
ADMIN_MANAGEMENT_QUICK_START.md       (This file)
```

### **Modified Files:**
```
frontend/UI/app/components/admin/
  └── AdminManagement.tsx      (Main component with API integration)

frontend/UI/app/
  └── root.tsx                 (Added Toaster component)
```

---

## 🧪 Testing Instructions

### **1. Start Backend**
```bash
cd Backend
python -m uvicorn app.main:app --reload
```
Verify backend is running at http://localhost:8000

### **2. Start Frontend**
```bash
cd frontend/UI
npm run dev
```
Access at http://localhost:5173 (or your configured port)

### **3. Login**
- Go to `/admin` route
- Login with credentials (e.g., username: `admin`, password: `admin`)
- Must have **Management** or **SystemAdmin** role to access admin management

### **4. Test Features**

#### **View Users:**
1. Navigate to Admin Management page
2. Should see table with all users from database
3. Verify loading spinner appears briefly
4. Verify data displays correctly

#### **Filter Users:**
1. Select a username from "Name" dropdown
2. Verify table filters to matching users
3. Reset to "All Names"
4. Select a role from "Role" dropdown
5. Verify table filters to that role
6. Try combining both filters

#### **Add Admin:**
1. Click "Add Admin" button
2. Fill in form:
   - Username: `test_user123`
   - Role: `Store Manager`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create Admin"
4. Verify success toast appears
5. Verify new user appears in table
6. Check backend database to confirm user created

**Test Validation:**
- Leave fields empty → Should show error
- Enter short password (< 6 chars) → Should show error
- Passwords don't match → Should show error
- Use existing username → Backend should return error

#### **Edit Admin:**
1. Click "..." menu next to a user
2. Click "Edit Admin"
3. Verify form is pre-filled with current data
4. Change username to something new
5. Click "Update Admin"
6. Verify success toast appears
7. Verify table updates with new username
8. Edit again and try changing role
9. Edit again and try changing password (leave empty, then try with new password)

#### **Delete Admin:**
1. Click "..." menu next to a user (preferably test user created above)
2. Click "Delete Admin" (red option)
3. Verify confirmation dialog shows correct user details
4. Read warning message
5. Click "Delete User"
6. Verify success toast appears
7. Verify user is removed from table
8. Check backend database to confirm deletion

**Test Error Handling:**
- Try deleting a Driver with active schedules → Should show error
- Disconnect backend → Should show error message with "Try Again" button

---

## 🎯 API Endpoints Used

All endpoints require JWT authentication (`Authorization: Bearer <token>`):

| Method | Endpoint | Purpose | Permission Required |
|--------|----------|---------|-------------------|
| GET | `/users` | Fetch all users | Authenticated user |
| POST | `/users` | Create new user | Management/SystemAdmin |
| PUT | `/users/{user_id}` | Update user | Management/SystemAdmin |
| DELETE | `/users/{user_id}` | Delete user | Management/SystemAdmin |

---

## 🎨 UI Components Used

- **Dialog**: Modal dialogs for add/edit/delete
- **Button**: All action buttons
- **Input**: Text and password inputs
- **Label**: Form labels
- **Select**: Dropdown for role selection
- **Table**: Main data table
- **DropdownMenu**: Actions menu
- **Toast**: Notification system
- **Loader**: Loading spinner

---

## 🔑 System Roles

Users can have one of these roles:

1. **SystemAdmin** - Full system access
2. **Management** - Executive oversight, reporting
3. **StoreManager** - Warehouse operations
4. **Driver** - Delivery execution
5. **Assistant** (Driver Assistant) - Resource scheduling
6. **WarehouseStaff** - Inventory management

---

## 🐛 Troubleshooting

### **Users Not Loading**
- ✅ Check backend is running
- ✅ Check API_BASE_URL in `.env` file
- ✅ Check browser console for errors
- ✅ Verify you're logged in (check localStorage for token)

### **Can't Create/Edit/Delete**
- ✅ Verify your user has Management or SystemAdmin role
- ✅ Check backend logs for permission errors
- ✅ Verify JWT token is valid (not expired)

### **Toast Notifications Not Showing**
- ✅ Verify `<Toaster />` is in `root.tsx`
- ✅ Check browser console for errors
- ✅ Try refreshing page

### **Validation Errors**
- ✅ Ensure all required fields filled
- ✅ Password must be at least 6 characters
- ✅ Passwords must match
- ✅ Username must be unique

---

## 📊 Sample Test Data

Create these test users to verify functionality:

```typescript
// Test User 1
{
  user_name: "test_manager",
  password: "password123",
  role: "Management"
}

// Test User 2
{
  user_name: "test_store_mgr",
  password: "password123",
  role: "StoreManager"
}

// Test User 3
{
  user_name: "test_driver",
  password: "password123",
  role: "Driver"
}
```

Then test editing and deleting them.

---

## ✨ Expected Behavior

### **Success Scenarios:**
- ✅ Create user → Success toast → User appears in table
- ✅ Edit user → Success toast → Table updates
- ✅ Delete user → Success toast → User removed from table
- ✅ Filter by name → Table shows only matching users
- ✅ Filter by role → Table shows only users with that role

### **Error Scenarios:**
- ❌ Backend down → Error banner with "Try Again" button
- ❌ Duplicate username → Error toast + inline error message
- ❌ Validation error → Inline error message in dialog
- ❌ Permission denied → Error toast (403)
- ❌ Delete driver with schedules → Error toast from backend

---

## 🎉 Success Indicators

You'll know it's working correctly when:

1. ✅ Page loads and shows users from database
2. ✅ Filters work and update table in real-time
3. ✅ Can create new users and see them immediately
4. ✅ Can edit users and changes persist
5. ✅ Can delete users and they disappear
6. ✅ Toast notifications appear for all actions
7. ✅ Loading spinners show during operations
8. ✅ Error messages display when things go wrong
9. ✅ Validation prevents invalid data submission
10. ✅ Confirmation required before deletion

---

## 📝 Notes

- **Backend must be running** for any features to work
- **Must be logged in** as Management or SystemAdmin
- **All passwords are hashed** using pbkdf2_sha256
- **User IDs are UUIDs** generated by backend
- **Filters are client-side** (applied after data loaded)
- **No pagination yet** (loads all users at once)

---

## 🚀 Next Steps

After successful testing:

1. Consider adding phone number field to Users table
2. Consider adding full name field  
3. Implement pagination for large user lists
4. Add search functionality
5. Add sorting by clicking column headers
6. Implement activity log viewing
7. Add bulk operations (delete multiple users)

---

## 📞 Need Help?

- Check browser console for detailed error logs
- Check backend logs for API errors
- Review `ADMIN_MANAGEMENT_IMPLEMENTATION.md` for full documentation
- Verify environment variables are set correctly
- Ensure backend database has users table with correct schema

---

**Ready to test!** 🎉

Navigate to the Admin Management page and start creating, editing, and deleting users!

