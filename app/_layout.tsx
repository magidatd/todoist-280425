import { Slot, useRouter, useSegments } from 'expo-router';
import { tokenCache } from '@/utils/cache';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import FlashMessage from 'react-native-flash-message';
import { useEffect } from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
	throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

const InitialLayout = () => {
	const { isLoaded, isSignedIn } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	// If the user is signed in, redirect them to the home page
	// If the user is not signed in, redirect them to the login page
	useEffect(() => {
		if (!isLoaded) return;

		const inTabsGroup = segments[0] === '(auth)';

		if (isSignedIn && !inTabsGroup) {
			router.replace('/home');
		} else if (!isSignedIn) {
			router.replace('/');
		}
	}, [isSignedIn]);

	return <Slot />;
};

const RootLayoutNav = () => {
	return (
		<ClerkProvider
			publishableKey={publishableKey}
			tokenCache={tokenCache}
		>
			<InitialLayout />
			<FlashMessage position='top' />
		</ClerkProvider>
	);
};

export default RootLayoutNav;
