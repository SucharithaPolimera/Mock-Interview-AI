"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import {v4 as uuidv4} from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const[jobPosition, setJobPosition] = useState();
    const[jobDescription, setJobDescription] = useState();
    const[jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResp, setjsonResp] = useState([]);
    const {user} = useUser();
    const router = useRouter();

    const onSubmit = async(e) => {
        setLoading(true);
        e.preventDefault();
        const InputPrompt = "Job position: "+jobPosition+", Job Description: "+jobDescription+", Years of Experience: "+jobExperience+", Depends on Job Position, Job Description & Years of Experience give us "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview question along with Answer in JSON format, Give us question and answer field on JSON"
        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResponse = (result.response.text()).replace('```json','').replace('```','');
        setjsonResp(MockJsonResponse);
        if(MockJsonResponse){
            const response = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: MockJsonResponse,
                jobPosition: jobPosition,
                jobDesc: jobDescription,
                jobExperience: jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY')
            }).returning({mockId:MockInterview.mockId});
            if(response){
                setOpenDialog(false);
                router.push('/dashboard/interview/'+response[0]?.mockId);
            }
        } else{
            console.log("Error");
        }
        setLoading(false);
    }


    return (
        <div>
            <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all" onClick={() => setOpenDialog(true)}>
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className="!max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Tell us more about Job you are interviewing</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details about job position, Your skills and Years of experience</h2>
                                    <div className='mt-7 my-4'>
                                        <label>Job Role/Job Position</label>
                                        <Input placeholder="Ex. Full Stack developer" onChange={(e)=>setJobPosition(e.target.value)} required/>
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Description/Tech Stack (In Short)</label>
                                        <Textarea placeholder="Ex. React, Angular, Node.js, MySql etc" onChange={(e)=>setJobDescription(e.target.value)} required/>
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of Experience</label>
                                        <Input type="number" placeholder="Ex.3" max="50" onChange={(e)=>setJobExperience(e.target.value)} required/>
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'> 
                                    <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>{loading ?<><LoaderCircle className='animate-spin'/> 'Generating From AI'</> : 'Start Interview'}</Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview