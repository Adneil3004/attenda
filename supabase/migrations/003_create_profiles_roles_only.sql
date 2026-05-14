-- =============================================
-- PROFILES TABLE - Solo Roles
-- =============================================

DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_name TEXT NOT NULL UNIQUE,
  description TEXT,
  estatus TEXT NOT NULL DEFAULT 'active' CHECK (estatus IN ('active', 'inactive')),
  created_date TIMESTAMPTZ DEFAULT NOW(),
  modified_date TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar registros de roles
INSERT INTO profiles (profile_name, description, estatus) VALUES
('admin', 'Administrador - Acceso total a todos los eventos y configuraciones', 'active'),
('co_admin', 'Co-Administrador - Puede gestionar eventos asignados pero no pagos', 'active'),
('viewer', 'Visor - Solo puede ver el plan del evento', 'active');

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read profiles" ON profiles
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Admins can modify profiles" ON profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN auth.users u ON u.id = auth.uid()
      WHERE p.profile_name = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN auth.users u ON u.id = auth.uid()
      WHERE p.profile_name = 'admin'
    )
  );