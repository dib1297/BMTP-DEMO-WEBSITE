/* -------------------------------------------------------------
 * "বারো মাসে তেরো পার্বণ" Event Registration JS
 * Dynamic Template System, Interactive Validation, Downloads & Print
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure user is logged in
    const supabase = window.supabaseClient;
    if (!supabase) {
        console.error("Supabase client is not initialized.");
        return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
        // We no longer redirect if !session to allow guest registrations
    });

    // We will save the current user ID for later
    let currentUser = null;
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            currentUser = user;
        }
    });


    // --- Helper Function: Translate Numbers to Bengali ---
    const toBengaliNumber = (num) => {
        const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(num).split('').map(digit => {
            return bengaliDigits[digit] || digit;
        }).join('');
    };

    // --- Competitions Configuration Object (Reusable Template) ---
    const competitionsConfig = {
        drawing: {
            id: 'drawing',
            title: 'Drawing Competition 2026',
            subtitle: 'বারো মাসে তেরো পার্বণ আয়োজিত অঙ্কন প্রতিযোগিতা',
            emoji: '🎨',
            tagIcon: 'fa-palette',
            bannerUrl: 'assets/hero_bg.png',
            pdfUrl: 'assets/BMTP_Drawing_Form_Yellow_Frame_Final.pdf',
            status: 'open',
            feeText: '৬০ টাকা',
            details: [
                { icon: 'fa-calendar-days', label: 'প্রতিযোগিতার তারিখ', value: '২৮শে আগস্ট (রাখীবন্ধন উৎসবের পুণ্য দিন)' },
                { icon: 'fa-clock', label: 'সময়সীমা', value: 'বিভাগ অনুযায়ী সময়সূচী (নিচে দেখুন)' },
                { icon: 'fa-map-location-dot', label: 'স্থান', value: 'দিনহাটা হেমন্ত বসু কর্নার' },
                { icon: 'fa-indian-rupee-sign', label: 'নিবন্ধন ফি', value: '৬০ টাকা (ফর্ম ফিলাপ ফি মাত্র)' },
                { icon: 'fa-paintbrush', label: 'মূল বিষয়বস্তু', value: '"যেমন খুশি আঁকো" (সকল বিভাগের জন্য একই বিষয়)' },
                { icon: 'fa-children', label: 'বিভাগসমূহ', value: 'বিভাগ ক থেকে ঙ' },
                { icon: 'fa-calendar-circle-exclamation', label: 'নিবন্ধন', value: '২৮শে আগস্ট (অন-স্পট নিবন্ধনের সুযোগসহ)' },
                { icon: 'fa-phone-volume', label: 'যোগাযোগ', value: '+৯১ ৯৮৭৬৫ ৪৩২১০' }
            ],
            rules: [
                'সময়ানুবর্তিতা ও উপস্থিতি: প্রতিটি বিভাগের প্রতিযোগীদের তাদের নির্ধারিত সময়ের অন্তত ৩০ মিনিট পূর্বে দিনহাটা হেমন্ত বসু কর্নার প্রাঙ্গণে উপস্থিত হতে হবে। নির্দিষ্ট সময় পার হয়ে যাওয়ার পর কোনো প্রতিযোগীকে অঙ্কন কক্ষে প্রবেশ করতে দেওয়া হবে না।',
                'অঙ্কন সামগ্রী ও পেপার: আয়োজক কমিটির পক্ষ থেকে শুধুমাত্র অফিসিয়াল ড্রয়িং শিট বা আর্ট পেপার সরবরাহ করা হবে। অঙ্কন বোর্ড (Drawing Board), পেন্সিল, ইরেজার এবং রং সহ অন্যান্য সমস্ত প্রয়োজনীয় সামগ্রী প্রতিযোগীকে নিজ দায়িত্বে সাথে আনতে হবে।',
                'রঙের মাধ্যম ব্যবহার: "যেমন খুশি আঁকো" বিষয়ের ক্ষেত্রে প্রতিযোগী নিজের পছন্দমতো যেকোনো ধরনের রং (প্যাস্টেল, জলরং, ক্রেওন, স্কেচ ইত্যাদি) ব্যবহার করতে পারবে। জলরং ব্যবহারের ক্ষেত্রে জল এবং পাত্র প্রতিযোগীকে নিজেকে সাথে নিয়ে আসতে হবে।',
                'পুরস্কার ও বিশেষ সম্মাননা: প্রতিটি বিভাগের প্রথম, দ্বিতীয় ও তৃতীয় স্থানাধিকারী প্রতিযোগীকে অত্যন্ত বিনীত ও বিশেষভাবে পুরস্কৃত ও সম্মানিত করা হবে। এছাড়া প্রতিযোগিতায় অংশগ্রহণকারী সকল প্রতিযোগীর উৎসাহ বৃদ্ধির জন্য থাকবে আকর্ষণীয় সান্ত্বনা পুরস্কার।',
                'বিচারকদের সিদ্ধান্ত: অঙ্কন মূল্যায়নের ক্ষেত্রে বিচারকমণ্ডলীর সিদ্ধান্তই চূড়ান্ত এবং সর্বসম্মত বলে গণ্য হবে। এই বিষয়ে কোনো প্রকার বাহ্যিক হস্তক্ষেপ, আপত্তি বা বিতর্ক কোনো অবস্থাতেই গ্রহণযোগ্য হবে না।',
                'শৃঙ্খলা ও পরিবেশ রক্ষা: প্রতিযোগিতা চলাকালীন অনুষ্ঠান প্রাঙ্গণে সম্পূর্ণ শান্ত ও সুশৃঙ্খল পরিবেশ বজায় রাখতে হবে। অভিভাবকগণ কোনোভাবেই প্রতিযোগিতার মূল সীমানার ভেতরে প্রবেশ করতে বা প্রতিযোগীকে কোনো প্রকার সাহায্য করতে পারবেন না।'
            ],
            categories: [
                { id: 'A', name: 'বিভাগ ক (Category A)', age: 'নার্সারি থেকে প্রথম শ্রেণী (Nursery to Class I)', theme: 'সময়সূচী: সকাল ১০:০০ - দুপুর ১২:০০' },
                { id: 'B', name: 'বিভাগ খ (Category B)', age: 'দ্বিতীয় থেকে চতুর্থ শ্রেণী (Class II to Class IV)', theme: 'সময়সূচী: সকাল ১০:০০ - দুপুর ১২:০০' },
                { id: 'C', name: 'বিভাগ গ (Category C)', age: 'পঞ্চম থেকে সপ্তম শ্রেণী (Class V to Class VII)', theme: 'সময়সূচী: দুপুর ১২:৩০ - বিকেল ০২:৩০' },
                { id: 'D', name: 'বিভাগ ঘ (Category D)', age: 'অষ্টম থেকে দশম শ্রেণী (Class VIII to Class X)', theme: 'সময়সূচী: দুপুর ১২:৩০ - বিকেল ০২:৩০' },
                { id: 'E', name: 'বিভাগ ঙ (Category E)', age: 'একাদশ শ্রেণী থেকে পরবর্তী সকলে (Class XI & Above)', theme: 'সময়সূচী: দুপুর ১২:৩০ - বিকেল ০২:৩০' }
            ],
            additionalField: null
        },
        dance: {
            id: 'dance',
            title: 'Dance Competition 2026',
            subtitle: 'বারো মাসে তেরো পার্বণ আয়োজিত নৃত্য প্রতিযোগিতা',
            emoji: '💃',
            tagIcon: 'fa-person-dancing',
            bannerUrl: 'assets/durga_puja.png',
            pdfUrl: '#',
            status: 'closed',
            feeText: 'বিনামূল্যে',
            details: [
                { icon: 'fa-calendar-days', label: 'প্রতিযোগিতার তারিখ', value: '১৯শে অক্টোবর, ২০২৬' },
                { icon: 'fa-clock', label: 'সময়সীমা', value: 'দুপুর ১২:০০ টা থেকে' },
                { icon: 'fa-map-location-dot', label: 'স্থান', value: 'দিনহাটা ক্লাব মুক্তমঞ্চ' },
                { icon: 'fa-indian-rupee-sign', label: 'নিবন্ধন ফি', value: 'সম্পূর্ণ বিনামূল্যে' },
                { icon: 'fa-music', label: 'নৃত্যের ধরন', value: 'রবীন্দ্রনৃত্য / লোকনৃত্য / শাস্ত্রীয় নৃত্য' },
                { icon: 'fa-children', label: 'বয়সসীমা/বিভাগ', value: 'গ্রুপ এ (৫-১০ বছর), গ্রুপ বি (১১-১৬ বছর)' },
                { icon: 'fa-calendar-circle-exclamation', label: 'শেষ তারিখ', value: '১২ই অক্টোবর, ২০২৬' },
                { icon: 'fa-phone-volume', label: 'যোগাযোগ', value: '+৯১ ৯৮৭৬৫ ৪৩২১০' }
            ],
            rules: [
                'প্রতিযোগী লোকনৃত্য, রবীন্দ্রনৃত্য বা শাস্ত্রীয় নৃত্যের যেকোনো একটি বিষয় নির্বাচন করতে পারে। फिल्मी গান সম্পূর্ণ নিষিদ্ধ।',
                'পারফরম্যান্সের সর্বোচ্চ সময়সীমা ৫ মিনিট।',
                'প্রয়োজনীয় ব্যাকগ্রাউন্ড মিউজিক (Track) পেনড্রাইভ বা মোবাইলে প্রতিযোগিতার ১ ঘণ্টা আগে কর্তৃপক্ষের কাছে জমা দিতে হবে।',
                'পোশাক ও সাজসজ্জা প্রতিযোগীকে নিজস্ব দায়িত্বে করতে হবে।',
                'বিচারকদের প্রাপ্ত নম্বরের ভিত্তিতেই প্রথম, দ্বিতীয় ও তৃতীয় স্থান বিজয়ী ঘোষণা করা হবে।'
            ],
            categories: [
                { id: 'A', name: 'গ্রুপ এ (Group A)', age: 'বয়স ৫ থেকে ১০ বছর', theme: 'রবীন্দ্রনৃত্য অথবা লোকনৃত্য' },
                { id: 'B', name: 'গ্রুপ বি (Group B)', age: 'বয়স ১১ থেকে ১৬ বছর', theme: 'শাস্ত্রীয় নৃত্য অথবা সমকালীন লোকনৃত্য' }
            ],
            additionalField: null
        },
        singing: {
            id: 'singing',
            title: 'Singing Competition 2026',
            subtitle: 'বারো মাসে তেরো পার্বণ আয়োজিত সংগীত প্রতিযোগিতা',
            emoji: '🎤',
            tagIcon: 'fa-microphone-lines',
            bannerUrl: 'assets/dol_utsav.png',
            pdfUrl: '#',
            status: 'closed',
            feeText: 'বিনামূল্যে',
            details: [
                { icon: 'fa-calendar-days', label: 'প্রতিযোগিতার তারিখ', value: '২০শে অক্টোবর, ২০২৬' },
                { icon: 'fa-clock', label: 'সময়সীমা', value: 'সকাল ১১:০০ টা থেকে' },
                { icon: 'fa-map-location-dot', label: 'স্থান', value: 'দিনহাটা ক্লাব মুক্তমঞ্চ' },
                { icon: 'fa-indian-rupee-sign', label: 'নিবন্ধন ফি', value: 'সম্পূর্ণ বিনামূল্যে' },
                { icon: 'fa-music', label: 'গানের ধরন', value: 'রবীন্দ্রসংগীত / নজরুলগীতি / লোকগীতি' },
                { icon: 'fa-children', label: 'বয়সসীমা/বিভাগ', value: 'গ্রুপ এ (৬-১২ বছর), গ্রুপ বি (১৩-১৮ বছর)' },
                { icon: 'fa-calendar-circle-exclamation', label: 'শেষ তারিখ', value: '১২ই অক্টোবর, ২০২৬' },
                { icon: 'fa-phone-volume', label: 'যোগাযোগ', value: '+৯১ ৯৮৭৬৫ ৪৩২১০' }
            ],
            rules: [
                'রবীন্দ্রসংগীত, নজরুলগীতি অথবা আধুনিক ও লোকগীতি পরিবেশন করা যাবে। কোনো রিমিক্স গ্রহণযোগ্য নয়।',
                'গান গাওয়ার জন্য সর্বোচ্চ সময়সীমা ৪ মিনিট।',
                'একক পরিবেশনার ক্ষেত্রে শুধুমাত্র হারমোনিয়াম ও তবলার সাহায্য নেওয়া যাবে (যা কমিটি প্রদান করবে)।',
                'প্রতিযোগী চাইলে নিজস্ব বাদ্যযন্ত্রী নিয়ে আসতে পারেন।'
            ],
            categories: [
                { id: 'A', name: 'গ্রুপ ক (Group A)', age: 'বয়স ৬ থেকে ১২ বছর', theme: 'রবীন্দ্রসংগীত / নজরুলগীতি' },
                { id: 'B', name: 'গ্রুপ খ (Group B)', age: 'বয়স ১৩ থেকে ১৮ বছর', theme: 'লোকগীতি / আধুনিক বাংলা গান' }
            ],
            additionalField: null
        },
        drama: {
            id: 'drama',
            title: 'Drama Competition 2026',
            subtitle: 'বারো মাসে তেরো পার্বণ আয়োজিত নাট্য প্রতিযোগিতা',
            emoji: '🎭',
            tagIcon: 'fa-masks-theater',
            bannerUrl: 'assets/social_work.png',
            pdfUrl: '#',
            status: 'closed',
            feeText: 'বিনামূল্যে',
            details: [
                { icon: 'fa-calendar-days', label: 'প্রতিযোগিতার তারিখ', value: '২১শে অক্টোবর, ২০২৬' },
                { icon: 'fa-clock', label: 'সময়সীমা', value: 'দুপুর ২:০০ টা থেকে' },
                { icon: 'fa-map-location-dot', label: 'স্থান', value: 'দিনহাটা টাউন হল' },
                { icon: 'fa-indian-rupee-sign', label: 'নিবন্ধন ফি', value: 'সম্পূর্ণ বিনামূল্যে' },
                { icon: 'fa-masks-theater', label: 'নাটকের ধরন', value: 'একক অভিনয় / শ্রুতিনাটক / পথনাটিকা' },
                { icon: 'fa-children', label: 'বয়সসীমা/বিভাগ', value: 'উন্মুক্ত বিভাগ (সকলের জন্য উন্মুক্ত)' },
                { icon: 'fa-calendar-circle-exclamation', label: 'শেষ তারিখ', value: '১২ই অক্টোবর, ২০২৬' },
                { icon: 'fa-phone-volume', label: 'যোগাযোগ', value: '+৯১ ৯৮৭৬৫ ৪৩২১০' }
            ],
            rules: [
                'একক অভিনয় ও পথনাটক প্রতিযোগিতার মূল বিষয়বস্তু হবে সামাজিক বা সমসাময়িক সচেতনতামূলক বার্তা।',
                'নাটকের সর্বোচ্চ সময়সীমা ১৫ মিনিট।',
                'মঞ্চের ব্যাকগ্রাউন্ড লাইট ও বেসিক সাউন্ড কমিটি প্রদান করবে। প্রপস ও অন্যান্য সামগ্রী নিজেদের নিয়ে আসতে হবে।'
            ],
            categories: [
                { id: 'Open', name: 'উন্মুক্ত বিভাগ (Open Category)', age: 'কোনো বয়সসীমা নেই', theme: 'সামাজিক বার্তা / পথনাটিকা' }
            ],
            additionalField: null
        },
        recitation: {
            id: 'recitation',
            title: 'Recitation Competition 2026',
            subtitle: 'বারো মাসে তেরো পার্বণ আয়োজিত আবৃত্তি প্রতিযোগিতা',
            emoji: '📖',
            tagIcon: 'fa-book-open',
            bannerUrl: 'assets/hero_bg.png',
            pdfUrl: '#',
            status: 'closed',
            feeText: 'বিনামূল্যে',
            details: [
                { icon: 'fa-calendar-days', label: 'প্রতিযোগিতার তারিখ', value: '১৮ই অক্টোবর, ২০২৬' },
                { icon: 'fa-clock', label: 'সময়সীমা', value: 'দুপুর ১:৩০ টা থেকে' },
                { icon: 'fa-map-location-dot', label: 'স্থান', value: 'দিনহাটা ক্লাব সেমিনার হল' },
                { icon: 'fa-indian-rupee-sign', label: 'নিবন্ধন ফি', value: 'সম্পূর্ণ বিনামূল্যে' },
                { icon: 'fa-paragraph', label: 'আবৃত্তির কবিতা', value: 'বিভাগভিত্তিক নির্ধারিত কবিতা' },
                { icon: 'fa-children', label: 'বয়সসীমা/বিভাগ', value: 'গ্রুপ এ (Class I-IV), গ্রুপ বি (Class V-VIII), গ্রুপ সি (Class IX-XII)' },
                { icon: 'fa-calendar-circle-exclamation', label: 'শেষ তারিখ', value: '১২ই অক্টোবর, ২০২৬' },
                { icon: 'fa-phone-volume', label: 'যোগাযোগ', value: '+৯১ ৯৮৭৬৫ ৪৩২১০' }
            ],
            rules: [
                'কমিটি নির্ধারিত কবিতা অথবা বিভাগ অনুযায়ী যেকোনো ক্লাসিক বাংলা কবিতা আবৃত্তি করা যাবে।',
                'সর্বোচ্চ সময়সীমা ৩ মিনিট। কোনো খাতা দেখে আবৃত্তি করা চলবে না।',
                'উচ্চারণ ও অভিব্যক্তি মূল্যায়নের প্রধান ভিত্তি হবে।'
            ],
            categories: [
                { id: 'A', name: 'বিভাগ ক (Group A)', age: 'শ্রেণী প্রথম থেকে চতুর্থ', theme: 'শিশুতোষ বাংলা কবিতা' },
                { id: 'B', name: 'বিভাগ খ (Group B)', age: 'শ্রেণী পঞ্চম থেকে অষ্টম', theme: 'রবীন্দ্রনাথ বা সুকান্তের দেশাত্মবোধক কবিতা' },
                { id: 'C', name: 'বিভাগ গ (Group C)', age: 'শ্রেণী নবম থেকে দ্বাদশ', theme: 'আধুনিক বাংলা কবিতা' }
            ],
            additionalField: null
        },
        quiz: {
            id: 'quiz',
            title: 'Quiz Competition 2026',
            subtitle: 'বারো মাসে তেরো পার্বণ আয়োজিত কুইজ প্রতিযোগিতা',
            emoji: '🧠',
            tagIcon: 'fa-brain',
            bannerUrl: 'assets/durga_puja.png',
            pdfUrl: '#',
            status: 'closed',
            feeText: 'বিনামূল্যে',
            details: [
                { icon: 'fa-calendar-days', label: 'প্রতিযোগিতার তারিখ', value: '২২শে অক্টোবর, ২০২৬' },
                { icon: 'fa-clock', label: 'সময়সীমা', value: 'দুপুর ১২:০০ টা থেকে' },
                { icon: 'fa-map-location-dot', label: 'স্থান', value: 'দিনহাটা ক্লাব মিলনায়তন' },
                { icon: 'fa-indian-rupee-sign', label: 'নিবন্ধন ফি', value: 'সম্পূর্ণ বিনামূল্যে' },
                { icon: 'fa-brain', label: 'কুইজের বিষয়', value: 'ভারতবর্ষের সংস্কৃতি, ইতিহাস, সাধারণ জ্ঞান ও কারেন্ট অ্যাফেয়ার্স' },
                { icon: 'fa-children', label: 'বয়সসীমা/বিভাগ', value: 'দলগত কুইজ (প্রতি দলে ২ জন সদস্য)' },
                { icon: 'fa-calendar-circle-exclamation', label: 'শেষ তারিখ', value: '১২ই অক্টোবর, ২০২৬' },
                { icon: 'fa-phone-volume', label: 'যোগাযোগ', value: '+৯১ ৯৮৭৬৫ ৪৩২১০' }
            ],
            rules: [
                'কুইজ প্রতিযোগিতা দলগত (Team of 2 members)। একক অংশগ্রহণ সম্ভব নয়।',
                'নিবন্ধনের সময় দলের দুজনেরই নাম ও প্রয়োজনীয় তথ্য প্রদান করতে হবে।',
                'প্রথমে একটি লিখিত স্ক্রীনিং রাউন্ড হবে, যার থেকে সেরা ৬টি দলকে মূল মঞ্চের লড়াইয়ে পাঠানো হবে।'
            ],
            categories: [
                { id: 'Junior', name: 'জুনিয়র বিভাগ (Class VI - IX)', age: 'শ্রেণী ষষ্ঠ থেকে নবম', theme: 'ভারতবর্ষ ও মৌলিক সাধারণ জ্ঞান' },
                { id: 'Senior', name: 'সিনিয়র বিভাগ (Class X - XII & College)', age: 'উচ্চ মাধ্যমিক ও তদূর্ধ্ব', theme: 'সাধারণ জ্ঞান, সাহিত্য ও সাম্প্রতিক ঘটনাপ্রবাহ' }
            ],
            additionalField: null
        },
        sports: {
            id: 'sports',
            title: 'Sports Competition 2026',
            subtitle: 'বারো মাসে তেরো পার্বণ আয়োজিত ক্রীড়া প্রতিযোগিতা',
            emoji: '🏆',
            tagIcon: 'fa-trophy',
            bannerUrl: 'assets/social_work.png',
            pdfUrl: '#',
            status: 'closed',
            feeText: 'বিনামূল্যে',
            details: [
                { icon: 'fa-calendar-days', label: 'প্রতিযোগিতার তারিখ', value: '২৩শে অক্টোবর, ২০২৬' },
                { icon: 'fa-clock', label: 'সময়সীমা', value: 'সকাল ৮:০০ টা থেকে' },
                { icon: 'fa-map-location-dot', label: 'স্থান', value: 'দিনহাটা হাই স্কুল প্লে-গ্রাউন্ড' },
                { icon: 'fa-indian-rupee-sign', label: 'নিবন্ধন ফি', value: 'সম্পূর্ণ বিনামূল্যে' },
                { icon: 'fa-person-running', label: 'খেলাধুলা সমূহ', value: 'দৌড় (১০০মি/২০০মি), ক্যারম, দাবা, বস্তা দৌড়' },
                { icon: 'fa-children', label: 'বয়সসীমা/বিভাগ', value: 'বয়সানুযায়ী বিভিন্ন ইভেন্ট' },
                { icon: 'fa-calendar-circle-exclamation', label: 'শেষ তারিখ', value: '১২ই অক্টোবর, ২০২৬' },
                { icon: 'fa-phone-volume', label: 'যোগাযোগ', value: '+৯১ ৯৮৭৬৫ ৪৩২১০' }
            ],
            rules: [
                'প্রতিযোগী অনূর্ধ্ব-১২, অনূর্ধ্ব-১৬ অথবা ১৮ ঊর্ধ্ব উন্মুক্ত বিভাগে নাম লেখাতে পারবে।',
                'একই প্রতিযোগী সর্বোচ্চ ২টি আউটডোর এবং ১টি ইনডোর ইভেন্টে অংশগ্রহণ করতে পারবে।',
                'খেলার মাঠে ক্রীড়াসুলভ আচরণ কাম্য। যেকোনো বিবাদে মাঠ পরিচালকের সিদ্ধান্তই চূড়ান্ত।'
            ],
            categories: [
                { id: 'U12', name: 'অনূর্ধ্ব ১২ (Under 12)', age: 'বয়স ১২ বছরের নিচে', theme: '১০০ মিটার দৌড়, চকলেট রেস, ক্যারম' },
                { id: 'U16', name: 'অনূর্ধ্ব ১৬ (Under 16)', age: 'বয়স ১৬ বছরের নিচে', theme: '২০০ মিটার দৌড়, লং জাম্প, দাবা, ক্যারম' },
                { id: 'Open', name: 'উন্মুক্ত বিভাগ (Open Category)', age: '১৬ বছরের ঊর্ধ্বে', theme: '২০০ মিটার দৌড়, দাবা টুর্নামেন্ট' }
            ],
            additionalField: null
        }
    };

    // --- State Variable ---
    let currentEvent = 'drawing';

    // --- DOM Elements ---
    const eventSelectorList = document.getElementById('eventSelectorList');
    
    // Header Details
    const eventHeroTag = document.getElementById('eventHeroTag');
    const eventHeroTitle = document.getElementById('eventHeroTitle');
    const eventHeroSubtitle = document.getElementById('eventHeroSubtitle');
    const eventHeroBanner = document.getElementById('eventHeroBanner');
    
    // Details & Rules
    const eventDetailsGrid = document.getElementById('eventDetailsGrid');
    const eventRulesList = document.getElementById('eventRulesList');
    
    // Accordion Toggle
    const accordionToggleBtn = document.getElementById('accordionToggleBtn');
    const accordionContent = document.getElementById('accordionContent');
    
    // Form Container and Wrappers
    const activeFormWrapper = document.getElementById('activeFormWrapper');
    const comingSoonWrapper = document.getElementById('comingSoonWrapper');
    const comingSoonPdfBtn = document.getElementById('comingSoonPdfBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    // Form inputs and structures
    const registrationForm = document.getElementById('registrationForm');
    const categoryRadioGrid = document.getElementById('categoryRadioGrid');
    const dynamicAdditionalFieldsWrapper = document.getElementById('dynamicAdditionalFieldsWrapper');
    
    // Modal Success components
    const successModalOverlay = document.getElementById('successModalOverlay');
    const successRegId = document.getElementById('successRegId');
    const receiptName = document.getElementById('receiptName');
    const receiptGuardian = document.getElementById('receiptGuardian');
    const receiptPhone = document.getElementById('receiptPhone');
    const receiptEvent = document.getElementById('receiptEvent');
    const receiptCategory = document.getElementById('receiptCategory');
    
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    const printReceiptBtn = document.getElementById('printReceiptBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Modal Payment components
    const paymentModalOverlay = document.getElementById('paymentModalOverlay');
    const paymentEventName = document.getElementById('paymentEventName');
    const paymentCategoryName = document.getElementById('paymentCategoryName');
    const paymentQrCodeImg = document.getElementById('paymentQrCodeImg');
    const paymentCountdown = document.getElementById('paymentCountdown');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    
    // Payment states
    let paymentTimerInterval = null;
    let tempSubmissionData = {};
    
    // Mobile sticky bar
    const mobileStickySubmitBar = document.getElementById('mobileStickySubmitBar');
    const stickyEmoji = document.getElementById('stickyEmoji');
    const stickyTitle = document.getElementById('stickyTitle');
    const stickySubmitBtn = document.getElementById('stickySubmitBtn');

    // --- Sticky Header scroll behavior (copied from script.js logic) ---
    const header = document.getElementById('mainHeader');
    if (header) {
        header.classList.add('scrolled'); // Always solid on inner subpages
    }

    // --- Mobile Drawer navigation triggers (copied from script.js) ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawer = document.getElementById('closeDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (menuToggle && mobileDrawer && closeDrawer && drawerOverlay) {
        const openMobileMenu = () => {
            mobileDrawer.classList.add('open');
            drawerOverlay.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        };

        const closeMobileMenu = () => {
            mobileDrawer.classList.remove('open');
            drawerOverlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        };

        menuToggle.addEventListener('click', openMobileMenu);
        closeDrawer.addEventListener('click', closeMobileMenu);
        drawerOverlay.addEventListener('click', closeMobileMenu);

        drawerLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // --- Rules Accordion Toggle logic ---
    if (accordionToggleBtn && accordionContent) {
        accordionToggleBtn.addEventListener('click', () => {
            const isExpanded = accordionToggleBtn.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                accordionToggleBtn.setAttribute('aria-expanded', 'false');
                accordionContent.style.maxHeight = null;
            } else {
                accordionToggleBtn.setAttribute('aria-expanded', 'true');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            }
        });
    }

    // --- Dynamic Event Loading Template ---
    const loadEvent = (eventId) => {
        const config = competitionsConfig[eventId];
        if (!config) return;

        currentEvent = eventId;

        // Reset Form Values & Errors
        registrationForm.reset();
        document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('invalid'));
        document.querySelectorAll('.error-message').forEach(err => err.innerText = '');

        // 1. Update Hero Details
        eventHeroTag.innerHTML = `<i class="fa-solid ${config.tagIcon} animate-pulse"></i> ${config.title}`;
        eventHeroTitle.innerText = config.title;
        eventHeroSubtitle.innerText = config.subtitle;
        
        // Dynamic banner background gradients based on color variables
        if (eventId === 'drawing') {
            eventHeroBanner.style.backgroundImage = "linear-gradient(135deg, rgba(211, 47, 47, 0.4) 0%, rgba(45, 37, 34, 0.95) 100%), url('assets/hero_bg.png')";
        } else if (eventId === 'dance') {
            eventHeroBanner.style.backgroundImage = "linear-gradient(135deg, rgba(230, 81, 0, 0.4) 0%, rgba(45, 37, 34, 0.95) 100%), url('assets/durga_puja.png')";
        } else if (eventId === 'singing') {
            eventHeroBanner.style.backgroundImage = "linear-gradient(135deg, rgba(255, 179, 0, 0.4) 0%, rgba(45, 37, 34, 0.95) 100%), url('assets/dol_utsav.png')";
        } else {
            eventHeroBanner.style.backgroundImage = "linear-gradient(135deg, rgba(46, 125, 50, 0.4) 0%, rgba(45, 37, 34, 0.95) 100%), url('assets/social_work.png')";
        }

        // 2. Render Details Grid
        eventDetailsGrid.innerHTML = '';
        config.details.forEach(item => {
            const detailCard = document.createElement('div');
            detailCard.className = 'detail-item';
            detailCard.innerHTML = `
                <div class="detail-icon-circle"><i class="fa-solid ${item.icon}"></i></div>
                <div class="detail-info">
                    <span class="detail-lbl">${item.label}</span>
                    <span class="detail-val">${item.value}</span>
                </div>
            `;
            eventDetailsGrid.appendChild(detailCard);
        });

        // 3. Render Rules Accordion list
        eventRulesList.innerHTML = '';
        config.rules.forEach(rule => {
            const li = document.createElement('li');
            li.innerText = rule;
            eventRulesList.appendChild(li);
        });

        // Close Accordion automatically
        if (accordionToggleBtn && accordionContent) {
            accordionToggleBtn.setAttribute('aria-expanded', 'false');
            accordionContent.style.maxHeight = null;
        }

        // 4. Render Categories Radios
        categoryRadioGrid.innerHTML = '';
        config.categories.forEach((cat, index) => {
            const labelCard = document.createElement('label');
            labelCard.className = `category-option-card${index === 0 ? ' selected' : ''}`;
            labelCard.innerHTML = `
                <input type="radio" name="regCategory" value="${cat.id}" ${index === 0 ? 'checked' : ''}>
                <div class="cat-card-header">
                    <span class="cat-name">${cat.name}</span>
                    <div class="cat-check-dot"></div>
                </div>
                <span class="cat-desc">${cat.age}</span>
                <span class="cat-theme">${cat.theme}</span>
            `;
            
            // Add radio click styles
            labelCard.addEventListener('click', () => {
                document.querySelectorAll('.category-option-card').forEach(c => c.classList.remove('selected'));
                labelCard.classList.add('selected');
            });
            categoryRadioGrid.appendChild(labelCard);
        });

        // 5. Render Additional Info checkboxes (e.g. preferred drawing medium)
        dynamicAdditionalFieldsWrapper.innerHTML = '';
        if (config.additionalField) {
            const addField = config.additionalField;
            const container = document.createElement('div');
            container.className = 'checkbox-group-wrapper';
            container.innerHTML = `
                <h4 class="form-section-title"><i class="fa-solid fa-palette"></i> ${addField.label}</h4>
                <div class="medium-checkbox-grid"></div>
            `;
            
            const grid = container.querySelector('.medium-checkbox-grid');
            addField.options.forEach(opt => {
                const checkLabel = document.createElement('label');
                checkLabel.className = 'checkbox-card';
                checkLabel.innerHTML = `
                    <input type="checkbox" name="${addField.name}" value="${opt}">
                    <div class="check-box-indicator"><i class="fa-solid fa-check"></i></div>
                    <span>${opt}</span>
                `;
                
                checkLabel.querySelector('input').addEventListener('change', (e) => {
                    if (e.target.checked) {
                        checkLabel.classList.add('selected');
                    } else {
                        checkLabel.classList.remove('selected');
                    }
                });
                
                grid.appendChild(checkLabel);
            });
            dynamicAdditionalFieldsWrapper.appendChild(container);
        }

        // 6. Handle Form vs Coming Soon layout state
        if (config.status === 'open') {
            activeFormWrapper.style.display = 'block';
            comingSoonWrapper.style.display = 'none';
            downloadPdfBtn.href = config.pdfUrl;
            downloadPdfBtn.style.display = 'inline-flex';
        } else {
            activeFormWrapper.style.display = 'none';
            comingSoonWrapper.style.display = 'block';
            comingSoonPdfBtn.href = config.pdfUrl;
            // Hide pdf download in coming soon if url is hashtag
            if (config.pdfUrl === '#') {
                comingSoonPdfBtn.style.display = 'none';
            } else {
                comingSoonPdfBtn.style.display = 'inline-flex';
            }
        }

        // 7. Update Mobile Sticky bar configurations
        stickyEmoji.innerText = config.emoji;
        stickyTitle.innerText = config.title;
        const stickyPrice = mobileStickySubmitBar.querySelector('.sticky-price');
        if (stickyPrice) {
            stickyPrice.innerText = `ফি: ${config.feeText}`;
        }
        
        if (config.status === 'open' && window.innerWidth <= 768) {
            // Check scroll position to determine visibility
            toggleStickySubmitBar();
        } else {
            mobileStickySubmitBar.classList.remove('show');
        }
    };

    // --- Sidebar Selector Cards Click Handler ---
    if (eventSelectorList) {
        eventSelectorList.addEventListener('click', (e) => {
            const card = e.target.closest('.event-selector-card');
            if (!card) return;

            document.querySelectorAll('.event-selector-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const eventId = card.getAttribute('data-event');
            loadEvent(eventId);
        });
    }

    // --- Form Client-Side Validations ---
    const validateField = (inputEl, errorElId, validationFunc, errorMessage) => {
        const errorEl = document.getElementById(errorElId);
        const formGroup = inputEl.closest('.form-group');
        
        if (!validationFunc(inputEl.value.trim())) {
            formGroup.classList.add('invalid');
            if (errorEl) errorEl.innerText = errorMessage;
            return false;
        } else {
            formGroup.classList.remove('invalid');
            if (errorEl) errorEl.innerText = '';
            return true;
        }
    };

    // Form inputs change event validation triggers
    const regName = document.getElementById('regName');
    const regGuardian = document.getElementById('regGuardian');
    const regPhone = document.getElementById('regPhone');
    const regSchoolClass = document.getElementById('regSchoolClass');
    const regAddress = document.getElementById('regAddress');
    const regDeclaration = document.getElementById('regDeclaration');

    const notEmpty = val => val.length > 0;
    const isPhone = val => /^[6-9]\d{9}$/.test(val);

    regName.addEventListener('input', () => {
        validateField(regName, 'error-regName', notEmpty, 'প্রতিযোগীর নাম আবশ্যক (Participant\'s Name is required)');
    });

    regGuardian.addEventListener('input', () => {
        validateField(regGuardian, 'error-regGuardian', notEmpty, 'অভিভাবকের নাম আবশ্যক (Guardian Name is required)');
    });

    regPhone.addEventListener('input', () => {
        validateField(regPhone, 'error-regPhone', isPhone, 'সঠিক ১০ সংখ্যার মোবাইল/হোয়াটসঅ্যাপ নম্বর দিন (Enter a valid 10-digit number)');
    });

    regSchoolClass.addEventListener('input', () => {
        validateField(regSchoolClass, 'error-regSchoolClass', notEmpty, 'বিদ্যালয় ও শ্রেণীর নাম আবশ্যক (School & Class is required)');
    });

    regAddress.addEventListener('input', () => {
        validateField(regAddress, 'error-regAddress', notEmpty, 'বর্তমান ঠিকানা আবশ্যক (Address is required)');
    });

    regDeclaration.addEventListener('change', () => {
        const errorEl = document.getElementById('error-regDeclaration');
        if (!regDeclaration.checked) {
            errorEl.innerText = 'আপনাকে ঘোষণাটি স্বীকার করতে হবে (You must accept the declaration)';
        } else {
            errorEl.innerText = '';
        }
    });

    // --- Form Submission logic ---
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform full validation check
        const isNameValid = validateField(regName, 'error-regName', notEmpty, 'প্রতিযোগীর নাম আবশ্যক (Participant\'s Name is required)');
        const isGuardianValid = validateField(regGuardian, 'error-regGuardian', notEmpty, 'অভিভাবকের নাম আবশ্যক (Guardian Name is required)');
        const isPhoneValid = validateField(regPhone, 'error-regPhone', isPhone, 'সঠিক ১০ সংখ্যার মোবাইল/হোয়াটসঅ্যাপ নম্বর দিন (Enter a valid 10-digit number)');
        const isSchoolClassValid = validateField(regSchoolClass, 'error-regSchoolClass', notEmpty, 'বিদ্যালয় ও শ্রেণীর নাম আবশ্যক (School & Class is required)');
        const isAddressValid = validateField(regAddress, 'error-regAddress', notEmpty, 'বর্তমান ঠিকানা আবশ্যক (Address is required)');
        
        // Category check
        const selectedCatRadio = document.querySelector('input[name="regCategory"]:checked');
        const catErrorEl = document.getElementById('error-regCategory');
        const isCategoryValid = !!selectedCatRadio;
        if (!isCategoryValid) {
            catErrorEl.innerText = 'অনুগ্রহ করে একটি বিভাগ নির্বাচন করুন (Select a category)';
        } else {
            catErrorEl.innerText = '';
        }

        // Declaration check
        const isDeclarationValid = regDeclaration.checked;
        const decErrorEl = document.getElementById('error-regDeclaration');
        if (!isDeclarationValid) {
            decErrorEl.innerText = 'আপনাকে ঘোষণাটি স্বীকার করতে হবে (You must accept the declaration)';
        } else {
            decErrorEl.innerText = '';
        }

        const isFormValid = isNameValid && isGuardianValid && isPhoneValid && isSchoolClassValid && isAddressValid && isCategoryValid && isDeclarationValid;

        if (!isFormValid) {
            // Scroll to the first invalid field
            const firstInvalid = document.querySelector('.form-group.invalid, #error-regCategory:not(:empty)');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // --- Simulated Form submission leading to Payment Checkout ---
        const submitBtn = document.getElementById('submitFormBtn');
        const textSpan = submitBtn.querySelector('.btn-text-content');
        const loaderSpan = submitBtn.querySelector('.btn-loader-content');
        
        // Set loading states
        submitBtn.disabled = true;
        textSpan.style.display = 'none';
        loaderSpan.style.display = 'inline-flex';

        // Fetch event config details
        const config = competitionsConfig[currentEvent];
        const categoryData = config.categories.find(c => c.id === selectedCatRadio.value);

        const eventTitle = config.title;
        const categoryName = categoryData ? categoryData.name : selectedCatRadio.value;
        const participantName = regName.value.trim();
        const guardianName = regGuardian.value.trim();
        const phone = regPhone.value.trim();
        const schoolClass = regSchoolClass.value.trim();
        const address = regAddress.value.trim();

        // Generate Premium Registration ID
        const currentYear = new Date().getFullYear();
        const generateAlphaNumeric = (length) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        const randomHex = generateAlphaNumeric(6);
        const regId = `BMTP-${currentYear}-${randomHex}`;

        const insertData = {
            registration_id: regId,
            user_id: currentUser ? currentUser.id : null,
            event_title: eventTitle,
            category_name: categoryName,
            participant_name: participantName,
            guardian_name: guardianName,
            phone: phone,
            school_class: schoolClass,
            address: address
        };

        // Allow null user_id for guest registration
        /* 
        if (!insertData.user_id) {
            alert("Error: User session not found. Please log in again.");
            submitBtn.disabled = false;
            textSpan.style.display = 'inline-flex';
            loaderSpan.style.display = 'none';
            return;
        }
        */

        supabase.from('registrations').insert([insertData])
            .then(async ({ data, error }) => {
                submitBtn.disabled = false;
                textSpan.style.display = 'inline-flex';
                loaderSpan.style.display = 'none';

                if (error) {
                    console.error("Supabase Error:", error);
                    alert("Error submitting registration. Please try again.");
                } else {
                    // Send Email Notification via EmailJS (Dummy Config - replace with actual)
                    try {
                        const emailPayload = {
                            service_id: 'YOUR_SERVICE_ID',
                            template_id: 'YOUR_TEMPLATE_ID',
                            user_id: 'YOUR_PUBLIC_KEY',
                            template_params: {
                                registration_id: regId,
                                full_name: participantName,
                                email: insertData.email || 'N/A',
                                phone: phone,
                                address: address,
                                event: eventTitle,
                                created_at: new Date().toLocaleString()
                            }
                        };
                        // Uncomment when EmailJS keys are ready
                        /*
                        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(emailPayload)
                        });
                        */
                    } catch (e) {
                        console.error('Email sending failed:', e);
                    }

                    // Redirect to payment success page
                    window.location.href = `payment.html?reg_id=${regId}`;
                }
            })
            .catch((err) => {
                console.error("Unknown Error:", err);
                submitBtn.disabled = false;
                textSpan.style.display = 'inline-flex';
                loaderSpan.style.display = 'none';
                alert("An unexpected error occurred.");
            });
    });

    // --- UPI Payment Countdown Timer Helpers ---
    const startPaymentCountdown = (durationSeconds) => {
        if (paymentTimerInterval) clearInterval(paymentTimerInterval);
        
        let timeLeft = durationSeconds;
        updateTimerDisplay(timeLeft);
        
        paymentTimerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(paymentTimerInterval);
                closePaymentModal();
                alert('পেমেন্টের সময়সীমা শেষ হয়ে গেছে! অনুগ্রহ করে আবার চেষ্টা করুন। (Payment session expired! Please try again.)');
            }
        }, 1000);
    };

    const updateTimerDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const minsStr = mins < 10 ? '0' + mins : mins;
        const secsStr = secs < 10 ? '0' + secs : secs;
        paymentCountdown.innerText = `${minsStr}:${secsStr}`;
    };

    const closePaymentModal = () => {
        paymentModalOverlay.classList.remove('active');
        if (paymentTimerInterval) clearInterval(paymentTimerInterval);
        document.body.style.overflow = 'auto';
    };

    // --- Cancel Payment Handler ---
    cancelPaymentBtn.addEventListener('click', () => {
        closePaymentModal();
    });

    // --- Confirm Payment / Complete Checkout Handler ---
    confirmPaymentBtn.addEventListener('click', () => {
        const textSpan = confirmPaymentBtn.querySelector('.btn-text-content');
        const loaderSpan = confirmPaymentBtn.querySelector('.btn-loader-content');
        
        // Disable buttons during verification
        confirmPaymentBtn.disabled = true;
        cancelPaymentBtn.disabled = true;
        textSpan.style.display = 'none';
        loaderSpan.style.display = 'inline-flex';

        setTimeout(() => {
            // 1. Generate Registration ID
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const regId = `BMTP-2026-${randomNum}`;

            // 2. Render success slip fields
            successRegId.innerText = regId;
            receiptName.innerText = tempSubmissionData.name;
            receiptGuardian.innerText = tempSubmissionData.guardian;
            receiptPhone.innerText = tempSubmissionData.phone;
            
            const receiptSchoolClassEl = document.getElementById('receiptSchoolClass');
            const receiptAddressEl = document.getElementById('receiptAddress');
            if (receiptSchoolClassEl) receiptSchoolClassEl.innerText = tempSubmissionData.schoolclass;
            if (receiptAddressEl) receiptAddressEl.innerText = tempSubmissionData.address;
            
            receiptEvent.innerText = tempSubmissionData.eventTitle;
            receiptCategory.innerText = tempSubmissionData.categoryName;

            // Save variables on success modal element for receipt downloads
            successModalOverlay.setAttribute('data-name', tempSubmissionData.name);
            successModalOverlay.setAttribute('data-guardian', tempSubmissionData.guardian);
            successModalOverlay.setAttribute('data-phone', tempSubmissionData.phone);
            successModalOverlay.setAttribute('data-schoolclass', tempSubmissionData.schoolclass);
            successModalOverlay.setAttribute('data-address', tempSubmissionData.address);
            successModalOverlay.setAttribute('data-event', tempSubmissionData.eventTitle);
            successModalOverlay.setAttribute('data-category', tempSubmissionData.categoryName);
            successModalOverlay.setAttribute('data-regid', regId);

            // 3. Close Payment Modal
            closePaymentModal();

            // 4. Open success modal popup
            successModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // 5. Reset Form completely
            registrationForm.reset();
            document.querySelectorAll('.category-option-card').forEach((c, idx) => {
                if (idx === 0) {
                    c.classList.add('selected');
                    c.querySelector('input').checked = true;
                } else {
                    c.classList.remove('selected');
                }
            });
            document.querySelectorAll('.checkbox-card').forEach(c => {
                c.classList.remove('selected');
            });

            // 6. Reset button loading state
            confirmPaymentBtn.disabled = false;
            cancelPaymentBtn.disabled = false;
            textSpan.style.display = 'inline-flex';
            loaderSpan.style.display = 'none';

        }, 2000); // 2 seconds high-fidelity verification loader
    });

    // --- Reset Form Button Listener ---
    document.getElementById('resetFormBtn').addEventListener('click', () => {
        registrationForm.reset();
        document.querySelectorAll('.category-option-card').forEach((c, idx) => {
            if (idx === 0) {
                c.classList.add('selected');
                c.querySelector('input').checked = true;
            } else {
                c.classList.remove('selected');
            }
        });
        document.querySelectorAll('.checkbox-card').forEach(c => {
            c.classList.remove('selected');
        });
        document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('invalid'));
        document.querySelectorAll('.error-message').forEach(err => err.innerText = '');
        
        // Scroll back to top of form
        document.getElementById('activeFormWrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // --- Close Success Modal ---
    const closeModal = () => {
        successModalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // restore scroll
    };

    closeModalBtn.addEventListener('click', closeModal);
    successModalOverlay.addEventListener('click', (e) => {
        if (e.target === successModalOverlay) closeModal();
    });

    // --- Native Print Feature handler ---
    printReceiptBtn.addEventListener('click', () => {
        window.print();
    });

    // --- Acknowledgement Text Slip Receipt Download ---
    downloadReceiptBtn.addEventListener('click', () => {
        const name = successModalOverlay.getAttribute('data-name');
        const guardian = successModalOverlay.getAttribute('data-guardian');
        const phone = successModalOverlay.getAttribute('data-phone');
        const schoolclass = successModalOverlay.getAttribute('data-schoolclass');
        const address = successModalOverlay.getAttribute('data-address');
        const eventTitle = successModalOverlay.getAttribute('data-event');
        const categoryName = successModalOverlay.getAttribute('data-category');
        const regId = successModalOverlay.getAttribute('data-regid');
        
        const today = new Date().toLocaleDateString('bn-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Building receipt slip content matching official form details
        const receiptText = `===========================================================
               বারো মাসে তেরো পার্বণ - রেজিস্ট্রেশন রসিদ             
===========================================================
রেজিস্ট্রেশন আইডি (Registration ID) : ${regId}
তারিখ (Registration Date)           : ${today}
প্রতিযোগিতা (Event)                 : ${eventTitle}
-----------------------------------------------------------
প্রতিযোগীর বিবরণ (Participant Details):
-----------------------------------------------------------
প্রতিযোগীর নাম (Participant Name)   : ${name}
অভিভাবকের নাম (Guardian Name)       : ${guardian}
মোবাইল/হোয়াটসঅ্যাপ (Mobile/WhatsApp) : ${phone}
বিদ্যালয় ও শ্রেণী (School & Class)   : ${schoolclass}
ঠিকানা (Address)                    : ${address}
বিভাগ (Selected Category)           : ${categoryName}
-----------------------------------------------------------
* প্রতিযোগিতার দিন রেজিস্ট্রেশন আইডি সাথে আনতে অনুরোধ করা হচ্ছে।
* নিয়মাবলী অনুযায়ী নির্দিষ্ট সময়ে উপস্থিত থাকতে হবে।

ধন্যবাদান্তে,
প্রতিযোগিতা পরিচালনা উপ-কমিটি,
বারো মাসে তেরো পার্বণ ক্লাব।
===========================================================`;

        // Create blob and download
        const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `BMTP_Registration_${regId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    // --- Mobile Sticky Submit Button interactions ---
    const toggleStickySubmitBar = () => {
        if (window.innerWidth > 768) {
            mobileStickySubmitBar.classList.remove('show');
            return;
        }

        const formWrapper = document.getElementById('activeFormWrapper');
        const config = competitionsConfig[currentEvent];
        
        if (!formWrapper || !config || config.status !== 'open') {
            mobileStickySubmitBar.classList.remove('show');
            return;
        }

        const rect = formWrapper.getBoundingClientRect();
        // Show sticky bar when the user scrolls past the top of the form,
        // and hide it when they scroll past the bottom of the form
        const scrollThreshold = 100;
        
        if (rect.top < window.innerHeight - scrollThreshold && rect.bottom > 150) {
            mobileStickySubmitBar.classList.add('show');
        } else {
            mobileStickySubmitBar.classList.remove('show');
        }
    };

    // Scroll listener for sticky button
    window.addEventListener('scroll', toggleStickySubmitBar);
    window.addEventListener('resize', toggleStickySubmitBar);

    // Sticky submit button click handler -> triggers form submission
    stickySubmitBtn.addEventListener('click', () => {
        // Trigger submit form element click event
        const submitEvent = new Event('submit', { cancelable: true });
        registrationForm.dispatchEvent(submitEvent);
    });

    // --- Initial Event Load (Drawing Competition) ---
    loadEvent('drawing');

});
