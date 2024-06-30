

const RepeatDots = ({ count }) => {
    const repeatedDots = Array.from({ length: count }, (_, index) => (
        
      <div key={index} className={`dot dot-${index+1} `}></div>
    ));
  
    return <div className='dot-container'>{repeatedDots}</div>;
};
  

export default RepeatDots