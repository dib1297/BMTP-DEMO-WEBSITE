/* -------------------------------------------------------------
 * "বারো মাসে তেরো পার্বণ" Join Us Multi-Step JavaScript Controller
 * Performs plan selection, details collection, 
 * payment verification, and local data persistence.
 * (Firebase removed)
 * ------------------------------------------------------------- */

// Quick local session check for immediate redirect to prevent UI flash
if (!localStorage.getItem('bmtp_logged_in_user')) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. State Variables ---
    let currentStep = 1;
    let selectedPlan = {
        id: '',
        name: '',
        price: 0
    };
    
    // --- 2. DOM Elements ---
    const stepPanels = document.querySelectorAll('.step-panel');
    const stepItems = document.querySelectorAll('.step-item');
    const stepperProgress = document.getElementById('stepperProgress');
    
    // Auth elements
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabSignupBtn = document.getElementById('tabSignupBtn');
    const tabPhoneBtn = document.getElementById('tabPhoneBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const phoneLoginForm = document.getElementById('phoneLoginForm');
    const userInfoBanner = document.getElementById('userInfoBanner');
    const userAvatar = document.getElementById('userAvatar');
    const userNameText = document.getElementById('userNameText');
    const userEmailText = document.getElementById('userEmailText');
    const btnSignOut = document.getElementById('btnSignOut');
    const btnSendOTP = document.getElementById('btnSendOTP');
    const btnVerifyOTP = document.getElementById('btnVerifyOTP');
    
    // Plan elements
    const planCards = document.querySelectorAll('.plan-card');
    
    // Details Form elements
    const memberDetailsForm = document.getElementById('memberDetailsForm');
    const memNameInput = document.getElementById('memName');
    const memPhoneInput = document.getElementById('memPhone');
    const memEmailInput = document.getElementById('memEmail');
    const memIdInput = document.getElementById('memId');
    const memRegDateInput = document.getElementById('memRegDate');
    const btnPrevToStep2 = document.getElementById('btnPrevToStep2');
    
    // Payment elements
    const paymentSubmissionForm = document.getElementById('paymentSubmissionForm');
    const paymentSelectedPlanName = document.getElementById('paymentSelectedPlanName');
    const paymentSelectedPlanPrice = document.getElementById('paymentSelectedPlanPrice');
    const paymentQRImage = document.getElementById('paymentQRImage');
    const paymentScreenshot = document.getElementById('paymentScreenshot');
    const paymentTxnId = document.getElementById('paymentTxnId');
    const btnPrevToStep3 = document.getElementById('btnPrevToStep3');
    
    // Success page elements
    const successEmail = document.getElementById('successEmail');
    const successPlan = document.getElementById('successPlan');
    const successAmount = document.getElementById('successAmount');
    const successMemId = document.getElementById('successMemId');
    const successRegDate = document.getElementById('successRegDate');

    // --- 3. Toast Notifications helper ---
    const toast = document.getElementById('submitToast');
    const toastClose = document.getElementById('toastClose');
    const toastTitle = toast.querySelector('.toast-title');
    const toastDesc = toast.querySelector('.toast-desc');

    const showMessageToast = (title, description, isSuccess = true) => {
        toastTitle.innerText = title;
        toastDesc.innerText = description;
        toast.style.borderLeftColor = isSuccess ? 'var(--color-accent-green)' : 'var(--color-primary)';
        toast.querySelector('.toast-icon').className = isSuccess ? 'fa-solid fa-circle-check toast-icon' : 'fa-solid fa-circle-exclamation toast-icon';
        toast.querySelector('.toast-icon').style.color = isSuccess ? 'var(--color-accent-green)' : 'var(--color-primary)';
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }

    // --- 4. Helper Function: English to Bengali Numbers ---
    const toBengaliNumber = (num) => {
        const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(num).split('').map(digit => {
            return bengaliDigits[digit] || digit;
        }).join('');
    };

    // --- 5. Navigation & Stepper Logic ---
    const updateStepper = (step) => {
        stepItems.forEach(item => {
            const itemStep = parseInt(item.getAttribute('data-step'));
            item.classList.remove('active', 'completed');
            
            if (itemStep === step) {
                item.classList.add('active');
            } else if (itemStep < step) {
                item.classList.add('completed');
            }
        });
        
        // Progress bar width percentage
        const progressPercent = ((step - 1) / (stepItems.length - 1)) * 100;
        stepperProgress.style.width = `${progressPercent}%`;
    };

    const generateMembershipId = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${year}/${randomNum}`;
    };

    const getFormattedDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        return `${dd} / ${mm} / ${yyyy}`;
    };

    const goToStep = (step) => {
        if (step < 1 || step > 5) return;
        
        // Hide all panels
        stepPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Show target panel
        const targetPanel = document.getElementById(`step${step}`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            currentStep = step;
            updateStepper(step);
            
            // Step-specific initialization
            if (step === 3) {
                if (!memIdInput.value) {
                    memIdInput.value = generateMembershipId();
                }
                if (!memRegDateInput.value) {
                    memRegDateInput.value = getFormattedDate();
                }
                if (!memPhoneInput.value || memPhoneInput.value === '') {
                    memPhoneInput.value = '+91 ';
                }
            }
            
            window.scrollTo({ top: targetPanel.offsetTop - 180, behavior: 'smooth' });
        }
    };

    // --- 6. Session helpers ---
    const getCurrentUser = () => {
        const raw = localStorage.getItem('bmtp_logged_in_user');
        return raw ? JSON.parse(raw) : null;
    };

    const setCurrentUserSession = (user) => {
        localStorage.setItem('bmtp_logged_in_user', JSON.stringify(user));
    };

    const clearCurrentUserSession = () => {
        localStorage.removeItem('bmtp_logged_in_user');
    };

    const friendlyDisplay = (email) =>
        email && email.includes('@phone.bmtp')
            ? email.split('@')[0].replace(/^91/, '+91 ')
            : email;

    const updateAuthUI = () => {
        const user = getCurrentUser();
        if (user) {
            userInfoBanner.style.display = 'flex';
            userNameText.innerText = user.name || 'User';
            const displayEmail = (user.email && user.email.includes('@phone.bmtp'))
                ? (user.phoneNumber || friendlyDisplay(user.email))
                : (user.email || user.phoneNumber || '');
            userEmailText.innerText = displayEmail;
            userAvatar.innerText = (user.name || 'U').charAt(0).toUpperCase();

            // Prefill detail forms
            memNameInput.value  = user.name  || '';
            memEmailInput.value = (user.email && !user.email.includes('@phone.bmtp'))
                ? user.email
                : '';
        } else {
            userInfoBanner.style.display = 'none';
        }
    };

    // Auth Tab Toggles
    tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabSignupBtn.classList.remove('active');
        tabPhoneBtn.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        phoneLoginForm.classList.remove('active');
    });

    tabSignupBtn.addEventListener('click', () => {
        tabSignupBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        tabPhoneBtn.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        phoneLoginForm.classList.remove('active');
    });

    tabPhoneBtn.addEventListener('click', () => {
        tabPhoneBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        tabSignupBtn.classList.remove('active');
        phoneLoginForm.classList.add('active');
        loginForm.classList.remove('active');
        signupForm.classList.remove('active');
    });

    // Mock form submissions since Firebase is removed
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showMessageToast('ত্রুটি', 'Firebase অপসারিত হয়েছে।', false);
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showMessageToast('ত্রুটি', 'Firebase অপসারিত হয়েছে।', false);
    });

    btnSignOut.addEventListener('click', () => {
        clearCurrentUserSession();
        window.location.href = 'login.html';
    });

    btnSendOTP.addEventListener('click', () => {
        showMessageToast('ত্রুটি', 'Firebase অপসারিত হয়েছে।', false);
    });

    btnVerifyOTP.addEventListener('click', () => {
        showMessageToast('ত্রুটি', 'Firebase অপসারিত হয়েছে।', false);
    });

    // --- 7. Plan Selection Logic ---
    planCards.forEach(card => {
        const selectBtn = card.querySelector('.plan-select-btn');
        selectBtn.addEventListener('click', () => {
            // Check auth status first
            if (!getCurrentUser()) {
                showMessageToast('লগইন আবশ্যক', 'মেম্বারশিপ প্ল্যান বেছে নেওয়ার জন্য প্রথমে লগইন অথবা রেজিস্ট্রেশন করুন।', false);
                goToStep(1);
                return;
            }
            
            selectedPlan.id = card.getAttribute('data-plan');
            selectedPlan.name = card.getAttribute('data-name');
            selectedPlan.price = card.getAttribute('data-price');
            
            // Set prices and names in details
            paymentSelectedPlanName.innerText = card.querySelector('.plan-name').innerText + ' (Membership)';
            paymentSelectedPlanPrice.innerText = `৳ ${toBengaliNumber(selectedPlan.price)}`;
            
            // Set dynamic QR code image source based on selected plan duration
            let qrSource = 'assets/payment_qr.png';
            if (selectedPlan.id === 'monthly') {
                qrSource = 'assets/qr_monthly.jpeg';
            } else if (selectedPlan.id === 'quarterly') {
                qrSource = 'assets/qr_quarterly.jpeg';
            } else if (selectedPlan.id === 'half-yearly') {
                qrSource = 'assets/qr_half_yearly.jpeg';
            } else if (selectedPlan.id === 'yearly') {
                qrSource = 'assets/qr_yearly.jpeg';
            }
            if (paymentQRImage) {
                paymentQRImage.src = qrSource;
            }
            
            // Fill values for Step 5 Success screen
            successPlan.innerText = card.querySelector('.plan-name').innerText;
            successAmount.innerText = `৳ ${toBengaliNumber(selectedPlan.price)}`;
            
            goToStep(3);
        });
    });

    // --- 8. Member Details Form Logic ---
    memberDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form validations - clean spaces and validate phone starting with +91
        let phone = memPhoneInput.value.trim();
        let cleanPhone = phone.replace(/\s+/g, '');
        if (cleanPhone.startsWith('+91')) {
            cleanPhone = cleanPhone.slice(3);
        }
        
        if (!/^\d{10}$/.test(cleanPhone)) {
            showMessageToast('ইনপুট ত্রুটি', 'অনুগ্রহ করে সঠিক ১০ সংখ্যার মোবাইল নম্বর লিখুন (উদাঃ +91 9876543210)।', false);
            memPhoneInput.focus();
            return;
        }
        
        // Enforce prefix format
        const formattedPhone = `+91 ${cleanPhone}`;

        const name = memNameInput.value.trim();
        const address = document.getElementById('memAddress').value.trim();
        const interest = document.getElementById('memInterest').value;
        
        // Check terms agreement checkbox
        const declarationAgree = document.getElementById('memDeclarationAgree').checked;
        if (!declarationAgree) {
            showMessageToast('ভেরিফিকেশন ত্রুটি', 'আপনাকে অবশ্যই নিয়মাবলী ও ঘোষণা মেনে নেওয়ার বক্সে টিক দিতে হবে।', false);
            return;
        }
        
        // Local validation of files (just verifying they exist)
        const aadharFile = document.getElementById('memAadhar').files;
        const photoFile = document.getElementById('memPhoto').files;
        
        if (aadharFile.length === 0) {
            showMessageToast('ইনপুট ত্রুটি', 'অনুগ্রহ করে আধার কার্ডের ছবি বা পিডিএফ আপলোড করুন।', false);
            return;
        }
        if (photoFile.length === 0) {
            showMessageToast('ইনপুট ত্রুটি', 'অনুগ্রহ করে পাসপোর্ট সাইজ ছবি আপলোড করুন।', false);
            return;
        }

        // Cache details in temporary object
        window.tempMemberDetails = {
            memId: memIdInput.value,
            regDate: memRegDateInput.value,
            name,
            phone: formattedPhone,
            email: memEmailInput.value,
            address,
            interest
        };

        goToStep(4);
    });

    btnPrevToStep2.addEventListener('click', () => {
        goToStep(2);
    });

    // --- 9. Payment Verification Form Logic ---
    paymentSubmissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const screenshotInput = document.getElementById('paymentScreenshot');
        const txnIdInput = document.getElementById('paymentTxnId');
        
        const hasScreenshot = screenshotInput.files && screenshotInput.files.length > 0;
        const hasTxnId = txnIdInput.value.trim().length > 0;
        
        // Validate that at least one verification proof is supplied
        if (!hasScreenshot && !hasTxnId) {
            showMessageToast(
                'ভেরিফিকেশন ত্রুটি', 
                'অনুগ্রহ করে পেমেন্ট স্ক্রিনশট আপলোড করুন অথবা ট্রানজেকশন আইডি লিখুন। যেকোনো একটি দেওয়া বাধ্যতামূলক।', 
                false
            );
            txnIdInput.focus();
            return;
        }

        const user = getCurrentUser();
        if (!user) {
            showMessageToast('ত্রুটি', 'কোনো লগইন সেশন খুঁজে পাওয়া যায়নি। দয়া করে আবার চেষ্টা করুন।', false);
            goToStep(1);
            return;
        }

        // Build membership structure
        const membershipRequest = {
            userEmail: user.email,
            userName: user.name,
            details: window.tempMemberDetails || {},
            plan: selectedPlan,
            paymentProof: {
                screenshotFileName: hasScreenshot ? screenshotInput.files[0].name : null,
                transactionId: hasTxnId ? txnIdInput.value.trim() : null
            },
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Save application in localStorage
        const allApplications = localStorage.getItem('bmtp_memberships');
        const applicationsList = allApplications ? JSON.parse(allApplications) : [];
        
        // Remove older requests for the same email if user is re-applying
        const updatedList = applicationsList.filter(app => app.userEmail !== user.email);
        updatedList.push(membershipRequest);
        
        localStorage.setItem('bmtp_memberships', JSON.stringify(updatedList));

        // Update Step 5 success page displays
        successEmail.innerText = user.email;
        successMemId.innerText = window.tempMemberDetails ? window.tempMemberDetails.memId : 'BMTP-XXXX';
        successRegDate.innerText = window.tempMemberDetails ? window.tempMemberDetails.regDate : getFormattedDate();

        // Reset inputs
        paymentSubmissionForm.reset();
        memberDetailsForm.reset();
        memIdInput.value = '';
        memRegDateInput.value = '';
        
        // Reset file input labels to default
        document.querySelectorAll('.file-upload-text').forEach(el => {
            const isAadhar = el.closest('.file-upload-wrapper').querySelector('input').id === 'memAadhar';
            if (isAadhar) {
                el.innerText = 'ফাইল নির্বাচন করুন (JPG, PNG, PDF)';
            } else if (el.closest('.file-upload-wrapper').querySelector('input').id === 'memPhoto') {
                el.innerText = 'ছবি নির্বাচন করুন (JPG, PNG)';
            } else {
                el.innerText = 'স্ক্রিনশট নির্বাচন করুন (JPG, PNG)';
            }
            el.style.color = 'var(--color-text-muted)';
        });
        document.querySelectorAll('.file-upload-custom').forEach(c => {
            c.style.borderStyle = 'dashed';
            c.style.borderColor = 'var(--color-border)';
        });

        // Move to final success step
        goToStep(5);
        showMessageToast('আবেদন জমা হয়েছে!', 'আপনার পেমেন্ট ভেরিফিকেশন সফলভাবে জমা হয়েছে।');
    });

    btnPrevToStep3.addEventListener('click', () => {
        goToStep(3);
    });

    // --- 10. File Upload Inputs Visual Updates ---
    const fileInputs = document.querySelectorAll('.file-upload-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', () => {
            const wrapper = input.closest('.file-upload-wrapper');
            const textEl = wrapper.querySelector('.file-upload-text');
            const customEl = wrapper.querySelector('.file-upload-custom');
            
            if (input.files && input.files.length > 0) {
                textEl.innerText = input.files[0].name;
                textEl.style.color = 'var(--color-text-dark)';
                customEl.style.borderStyle = 'solid';
                customEl.style.borderColor = 'var(--color-accent-green)';
            } else {
                let placeholder = 'ফাইল নির্বাচন করুন (JPG, PNG, PDF)';
                if (input.id === 'memPhoto') {
                    placeholder = 'ছবি নির্বাচন করুন (JPG, PNG)';
                } else if (input.id === 'paymentScreenshot') {
                    placeholder = 'স্ক্রিনশট নির্বাচন করুন (JPG, PNG)';
                }
                textEl.innerText = placeholder;
                textEl.style.color = 'var(--color-text-muted)';
                customEl.style.borderStyle = 'dashed';
                customEl.style.borderColor = 'var(--color-border)';
            }
        });
    });

    // Initialize UI on load
    updateAuthUI();
    const user = getCurrentUser();
    if (user && currentStep === 1) {
        goToStep(2);
    }
});
