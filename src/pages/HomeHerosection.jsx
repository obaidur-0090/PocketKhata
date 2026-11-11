
import HomeBanner from '../assets/HomeBanner.png'
import HomeBannerMobile from '../assets/HomeBannerMobile.png'
import video from '../assets/video.mp4'
import thumbnail from '../assets/thumbnail.png'

import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

const HomeHerosection = () => {

    useEffect(() => {
    AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
        offset: 100,
    })
}, [])

    return (
        <div>
            {/* HomeBanner section */}
            <section>
                <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden border-b-4 border-red-500">
                    <img className="hidden h-[450px] w-full md:block"
                        src={HomeBanner} alt="PocketKhata home banner" />
                    <img className="block h-[400px] w-full md:hidden"
                        src={HomeBannerMobile} alt="PocketKhata mobile banner" />
                </div>
            </section>

            <div className='mt-10'>
                <h1 className='text-black text-2xl md:text-5xl text-center noto-sans-bengali' data-aos="fade-up" > আপনার ব্যবসার হিসাব, এখন হাতের মুঠোয়</h1>

                <div className='flex flex-col items-center justify-center text-center gap-10'>

                    <video className='mt-10  w-[90%] md:w-[60%]' src={video} poster={thumbnail} controls playsInline
                        preload="metadata" data-aos="zoom-in" />

                    <p className='noto-sans-bengali md:text-2xl text-center'
                        data-aos="zoom-in" >
                        বাংলাদেশের মাঝারি ব্যবসায়ীদের দৈনন্দিন হিসাব-নিকাশ সহজ, সুন্দর ও নির্ভুলভাবে পরিচালনার জন্য PocketKhata একটি স্মার্ট ডিজিটাল হিসাবরক্ষণ অ্যাপ। ব্যবসায়ীরা এই অ্যাপের মাধ্যমে বাকি বিক্রি, কেনাকাটা, আয়-ব্যয়, পণ্য ও স্টকের হিসাবসহ ব্যবসার যাবতীয় লেনদেন সহজেই সংরক্ষণ করতে পারবেন। এখন আর কাগজের খাতায় হিসাব রাখার ঝামেলা নয়—ব্যবসার প্রতিটি লেনদেন ও লাভ-ক্ষতির হিসাব থাকবে হাতের মুঠোয়, সবসময় চোখের সামনে।
                    </p>

                </div>
            </div>
        </div>
    )
}

export default HomeHerosection
