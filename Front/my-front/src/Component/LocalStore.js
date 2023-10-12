import React from 'react'
import {useLocalStorage} from 'usehooks-ts';

export default function LocalStore() {

  const [count, setCount] = useLocalStorage('count',0)

  const handleClick = () => {
    setCount(count + 1);
  }

  return (

    <div>
      <button onClick={handleClick}>Click to increment</button>
      <p>{count}</p>
    </div>
  )
}
