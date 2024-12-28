import './FootQ.css'
export default function Footer() {
    return (
        <div className="footQCont">
            <div className="textC">
               <div className="text1">Connect now for a personalised support </div>
            </div>

            {/* <div  className="FootQbtnDiv" > */}
            {/* <div className=' btn-div2'></div>
            <div className=' btn-div1'>Book a meet</div> */}

          {/* <div className="btnImgCont" >
          <img className="btnImg" src="/btn.png" alt="btn-img" />
          </div>  */}
          {/* <div className="btnText"> Book a Meet</div> */}
          {/* </div> */}
          <div className=" relative my-8 p-[16px] overflow-visible">
                <div  className="m-auto z-0 flex w-[300px] text-4xl blur-md absolute top-[10px] left-1/2 tranform -translate-x-1/2 justify-center items-center cursor-pointer text-whites  btnPricing h-[80px]">

                </div>
                <div  className="m-auto relative z-40 flex w-[300px] text-3xl  justify-center items-center cursor-pointer text-whites  btnPricing h-[70px] ">
                   Schedule Meet
                </div>
            </div>

            <div className="box f"></div>
            <div className='box sec'></div>
            <div className='third'></div>
            <div className='fourth'></div>
        </div>
    );
}