import React from 'react'

function AddGuest() {
  return (
    <div className='w-[1000px] mx-auto pt-10 px-10'>
      <h1 className=' text-3xl font-bold'>Enter details of guests </h1>
      <form className=' mx-auto'>
        <div className='w-full  grid grid-cols-2 gap-7 mx-auto mt-[40px] '>
          <div className='flex flex-col'>
            <label htmlFor='guestName'>Name</label>
            <input type="text" name='guestName' placeholder='Enter Name' id="guestName" className='border-2 focus:outline-[#1A80E5]  mt-2 rounded-lg p-2' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='guestPhone'>Phone No.</label>
            <input type="tel" name='guestPhone' placeholder='Enter Phone No.' id="guestPhone" className='border-2 focus:outline-[#1A80E5]  mt-2 rounded-lg p-2' />
          </div>
          <div className='flex  flex-col'>
            <label htmlFor='guestEmail'>Email Address</label>
            <input type="email" name='guestEmail' placeholder='Enter Email Address' id="guestEmail" className='border-2 focus:outline-[#1A80E5]  mt-2 rounded-lg p-2' />
          </div>
          <div className='flex  flex-col'>
            <label htmlFor='guestCompany'>Company</label>
            <input type="text" name='guestCompany' placeholder='Enter Company' id="guestCompany" className='border-2 focus:outline-[#1A80E5]  mt-2 rounded-lg p-2' />
          </div>
          <div className='flex  flex-col'>
            <label htmlFor='guestRank'>Rank</label>
            <input type="text" name='guestRank' placeholder='Enter Rank' id="guestRank" className='border-2 focus:outline-[#1A80E5]  mt-2 rounded-lg p-2' />
          </div>
        </div>
        <button type='submit' className='mt-8 font-semibold px-3 py-2 w-[300px]  bg-[#1A80E5] rounded-md text-white p-2'>Add Guest</button>
      </form>
    </div>
  )
}

export default AddGuest