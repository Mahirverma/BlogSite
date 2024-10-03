import React, {useState, useEffect} from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import {Link, useParams} from "react-router-dom";
import {useNavigate} from 'react-router-dom';

import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";
import Moment from "../../plugin/Moment.js";
import useUserData from "../../plugin/useUserData.js";

function Detail() {
    const [post, setPost] = useState([]);
    const [tags, setTags] = useState([]);
    const [createComment, setCreateComment] = useState("");
    const navigate = useNavigate();
    const userId = useUserData()?.user_id;

    const param = useParams();

    const fetchPost = async () => {
        const response = await apiInstance.get(`post/detail/${param.slug}/`);
        setPost(response.data);

        const tagArray = response.data?.tags?.split(",");
        setTags(tagArray);
    };

    useEffect(() => {
        fetchPost();
    }, []);

    const handleCreateCommentChange = (event) => {
        setCreateComment({
            ...createComment,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreateCommentSubmit = async (e) => {
        e.preventDefault();

        console.log(post.id);
        console.log(createComment.comment);

        const jsonData = {
            user_id: userId,
            post_id: post?.id,
            comment: createComment.comment,
        };

        const response = await apiInstance.post(`post/comment-post/`, jsonData);
        console.log(response);
        // await fetchPost();
        Toast("success", "Comment Posted.", "");
        setCreateComment("");
    };

    const handleLikePost = async () => {
        const json = {
            user_id: userId,
            post_id: post?.id,
        };
        try {
            const response = await apiInstance.post('post/like-post/', json);
            console.log(response.data);
            Toast("success", response.data.message);
            fetchPost();
        } catch (error) {
            console.error('Unauthorized, redirecting to login...');
            navigate('/login/');
        }


    }

    const handleBookmarkPost = async () => {
        const json = {
            user_id: userId,
            post_id: post?.id,
        };
        try {
            const response = await apiInstance.post('post/bookmark-post/', json);
            console.log(response.data)
            fetchPost();
            Toast("success", response.data.message);
        } catch (error) {
            console.error('Unauthorized, redirecting to login...');
            navigate('/login/');
        }
    }

    return (
        <>
            <section>
                <Header/>
            </section>
            <section className=" mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <a href="#" className="badge bg-danger mb-2 text-decoration-none">
                                <i className="small fw-bold "/>
                                {post.category?.title}
                            </a>
                            <h1 className="text-center">{post.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container position-relative" data-sticky-container="">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="text-start text-lg-center mb-5" data-sticky="" data-margin-top={80}
                                 data-sticky-for={991}>
                                <div className="position-relative">
                                    <div className="avatar avatar-xl">
                                        <img className="avatar-img" style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "contain",
                                            borderRadius: "50%"
                                        }} src={post.profile?.image} alt="avatar"/>
                                    </div>
                                    <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                                        {post.profile?.full_name}
                                    </a>
                                    <p>{post.profile?.bio}</p>
                                </div>

                                <hr className="d-none d-lg-block "/>

                                <ul className="list-inline list-unstyled">
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-calendar"></i> {Moment(post.date)}
                                    </li>
                                    {/*<li className="list-inline-item d-lg-block my-lg-2 text-start">*/}
                                    {/*    <i className="fas fa-clock"></i> 5 min read*/}
                                    {/*</li>*/}
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <a href="#" className="text-body">
                                            <i className="fas fa-heart me-1"/>
                                        </a>
                                        {post.likes?.length} Likes
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-eye me-1"/>
                                        {post.view} Views
                                    </li>
                                </ul>
                                {/* Tags */}
                                <ul className="list-inline text-primary-hover mt-0 mt-lg-3 text-start">
                                    {tags?.map((t, index) => (
                                        <li className="list-inline-item" key={index}>
                                            <a className="text-body text-decoration-none fw-bold" href="#">
                                                #{t}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={handleLikePost} className="btn btn-primary">
                                    <i className="fas fa-thumbs-up me-2"></i>
                                    {post?.likes?.length}
                                </button>

                                <button onClick={handleBookmarkPost} className="btn btn-danger ms-2">
                                    <i className="fas fa-bookmark"></i>
                                </button>
                            </div>
                        </div>
                        {/* Left sidebar END */}
                        {/* Main Content START */}
                        <div className="col-lg-10 mb-5">
                            <p dangerouslySetInnerHTML={{__html: post.description}}></p>


                            {/*<hr />*/}
                            {/*<div className="d-flex py-4">*/}
                            {/*    <a href="#">*/}
                            {/*        <div className="avatar avatar-xxl me-4">*/}
                            {/*            <img className="avatar-img rounded-circle" src={post.profile?.image} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} alt="avatar" />*/}
                            {/*        </div>*/}
                            {/*    </a>*/}
                            {/*    <div>*/}
                            {/*        <div className="d-sm-flex align-items-center justify-content-between">*/}
                            {/*            <div>*/}
                            {/*                <h4 className="m-0">*/}
                            {/*                    <a href="#" className="text-dark text-decoration-none">*/}
                            {/*                        {post.profile?.full_name}*/}
                            {/*                    </a>*/}
                            {/*                </h4>*/}
                            {/*                <small>{post.profile?.bio}</small>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*        <p className="my-2">{post.profile?.about}</p>*/}
                            {/*        /!* Social icons *!/*/}
                            {/*        <ul className="nav">*/}
                            {/*            {post.profile?.facebook !== null && (*/}
                            {/*                <li className="nav-item">*/}
                            {/*                    <a className="nav-link ps-0 pe-2 fs-5" target="_blank" href={post.facebook}>*/}
                            {/*                        <i className="fab fa-facebook-square" />*/}
                            {/*                    </a>*/}
                            {/*                </li>*/}
                            {/*            )}*/}
                            {/*            {post.profile?.twitter !== null && (*/}
                            {/*                <a className="nav-link px-2 fs-5" target="_blank" href={post.twitter}>*/}
                            {/*                    <li className="nav-item">*/}
                            {/*                        <i className="fab fa-twitter-square" />*/}
                            {/*                    </li>*/}
                            {/*                </a>*/}
                            {/*            )}*/}
                            {/*        </ul>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div>
                                <h3>{post.comments?.length} comments</h3>
                                {post.comments?.map((c, index) => (
                                    <div className="my-4 d-flex bg-light p-3 mb-3 rounded" key={index}>
                                        <img
                                            className="avatar avatar-md rounded-circle float-start me-3"
                                            src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit: "cover",
                                                borderRadius: "50%"
                                            }}
                                            alt="avatar"
                                        />
                                        <div>
                                            <div className="mb-2">
                                                <h5 className="m-0">{c.name}</h5>
                                                <span className="me-3 small">{Moment(c.date)}</span>
                                            </div>
                                            <p className="fw-bold">{c.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Comments END */}
                            {/* Reply START */}
                            <div className="bg-light p-3 rounded">
                                <h3 className="fw-bold">Leave a reply</h3>
                                <form className="row g-3 mt-2" onSubmit={handleCreateCommentSubmit}>
                                    <div className="col-12">
                                        <label className="form-label">Leave a Comment *</label>
                                        <textarea onChange={handleCreateCommentChange} name="comment"
                                                  value={createComment.comment} className="form-control" rows={4}/>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary">
                                            Post comment <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <Footer/>
            </section>
        </>
    );
}

export default Detail;