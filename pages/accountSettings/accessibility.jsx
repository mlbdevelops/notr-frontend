import Header from '../../components/header.jsx';
import { useRouter } from 'next/router';
import { ChevronLeft, Type, ChevronRight } from 'lucide-react';
import styles from '../../styles/accessibility.module.scss';
import { useState, useEffect } from 'react';

export default function accessibility(){
  const router = useRouter();
  const [size, setSize] = useState();
  
  useEffect(() => {
    setSize(localStorage.getItem('size') || 2);
  }, []);
  
  return(
    <div style={{
      margin: '70px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '100px',
    }}>
      <Header
        leftIcon={<ChevronLeft onClick={() => router.back()} style={{padding: '10px', cursor: 'pointer'}}/>}
        text='Accessibility'
        isTransparent={true}
        blur={'10px'}
      />
      
      <div className={styles.fontsize}>
        <span style={{
          width: '90%',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          padding: '10px 0',
          gap: '10px',
          fontWeight: 'bold',
        }}>
          <Type style={{
            padding: '7.5px',
            backgroundColor: 'white',
            borderRadius: '8px',
          }} color={'black'} size={20}/> Font size
        </span>
        <span style={{
          width: '90%',
          margin: '10px 0',
          overflow: 'scroll',
          fontSize: size == 0 ? '16px' 
            : size == 1 ? '17px' 
            : size == 2 ? '18px' 
            : size == 3 ? '20px' 
            : size == 4 ? '22px' 
            : '18px',
        }}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis modi eligendi cupiditate perferendis enim culpa quaerat. Dignissimos recusandae quia mollitia dolores quis quo minus quidem officiis cupiditate minima, at explicabo iste. Officia veritatis suscipit obcaecati numquam culpa eaque tempora qui deleniti neque cumque hic velit impedit accusamus, quia illum cum autem ea quos quibusdam porro? Molestias veniam dolor quos facere a cum aliquam, dolores reiciendis explicabo eius possimus! Similique, voluptas.
        </span>
        
        <div style={{
          padding: '20px 10px',
          borderRadius: '8px',
          border: '0.1px solid #262626',
          width: '90%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '95%',
            height: 0,
            border: '1px solid #505050',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          	<div style={{border: '1px solid #424242', height: '8px', width: 0, borderRadius: '50px',}}></div>
          	<div style={{border: '1px solid #424242', height: '10px', width: 0, borderRadius: '50px',}}></div>
          	<div style={{border: '1px solid #424242', height: '15px', width: 0, borderRadius: '50px',}}></div>
          	<div style={{border: '1px solid #424242', height: '10px', width: 0, borderRadius: '50px',}}></div>
          	<div style={{border: '1px solid #424242', height: '8px', width: 0, borderRadius: '50px',}}></div>
          </div>
          
          <input 
            style={{
              width: '100%',
            }} 
            type="range" 
            value={size}
            onChange={(e) => {
              setSize(e.target.value)
              localStorage.setItem('size', e.target.value)
            }} 
            max={4}
            min={0}
          />
        </div>
      </div>
    </div>
  );
}