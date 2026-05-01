import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FaYoutube } from "react-icons/fa";

export default function test() {

    const[score, setScore] = useState(10)   //SCORE --> VARIABLE , SETSCORE --> FUNCTION
    const[emoji, setEmoji] = useState("😑")
    const[isFollowed, setIsFollowed] = useState(false);

    //let score = 50;

  return (
    <div className="w-full h-full bg-green-400 flex items-center justify-center">
        <div className='w-112.5 h-112.5 bg-white flex items-center justify-center flex-col'>
            <h1 className='font-bold text-5xl'>{score}</h1>
            <div className='w-full h-25 flex items-center justify-center'>
                <button className='w-50 h-10 bg-red-400 mx-5'
                    onClick={() => {
                        setScore(score - 1);
                       // alert("Score decreased by 10. Current score: " + (score - 10));
                    }}
                >
                    Decrease 
                    </button>
                <button className='w-50 h-10 bg-green-400 mx-5'
                    onClick={() => {
                        setScore(score + 1);
                       // alert("Score increased by 10. Current score: " + (score + 10));
                    }}
                >
                    Increase 
                    </button>
            </div>
            <div className='flex-col'>
                    <h1 className='font-bold text-7xl m-4 flex justify-center items-center'>{emoji}</h1>
                    <button className='w-25 h-10 bg-red-400 mx-5 my-2.5'
                        onClick={() => {
                            setEmoji("😊");
                            toast("You are happy!");
                        }}
                    >
                    Happy 
                    </button>

                     <button className='w-25 h-10 bg-green-400 mx-5 my-2.5'
                        onClick={() => {
                            setEmoji("😐");
                            toast("You are neutral!");
                        }}
                    >
                    Neutral 
                    </button>

                     <button className='w-25 h-10 bg-blue-400 mx-5 my-2.5'
                        onClick={() => {
                            setEmoji("😢");
                            toast("You are sad!");
                        }}
                    >
                    Sad 
                    </button>
            </div>

            <div>
                 <FaYoutube className={isFollowed ? 'text-7xl text-red-700' : 'text-7xl text-gray-800'} onClick={
                    ()=>{
                        toast("follow us on you tube ",{icon: <FaYoutube className='text-2xl text-red-700'/>    });
                        setIsFollowed(!isFollowed);
                    }
                } />
            </div>
         </div>
    </div>
  )
}
