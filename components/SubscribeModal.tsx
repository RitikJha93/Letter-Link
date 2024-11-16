import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetView, useBottomSheetModal } from "@gorhom/bottom-sheet"
import { forwardRef, useCallback, useMemo } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import gameImg from '@/assets/icons/games.png'

import disc from '@jsamr/counter-style/presets/disc';
import MarkedList from '@jsamr/react-native-li';

const BENEFITS = [
    'Enjoy full access to Wordle, Spelling Bee, The Crossword and more.',
    'Play new puzzles every day for concentration or relaxation.',
    'Strengthen your strategy with WordleBot.',
    'Unlock over 10,000 puzzles in our Wordle, Spelling Bee and crossword archives.',
    'Track your stats and streaks on any device.',
];
export type Ref = BottomSheetModal
const SubscribeModal = forwardRef<Ref>((props, ref) => {
    const snapPoints = useMemo(() => ["75%"], [])
    const { dismiss } = useBottomSheetModal()
    const { bottom } = useSafeAreaInsets()

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                opacity={0.2}
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                onPress={dismiss}
            />
        ),
        []
    );
    return (
        <BottomSheetModal handleComponent={null} index={0} backdropComponent={renderBackdrop} snapPoints={snapPoints} ref={ref}>
            <BottomSheetView className="flex-1 py-4 px-4">
                <View style={[styles.headerContainer, { paddingBottom: bottom }]} className="flex flex-row justify-between items-center">
                    <Link href={"/login"}>
                        <TouchableOpacity>
                            <Text style={styles.headerText} className="text-xl">LOG IN</Text>
                        </TouchableOpacity>
                    </Link>
                    <TouchableOpacity onPress={() => dismiss()}>
                        <Ionicons style={styles.closeIcon} name="close" />
                    </TouchableOpacity>
                </View>

                <BottomSheetScrollView>
                    <Text style={styles.heroText}>Unlimited Play.{'\n'} Try free for 7 days</Text>
                    <Image style={styles.gameImg} source={gameImg} />

                    <View style={{ marginVertical: 20 }}>
                        <MarkedList counterRenderer={disc} lineStyle={{
                            marginVertical: 10,
                            gap: 10,
                            paddingHorizontal: 30
                        }}>
                            {BENEFITS.map((benefit, i) => (
                                <Text style={styles.listItem}>{benefit}</Text>
                            ))}
                        </MarkedList>
                    </View>

                    <View style={{ paddingBottom: bottom }}>
                        <TouchableOpacity className="bg-black rounded-md py-5 items-center justify-center">
                            <Text style={{fontFamily : "Poppins_500Medium"}} className="text-slate-100 text-xl text-center">
                                Try Free for 7 days
                            </Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetScrollView>
            </BottomSheetView>
        </BottomSheetModal>

    )
})
export default SubscribeModal

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    headerText: {
        fontSize: 18,
        fontFamily: "Poppins_500Medium"
    },
    closeIcon: {
        fontSize: 18,
    },
    heroText: {
        fontSize: 34,
        marginTop: 18,
        marginBottom: 12,
        fontFamily: "Poppins_700Bold",
        textAlign: "center"
    },
    gameImg: {
        width: "90%",
        height: 40,
        alignSelf: "center"
    },
    listItem: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular"
    }
})
