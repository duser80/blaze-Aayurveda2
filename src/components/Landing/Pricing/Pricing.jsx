import "./Pricing.css";
import "./PricingBox3.css";

export default function Pricing() {
  return (
    <div className="PricingMainCont">
      <div className="mainPricing">
        <div className="head flex flex-col uppercase ml-[50px] text-whites text-2xl sm:text-3xl lg:text-4xl mt-4 mb-[40px] sm:ml-[100px] md:ml-[150px] ">
          <div>PLANS & PRICING</div>
          <div>
            <img
              className="w-[220px] sm:w-[270px] lg:w-[340px] mt-2"
              src="/pricingLine.png"
              alt="pricing line"
            />
          </div>
        </div>

        <div className="pricingBoxMain">
          <div className="pricingBoxSection ">
            <div className="price-box price-box1   ">
              <div className="flex w-full   h-[50px] font-mono justify-center items-end text-xl text-gray-700 font-bold ">
                Creators
              </div>
              <div className="flex pl-[15px] h-[80px] justify-center   ">
                <div className="flex items-center  h-[70px] w-auto">
                  <span
                    style={{ fontSize: "2.6rem" }}
                    className="w-[72px] font-black bold-font text-gray-700"
                  >
                    $12
                  </span>
                  <span className="w-[100px] text-xl font-light text-grey">
                    /month
                  </span>
                </div>
              </div>
              <div className="h-[145px] relative w-full bg-grey-box pt-[10px]">
                <div className="text-[10px] text-blue pl-5 p-0 flex">
                  <div className="w-[25px]  ">
                    <img
                      src="/tick.png"
                      alt="tick"
                      className="w-[15px] h-[15px] "
                    />
                  </div>
                  Free versejack subdomain
                </div>
                <div className="pricingText pricingText1  flex">
                  <div className="w-[25px]  ">
                    <img
                      src="/tick.png"
                      alt="tick"
                      className="w-[15px] h-[15px] "
                    />
                  </div>
                  1 Room 20 visitors capacity
                </div>

                <div className="pricingBtn">Get started</div>
              </div>
            </div>
            <div className="price-box price-box2  ">
              <div className="flex w-full   h-[50px] font-mono justify-center items-end text-xl text-pricing font-bold ">
                Performers
              </div>
              <div className="flex pl-[15px]  pricingText2 h-[80px] justify-center  ">
                <div className="flex items-center  h-[70px] w-auto">
                  <span
                    style={{ fontSize: "2.6rem" }}
                    className="w-[80px]  bold-font text-gray-700"
                  >
                    $51
                  </span>
                  <span className="w-[100px] text-xl font-light text-grey">
                    /month
                  </span>
                </div>
              </div>
              <div className="h-[200px] relative w-full bg-grey-box pt-[10px]">
                <div className="pricingText pricingText2   ">
                  <div className="flex pb-[5px] pricingText2">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    Custom Domain
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    150 Concurrent Users
                  </div>

                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    Custom Colors & your own logo
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    No versejack branding
                  </div>
                </div>

                <div className="pricingBtn">Get started</div>
              </div>
            </div>
            <div className="price-box price-box3  ">
              <div className="w-full h-[50px] text-whites bg-blue flex justify-center items-center pt-3 text-xl font-bold">
                Most Popular
              </div>
              <div className=" w-full   h-[40px] font-mono flex justify-center items-end text-xl text-pricing font-bold ">
                Organisers
              </div>
              <div className="flex   pricingPrice3 h-[80px] justify-center  ">
                <div className="flex items-center  h-[70px] w-auto">
                  <span
                    style={{ fontSize: "2.6rem" }}
                    className="w-[75px]  bold-font text-gray-700"
                  >
                    $78
                  </span>
                  <span className="w-[100px] text-xl font-light text-grey">
                    /month
                  </span>
                </div>
              </div>
              <div className="h-[230px] relative w-full bg-grey-box pt-[10px]">
                <div className="pricingText pricingText3  ">
                  <div className="flex pb-[5px] pricingText3">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    Everything in Performers Plan
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    300 Concurrent Users
                  </div>

                  <div className="flex pb-[5px] pricingText3">
                    <div className="w-[25px] ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    Interactable 3D Scenes
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    99% uptime guarantee
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    Priority Support & Consultation
                  </div>
                </div>

                <div className="pricingBtn">Get started</div>
              </div>
            </div>
            <div className="price-box price-box4 ">
              <div className="flex w-full   h-[50px] font-mono justify-center items-end text-xl text-pricing font-bold ">
                Influencers
              </div>
              <div className="flex pl-[15px]  pricingText4 h-[90px] justify-center   ">
                <div className="flex items-center  h-[70px] w-auto">
                  <span
                    style={{ fontSize: "2.6rem" }}
                    className="w-[80px]  bold-font text-gray-700"
                  >
                    $99
                  </span>
                  <span className="w-[100px] text-xl font-light text-grey">
                    /month
                  </span>
                </div>
              </div>
              <div className="h-[190px] relative w-full bg-grey-box">
                <div className="pricingText pricingText4  ">
                  <div className="flex pb-[5px] pricingText4">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    All included in Organisers Plan
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    100% uptime Guarantee
                  </div>

                  <div className="flex pb-[5px] pricingText4">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    List Events for free on VerseJack
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    Sell Merchandise & Courses in 3D
                  </div>
                </div>
                <div className="pricingBtn">Get started</div>
              </div>
            </div>
            <div className="price-box price-box5 ">
              <div className="flex w-full   h-[50px] font-mono justify-center items-end text-xl text-pricing font-bold ">
                Agencies
              </div>
              <div className="flex pl-[15px]  pricingText5 h-[80px] justify-center    ">
                <div className="flex items-center  h-[70px] w-auto">
                  <span
                    style={{ fontSize: "2.6rem" }}
                    className="w-[98px]  bold-font text-gray-700"
                  >
                    $350
                  </span>
                  <span className="w-[100px] text-xl font-light text-grey">
                    /month
                  </span>
                </div>
              </div>
              <div className="h-[150px] relative w-full bg-grey-box">
                <div className="pricingText pricingText5  ">
                  <div className="flex pb-[5px] pricingText5">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    Get your own server
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    Bring your own concept
                  </div>
                  <div className="flex pb-[5px]">
                    <div className="w-[25px]  ">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="w-[15px] h-[15px] "
                      />
                    </div>
                    2000+ Concurrent Users
                  </div>
                </div>
                <div className="pricingBtn">Get started</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[40px] md:mt-[80px]">
          <div className="w-full text-center text-whites text-xl sm:text-3xl md:text-4xl font-white capitalize">
            Do you have a <span className=" text-pink">MindBlowing</span> Idea ?
          </div>
          <div className=" relative my-8 p-[16px] ">
            <div className="m-auto z-0 flex w-[300px] text-4xl blur-md absolute top-[10px] left-1/2 tranform -translate-x-1/2 justify-center items-center cursor-pointer text-whites  btnPricing h-[80px]"></div>
            <div className="m-auto relative z-40 flex w-[300px] text-3xl  justify-center items-center cursor-pointer text-whites  btnPricing h-[70px] ">
              Contact Us
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
