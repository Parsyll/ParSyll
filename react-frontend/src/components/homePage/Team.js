import TeamCard from "./helper/TeamCard";

const Team = () => {
    const team_data = [
        {
            name: "Dan Peerapatanapokin",
            email: "pongpatapee1021@gmail.com",
            position: "Software Engineer",
            description: "I'm Dan",
            imgsrc: "",
            socials: {},
        },
        {
            name: "Abhirakshak Raja",
            email: "abhirakshak10@gmail.com",
            position: "Software Engineer",
            description: "I'm Abhi",
            imgsrc: "",
            socials: {},
        },
        {
            name: "Kenneth Wong Hon Nam",
            email: "cankennethwong@gmail.com",
            position: "Software Engineer",
            description: "I'm Kenneth",
            imgsrc: "",
            socials: {},
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
