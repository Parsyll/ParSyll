import loadingGif from '../assets/loading_running.gif'


const HomePage = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-4xl font-bold'>
                    Welcome to ParSyll!
                </h1>

                <p className="max-w-lg">
                    ParSyll is a webapp aimed to automate your start of the semester syllabus reading!
                    We will automatically parse key information form your syllabus with AI tools such as ChatGPT :D 
                </p>
            </div>
            
            {/* <img src={loadingGif} alt="loading..." /> */}
        </div>
    )
}

export default HomePage;