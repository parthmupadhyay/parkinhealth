# ParkinHealth System Design Document

## 1. Product Overview
ParkinHealth is a cross-platform social fitness app for iOS and Android. It lets users track daily steps and active workout calories against personal targets, visualizing progress via an animated "Step Circle" ring. Users connect with friends across both platforms to view leaderboards and daily progress rings.

- iOS Data Source: Apple HealthKit (HKQuantityTypeIdentifierStepCount, HKQuantityTypeIdentifierActiveEnergyBurned)
- Android Data Source: Android Health Connect (StepsRecord, TotalCaloriesBurnedRecord)
- Client Framework: React Native with Expo Prebuild (Dev Client)
- Backend & Auth: Supabase (PostgreSQL, Supabase Auth, Row-Level Security)
- Time Model: Option A (Personal Local Day) — all daily metrics are keyed to the user's local calendar day (YYYY-MM-DD).
- Sync Strategy: On-Open Sync — the app reads local sensors and pushes updates to Supabase on app launch and foregrounding (AppState === 'active').

---

## 2. Technical Stack & Tooling

| Layer | Library / Tool | Implementation Notes |
| :--- | :--- | :--- |
| Framework | Expo SDK (React Native) + TypeScript | Managed via Expo Prebuild (npx expo run:ios / android). |
| Routing | Expo Router (File-based) | Tab layout for Home, Friends, and Profile. |
| Styling | NativeWind (Tailwind CSS) | Clean dark mode layout (#121212 canvas, neon accents). |
| Visual Rings | react-native-svg | SVG stroke-dasharray animations for the step and calorie rings. |
| iOS Health | @kingstinct/react-native-healthkit | Config plugin handles HealthKit capabilities in Info.plist. |
| Android Health | react-native-health-connect | Config plugin automates Android manifest and permission delegates. |
| Backend & DB | @supabase/supabase-js | Relational PostgreSQL with atomic upserts and RLS. |

---

## 3. Project Directory Architecture

├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── friends.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── components/
│   ├── StepRing.tsx
│   ├── FriendRingCard.tsx
│   └── StatCard.tsx
├── services/
│   ├── health/
│   │   ├── healthService.ts
│   │   ├── healthKit.ios.ts
│   │   └── healthConnect.android.ts
│   ├── metricsService.ts
│   └── friendshipService.ts
├── lib/
│   ├── supabase.ts
│   └── mockData.ts
├── types/
│   └── index.ts
├── app.json
└── design.md

---

## 4. Database Schema (Supabase PostgreSQL)

-- 1. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    daily_step_goal INT DEFAULT 10000,
    daily_calorie_goal INT DEFAULT 500,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Metrics Table (Keyed to local user date: YYYY-MM-DD)
CREATE TABLE public.daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    local_date DATE NOT NULL,
    steps INT DEFAULT 0,
    active_calories INT DEFAULT 0,
    last_synced_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_daily_record UNIQUE (user_id, local_date)
);

-- 3. Friendships Table
CREATE TABLE public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_friendship_pair UNIQUE (user_id, friend_id)
);

-- Row-Level Security (RLS) Rules:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can upsert own daily metrics" 
ON public.daily_metrics FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view friends daily metrics" 
ON public.daily_metrics FOR SELECT TO authenticated 
USING (
    user_id = auth.uid() OR
    user_id IN (
        SELECT friend_id FROM public.friendships 
        WHERE user_id = auth.uid() AND status = 'accepted'
        UNION
        SELECT user_id FROM public.friendships 
        WHERE friend_id = auth.uid() AND status = 'accepted'
    )
);

---

## 5. Native Permissions Configuration (app.json)

{
  "expo": {
    "name": "StepCircle",
    "slug": "stepcircle",
    "version": "1.0.0",
    "plugins": [
      [
        "@kingstinct/react-native-healthkit",
        {
          "NSHealthShareUsageDescription": "StepCircle needs read access to your steps and active energy to update your daily circles and friend challenges."
        }
      ],
      "react-native-health-connect",
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 26
          }
        }
      ]
    ],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.stepcircle.app",
      "infoPlist": {
        "NSHealthShareUsageDescription": "StepCircle requires access to read your daily steps and active workout calories to compare with friends."
      }
    },
    "android": {
      "package": "com.stepcircle.app",
      "permissions": [
        "android.permission.health.READ_STEPS",
        "android.permission.health.READ_TOTAL_CALORIES_BURNED"
      ]
    }
  }
}

---

## 6. Unified Health Service Interface

// types/index.ts
export interface HealthSummary {
  steps: number;
  activeCalories: number;
  localDate: string; // YYYY-MM-DD
  lastSynced: Date;
}

export interface IHealthService {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  getTodaySummary(): Promise<HealthSummary>;
}

- iOS Query Implementation: Uses queryStatisticsForQuantity with HKQuantityTypeIdentifierStepCount and HKQuantityTypeIdentifierActiveEnergyBurned, with startDate set to local midnight (00:00:00) and endDate set to now.
- Android Query Implementation: Calls aggregateRecord from react-native-health-connect specifying the time range from start of day to current instant.
- Deduplication: Native OS cumulative methods ensure wearables and phone sensors merge automatically without duplicate counts.

---

## 7. Sync Loop Architecture (On-Open)

1. Attach an AppState listener in the root layout (app/_layout.tsx).
2. When state changes to 'active':
   - Call healthService.getTodaySummary().
   - Calculate user's current local date:
     const localDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
   - Upsert into Supabase:
     await supabase.from('daily_metrics').upsert({
       user_id: user.id,
       local_date: localDate,
       steps: summary.steps,
       active_calories: summary.activeCalories,
       last_synced_at: new Date().toISOString()
     }, { onConflict: 'user_id,local_date' });
3. The Friends tab displays steps, active_calories, percentage of goal completed, and a formatted string like "Synced 8m ago" based on last_synced_at.

---

## 8. Phased Implementation Roadmap for the Executor

### Phase 1: Project Setup & UI Shell (Mock Data)
- Initialize Expo project with TypeScript, Expo Router, and NativeWind/Tailwind.
- Build the StepRing SVG component (animated circular progress bar displaying % of daily goal).
- Implement the 3 primary tab screens: Home, Friends, and Profile using dummy datasets from lib/mockData.ts.
- Verify rendering works on web/simulators before touching native packages.

### Phase 2: Supabase Integration
- Install @supabase/supabase-js and configure lib/supabase.ts.
- Implement simple Email/Password or Anonymous Auth for rapid development.
- Implement metricsService.ts:
  - upsertTodayMetrics(steps: number, calories: number, localDate: string)
  - getFriendsTodayLeaderboard()
- Connect the Friends tab to pull from Supabase with pull-to-refresh.

### Phase 3: Native Health Permissions & Aggregators
- Configure app.json with HealthKit and Health Connect plugins.
- Implement services/health/healthKit.ios.ts and services/health/healthConnect.android.ts.
- Wire live step and calorie data to the Home Screen's StepRing.

### Phase 4: AppState Sync Cycle
- Implement the AppState listener in _layout.tsx to automatically trigger sync on open/foreground.
- Display a "Last updated X min ago" label next to each friend's card on the Friends tab.