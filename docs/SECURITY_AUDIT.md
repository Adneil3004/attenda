# 🔒 Security Audit — Attenda Database

> Generated: 2026-04-15
> Scope: Backend EF Core schema + Supabase configuration

---

## Executive Summary

| Category | Status | Risk Level |
|----------|--------|------------|
| Password Storage | ⚠️ Review | 🔴 HIGH |
| Row Level Security | ❌ Missing | 🔴 HIGH |
| API Rate Limiting | ❌ Not configured | 🟡 MEDIUM |
| Payment Tokens | ⚠️ Review | 🟡 MEDIUM |
| Audit Trail | ⚠️ Basic | 🟡 MEDIUM |

---

## 1. Password Storage — 🔴 HIGH PRIORITY

### Current State
```csharp
// User.cs
public string PasswordHash { get; private set; } // Local JWT auth for MVP
```

**Issues:**
- Field name suggests hashing (`PasswordHash`) but actual implementation unknown
- Need to verify:
  - Algorithm used (bcrypt, argon2, scrypt, PBKDF2?)
  - Salt rounds / iterations
  - Password minimum requirements enforced?

### Questions to Answer
1. Where is the password hashed? (Registration endpoint)
2. What hashing library is used?
3. Are there minimum password requirements?

### Recommendations
```csharp
// Recommended: BCrypt.Net-Next
var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);

// Verification
BCrypt.Net.BCrypt.Verify(password, storedHash);
```

**Minimum password policy:**
- Minimum 8 characters
- At least 1 uppercase
- At least 1 number
- At least 1 special character

---

## 2. Row Level Security (RLS) — 🔴 HIGH PRIORITY

### Current State
**RLS is NOT configured in Supabase.**

This means any authenticated user could potentially:
- Read other users' events
- Modify guest lists of other events
- Access payment information of other organizers

### Required RLS Policies

#### Events Table
```sql
-- Users can only see their own events
CREATE POLICY "Users can view own events"
ON events FOR SELECT
USING (organizer_id = auth.uid());

CREATE POLICY "Users can insert own events"
ON events FOR INSERT
WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Users can update own events"
ON events FOR UPDATE
USING (organizer_id = auth.uid());

CREATE POLICY "Users can delete own events"
ON events FOR DELETE
USING (organizer_id = auth.uid());
```

#### Guests Table (via event ownership)
```sql
-- Users can only see guests of their events
CREATE POLICY "Users can view guests of own events"
ON guests FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);
```

#### Payment Methods (CRITICAL)
```sql
-- Users can ONLY see their own payment methods
CREATE POLICY "Users can view own payment methods"
ON payment_methods FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own payment methods"
ON payment_methods FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own payment methods"
ON payment_methods FOR DELETE
USING (user_id = auth.uid());
```

### Steps to Implement RLS
1. Enable RLS on all tables in Supabase Dashboard
2. Create policies for each table
3. Test with a secondary account to verify isolation
4. Update Supabase client config to use authenticated mode

---

## 3. API Rate Limiting — 🟡 MEDIUM

### Current State
No rate limiting configured on the .NET API.

### Risks
- Brute force attacks on login
- DoS attacks
- Scraping / data extraction

### Recommendations

#### For Login Endpoint
```csharp
// Program.cs or auth middleware
app.UseIpRateLimiting();
```

#### For Supabase Auth
Supabase has built-in rate limiting:
- Login attempts: 30 per hour per IP
- Signup: 10 per hour per IP

Verify these are enabled in Supabase Dashboard → Authentication → Rate Limits.

---

## 4. Payment Tokens — 🟡 MEDIUM

### Current State
```csharp
// PaymentMethod.cs
public string ProviderToken { get; private set; } // Opaque token from Stripe
```

**Good practices already in place:**
- Field named `ProviderToken` (not raw PAN)
- Comment explicitly states: "Never the raw PAN"
- Only storing last 4 digits (`Last4`)
- No CVV, expiry month/year stored

### Questions
1. Is the `ProviderToken` encrypted at rest?
2. Is the Stripe webhook secret properly secured?
3. Are PCI compliance requirements being met?

### Recommendations
```sql
-- If using Supabase encryption
-- Enable column encryption for sensitive fields:
ALTER TABLE payment_methods 
ALTER COLUMN provider_token SET ENCRYPTION USING 'attenda-key';
```

---

## 5. Audit Trail — 🟡 MEDIUM

### Current State
```csharp
// Guest.AddLogEntry() — stores in Notes column as JSON
var entry = new { At = DateTime.UtcNow, Action = action, Detail = detail };
Notes = JsonSerializer.Serialize(log);
```

**Problems:**
- Log entries stored in a TEXT column (hard to query)
- No standard audit table with timestamps
- No user attribution (who made the change)

### Recommendations

#### Option A: Add Audit Table (Recommended)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying
CREATE INDEX ix_audit_logs_record 
ON audit_logs (table_name, record_id, created_at DESC);
```

#### Option B: Use Supabase Realtime
Enable Supabase Realtime to audit changes:
```javascript
supabase
  .channel('audit')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'guests' 
  }, handleChange)
  .subscribe();
```

---

## 6. Immediate Actions Checklist

### Before Going to Production

- [ ] **RLS**: Enable and configure Row Level Security on all tables
- [ ] **Password**: Verify hashing algorithm and strength requirements
- [ ] **Payment**: Review Stripe integration for PCI compliance
- [ ] **Rate Limit**: Configure API rate limiting
- [ ] **Secrets**: Move Supabase URL/key to environment variables
- [ ] **CORS**: Verify allowed origins in Program.cs
- [ ] **HTTPS**: Ensure all traffic is forced to HTTPS
- [ ] **Logging**: Review Serilog configuration (don't log sensitive data)

---

## References

- [Supabase RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Stripe PCI Compliance](https://stripe.com/docs/security)
