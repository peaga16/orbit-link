/**
 * Combina classes CSS ignorando valores vazios.
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Formata número como moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata data em formato brasileiro
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Gera um slug a partir de uma string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Valida URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Trunca texto com ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Calcula taxa de conversão
 */
export function calculateConversionRate(clicks: number, views: number): number {
  if (views === 0) return 0;
  return (clicks / views) * 100;
}

/**
 * Formata número com separador de milhares
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Delay em ms (para testes ou animations)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copia texto para clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detecta se é mobile
 */
export function isMobile(): boolean {
  return typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 768px)').matches
    : false;
}

/**
 * Gera uma chave Pix aleatória (UUID)
 */
export function generatePixKey(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Calcula tempo atrás (ex: "2 horas atrás")
 */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' anos atrás';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' meses atrás';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' dias atrás';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' horas atrás';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutos atrás';

  return 'Agora mesmo';
}

/**
 * Sanitiza entrada HTML (simples)
 */
export function sanitizeHtml(html: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return html.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Gera cor aleatória em hex
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

/**
 * Calcula contraste de cor (simples)
 */
export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? '#000000' : '#FFFFFF';
}

/**
 * Tipo para resposta de API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Cria resposta de sucesso
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Cria resposta de erro
 */
export function errorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  };
}
