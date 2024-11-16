import OnScreenKeyboard, { BACKSPACE, ENTER } from "@/components/OnScreenKeyboard"
import { Colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Stack, useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Dimensions, Text, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import { words } from "@/utils/target-words"
import { allWords } from "@/utils/all-words"
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, ZoomIn } from "react-native-reanimated"
import { size } from "@/constants/size"

const ROWS = 6
const Page = () => {

    const [word, setword] = useState(words[Math.floor(Math.random()) * words.length])
    console.log(word)
    // const [word, setWord] = useState("ritik")
    const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill('')))
    const [curRow, setCurRow] = useState(0)
    const [curCol, _setCurCol] = useState(0)
    const router = useRouter()
    const colStateRef = useRef(curCol)
    const wordLetters = word.split('');

    const setCurCol = (col: number) => {
        colStateRef.current = col
        _setCurCol(col)
    }
    const [greenLetters, setGreenLetters] = useState<string[]>([])
    const [yellowLetters, setYellowLetters] = useState<string[]>([])
    const [greyLetters, setGreyLetters] = useState<string[]>([])

    const onKeySelected = (key: string) => {
        console.log(key)
        const newRows = [...rows.map(row => [...row])]
        if (key === ENTER) {
            checkWord()
        } else if (key === BACKSPACE) {
            if (colStateRef.current === 0) {
                newRows[curRow][0] = ''
                setRows(newRows)
                return
            }
            newRows[curRow][colStateRef.current - 1] = ''
            setCurCol(colStateRef.current - 1)
            setRows(newRows)
            return
        } else if (colStateRef.current >= newRows[curRow].length) {
            return
        } else {
            newRows[curRow][colStateRef.current] = key
            setRows(newRows)
            setCurCol(colStateRef.current + 1)
        }
    }

    const checkWord = () => {
        const currentWord = rows[curRow].join('')

        if (currentWord.length < word.length) {
            console.log("Not reached yet!")
            shakeRow()
            return
        }

        if (!allWords.includes(word)) {
            console.log("Not a word!")
            shakeRow()
            // return
        }

        flipRow()
        const newGreen: string[] = [];
        const newYellow: string[] = [];
        const newGrey: string[] = [];

        currentWord.split('').forEach((letter, index) => {
            console.log(letter, wordLetters[index])
            if (letter === wordLetters[index]) {
                newGreen.push(letter)
            } else if (wordLetters.includes(letter)) {
                newYellow.push(letter)
            } else {
                newGrey.push(letter)
            }
        })

        setGreenLetters([...greenLetters, ...newGreen]);
        setYellowLetters([...yellowLetters, ...newYellow]);
        setGreyLetters([...greyLetters, ...newGrey]);

        setTimeout(() => {
            if (currentWord === word) {
                console.log("WINNER : Word found")
                router.push(`/end?win=true&word${word}&gameField=${JSON.stringify(rows)}`)
            }
            else if (curRow + 1 >= rows.length) {
                console.log("Game Over")
                router.push(`/end?win=false&word${word}&gameField=${JSON.stringify(rows)}`)
            }
        }, 1500);

        setCurRow(curRow + 1);
        setCurCol(0)
    }

    const setCellColor = (cellValue: string, cellNo: number, rowNo: number) => {
        if (curRow >= rowNo) {
            if (wordLetters[cellNo] === cellValue) {
                cellBackgrounds[rowNo][cellNo].value = withDelay(
                    cellNo * 100,
                    withTiming(Colors.green)
                )
            } else if (wordLetters.includes(cellValue)) {
                cellBackgrounds[rowNo][cellNo].value = withDelay(
                    cellNo * 100,
                    withTiming(Colors.yellow)
                )
            } else {
                cellBackgrounds[rowNo][cellNo].value = withDelay(
                    cellNo * 100,
                    withTiming(Colors.grey)
                )
            }
        } else {
            cellBackgrounds[rowNo][cellNo].value = withTiming(Colors.cellColor, { duration: 100 })
        }
    }

    //shaking animation
    const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0))
    const rowStyles = Array.from({ length: ROWS }, (_, index) => {
        return useAnimatedStyle(() => {
            return {
                transform: [{ translateX: offsetShakes[index].value }]
            }
        })
    })

    const shakeRow = () => {
        const TIME = 80;
        const OFFSET = 10;

        offsetShakes[curRow].value = withSequence(
            withTiming(-OFFSET, { duration: TIME / 2 }),
            withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
            withTiming(0, { duration: TIME / 2 })

        )
    }

    //flip animation
    const tileRotates = Array.from({ length: ROWS }, (_index) =>
        Array.from({ length: 5 },
            () => useSharedValue(0)))

    const cellBackgrounds = Array.from({ length: ROWS }, (_index) =>
        Array.from({ length: 5 },
            () => useSharedValue(Colors.cellColor)))

    const tileStyles = Array.from({ length: ROWS }, (_, rowIndex) => {
        return Array.from({ length: 5 }, (_, cellIndex) => {
            return useAnimatedStyle(() => {
                return {
                    transform: [{ rotateX: `${tileRotates[rowIndex][cellIndex].value}deg` }],
                    backgroundColor: cellBackgrounds[rowIndex][cellIndex].value
                }
            })
        })
    })

    const flipRow = () => {
        const TIME = 200;
        const OFFSET = 120;

        tileRotates[curRow].forEach((tile, index) => {
            tile.value = withDelay(
                index * 100,
                withSequence(
                    withTiming(OFFSET, { duration: TIME }, () => { }),
                    withTiming(0, { duration: TIME })
                )
            )
        })
    }

    useEffect(() => {
        if (curRow === 0) return
        rows[curRow - 1].map((cell, cellIndex) => {
            setCellColor(cell, cellIndex, curRow - 1)
        })
    }, [curRow])

    return (
        <View className="flex-1 px-4 py-4">
            <LinearGradient colors={["#09281D", "#0C3E2D", "#155A40", "#166248"]} style={{ height: size.HEIGHT }} className="absolute left-0 right-0 bottom-0 top-0">
                {/* <Stack.Screen
                    options={{
                        headerRight: () => (
                            <View className="flex-row gap-3 items-center">
                                <Ionicons size={28} name="help-circle-outline" />
                                <Ionicons size={28} name="podium-outline" />
                                <Ionicons size={28} name="settings-sharp" />
                            </View>
                        )
                    }}
                /> */}

                <View className="items-center pt-16">
                    {
                        rows.map((row, rowIndex) => (
                            <Animated.View className="flex-row gap-5" style={rowStyles[rowIndex]} key={`row-${rowIndex}`}>
                                {
                                    row.map((cell, cellIndex) => (
                                        <Animated.View
                                            key={`cell-${rowIndex}-${cellIndex}`}
                                            entering={ZoomIn.delay(50 * cellIndex)}
                                            style={
                                                [
                                                    {
                                                        width: size.WIDTH / 7, height: size.WIDTH / 7,
                                                    },
                                                    tileStyles[rowIndex][cellIndex]
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
                <OnScreenKeyboard onKeyPressed={onKeySelected} greenLetters={greenLetters} yellowLetters={yellowLetters} greyLetters={greyLetters} />
            </LinearGradient>
        </View>
    )
}
export default Page