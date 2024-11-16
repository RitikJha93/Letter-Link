import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native"

type OnScreenKeyboardProps = {
  onKeyPressed: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  greyLetters: string[];
}

export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', BACKSPACE],
];

const OnScreenKeyboard = ({ onKeyPressed, greenLetters, yellowLetters, greyLetters }: OnScreenKeyboardProps) => {

  const { width, height } = useWindowDimensions()

  const keyWidth = (width - 70) / keys[0].length;
  const keyHeight = 60;

  const isSpecialKey = (key: string) => [ENTER, BACKSPACE].includes(key)
  const isInLetters = (key: string) => [...greenLetters, ...yellowLetters, ...greyLetters].includes(key)

  return (
    <View style={styles.keyboardContainer}>
      {
        keys.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} className="flex-row justify-center gap-1">
            {
              row.map((key, keyIdx) => (
                <Pressable
                  onPress={() => onKeyPressed(key)}
                  className={`gap-2 rounded-md items-center justify-center mb-1`}
                  key={`key-${rowIdx}-${keyIdx}`}
                  style={{
                    width: isSpecialKey(key) ? keyWidth * 1.8 : keyWidth,
                    height: keyHeight,
                    backgroundColor:
                      greenLetters.includes(key) ?
                        Colors.green : yellowLetters.includes(key)
                          ? Colors.yellow : greyLetters.includes(key) ?
                            Colors.grey : Colors.keyColor
                  }}
                >
                  <Text
                    style={{ fontFamily: "Poppins_500Medium" }} className={`text-center text-white ${isSpecialKey(key) ? "text-base" : "text-2xl"} uppercase`}>
                    {
                      isSpecialKey(key) ?
                        key === ENTER ? 'ENTER' :
                          <Ionicons name="backspace-outline" size={26} /> :
                        key
                    }
                  </Text>
                </Pressable>
              ))
            }
          </View>
        ))
      }
    </View>
  )
}
export default OnScreenKeyboard

const styles = StyleSheet.create({
  key: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1
  },
  keyboardContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    paddingTop: 16,
    alignSelf: 'center',
  },
})