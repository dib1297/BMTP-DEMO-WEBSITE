/* -------------------------------------------------------------
 * "বারো মাসে তেরো পার্বণ" Login & Registration Controller
 * Migrated to Supabase Auth
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Make sure supabaseClient is available from supabase-client.js
    const supabase = window.supabaseClient;

    if (!supabase) {
        console.error("Supabase client is not initialized.");
        return;
    }

    /* ── UI Elements ── */
    const tabLoginBtn   = document.getElementById('tabLoginBtn');
    const tabSignupBtn  = document.getElementById('tabSignupBtn');
    const loginPanel    = document.getElementById('loginPanel');
    const signupPanel   = document.getElementById('signupPanel');

    const subTabPasswordBtn  = document.getElementById('subTabPasswordBtn');
    const subTabOtpBtn       = document.getElementById('subTabOtpBtn');
    const loginPasswordForm  = document.getElementById('loginPasswordForm');
    const loginOtpForm       = document.getElementById('loginOtpForm');

    const registrationForm   = document.getElementById('registrationForm');
    const btnRegisterSubmit  = document.getElementById('btnRegisterSubmit');

    const toast      = document.getElementById('submitToast');
    const toastClose = document.getElementById('toastClose');
    const toastTitle = document.getElementById('toastTitle');
    const toastDesc  = document.getElementById('toastDesc');

    /* Forgot Password UI toggles */
    const forgotPasswordLink    = document.getElementById('forgotPasswordLink');
    const backToLoginLink       = document.getElementById('backToLoginLink');
    const forgotPasswordForm    = document.getElementById('forgotPasswordForm');
    const loginSubToggles       = document.querySelector('.login-sub-toggles');

    /* ── Toast ── */
    const showToast = (title, desc, ok = true) => {
        if (!toast) return;
        toastTitle.innerText = title;
        toastDesc.innerText  = desc;
        toast.classList.toggle('error-toast', !ok);
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 5000);
    };

    if (toastClose) {
        toastClose.addEventListener('click', () => toast.classList.remove('show'));
    }

    /* ── Redirect if already logged in ── */
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            window.location.href = 'dashboard.html';
        }
    });

    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session && !window.isRegistering) {
            window.location.href = 'dashboard.html';
        }
    });

    /* ── Tab toggles ── */
    if (tabLoginBtn && tabSignupBtn) {
        tabLoginBtn.addEventListener('click', () => {
            tabLoginBtn.classList.add('active');
            tabSignupBtn.classList.remove('active');
            loginPanel.style.display  = 'block';
            signupPanel.style.display = 'none';
        });

        tabSignupBtn.addEventListener('click', () => {
            tabSignupBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
            signupPanel.style.display = 'block';
            loginPanel.style.display  = 'none';
        });
    }

    /* Login sub-toggles */
    if (subTabPasswordBtn && subTabOtpBtn) {
        subTabPasswordBtn.addEventListener('click', () => {
            subTabPasswordBtn.classList.add('active');
            subTabOtpBtn.classList.remove('active');
            loginPasswordForm.style.display = 'block';
            loginOtpForm.style.display      = 'none';
        });

        subTabOtpBtn.addEventListener('click', () => {
            subTabOtpBtn.classList.add('active');
            subTabPasswordBtn.classList.remove('active');
            loginOtpForm.style.display      = 'block';
            loginPasswordForm.style.display = 'none';
            if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
        });
    }

    if (forgotPasswordLink && backToLoginLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginPasswordForm.style.display = 'none';
            loginOtpForm.style.display      = 'none';
            if (loginSubToggles) loginSubToggles.style.display   = 'none';
            forgotPasswordForm.style.display= 'block';
        });

        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordForm.style.display= 'none';
            if (loginSubToggles) loginSubToggles.style.display   = 'flex';
            subTabPasswordBtn.click();
        });
    }

    /* ────────────────────────────────────────────────────── */
    /* SUPABASE LOGIN                                         */
    /* ────────────────────────────────────────────────────── */
    if (loginPasswordForm) {
        loginPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let phoneInput = document.getElementById('loginPhoneInput').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!phoneInput || !password) {
                showToast('ইনপুট ত্রুটি', 'মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন।', false);
                return;
            }

            let formattedPhone = phoneInput.replace(/\s+/g, '');
            if (!formattedPhone.startsWith('+')) {
                if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
                    formattedPhone = '+' + formattedPhone;
                } else if (formattedPhone.length === 10) {
                    formattedPhone = '+91' + formattedPhone;
                } else {
                    formattedPhone = '+' + formattedPhone;
                }
            }

            const submitBtn = loginPasswordForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'লগ ইন করা হচ্ছে...';

            const { data, error } = await supabase.auth.signInWithPassword({
                phone: formattedPhone,
                password: password
            });

            submitBtn.disabled = false;
            submitBtn.innerText = originalText;

            if (error) {
                console.error('Login error:', error.message);
                showToast('লগইন ত্রুটি', 'ভুল মোবাইল নম্বর অথবা পাসওয়ার্ড।', false);
            } else {
                showToast('লগইন সফল!', 'লগইন সম্পন্ন হয়েছে।');
            }
        });
    }

    /* ────────────────────────────────────────────────────── */
    /* SUPABASE SIGNUP                                        */
    /* ────────────────────────────────────────────────────── */
    if (btnRegisterSubmit) {
        btnRegisterSubmit.addEventListener('click', async () => {
            const name     = document.getElementById('regName').value.trim();
            const gender   = document.getElementById('regGender').value;
            let phone = document.getElementById('regPhone').value.trim();
            const rawPhone = phone; // Store raw phone to check against excel
            if (phone && !phone.startsWith('+')) {
                phone = '+91' + phone.replace(/\s+/g, '');
            }
            const idYear   = document.getElementById('regIdYear').value;
            const idSuffix = document.getElementById('regIdSuffix').value.trim();
            const aadhar   = document.getElementById('regAadhar').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (!name || !gender || !phone || !idYear || !idSuffix || !aadhar || !password || !confirmPassword) {
                showToast('ইনপুট ত্রুটি', 'সবগুলো তথ্য পূরণ করুন।', false);
                return;
            }
            if (password.length < 6) {
                showToast('ইনপুট ত্রুটি', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', false);
                return;
            }

            const errorConfirmPasswordEl = document.getElementById('errorConfirmPassword');
            if (errorConfirmPasswordEl) errorConfirmPasswordEl.style.display = 'none';

            if (password !== confirmPassword) {
                if (errorConfirmPasswordEl) {
                    errorConfirmPasswordEl.style.display = 'block';
                }
                return;
            }

            btnRegisterSubmit.disabled = true;
            btnRegisterSubmit.innerText = 'যাচাই করা হচ্ছে...';

            // --- Membership Data Verification ---
            try {
                const response = await fetch('memberlist/list data/member_data.json');
                const memberData = await response.json();
                
                const enteredBmtpId = `${idYear}/${idSuffix}`;
                const enteredPhoneDigit = rawPhone.replace(/\D/g, '').slice(-10); // get last 10 digits
                const enteredAadharDigit = aadhar.replace(/\D/g, '');

                // Reset error messages
                const errorIdEl = document.getElementById('errorId');
                const errorPhoneEl = document.getElementById('errorPhone');
                const errorAadharEl = document.getElementById('errorAadhar');
                
                if (errorIdEl) errorIdEl.style.display = 'none';
                if (errorPhoneEl) errorPhoneEl.style.display = 'none';
                if (errorAadharEl) errorAadharEl.style.display = 'none';

                const matchedMember = memberData.find(m => String(m['BMTP ID']).trim() === enteredBmtpId);
                let hasError = false;

                if (matchedMember) {
                    // ID is correct, check Phone and Aadhar against this member's data
                    const memberPhone = String(matchedMember['MOBILE NO.'] || '').replace(/\D/g, '').slice(-10);
                    if (memberPhone !== enteredPhoneDigit) {
                        if (errorPhoneEl) {
                            errorPhoneEl.innerText = 'মোবাইল নম্বর মেলেনি (Mobile no not match)।';
                            errorPhoneEl.style.display = 'block';
                        }
                        hasError = true;
                    }

                    const memberAadhar = String(matchedMember['AADHAAR NO'] || '').replace(/\D/g, '');
                    if (memberAadhar !== enteredAadharDigit) {
                        if (errorAadharEl) {
                            errorAadharEl.innerText = 'আধার নম্বর মেলেনি (Aadhar no not match)।';
                            errorAadharEl.style.display = 'block';
                        }
                        hasError = true;
                    }
                } else {
                    // ID is incorrect
                    if (errorIdEl) {
                        errorIdEl.innerText = 'BMTP ID খুঁজে পাওয়া যায়নি (BMTP ID not match)।';
                        errorIdEl.style.display = 'block';
                    }
                    hasError = true;

                    // Additionally check if Phone or Aadhar are completely wrong
                    const phoneExists = memberData.some(m => String(m['MOBILE NO.'] || '').replace(/\D/g, '').slice(-10) === enteredPhoneDigit);
                    if (!phoneExists) {
                        if (errorPhoneEl) {
                            errorPhoneEl.innerText = 'মোবাইল নম্বর মেলেনি (Mobile no not match)।';
                            errorPhoneEl.style.display = 'block';
                        }
                    }

                    const aadharExists = memberData.some(m => String(m['AADHAAR NO'] || '').replace(/\D/g, '') === enteredAadharDigit);
                    if (!aadharExists) {
                        if (errorAadharEl) {
                            errorAadharEl.innerText = 'আধার নম্বর মেলেনি (Aadhar no not match)।';
                            errorAadharEl.style.display = 'block';
                        }
                    }
                }

                if (hasError) {
                    btnRegisterSubmit.disabled = false;
                    btnRegisterSubmit.innerText = 'নিবন্ধন করুন';
                    return;
                }
            } catch (err) {
                console.error("Error fetching member data:", err);
                showToast('ত্রুটি', 'ডেটা যাচাই করতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।', false);
                btnRegisterSubmit.disabled = false;
                btnRegisterSubmit.innerText = 'নিবন্ধন করুন';
                return;
            }

            btnRegisterSubmit.innerText = 'নিবন্ধন করা হচ্ছে...';

            window.isRegistering = true; // Prevent auto-redirect on SIGNED_IN event

            const { data, error } = await supabase.auth.signUp({
                phone: phone,
                password: password,
                options: {
                    data: {
                        full_name: name,
                        gender: gender,
                        custom_id: `${idYear}/${idSuffix}`
                    }
                }
            });

            btnRegisterSubmit.disabled = false;
            btnRegisterSubmit.innerText = 'নিবন্ধন করুন';

            if (error) {
                window.isRegistering = false;
                console.error('Signup error:', error.message);
                showToast('নিবন্ধন ত্রুটি', `ত্রুটি: ${error.message}`, false);
                return;
            }

            // Show OTP form
            showToast('ওটিপি পাঠানো হয়েছে!', 'আপনার মোবাইলে ৬ সংখ্যার কোড পাঠানো হয়েছে।');
            const regForm = document.getElementById('registrationForm');
            const otpForm = document.getElementById('regOtpVerification');
            if (regForm && otpForm) {
                regForm.style.display = 'none';
                otpForm.style.display = 'block';
                // Store phone for verification step
                window.currentRegPhone = phone; 
            }
        });
    }

    /* ────────────────────────────────────────────────────── */
    /* REGISTRATION OTP VERIFICATION                          */
    /* ────────────────────────────────────────────────────── */
    const btnVerifyRegOTP = document.getElementById('btnVerifyRegOTP');
    const btnCancelRegOTP = document.getElementById('btnCancelRegOTP');

    if (btnVerifyRegOTP) {
        btnVerifyRegOTP.addEventListener('click', async () => {
            const code = document.getElementById('regOtpCode').value.trim();
            if (!code || code.length !== 6) {
                showToast('ইনপুট ত্রুটি', 'সঠিক ৬ সংখ্যার ওটিপি কোড দিন।', false);
                return;
            }

            btnVerifyRegOTP.disabled = true;
            btnVerifyRegOTP.innerText = 'যাচাই করা হচ্ছে...';

            const { data, error } = await supabase.auth.verifyOtp({
                phone: window.currentRegPhone,
                token: code,
                type: 'sms'
            });

            btnVerifyRegOTP.disabled = false;
            btnVerifyRegOTP.innerText = 'ওটিপি যাচাই ও অ্যাকাউন্ট তৈরি';

            if (error) {
                console.error('Verify Reg OTP error:', error.message);
                showToast('ভেরিফিকেশন ত্রুটি', `ভুল ওটিপি প্রদান করেছেন: ${error.message}`, false);
            } else {
                showToast('নিবন্ধন সফল!', 'আপনার মোবাইল নম্বর যাচাই সম্পন্ন হয়েছে।');
                window.isRegistering = false;
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    }

    if (btnCancelRegOTP) {
        btnCancelRegOTP.addEventListener('click', () => {
            const regForm = document.getElementById('registrationForm');
            const otpForm = document.getElementById('regOtpVerification');
            if (regForm && otpForm) {
                regForm.style.display = 'block';
                otpForm.style.display = 'none';
            }
            window.isRegistering = false;
        });
    }

    /* ────────────────────────────────────────────────────── */
    /* SUPABASE PHONE AUTH (TWILIO VERIFY)                    */
    /* ────────────────────────────────────────────────────── */
    const btnSendLoginOTP = document.getElementById('btnSendLoginOTP');
    const btnVerifyLoginOTP = document.getElementById('btnVerifyLoginOTP');
    const loginOtpPhoneGroup = document.getElementById('loginOtpPhoneGroup');
    const loginOtpCodeGroup = document.getElementById('loginOtpCodeGroup');
    let currentFormattedPhone = '';

    if (btnSendLoginOTP) {
        btnSendLoginOTP.addEventListener('click', async () => {
            const phoneInput = document.getElementById('loginOtpPhone').value.trim();
            if (!phoneInput) {
                showToast('ইনপুট ত্রুটি', 'মোবাইল নম্বর প্রদান করুন।', false);
                return;
            }

            // Ensure starts with +91
            let formattedPhone = phoneInput.replace(/\s+/g, '');
            if (!formattedPhone.startsWith('+')) {
                if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
                    formattedPhone = '+' + formattedPhone;
                } else if (formattedPhone.length === 10) {
                    formattedPhone = '+91' + formattedPhone;
                } else {
                    formattedPhone = '+' + formattedPhone;
                }
            }

            currentFormattedPhone = formattedPhone;
            btnSendLoginOTP.disabled = true;
            btnSendLoginOTP.innerText = 'পাঠানো হচ্ছে...';

            const { data, error } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
                options: {
                    shouldCreateUser: false
                }
            });

            btnSendLoginOTP.disabled = false;
            btnSendLoginOTP.innerText = 'ওটিপি পাঠান';

            if (error) {
                console.error('Send OTP error:', error.message);
                if (error.message.toLowerCase().includes('signups not allowed') || error.message.toLowerCase().includes('not found')) {
                    showToast('অ্যাকাউন্ট নেই', 'এই নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি। দয়া করে আগে Sign Up (নিবন্ধন) করুন।', false);
                } else {
                    showToast('ত্রুটি', `ওটিপি পাঠাতে সমস্যা হয়েছে: ${error.message}`, false);
                }
            } else {
                showToast('ওটিপি পাঠানো হয়েছে!', 'আপনার মোবাইলে ওটিপি কোড পাঠানো হয়েছে।');
                loginOtpPhoneGroup.style.display = 'none';
                loginOtpCodeGroup.style.display = 'block';
                btnSendLoginOTP.style.display = 'none';
                btnVerifyLoginOTP.style.display = 'block';
            }
        });
    }

    if (btnVerifyLoginOTP) {
        btnVerifyLoginOTP.addEventListener('click', async () => {
            const code = document.getElementById('loginOtpCode').value.trim();
            if (!code || code.length !== 6) {
                showToast('ইনপুট ত্রুটি', 'সঠিক ৬ সংখ্যার ওটিপি কোড দিন।', false);
                return;
            }

            btnVerifyLoginOTP.disabled = true;
            btnVerifyLoginOTP.innerText = 'যাচাই করা হচ্ছে...';

            const { data, error } = await supabase.auth.verifyOtp({
                phone: currentFormattedPhone,
                token: code,
                type: 'sms'
            });

            btnVerifyLoginOTP.disabled = false;
            btnVerifyLoginOTP.innerText = 'ওটিপি যাচাই করুন';

            if (error) {
                console.error('Verify OTP error:', error.message);
                showToast('ভেরিফিকেশন ত্রুটি', `ভুল ওটিপি প্রদান করেছেন: ${error.message}`, false);
            } else {
                showToast('লগইন সফল!', 'মোবাইল দিয়ে সফলভাবে লগইন করেছেন।');
                // Redirect is automatically handled by the onAuthStateChange listener
            }
        });
    }
});
