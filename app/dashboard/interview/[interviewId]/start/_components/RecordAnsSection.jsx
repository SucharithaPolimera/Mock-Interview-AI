"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { db } from '@/utils/db'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { UserAnswer } from '@/utils/schema'

function RecordAnsSection({mockInterviewQuestion, activeQuestionIndex, interviewData}) {
    const {user} = useUser();
    const {error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText, setResults} = useSpeechToText({continuous: true, useLegacyResults: false});
    const[userAnswer, setUserAnswer] = useState('');
    const[isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        results.map((result)=>(
            setUserAnswer(prevAnswer => prevAnswer+result.transcript)
        ))
    },[results]);

    useEffect(()=>{
        if(!isRecording && userAnswer.length > 10){
            updateUserAnswer();
        }
    },[userAnswer])

    const StartStopRecording = async() => {
        if(isRecording){
            stopSpeechToText();
        } else{
            startSpeechToText();
        }
    }

    const updateUserAnswer = async() => {
        setIsLoading(true);
        const feedbackPrompt = "Question:"+ mockInterviewQuestion[activeQuestionIndex]?.question+", UserAnswer:"+userAnswer+", Depends on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in jSON format with rating field and feedback field";
        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResponse = (result.response.text().replace('```json', '').replace('```',''));
        const jsonFeedbackResponse = JSON.parse(mockJsonResponse);

        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAnswer: mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAnswer: userAnswer,
            feedback: jsonFeedbackResponse?.feedback,
            rating: jsonFeedbackResponse?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-YYYY')
        })

        if(resp){
            toast('User Answer recorded successfully');
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);
        setIsLoading(false);
    }

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col justify-center mt-10 items-center rounded-lg bg-black'>
                <Image src={'/webcam.png'} width={200} height={200} className='absolute'/>
                <Webcam mirrored={true}
                    style={{height: "100%", width: "100%", zIndex: 10}}
                />
            </div>
            <Button disabled={isLoading} variant="outline" className="my-10" onClick={StartStopRecording}>
                {isRecording ? 
                    <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                        <StopCircle/> Stop Recording
                    </h2> :
                    <h2 className='text-primary flex gap-2 items-center'>
                        <Mic/> "Record Answer"
                    </h2>
                }
            </Button>
        </div>
    )
}

export default RecordAnsSection