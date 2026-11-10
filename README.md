# CinePrompt Generator

Gerador de prompts cinematográficos a partir de imagem, usando Gemini pelo servidor.

**Estado:** projeto experimental de portfólio, com melhorias de reprodutibilidade e testes. Autor: Waly Robert.

## Executar

Requer Node.js 22.16 ou superior e npm.

```bash
npm ci
npm run build
npm start
```

Abra http://127.0.0.1:3001/. Em desenvolvimento, execute `npm run server` em um terminal e `npm run dev` em outro; o Vite usa proxy para a API.

Copie `.env.example` para `.env`, defina `GEMINI_API_KEY` e confirme um `GEMINI_MODEL` disponível na sua conta. Reinicie o servidor. O arquivo `.env` é ignorado pelo Git; a chave não deve ter prefixo `VITE_` nem ser enviada ao cliente.

O servidor escuta somente em loopback. Hospedagem compartilhada requer autenticação de usuários, limites por usuário, HTTPS e proxy com limite de corpo. Esta entrega não publica um serviço aberto de inferência. Gemini foi testado com transporte simulado, sem chave real/chamada paga.

## Recursos e limites

- Upload ou arrasto de imagem e termos adicionais opcionais.
- Resposta organizada por câmera, cena, características físicas, iluminação, movimento e estilo.
- Chave da API mantida exclusivamente no servidor Node.
- Validação de PNG/JPEG/WebP, limites de 5 MB/16 milhões de pixels e timeout.

Este aplicativo gera **texto de prompt**, não um arquivo de vídeo. Para analisar, a imagem é enviada ao Google. Não há resultado de IA simulado quando falta chave: a interface informa a configuração pendente. Nenhuma chave ou imagem pessoal acompanha o código.

## Verificação

```bash
npm test
npm run test:server
npm run build
```

O build verifica TypeScript antes de compilar. O CI repete os testes e build em Node.js 22. `package-lock.json` registra as versões instaladas. Testes de DOM usam APIs simuladas e não substituem validação real de codecs, permissões, hardware ou provedores externos.

## Origem e organização

Derivado do projeto do autor no Google AI Studio. Esta versão adiciona entrada Vite portátil, estilos Tailwind compilados localmente, limites e correções do fluxo principal. As alterações são locais; não substituem automaticamente a versão no Studio.

- `App.tsx` e `components/`: interface e fluxo da aplicação.
- `utils/` e/ou `services/`: conversão, validação ou integração.
- `tests/`: regressões do comportamento principal.
- `.github/workflows/ci.yml`: verificação automática.

## Dados e licenciamento

Use arquivos de exemplo sintéticos ou que você tenha autorização para compartilhar. Segredos, dependências instaladas e builds são excluídos do Git. As dependências/modelos mantêm suas próprias licenças. Uma licença de redistribuição para o código deste projeto ainda não foi definida pelo autor.


## Início e diagnóstico simplificados

Após `npm ci`, execute `npm run diagnostico` para verificar Node, dependências, build e presença de configuração sem revelar chaves ou consumir cota. Execute `npm run iniciar` para compilar a versão atual e abrir o servidor local em um único terminal. A faixa de estado da interface distingue configuração ausente e integração ainda não comprovada. Encontrar uma chave não confirma que ela é válida nem que existe cota gratuita. Nenhum teste de geração é iniciado automaticamente.
