# Publicar novo repositório na organização

O repositório deve ser criado **vazio** em `Novos-Projetos-SAAS` com o nome `crepe-mania-frontend` (não use template nem inicialize README, pois já existe neste código).

No terminal, dentro da pasta extraída de `crepe-mania-frontend`:

```bash
git init -b main
git add .
git commit -m "feat: iniciar Crepe Mania a partir da base Shirley"
git remote add origin https://github.com/Novos-Projetos-SAAS/crepe-mania-frontend.git
git push -u origin main
```

Não coloque `.env` / `.env.local`, credenciais, bancos ou `node_modules` no commit (as regras do `.gitignore` foram mantidas). O push exige autenticação GitHub e permissão de escrita na organização. Publicar no GitHub **não equivale** a fazer deploy no Render/Vercel; são etapas separadas.
