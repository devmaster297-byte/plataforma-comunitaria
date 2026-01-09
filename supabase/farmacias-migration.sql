-- Tabela de farmácias de plantão
CREATE TABLE public.farmacias_plantao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  whatsapp TEXT,
  horario_inicio TEXT NOT NULL,
  horario_fim TEXT NOT NULL,
  dias_semana TEXT[] NOT NULL, -- ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']
  ativa BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.farmacias_plantao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Farmácias visíveis para todos"
  ON public.farmacias_plantao FOR SELECT
  USING (ativa = true);

CREATE POLICY "Apenas admins podem gerenciar farmácias"
  ON public.farmacias_plantao FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Índice
CREATE INDEX idx_farmacias_ativa ON public.farmacias_plantao(ativa);
CREATE INDEX idx_farmacias_ordem ON public.farmacias_plantao(ordem);

-- Trigger para updated_at
CREATE TRIGGER update_farmacias_plantao_updated_at
  BEFORE UPDATE ON public.farmacias_plantao
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
