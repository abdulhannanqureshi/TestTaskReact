const Banner = ({title, description}) => {
  return (
    <div className='inner-banner'>
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    </div>
  );
};

export default Banner;