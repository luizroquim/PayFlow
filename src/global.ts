import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* O Reset: Aplica em absolutamente todas as páginas do sistema */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  /* Garante que o fundo cubra tudo em qualquer página */
  body, html, #root {
    width: 100%;
    height: 100%;
    /* 🎯 Fundo original do seu sistema mantido */
    background-color: #e9eff5; 
    /* 🎯 Consumindo a cor de texto padrão do nosso theme.ts */
    color: ${({ theme }) => theme.colors.textMain};
  }

  /* Remove barra de rolagem horizontal que deforma o layout */
  body {
    overflow-x: hidden;
  }
`;