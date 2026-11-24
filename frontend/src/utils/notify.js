import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.min.css';

alertify.set('notifier', 'position', 'bottom-center');
alertify.set('notifier', 'delay', 3);

export const notify = {
  success: (message) => alertify.success(message),
  error: (message) => alertify.error(message),
  info: (message) => alertify.message(message),
};
