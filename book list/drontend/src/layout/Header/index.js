import React from "react";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";

const Header = () => {
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
      </nav>
    </header>
  );
};
export default Header;
