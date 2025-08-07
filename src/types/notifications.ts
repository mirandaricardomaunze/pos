type NotificationType = 'success' | 'error' | 'warning' | 'info';


export interface NotificationsProps{
    message:string;
    type:NotificationType
    onClose:()=>void
}

export type NotificationState = {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: NotificationType;
}