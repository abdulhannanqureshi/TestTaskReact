import { Link } from "react-router-dom";

const Banner = ({ title, description, btnTitle, link }) => {
  return (
    <div className='pt-5'>
      <div className='jumbotron'>
        <div className='container'>
          <h1 className='display-3'>{title}</h1>
          <p>{description}</p>
          <p>
            <Link className='btn btn-primary btn-lg' to={link}>
              {btnTitle}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
