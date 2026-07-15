/* -------------------------------------------------------------
 * "বারো মাসে তেরো পার্বণ" JavaScript Interactivity
 * Interactive navigation, scroll reveal, filters, lightbox, form handlers, countdown timer
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // --- Helper Function: Translate Numbers to Bengali ---
    const toBengaliNumber = (num) => {
        const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(num).split('').map(digit => {
            return bengaliDigits[digit] || digit;
        }).join('');
    };

    // --- 1. Sticky Header scroll behavior ---
    const header = document.getElementById('mainHeader');
    const hasHero = document.querySelector('.hero-section');
    if (header) {
        if (hasHero) {
            const handleScroll = () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            };
            window.addEventListener('scroll', handleScroll);
            handleScroll();
        } else {
            header.classList.add('scrolled');
        }
    }

    // --- 2. Mobile Drawer Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawer = document.getElementById('closeDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openMobileMenu = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Stop background scroll
    };

    const closeMobileMenu = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto'; // Resume background scroll
    };

    menuToggle.addEventListener('click', openMobileMenu);
    closeDrawer.addEventListener('click', closeMobileMenu);
    drawerOverlay.addEventListener('click', closeMobileMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavLink = () => {
        if (sections.length === 0 || navLinks.length === 0) return;
        
        let scrollPosition = window.scrollY + 150; // Offset for sticky navbar

        // Check if user has scrolled near the bottom of the page
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                const lastId = lastSection.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${lastId}` || href?.endsWith(`#${lastId}`)) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
                return;
            }
        }

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}` || href?.endsWith(`#${sectionId}`)) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', highlightNavLink);
        highlightNavLink();
    }

    // --- 5. Upcoming Event Countdown Timer ---
    // Target date: October 15, 2026 08:00:00 (Durga Puja scheduled start)
    const targetDate = new Date('October 15, 2026 08:00:00').getTime();

    const updateCountdown = () => {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('mins');

        if (!daysEl || !hoursEl || !minsEl) return;

        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            daysEl.innerText = toBengaliNumber(0);
            hoursEl.innerText = toBengaliNumber(0);
            minsEl.innerText = toBengaliNumber(0);
            return;
        }

        // Calculations for Time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        // Injecting translated Bengali numerals
        daysEl.innerText = toBengaliNumber(days);
        hoursEl.innerText = toBengaliNumber(hours);
        minsEl.innerText = toBengaliNumber(minutes);
    };

    if (document.getElementById('days')) {
        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }

    // --- 6. Gallery Tab Filtering ---
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Set active tab styling
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    // Trigger fade-in effect
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // Matches animation timing
                }
            });
        });
    });

    // --- 7. Gallery Lightbox ---
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryImageWrappers = document.querySelectorAll('.gallery-image-wrapper');
    
    let currentAlbumImages = [];
    let currentAlbumIndex = 0;

    galleryImageWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            if (wrapper.getAttribute('data-ignore-lightbox') === 'true') {
                return; // Let the onclick handler in HTML handle the redirect
            }
            const img = wrapper.querySelector('img');
            const placeholder = wrapper.querySelector('.gallery-placeholder-img');
            const caption = wrapper.querySelector('.gallery-caption').innerText;
            
            // Check if this is an album folder
            const imagesData = wrapper.getAttribute('data-images');
            if (imagesData) {
                try {
                    currentAlbumImages = JSON.parse(imagesData);
                    currentAlbumIndex = 0;
                    if (currentAlbumImages.length > 0) {
                        lightboxImg.src = currentAlbumImages[currentAlbumIndex];
                        lightboxImg.style.display = 'block';
                        
                        if(currentAlbumImages.length > 1) {
                            if(lightboxPrev) lightboxPrev.style.display = 'flex';
                            if(lightboxNext) lightboxNext.style.display = 'flex';
                        } else {
                            if(lightboxPrev) lightboxPrev.style.display = 'none';
                            if(lightboxNext) lightboxNext.style.display = 'none';
                        }
                    }
                } catch(e) {
                    console.error("Error parsing album images");
                }
            } else {
                currentAlbumImages = [];
                if(lightboxPrev) lightboxPrev.style.display = 'none';
                if(lightboxNext) lightboxNext.style.display = 'none';
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.style.display = 'block';
                } else if (placeholder) {
                    lightboxImg.style.display = 'none';
                    lightboxCaption.innerHTML = `<div class="lightbox-placeholder-card"><i class="${placeholder.querySelector('i').className}"></i><p>${placeholder.querySelector('span').innerText}</p></div>`;
                }
            }

            if (!placeholder || imagesData) {
                lightboxCaption.innerText = caption;
            }
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Lock scrolling
        });
    });
    
    // Lightbox navigation logic
    if(lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentAlbumImages.length > 0) {
                currentAlbumIndex = (currentAlbumIndex > 0) ? currentAlbumIndex - 1 : currentAlbumImages.length - 1;
                lightboxImg.src = currentAlbumImages[currentAlbumIndex];
            }
        });
    }
    
    if(lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentAlbumImages.length > 0) {
                currentAlbumIndex = (currentAlbumIndex < currentAlbumImages.length - 1) ? currentAlbumIndex + 1 : 0;
                lightboxImg.src = currentAlbumImages[currentAlbumIndex];
            }
        });
    }

    if (lightbox) {
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            if (lightboxImg) {
                lightboxImg.src = '';
            }
            if (mobileDrawer && mobileDrawer.classList.contains('open') === false) {
                document.body.style.overflow = 'auto'; // Resume scroll
            }
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Esc Key closes mobile menu and lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                closeMobileMenu();
            }
        });
    } else {
        // Fallback Esc Key listener to just close mobile menu when lightbox doesn't exist
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // --- 8. Form Handlers & Toast Notification Simulator ---
    const toast = document.getElementById('submitToast');
    const toastClose = document.getElementById('toastClose');
    const toastTitle = toast.querySelector('.toast-title');
    const toastDesc = toast.querySelector('.toast-desc');

    const showToast = (title, description, isSuccess = true) => {
        toastTitle.innerText = title;
        toastDesc.innerText = description;
        toast.style.borderLeftColor = isSuccess ? 'var(--color-accent-green)' : 'var(--color-primary)';
        toast.querySelector('.toast-icon').className = isSuccess ? 'fa-solid fa-circle-check toast-icon' : 'fa-solid fa-circle-exclamation toast-icon';
        toast.querySelector('.toast-icon').style.color = isSuccess ? 'var(--color-accent-green)' : 'var(--color-primary)';
        
        toast.classList.add('show');

        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    toastClose.addEventListener('click', () => {
        toast.classList.remove('show');
    });

    // Volunteer / Join Form Submission
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const phoneInput = volunteerForm.querySelector('input[type="tel"]') || document.getElementById('volPhone');
            const emailInput = volunteerForm.querySelector('input[type="email"]') || document.getElementById('volEmail');
            
            if (phoneInput) {
                const phoneVal = phoneInput.value.trim();
                if (!/^\d{10}$/.test(phoneVal)) {
                    showToast('ইনপুট ত্রুটি', 'অনুগ্রহ করে একটি সঠিক ১০ সংখ্যার মোবাইল নম্বর লিখুন।', false);
                    phoneInput.focus();
                    return;
                }
            }
            
            if (emailInput && emailInput.value.trim()) {
                const emailVal = emailInput.value.trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                    showToast('ইনপুট ত্রুটি', 'অনুগ্রহ করে একটি সঠিক ইমেইল আইডি লিখুন।', false);
                    emailInput.focus();
                    return;
                }
            }

            const submitBtn = volunteerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Dynamic loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> আবেদন প্রক্রিয়াধীন...';

            // Simulate network latency (1.5 seconds)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                showToast(
                    'আবেদন গৃহীত হয়েছে!', 
                    'আমাদের স্বেচ্ছাসেবী দলে যোগদানের আবেদনের জন্য ধন্যবাদ। শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।'
                );
                volunteerForm.reset();
                
                // Custom file uploaded elements visual reset
                const fileTexts = volunteerForm.querySelectorAll('.file-upload-text');
                fileTexts.forEach(textEl => {
                    const isAadhar = textEl.closest('.file-upload-wrapper').querySelector('input').id === 'volAadhar';
                    textEl.innerText = isAadhar ? 'ফাইল নির্বাচন করুন (JPG, PNG, PDF)' : 'ছবি নির্বাচন করুন (JPG, PNG)';
                    textEl.style.color = 'var(--color-text-muted)';
                });
                const fileCustoms = volunteerForm.querySelectorAll('.file-upload-custom');
                fileCustoms.forEach(c => {
                    c.style.borderStyle = 'dashed';
                    c.style.borderColor = 'var(--color-border)';
                });
            }, 1500);
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const phoneInput = contactForm.querySelector('input[type="tel"]') || document.getElementById('contactPhone');
            const emailInput = contactForm.querySelector('input[type="email"]') || document.getElementById('contactEmail');
            
            if (phoneInput) {
                const phoneVal = phoneInput.value.trim();
                if (!/^\d{10}$/.test(phoneVal)) {
                    showToast('ইনপুট ত্রুটি', 'অনুগ্রহ করে একটি সঠিক ১০ সংখ্যার মোবাইল নম্বর লিখুন।', false);
                    phoneInput.focus();
                    return;
                }
            }
            
            if (emailInput && emailInput.value.trim()) {
                const emailVal = emailInput.value.trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                    showToast('ইনপুট ত্রুটি', 'অনুগ্রহ করে একটি সঠিক ইমেইল আইডি লিখুন।', false);
                    emailInput.focus();
                    return;
                }
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> পাঠানো হচ্ছে...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                showToast(
                    'মেসেজ পাঠানো হয়েছে!',
                    'আপনার বার্তাটি আমাদের কাছে পৌঁছেছে। আমাদের টিম খুব দ্রুত উত্তর দেবে।'
                );
                contactForm.reset();
            }, 1500);
        });
    }

    // --- 8.5. Donation Form & Option Interactivity ---
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        const donAmountInput = document.getElementById('donAmount');
        const presetBtns = document.querySelectorAll('.preset-btn');
        const causeOpts = document.querySelectorAll('.cause-opt');

        // Preset Amount Selection
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (donAmountInput) {
                    donAmountInput.value = btn.getAttribute('data-val');
                }
            });
        });

        // Reset preset buttons if user types a custom amount manually
        if (donAmountInput) {
            donAmountInput.addEventListener('input', () => {
                presetBtns.forEach(btn => {
                    if (btn.getAttribute('data-val') === donAmountInput.value) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            });
        }

        // Cause selection toggle
        const otherCauseWrapper = document.getElementById('otherCauseWrapper');
        const otherCauseComment = document.getElementById('otherCauseComment');

        causeOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                causeOpts.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');

                // Toggle other cause comments section
                if (opt.getAttribute('data-cause') === 'other') {
                    if (otherCauseWrapper) {
                        otherCauseWrapper.style.display = 'block';
                    }
                    if (otherCauseComment) {
                        otherCauseComment.required = true;
                        otherCauseComment.focus();
                    }
                } else {
                    if (otherCauseWrapper) {
                        otherCauseWrapper.style.display = 'none';
                    }
                    if (otherCauseComment) {
                        otherCauseComment.required = false;
                        otherCauseComment.value = ''; // Reset value
                    }
                }
            });
        });

        // --- 8.6. Donation Form Submission & Payment Gateway Simulator ---
        let timerInterval;
        const startPaymentTimer = (duration) => {
            clearInterval(timerInterval);
            let timer = duration, minutes, seconds;
            const timerDisplay = document.getElementById('paymentTimer');
            
            timerInterval = setInterval(() => {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                if (timerDisplay) {
                    timerDisplay.innerText = toBengaliNumber(minutes) + ":" + toBengaliNumber(seconds);
                }

                if (--timer < 0) {
                    clearInterval(timerInterval);
                    if (timerDisplay) {
                        timerDisplay.innerText = "সময় শেষ";
                    }
                }
            }, 1000);
        };

        // Select Payment Method selector logic
        const paymentOptCards = document.querySelectorAll('.payment-opt-card');
        paymentOptCards.forEach(card => {
            card.addEventListener('click', () => {
                paymentOptCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });

        // Click next step in payment modal
        const paymentBtnNext = document.getElementById('paymentBtnNext');
        if (paymentBtnNext) {
            paymentBtnNext.addEventListener('click', () => {
                const activeCard = document.querySelector('.payment-opt-card.active');
                if (!activeCard) return;

                const method = activeCard.getAttribute('data-method');
                document.querySelectorAll('.modal-step').forEach(step => step.classList.remove('active'));
                
                if (method === 'qr') {
                    const stepQR = document.getElementById('paymentStepQR');
                    if (stepQR) stepQR.classList.add('active');
                } else if (method === 'id') {
                    const stepID = document.getElementById('paymentStepID');
                    if (stepID) stepID.classList.add('active');
                }
            });
        }

        // Copy button in UPI ID step
        const copyUpiIdBtn = document.getElementById('copyUpiIdBtn');
        if (copyUpiIdBtn) {
            copyUpiIdBtn.addEventListener('click', () => {
                navigator.clipboard.writeText('bmtp@ybl').then(() => {
                    const originalText = copyUpiIdBtn.innerHTML;
                    copyUpiIdBtn.innerHTML = '<i class="fa-solid fa-check"></i> কপি হয়েছে!';
                    setTimeout(() => {
                        copyUpiIdBtn.innerHTML = originalText;
                    }, 2000);
                });
            });
        }

        // Close Modal handler
        const paymentModal = document.getElementById('paymentModal');
        const closePaymentModal = document.getElementById('closePaymentModal');
        if (closePaymentModal && paymentModal) {
            closePaymentModal.addEventListener('click', () => {
                paymentModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // resume scroll
                clearInterval(timerInterval);
            });
        }

        // Main submission completes payment
        const completePayment = () => {
            if (paymentModal) {
                paymentModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                clearInterval(timerInterval);
            }

            const submitBtn = document.querySelector('button[type="submit"][form="donationForm"]') || donationForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const amount = donAmountInput ? donAmountInput.value : 0;
            const translatedAmount = toBengaliNumber(amount);

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> অনুদান প্রক্রিয়াধীন...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                showToast(
                    'অনুদানের আবেদন সম্পন্ন!', 
                    `আপনার ৳ ${translatedAmount} অনুদানের জন্য ধন্যবাদ। আমরা আপনার উদারতার জন্য কৃতজ্ঞ।`
                );
                
                donationForm.reset();
                if (donAmountInput) {
                    donAmountInput.value = '';
                }
                presetBtns.forEach(btn => btn.classList.remove('active'));
                causeOpts.forEach(o => o.classList.remove('active'));
                const generalCause = document.querySelector('.cause-opt[data-cause="general"]');
                if (generalCause) {
                    generalCause.classList.add('active');
                }
                if (otherCauseWrapper) {
                    otherCauseWrapper.style.display = 'none';
                }
                if (otherCauseComment) {
                    otherCauseComment.required = false;
                    otherCauseComment.value = '';
                }
                const upiTxnId = document.getElementById('upiTxnId');
                if (upiTxnId) {
                    upiTxnId.value = '';
                }
            }, 1500);
        };

        const paymentBtnQRDone = document.getElementById('paymentBtnQRDone');
        if (paymentBtnQRDone) {
            paymentBtnQRDone.addEventListener('click', completePayment);
        }

        const paymentBtnIDDone = document.getElementById('paymentBtnIDDone');
        if (paymentBtnIDDone) {
            paymentBtnIDDone.addEventListener('click', () => {
                const upiTxnId = document.getElementById('upiTxnId');
                if (upiTxnId && !upiTxnId.value.trim()) {
                    showToast('ইনপুট ত্রুটি', 'অনুগ্রহ করে আপনার UPI আইডিটি লিখুন।', false);
                    upiTxnId.focus();
                    return;
                }
                completePayment();
            });
        }

        // Intercept form submit to show modal first
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const amount = donAmountInput ? donAmountInput.value : 0;
            const translatedAmount = toBengaliNumber(amount);
            
            // Set dynamic amounts on modal steps
            const qrAmountDisplay = document.getElementById('qrAmountDisplay');
            const idAmountDisplay = document.getElementById('idAmountDisplay');
            if (qrAmountDisplay) qrAmountDisplay.innerText = `৳ ${translatedAmount}`;
            if (idAmountDisplay) idAmountDisplay.innerText = `৳ ${translatedAmount}`;

            // Load QR Code dynamically
            const qrCodeImg = document.getElementById('qrCodeImg');
            if (qrCodeImg) {
                qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=bmtp@ybl%26pn=BMTP%20Club%26am=${amount}`;
            }

            if (paymentModal) {
                // Set first step active
                document.querySelectorAll('.modal-step').forEach(step => step.classList.remove('active'));
                const stepSelect = document.getElementById('paymentStepSelect');
                if (stepSelect) stepSelect.classList.add('active');

                paymentModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // lock scrolling
                startPaymentTimer(300); // 5 minutes timer
            }
        });
    }

    // --- 10. Dynamic Hero Background Slideshow ---
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
        // Hero images from 'desktop responsive' folder
        const desktopHeroImages = [
            'hero section images/desktop responsive/IMG_2461.PNG', // Ganesh
            'hero section images/desktop responsive/IMG_2375.PNG', // Rakhi
            'hero section images/desktop responsive/IMG_2377.PNG', // Tran Sibir
            'hero section images/desktop responsive/IMG_2378.PNG', // Blood Donation
            'hero section images/desktop responsive/IMG_2381.PNG', // Cricket
            'hero section images/desktop responsive/IMG_2466.PNG', // Group photo
            'hero section images/desktop responsive/IMG_2464.PNG'  // Cultural
        ];

        // Hero images from 'mobile responsive' folder
        const mobileHeroImages = [
            'hero section images/mobile responsive/IMG_2468.PNG', // Ganesh
            'hero section images/mobile responsive/IMG_2460.PNG', // Rakhi
            'hero section images/mobile responsive/IMG_2463.PNG', // Tran Sibir
            'hero section images/mobile responsive/IMG_2465.PNG', // Blood Donation
            'hero section images/mobile responsive/IMG_2462.PNG', // Cricket
            'hero section images/mobile responsive/IMG_2467.PNG', // Group photo
            'hero section images/mobile responsive/IMG_2469.PNG'  // Cultural
        ];

        // Select images based on screen size
        const heroImages = window.innerWidth <= 768 ? mobileHeroImages : desktopHeroImages;
        
        const startSlideshow = (images) => {
            if (images.length === 0) return;
            
            heroSlider.innerHTML = ''; // Clear container
            
            const slideElements = images.map((src, index) => {
                const slide = document.createElement('div');
                slide.className = `hero-slide${index === 0 ? ' active' : ''}`;
                slide.style.backgroundImage = `url('${src}')`;
                heroSlider.appendChild(slide);
                return slide;
            });

            // Reveal hero text 1s after the first background image loads
            const firstImg = new Image();
            firstImg.src = images[0];
            firstImg.onload = () => {
                setTimeout(() => {
                    const heroContent = document.querySelector('.hero-content');
                    if (heroContent) {
                        heroContent.classList.add('animate-now');
                    }
                }, 1500);
            };
            
            let currentIndex = 0;
            const nextSlide = () => {
                slideElements[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % slideElements.length;
                slideElements[currentIndex].classList.add('active');
            };
            
            // Cycle backgrounds every 6 seconds for a smooth premium feel
            setInterval(nextSlide, 6000);
        };
        
        startSlideshow(heroImages);
    }

    // --- 11. Custom File Upload Inputs Handler ---
    const fileInputs = document.querySelectorAll('.file-upload-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', () => {
            const wrapper = input.closest('.file-upload-wrapper');
            const textEl = wrapper.querySelector('.file-upload-text');
            if (input.files && input.files.length > 0) {
                textEl.innerText = input.files[0].name;
                textEl.style.color = 'var(--color-text-dark)';
                wrapper.querySelector('.file-upload-custom').style.borderStyle = 'solid';
                wrapper.querySelector('.file-upload-custom').style.borderColor = 'var(--color-accent-green)';
            } else {
                const placeholder = input.id === 'volAadhar' ? 'ফাইল নির্বাচন করুন (JPG, PNG, PDF)' : 'ছবি নির্বাচন করুন (JPG, PNG)';
                textEl.innerText = placeholder;
                textEl.style.color = 'var(--color-text-muted)';
                wrapper.querySelector('.file-upload-custom').style.borderStyle = 'dashed';
                wrapper.querySelector('.file-upload-custom').style.borderColor = 'var(--color-border)';
            }
        });
    });
});
