import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TokenCache } from '@clerk/clerk-expo';

const createTokenCache = (): TokenCache => {
	return {
		getToken: async (key: string) => {
			try {
				return await SecureStore.getItemAsync(key);
			} catch (error) {
				console.error('secure store get item error: ', error);
				await SecureStore.deleteItemAsync(key);
				return null;
			}
		},
		saveToken: async (key: string, token: string) => {
			try {
				await SecureStore.setItemAsync(key, token);
			} catch (error) {
				console.error('Error saving token:', error);
				return;
			}
		},
	};
};

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;
