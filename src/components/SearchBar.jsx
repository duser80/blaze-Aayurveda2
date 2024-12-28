import React, { useState, useEffect, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import { Cross1Icon } from "@radix-ui/react-icons";
import {getCollectionData } from "@/src/utils/get-url";


const SearchBar = React.memo(
  ({
    events,
    isActive,
    setIsActive,
    filteredEvents,
    setFilteredEvents,
    products,
    filteredProducts,
    setFilteredProducts,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState({
      date: null,
      payment: null,
      price: null,
      category: null,
    });
    const [categories, setCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const fetchCategories = async () => {
      const data = await getCollectionData("category");
      console.log(data, "fetched categories");
      setCategories(data.map(category => ({ value: category._id, name: category.name })));
    };
    
    const onSearch = useCallback(
      ({ term, date, payment, price, category, event }) => {
        // Check if events are passed
        if (events && filteredEvents && setFilteredEvents) {
          let result = events;

          if (term) {
            result = result.filter((event) =>
              event.eventName.toLowerCase().includes(term.toLowerCase())
            );
          }

          if (date) {
            result = result.filter((event) => {
              const eventDate = new Date(event.eventDateTime);
              const filterDate = new Date(date);
              return (
                eventDate.toISOString().split("T")[0] ===
                filterDate.toISOString().split("T")[0]
              );
            });
          }

          if (payment) {
            result = result.filter((event) =>
              payment === "Free"
                ? Number(event.fees) === 0
                : Number(event.fees) !== 0
            );
          }

          setFilteredEvents(result);
        }

        // If products are passed, perform search on products
        if (products && filteredProducts && setFilteredProducts) {
          let productResult = products;
          console.log(productResult);

          if (term) {
            productResult = productResult.filter((product) =>
              product.itemName.toLowerCase().includes(term.toLowerCase())
            );
          }

          if (price) {
            productResult = productResult.filter(
              (product) => product.price <= price
            );
          }

          console.log(category, "category");
          if (category) {
            console.log("it works");
            productResult = productResult.filter(
              (product) =>
                product.category === category
            );
          }
          console.log(productResult, " categorised products");
          // Add other filters for products here

          setFilteredProducts(productResult);
        }
      },
      [events, products]
    );

    const handleSearchChange = useCallback((e) => {
      setIsActive(true);
      setSearchTerm(e.target.value);
    }, []);

    const handleCategoryChange = useCallback(
      (e) => {
        setFilter({ ...filter, category: e.target.value });
        console.log(e.target.value); // Check if category value is being set correctly
        setIsActive(true);
      },
      [filter]
    );

    const handlePaymentChange = useCallback(
      (e) => {
        setFilter({ ...filter, payment: e.target.value });
        setIsActive(true);
      },
      [filter]
    );

    useEffect(() => {
      onSearch({
        term: searchTerm,
        date: filter.date,
        payment: filter.payment,
        price: filter.price,
        category: filter.category,
        event: events,
      });
    }, [searchTerm, filter, onSearch]);

        /*...*/
    useEffect(() => {
      fetchCategories();
    }, []);

    return (
      <div className="flex w-full justify-center my-6 ">
        <div className="search-bar w-full mx-12">
          <div className="flex items-center bg-white rounded-full shadow-xl">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 ml-4" />{" "}
            {/* Search icon */}
            <input
              className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              // onFocus={() => setIsActive(true)}
              // onBlur={() => setIsActive(false)}
            />
            <div className="p-4">
              <button
                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5" /> {/* Filter icon */}
              </button>
            </div>
            {isActive ? (
              <div className="p-4">
                <button
                  className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
                  onClick={() => setIsActive(!isActive)}
                >
                  <XMarkIcon className="h-5 w-5" /> {/* Filter icon */}
                </button>
              </div>
            ) : null}
          </div>
          {showFilters && (
            <div className="mt-4 flex flex-col items-start">
              {events && (
                <>
                  <input
                    className="mr-2 leading-tight mb-2 bg-white p-2 rounded border border-gray-300 text-black"
                    type="date"
                    onChange={(e) =>
                      setFilter({ ...filter, date: e.target.value })
                    }
                  />
                  <div
                    onChange={handlePaymentChange}
                    className="flex items-center"
                  >
                    <input
                      className="mr-2 leading-tight"
                      type="radio"
                      value="Paid"
                      name="payment"
                    />{" "}
                    Paid
                    <input
                      className="mr-2 leading-tight"
                      type="radio"
                      value="Free"
                      name="payment"
                    />{" "}
                    Free
                  </div>
                </>
              )}
              {/* Add other filters for products here */}
              {products && (
                <>
                  <input
                    className="mr-2 leading-tight mb-2 bg-white p-2 rounded border border-gray-300 text-black"
                    type="number"
                    placeholder="Max price"
                    onChange={(e) =>
                      setFilter({ ...filter, price: e.target.value })
                    }
                  />
                    <select
                      className="mr-2 leading-tight mb-2 bg-white p-2 rounded border border-gray-300 text-black"
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category.value}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default SearchBar;
