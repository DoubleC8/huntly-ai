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

- [ ] **Profile Updates (React Query Mutations)**

  - [x] Update personal info (GitHub, LinkedIn, etc.)
  - [] Add/edit education entry
  - [x] Add/remove skill
  - [x] Add/remove job preference
  - [ ] Delete education entry
  - [x] **Verify mutations invalidate cache and refetch**
  - [x] **Verify UI updates immediately after mutation**

- [ ] **Applied Jobs Section**
  - [ ] Pagination works correctly
  - [ ] Jobs load when scrolling/clicking next page
  - [ ] Total job count is accurate

### Resume Page (`/jobs/resume`)

- [ ] **Resume List**

  - [ ] All user resumes display in table
  - [ ] Default resume is marked correctly
  - [ ] Resume info (filename, upload date) displays

- [ ] **Resume Actions (React Query Mutations)**
  - [ ] Upload new resume
  - [ ] Delete resume
  - [ ] Set default resume
  - [ ] Update target job title
  - [ ] **Verify cache invalidation after mutations**
  - [ ] **Verify UI updates without refresh**

### Job Detail Page (`/jobs/dashboard/job/[id]`)

- [ ] **Job Information Display**

  - [ ] All job details load correctly
  - [ ] AI summary displays (if available)
  - [ ] Responsibilities list displays
  - [ ] Qualifications list displays
  - [ ] Skills and tags display

- [ ] **Job Actions**
  - [ ] Change stage from detail page
  - [ ] Add/edit note from detail page
  - [ ] Navigation buttons work (back to dashboard)

---

## 🗄️ Database Operations Tests

- [ ] **Data Creation**

  - [ ] New jobs are saved to database
  - [ ] Profile updates persist to database
  - [ ] Resume uploads are saved correctly
  - [ ] Education entries are saved

- [ ] **Data Updates**

  - [ ] Job stage changes persist
  - [ ] Job notes save correctly
  - [ ] Profile updates persist
  - [ ] Resume default status updates

- [ ] **Data Deletion**

  - [ ] Resumes can be deleted
  - [ ] Education entries can be deleted
  - [ ] Jobs can be deleted (if implemented)
  - [ ] Cascade deletes work correctly (user deletion)

- [ ] **Data Relationships**
  - [ ] User-Job relationships are maintained
  - [ ] User-Resume relationships are maintained
  - [ ] User-Education relationships are maintained

---

## 🎨 UI/UX Tests

- [ ] **Responsive Design**

  - [ ] Desktop layout works correctly
  - [ ] Mobile layout works correctly
  - [ ] Tablet layout works correctly
  - [ ] Navigation adapts to screen size

- [ ] **Loading States**

  - [ ] Loading skeletons appear during data fetch
  - [ ] No layout shifts during loading
  - [ ] Loading states are not too brief/flashy

- [ ] **Error Handling**

  - [ ] Error boundaries catch and display errors
  - [ ] Toast notifications appear for errors
  - [ ] Network errors are handled gracefully
  - [ ] Form validation errors display correctly

- [ ] **Toasts/Notifications**
  - [ ] Success toasts appear after mutations
  - [ ] Error toasts appear on failures
  - [ ] Toasts are not intrusive

---

## ⚡ React Query Specific Tests

- [ ] **Cache Behavior**

  - [ ] Open React Query DevTools (bottom-left corner in dev mode)
  - [ ] Verify queries are being cached
  - [ ] Verify mutations invalidate correct query keys
  - [ ] Verify stale time is respected

- [ ] **Optimistic Updates**

  - [ ] Job stage changes appear immediately (before server response)
  - [ ] Profile updates appear immediately
  - [ ] Resume actions appear immediately

- [ ] **Query Invalidation**

  - [ ] After profile update, profile queries refetch
  - [ ] After job update, job queries refetch
  - [ ] After resume update, resume queries refetch
  - [ ] Related queries update when parent data changes

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

  - [ ] Database connection works
  - [ ] Supabase connection works (for resume storage)
  - [ ] All required env vars are set

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
2. [ ] Authentication flow (sign in/out) works
3. [ ] Protected routes are accessible only when authenticated
4. [ ] All React Query mutations update UI immediately
5. [ ] Data persists correctly to database
6. [ ] No TypeScript or build errors

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

- [ ] Clerk sign-in modal appears
- [ ] User can authenticate with Clerk
- [ ] User email/ID is correctly retrieved via `getCurrentUserEmail()`
- [ ] All protected routes still work
- [ ] Sign out works with Clerk
- [ ] User data loads correctly with Clerk user ID

---

## 💡 Tips

- Test in an **incognito/private window** to avoid cached sessions
- Clear browser cache between major test runs
- Use **React Query DevTools** to monitor query behavior
- Check **browser console** for any errors
- Check **Network tab** to verify API calls
- Test with **different user accounts** if possible
