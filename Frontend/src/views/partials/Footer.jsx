import React from "react";

function Footer() {
    return (
        <footer>
            <div className="row py-5 mx-0 card card-header  flex-row align-items-center text-center text-md-start" style={{ background: 'linear-gradient(to right, #7bc393, #31b7c2)' }}>
                <div className="col-md-5 mb-3 mb-md-0">
                    <div className="text-primary-hover text-white">
                        2024{" "}
                        <a href="#" className="text-reset btn-link ms-2 me-2 ">
                            ZargarBlogs
                        </a>
                        | All rights reserved
                    </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                    <img src="https://i.postimg.cc/HsbLDCcX/cropped-logo-removebg-preview.png" style={{ width: "200px" }} alt="footer logo" />
                </div>
                <div className="col-md-4">
                    <ul className="nav text-primary-hover justify-content-center justify-content-md-end">
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="#">
                                <i className="fab fa-facebook-square" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="#">
                                <i className="fab fa-twitter-square" />
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="#">
                                <i className="fab fa-youtube-square" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;