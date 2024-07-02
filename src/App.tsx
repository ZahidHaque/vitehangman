import {useCallback, useEffect, useState} from "react";
import words from "./wordList.json"
import {HangmanDrawing} from "./HangmanDrawing.tsx";
import {HangmanWord} from "./HangmanWord.tsx";
import {Keyboard} from "./Keyboard.tsx";

let wordForKakunin = "null"

function getWord(){
    wordForKakunin = words[Math.ceil(Math.random() * words.length)];
    console.log(wordForKakunin);
    return wordForKakunin;
}

function App() {
    const [wordToGuess, setWordToGuess] = useState(getWord)
    const [guessedLetters, setGuessedLetters] = useState<string[]>([])

    const inCorrectLetters = guessedLetters.filter (
       letter => !wordToGuess.includes(letter)
    )

    const isLoser = inCorrectLetters.length >= 6
    const isWinner = wordToGuess
        .split("")
        .every(letter => guessedLetters.includes(letter))

    const addGuessedLetter = useCallback(
    (letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
},
    [guessedLetters, isWinner, isLoser]
)

    useEffect(() => {
       const handler = (e: KeyboardEvent) => {
            const key = e.key
           if(!key.match(/^[a-z]$/)) return

           e.preventDefault()
           addGuessedLetter(key)
       }

       document.addEventListener("keypress", handler)

       return () => {
           document.removeEventListener("keypress", handler)
       }
   }, [guessedLetters])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key
            if(key !== "Enter") return

            e.preventDefault()
            setGuessedLetters([])
            setWordToGuess(getWord())
        }

        document.addEventListener("keypress", handler)

        return () => {
            document.removeEventListener("keypress", handler)
        }
    }, [])

  return (<div style={{
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    marginTop: "0 auto",
    alignItems: "center",
  }}>
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
            {isWinner && "勝者！ - 更新してもう一度お試しください"}
            {isLoser && "ナイストライ - 更新してもう一度お試しください"}
        </div>
        <HangmanDrawing numberOfGuesses={inCorrectLetters.length} />
        <HangmanWord
            reveal={isLoser}
            guessedLetters={guessedLetters}
            wordToGuess={wordToGuess}
        />
        <div style={{ alignSelf: "stretch"}}>
            <Keyboard
            disabled={isWinner || isLoser}
            activeLetters={guessedLetters.filter(letter =>
            wordToGuess.includes(letter))}
            inactiveLetters={inCorrectLetters}
            addGuessedLetter={addGuessedLetter}
            />
        </div>
  </div>
  )
}

export default App
