import RestaurantCard,{withOpenLabel} from "./RestaurantCard";
import resObj from "../utils/mockData";
import { useEffect, useState } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useInternetStatus from "../utils/useInternetStatus";
const Body =() => {

    //local state variable 
    const [listOfRestaurants, setListofRestaurants] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const OpenResCard = withOpenLabel(RestaurantCard);

    console.log("it got rendered,because the state variable changed, and for the first time before calling the api it was rendered");
    //we actually are destructring the array here;
    // const arr = useState(resObj);
    // const [listOfRestaurants, setListofRestaurants] =arr;
    useEffect(()=>{
        fetchData();
    }, []);
    const fetchData = async() => {
        console.log("fetch the data");

            const response = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=23.02760&lng=72.58710&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING");
            const result = await response.json();
            console.log(result);
            console.log(result.data.cards[1].card.card.gridElements.infoWithStyle.restaurants);
        

        setListofRestaurants(result?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
        setFilteredRestaurants(result?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
};

    const internetStatus = useInternetStatus();

    if(internetStatus===false){
        return <h1>Looks like you are offline, Please check your internet Connection</h1>
    }
    //shimmer UI is better than this 
    //conditional rendering
    // if(listOfRestaurants.length===0){
    //     return <Shimmer />;
    // }

    return  listOfRestaurants.length===0?(<Shimmer />):(
        <div className="Body"> 
            <div className="filter flex">
                <div className="search my-2 p-4">
                    
                    <input 
                        type="text"
                        className="search-box border border-solid border-black mx-1 px-4 rounded-lg bg-slate-50 hover:bg-slate-100"
                        value={searchText} 
                        onChange={(e)=>{
                            const currentSearchText = e.target.value;
                            setSearchText(e.target.value)
                           const newList=listOfRestaurants.filter((res) => {
                            return res.info.name.toLowerCase().includes(currentSearchText.toLowerCase()); 
                            });

                            setFilteredRestaurants(newList);
                        }}
                    />
                    
                    <button className="search-btn bg-green-200 px-4 py-0.5 rounded-lg  hover:bg-green-300"
                        onClick={()=>{
                            const newList1=listOfRestaurants.filter((res) => {
                            return res.info.name.toLowerCase().includes(searchText.toLowerCase()); 
                        });

                       setFilteredRestaurants(newList1);
                        }}>
                    Search</button>
                
                </div>
                <div className="search my-2 p-4">
                    <button 
                    className="filterBtn  bg-green-200 px-4 py-0.5 rounded-lg hover:bg-green-300"
                        onClick={ ()=>{
                        const newList2 = listOfRestaurants.filter(
                        (res) => res.info.avgRating>4.3
                        );
                    setFilteredRestaurants(newList2);
                    }}
                    >Top Rated Restaurants</button>
                </div>
                
            </div>
            
            <div className="res-container flex flex-wrap justify-center">
                {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                    <Link to={"./restaurants/"+restaurant.info.id} key={restaurant.info.id}>
                    {restaurant.info.isOpen?<OpenResCard resData={restaurant}/>:<RestaurantCard  resData={restaurant} />}
                    </Link>
                ))) : 
                (<div>No restaurants found</div>)
            }
            </div>
        </div>
    )
}

export default Body;