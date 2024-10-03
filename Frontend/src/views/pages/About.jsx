import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function About() {
    return (
        <>
            <section>
                <Header/>
            </section>
            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 mx-auto">
                            <h2>Our story</h2>
                            <p>
                                <h5>Zargar Blogs: Empowering Voices, Connecting Minds</h5>
                                In a world where content is king and stories shape our understanding of the world,
                                Zargar Blogs was born with a mission to empower creators and connect readers globally.
                                Founded by a group of passionate individuals who understood the transformative power of
                                sharing knowledge, Zargar Blogs is more than just a platform—it’s a space where diverse
                                voices come together to inspire, inform, and engage.

                                The idea behind Zargar Blogs came from a simple observation: while there are countless
                                blogs and platforms, very few cater to the personal growth and professional advancement
                                of writers and readers alike. The founders of Zargar Blogs recognized the untapped
                                potential of fostering a community where creativity, education, and self-expression
                                thrive without boundaries.

                                Our Vision: Zargar Blogs envisions a world where everyone can share their ideas,
                                thoughts, and experiences. Whether you're a seasoned writer, a budding creator, or
                                simply a passionate reader, Zargar Blogs offers a platform where stories are celebrated,
                                creativity is nurtured, and everyone has the chance to make their mark.

                                Our Mission: We aim to provide a user-friendly, dynamic platform for writers of all
                                levels to showcase their work while offering readers a diverse range of topics—from
                                personal development to industry insights. Through innovative features, community
                                engagement, and a focus on quality content, Zargar Blogs empowers writers to hone their
                                craft and reach wider audiences.
                            </p>
                            <h3 className="mt-4">We do this across:</h3>
                            <ul>
                                <li>Software Engineering & Development: Expertise in .NET technologies with SQL Server,
                                    Object-Oriented Programming, and Agile methodologies.
                                </li>
                                <li>Web Application Development: Proficiency in developing web applications and
                                    websites.
                                </li>
                                <li>Cloud Native Application Design & Development:Certified in Azure, AWS, and Google
                                    Cloud platforms. Expertise in designing and developing cloud-native applications.
                                </li>
                                <li>Database Design & Management: Strong capabilities in database design, normalization,
                                    and analysis. Writing code for database access, modifications, and stored
                                    procedures. Backup and restore management for databases.
                                </li>
                                <li>Specialized Technologies:C#, ASP.NET Core, Microservices, Web API, Kubernetes,
                                    VB.NET, Python, SQL Server, PostgreSQL, DynamoDB, AWS, Oracle, Crystal Reports, Web
                                    Services.
                                </li>
                                <li>Documentation & Implementation:Full knowledge of the complete software development
                                    life cycle, from requirements gathering to implementation.Preparing comprehensive
                                    requirement and design documents to streamline the project development process.
                                </li>
                            </ul>

                        </div>
                        {" "}
                        {/* Col END */}
                    </div>
                </div>
            </section>
            <br/><br/>
            <section>
                <Footer/>
            </section>
        </>
    );
}

export default About;