const fs = require('fs');
const html = fs.readFileSync('payment.html', 'utf8');

const startIndex = html.indexOf('<section class="registration-section section-padding bg-light">');
const endIndex = html.indexOf('<!-- Club Footer');

if (startIndex === -1 || endIndex === -1) {
    console.error("Tags not found");
    process.exit(1);
}

const before = html.substring(0, startIndex);
const after = html.substring(endIndex);

const paymentContent = `
    <!-- Payment Content Section -->
    <section class="registration-section section-padding bg-light">
        <div class="container" style="max-width: 600px; margin: 0 auto; min-height: 60vh; padding-top: 50px;">
            <div class="payment-modal-card" style="position: static; width: 100%; box-shadow: var(--shadow-md); transform: none; visibility: visible; opacity: 1; pointer-events: auto;">
                <div class="payment-modal-header">
                    <div class="payment-security-badge">
                        <i class="fa-solid fa-shield-halved"></i> নিরাপদ পেমেন্ট গেটওয়ে (Secure Checkout)
                    </div>
                    <h3>নিবন্ধন ফি পেমেন্ট</h3>
                    <p>Please scan the UPI QR code to pay the registration fee.</p>
                </div>
                
                <div class="payment-modal-body">
                    <!-- Summary Card -->
                    <div class="payment-summary-card">
                        <div class="summary-details">
                            <span class="summary-event" id="paymentEventName">লোড হচ্ছে...</span>
                            <span class="summary-cat" id="paymentCategoryName"></span>
                        </div>
                        <div class="summary-amount">
                            <span class="amount-lbl">মোট প্রদেয় (Total Payable):</span>
                            <span class="amount-val">₹৬০.০০</span>
                        </div>
                    </div>

                    <!-- UPI Block -->
                    <div class="payment-upi-section">
                        <!-- QR Code Frame -->
                        <div class="qr-code-frame">
                            <img id="paymentQrCodeImg" src="" alt="UPI QR Code">
                        </div>

                        <!-- UPI Instructions -->
                        <div class="upi-instructions-box">
                            <div class="upi-apps-row">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google-Pay-Logo.svg" alt="GPay" style="height: 18px;">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" style="height: 18px;">
                                <span class="upi-extra-badges">PhonePe | Paytm | BHIM</span>
                            </div>
                            <p class="instruction-text">1. যেকোনো UPI অ্যাপ (GPay, PhonePe, Paytm, BHIM) দিয়ে এই কিউআর (QR) কোডটি স্ক্যান করুন এবং ৬০ টাকা পেমেন্ট করুন।</p>
                        </div>
                    </div>

                    <!-- Payment Proof Form -->
                    <form id="paymentProofForm" style="margin-top: 25px;">
                        <div class="form-group">
                            <label class="form-label">ইউটিআর / ট্রানজাকশন আইডি (UTR / Transaction ID) <span class="required">*</span></label>
                            <div class="input-wrapper">
                                <i class="fa-solid fa-hashtag input-icon"></i>
                                <input type="text" id="paymentUtr" class="form-control" placeholder="12-digit UTR number" required>
                            </div>
                        </div>
                        
                        <div class="form-group" style="margin-top: 15px;">
                            <label class="form-label">পেমেন্ট স্ক্রিনশট (Payment Screenshot) <span class="required">*</span></label>
                            <input type="file" id="paymentScreenshot" accept="image/*" class="form-control" style="padding: 10px;" required>
                        </div>

                        <div style="margin-top: 25px;">
                            <button type="submit" class="btn btn-navy btn-full-mobile" id="submitPaymentBtn" style="width: 100%;">
                                <span class="btn-text-content"><i class="fa-solid fa-cloud-arrow-up"></i> প্রমাণ জমা দিন (Submit Proof)</span>
                                <span class="btn-loader-content" style="display: none;"><i class="fa-solid fa-circle-notch fa-spin"></i> আপলোড হচ্ছে...</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

`;

fs.writeFileSync('payment.html', before + paymentContent + after);
console.log("payment.html built successfully");
