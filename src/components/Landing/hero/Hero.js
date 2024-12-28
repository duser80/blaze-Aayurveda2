import "./Hero.css";
import { BsFilter } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
const Hero = () => {
  return (
    <div>
      <div className="HContainer">
        <div className="relative">
          <div className="heroGra1"></div>
          <div className="heroGra2 hidden md:block "></div>
          <div className="heroGra3"></div>
          <div className="   Navbar">
            <div className="logoh1">
              Verse<span className="logoh2">Jack</span>
            </div>
            <div className="crossCont">
              <img className="cross" src="/x.png" alt="x-img" />
            </div>
            <div className="MenuCont">
              <BsFilter className="NavMunu" />
            </div>
          </div>

          <div className="textJack  ">THE JACK OF ALL VERSES</div>

          <div className="">
            <div className="earth1 earth"></div>
            <div className="text-center font-bold text-gray-600 text-[23px] md:text-[100px] -mt-2 -mb-8 tracking-widest w-full">
              VERSE JACK
            </div>
            {/* <svg
              className="metaSvg"
              viewBox="0 0 1251 144"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M149.71 3.30839L169.237 140H141.573L130.182 50.4995L94.3823 140H81.3641L45.5639 50.4995L34.1729 140H6.50912L26.0365 3.30839H52.073L87.8732 91.1816L123.673 3.30839H149.71ZM293.777 29.3449H235.195V58.6359H284.013V84.6724H235.195V113.964H293.777V140H209.158V3.30839H293.777V29.3449ZM330.456 3.30839H428.093V29.3449H392.292V140H366.256V29.3449H330.456V3.30839ZM546.043 140L535.873 113.964H478.104L467.934 140H438.643L495.191 3.30839H518.786L575.334 140H546.043ZM488.071 87.927H525.906L506.989 39.1086L488.071 87.927ZM634.689 140L579.361 3.30839H608.652L644.453 94.4361L680.253 3.30839H709.544L654.216 140H634.689ZM827.45 29.3449H768.868V58.6359H817.686V84.6724H768.868V113.964H827.45V140H742.832V3.30839H827.45V29.3449ZM974.784 140H943.052L912.337 94.4361H896.675V140H870.638V3.30839H919.457C955.053 3.30839 971.53 22.4289 971.53 48.8723C971.53 67.9928 960.342 86.2997 940.205 92.402L974.784 140ZM896.675 29.3449V68.3996H922.711C935.323 68.3996 945.493 60.2632 945.493 48.8723C945.493 36.0574 935.323 29.3449 922.711 29.3449H896.675ZM1063.63 57.0087C1093.53 61.8905 1115.7 70.0269 1115.7 99.318C1115.7 123.727 1096.99 143.255 1060.78 143.255C1025.79 143.255 1007.49 122.914 1005.05 120.473L1018.06 97.6907C1030.07 111.319 1048.17 117.218 1061.19 117.218C1079.29 117.218 1089.66 110.506 1089.66 100.945C1089.66 91.385 1079.9 86.5031 1062 83.8588C1023.15 77.9599 1009.93 63.5178 1009.93 42.77C1009.93 19.988 1028.44 0.0538287 1062.41 0.0538287C1068.51 0.0538287 1089.26 0.460644 1109.19 16.7335L1098.21 39.1086C1095.16 36.4642 1081.73 26.0903 1062 26.0903C1048.17 26.0903 1035.96 29.9551 1035.96 40.9393C1035.96 50.2961 1043.9 53.7541 1063.63 57.0087ZM1240.27 29.3449H1181.69V58.6359H1230.51V84.6724H1181.69V113.964H1240.27V140H1155.65V3.30839H1240.27V29.3449Z"
                fill="#413E3E"
              />
            </svg> */}
            <div className="earth2 earth"></div>
          </div>

          <div className="starCont  ">
            <div className="star1Div">
              <img src="/star.png" alt="star1" className="star1" />
            </div>

            {/* <div className="btnHero">

            <div  className="btnDivHero">
            </div>
            </div> */}
            <div className=" relative my-8 p-[16px] overflow-visible ">
              <div className="m-auto z-0 flex w-[350px] text-4xl blur-md absolute top-[10px] left-1/2 tranform -translate-x-1/2 justify-center items-center cursor-pointer text-whites  btnPricing h-[80px]"></div>
              <div className="m-auto relative z-40 flex w-[350px] text-3xl  justify-center items-center cursor-pointer text-whites  btnPricing h-[70px] ">
                Build your Universe
              </div>
            </div>
            <div className="star2Div">
              <img src="/star.png" alt="star2" className="star2" />
            </div>
          </div>
          <div style={{ width: "50vw" }} className="starCont2">
            <div className="w-[40px]">
              <img src="/star2.png" alt="star2" className="w-[40px]" />
            </div>
            <div className="w-[40px]">
              <img src="/star3.png" alt="star1" className="w-[40px]" />
            </div>
          </div>
          <div
            className="imageHeroC relative overflow-x-hidden flex flex-row overflow-hidden flex-no-wrap"
          >
            <div className="img1Cont">
              <img className="imageHero" src="/h1.png" alt="h1" />
            </div>
            <div className="img1Cont">
              <img className="imageHero" src="/h2.png" alt="h1" />
            </div>
            <div className="img1Cont">
              <img className="imageHero" src="/h3.png" alt="h1" />
            </div>
            <div className="img1Cont">
              <img className="imageHero" src="/h4.png" alt="h1" />
            </div>
            <div className="img1Cont">
              <img className="imageHero" src="/h5.png" alt="h1" />
            </div>
            <div className="img1Cont">
              <img className="imageHero" src="/h6.png" alt="h1" />
            </div>

            <div className=" relative right-[500px] top-[30px] ">
              <img src="./hbg1.png" className="backImage"></img>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Hero;
