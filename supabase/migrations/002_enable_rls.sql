-- =====================================================
-- Row Level Security (RLS) Configuration
-- Attenda - Critical Security Fix
-- 
-- IMPORTANT: Run AFTER enabling RLS on tables
-- Run this in Supabase SQL Editor or via CLI
-- =====================================================

-- =====================================================
-- STEP 1: Enable RLS on all tables
-- =====================================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
-- payment_packages can be public (it's a pricing catalog)
-- guest_dietary_restrictions inherits from guests

RAISE NOTICE 'RLS enabled on all tables';

-- =====================================================
-- STEP 2: Events Policies
-- Users can only access their own events
-- =====================================================

DROP POLICY IF EXISTS "Users can view own events" ON events;
CREATE POLICY "Users can view own events"
ON events FOR SELECT
USING (organizer_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own events" ON events;
CREATE POLICY "Users can insert own events"
ON events FOR INSERT
WITH CHECK (organizer_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own events" ON events;
CREATE POLICY "Users can update own events"
ON events FOR UPDATE
USING (organizer_id = auth.uid())
WITH CHECK (organizer_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own events" ON events;
CREATE POLICY "Users can delete own events"
ON events FOR DELETE
USING (organizer_id = auth.uid());

RAISE NOTICE 'Events policies created';

-- =====================================================
-- STEP 3: Guest Groups Policies
-- Users can only access groups of their events
-- =====================================================

DROP POLICY IF EXISTS "Users can view groups of own events" ON guest_groups;
CREATE POLICY "Users can view groups of own events"
ON guest_groups FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert groups of own events" ON guest_groups;
CREATE POLICY "Users can insert groups of own events"
ON guest_groups FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update groups of own events" ON guest_groups;
CREATE POLICY "Users can update groups of own events"
ON guest_groups FOR UPDATE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete groups of own events" ON guest_groups;
CREATE POLICY "Users can delete groups of own events"
ON guest_groups FOR DELETE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

RAISE NOTICE 'Guest groups policies created';

-- =====================================================
-- STEP 4: Tables Policies
-- Users can only access tables of their events
-- =====================================================

DROP POLICY IF EXISTS "Users can view tables of own events" ON tables;
CREATE POLICY "Users can view tables of own events"
ON tables FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert tables of own events" ON tables;
CREATE POLICY "Users can insert tables of own events"
ON tables FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update tables of own events" ON tables;
CREATE POLICY "Users can update tables of own events"
ON tables FOR UPDATE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete tables of own events" ON tables;
CREATE POLICY "Users can delete tables of own events"
ON tables FOR DELETE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

RAISE NOTICE 'Tables policies created';

-- =====================================================
-- STEP 5: Guests Policies
-- Users can only access guests of their events
-- =====================================================

DROP POLICY IF EXISTS "Users can view guests of own events" ON guests;
CREATE POLICY "Users can view guests of own events"
ON guests FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert guests of own events" ON guests;
CREATE POLICY "Users can insert guests of own events"
ON guests FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update guests of own events" ON guests;
CREATE POLICY "Users can update guests of own events"
ON guests FOR UPDATE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete guests of own events" ON guests;
CREATE POLICY "Users can delete guests of own events"
ON guests FOR DELETE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

RAISE NOTICE 'Guests policies created';

-- =====================================================
-- STEP 6: Task Items Policies
-- Users can only access tasks of their events
-- =====================================================

DROP POLICY IF EXISTS "Users can view tasks of own events" ON task_items;
CREATE POLICY "Users can view tasks of own events"
ON task_items FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert tasks of own events" ON task_items;
CREATE POLICY "Users can insert tasks of own events"
ON task_items FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update tasks of own events" ON task_items;
CREATE POLICY "Users can update tasks of own events"
ON task_items FOR UPDATE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete tasks of own events" ON task_items;
CREATE POLICY "Users can delete tasks of own events"
ON task_items FOR DELETE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

RAISE NOTICE 'Task items policies created';

-- =====================================================
-- STEP 7: Check Ins Policies
-- Users can only access check-ins of their events
-- =====================================================

DROP POLICY IF EXISTS "Users can view check-ins of own events" ON check_ins;
CREATE POLICY "Users can view check-ins of own events"
ON check_ins FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert check-ins of own events" ON check_ins;
CREATE POLICY "Users can insert check-ins of own events"
ON check_ins FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update check-ins of own events" ON check_ins;
CREATE POLICY "Users can update check-ins of own events"
ON check_ins FOR UPDATE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete check-ins of own events" ON check_ins;
CREATE POLICY "Users can delete check-ins of own events"
ON check_ins FOR DELETE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

RAISE NOTICE 'Check-ins policies created';

-- =====================================================
-- STEP 8: Users Policies
-- Users can only view/update their own profile
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin note: For user registration, Supabase Auth handles this
-- This policy only applies to the users table for profile updates

RAISE NOTICE 'Users policies created';

-- =====================================================
-- STEP 9: Payment Methods Policies
-- CRITICAL: Users can ONLY access their own payment methods
-- =====================================================

DROP POLICY IF EXISTS "Users can view own payment methods" ON payment_methods;
CREATE POLICY "Users can view own payment methods"
ON payment_methods FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own payment methods" ON payment_methods;
CREATE POLICY "Users can insert own payment methods"
ON payment_methods FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own payment methods" ON payment_methods;
CREATE POLICY "Users can update own payment methods"
ON payment_methods FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own payment methods" ON payment_methods;
CREATE POLICY "Users can delete own payment methods"
ON payment_methods FOR DELETE
USING (user_id = auth.uid());

RAISE NOTICE 'Payment methods policies created';

-- =====================================================
-- STEP 10: Guest Dietary Restrictions
-- Inherits from guests table access
-- =====================================================

ALTER TABLE guest_dietary_restrictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view dietary restrictions of own guests" ON guest_dietary_restrictions;
CREATE POLICY "Users can view dietary restrictions of own guests"
ON guest_dietary_restrictions FOR SELECT
USING (
  guest_id IN (
    SELECT g.id FROM guests g
    INNER JOIN events e ON g.event_id = e.id
    WHERE e.organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert dietary restrictions of own guests" ON guest_dietary_restrictions;
CREATE POLICY "Users can insert dietary restrictions of own guests"
ON guest_dietary_restrictions FOR INSERT
WITH CHECK (
  guest_id IN (
    SELECT g.id FROM guests g
    INNER JOIN events e ON g.event_id = e.id
    WHERE e.organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update dietary restrictions of own guests" ON guest_dietary_restrictions;
CREATE POLICY "Users can update dietary restrictions of own guests"
ON guest_dietary_restrictions FOR UPDATE
USING (
  guest_id IN (
    SELECT g.id FROM guests g
    INNER JOIN events e ON g.event_id = e.id
    WHERE e.organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete dietary restrictions of own guests" ON guest_dietary_restrictions;
CREATE POLICY "Users can delete dietary restrictions of own guests"
ON guest_dietary_restrictions FOR DELETE
USING (
  guest_id IN (
    SELECT g.id FROM guests g
    INNER JOIN events e ON g.event_id = e.id
    WHERE e.organizer_id = auth.uid()
  )
);

RAISE NOTICE 'Guest dietary restrictions policies created';

-- =====================================================
-- STEP 11: Verify Setup
-- =====================================================
-- Run this to verify policies were created:
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public';

-- =====================================================
-- IMPORTANT NOTES
-- =====================================================
-- 1. payment_packages remains WITHOUT RLS (public catalog)
-- 2. RSVP public endpoints should bypass RLS (handled separately)
-- 3. Admin users (if any) need special handling
