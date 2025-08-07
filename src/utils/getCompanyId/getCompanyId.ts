import { jwtDecode } from "jwt-decode";


interface DecodedToken {
  companyId: number;
}

export function getCompanyIdFromToken(): number | null {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(user);
    return decoded.companyId;
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return null;
  }
}
