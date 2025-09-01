## Como executar

1. Copie o arquivo `apps/server/.env-example` para `apps/server/.env`. Esse arquivo já inclui a URL do banco de dados Neon utilizada pelo projeto.
2. Instale as dependências e prepare o banco com dados de exemplo:

   ```bash
   pnpm setup
   ```

3. Em terminais separados, suba o backend e o frontend:

   ```bash
   pnpm --filter server dev
   pnpm --filter web dev
   ```

O banco é populado com um organizador (`Teste@teste.com` / `123456`), cinco participantes e eventos demonstrativos. A tela de login já vem preenchida com essas credenciais para agilizar os testes.

---

Tópicos

1. **Funcionalidades Essenciais**
   - **Criação de eventos**: workshops, palestras, aulas, etc.
   - **Limitação de vagas**: Definir número máximo de participantes ou deixar vagas ilimitadas.
   - **Exibição de informações**: Nome do evento, data, local e disponibilidade de vagas.
   - **Inscrição e confirmação**: Confirmação automática da inscrição, com envio de notificação.
   - **Relatório em tempo real**: Mostrar atualizações imediatas sobre inscrições.
   - **Armazenamento de dados**: Guardar cadastros de participantes para uso futuro.

2. **Tipos de Usuários**
   - **Participante**: Apenas insere-se no evento e visualiza suas inscrições.
   - **Visualizador**: Pode ver as inscrições e relatórios.
   - **Organizador**: Cria e gerencia eventos (vagas, inscrições, etc.), com controle total.

3. **Fluxo de Inscrições**
   - **Cadastro de usuário**: Participante cria uma conta com informações básicas.
   - **Escolha de eventos**: Participante visualiza eventos e faz a inscrição.
   - **Confirmação e relatório**: Inscrição é confirmada e os dados atualizados no relatório em tempo real.
   - **Eventos futuros**: Usuários podem usar o mesmo cadastro para novos eventos.

4. **Gestão de Eventos**
   - **Criação dinâmica de eventos**: Organizador insere título, descrição, data, local, vagas disponíveis, e tipo de evento.
   - **Limitação ou disponibilidade de vagas**: O organizador decide se o evento terá vagas limitadas ou ilimitadas.
   - **Edição e cancelamento**: Possibilidade de alterar ou cancelar o evento.
   - **Monitoramento em tempo real**: Visualizador pode acompanhar as inscrições e status dos eventos.

5. **Facilidade e Intuitividade**
   - **Interface amigável**: Simples e rápida para criar eventos e inscrições.
   - **Filtros de busca**: Para facilitar a localização de eventos por data, tipo, ou vagas disponíveis.
   - **Notificações e lembretes**: Sistema para lembrar usuários de eventos futuros e confirmar inscrições.

---

### Roadmap de Desenvolvimento

#### Fase 1: **Planejamento e Design**
   - Definir os requisitos do sistema e funcionalidades essenciais.
   - Desenhar wireframes para interface do usuário (UI).
   - Escolher tecnologias e frameworks para desenvolvimento (front-end, back-end e banco de dados).

#### Fase 2: **Desenvolvimento do Backend**
   - Criar estrutura do banco de dados (usuários, eventos, inscrições, relatórios).
   - Implementar a lógica de autenticação e tipos de usuários (participante, visualizador, organizador).
   - Desenvolver API para gerenciar eventos, inscrições e relatórios.
   - Implementar controle de vagas e verificação de disponibilidade.

#### Fase 3: **Desenvolvimento do Frontend**
   - Desenvolver a interface de criação de eventos para organizadores.
   - Criar interface de inscrição para participantes, mostrando os detalhes dos eventos.
   - Desenvolver dashboard de relatórios para visualizadores e organizadores.
   - Adicionar notificações para inscrições confirmadas e eventos futuros.

#### Fase 4: **Testes e Validação**
   - Testar funcionalidades de inscrições, limitações de vagas, e geração de relatórios.
   - Validar fluxo de usuário para garantir a facilidade de uso.
   - Implementar testes de carga para garantir que o sistema suporte múltiplos usuários simultâneos.

#### Fase 5: **Lançamento e Feedback**
   - Lançar a primeira versão com os recursos essenciais.
   - Coletar feedback de usuários para melhorar a interface e performance.
   - Monitorar erros e ajustar funcionalidades conforme necessário.

#### Fase 6: **Aprimoramentos e Novos Recursos**
   - Adicionar integração com e-mails para notificações automáticas.
   - Implementar filtros de busca avançados para eventos.
   - Melhorar a interface de relatórios com gráficos e insights detalhados.

---
