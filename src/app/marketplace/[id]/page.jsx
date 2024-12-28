"use client";

import React, { useState, useEffect } from "react";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import LikeButton from "@/src/components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "@/src/components/BagIcon";
import NcInputNumber from "@/src/components/NcInputNumber";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/src/data/data";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "@/src/components/IconDiscount";
import Prices from "@/src/components/Prices";
import { toast } from "react-toastify";
import SectionSliderProductCard from "@/src/components/SectionSliderProductCard";
import detail1JPG from "@/src/images/products/chair.png";
import detail2JPG from "@/src/images/products/chair.png";
import detail3JPG from "@/src/images/products/chair.png";
import Policy from "./Policy";
import ReviewItem from "@/src/components/ReviewItem";
import ButtonSecondary from "@/src/shared/Button/ButtonSecondary";
import SectionPromo2 from "@/src/components/SectionPromo2";
import ModalViewAllReviews from "./ModalViewAllReviews";
import NotifyAddTocart from "@/src/components/NotifyAddTocart";
import Image from "next/image";
import AccordionInfo from "@/src/components/AccordionInfo";
import {
  getUserData,
  updateDocument,
  getDocument,
  getProductData,
  updateProductArrays,
  wishlistProduct,
  addToCartProduct,
} from "@/src/utils/get-url";

const LIST_IMAGES_DEMO = [detail1JPG, detail2JPG, detail3JPG];

const ProductDetailPage = (props) => {
  const { sizes, variants, allOfSizes, image } = PRODUCTS[0];

  const router = useRouter();

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  console.log(props.params.id, "id");

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [user, setUser] = useState(null);
  const [wishListed, setWishListed] = useState(false);
  const [addedToCart, setAddedToCartListed] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);

  // add to wishlist server function
  const handleWishList = async () => {
    const id = props.params.id;
    if (localStorage.getItem("id")) {
      const user_id = localStorage.getItem("id");

      const data = await wishlistProduct(user_id, id);
      console.log(data, "wishlistfunction");
      setWishListed(data);
    } else router.push("/signin");
  };
  // add to cart server function
  const handleAddToCartList = async () => {
    const id = props.params.id;
    if (localStorage.getItem("id")) {
      const user_id = localStorage.getItem("id");
      const data = await addToCartProduct(user_id, id, quantity);
      console.log(data, "add_to_cart_function");
      setAddedToCartListed(data);

      // Add a toast notification
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      toast("Cart updated!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        // pauseOnHover: true,
        // draggable: true,
        progress: undefined,
      });
    } else router.push("/signin");
  };

  const StockStatus = ({ stock }) => {
    if (stock === 0) {
      return <div className="text-red-500 font-bold">Out of Stock</div>;
    } else if (stock < 10) {
      return (
        <div className="text-yellow-500 font-bold">Hurry up, low stock!</div>
      );
    } else {
      return null;
    }
  };

  // handle buy function to be modified as diredctely send to place order screen then payment and product automatically added to cart
  // const handleBuy = async () => {
  //   // console.log(product.nFTLink, "product.nFTLink");
  //   window.open(product.nFTLink, "_blank");
  // };
  //   Fetch data about product from server
  const fetchData = async () => {
    const id = props.params.id;
    const user_id = localStorage.getItem("id");
    if (localStorage.getItem("id")) {
      const { wishListed } = await updateProductArrays(user_id, id);
      setWishListed(wishListed);
    }

    const productData = await getProductData(id);
    if (productData) {
      console.log(productData, "product");
      console.log(productData.description, "description");
      setProduct(productData);
      console.log(productData.sellerId, "sellerId");
      const sellerData = await getUserData(productData.sellerId);
      if (sellerData) {
        console.log(sellerData, "sellerData");
        setSeller(sellerData);
      }
    }

    let product_views = productData.product_views;
    console.log(product_views, "product_views");
    product_views++;
    console.log(product_views, "product_views");

    // Increment the event_count field
    const updatedProduct = await updateDocument("Products", id, {
      product_views,
    });
    console.log(`Updated event count: ${updatedProduct}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderSpecificationsTable = () => {
    if (!product || !product.specifications) return null;

    return (
      <table className="min-w divide-y ">
        <tbody className=" ">
          {product.specifications.map((spec, index) => (
            <tr key={index}>
              <td className="px-2 py-2 whitespace-nowrap text-sm font-extrabold text-white">
                {spec.key}
              </td>
              <td className="px-2 py-2 whitespace-nowrap text-sm font-bold text-gray-400">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            {product.itemName}
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <div>
              <div className="flex">
                <div>
                  <span className="mt-2 px-2 text-2xl font-semibold text-red-600">
                    - {product.discount}%
                  </span>
                </div>
                <Prices
                  contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
                  price={product.price == 0 ? "Free" : product.price}
                />
              </div>
              <div className="mt-2">
                <span className="mt-2 px-2 text-xl font-semibold text-red-600">
                  M.R.P:
                </span>
                <span className="mt-2 text-xl font-semibold text-red-600 line-through">
                  {product.mrp}
                </span>
              </div>
            </div>

            <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center">
              <a
                href="#reviews"
                className="flex items-center text-sm font-medium"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ml-1.5 flex">
                  <span>4.9</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-slate-400 underline">
                    142 reviews
                  </span>
                </div>
              </a>
              <span className="hidden sm:block mx-2.5">·</span>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        {/* <div className="">{renderVariants()}</div>
        <div className="">{renderSizeList()}</div> */}

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex space-x-3.5">
          {product.stock === 0 ? null : (
            <div className="flex space-x-3.5">
              <div className="flex items-center justify-center bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
                <NcInputNumber
                  defaultValue={quantity}
                  max={product.stock}
                  onChange={setQuantity}
                />
              </div>
              <ButtonPrimary
                className="flex-1 flex-shrink-0"
                onClick={handleAddToCartList}
                disabled={product.stock === 0}
              >
                <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
                <span className="ml-3">Add to cart</span>
              </ButtonPrimary>
            </div>
          )}
          <ButtonPrimary
            className="flex-1 flex-shrink-0"
            onClick={handleWishList}
          >
            {wishListed ? "Remove from Wishlist" : "Add to Wishlist"}
          </ButtonPrimary>
        </div>

        <StockStatus stock={product.stock} />

        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}

        <AccordionInfo
          data={[
            {
              name: "Description",
              content: product.description.split("\n").join("<br />"),
            },
            // {
            //   name: "Specification",
            //   content: product.description,
            // },
          ]}
        />

        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Specifications</h4>
          </div>
          <div className="mt-4">{renderSpecificationsTable()}</div>

          <div className="mt-8">
            <h4 className="text-lg font-semibold">Replacement Policy</h4>
            <p>{product.replacementPolicy} days</p>
            <h4 className="text-lg font-semibold mt-4">Warranty Policy</h4>
            <p>{product.warranty} year</p>
          </div>
        </div>

        {/* ---------- 6 ----------  */}
        <div className="hidden xl:block">
          <Policy />
        </div>
      </div>
    );
  };

  // const renderDetailSection = () => {
  //   return (
  //     <div className="">
  //       <h2 className="text-2xl font-semibold">Product Details</h2>
  //       <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7">
  //         <p>
  //           The patented eighteen-inch hardwood Arrowhead deck --- finely
  //           mortised in, makes this the strongest and most rigid canoe ever
  //           built. You cannot buy a canoe that will afford greater satisfaction.
  //         </p>
  //         <p>
  //           The St. Louis Meramec Canoe Company was founded by Alfred Wickett in
  //           1922. Wickett had previously worked for the Old Town Canoe Co from
  //           1900 to 1914. Manufacturing of the classic wooden canoes in Valley
  //           Park, Missouri ceased in 1978.
  //         </p>
  //         <ul>
  //           <li>Regular fit, mid-weight t-shirt</li>
  //           <li>Natural color, 100% premium combed organic cotton</li>
  //           <li>
  //             Quality cotton grown without the use of herbicides or pesticides -
  //             GOTS certified
  //           </li>
  //           <li>Soft touch water based printed in the USA</li>
  //         </ul>
  //       </div>
  //     </div>
  //   );
  // };

  const renderReviews = () => {
    return (
      <div className="">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold flex items-center">
          <StarIcon className="w-7 h-7 mb-0.5" />
          <span className="ml-1.5"> 4,87 · 142 Reviews</span>
        </h2>

        {/* comment */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
            <ReviewItem />
            <ReviewItem
              data={{
                comment: `I love the charcoal heavyweight hoodie. Still looks new after plenty of washes. 
                  If you’re unsure which hoodie to pick.`,
                date: "December 22, 2021",
                name: "Stiven Hokinhs",
                starPoint: 5,
              }}
            />
            <ReviewItem
              data={{
                comment: `The quality and sizing mentioned were accurate and really happy with the purchase. Such a cozy and comfortable hoodie. 
                Now that it’s colder, my husband wears his all the time. I wear hoodies all the time. `,
                date: "August 15, 2022",
                name: "Gropishta keo",
                starPoint: 5,
              }}
            />
            <ReviewItem
              data={{
                comment: `Before buying this, I didn't really know how I would tell a "high quality" sweatshirt, but after opening, I was very impressed. 
                The material is super soft and comfortable and the sweatshirt also has a good weight to it.`,
                date: "December 12, 2022",
                name: "Dahon Stiven",
                starPoint: 5,
              }}
            />
          </div>

          <ButtonSecondary
            onClick={() => setIsOpenModalViewAllReviews(true)}
            className="mt-10 border border-slate-300 dark:border-slate-700 "
          >
            Show me all 142 reviews
          </ButtonSecondary>
        </div>
      </div>
    );
  };

  return (
    <div>
      {product ? (
        <div className={`nc-ProductDetailPage `}>
          {/* MAIn */}
          <main className="container mt-5 lg:mt-11">
            <div className="lg:flex">
              {/* CONTENT */}
              <div className="w-full lg:w-[55%] ">
                {/* HEADING */}
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-16 relative">
                    <img
                      src={product.productImage[0]}
                      alt={product.itemName}
                      className="w-full rounded-2xl object-cover"
                    />
                  </div>
                  {/* META FAVORITES */}
                  <LikeButton className="absolute right-3 top-3 " />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-8 xl:mt-8">
                  {product.productImage.slice(0, 5).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16 relative"
                    >
                      <img
                        src={image}
                        alt={`Product Image ${index + 1}`}
                        className="w-full rounded-2xl object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
                {renderSectionContent()}
              </div>
            </div>

            {/* DETAIL AND REVIEW */}
            <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
              <div className="block xl:hidden">
                <Policy />
              </div>

              {/* {renderDetailSection()} */}

              <hr className="border-slate-700" />

              {renderReviews()}

              <hr className="border-slate-700" />

              {/* OTHER SECTION */}
              {/* <SectionSliderProductCard
            heading="Customers also purchased"
            subHeading=""
            headingFontClassName="text-2xl font-semibold"
            headingClassName="mb-10 text-neutral-50"
          /> */}

              {/* SECTION */}
              {/* <div className="pb-20 xl:pb-28 lg:pt-14">
            <SectionPromo2 />
          </div> */}
            </div>
          </main>

          {/* MODAL VIEW ALL REVIEW */}
          <ModalViewAllReviews
            show={isOpenModalViewAllReviews}
            onCloseModalViewAllReviews={() =>
              setIsOpenModalViewAllReviews(false)
            }
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProductDetailPage;
