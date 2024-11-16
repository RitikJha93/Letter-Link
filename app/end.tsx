import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import winImg from '@/assets/icons/win.png'
import logo from '@/assets/icons/logo.png'
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"
import { Colors } from "@/constants/colors"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { FIRESTORE_DB } from "@/utils/firebaseConfig"
import ConfettiCannon from 'react-native-confetti-cannon';

const Page = () => {
    const { win, word, gameField } = useLocalSearchParams<{
        win: string;
        word: string;
        gameField: string;
    }>()

    const [userScore, setUserScore] = useState({
        played: 0,
        wins: 0,
        currentStreak: 0,
    })

    const { user } = useUser()

    useEffect(() => {
        if (user) {
            updateHighScore()
        }
    }, [])

    const updateHighScore = async () => {
        console.log("High score updated", user)

        if (!user) return

        const docRef = doc(FIRESTORE_DB, `highscore/${user.id}`)
        const docSnap = await getDoc(docRef)

        let newScore = {
            played: 1,
            wins: win === "true" ? 1 : 0,
            lastGame: win === "true" ? 'win' : 'loss',
            currentStreak: win === "true" ? 1 : 0
        }

        if (docSnap.exists()) {
            const data = docSnap.data()

            newScore = {
                played: data.played + 1,
                wins: win === "true" ? data.wins + 1 : data.wins,
                lastGame: win === "true" ? 'win' : "loss",
                currentStreak: win === "true" && data.lastGame === 'win' ? data.currentStreak + 1 : win === "true" ? 1 : 0
            }
        }

        await setDoc(docRef, newScore)

        setUserScore(newScore)
    }
    const navigateRoot = () => {
        router.dismissAll()
        router.push("/")
    }

    const shareGame = () => {

    }
    return (
        <View className="flex-1 items-center py-16 px-4 bg-white">
            {
                win === 'true' &&
                <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
            }

            <TouchableOpacity
                onPress={navigateRoot}
                style={{
                    alignSelf: 'flex-end',
                }}>
                <Ionicons name="close" size={30} />
            </TouchableOpacity>

            <View className="items-center">
                {
                    win === 'true' ?
                        <Image source={winImg} /> :
                        <Image source={logo} className="w-20 h-20" />
                }
                <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-3xl text-center mt-4">
                    {win === "true" ? "Congratulations" : "Better Luck Next Time!"}
                </Text>
            </View>

            <SignedIn>
                <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-2xl mt-4">Statistics</Text>
                <View className="flex-row justify-around gap-14 mt-2">
                    <View className="items-center gap-y-1">
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-xl">{userScore?.played}</Text>
                        <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-lg">Played</Text>
                    </View>
                    <View className="items-center gap-y-1">
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-xl">{userScore?.wins}</Text>
                        <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-lg">Wins</Text>
                    </View>
                    <View className="items-center gap-y-1">
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-xl">{userScore?.currentStreak}</Text>
                        <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-lg">Current Streak</Text>
                    </View>
                </View>
            </SignedIn>

            <SignedOut>
                <View className="w-full px-10 items-center gap-y-4 mt-6">
                    <View>
                        <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-xl">Want to see your stats and streaks</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/login")} className="bg-black rounded-[30px] items-center py-4 w-full">
                        <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-white text-lg">
                            Create a Free account
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/login")}>
                        <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-center underline">Already Registered? Login</Text>
                    </TouchableOpacity>
                </View>
            </SignedOut>

            <View
                className="mt-6"
                style={{
                    height: StyleSheet.hairlineWidth,
                    width: '100%',
                    backgroundColor: '#4e4e4e',
                }}
            />

            <TouchableOpacity style={{ backgroundColor: Colors.green }} className="rounded-3xl items-center w-1/2 flex-row py-4 justify-center mt-4" onPress={shareGame}>
                <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-center text-white text-2xl me-2">Share</Text>
                <Ionicons name="share-social" size={24} color="#fff" />
            </TouchableOpacity>
        </View >
    )
}
export default Page