/* eslint-disable no-unused-vars */

import { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {food_list} =  useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index)=>{
          if(category === 'All' || category === item.category){
            return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
           }
        })}

       {/* {food_list.filter((food) => category === 'All' ? true : food.category === category).map((food) => (
          <div className="food-card" key={food.id}>
            <img src={food.image} alt={food.name} />
            <h3>{food.name}</h3>
            <p>{food.description}</p>
            <p className='price'>${food.price}</p>
          </div>
        ))
        } */}
      </div>
    </div>
  )
}

export default FoodDisplay
 