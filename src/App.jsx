import { useState, useEffect } from 'react'
import Die from './components/Die'
import RepeatDots from './components/Dot'
import {nanoid} from "nanoid"
import './App.css'
import Confetti from "react-confetti"
  
export default function App() {



    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rolls , setRolls] = useState(0)
    const [time , setTime] = useState(0)
    const [bestNumber , setBestNumber] = useState(
        localStorage.getItem("bestNumber") || Infinity
    )


    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    useEffect(() => { 
        
        if (!tenzies){

            const timer = setInterval(() => {
                setTime((prevSeconds) => prevSeconds + 1);
            }, 1000);
        
        return () => {
            clearInterval(timer);
            localStorage.setItem('bestNumber', bestNumber);
        }}
               
    }, [tenzies,bestNumber]);


    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60)
        .toString()
        .padStart(2, '0');
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
        
    };


    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),


        }
    }

    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRolls(prevRolls => prevRolls+1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
            setTime(0)
            setBestNumber(Math.min(bestNumber, time));
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {... die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map((die) => (
        <Die 
            key={die.id} 
            value={<RepeatDots count={die.value}/>} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
            
        />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>            
            <h2>Best Time : {bestNumber !== Infinity? formatTime(bestNumber) : NaN}</h2>

            <div className='counters'>
                <h3>Time : {formatTime(time)}</h3>
                <h3>Number Of Rolls: {rolls}</h3>
            </div>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>

            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}