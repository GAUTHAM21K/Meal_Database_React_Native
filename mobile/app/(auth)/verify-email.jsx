import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import SignUp from "./sign-up";
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";

const VerifyEmail = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleVerify = async () => {
    if (!code) {
      Alert.alert("Please enter the verification code sent to your email.");
      return;
    }
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        setActive({ session: signUpAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Email verification not complete");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify email. Please try again.");
      console.log("Error during email verification: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView style={authStyles.keyboardView} behavior="height">
        <ScrollView style={authStyles.scrollContent}>
          <View style={authStyles.container}>
            <View style={authStyles.imageContainer}>
              <Image
                style={authStyles.image}
                source={require("../../assets/images/i3.png")}
              ></Image>
            </View>

            <View style={authStyles.formContainer}>
              <Text style={authStyles.title}>Verify Your Email</Text>

              <Text style={authStyles.subtitle}>
                A verification code has been sent to
                {email}.
              </Text>

              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Verification Code"
                  placeholderTextColor={COLORS.textLight}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                />
              </View>

              <TouchableOpacity
                style={authStyles.authButton}
                onPress={handleVerify}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>
                  {loading ? "Verifying..." : "Verify Email"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
