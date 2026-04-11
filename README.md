# ▶ player frame a frame

Visualizador de video quadro a quadro. Roda direto no navegador, sem dependencias.
Link: https://cristianosword.github.io/player-frame-a-frame/

![HTML puro](https://img.shields.io/badge/HTML-puro-333)
![sem instalacao](https://img.shields.io/badge/sem-instala%C3%A7%C3%A3o-333)
![pt-BR](https://img.shields.io/badge/lang-pt--BR-333)

---

![Preview do player](https://github.com/user-attachments/assets/591baa10-187e-4d1b-9322-29eb4d5ccbc4)

## Sobre

Ferramenta para analise precisa de videos, quadro a quadro. Util para animacao, analise de movimento, revisao de cenas e qualquer situacao que exija controle exato sobre o tempo de reproducao.

## Como usar

Abra o arquivo `index.html` em qualquer navegador moderno. Nenhuma instalacao ou servidor necessario.

Carregue um video arrastando o arquivo para a area indicada ou clicando nela para abrir o seletor. Formatos suportados: `MP4`, `WebM`, `MOV`, `AVI` e qualquer outro aceito pelo navegador.

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

- `index.html`: estrutura e estilos.
- `player-core.js`: funcoes puras da regra de negocio.
- `app.js`: integracao com DOM, eventos e estado do player.

## Testes

```bash
npm test
```

## Notas tecnicas

O video e renderizado em um `<canvas>` sobreposto ao elemento `<video>`, permitindo leitura precisa dos frames. O arquivo permanece local: nenhum dado e enviado para servidores.

A precisao da navegacao quadro a quadro depende da capacidade do navegador de buscar frames intermediarios. Videos sem keyframes frequentes podem apresentar imprecisoes em saltos longos.
