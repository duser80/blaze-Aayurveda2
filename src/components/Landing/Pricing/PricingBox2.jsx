export default function PricingBox2() {
  return (
    <div>
      <div className=" w-full flex flex-row overflow-hidden mt-6 h-[450px] overflow-x-auto  pt-[50px] my-auto items-center">
        <div style={{width:'300px' ,minWidth:'300px'}} className="w-[300px] h-[300px] px-4 md:px-6">
          <div  className=" w-[300px]  h-[300px]  relative  border-md ">
             <img className="w-[300px]  h-[300px]" src="p1Box.png" alt="0dollar" />
            <div className="absolute w-[280px] left-[10px] h-[40px] bottom-[30px] cursor-pointer"></div>
          </div>
          </div>
 
          <div style={{width:'300px' ,minWidth:'300px'}} className="w-[300px] h-[320px] px-4 md:px-6">
          <div  className=" w-[300px]  h-[320px]   relative border-md ">
             <img className="w-[300px]  h-[320px]" src="p2Box.png" alt="12dollar" />
             <div className="absolute w-[280px] left-[10px] h-[40px] bottom-[30px] cursor-pointer"></div>
          </div>
          </div>

          <div style={{width:'300px' ,minWidth:'300px'}} className="w-[300px] h-[350px] px-4 md:px-6">
          <div  className=" w-[300px]  h-[350px]  relative  border-md ">
             <img className="w-[300px]  h-[350px] " src="p3Box.png" alt="12dollar" />
             <div className="absolute w-[280px] left-[10px] h-[40px] bottom-[30px] cursor-pointer"></div>
          </div>
          </div>
{/* 
          <div style={{width:'300px' ,minWidth:'300px'}} className="w-[300px] h-[400px] px-4 md:px-6">
          <div  className=" w-[300px]  h-[330px]  bg-whites border-md ">
            <div className="w-[300px] h-[50px] text-whites bg-blue text-center pt-3 text-xl font-bold"> Most Popular</div>
            <div className=" pl-4 flex flex-col items-center text-center my-4">

            </div>
          </div>
          </div> */}
        
          <div style={{width:'300px' ,minWidth:'300px'}} className="w-[300px] h-[320px] px-4 md:px-6">
          <div  className=" w-[300px]  h-[320px]  relative  border-md ">
             <img className="w-[300px] h-[320px]" src="36dBox.png" alt="36dollar" />
             <div className="absolute w-[280px] left-[10px] h-[40px] bottom-[30px] cursor-pointer"></div>
          </div>
          </div>

          <div style={{width:'300px' ,minWidth:'300px'}} className="w-[300px] h-[300px] px-4 md:px-6">
          <div  className=" w-[300px]  h-[300px]  relative  border-md ">
             <img className="w-[300px] h-[300px]" src="p99dBox.png" alt="36dollar" />
             <div className="absolute w-[280px] left-[10px] h-[40px] bottom-[30px] cursor-pointer"></div>
          </div>
          </div>
          
        </div>
    </div>
  )
}

 
