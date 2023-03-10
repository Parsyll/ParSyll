// Using components from: https://tailblocks.cc/

import { useNavigate } from "react-router-dom";
import demo_img from "../../assets/demo.png";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="text-gray-600 body-font">
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                        Welcome to ParSyll!
                    </h1>
                    <p className="mb-8 leading-relaxed">
                        We aim to automate your early semester syllabus reading.
                        ParSyll parses key information from your syllabus such
                        as class times, office hours, and locations!
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/signup");
                            }}
                            className="inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg"
                        >
                            Sign up
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
                            }}
                            className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
                        >
                            Login
                        </button>
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    <img
                        className="object-cover object-center rounded border-2"
                        alt="hero"
                        // src="https://dummyimage.com/720x600"
                        src={demo_img}
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
