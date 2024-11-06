import React, { useEffect, useState } from 'react'


const useDebounceValue = <T>(value: T, delay: number) => {
    
    const [debounceValue, setDebounceValue] = useState<T>(value)

    useEffect(()=>{

        const timeout = setTimeout(()=>{
            setDebounceValue(value)
        },delay)

        return () => {
            clearTimeout(timeout)
        }
    },[value])
    
    return debounceValue
}

export default useDebounceValue