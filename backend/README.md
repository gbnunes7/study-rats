# 🧠 MVP - App de Estudo (Gymrats para Estudo)

## 📋 Requisitos Funcionais (RF)

- **RF001** - O sistema deve permitir o cadastro de novos usuários via e-mail e senha. Feito
- **RF002** - O sistema deve permitir o login de usuários usando e-mail/senha ou Google Login. 1/2 feto
- **RF003** - O sistema deve permitir que o usuário preencha/atualize seu perfil com nome, foto, matérias de interesse e bio curta. Feito
- **RF004** - O sistema deve permitir que um usuário crie grupos de estudo, informando nome, descrição, matérias focadas e se o grupo será público ou privado. Feito
- **RF005** - O sistema deve listar grupos públicos disponíveis para que os usuários possam visualizá-los e solicitar entrada. Feito
- **RF006** - O sistema deve permitir a entrada em grupos privados apenas via link de convite. Feito
- **RF007** - O sistema deve permitir que membros de um grupo enviem mensagens de texto em tempo real via chat. 
- **RF008** - O sistema deve armazenar o histórico de mensagens enviadas no grupo.
- **RF009** - O sistema deve permitir visualizar o perfil básico de outros usuários dentro dos grupos. Feito
- **RF010** - O sistema deve fazer upload e armazenamento de fotos de perfil dos usuários na AWS S3.

---

## 📋 Requisitos Não Funcionais (RNF)

- **RNF001** - A API deve ser desenvolvida em **Node.js** utilizando **Express** para alta performance.
- **RNF002** - A comunicação em tempo real no chat deve ser feita usando **WebSocket (Socket.io)**.
- **RNF003** - O banco de dados relacional deve ser **PostgreSQL** hospedado na **AWS RDS**.
- **RNF004** - O sistema deve ser implantado em ambiente cloud, como **AWS EC2** ou **Elastic Beanstalk**.
- **RNF005** - O sistema deve utilizar **Context API** ou **Redux** no frontend para gerenciamento de estado de autenticação e usuário.
- **RNF006** - A autenticação deve seguir boas práticas de segurança, incluindo hashing de senhas (ex: bcrypt).
- **RNF007** - O sistema deve garantir uma latência mínima aceitável no chat em tempo real, podendo usar **Redis** para otimizar caso necessário.
- **RNF008** - As fotos de perfil devem ter limite de tamanho e formato permitido (ex: JPG, PNG, até 5MB).
- **RNF009** - A API deve seguir princípios de arquitetura **RESTful** para as rotas HTTP.
- **RNF010** - A comunicação de autenticação deve ser segura, usando **HTTPS** e **JWT** para sessões.

---

## 📋 Regras de Negócio (RN)

- **RN001** - Um usuário não pode criar mais de 5 grupos de estudo simultaneamente (limite para o MVP). ok
- **RN002** - Grupos públicos podem ser acessados e entrados livremente pelos usuários logados. ok
- **RN003** - Grupos privados só podem ser acessados através de link de convite válido. ok
- **RN004** - Apenas o criador (owner) do grupo pode alterar ou excluir o grupo.
- **RN005** - O chat do grupo deve ser acessível apenas para membros que fazem parte do grupo.
- **RN006** - O conteúdo das mensagens deve ser apenas de texto no MVP (sem mídia ou anexos). 
- **RN007** - Usuários podem atualizar sua foto, bio e matérias de interesse a qualquer momento.
- **RN008** - Usuários devem aceitar os Termos de Uso e Política de Privacidade no cadastro.
- **RN009** - Mensagens enviadas no chat devem ser persistidas no banco de dados imediatamente após o envio.
- **RN010** - Usuários banidos de um grupo não podem mais visualizar ou interagir com o grupo.

---
