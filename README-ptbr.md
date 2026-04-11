# ▶ player frame a frame

[Read in English](./README.md)

Visualizador de video quadro a quadro que roda direto no navegador, sem dependencias.  
Link: https://cristianosword.github.io/player-frame-a-frame/

![HTML only](https://img.shields.io/badge/HTML-only-333)
![no install](https://img.shields.io/badge/no-install-333)
![lang](https://img.shields.io/badge/lang-EN%20%7C%20PT--BR-333)

---

![Player preview](https://github.com/user-attachments/assets/591baa10-187e-4d1b-9322-29eb4d5ccbc4)

## Sobre

Ferramenta para analise precisa de videos, quadro a quadro. Util para animacao, analise de movimento, revisao de cenas e qualquer fluxo que precise de controle exato da reproducao.

## Como usar

Abra `index.html` em qualquer navegador moderno. Nao precisa instalar nada nem subir servidor local.

Carregue um video arrastando para a area de envio ou clicando para abrir o seletor de arquivos. Os formatos suportados incluem `MP4`, `WebM`, `MOV`, `AVI` e qualquer outro aceito pelo navegador.

## Controles

| Controle | Descricao |
|---|---|
| barra de progresso | Navega para qualquer ponto do video arrastando o slider. |
| prev / next | Avanca ou recua exatamente um frame com base no FPS configurado. |
| play / pause | Inicia ou pausa a reproducao em tempo real. |
| velocidade | Vai de `-8x` a `8x`, incluindo reproducao reversa. |
| FPS | Define a duracao de cada frame para os controles de passo. Padrao: 24 fps. |
| loop | Ativa repeticao automatica ao atingir o inicio ou fim do video. |

## Atalhos de teclado

| Tecla | Acao |
|---|---|
| `←` `→` | Recua / avanca um frame |
| `espaco` | Play / pause |

Os atalhos sao ignorados quando um campo editavel esta com foco.

## Informacoes exibidas

| Campo | Descricao |
|---|---|
| frame | Numero do frame atual calculado a partir do tempo e do FPS. |
| tempo | Posicao atual em segundos com precisao de milissegundos. |
| duracao | Duracao total do video. |
| resolucao | Largura x altura em pixels. |

## Desenvolvimento

O codigo principal foi separado em:

- `index.html`: estrutura da pagina.
- `style/main.css`: estilos.
- `player-core.js`: funcoes puras da logica do player.
- `app.js`: integracao com DOM, eventos, estado e traducoes.

## Testes

```bash
npm test
```

## Notas tecnicas

O video e renderizado em um `<canvas>` sobreposto ao elemento `<video>`, permitindo leitura precisa dos frames. Os arquivos permanecem locais e nao sao enviados para servidores.

A precisao da navegacao quadro a quadro depende da forma como o navegador busca frames no video. Arquivos com poucos keyframes podem apresentar imprecisao em saltos longos.
