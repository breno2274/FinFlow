import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configura o empacotador Vite com suporte a React e caminhos relativos para GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './'
});

