import {
  Search,
  PlusCircle
} from 'lucide-react'
import styles from '../styles/header.module.scss'
import { useRouter } from 'next/router'

export default function Header({text, leftIcon, textColor, rightIcons, isTransparent, blur, bgc}){
  const router = useRouter()
  return(
    <header style={{
      backdropFilter: isTransparent? `blur(${blur})` : '',
      backgroundColor: bgc? bgc : 'transparent',
    }} className={styles.header}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
        {leftIcon}
        <h1 style={{
          fontSize: '20px',
          color: textColor,
          fontWeight: 'bold',
          padding: '0 10px',
          fontFamily: 'Arial'
        }}>{text}</h1> 
      </div>
      <div className={styles.iCont}>
        {rightIcons}
      </div>
    </header>
  )
}