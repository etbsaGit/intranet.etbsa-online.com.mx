export function formatPhoneNumber(phoneNumber) {
  // Eliminar cualquier carácter que no sea un dígito
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Aplicar el formato (###)-###-####
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]})-${match[2]}-${match[3]}`;
  }

  // Si no coincide con el patrón esperado, devolver el número sin formato
  return cleaned;
}
