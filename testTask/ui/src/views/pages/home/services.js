import { Link } from "react-router-dom";

const Services = ({ title, description, link, btnTitle }) => {
  return (
    <>
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: description }} />
      <p>
        <Link class='btn btn-secondary' to={link}>
          {btnTitle} &raquo;
        </Link>
      </p>
    </>
  );
};

export default Services;
