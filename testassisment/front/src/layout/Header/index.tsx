import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import Dropdown from 'react-bootstrap/Dropdown'
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const {profile, setProfile, logout} = useStore();
  useEffect(() => {
    setProfile();
  }, []);

  const handleLogout = () => {
    logout();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(AppRoutes.HOME);
    }
  };

  return (
    <header>
      <nav className='navbar navbar-expand-md navbar-dark fixed-top'>
        <Link className='navbar-brand' to='/'>
          Logo
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarsExampleDefault'
          aria-controls='navbarsExampleDefault'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarsExampleDefault'>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item active'>
              <Link className='nav-link' to={AppRoutes.HOME}>
                Home <span className='sr-only'>(current)</span>
              </Link>
            </li>
            <li className='nav-item active'>
              <Link className='nav-link' to={AppRoutes.BOOK_LIST}>
                Book List
              </Link>
            </li>
          </ul>
        </div>
        <div>
        {profile && Object.keys(profile).length ?
        <Dropdown>
          <Dropdown.Toggle variant="link" id="dropdown-basic">
            {profile.first_name ? profile.first_name : null }
            {profile.imageUrl ? <img className="user-pic" src={profile.imageUrl} alt="profile" /> : null }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> : null}
        </div>
      </nav>
    </header>
  );
};
export default Header;
