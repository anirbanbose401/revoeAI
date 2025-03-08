import React from 'react'
import { card } from '../assets';
import styles, { layout } from '../style';
import Button from './Button';

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>Real-time <br className='sm:block hidden' /> Lead Activity Track.</h2>   
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>Never miss a beat. Monitor every move your leads make—clicks, calls, emails, and beyond. Understand their intent and engage at the perfect moment to maximize conversions.</p>
      <Button styles="mt-10" /> 
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="card" className='w-[100%] h-[100%]' />
    </div>
   
  </section>
)

export default CardDeal