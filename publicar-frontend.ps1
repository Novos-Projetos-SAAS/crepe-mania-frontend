# Execute este script dentro da pasta RAIZ do frontend.
# Requisitos: Git para Windows e autenticacao no GitHub.
$ErrorActionPreference = 'Stop'
$repo = 'crepe-mania-frontend'
$remoteEsperado = 'https://github.com/Novos-Projetos-SAAS/' + $repo + '.git'
$raiz = $PSScriptRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Git nao encontrado. Instale o Git para Windows antes de continuar.'
}
if (-not (Test-Path -LiteralPath (Join-Path $raiz 'package.json'))) {
    throw 'package.json nao encontrado. Coloque este script na raiz do projeto, junto com package.json e src.'
}

Push-Location -LiteralPath $raiz
try {
    if (-not (Test-Path -LiteralPath '.git')) {
        & git init -b main
        if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel inicializar o Git.' }
    }

    $remotes = @(& git remote)
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel verificar os remotes Git.' }
    if ($remotes -contains 'origin') {
        $urlAtual = (& git remote get-url origin).Trim()
        if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel ler o remote origin.' }
        $atualNormalizada = $urlAtual -replace '^git@github.com:', 'https://github.com/' -replace '\.git$', ''
        $esperadaNormalizada = $remoteEsperado -replace '\.git$', ''
        if ($atualNormalizada -ine $esperadaNormalizada) {
            throw "O remote origin aponta para OUTRO repositorio: $urlAtual. Nada foi publicado."
        }
    } else {
        & git remote add origin $remoteEsperado
        if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel configurar o remote origin.' }
    }

    & git branch -M main
    if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel selecionar a branch main.' }

    # Inclui os arquivos da pasta atual e subpastas, respeitando o .gitignore.
    & git add -A
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao adicionar arquivos ao Git.' }

    & git diff --cached --quiet
    $diffStatus = $LASTEXITCODE
    if ($diffStatus -eq 1) {
        & git commit -m 'feat: publicacao inicial Crepe Mania'
        if ($LASTEXITCODE -ne 0) {
            throw 'Falha no commit. Confira git config user.name e git config user.email.'
        }
    } elseif ($diffStatus -ne 0) {
        throw 'Falha ao verificar alteracoes do Git.'
    } else {
        Write-Host 'Sem alteracoes novas para commitar.'
    }

    # Nao usa --force: se houver commits remotos inesperados, o Git interrompe.
    & git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        throw 'Falha no push. Confirme autenticacao/permissoes e se o repositorio remoto nao tem commits divergentes.'
    }

    Write-Host "PUBLICADO: https://github.com/Novos-Projetos-SAAS/$repo"
    Write-Host 'Os arquivos foram enviados diretamente para a raiz do repositorio.'
} finally {
    Pop-Location
}
