import React from 'react'
import { features } from '../constants';
import styles, { layout } from '../style';
import Button from './Button';

const FeatureCard = ({ icon, title, content, index }) => (
  <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? 'mb-6' : 'mb-0'} feature-card`}>
    <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
      <img src={icon} alt="icon" className='w-[50%] h-[50%] object-contain'/>
    </div>
    <div className='flix-1 flex flex-col ml-3'>
      <h4 className='font-poppins font-semibold text-[18px] text-white leading-[23px] mb-1'>
        {title}
      </h4>
      <p className='font-poppins font-normal text-[16px] text-dimWhite leading-[24px] mb-1'>
        {content}
      </p>
    </div>
  </div>
)

const Business = () => {
  return (
    <section if='features' className={layout.section} >
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>Empowering Sales <br className='sm:block hidden ' /> Team with AI</h2>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>Automate tedious tasks, engage leads faster, and
        turn potential into profit like never before.</p>

        <Button styles="mt-10" />
      </div>

      <div className={`${layout.sectionImg} flex-col`}>
        {features.map((feature, index) => (
          <FeatureCard key={feature.id} {...feature} index={index}/>
          ))}
      </div>
    </section >
  )
}

export default Business