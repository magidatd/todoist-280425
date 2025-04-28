import { Colors } from '@/constants/Colors';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	TextInput,
	Image,
	Pressable,
	Text,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	SafeAreaView,
	Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { Alerts } from '@/utils/alert';

const LoginPage = () => {
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();

	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const [showPassword, setShowPassword] = useState(false);

	const onSignInPress = async () => {
		if (!isLoaded) {
			return;
		}

		setLoading(true);

		try {
			const completeSignIn = await signIn.create({
				identifier: emailAddress,
				password,
			});

			// This indicates the user is signed in
			await setActive({ session: completeSignIn.createdSessionId });
		} catch (err: any) {
			//alert(err.errors[0].message);
			if (err.errors[0].message === 'is missing') err.errors[0].message = 'Email is missing';
			Alerts.showAlertDanger('Error', err.errors[0].message);
		} finally {
			setLoading(false);
		}
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
				<ScrollView>
					<Spinner visible={loading} />
					<View style={styles.backButtonContainer}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.push('/')}
						>
							<Ionicons
								name='chevron-back-outline'
								size={24}
								color={Colors.primary}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.headerContainer}>
						<Image
							source={require('@/assets/images/todoist-logo.png')}
							style={styles.logoImage}
						/>
						<Text style={styles.headerHeading}>Sign In</Text>
						<Text style={styles.headerSubHeading}>Fill in information below to get into account.</Text>
					</View>

					<View style={styles.fieldsContainer}>
						<View style={styles.inputControl}>
							<Ionicons
								name='mail-outline'
								size={24}
								style={styles.fieldIcon}
							/>
							<TextInput
								autoFocus={true}
								autoCapitalize='none'
								autoCorrect={false}
								placeholder='user@example.com'
								value={emailAddress}
								onChangeText={setEmailAddress}
								style={styles.inputField}
							/>
						</View>
						<View style={styles.inputControl}>
							<Ionicons
								name='lock-closed-outline'
								size={24}
								style={styles.fieldIcon}
							/>
							<TextInput
								autoCapitalize='none'
								autoCorrect={false}
								placeholder='password'
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								style={styles.inputField}
							/>
							<TouchableOpacity onPress={toggleShowPassword}>
								{showPassword ? (
									<Ionicons
										name='eye-outline'
										size={24}
										color={Colors.primaryLight}
									/>
								) : (
									<Ionicons
										name='eye-off-outline'
										size={24}
										color={Colors.primaryLight}
									/>
								)}
							</TouchableOpacity>
						</View>

						<Link
							href='/reset'
							asChild
							style={styles.linkContainer}
						>
							<Pressable style={styles.forgotPasswordButton}>
								<Text style={styles.linkText}>Forgot password?</Text>
							</Pressable>
						</Link>

						<View style={{ marginTop: 20 }}>
							<TouchableOpacity
								style={styles.loginButton}
								onPress={onSignInPress}
							>
								<Text style={styles.loginButtonText}>Sign in</Text>
							</TouchableOpacity>
						</View>

						<Link
							href='/register'
							asChild
							style={styles.centeredLinkContainer}
						>
							<Pressable style={styles.createAccountButton}>
								<Text style={styles.linkText}>Don't have an account? </Text>
								<Text style={styles.textHighlight}>Sign up here</Text>
							</Pressable>
						</Link>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default LoginPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	backButtonContainer: {
		flex: 1,
		paddingVertical: 20,
		paddingHorizontal: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButton: {
		padding: 8,
		borderRadius: 10,
		marginLeft: 8,
		backgroundColor: Colors.primaryLight,
	},
	headerContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoImage: {
		height: 50,
		resizeMode: 'contain',
	},
	headerHeading: {
		textAlign: 'center',
		paddingTop: 20,
		fontSize: 50,
		fontWeight: 'bold',
		color: Colors.primary,
		fontFamily: 'Lato-Hairline.ttf',
	},
	headerSubHeading: {
		textAlign: 'center',
		paddingTop: 10,
		fontSize: 16,
		color: Colors.dark,
	},
	fieldsContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingTop: 45,
		paddingBottom: 35,
		gap: 20,
	},
	inputControl: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		height: 50,
		backgroundColor: Colors.lightBorder,
		borderRadius: 8,
		paddingHorizontal: 10,
		borderColor: Colors.lightText,
		borderWidth: 1,
	},
	fieldIcon: {
		marginRight: 5,
		color: Colors.primaryLight,
	},
	inputField: {
		flex: 1,
		fontSize: 18,
		height: '100%',
	},
	linkContainer: {
		flex: 1,
	},
	forgotPasswordButton: {
		alignSelf: 'flex-end',
	},
	linkText: {
		fontSize: 16,
		color: Colors.lightText,
	},
	loginButton: {
		marginTop: 20,
		backgroundColor: Colors.primaryLight,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		paddingHorizontal: 10,
		height: 50,
		borderRadius: 8,
	},
	loginButtonText: {
		color: Colors.primary,
		fontSize: 18,
	},
	centeredLinkContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 20,
	},
	createAccountButton: {
		flex: 1,
		flexDirection: 'row',
	},
	textHighlight: {
		fontSize: 16,
		color: Colors.primary,
	},
});
