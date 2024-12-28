import "./PricingBox3.css";
export default function PricingBox3() {
  return (
    <div className="pricingBoxMain">
      <div className="pricingBoxSection ">
        <div className="price-box price-box1   ">
          <div className="flex w-full   h-[60px] font-mono justify-center items-center text-xl text-pricing font-bold ">
            Free
          </div>
          {/* <div className='price-box1p flex  h-[60px] font-mono '>
                <p className="price">$0 
                <span>/month</span>
                </p>
                </div> */}
          <div className="flex w-full h-[60px] font-mono justify-center   text-xl font-light text-grey">
            <img
              className="h-[30px] w-[50px] mr-[10px]"
              src="/p1.png"
              alt="p1"
            /> 
            /months
          </div>
          <div className="h-[130px] relative w-full bg-grey-box pt-[10px]">
            <div className="pricingText pricingText1  flex">
              <div className="w-[25px]  ">
                <img
                  src="/tick.png"
                  alt="tick"
                  className="w-[15px] h-[15px] "
                />
              </div>
              Per room 20 member
            </div>
            <div className="pricingBtn">Get started</div>
          </div>
        </div>
        <div className="price-box price-box2  ">
          <div className="flex w-full   h-[60px] font-mono justify-center items-center text-xl text-pricing font-bold ">
            Basic
          </div>
          <div className="flex w-full h-[60px] font-mono justify-center   text-xl font-light text-grey">
            <img
              className="h-[30px] w-[80px] mr-[10px]"
              src="/p2.png"
              alt="p1"
            />{" "}
            /months
          </div>
          <div className="h-[190px] relative w-full bg-grey-box pt-[10px]">
            <div className="pricingText pricingText2   ">
              <div className="flex pb-[5px] pricingText2">
                <div className="w-[25px]  ">
                  <img
                    src="/tick.png"
                    alt="tick"
                    className="w-[15px] h-[15px] "
                  />
                </div>
                1 room for debbug Local Scene and one on a subdomain
              </div>
              <div className="flex pb-[5px]">
                <div className="w-[25px]  ">
                  <img
                    src="/tick.png"
                    alt="tick"
                    className="w-[15px] h-[15px] "
                  />
                </div>
                Limit of 20 member in a room
              </div>

              <div className="flex pb-[5px]">
                <div className="w-[25px]  ">
                  <img
                    src="/tick.png"
                    alt="tick"
                    className="w-[15px] h-[15px] "
                  />
                </div>
                All features in custom mode
              </div>
              <div className="flex pb-[5px]">
                <div className="w-[25px]  ">
                  <img
                    src="/tick.png"
                    alt="tick"
                    className="w-[15px] h-[15px] "
                  />
                </div>
                No custom verse branding
              </div>
            </div>
             
            <div className="pricingBtn">Get started</div>
          </div>
        </div>
        <div className="price-box price-box3  ">
          <div className="w-full h-[50px] text-whites bg-blue flex justify-center items-center pt-3 text-xl font-bold">
            Most Popular
          </div>
          <div className=" w-full   h-[60px] font-mono flex justify-center items-center text-xl text-pricing font-bold ">
            Personal
          </div>
          <div className="flex w-full h-[60px] font-mono justify-center   text-xl font-light">
            <img
              className="h-[30px] w-[50px] mr-[10px]"
              src="/p1.png"
              alt="p1"
            />{" "}
            /months
          </div>
          <div className="h-[230px] relative w-full bg-grey-box pt-[10px]">
              
          <div className="pricingText pricingText3  ">
              <div className="flex pb-[5px] pricingText3">
                <div className="w-[25px]  ">
                  <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />
                </div>
                1 room for local testing from us
                
              </div>
              <div className="flex pb-[5px]">
                <div className="w-[25px]  ">
                <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />

                </div>
                custom logo
              </div>

              <div className="flex pb-[5px] pricingText3">
                <div className="w-[25px] mr-[10px] ">
                <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />

                </div>
                custom domain 2 room on their own url
               with limit of 20 member in first
               room and 10 member in 2nd room
              </div>
              <div className="flex pb-[5px]">
                <div className="w-[25px]  ">
                <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />

                </div>
                full body avatar
              </div>
            </div>

            
             
            <div className="pricingBtn">Get started</div>
          </div>
        </div>
        <div className="price-box price-box4 ">
          <div className="flex w-full   h-[70px] font-mono justify-center items-center text-xl text-pricing font-bold ">
            Exhibition
          </div>
          <div className="flex w-full h-[70px] font-mono justify-center   text-xl font-light">
            <img
              className="h-[30px] w-[50px] mr-[10px]"
              src="/p4.png"
              alt="p1"
            />{" "}
            /months
          </div>
          <div className="h-[160px] relative w-full bg-grey-box">
          <div className="pricingText pricingText4  ">
              <div className="flex pb-[5px] pricingText4">
                <div className="w-[25px]  ">
                  <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />
                </div>
                All included in personal Plan
                
              </div>
              <div className="flex pb-[5px]">
                <div className="w-[25px]  ">
                <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />

                </div>
                custom Theme
              </div>

              <div className="flex pb-[5px] pricingText4">
                <div className="w-[25px] mr-[10px] ">
                <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />

                </div>
                Clickable Items , E-comemerce Support
              </div>
              <div className="flex pb-[5px]">
                <div className="w-[25px]  ">
                <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />

                </div>
                full body avatar
              </div>
            </div>
            <div className="pricingBtn">Get started</div>
          </div>
        </div>
        <div className="price-box price-box5 ">
          <div className="flex w-full   h-[60px] font-mono justify-center items-center text-xl text-pricing font-bold ">
          Exhibition
          </div>
          <div className="flex w-full h-[60px] font-mono justify-center   text-xl font-light">
            <img
              className="h-[30px] w-[50px] mr-[10px]"
              src="/p5.png"
              alt="p1"
            />{" "}
            /months
          </div>
          <div className="h-[140px] relative w-full bg-grey-box">
          <div className="pricingText pricingText5  ">
              <div className="flex pb-[5px] pricingText5">
                <div className="w-[25px]  ">
                  <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />
                </div>
                All included in personal Plan
                
              </div>
              <div className="flex pb-[5px]">
                <div className="w-[25px]  ">
                <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />

                </div>
                custom Theme
              </div>

              <div className="flex pb-[5px] pricingText3">
                <div className="w-[25px] mr-[10px] ">
                <img src="/tick.png"  alt="tick"  className="w-[15px] h-[15px] " />

                </div>
                 
              </div>
               
            </div>
            <div className="pricingBtn">Get started</div>
          </div>
        </div>
      </div>
    </div>
  );
}
