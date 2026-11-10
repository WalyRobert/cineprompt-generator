# CinePrompt Generator

## Escolha de provedor e chave por aba

Imagens/OCR: Google Gemini, DeepSeek e OpenAI. Use modelos com visão. DeepSeek Flash aceita imagens; DeepSeek Pro é recusado localmente para esta função. A disponibilidade dos demais modelos depende da sua conta.

Abra **Configurar IA para imagens**, escolha provedor/modelo, informe sua chave e aplique a configuração. O destino ativo aparece também fora do painel.

A chave pessoal permanece apenas na memória desta página, sem localStorage, sessionStorage, arquivos ou logs do aplicativo. Recarregar/fechar exige configurar novamente. O campo é limpo ao aplicar; apagar o perfil remove a chave e interrompe a espera local. A remoção não desfaz solicitações já enviadas. Alterar provedor invalida a configuração anterior; não há fallback, reaproveitamento automático da chave de outro serviço ou repetição após erro.

**Verificar configuração sem gerar** verifica somente formato, destino e presença da chave localmente. Não contata o provedor, não comprova validade, acesso ao modelo nem cota gratuita. A geração só ocorre por ação explícita e pode consumir créditos. Os modelos iniciais são exemplos editáveis; disponibilidade e limites dependem da conta.

Opcionalmente escolha a chave do servidor de forma explícita e configure a variável do provedor no `.env`: `GEMINI_API_KEY`, `DEEPSEEK_API_KEY` ou `OPENAI_API_KEY`. Modelos são selecionados pela interface. As variáveis Gemini de modelo continuam atendendo clientes antigos da API sem seleção de provedor. Não publique `.env` reais.

O backend usa destinos HTTPS fixos, valida origem e função, limita corpo/resposta e prazo, e encaminha a chave somente em header para o serviço escolhido. A chave não entra no prompt, URL ou resposta. Não são aceitas URLs arbitrárias. Hospedagem compartilhada exige HTTPS e autenticação de usuários; o servidor padrão é local.

Testes de integração usam transporte controlado, sem geração externa ou consumo de créditos. `store: false` na OpenAI não é uma garantia de retenção zero pelo provedor; consulte as políticas de cada serviço.

Referências: [visão DeepSeek](https://api-docs.deepseek.com/guides/vision/), [OpenAI áudio](https://developers.openai.com/api/docs/guides/audio), [OpenAI TTS/PCM](https://developers.openai.com/api/docs/guides/text-to-speech), [Gemini](https://ai.google.dev/gemini-api/docs).


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
