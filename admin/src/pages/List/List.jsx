/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import "./List.css"
import axios from "axios"
import { toast } from "react-toastify"


const List = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);

    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Failed to fetch list");
    }
  }

  const removeFood = async (foodId) => { 
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
      if (response.data.success) {
        toast.success(response.data.message || "Food removed successfully");
      } else {
        toast.error(response.data.message || "Failed to remove food");
      } 
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>No.</b>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <b className="number">{index + 1}</b>
              <img src={`${url}/images/` + item.image} alt="image" />
              <b>{item.name}</b>
              <b>{item.category}</b>
              <b>₦{item.price}</b>
              <b onClick={() => removeFood(item._id)} className="cursor">
                X
              </b>
            </div>
          );})}
      </div>
    </div>
  );
}

export default List
