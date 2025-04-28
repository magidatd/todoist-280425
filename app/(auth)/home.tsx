import { View, Text } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';

const HomePage = () => {
	const { user } = useUser();

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingBottom: 20 }}>Home Page</Text>
			<Text>Welcome, {user?.emailAddresses[0].emailAddress} 🎉</Text>
		</View>
	);
};

export default HomePage;
