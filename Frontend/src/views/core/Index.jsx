import {useState, useEffect} from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import {Link} from "react-router-dom";

import Moment from "../../plugin/Moment";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";

function Index() {
    const [posts, setPosts] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [category, setCategory] = useState([]);

    const fetchPosts = async () => {
        const response = await apiInstance.get(`post/lists/`);
        setPosts(response.data);
    };

    const fetchPopularPost = () => {
        const sortedPopularPost = [...posts]?.sort((a, b) => b.view - a.view);
        setPopularPosts(sortedPopularPost);
    };

    const fetchTrendingPost = () => {
        const sortedTrendingPost = [...posts]?.sort((a, b) => b.likes.length - a.likes.length);
        setTrendingPosts(sortedTrendingPost);
    };

    const fetchCategory = async () => {
        const response = await apiInstance.get(`post/category/list/`);
        setCategory(response.data);
    };

    useEffect(() => {
        fetchPosts();
        fetchCategory();
    }, []);

    useEffect(() => {
        fetchPopularPost();
        fetchTrendingPost();
    }, [posts]);

    // Pagination
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const trendingPostItems = trendingPosts.slice(indexOfFirstItem, indexOfLastItem);
    const popularPostsItems = popularPosts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(posts.length / itemsPerPage);
    const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1);

    const handleLikePost = async (postId) => {
        const jsonData = {
            user_id: useUserData()?.user_id,
            post_id: postId,
        };
        const response = await apiInstance.post(`post/like-post/`, jsonData);
        console.log(response.data);
        fetchPosts();

        Toast("success", response.data.message, "");
    };

    const handleBookmarkPost = async (postId) => {
        const jsonData = {
            user_id: useUserData()?.user_id,
            post_id: postId,
        };
        const response = await apiInstance.post(`post/bookmark-post/`, jsonData);
        console.log(response.data);
        fetchPosts();

        Toast("success", response.data.message, "");
    };

    return (
        <div>
            <section>
                <Header/>
            </section>
            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <a href="#" className="d-block card-img-flash">
                                <img src="assets/images/adv-3.png" alt=""/>
                            </a>
                            <h2 className="text-start d-block mt-1">Trending Articles 🔥</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        {trendingPostItems?.map((p) => (
                            <div className="col-sm-6 col-lg-3" key={p?.id}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img className="card-img"
                                             style={{width: "100%", height: "160px", objectFit: "cover"}} src={p.image}
                                             alt={p.title}/>
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                            <Link to={`${p.slug}`}
                                                  className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                {p.title?.slice(0, 32) + "..."}
                                            </Link>
                                        </h4>
                                        <button type="button" onClick={() => handleBookmarkPost(p.id)}
                                                style={{border: "none", background: "none"}}>
                                            <i className="fas fa-bookmark text-danger"></i>
                                        </button>
                                        <button onClick={() => handleLikePost(p.id)}
                                                style={{border: "none", background: "none"}}>
                                            <i className="fas fa-thumbs-up text-primary"></i>
                                        </button>
                                        {" "}
                                        {p.likes?.length}
                                        <ul className="mt-3 list-style-none" style={{listStyle: "none"}}>
                                            <li>
                                                <a href="#" className="text-dark text-decoration-none">
                                                    <i className="fas fa-user"></i> {p.profile?.full_name}
                                                </a>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i> {Moment(p.date)}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i> {p.view} Views
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <nav className="d-flex mt-5">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link me-1" onClick={() => setCurrentPage(currentPage - 1)}>
                                    <i className="ci-arrow-left me-2"/>
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {pageNumbers.map((number) => (
                                <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(number)}>
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <ul className="pagination">
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link ms-1" onClick={() => setCurrentPage(currentPage + 1)}>
                                    Next
                                    <i className="ci-arrow-right ms-3"/>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>

            <section className="bg-light pt-5 pb-5 mb-3 mt-3">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-12 ">
                            <div className="mb-4">
                                <h2>Categories</h2>
                            </div>
                            <div className="d-flex flex-wrap justify-content">
                                {category?.map((c) => (
                                    <div className="mt-2" key={c?.id}>
                                        <Link to={`/category/${c.slug}/`}>
                                            <div className="card bg-transparent">
                                                <img className="card-img" src={c.image}
                                                     style={{width: "150px", height: "80px", objectFit: "cover"}}
                                                     alt="card image"/>
                                                <div className="d-flex flex-column align-items-center mt-3 pb-2">
                                                    <h5 className="mb-0">{c.title}</h5>
                                                    <small>{c.post_count} Articles</small>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <a href="#" className="d-block card-img-flash">
                                <img src="assets/images/adv-3.png" alt=""/>
                            </a>
                            <h2 className="text-start d-block mt-1">Popular Articles 🕒</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        {popularPostsItems?.map((p) => (
                            <div className="col-sm-6 col-lg-3" key={p?.id}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img className="card-img"
                                             style={{width: "100%", height: "160px", objectFit: "cover"}} src={p.image}
                                             alt={p.title}/>
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                            <Link to={`${p.slug}`}
                                                  className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                {p.title?.slice(0, 32) + "..."}
                                            </Link>
                                        </h4>
                                        <ul className="mt-3 list-style-none" style={{listStyle: "none"}}>
                                            <li>
                                                <a href="#" className="text-dark text-decoration-none">
                                                    <i className="fas fa-user"></i> {p.profile?.full_name}
                                                </a>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i> {Moment(p.date)}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i> {p.view} Views
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <nav className="d-flex mt-5">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link me-1" onClick={() => setCurrentPage(currentPage - 1)}>
                                    <i className="ci-arrow-left me-2"/>
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {pageNumbers.map((number) => (
                                <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(number)}>
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <ul className="pagination">
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link ms-1" onClick={() => setCurrentPage(currentPage + 1)}>
                                    Next
                                    <i className="ci-arrow-right ms-3"/>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>
            <section>
                <Footer/>
            </section>
        </div>
    );
}

export default Index;