// Ponto de entrada da aplicacao carregando folhas de estilo e renderizando o React no DOM

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Importa todas as camadas do sistema de design preservando 100% dos estilos e neumorfismo
import './css/tokens.css';
import './css/reset.css';
import './css/base.css';
import './css/layout.css';
import './css/components.css';
import './css/pages.css';
import './css/responsive.css';

// Monta a aplicacao no elemento raiz com checagem estrita de renderizacao
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

