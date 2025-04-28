import { Colors } from '@/constants/Colors';
import { useSignUp } from '@clerk/clerk-expo';
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

const RegisterPage = () => {
	const { isLoaded, signUp, setActive } = useSignUp();
	const router = useRouter();

	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const passwordValidation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-~]).{8,16}$/;

	const onSignUpPress = async () => {
		if (!isLoaded) {
			return;
		}
		setLoading(true);

		if (!passwordValidation.test(password)) {
			Alerts.showAlertDanger('Error', 'Password doesnt meet requirements');
			setTimeout(function () {
				setLoading(false);
			}, 3000);

			return;
		}

		if (password !== confirmPassword) {
			Alerts.showAlertDanger('Error', 'Passwords do not match');
			setTimeout(function () {
				setLoading(false);
			}, 3000);

			return;
		}

		try {
			// Create the user on Clerk
			await signUp.create({
				emailAddress,
				password,
			});

			// Send verification Email
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

			// change the UI to verify the email address
			setPendingVerification(true);
		} catch (err: any) {
			// alert(err.errors[0].message);
		} finally {
			setLoading(false);
		}
	};

	const onPressVerify = async () => {
		if (!isLoaded) {
			return;
		}
		setLoading(true);

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			});

			await setActive({ session: completeSignUp.createdSessionId });
		} catch (err: any) {
			alert(err.errors[0].message);
		} finally {
			setLoading(false);
		}
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const toggleShowPasswordConfirm = () => {
		setShowPasswordConfirm(!showPasswordConfirm);
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
						<Text style={styles.headerHeading}>Sign Up</Text>
						<Text style={styles.headerSubHeading}>Fill in information below to create an account.</Text>
					</View>

					<View style={styles.fieldsContainer}>
						{!pendingVerification && (
							<>
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
								<View style={styles.inputControl}>
									<Ionicons
										name='lock-closed-outline'
										size={24}
										style={styles.fieldIcon}
									/>
									<TextInput
										autoCapitalize='none'
										autoCorrect={false}
										placeholder='confirm password'
										value={confirmPassword}
										onChangeText={setConfirmPassword}
										secureTextEntry={!showPasswordConfirm}
										style={styles.inputField}
									/>
									<TouchableOpacity onPress={toggleShowPasswordConfirm}>
										{showPasswordConfirm ? (
											<Ionicons
												name='eye-outline'
												size={24}
												color={Colors.primaryLight}
												style={styles.passwordVisibilityIcon}
											/>
										) : (
											<Ionicons
												name='eye-off-outline'
												size={24}
												color={Colors.primaryLight}
												style={styles.passwordVisibilityIcon}
											/>
										)}
									</TouchableOpacity>
								</View>

								<View style={{ marginTop: 20 }}>
									<TouchableOpacity
										style={styles.signupButton}
										onPress={onSignUpPress}
									>
										<Text style={styles.signupButtonText}>Sign up</Text>
									</TouchableOpacity>
								</View>
							</>
						)}

						{pendingVerification && (
							<>
								<View style={styles.inputControl}>
									<Ionicons
										name='shield-checkmark-outline'
										size={24}
										style={styles.fieldIcon}
									/>
									<TextInput
										autoFocus={true}
										autoCapitalize='none'
										autoCorrect={false}
										placeholder='code...'
										value={code}
										onChangeText={setCode}
										style={styles.inputField}
									/>
								</View>

								<View style={{ marginTop: 20 }}>
									<TouchableOpacity
										style={styles.signupButton}
										onPress={onPressVerify}
									>
										<Text style={styles.signupButtonText}>Verify Email</Text>
									</TouchableOpacity>
								</View>
							</>
						)}

						<Link
							href='/login'
							asChild
							style={styles.centeredLinkContainer}
						>
							<Pressable style={styles.loginAccountButton}>
								<Text style={styles.linkText}>Already have an account? </Text>
								<Text style={styles.textHighlight}>Sign in here</Text>
							</Pressable>
						</Link>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default RegisterPage;

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
		fontFamily: 'Nunito',
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
		flex: 1,
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
	passwordVisibilityIcon: {
		alignSelf: 'flex-end',
	},
	signupButton: {
		marginTop: 20,
		backgroundColor: Colors.primaryLight,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		paddingHorizontal: 10,
		height: 50,
		borderRadius: 8,
	},
	signupButtonText: {
		color: Colors.primary,
		fontSize: 18,
	},
	centeredLinkContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 20,
	},
	loginAccountButton: {
		flex: 1,
		flexDirection: 'row',
	},
	linkText: {
		fontSize: 16,
		color: Colors.lightText,
	},
	textHighlight: {
		fontSize: 16,
		color: Colors.primary,
	},
});
