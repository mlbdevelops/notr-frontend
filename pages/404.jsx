import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const NotFound = () => {
  const router = useRouter()
  
  const [sec, setSec] = useState(3)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSec(sec -1)
    }, 1000)
  }, [sec]);
  
  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }, [])
  
  
  return(
    <div>
      <header>
        <h1>Ooopzzz</h1>
      </header>
      <h4>The page cannot be found, You'll be redirected to the <Link href="/" style={{
        textDecoration: 'none',
        color: 'lightblue',
      }} ><p>Home page</p></Link> in {sec} seconds</h4>
      
    </div>
  )
}

export default NotFound

