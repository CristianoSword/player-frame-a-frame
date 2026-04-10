
# ▶ player frame a frame

Visualizador de vídeo quadro a quadro — roda direto no navegador, sem dependências.
Link: https://cristianosword.github.io/player-frame-a-frame/

![HTML puro](https://img.shields.io/badge/HTML-puro-333) ![sem instalação](https://img.shields.io/badge/sem-instalação-333) ![pt-BR](https://img.shields.io/badge/lang-pt--BR-333)

---
![2026-04-10 15_31_52-Player Frame a Frame - Brave](https://github.com/user-attachments/assets/591baa10-187e-4d1b-9322-29eb4d5ccbc4)


## Sobre

Ferramenta para análise precisa de vídeos, quadro a quadro. Útil para animação, análise de movimento, revisão de cenas e qualquer situação que exija controle exato sobre o tempo de reprodução.

---

## Como usar

Abra o arquivo `player_frame_a_frame.html` em qualquer navegador moderno. Nenhuma instalação ou servidor necessário.

Carregue um vídeo arrastando o arquivo para a área indicada ou clicando nela para abrir o seletor. Formatos suportados: `MP4`, `WebM`, `MOV`, `AVI` — e qualquer outro aceito pelo navegador.

---

## Controles

| Controle | Descrição |
|---|---|
| barra de progresso | Navega para qualquer ponto do vídeo arrastando o slider. |
| prev / next | Avança ou recua exatamente um frame com base no FPS configurado. |
| play / pause | Inicia ou pausa a reprodução em tempo real. |
| velocidade | Slider de ⅛× a 8×. Suporta reprodução reversa (valores negativos). |
| FPS | Define a duração de cada frame para os controles de passo. Padrão: 24 fps. |
| loop | Ativa repetição automática ao atingir o início ou fim do vídeo. |

---

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `←` `→` | Recua / avança um frame |
| `espaço` | Play / pause |

---

## Informações exibidas

| Campo | Descrição |
|---|---|
| frame | Número do frame atual calculado a partir do tempo e do FPS. |
| tempo | Posição atual em segundos com precisão de milissegundos. |
| duração | Duração total do vídeo. |
| resolução | Largura × altura em pixels. |

---

## Notas técnicas

O vídeo é renderizado em um `<canvas>` sobreposto ao elemento `<video>`, permitindo leitura precisa dos frames. O arquivo permanece local — nenhum dado é enviado para servidores.

A precisão da navegação quadro a quadro depende da capacidade do navegador de buscar frames intermediários. Vídeos sem keyframes frequentes podem apresentar imprecisões em saltos longos.
