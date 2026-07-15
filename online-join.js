document.addEventListener('DOMContentLoaded', () => {
    // Form Sections
    const formContainer = document.getElementById('formContainer');
    const paymentContainer = document.getElementById('paymentContainer');

    // Forms
    const onlineRegistrationForm = document.getElementById('onlineRegistrationForm');
    
    // Success UI Elements
    const successRegId = document.getElementById('successRegId');
    const copyIdBtn = document.getElementById('copyIdBtn');
    const copyToast = document.getElementById('copyToast');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const btnSubmitForm = document.getElementById('btnSubmitForm');

    // OTP Elements
    const regMobile = document.getElementById('regMobile');
    const btnSendOtp = document.getElementById('btnSendOtp');
    const otpVerificationGroup = document.getElementById('otpVerificationGroup');
    const regOtp = document.getElementById('regOtp');
    const btnVerifyOtp = document.getElementById('btnVerifyOtp');
    const otpStatus = document.getElementById('otpStatus');
    
    // State
    let isPhoneVerified = false;

    // Helper: format phone number
    const formatPhone = (phone) => {
        let clean = phone.replace(/\s+/g, '');
        if (!clean.startsWith('+91') && !clean.startsWith('+')) {
            if (clean.length === 10) {
                clean = '+91' + clean;
            }
        }
        return clean;
    };

    // Helper: Generate Random String
    const generateRandomString = (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // 1. Send OTP
    if(btnSendOtp) {
        btnSendOtp.addEventListener('click', async () => {
            const phone = formatPhone(regMobile.value);
            if (!phone || phone.length < 13) {
                alert('Please enter a valid 10-digit mobile number.');
                regMobile.focus();
                return;
            }

            btnSendOtp.disabled = true;
            btnSendOtp.innerText = 'Sending...';

            try {
                const { error } = await window.supabaseClient.auth.signInWithOtp({
                    phone: phone
                });

                if (error) throw error;

                otpVerificationGroup.style.display = 'block';
                otpStatus.innerText = 'OTP sent successfully! Please wait up to 1 minute.';
                otpStatus.style.color = '#27ae60';
                
                let countdown = 60;
                const timer = setInterval(() => {
                    countdown--;
                    if (countdown <= 0) {
                        clearInterval(timer);
                        btnSendOtp.disabled = false;
                        btnSendOtp.innerText = 'Resend OTP';
                    } else {
                        btnSendOtp.innerText = `Resend in ${countdown}s`;
                    }
                }, 1000);

            } catch (err) {
                console.error('OTP Send Error:', err);
                alert('Failed to send OTP. Please check the number and try again.');
                btnSendOtp.disabled = false;
                btnSendOtp.innerText = 'Send OTP';
            }
        });
    }

    // 2. Verify OTP
    if(btnVerifyOtp) {
        btnVerifyOtp.addEventListener('click', async () => {
            const phone = formatPhone(regMobile.value);
            const token = regOtp.value.trim();

            if (!token || token.length < 6) {
                alert('Please enter a valid 6-digit OTP.');
                return;
            }

            btnVerifyOtp.disabled = true;
            btnVerifyOtp.innerText = 'Verifying...';

            // Dummy OTP bypass for testing '123456'
            if (token === '123456') {
                isPhoneVerified = true;
                otpStatus.innerText = '✅ Number Verified Successfully! (Test Mode)';
                otpStatus.style.color = '#27ae60';
                btnVerifyOtp.style.display = 'none';
                regOtp.disabled = true;
                regMobile.disabled = true;
                btnSendOtp.style.display = 'none';
                return;
            }

            try {
                const { data, error } = await window.supabaseClient.auth.verifyOtp({
                    phone: phone,
                    token: token,
                    type: 'sms'
                });

                if (error) throw error;

                isPhoneVerified = true;
                otpStatus.innerText = '✅ Number Verified Successfully!';
                otpStatus.style.color = '#27ae60';
                btnVerifyOtp.style.display = 'none';
                regOtp.disabled = true;
                regMobile.disabled = true;
                btnSendOtp.style.display = 'none';

            } catch (err) {
                console.error('OTP Verify Error:', err);
                alert('Invalid OTP. Please try again.');
                btnVerifyOtp.disabled = false;
                btnVerifyOtp.innerText = 'Verify';
            }
        });
    }

    // Handle File Upload Custom Text and Size Limit
    const fileInputs = document.querySelectorAll('.file-upload-input');
    const MAX_FILE_SIZE = 500 * 1024; // 500KB

    fileInputs.forEach(input => {
        input.addEventListener('change', () => {
            const textEl = input.nextElementSibling.querySelector('.file-upload-text');
            const customBox = input.nextElementSibling;
            const defaultText = textEl.getAttribute('data-default') || textEl.innerText;
            
            if (!textEl.hasAttribute('data-default')) {
                textEl.setAttribute('data-default', defaultText);
            }

            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                
                if (file.size > MAX_FILE_SIZE) {
                    alert('File size must be less than 500KB. Please upload a smaller file.');
                    input.value = ''; // clear the input
                    textEl.innerText = defaultText;
                    textEl.style.color = '#e74c3c';
                    customBox.style.borderColor = '#e74c3c';
                    customBox.style.borderStyle = 'dashed';
                    return;
                }

                textEl.innerText = file.name;
                textEl.style.color = '#27ae60';
                customBox.style.borderColor = '#27ae60';
                customBox.style.borderStyle = 'solid';
            } else {
                textEl.innerText = defaultText;
                textEl.style.color = '#666';
                customBox.style.borderColor = '#ccc';
                customBox.style.borderStyle = 'dashed';
            }
        });
    });

    // Helper: Upload file to Supabase Storage
    const uploadFile = async (file, path) => {
        if (!file) return null;
        try {
            const { data, error } = await window.supabaseClient.storage
                .from('membership-documents')
                .upload(path, file, { cacheControl: '3600', upsert: false });
            
            if (error) throw error;
            
            const { data: publicUrlData } = window.supabaseClient.storage
                .from('membership-documents')
                .getPublicUrl(path);
                
            return publicUrlData.publicUrl;
        } catch (err) {
            console.error("Upload error for " + path, err);
            return null;
        }
    };

    // Form Submit -> Save to DB & Show Success UI
    onlineRegistrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isPhoneVerified) {
            alert('Please verify your mobile number with OTP before proceeding.');
            regMobile.focus();
            return;
        }

        // Update button state
        const originalBtnText = btnSubmitForm.innerHTML;
        btnSubmitForm.disabled = true;
        btnSubmitForm.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading Documents & Processing...';

        // Gather data
        const name = document.getElementById('regName').value.trim();
        const phone = formatPhone(document.getElementById('regMobile').value);
        const permanentAddress = document.getElementById('regPermanentAddress').value.trim();
        const presentAddress = document.getElementById('regPresentAddress').value.trim();
        const aadhaarNo = document.getElementById('regAadhaarNo').value.trim();
        const year = new Date().getFullYear();
        
        // Files
        const fileAadhaar = document.getElementById('regAadhaarImg').files[0];
        const filePassport = document.getElementById('regPassportImg').files[0];
        const fileSignature = document.getElementById('regSignatureImg').files[0];
        
        // Generate Membership ID
        const memId = `BMTP-MEM-${year}-${generateRandomString(6)}`;

        // Upload files with descriptive naming: ID_Type_Name.ext (Helps with Supabase search)
        const cleanName = name.replace(/\s+/g, '_');
        
        let aadhaarUrl = await uploadFile(fileAadhaar, `${memId}_Aadhaar_${cleanName}.${fileAadhaar.name.split('.').pop()}`);
        let passportUrl = await uploadFile(filePassport, `${memId}_Passport_${cleanName}.${filePassport.name.split('.').pop()}`);
        let signatureUrl = await uploadFile(fileSignature, `${memId}_Signature_${cleanName}.${fileSignature.name.split('.').pop()}`);

        const insertData = {
            membership_id: memId,
            name: name,
            phone: phone,
            email: 'N/A',
            address: `Permanent: ${permanentAddress} | Present: ${presentAddress}`,
            interest: 'Official Member',
            plan_name: 'Lifetime Membership',
            plan_price: '100',
            payment_status: 'Pending',
            aadhaar_url: JSON.stringify({ no: aadhaarNo, img: aadhaarUrl, sign: signatureUrl }),
            photo_url: passportUrl
        };

        try {
            const { error } = await window.supabaseClient.from('memberships').insert([insertData]);

            if (error) {
                console.error("Supabase Error:", error);
                alert("Error submitting application. Please try again.");
                btnSubmitForm.disabled = false;
                btnSubmitForm.innerHTML = originalBtnText;
                return;
            }

            // Success: Update UI
            if (successRegId) {
                successRegId.innerText = memId;
            }

            // Prepare WhatsApp link
            const phoneNumber = '919547407043';
            const message = `Hello Team,

I have submitted my Official Membership application online and completed the ₹100 payment. My documents (Aadhaar, Passport Photo, and Signature) have been successfully uploaded to the portal.

*Membership Details:*
Temporary ID: ${memId}
Name: ${name}
Phone: ${phone}
Aadhaar No: ${aadhaarNo}
Permanent Address: ${permanentAddress}
Present Address: ${presentAddress}

Please find my *Payment Screenshot* attached with this message.

Kindly verify my Membership Joining Request..
Thank you.`;
            
            if (whatsappBtn) {
                whatsappBtn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            }

            // Attach EmailJS send logic to the WhatsApp button click
            if (whatsappBtn) {
                whatsappBtn.onclick = async () => {
                    try {
                        const emailPayload = {
                            service_id: 'YOUR_SERVICE_ID', // Replace with EmailJS Service ID
                            template_id: 'YOUR_TEMPLATE_ID', // Replace with EmailJS Template ID
                            user_id: 'YOUR_PUBLIC_KEY', // Replace with EmailJS Public Key
                            template_params: {
                                to_email: 'team.bmtp2023@gmail.com',
                                membership_id: memId,
                                full_name: name,
                                phone: phone,
                                aadhaar: aadhaarNo,
                                address: permanentAddress,
                                present_address: presentAddress,
                                aadhaar_url: aadhaarUrl || 'Not Uploaded',
                                passport_url: passportUrl || 'Not Uploaded',
                                signature_url: signatureUrl || 'Not Uploaded',
                                created_at: new Date().toLocaleString()
                            }
                        };
                        
                        // Send Email via EmailJS
                        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(emailPayload)
                        });
                        console.log("Email sent successfully on WhatsApp click.");
                    } catch (emailErr) {
                        console.error("EmailJS Error:", emailErr);
                    }
                };
            }

            // Transition to Success Page
            formContainer.style.display = 'none';
            paymentContainer.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error("Unknown Error:", err);
            btnSubmitForm.disabled = false;
            btnSubmitForm.innerHTML = originalBtnText;
            alert("An unexpected error occurred.");
        }
    });

    // Copy Membership ID functionality
    if (copyIdBtn) {
        copyIdBtn.addEventListener('click', () => {
            const idText = successRegId.innerText;
            navigator.clipboard.writeText(idText).then(() => {
                if (copyToast) {
                    copyToast.classList.add('show');
                    setTimeout(() => {
                        copyToast.classList.remove('show');
                    }, 3000);
                }
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});
