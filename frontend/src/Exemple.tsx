import { useCallback, useState } from "react";

function MonComposant() {
  const [compteur, setCompteur] = useState(0);

  const handleClick = useCallback(() => {
    setCompteur(compteur + 1);
  }, [compteur]);

  return (
    <div>
      <p>Compteur : {compteur}</p>
      <button onClick={handleClick}>Incrémenter</button>
    </div>
  );
}
export default MonComposant;
