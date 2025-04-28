import {
	View,
	Text,
	SafeAreaView,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Platform,
	TouchableOpacity,
	Image,
	TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Spinner from 'react-native-loading-spinner-overlay';
import { Alerts } from '@/utils/alert';

const ResetPage = () => {
	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [code, setCode] = useState('');
	const [successfulCreation, setSuccessfulCreation] = useState(false);
	const { signIn, setActive } = useSignIn();

	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);
	const passwordValidation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-~]).{8,16}$/;

	// Request a passowrd reset code by email
	const onRequestReset = async () => {
		setLoading(true);

		try {
			await signIn!.create({
				strategy: 'reset_password_email_code',
				identifier: emailAddress,
			});
			setSuccessfulCreation(true);
			Alerts.showAlertInfo('Info', 'Password reset request sent');
		} catch (err: any) {
			Alerts.showAlertDanger('Error', err.errors[0].message);
		} finally {
			setLoading(false);
		}
	};

	// Reset the password with the code and the new password
	const onReset = async () => {
		setLoading(true);

		if (!passwordValidation.test(password)) {
			Alerts.showAlertDanger('Error', 'Password doesnt meet requirements');
			setTimeout(function () {
				setLoading(false);
			}, 3000);

			return;
		}

		try {
			const result = await signIn!.attemptFirstFactor({
				strategy: 'reset_password_email_code',
				code,
				password,
			});
			console.log(result);
			Alerts.showAlertSuccess('Success', 'Password reset successfully');

			// Set the user session active, which will log in the user automatically
			await setActive!({ session: result.createdSessionId });
		} catch (err: any) {
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
						<Text style={styles.headerHeading}>Reset Password</Text>
						<Text style={styles.headerSubHeading}>Fill in information below to reset your password.</Text>
					</View>

					<View style={styles.fieldsContainer}>
						{!successfulCreation && (
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

								<View style={{ marginTop: 20 }}>
									<TouchableOpacity
										style={styles.signupButton}
										onPress={onRequestReset}
									>
										<Text style={styles.signupButtonText}>Send reset email</Text>
									</TouchableOpacity>
								</View>
							</>
						)}

						{successfulCreation && (
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

								<View style={{ marginTop: 20 }}>
									<TouchableOpacity
										style={styles.signupButton}
										onPress={onReset}
									>
										<Text style={styles.signupButtonText}>Set new password</Text>
									</TouchableOpacity>
								</View>
							</>
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ResetPage;

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
});
