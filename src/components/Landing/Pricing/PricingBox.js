import './PricingBox.css'
export default function PricingBox()  {
  return (
    <div className="pricingBoxMain">
      <div className="pricingBoxCont">
            <div className="pricingBox w-[320px]">
                <div className='flex w-[320px] h-[60px] font-mono justify-center items-center text-xl text-pricing font-bold '>
                    Free
                </div>
                <div className='flex w-[320px] h-[70px] font-mono justify-center   text-xl font-light'>
                    <img className='h-[30px] w-[50px] mr-[10px]' src="/p1.png" alt="p1" /> /months
                </div>
                <div className=' relative h-[200px]'>
                {/* bg-grey   opacity-20 */}
                    <div className="absolute bg-list w-[320px] h-[200px]"></div>
                    <div className='pt-[40px] pl-[30px] text-grey'>
                       Per room 20 member
                    </div>

                    <div className='btnP relative w-[280px] ml-[20px] justify-center items-center flex h-[60px] mt-[50px] border-md text-xl text-blue'>
                      current plan
                       <div className="absolute w-[280px]  h-[60px]  bg-grey opacity-40 rounded-md"></div>
                    </div>
                </div>
            </div>
 
            <div className="pricingBox w-[320px]">
                <div className='flex w-[320px] h-[60px] font-mono justify-center items-center text-xl font-bold '>
                    Free
                </div>
                <div className='flex w-[320px] h-[70px] font-mono justify-center   text-xl font-bold'>
                    <img className='h-[30px] w-[50px]' src="/p1.png" alt="p1" /> /months
                </div>
                <div className=' relative h-[200px]'>
                    <div className="absolute bg-grey  h-[200px] opacity-20 w-[320px]"></div>
                    <div className='pt-[40px] pl-[30px]'>
                       Per room 20 member
                    </div>
                </div>
            </div>
      </div>
    </div>
  )
}

 
