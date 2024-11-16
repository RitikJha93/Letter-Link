import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logo from '@/assets/icons/logo.png';
import { Link } from "expo-router";
import { format } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SubscribeModal from "@/components/SubscribeModal";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Animated, { FadeInDown, FadeInLeft, ZoomIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { size } from "@/constants/size";
import { Colors } from "@/constants/colors"
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const initialWords = [
  'SOLVE',
  'FRESH',
  'BASIC',
  'WORDS',
  'DAILY'
]

export default function Index() {

  const subscribeModalRef = useRef<BottomSheetModal>(null)
  const [rows, setRows] = useState<string[][]>(new Array(5).fill(new Array(5).fill("")))

  const { signOut } = useAuth()
  const handleSubscribeModalPress = useCallback(() => {
    subscribeModalRef.current?.present();
  }, []);

  useEffect(() => {
    const newRows = [...rows.map(row => [...row])]
    initialWords.forEach((word, wordIndex) => {
      const letter = word.split('');
      letter.forEach((letter, letterIdx) => {
        newRows[wordIndex][letterIdx] = letter
      })
    })
    setRows(newRows)
  }, [])


  const getBackgroundColor = (rowIndex: number, cellIndex: number) => {
    const size = initialWords.length
    if (rowIndex === 4 || rowIndex === 2 && cellIndex === 1) {
      return Colors.green
    } else if (rowIndex === 0 && cellIndex === 2 || rowIndex === 2 && cellIndex === 3 || rowIndex === 3 && cellIndex === 3) {
      return Colors.yellow
    }
    return Colors.grey
    // if (initialWords[size - 1])
  }
  return (
    <View style={styles.container}>
      <SubscribeModal ref={subscribeModalRef} />
      <LinearGradient colors={["#09281D", "#0C3E2D", "#155A40", "#166248"]} style={{ height: size.HEIGHT }} className="absolute left-0 right-0 bottom-0 top-0">
        <View className="items-center gap-10 mt-16">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-4xl">WORDLE</Text>
          <View className="items-center">
            {
              rows.map((row, rowIndex) => (
                <Animated.View className="flex-row gap-5" key={`row-${rowIndex}`}>
                  {
                    row.map((cell, cellIndex) => (
                      <Animated.View
                        key={`cell-${rowIndex}-${cellIndex}`}
                        entering={ZoomIn.delay(50 * cellIndex)}
                        style={
                          [
                            {
                              width: size.WIDTH / 7, height: size.WIDTH / 7,
                              backgroundColor: getBackgroundColor(rowIndex, cellIndex)
                            },
                          ]
                        }
                        className="rounded-lg gap-4 justify-center mb-4"
                      >
                        <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-3xl text-center text-white uppercase">{cell}</Text>
                      </Animated.View>
                    ))
                  }
                </Animated.View>
              ))
            }
          </View>

          <View className="gap-4">
            <LinearGradient style={{ width: size.WIDTH - 40, borderRadius: 30, paddingVertical: 4, alignItems: "center" }} colors={[Colors.greenGrad1, Colors.greenGrad2]}>
              <Link href={"/game"} asChild>
                <AnimatedTouchableOpacity entering={FadeInLeft} style={styles.btn}>
                  <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-white text-2xl">Play</Text>
                </AnimatedTouchableOpacity>
              </Link>
            </LinearGradient>

            <SignedIn>
              <LinearGradient style={{ width: size.WIDTH - 40, borderRadius: 30, paddingVertical: 4, alignItems: "center" }} colors={[Colors.greyGrad1, Colors.greyGrad2]}>
                <AnimatedTouchableOpacity onPress={() => signOut()} entering={FadeInLeft} style={styles.btn}>
                  <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-white text-2xl">Signout</Text>
                </AnimatedTouchableOpacity>
              </LinearGradient>
            </SignedIn>

            <SignedOut>
              <LinearGradient style={{ width: size.WIDTH - 40, borderRadius: 30, paddingVertical: 4, alignItems: "center" }} colors={[Colors.greyGrad1, Colors.greyGrad2]}>
                <Link href={"/login"} asChild>
                  <AnimatedTouchableOpacity entering={FadeInLeft} style={styles.btn}>
                    <Text style={{ fontFamily: "Poppins_500Medium" }} className="text-white text-2xl">Login</Text>
                  </AnimatedTouchableOpacity>
                </Link>
              </LinearGradient>
            </SignedOut>

            <LinearGradient style={{ width: size.WIDTH - 40, borderRadius: 30, paddingVertical: 4, alignItems: "center" }} colors={[Colors.whiteGrad1, Colors.whiteGrad2]}>
              <AnimatedTouchableOpacity onPress={handleSubscribeModalPress} entering={FadeInLeft} style={styles.btn}>
                <Text style={{ fontFamily: "Poppins_500Medium", color: Colors.green }} className="text-2xl">Subscribe</Text>
              </AnimatedTouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 20,
    // paddingVertical: 20
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  header: {
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins_600SemiBold",
  },
  text: {
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
  menu: {
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  footer: {},
  btn: {
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 200,
  },
  btnText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
  playBtnText: {
    color: "white",
  },
});
