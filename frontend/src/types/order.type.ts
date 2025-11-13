
export interface OrderRequest {
  name: string;
  phone: string;
  service?: string;
  type: 'order' | 'consultation';
}

export interface DefaultResponse {
  error: boolean;
  message: string;
}
