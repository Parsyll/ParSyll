import default_logo from "../../../assets/default.svg"

const FeatureCard = ({ ind, name, description, logo_src }) => {
    return (
        <div className="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto">
            <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none" />
            </div>
            <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-blue-500 text-white relative z-10 title-font font-medium text-sm">
                {ind}
            </div>
            <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="flex-shrink-0 w-24 h-24 bg-blue-100 text-blue-500 rounded-full inline-flex items-center justify-center">
                    <img
                        src={logo_src ? logo_src : default_logo}
                        alt="logo"
                        className="w-12 h-12"
                    />
                </div>
                <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                    <h2 className="font-medium title-font text-gray-900 mb-1 text-xl">
                        {name}
                    </h2>
                    <p className="leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default FeatureCard;
