export function getOperator(phone: string): string {
    const cleanedPhone = phone.replace(/\s+/g, ''); // Supprimer les espaces
    if (/^(\+261|0)(34|38)/.test(cleanedPhone)) {
      return 'YAS';
    } else if (/^(\+261|0)33/.test(cleanedPhone)) {
      return 'Airtel';
    } else if (/^(\+261|0)(32|37)/.test(cleanedPhone)) {
      return 'Orange';
    } else {
      return 'Inconnu'; // Si le numéro ne correspond à aucun opérateur
    }
  }