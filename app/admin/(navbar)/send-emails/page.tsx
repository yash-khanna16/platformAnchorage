import { Button } from '@mui/joy'
import React from 'react'

function SendEmails() {
  return (
    <div className='w-[700px] mx-auto pt-10 px-10'>
      <h1 className=' text-3xl font-bold'>Send Emails </h1>
      <form className=' mx-auto'>
        <div className=' mt-[40px] '>
          <div className='flex flex-col'>
            <label htmlFor='sendEmail'>Email</label>
            <input type="text" name='sendEmail' placeholder='Subject' id="sendEmail" className='border-2 mt-2 focus:outline-[#1A80E5] rounded-lg p-3' />
          </div>
          <div className='flex mt-5 flex-col'>
            <textarea name='guestCompany' rows={8} placeholder='Write a message here....' id="guestCompany" className='border-2 mt-2 focus:outline-[#1A80E5] rounded-lg p-4 bg-gray-100' />
          </div>
        </div>
        <Button fullWidth className='mt-4' type='submit'>Send Email</Button>
      </form>
    </div>
  )
}

export default SendEmails