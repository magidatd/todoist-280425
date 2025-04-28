import { Stack } from 'expo-router';
import React from 'react';

const PublicLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='login'></Stack.Screen>
			<Stack.Screen name='register'></Stack.Screen>
			<Stack.Screen name='reset'></Stack.Screen>
		</Stack>
	);
};

export default PublicLayout;
