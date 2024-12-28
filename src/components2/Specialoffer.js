import React from 'react'
// import MunfimCountdown from '../components/MunfimCountdown'
import Link from 'next/link'
// import MyCountdown from '../components/countdown/MyCountdown'
// import Countdown from '../components/countdown/countdown'
// import CountdownTimer from '../components/countdown/CountdownTimer'
import CountdownTimer2 from '../components/countdown/CountdownTimer2'
// import CountdownTimer3 from '../components/countdown/CountdownTimer3'
const Specialoffer = () => {
  return (
    <>
      
      {/* Special Offer Start */}
      <section
        className="special-offer-two bgs-cover rel mt-6 z-1 py-100 rpt-80 "
        style={{
          backgroundImage: "url(assets/images/background/bg.jpg)",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="special-offer-left text-center rmb-35 wow fadeInUp delay-0-2s">
                <img
                  src="assets/images/offers/offer.png"
                  alt="Offer"
                  className='w-60'
                />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="special-offer-content text-center wow fadeInUp delay-0-4s">
                <div className="section-title mb-30">
                  <span className="sub-title mb-20">35% Off for Fruits</span>
                  <h2>Special Deal Of This Week</h2>
                </div>
                <p>
                  On the other hand we denounce with righteous indignation and
                  dislike men who are beguiled and demoralized by the charms
                </p>
                {/* <MunfimCountdown /> */}
                {/* <MyCountdown/> */}
                {/* <Countdown/> */}
                {/* <CountdownTimer3/> */}
                {/* <CountdownTimer/> */}
                <CountdownTimer2/>
                <div className="count-down-btns mt-10">
                  <Link href="/shop-grid">
                    <p className="theme-btn style-two">
                      Shop Now <i className="fas fa-angle-double-right" />
                    </p>
                  </Link>
                  <Link href="/about">
                    <p className="theme-btn style-two">
                      use code <i className="fas fa-angle-double-right" />
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          className="offer-bg"
          src="assets/images/offers/special-offer-bg.png"
          alt="Offer BG"
        />
        <img
          className="shape-one w-[120px]"
          src="assets/images/shapes/best2.png"
          alt="Shape"
        />
        <img
          className="shape-two w-[120px]"
          src="assets/images/shapes/offer.png"
          alt="Shape"
        />
      </section>
      {/* Special Offer End */}

    </>
  )
}

export default Specialoffer
