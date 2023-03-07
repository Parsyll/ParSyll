import FeatureCard from "./helper/FeatureCard";
import calendar_svg from "../../assets/calendar2.svg"
import eye_svg from "../../assets/eye.svg"

const Features = () => {
    const feature_data = [
        {
            name: "Information Extraction",
            description:
                "Automatically parse key information from your syllabus with ParSyll",
            logo: eye_svg,
        },
        {
            name: "Calendar Generation",
            description:
                "Generate calendars for class times and office hours with location and key information attatched",
            logo: calendar_svg,

        },
    ];

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-2 mx-auto flex flex-wrap">
                {feature_data.map((feature, ind) => {
                    return (
                        <FeatureCard
                            key={ind}
                            ind={ind + 1}
                            name={feature.name}
                            description={feature.description}
                            logo_src={feature.logo}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default Features;
