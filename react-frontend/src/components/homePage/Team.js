import TeamCard from "./helper/TeamCard";
import dan_img from "../../assets/dan.jpg"
import abhi_img from "../../assets/abhi.jpg"
import kennth_img from "../../assets/kenneth.jpg"

const Team = () => {
    const team_data = [
        {
            name: "Dan Peerapatanapokin",
            email: "pongpatapee1021@gmail.com",
            position: "Software Engineer",
            description: "I'm Dan",
            imgsrc: dan_img,
            socials: {github: "https://github.com/pongpatapee"},
        },
        {
            name: "Abhirakshak Raja",
            email: "abhirakshak10@gmail.com",
            position: "Software Engineer",
            description: "I'm Abhi",
            imgsrc: abhi_img,
            socials: {github: "https://github.com/Abhirakshak"},
        },
        {
            name: "Kenneth Wong Hon Nam",
            email: "cankennethwong@gmail.com",
            position: "Software Engineer",
            description: "I'm Kenneth",
            imgsrc: kennth_img, 
            socials: {github: "https://github.com/KennethWrong"},
        },
    ];

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">
                        OUR TEAM
                    </h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                        Our team's description :D
                    </p>
                </div>
                <div className="flex flex-wrap -m-4 justify-center">
                    {team_data.map((member) => {
                        return (
                            <TeamCard
                                name={member.name}
                                position={member.position}
                                description={member.description}
                                image={member.imgsrc}
                                socials={member.socials}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Team;
