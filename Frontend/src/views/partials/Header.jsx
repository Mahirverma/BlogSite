import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAuthStore} from "../../store/auth";
import apiInstance from "../../utils/axios.js";


function Header() {
    const [isLoggedIn, user] = useAuthStore((state) => [state.isLoggedIn, state.user]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/search/${searchTerm}`);
    };


    return (
        <header className="navbar-dark navbar-sticky header-static" style={{ background: 'linear-gradient(to right, #7bc393, #31b7c2)' }}>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img className="navbar-brand-item dark-mode-item"
                             src="https://i.postimg.cc/HsbLDCcX/cropped-logo-removebg-preview.png" style={{width: "200px"}} alt="logo"/>
                    </Link>
                    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="h6 d-none d-sm-inline-block text-white">Menu</span>
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="nav mt-3 mt-lg-0 px-4 flex-nowrap align-items-center">
                            <div className="nav-item w-100">
                                <form onSubmit={handleSubmit} className="rounded position-relative">
                                    <input className="form-control pe-5 bg-light"
                                           type="search"
                                           placeholder="Search Articles" aria-label="Search"/>
                                    <Link to={"/search/"}
                                          className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y"
                                          type="submit">
                                        <i className="bi bi-search fs-5"> </i>
                                    </Link>
                                </form>
                            </div>
                        </div>
                        <ul className="navbar-nav navbar-nav-scroll ms-auto">
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/category/">
                                    Category
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/about/">
                                    About
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/contact/">
                                    Contact
                                </Link>
                            </li>

                        </ul>

                        {isLoggedIn() ? (
                            <>

                                <ul className="navbar-nav navbar-nav-scroll">
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle active" href="#" id="pagesMenu"
                                           data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Menu
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                                            <li>
                                                <Link className="dropdown-item" to="/dashboard/">
                                                    <i className="fas fa-user"></i> Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/posts/">
                                                    <i className="bi bi-grid-fill"></i> Posts
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/add-post/">
                                                    <i className="fas fa-plus-circle"></i> Add Post
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/comments/">
                                                    <i className="bi bi-chat-left-quote-fill"></i> Comments
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/notifications/">
                                                    <i className="fas fa-bell"></i> Notifications
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/profile/">
                                                    <i className="fas fa-user-gear"></i> Profile
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>

                                    <li className="nav-item">
                                        <Link to={"/logout/"} className="btn btn-danger ms-2" href="dashboard.html">
                                            Logout <i className="fas fa-sign-out-alt"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <ul className="navbar-nav navbar-nav-scroll">
                                    <li className="nav-item">
                                        <Link to={"/register/"} className="btn btn-success" href="dashboard.html">
                                            Register <i className="fas fa-user-plus"></i>
                                        </Link>
                                        <Link to={"/login/"} className="btn btn-success ms-2" href="dashboard.html">
                                            Login <i className="fas fa-sign-in-alt"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </>
                        )}


                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;