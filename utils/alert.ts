import { showMessage } from 'react-native-flash-message';

export const Alerts = {
	showAlertDanger: (message: string, description: string, duration = 3000) => {
		showMessage({
			message: message,
			description: description,
			type: 'danger',
			duration: duration,
			icon: 'danger',
		});
	},

	showAlertSuccess: (message: string, description: string, duration = 3000) => {
		showMessage({
			message: message,
			description: description,
			type: 'success',
			duration: duration,
			icon: 'success',
		});
	},

	showAlertWarning: (message: string, description: string, duration = 3000) => {
		showMessage({
			message: message,
			description: description,
			type: 'warning',
			duration: duration,
			icon: 'warning',
		});
	},

	showAlertDefault: (message: string, description: string, duration = 3000) => {
		showMessage({
			message: message,
			description: description,
			type: 'default',
			duration: duration,
			icon: 'default',
		});
	},

	showAlertInfo: (message: string, description: string, duration = 3000) => {
		showMessage({
			message: message,
			description: description,
			type: 'info',
			duration: duration,
			icon: 'info',
		});
	},
};
