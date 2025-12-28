
-- 1. Extend Roles (app_role enum)
-- No Supabase, se já existir o tipo enum, não podemos usar IF NOT EXISTS direto no CREATE TYPE.
-- Usamos um bloco DO para adicionar os valores.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('admin', 'editor', 'author', 'columnist', 'contributor', 'user');
    ELSE
        -- Adiciona novos valores se não existirem
        BEGIN
            ALTER TYPE app_role ADD VALUE 'author';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE app_role ADD VALUE 'columnist';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE app_role ADD VALUE 'contributor';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE app_role ADD VALUE 'user';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- 2. Enhance Profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- 3. Create index for slug
CREATE INDEX IF NOT EXISTS profiles_slug_idx ON public.profiles(slug);

-- 4. Update existing profiles with a slug and email if possible
-- Nota: Isso é um chute inicial, o email vem do auth.users geralmente
UPDATE public.profiles p
SET 
  slug = lower(regexp_replace(COALESCE(p.name, 'usuario'), '[^a-zA-Z0-9]+', '-', 'g')),
  email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.slug IS NULL OR p.email IS NULL);

-- 5. Update the handle_new_user function to be more complete
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, slug, is_public)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'),
    new.email,
    lower(regexp_replace(COALESCE(new.raw_user_meta_data->>'name', 'usuario-' || substr(new.id::text, 1, 8)), '[^a-zA-Z0-9]+', '-', 'g')),
    true
  );
  
  -- Atribui role default se desejar (opcional)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update posts table to link to profiles (author_id)
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id);

-- 7. Migrate existing posts from columnist_id to author_id if we have a match
-- Isso requer que os colunistas sejam criados como usuários primeiro.
-- Por enquanto, vamos apenas permitir os dois campos.

-- 8. Add Audit Columns to Posts
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS last_editor_id UUID REFERENCES public.profiles(id);

-- 9. Enable RLS for Profiles correctly
-- Usuários podem ver perfis públicos, admins veem tudo, usuários veem seu próprio perfil completo.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true OR auth.uid() = id OR (SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 10. Roles RLS
DROP POLICY IF EXISTS "Roles are viewable by admins" ON user_roles;
CREATE POLICY "Roles are viewable by admins" ON user_roles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  );
