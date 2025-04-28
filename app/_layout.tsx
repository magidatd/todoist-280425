import { Slot } from 'expo-router';
import { tokenCache } from '@/utils/cache';
import { ClerkProvider } from '@clerk/clerk-expo';
import FlashMessage from 'react-native-flash-message';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
	throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

const RootLayoutNav = () => {
	return (
		<ClerkProvider
			publishableKey={publishableKey}
			tokenCache={tokenCache}
		>
			<Slot />
			<FlashMessage position='top' />
		</ClerkProvider>
	);
};

export default RootLayoutNav;
