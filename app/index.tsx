import React, { useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useSSO } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { Alerts } from '@/utils/alert';

const StartPage = () => {
	const router = useRouter();
	const { top } = useSafeAreaInsets();

	const { startSSOFlow } = useSSO();
	const [loading, setLoading] = useState(false);

	const openLink = async () => {
		WebBrowser.openBrowserAsync('http://magidacreativestudios.dev');
	};

	const handleGithub = async () => {
		setLoading(true);

		try {
			const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_github' });

			if (createdSessionId) {
				setActive!({ session: createdSessionId });
			}
		} catch (error) {
			Alerts.showAlertDanger('OAuth error: ', error instanceof Error ? error.message : String(error));
		} finally {
			setLoading(false);
		}
	};

	const handleGoogle = async () => {
		setLoading(true);

		try {
			const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google' });

			if (createdSessionId) {
				setActive!({ session: createdSessionId });
			}
		} catch (error) {
			Alerts.showAlertDanger('OAuth error: ', error instanceof Error ? error.message : String(error));
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={[styles.container, { paddingTop: top }]}>
			<Image
				source={require('@/assets/images/todoist-logo.png')}
				style={styles.loginImage}
			/>
			<Image
				source={require('@/assets/images/login.png')}
				style={styles.banner}
			/>
			<Text style={styles.title}>Organize your work and life, finally.</Text>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[styles.btn]}
					onPress={handleGithub}
				>
					<Ionicons
						name='logo-github'
						size={24}
					/>
					<Text style={[styles.btnText]}>Continue with Github</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.btn]}
					onPress={handleGoogle}
				>
					<Ionicons
						name='logo-google'
						size={24}
					/>
					<Text style={[styles.btnText]}>Continue with Google</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.btn]}
					onPress={() => router.replace('/(public)/login')}
				>
					<Ionicons
						name='mail-sharp'
						size={24}
					/>
					<Text style={[styles.btnText]}>Continue with Email</Text>
				</TouchableOpacity>

				<Text style={styles.description}>
					By continuing you agree to Todoist's{' '}
					<Text
						style={styles.link}
						onPress={openLink}
					>
						Terms of Service
					</Text>{' '}
					and{' '}
					<Text
						style={styles.link}
						onPress={openLink}
					>
						Privacy Policy
					</Text>
					.
				</Text>
			</View>
		</View>
	);
};

export default StartPage;

const styles = StyleSheet.create({
	container: {
		gap: 40,
		marginTop: 20,
	},
	loginImage: {
		height: 40,
		resizeMode: 'contain',
		alignSelf: 'center',
	},
	banner: {
		height: 280,
		resizeMode: 'contain',
	},
	title: {
		marginHorizontal: 50,
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	buttonContainer: {
		gap: 20,
		marginHorizontal: 40,
	},
	btn: {
		flexDirection: 'row',
		padding: 12,
		borderRadius: 6,
		gap: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: Colors.lightBorder,
		borderWidth: StyleSheet.hairlineWidth,
	},
	btnText: {
		fontSize: 20,
		fontWeight: '500',
	},
	description: {
		fontSize: 12,
		textAlign: 'center',
		color: Colors.lightText,
	},
	link: {
		color: Colors.lightText,
		fontSize: 12,
		textAlign: 'center',
		textDecorationLine: 'underline',
	},
});
