import { useOAuth } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

enum Strategy {
    google = "oauth_google",
    apple = "oauth_apple",
}
const Page = () => {

    const router = useRouter()
    const { startOAuthFlow: googleAuth } = useOAuth({ strategy: Strategy.google })
    const { startOAuthFlow: appleAuth } = useOAuth({ strategy: Strategy.apple })

    const onSelectAuth = async (strategy: Strategy) => {
        const selectedAuth = {
            [Strategy.apple]: appleAuth,
            [Strategy.google]: googleAuth
        }[strategy]


        try {
            const { createdSessionId, setActive } = await selectedAuth()
            if (createdSessionId) {
                setActive!({ session: createdSessionId })
                router.back()
            }
        } catch (error) {
            console.error("Oauth error: " + error)
        }
    }
    return (
        <ScrollView className="flex-1 ">
            <View className="py-6 px-4 gap-y-10">
                <View className="gap-y-4 items-center">
                    <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-4xl mt-6">Login</Text>
                    <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-center text-gray-500">By Continuing you agree to the terms and conditions of Wordle</Text>
                </View>
                <View>
                    <Text style={{ fontFamily: "Poppins_300Lights" }} className="text-sm mb-2">Email</Text>
                    <TextInput className="border border-slate-700 rounded-sm py-5 px-6">

                    </TextInput>
                    <TouchableOpacity className="bg-black rounded-sm items-center py-4 mt-6">
                        <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-white text-lg">
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.separatorView}>
                    <View
                        style={{
                            flex: 1,
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                    <Text>OR</Text>
                    <View
                        style={{
                            flex: 1,
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                </View>
                <View className="gap-y-4">
                    <TouchableOpacity className="flex-row flex-1 items-center justify-center border border-slate-700 rounded-sm py-4" onPress={() => onSelectAuth(Strategy.google)}>
                        <Ionicons size={20} name="logo-google" />
                        <Text style={{ fontFamily: "Poppins_500Medium" }} className="ml-2 text-lg">Sign in with google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row flex-1 items-center justify-center border border-slate-700 rounded-sm py-4" onPress={() => onSelectAuth(Strategy.google)}>
                        <Ionicons size={20} name="logo-apple" />
                        <Text style={{ fontFamily: "Poppins_500Medium" }} className="ml-2 text-lg">Sign in with apple</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}
export default Page


const styles = StyleSheet.create({
    separatorView: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    }
})