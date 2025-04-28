import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { Colors } from '@/constants/Colors';

export const LogoutButton = () => {
	const { signOut } = useAuth();

	const doLogout = () => {
		signOut();
	};

	return (
		<Pressable
			onPress={doLogout}
			style={{ marginRight: 10 }}
		>
			<Ionicons
				name='log-out-outline'
				size={24}
				color={Colors.primary}
			/>
		</Pressable>
	);
};

const TabsPage = () => {
	const { isSignedIn } = useAuth();

	return (
		<Tabs
			screenOptions={{
				headerStyle: {
					backgroundColor: Colors.primaryLight,
				},
				headerTintColor: Colors.primary,
				tabBarActiveTintColor: Colors.primary,
				tabBarInactiveTintColor: Colors.lightBorder,
			}}
		>
			<Tabs.Screen
				name='home'
				options={{
					headerTitle: 'Home',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='home-outline'
							size={size}
							color={color}
						/>
					),
					tabBarLabel: 'Home',
					headerRight: () => <LogoutButton />,
				}}
				redirect={!isSignedIn}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					headerTitle: 'My Profile',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='person-outline'
							size={size}
							color={color}
						/>
					),
					tabBarLabel: 'My Profile',
					headerRight: () => <LogoutButton />,
				}}
				redirect={!isSignedIn}
			/>
		</Tabs>
	);
};

export default TabsPage;
