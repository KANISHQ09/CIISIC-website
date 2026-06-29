export interface NavItem {
  id: string;
  title: string;
  link: string;
  icon?: string;
  children?: NavItem[];
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}
