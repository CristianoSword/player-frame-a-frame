# ▶ player frame a frame

<h4 align="center">
    <p>
        <b>Português</b> |
        <a href="./README.md">English</a>
    </p>
</h4>

Visualizador de video quadro a quadro que roda direto no navegador, sem dependencias.  
Link: https://cristianosword.github.io/player-frame-a-frame/

![HTML only](https://img.shields.io/badge/HTML-only-333)
![no install](https://img.shields.io/badge/no-install-333)
![lang](https://img.shields.io/badge/lang-EN%20%7C%20PT--BR-333)

---

![Player preview](https://github.com/user-attachments/assets/b0d70042-9676-447a-aeeb-95b24cc9fe5c)

## Sobre

Ferramenta para análise precisa de vídeos, quadro a quadro. Útil para animação, análise de movimento, revisão de cenas e qualquer fluxo que precise de controle exato da reprodução.

## Como usar

Abra `index.html` em qualquer navegador moderno. Não precisa instalar nada nem subir servidor local.

Carregue um vídeo arrastando para a área de envio ou clicando para abrir o seletor de arquivos. Os formatos suportados incluem `MP4`, `WebM`, `MOV`, `AVI` e qualquer outro aceito pelo navegador.

## Controles

| Controle | Descrição |
|---|---|
| barra de progresso | Navega para qualquer ponto do vídeo arrastando o slider. |
| prev / next | Avança ou recua exatamente um frame com base no FPS configurado. |
| play / pause | Inicia ou pausa a reprodução em tempo real. |
| velocidade | Vai de `-8x` a `8x`, incluindo reprodução reversa. |
| volume | Ajusta o nível do áudio ou alterna o mudo. |
| snapshot | Captura e baixa o frame atual como uma imagem PNG. |
| FPS | Define a duração de cada frame para os controles de passo. Padrão: 24 fps. |
| loop | Ativa repetição automática ao atingir o início ou fim do vídeo. |

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `←` `→` ou `J` `L` | Recua / avança um frame |
| `espaco` ou `K` | Play / pause |
| `M` | Alterna mudo |
| `1-7` | Seleção rápida de velocidade (0.25x a 4x) |

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
