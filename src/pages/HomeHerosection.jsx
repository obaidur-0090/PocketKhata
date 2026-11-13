
import HomeBanner from '../assets/HomeBanner.png'
import HomeBannerMobile from '../assets/HomeBannerMobile.png'
import video from '../assets/video.mp4'
import thumbnail from '../assets/thumbnail.png'
import paymentMethod from '../assets/paymentMethod.jpg'
import business from '../assets/business.jpg'
import customer from '../assets/customer.jpg'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import { BriefcaseMedical } from 'lucide-react';

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
        <div className='noto-sans-bengali'>
            {/* HomeBanner section */}
            <section>
                <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden border-b-4 border-red-700">
                    <img className="hidden h-[450px] w-full md:block"
                        src={HomeBanner} alt="PocketKhata home banner" />
                    <img className="block h-[400px] w-full md:hidden"
                        src={HomeBannerMobile} alt="PocketKhata mobile banner" />
                </div>
            </section>

            {/* video  */}
            <section>
                <div className='mt-10'>
                    <h1 className='text-black text-2xl md:text-5xl text-center ' data-aos="fade-up" > আপনার ব্যবসার হিসাব, এখন হাতের মুঠোয়</h1>

                    <div className='flex flex-col items-center justify-center text-center gap-10'>

                        <video className='mt-10  w-[90%] md:w-[60%]' src={video} poster={thumbnail} controls playsInline
                            preload="metadata" data-aos="zoom-in" />

                        <p className=' md:text-2xl text-center'
                            data-aos="zoom-in" >
                            বাংলাদেশের মাঝারি ব্যবসায়ীদের দৈনন্দিন হিসাব-নিকাশ সহজ, সুন্দর ও নির্ভুলভাবে পরিচালনার জন্য PocketKhata একটি স্মার্ট ডিজিটাল হিসাবরক্ষণ অ্যাপ। ব্যবসায়ীরা এই অ্যাপের মাধ্যমে বাকি বিক্রি, কেনাকাটা, আয়-ব্যয়, পণ্য ও স্টকের হিসাবসহ ব্যবসার যাবতীয় লেনদেন সহজেই সংরক্ষণ করতে পারবেন। এখন আর কাগজের খাতায় হিসাব রাখার ঝামেলা নয়—ব্যবসার প্রতিটি লেনদেন ও লাভ-ক্ষতির হিসাব থাকবে হাতের মুঠোয়, সবসময় চোখের সামনে।
                        </p>

                    </div>
                </div>
            </section>
            {/* ব্যবসার প্রতিটি হিসাব এখন হাতের মুঠোয় */}
            <section>
                <div className=" md:mt-15 flex items-center justify-center px-5 py-12 rounded-xl transition-all duration-300 md:hover:shadow-[0_8px_30px_#e8898180]">

                    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">

                        {/* img div  */}
                        <div className="w-full" data-aos="fade-right">
                            <img src={business} alt="business" className="w-full h-auto object-cover border-8 border-red-700" />
                        </div>

                        {/* text div  */}
                        <div className="w-full" data-aos="fade-left">

                            <div className="text-3xl md:text-4xl font-bold text-black mb-4">
                                ব্যবসার প্রতিটি হিসাব এখন হাতের মুঠোয়
                            </div>

                            <div className="text-lg md:text-xl leading-relaxed text-gray-800 mb-7">
                                বাকি, নগদ ও পেমেন্টের হিসাব রাখতে আলাদা আলাদা খাতার ঝামেলা বাদ দিন। PocketKhata-তে রাখুন আপনার ব্যবসার প্রতিটি লেনদেনের সহজ ও গোছানো হিসাব।
                            </div>

                            <div className="space-y-1 text-lg md:text-xl text-gray-900 mb-9">
                                <div>• কাস্টমার ও সাপ্লায়ার তালিকা</div>
                                <div>• সহজ হিসাব ব্যবস্থাপনা</div>
                                <div>• র্ভুল হিসাব পেতে আর হাতে ক্যালকুলেশন নয়</div>
                                <div>• সহজ লেনদেন রেকর্ড</div>
                                <div>• বাংলা এবং ইংরেজি ভাষায়</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* নিজের হিসাব নিজেই দেখুন, পেমেন্ট করুন ঘরে বসেই! */}
            <section>
                <div className=" md:mt-15 flex items-center justify-center px-5 py-12 rounded-xl transition-all duration-300 md:hover:shadow-[0_8px_30px_#e8898180]">

                    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">

                        {/* img div  */}
                        <div className="w-full order-1 md:order-2" data-aos="fade-left">
                            <img src={customer} alt="customer" className="w-full h-auto object-cover border-8 border-red-700 " />
                        </div>

                        {/* text div  */}
                        <div className="w-full order-2 md:order-1" data-aos="fade-right">

                            <div className="text-3xl md:text-4xl font-bold text-black mb-4">
                                নিজের হিসাব নিজেই দেখুন, পেমেন্ট করুন ঘরে বসেই!
                            </div>

                            <div className="text-lg md:text-xl leading-relaxed text-gray-800 mb-7">
                                কাস্টমারকে আর হিসাবের জন্য বারবার দোকানে আসতে হবে না। আপনার হাতের মোবাইলেই থাকবে ব্যবসার সব হিসাব।
                            </div>

                            <div className="space-y-1 text-lg md:text-xl text-gray-900 mb-9">
                                <div>• কাস্টমার ঘরে বসেই নিজের সম্পূর্ণ হিসাব দেখতে পারবেন</div>
                                <div>• মোবাইল থেকেই সহজে বকেয়া পেমেন্ট করতে পারবেন</div>
                                <div>• প্রতিটি লেনদেনের বিস্তারিত তথ্য দেখতে পারবেন</div>
                                <div>• দেনা-পাওনার আপডেট থাকবে সবসময় হাতের নাগালে</div>
                                <div>• যেকোনো সময়, যেকোনো জায়গা থেকে হিসাব দেখার সুবিধা</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Payment method 
            মোবাইল ব্যাংকিং অ্যাপ থেকে পেমেন্ট গ্রহণ করুন */}

            <section>
                <div className=" md:mt-15 flex items-center justify-center px-5 py-12 rounded-xl transition-all duration-300 md:hover:shadow-[0_8px_30px_#e8898180]">

                    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">

                        {/* img div  */}
                        <div className="w-full" data-aos="fade-right">
                            <img src={paymentMethod} alt="business" className="w-full h-auto object-cover border-8 border-red-700" />
                        </div>

                        {/* text div  */}
                        <div className="w-full" data-aos="fade-left">

                            <div className="text-3xl md:text-4xl font-bold text-black mb-4">
                                মোবাইল ব্যাংকিং অ্যাপ থেকে পেমেন্ট গ্রহণ করুন
                            </div>

                            <div className="text-lg md:text-xl leading-relaxed text-gray-800 mb-7">
                                মোবাইল ব্যাংকিং অ্যাপের মাধ্যমে সহজেই পেমেন্ট গ্রহণ করুন। গ্রাহক পেমেন্ট করলেই মুহূর্তের মধ্যে টাকা জমা হবে আপনার অ্যাকাউন্টে।
                            </div>

                            <div className="space-y-1 text-lg md:text-xl text-gray-900 mb-9">
                                <div>• ঘরে বসেই নিজের ফোন থেকে পেমেন্ট করুন।</div>
                                <div>• ঘরে বসেই আপনার হিসাব দেখে পেমেন্ট করুন।</div>
                                <div>• ঘরে বসেই মোবাইল ব্যাংকিংয়ের মাধ্যমে পেমেন্ট করুন।</div>
                                
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* সব ধরনের দোকান ও ক্ষুদ্র ব্যবসার হিসাব-নিকাশ এখন পকেটখাতায় */}
            <section>
                <div className="mt-10 ">
                    <h1 className='text-black text-2xl md:text-5xl text-center ' data-aos="fade-up" > সব ধরনের দোকান ও ক্ষুদ্র ব্যবসার হিসাব-নিকাশ এখন পকেটখাতায়</h1>
                    <div>
                        <div className='border-2 hover:bg w-1/4 '><BriefcaseMedical /></div>
                    </div>
                </div>
                
            </section>




        </div>
    )
}

export default HomeHerosection
