
export interface OrderRequest {
  name: string;
  phone: string;
  service?: string;
  type: 'order' | 'consultation';
}

/** Стандартный ответ от сервера */
export interface DefaultResponse {
  error: boolean;
  message: string;
}
