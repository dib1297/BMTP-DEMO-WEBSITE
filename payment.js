document.addEventListener('DOMContentLoaded', () => {
    const supabase = window.supabaseClient;
    if (!supabase) {
        console.error("Supabase client is not initialized.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const regId = urlParams.get('reg_id');

    if (!regId) {
        alert("Invalid URL. Registration ID is missing.");
        window.location.href = 'dashboard.html';
        return;
    }

    const successRegId = document.getElementById('successRegId');
    const copyIdBtn = document.getElementById('copyIdBtn');
    const copyToast = document.getElementById('copyToast');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const successFeeAmount = document.getElementById('successFeeAmount'); // Optional, since it's hardcoded to 60 for drawing

    if (successRegId) {
        successRegId.innerText = regId;
    }

    // Fetch registration details
    supabase.from('registrations').select('*').eq('registration_id', regId).single()
        .then(({ data: regData, error }) => {
            if (error || !regData) {
                console.error(error);
                alert("Registration not found.");
                window.location.href = 'dashboard.html';
                return;
            }

            // Prepare WhatsApp link
            const phoneNumber = '919547407043';
            const message = `Hello Team,

I have completed my registration payment.

*Registration Details:*
ID: ${regId}
Event: ${regData.event_title}
Category: ${regData.category_name}
Name: ${regData.participant_name}
Guardian: ${regData.guardian_name}
Phone: ${regData.phone}
Class: ${regData.school_class || 'N/A'}
Address: ${regData.address || 'N/A'}

Please find my payment screenshot attached.

Kindly verify my payment.
Thank you.`;
            
            if (whatsappBtn) {
                whatsappBtn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            }
        });

    // Copy Registration ID functionality
    if (copyIdBtn) {
        copyIdBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(regId).then(() => {
                // Show toast
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
