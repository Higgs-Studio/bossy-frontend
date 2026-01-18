# Edit Goal Page & Add Goal Page Improvements

## Overview
This document outlines the improvements made to the Edit Goal page, Add Goal page, and task management features.

## Changes Made

### 1. ✅ Stationary Update Button (Edit Goal Page)
**Location**: `app/app/goals/[id]/edit-goal-form.tsx`

- Made the Update Goal button and Cancel button **sticky at the bottom** of the form
- Buttons remain visible when scrolling through long forms
- Cancel button is now next to Update button (not full-width)
- Update button takes full width, Cancel button is standard size
- Added border-top separator for visual clarity

**Implementation**:
```tsx
<div className="sticky bottom-0 bg-background border-t border-border pt-4 -mx-6 px-6 -mb-6 pb-6 flex gap-3">
  <Button variant="outline">Cancel</Button>
  <Button className="flex-1">Update Goal</Button>
</div>
```

### 2. ✅ Task Status Updates Fixed
**Locations**: 
- `app/app/goals/[id]/actions.ts`
- `app/app/goals/[id]/task-list.tsx`

**Problems Fixed**:
- Task status wasn't being saved when creating new tasks
- Task status couldn't be updated when editing tasks

**Solutions**:
- Added `status: 'todo'` to `createTaskAction` when inserting new tasks
- Added `taskStatus` parameter to `updateTaskAction`
- Added status selector in task edit form with visual buttons:
  - 🔵 **To Do** - Gray/slate color with Circle icon
  - 🟡 **In Progress** - Amber/yellow color with Clock icon
  - ✅ **Done** - Green color with CheckCircle icon
- Status buttons have ring effect when selected

### 3. ✅ Aligned Progress Calculations
**Locations**:
- `lib/supabase/queries.ts`
- `app/app/goals/goals-list-content.tsx`
- `app/app/goals/[id]/task-list.tsx`

**Changes**:
- **Updated Goal type** to include `total_tasks` and `completed_tasks`
- **Enhanced `getUserGoals`** query to fetch task statistics for each goal
- **Changed progress calculation** from time-based to task completion-based:
  - **Before**: Progress based on time elapsed (start date → end date)
  - **After**: Progress based on tasks completed (completed tasks / total tasks × 100%)
- Changed progress bar color from indigo/purple to green/emerald to match completion theme

**Formula**: `(completed_tasks / total_tasks) × 100%`

Both the goals page and tasks section now use identical calculation methods.

### 4. ✅ Status Field in Task Edit Form
**Location**: `app/app/goals/[id]/task-list.tsx`

Added a status selector when editing tasks:
- Shows current task status when edit mode is activated
- Three visual buttons to select status
- Status is saved along with task text and date when form is submitted
- Each status button shows appropriate icon and color

### 5. ✅ Flexible Goal Duration (Edit Goal Page)
**Location**: `app/app/goals/[id]/edit-goal-form.tsx`

**Changes**:
- Removed `min={new Date().toISOString().split('T')[0]}` from start date (allows past dates)
- Kept only `min={startDate}` for end date (end must be after start)
- Changed default end date adjustment from +30 days to +1 day when start changes
- Users can now create goals of **any duration** (1 day to years)

### 6. ✅ Fixed Calendar Display (Add Goal Page)
**Location**: `app/app/goal/goal-form.tsx`

**Problems Fixed**:
- Calendar was cut off or hidden behind other elements
- Calendar position was not properly visible

**Solutions**:
- Updated calendar container from `absolute` to use proper z-index layering
- Changed calendar background from `bg-popover` to `bg-background` for better visibility
- Added `shadow-xl` for better visual separation
- Improved z-index hierarchy (backdrop z-40, calendar z-50)
- Removed date restrictions to allow any goal duration
- Changed end date constraint from `disabled={(date) => date <= startDate}` to `disabled={(date) => date < startDate}`

**Calendar Display**:
```tsx
<div className="relative z-50">
  <div className="absolute top-0 left-0 bg-background border border-border rounded-lg shadow-xl p-3 mt-1">
    <Calendar ... />
  </div>
</div>
```

## Database Updates Required

No new migrations needed - all changes work with existing schema from migration 009.

## Features Summary

### Edit Goal Page
✅ Sticky bottom buttons (Update + Cancel)
✅ Status selector in task edit form  
✅ Any duration allowed for goals
✅ Task completion progress (aligned with goals page)

### Add Goal Page
✅ Fixed calendar visibility and positioning
✅ Any duration allowed (removed date minimums)
✅ Better calendar styling

### Goals Page
✅ Progress now shows task completion % (not timeline %)
✅ Progress calculation aligned with task list
✅ Green progress bar (matches completion theme)

### Task Management
✅ Status field saved when creating tasks
✅ Status can be updated when editing tasks
✅ Visual status selector with icons
✅ Quick status toggle by clicking badge in view mode

## Testing Checklist

- [ ] Create a new goal with any start/end date (past, present, future)
- [ ] Edit goal start/end dates to any values
- [ ] Scroll on Edit Goal page - buttons should stay at bottom
- [ ] Create a task - verify it has "To Do" status by default
- [ ] Click task edit button - verify status selector appears
- [ ] Change task status in edit mode - verify it saves
- [ ] Click task status badge in view mode - verify it cycles through statuses
- [ ] Check progress % on goals page matches tasks completion %
- [ ] Open calendar on Add Goal page - verify it's fully visible
- [ ] Select dates from calendar - verify they apply correctly

## Notes

- Task status updates use optimistic UI for instant feedback
- Progress calculations are now consistent across the entire app
- Calendar improvements apply to both Add Goal and Edit Goal pages
- All changes are backwards compatible with existing data
