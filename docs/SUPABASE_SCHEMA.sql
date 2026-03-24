/*
  ORAVIA PRO: SUPABASE DATABASE SCHEMA
  
  Executar este script no SQL Editor do seu projeto Supabase para configurar:
  1. Tabela 'simulations'
  2. Row Level Security (RLS)
  3. Políticas de acesso seguro
*/

-- 1. Criar a tabela de simulações
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    inputs JSONB NOT NULL,
    results JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadados opcionais
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Habilitar RLS (Segurança de Linha)
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso
-- POLÍTICA: Usuários podem ver apenas suas próprias simulações (OU simulações públicas)
CREATE POLICY "Users can view their own simulations or public ones" 
ON public.simulations 
FOR SELECT 
USING (
    auth.uid() = user_id OR is_public = true
);

-- POLÍTICA: Usuários podem inserir apenas se estiverem logados e o user_id for o deles
CREATE POLICY "Users can insert their own simulations" 
ON public.simulations 
FOR INSERT 
WITH CHECK (
    auth.uid() = user_id
);

-- POLÍTICA: Usuários podem deletar apenas suas próprias simulações
CREATE POLICY "Users can delete their own simulations" 
ON public.simulations 
FOR DELETE 
USING (
    auth.uid() = user_id
);

-- POLÍTICA: Usuários podem atualizar apenas suas próprias simulações
CREATE POLICY "Users can update their own simulations" 
ON public.simulations 
FOR UPDATE 
USING (
    auth.uid() = user_id
) 
WITH CHECK (
    auth.uid() = user_id
);

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_simulations_user_id ON public.simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_simulations_is_public ON public.simulations(is_public);
CREATE INDEX IF NOT EXISTS idx_simulations_timestamp ON public.simulations(timestamp DESC);

-- 5. Trigger para atualizar o campo updated_at automaticamente (Opcional)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_simulations_updated_at
BEFORE UPDATE ON public.simulations
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

/*
   NOTAS ADICIONAIS:
   - Para definir papéis (Roles), você pode adicionar uma coluna 'role' nos metadados do auth.users.
   - Oraia Pro utiliza o campo 'is_public' para habilitar os links de visualização compartilhada.
*/
