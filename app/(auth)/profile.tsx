import {
	View,
	Text,
	Button,
	TextInput,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { Alerts } from '@/utils/alert';
import { Colors } from '@/constants/Colors';

const ProfilePage = () => {
	const { user } = useUser();
	const [firstName, setFirstName] = useState(user?.firstName);
	const [lastName, setLastName] = useState(user?.lastName);

	const [loading, setLoading] = useState(false);

	const onSaveUser = async () => {
		try {
			await user?.update({
				firstName: firstName!,
				lastName: lastName!,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		// <View style={styles.container}>
		// 	<Text style={{ textAlign: 'center' }}>
		// 		Good morning {user?.firstName} {user?.lastName}!
		// 	</Text>

		// 	<TextInput
		// 		placeholder='First Name'
		// 		value={firstName || ''}
		// 		onChangeText={setFirstName}
		// 		style={styles.inputField}
		// 	/>
		// 	<TextInput
		// 		placeholder='Last Name'
		// 		value={lastName || ''}
		// 		onChangeText={setLastName}
		// 		style={styles.inputField}
		// 	/>
		// 	<Button
		// 		onPress={onSaveUser}
		// 		title='Update account'
		// 		color={'#6c47ff'}
		// 	></Button>
		// </View>
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
				<ScrollView>
					<Spinner visible={loading} />
					<Text style={{ textAlign: 'center', fontSize: 20 }}>
						Good morning {user?.firstName} {user?.lastName}!
					</Text>

					<View style={styles.fieldsContainer}>
						<View style={styles.inputControl}>
							<TextInput
								autoFocus={true}
								autoCapitalize='none'
								autoCorrect={false}
								placeholder='First Name'
								value={firstName || ''}
								onChangeText={setFirstName}
								style={styles.inputField}
							/>
						</View>
						<View style={styles.inputControl}>
							<TextInput
								autoCapitalize='none'
								autoCorrect={false}
								placeholder='Last Name'
								value={lastName || ''}
								onChangeText={setLastName}
								style={styles.inputField}
							/>
						</View>

						<View style={{ marginTop: 20 }}>
							<TouchableOpacity
								style={styles.saveUserButton}
								onPress={onSaveUser}
							>
								<Text style={styles.saveUserButtonText}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ProfilePage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		paddingTop: 40,
	},
	fieldsContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingTop: '50%',
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
	inputField: {
		flex: 1,
		fontSize: 18,
		height: '100%',
	},
	saveUserButton: {
		marginTop: 20,
		backgroundColor: Colors.primaryLight,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		paddingHorizontal: 10,
		height: 50,
		borderRadius: 8,
	},
	saveUserButtonText: {
		color: Colors.primary,
		fontSize: 18,
	},
});
