import middlefinger from "../assets/middle-finger.gif"

const HomeHerosection = () => {
    return (
        <div>
            
            <div className="flex flex-col items-center gap-10 mt-5">
                <h1 className="md:text-4xl font-bold ">This apps edit by obaidur</h1>
                <img className="w-[300px] md:w-[400px] h-auto " src={middlefinger} alt="" />

            </div>
            
        </div>
    );
};

export default HomeHerosection;