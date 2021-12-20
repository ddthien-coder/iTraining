export interface NotificationMessage {
  type?: 'success'|'info'|'warning'|'danger',
  label: string, detail?: any, stacktrace?: string
}

export function showNotification(msg?: null|NotificationMessage) {
  if(!msg) return;
  console.log(`[]${msg.type}] ${msg.label}`);
}
