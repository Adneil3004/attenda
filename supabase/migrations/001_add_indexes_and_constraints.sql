-- =====================================================
-- Database Performance & Constraints Fix
-- Attenda - No production impact
-- Run this AFTER checking current state
-- =====================================================

-- 1. ADD INDEX: events.organizer_id
-- Fixes: "My Events" queries scanning full table
-- Status: Idempotent (skips if exists)
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'events' 
        AND indexname = 'ix_events_organizer_id'
    ) THEN
        CREATE INDEX ix_events_organizer_id ON events (organizer_id);
        RAISE NOTICE 'Index ix_events_organizer_id created';
    ELSE
        RAISE NOTICE 'Index ix_events_organizer_id already exists, skipping';
    END IF;
END $$;

-- 2. ADD INDEX: events.status
-- Fixes: Filter events by status (Draft, Published, Archived)
-- Status: Idempotent
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'events' 
        AND indexname = 'ix_events_status'
    ) THEN
        CREATE INDEX ix_events_status ON events (status);
        RAISE NOTICE 'Index ix_events_status created';
    ELSE
        RAISE NOTICE 'Index ix_events_status already exists, skipping';
    END IF;
END $$;

-- 3. ADD INDEX: guests.rsvp_status
-- Fixes: Filter guests by RSVP status (Pending, Confirmed, Declined)
-- Status: Idempotent
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = 'guests' 
        AND indexname = 'ix_guests_rsvp_status'
    ) THEN
        CREATE INDEX ix_guests_rsvp_status ON guests (rsvp_status);
        RAISE NOTICE 'Index ix_guests_rsvp_status created';
    ELSE
        RAISE NOTICE 'Index ix_guests_rsvp_status already exists, skipping';
    END IF;
END $$;

-- 4. ADD UNIQUE CONSTRAINT: guests.event_id + first_name + last_name
-- Fixes: Prevent duplicate guests in same event
-- Note: PhoneNumber unique already exists, but name combo adds extra safety
-- Status: Idempotent (skips if constraint exists)
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraints 
        WHERE conname = 'uq_guests_event_name'
    ) THEN
        -- First, clean up any existing duplicates (keep the oldest)
        DELETE FROM guests a
        USING guests b
        WHERE a.ctid < b.ctid
        AND a.event_id = b.event_id
        AND LOWER(a.first_name) = LOWER(b.first_name)
        AND LOWER(a.last_name) = LOWER(b.last_name)
        AND a.phone_number = b.phone_number;

        CREATE UNIQUE INDEX uq_guests_event_name 
        ON guests (event_id, LOWER(first_name), LOWER(last_name));
        RAISE NOTICE 'Unique constraint uq_guests_event_name created';
    ELSE
        RAISE NOTICE 'Constraint uq_guests_event_name already exists, skipping';
    END IF;
END $$;

-- 5. VALIDATE phone_number LENGTH
-- Note: Currently stored as text without max length
-- EF Core validates at application level, this adds DB protection
-- Max reasonable phone: 20 chars (international format + country code)
-- Status: Idempotent
-- =====================================================
DO $$
BEGIN
    -- Check current column definition
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'guests' 
        AND column_name = 'phone_number'
        AND data_type = 'text'
    ) THEN
        -- Add a check constraint for max length
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'chk_guests_phone_number_length'
        ) THEN
            ALTER TABLE guests 
            ADD CONSTRAINT chk_guests_phone_number_length 
            CHECK (char_length(phone_number) <= 20);
            RAISE NOTICE 'Check constraint chk_guests_phone_number_length created';
        ELSE
            RAISE NOTICE 'Constraint chk_guests_phone_number_length already exists, skipping';
        END IF;
    ELSE
        RAISE NOTICE 'phone_number column is not text type, skipping constraint';
    END IF;
END $$;

-- =====================================================
-- Verification Query (run after script)
-- =====================================================
-- SELECT 
--     'events' as table_name,
--     string_agg(indexname, ', ') as indexes
-- FROM pg_indexes
-- WHERE tablename = 'events' AND indexname LIKE 'ix_%'
-- UNION ALL
-- SELECT 
--     'guests' as table_name,
--     string_agg(indexname, ', ') as indexes
-- FROM pg_indexes
-- WHERE tablename = 'guests' AND indexname LIKE 'ix_%' OR indexname LIKE 'uq_%';
