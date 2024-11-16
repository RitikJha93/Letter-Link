import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logo from '@/assets/icons/logo.png';
import { Link } from "expo-router";
import { format } from 'date-fns'
import { useCallback, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SubscribeModal from "@/components/SubscribeModal";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { size } from "@/constants/size";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
export default function Index() {

  const subscribeModalRef = useRef<BottomSheetModal>(null)
  const { signOut } = useAuth()
  const handleSubscribeModalPress = useCallback(() => {
    subscribeModalRef.current?.present();
  }, []);

  return (
    <View style={styles.container}>

      <SubscribeModal ref={subscribeModalRef} />
      <LinearGradient colors={["#09281D", "#0C3E2D", "#155A40", "#166248"]} style={{ height: size.HEIGHT }} className="absolute left-0 right-0 bottom-0 top-0">
        <Animated.View style={styles.header} entering={FadeInDown}>
          <Image source={logo} className="w-20 h-20" />
          <Text className="mt-2 text-white" style={styles.title} >Wordle</Text>
          <Text style={styles.text}>Get chances to guess a 5-letter word</Text>
        </Animated.View>

        <View style={styles.menu}>
          <Link href={"/game"} style={[styles.btn, { backgroundColor: "#000" }]} asChild>
            <AnimatedTouchableOpacity entering={FadeInLeft}>
              <Text style={[styles.btnText, styles.playBtnText]}>Play</Text>
            </AnimatedTouchableOpacity>
          </Link>
          <SignedOut>
            <Link href={"/login"} asChild>
              <AnimatedTouchableOpacity entering={FadeInLeft} style={styles.btn}>
                <Text style={styles.btnText}>Login</Text>
              </AnimatedTouchableOpacity>
            </Link>
          </SignedOut>

          <SignedIn>
            <AnimatedTouchableOpacity entering={FadeInLeft.delay(100)} onPress={() => signOut()} style={styles.btn}>
              <Text style={styles.btnText}>Signout</Text>
            </AnimatedTouchableOpacity>
          </SignedIn>
          <AnimatedTouchableOpacity entering={FadeInLeft.delay(200)} onPress={handleSubscribeModalPress} style={styles.btn}>
            <Text style={styles.btnText}>Subscribe</Text>
          </AnimatedTouchableOpacity>
        </View>

        <Animated.View entering={FadeInLeft.delay(300)} className="py-6">
          <Text style={{ fontFamily: "Poppins_600SemiBold" }} className="text-lg">{format(new Date(), "PPP")}</Text>
        </Animated.View>
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
    borderWidth: 1,
    borderColor: "black",
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
