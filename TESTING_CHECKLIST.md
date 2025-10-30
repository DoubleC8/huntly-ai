# Pre-Clerk Migration Testing Checklist

## ✅ React Query Verification

- [x] **React Query Provider is properly configured**

  - Located in `app/layout.tsx`
  - Wrapped correctly within `<ClerkProvider>`
  - ReactQueryDevtools included for development

- [x] **React Query Hooks Active**
  - `useUpdateJobStage` - Job stage mutations
  - `useProfileMutations` - Profile updates
  - `useResumeMutations` - Resume operations
  - `useGetUserInfo` - User data fetching
  - `useGetResumes` - Resume fetching
  - `useJobStageCounts` - Job counts queries

---

## 🔐 Authentication & Authorization Tests

### Before Clerk Migration (Current NextAuth)

- [x] **Sign In Flow**

  - [x] Click "Sign In" button on homepage
  - [x] GitHub OAuth popup appears
  - [x] After successful auth, redirects to `/jobs/dashboard`
  - [x] User session is established

- [x] **Protected Routes**

  - [x] Unauthenticated user cannot access `/jobs/*` routes
  - [x] Middleware redirects unauthenticated users to homepage
  - [x] Authenticated user can access all protected routes

- [x] **Sign Out Flow**

  - [x] Sign out button in desktop sidebar works
  - [x] Sign out button in mobile menu works
  - [x] After sign out, user is redirected to homepage
  - [x] Cannot access protected routes after sign out

- [x] **Session Persistence**
  - [x] Refresh page while logged in - stays logged in
  - [x] Close and reopen browser - session persists (if configured)

---

## 📊 Core Functionality Tests

### Jobs Dashboard (`/jobs/dashboard`)

- [ ] **Jobs List Display**

  - [x] Jobs are loaded and displayed correctly
  - [ ] Loading states appear while fetching
  - [x] Empty state shows when no jobs match filters
  - [x] Job cards show all relevant information

- [ ] **Job Filters**

  - [ ] Search by title/company works
  - [ ] Location filter works
  - [ ] Employment type filter works
  - [ ] Remote type filter works
  - [ ] Salary filter works
  - [ ] Multiple filters can be combined

- [x] **Job Actions (React Query Mutations)**
  - [x] Change job stage (Applied, Interview, Offer, etc.)
  - [x] Toggle wishlist status
  - [x] Add/edit job note
  - [x] Update job fields (title, location, salary, etc.)
  - [x] **Verify React Query cache updates immediately**
  - [x] **Verify UI reflects changes without page refresh**

### App Tracker (`/jobs/app-tracker`)

- [x] **Kanban Board Display**

  - [x] Jobs are organized by stage in columns
  - [x] Drag and drop between stages works
  - [x] Job cards display correctly in each column
  - [x] Empty columns show appropriate messages

- [x] **Stage Interactions**
  - [x] Moving jobs between stages updates database
  - [x] UI updates reflect changes immediately (React Query)
  - [x] Job counts per stage are accurate

### Profile Page (`/jobs/profile`)

- [x] **Profile Information Display**

  - [x] User info section displays correctly
  - [x] Education entries show up
  - [x] Skills list displays
  - [x] Job preferences display
  - [x] Resume section shows default resume

- [x] **Profile Updates (React Query Mutations)**

  - [x] Update personal info (GitHub, LinkedIn, etc.)
  - [x] Add/edit education entry
  - [x] Add/remove skill
  - [x] Add/remove job preference
  - [x] Delete education entry
  - [x] **Verify mutations invalidate cache and refetch**
  - [x] **Verify UI updates immediately after mutation**

- [ ] **Applied Jobs Section**
  - [ ] Pagination works correctly
  - [ ] Jobs load when scrolling/clicking next page
  - [x] Total job count is accurate

### Resume Page (`/jobs/resume`)

- [x] **Resume List**

  - [x] All user resumes display in table
  - [x] Default resume is marked correctly
  - [x] Resume info (filename, upload date) displays

- [x] **Resume Actions (React Query Mutations)**
  - [x] Upload new resume
  - [x] Delete resume
  - [x] Set default resume
  - [x] Update target job title
  - [x] **Verify cache invalidation after mutations**
  - [x] **Verify UI updates without refresh**

### Job Detail Page (`/jobs/dashboard/job/[id]`)

- [x] **Job Information Display**

  - [x] All job details load correctly
  - [x] AI summary displays (if available)
  - [x] Responsibilities list displays
  - [x] Qualifications list displays
  - [x] Skills and tags display

- [x] **Job Actions**
  - [x] Change stage from detail page
  - [x] Add/edit note from detail page
  - [x] Navigation buttons work (back to dashboard)

---

## 🗄️ Database Operations Tests

- [ ] **Data Creation**

  - [ ] New jobs are saved to database
  - [x] Profile updates persist to database
  - [x] Resume uploads are saved correctly
  - [x] Education entries are saved

- [x] **Data Updates**

  - [x] Job stage changes persist
  - [x] Job notes save correctly
  - [x] Profile updates persist
  - [x] Resume default status updates

- [x] **Data Deletion**

  - [x] Resumes can be deleted
  - [x] Education entries can be deleted
  - [x] Jobs can be deleted (if implemented)
  - [x] Cascade deletes work correctly (user deletion)

- [x] **Data Relationships**
  - [x] User-Job relationships are maintained
  - [x] User-Resume relationships are maintained
  - [x] User-Education relationships are maintained

---

## 🎨 UI/UX Tests

- [x] **Responsive Design**

  - [x] Desktop layout works correctly
  - [x] Mobile layout works correctly
  - [x] Tablet layout works correctly
  - [x] Navigation adapts to screen size

- [] **Loading States**

  - [ ] Loading skeletons appear during data fetch
  - [ ] No layout shifts during loading
  - [ ] Loading states are not too brief/flashy

- [ ] **Error Handling**

  - [x] Error boundaries catch and display errors
  - [x] Toast notifications appear for errors
  - [ ] Network errors are handled gracefully
  - [ ] Form validation errors display correctly

- [x] **Toasts/Notifications**
  - [x] Success toasts appear after mutations
  - [x] Error toasts appear on failures
  - [x] Toasts are not intrusive

---

## ⚡ React Query Specific Tests

- [x] **Cache Behavior**

  - [x] Open React Query DevTools (bottom-left corner in dev mode)
  - [x] Verify queries are being cached
  - [x] Verify mutations invalidate correct query keys
  - [x] Verify stale time is respected

- [x] **Optimistic Updates**

  - [x] Job stage changes appear immediately (before server response)
  - [x] Profile updates appear immediately
  - [x] Resume actions appear immediately

- [ ] **Query Invalidation**

  - [] After profile update, profile queries refetch
  - [] After job update, job queries refetch
  - [] After resume update, resume queries refetch
  - [] Related queries update when parent data changes

- [ ] **Background Refetching**
  - [ ] Data refetches when tab regains focus
  - [ ] Data refetches after network reconnection

---

## 🔧 Technical Tests

- [ ] **Build Process**

  - [ ] Run `npm run build` successfully
  - [ ] No TypeScript errors
  - [ ] No linting errors (run `npm run lint`)
  - [ ] Production build starts correctly (`npm start`)

- [ ] **Environment Variables**

  - [x] Database connection works
  - [x] Supabase connection works (for resume storage)
  - [x] All required env vars are set

- [ ] **API Routes**

  - [ ] All server actions execute correctly
  - [ ] Server actions return expected data
  - [ ] Error handling in server actions works

- [ ] **Middleware**
  - [ ] Route protection works
  - [ ] Redirects work correctly
  - [ ] Public routes are accessible

---

## 📝 Quick Test Script

Run these commands to verify basic functionality:

```bash
# 1. Check for TypeScript errors
npm run build

# 2. Check for linting errors
npm run lint

# 3. Start dev server
npm run dev

# 4. Open React Query DevTools
# Look for the React Query icon in bottom-left corner
# Verify queries are running and caching correctly
```

---

## 🚨 Critical Tests (Must Pass Before Clerk Migration)

1. ✅ React Query is properly configured and working
2. [x] Authentication flow (sign in/out) works
3. [x] Protected routes are accessible only when authenticated
4. [x] All React Query mutations update UI immediately
5. [x] Data persists correctly to database
6. [x] No TypeScript or build errors

---

## 📊 React Query DevTools Usage

1. **Access DevTools**: Look for React Query logo in bottom-left corner (dev mode only)
2. **Check Queries**: Click to see all active queries
3. **Check Mutations**: View recent mutations and their status
4. **Monitor Cache**: Verify query keys and cached data
5. **Test Refetching**: Use "Invalidate" buttons to test cache invalidation

---

## 🎯 Post-Migration Checklist (After Clerk)

After migrating to Clerk, verify:

- [x] Clerk sign-in modal appears
- [x] User can authenticate with Clerk
- [x] User email/ID is correctly retrieved via `getCurrentUserEmail()`
- [x] All protected routes still work
- [x] Sign out works with Clerk
- [x] User data loads correctly with Clerk user ID

---

## 💡 Tips

- Test in an **incognito/private window** to avoid cached sessions
- Clear browser cache between major test runs
- Use **React Query DevTools** to monitor query behavior
- Check **browser console** for any errors
- Check **Network tab** to verify API calls
- Test with **different user accounts** if possible
