import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLog } from '../../Redux/Features/LogSlice'

const Log = () => {
    const dispatch=useDispatch()
    const logs=useSelector((state)=>state.logs)
    console.log(logs);
    

    useEffect(()=>{
        dispatch(getAllLog())
    },[])
  return (
    <div>Log</div>
  )
}

export default Log