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
    background-color: #e9eff5; /* Cor padrão do fundo do sistema */
  }

  /* Remove barra de rolagem horizontal que deforma o layout */
  body {
    overflow-x: hidden;
  }
`;