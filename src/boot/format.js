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

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function obtenerPeriodicidad(numero) {
  switch (numero) {
    case 12:
      return "Mensual";
    case 6:
      return "Bimestral";
    case 4:
      return "Trimestral";
    case 2:
      return "Semestral";
    case 1:
      return "Anual";
    default:
      return "Desconocido";
  }
}

export const years = () => {
  const current = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => current - 2 + i);
};

export function formatFechaLarga(dateStr) {
  if (!dateStr) return "N/A";
  const cleanDate = dateStr.toString().substring(0, 10);
  const parts = cleanDate.split("-");
  if (parts.length !== 3) return dateStr;

  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parts[2].padStart(2, "0");

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  if (monthIdx < 0 || monthIdx > 11) return dateStr;

  return `${day} de ${meses[monthIdx]} del ${year}`;
}

export function formatFechaHora(dateStr) {
  if (!dateStr) return "N/A";
  const fecha = formatFechaLarga(dateStr);
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fecha;
    const hora = d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${fecha} a las ${hora}`;
  } catch (e) {
    return fecha;
  }
}


