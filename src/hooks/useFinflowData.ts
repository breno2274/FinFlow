// Hook que sincroniza os componentes React com as alteracoes
//  no LocalStorage

import { useState, useEffect } from 'react';

// Dispara atualizacoes reativas na interface sempre
// que os dados financeiros forem modificados
export function useFinflowData(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleDataChanged = () => {
      setVersion(v => v + 1);
    };

    window.addEventListener('finflow-data-changed',
       handleDataChanged);
    return () => {
      window.removeEventListener('finflow-data-changed',
         handleDataChanged);
    };
  }, []);

  return version;
}

