import Image, { StaticImageData } from "next/image";
import { Route } from "@/src/routers/types";
import imageRightPng from "@/src/images/hero-right.png";
import imageRightPng2 from "@/src/images/hero-right-2.png";
import imageRightPng3 from "@/src/images/hero-right-3.png";
import { getCollectionData } from "@/src/utils/get-url";

export interface Hero2DataType {
  image: StaticImageData | string;
  heading: string;
  subHeading: string;
  btnText: string;
  btnLink: Route;
}

export async function fetchAndSortProducts() {
  let Tdata = await getCollectionData("Products");
  console.log(Tdata, "data");
  let sortedProducts = Tdata?.sort((a, b) => b.product_views - a.product_views);
  console.log(sortedProducts, "sortedProducts");
  Tdata = sortedProducts;
  return Tdata;
}

export async function getHero2DemoData() {
  const Tdata = await fetchAndSortProducts();

  const HERO2_DEMO_DATA: Hero2DataType[] = [
    {
      image: Tdata?.[0]?.productImage[0],
      heading: Tdata?.[0]?.itemName,
      subHeading: Tdata?.[0]?.description.slice(0, 50),
      btnText: "More Info",
      btnLink: `/marketplace/${Tdata?.[0]?._id}`,
    },
    {
      image: Tdata?.[1]?.productImage[0],
      heading: Tdata?.[1]?.itemName,
      subHeading: Tdata?.[1]?.description.slice(0, 50),
      btnText: "More Info",
      btnLink: `/marketplace/${Tdata?.[1]?._id}`,
    },
    {
      image: Tdata?.[2]?.productImage[0],
      heading: Tdata?.[2]?.itemName,
      subHeading: Tdata?.[2]?.description.slice(0, 50),
      btnText: "More Info",
      btnLink: `/marketplace/${Tdata?.[2]?._id}`,
    },
  ];

  return HERO2_DEMO_DATA;
}

// {product.description.length > 30
//   ? `${product.description.slice(0, 30)}...`
//   : product.description}

export const HERO2_DEMO_DATA: Hero2DataType[] = [
  {
    image: imageRightPng2,
    heading: "Exclusive collection for everyone",
    subHeading: "In this season, find the best :fire:",
    btnText: "Explore now",
    btnLink: "/marketplace ",
  },
  {
    image: imageRightPng3,
    heading: "Exclusive collection for everyone",
    subHeading: "In this season, find the best :fire:",
    btnText: "Explore now",
    btnLink: "/marketplace",
  },
  {
    image: imageRightPng,
    heading: "Exclusive collection for everyone",
    subHeading: "In this season, find the best :fire:",
    btnText: "Explore now",
    btnLink: "/marketplace",
  },
];
