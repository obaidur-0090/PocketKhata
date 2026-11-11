
const OffService = () => {
    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-yellow-50 px-4 py-10">

            <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl md:p-12">

                {/* Icon */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
                    <span className="text-5xl">🛠️</span>
                </div>

                {/* Status */}
                <div className="mt-7">
                    <span className="rounded-full bg-yellow-100 px-5 py-2 text-sm font-semibold text-yellow-700">
                        সাময়িকভাবে বন্ধ
                    </span>
                </div>

                {/* Heading */}
                <h1 className="mt-7 text-2xl font-bold leading-snug text-gray-800 md:text-3xl">
                    দুঃখিত! সার্ভিসটি এখন বন্ধ রয়েছে
                </h1>

                {/* Description */}
                <p className="mt-5 text-sm leading-7 text-gray-500 md:text-base">
                    আমরা বর্তমানে এই সার্ভিসটির উন্নয়ন ও রক্ষণাবেক্ষণের
                    কাজ করছি। খুব শীঘ্রই নতুনভাবে ফিরে আসবে।
                    সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।
                </p>

                {/* Home Button */}
                <a
                    href="/"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 font-semibold text-white transition duration-300 hover:bg-red-700 hover:shadow-lg"
                >
                    <span className="text-xl">⌂</span>
                    Back to home Page
                </a>

                {/* Footer */}
                <div className="mt-10 border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-bold text-red-600">
                        PocketKhata
                    </h2>

                    <p className="mt-2 text-sm text-gray-400">
                        আপনার ব্যবসার হিসাব, এখন হাতের মুঠোয়।
                    </p>
                </div>

            </div>

        </section>
    );
};

export default OffService;
