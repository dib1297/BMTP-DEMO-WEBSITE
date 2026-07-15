const fs = require('fs');
const html = fs.readFileSync('payment.html', 'utf8');

const startIndex = html.indexOf('<!-- Inner Page Header Section -->');
const endIndex = html.indexOf('<!-- Club Footer');

if (startIndex === -1 || endIndex === -1) {
    console.error("Tags not found");
    process.exit(1);
}

const before = html.substring(0, startIndex);
const after = html.substring(endIndex);

const premiumContent = `
    <!-- Premium Success & Payment Section -->
    <section class="success-section" style="background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); min-height: 100vh; padding: 120px 15px 50px;">
        <div class="container" style="max-width: 650px; margin: 0 auto;">
            
            <!-- Success Header -->
            <div class="success-header text-center" style="margin-bottom: 40px; animation: fadeInDown 0.8s ease;">
                <div class="success-checkmark" style="width: 80px; height: 80px; background: #27ae60; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 30px rgba(39, 174, 96, 0.3);">
                    <i class="fa-solid fa-check" style="color: white; font-size: 40px;"></i>
                </div>
                <h1 style="font-size: 2rem; font-weight: 800; color: #2c3e50; margin-bottom: 10px;">Registration Submitted Successfully!</h1>
                <p style="color: #555; font-size: 1.1rem; line-height: 1.6;">Your registration has been received successfully.<br>To complete your registration, please make the payment using the QR Code below.</p>
            </div>

            <!-- Registration ID Card -->
            <div class="glass-card id-card" style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.8); border-radius: 20px; padding: 30px; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.05); margin-bottom: 30px; animation: fadeInUp 0.8s ease 0.2s both;">
                <p style="font-size: 0.9rem; color: #7f8c8d; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 10px;">Your Registration ID</p>
                <h2 id="successRegId" style="font-size: 2.2rem; font-weight: 900; color: #2980b9; letter-spacing: 2px; margin-bottom: 20px;">BMTP-XXXX-XXXXXX</h2>
                <button id="copyIdBtn" class="btn btn-outline" style="border-radius: 50px; padding: 10px 25px; font-weight: 600; transition: all 0.3s; border-color: #2980b9; color: #2980b9; cursor: pointer; background: transparent;">
                    <i class="fa-regular fa-copy"></i> Copy Registration ID
                </button>
            </div>

            <!-- Payment Card -->
            <div class="glass-card payment-card" style="background: #ffffff; border-radius: 20px; padding: 40px 30px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.08); margin-bottom: 30px; animation: fadeInUp 0.8s ease 0.4s both;">
                <h3 style="font-size: 1.5rem; font-weight: 800; color: #2c3e50; margin-bottom: 25px;">Complete Your Registration Payment</h3>
                
                <div class="qr-container" style="background: #f8f9fa; border-radius: 16px; padding: 20px; display: inline-block; box-shadow: inset 0 2px 10px rgba(0,0,0,0.02); margin-bottom: 25px;">
                    <img src="qrs/drawing 60 QR.jpeg" alt="UPI QR Code" style="width: 220px; height: 220px; object-fit: contain; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                </div>

                <div class="payment-details" style="display: flex; justify-content: center; gap: 40px; margin-bottom: 10px;">
                    <div style="text-align: left;">
                        <p style="font-size: 0.85rem; color: #7f8c8d; margin-bottom: 5px;">Registration Fee</p>
                        <p style="font-size: 1.2rem; font-weight: 800; color: #2c3e50;" id="successFeeAmount">₹60</p>
                    </div>
                    <div style="text-align: left;">
                        <p style="font-size: 0.85rem; color: #7f8c8d; margin-bottom: 5px;">Payment Method</p>
                        <p style="font-size: 1.2rem; font-weight: 800; color: #2c3e50;">UPI QR Code</p>
                    </div>
                </div>
            </div>

            <!-- Warning / Info Card -->
            <div class="glass-card info-card" style="background: rgba(255, 243, 205, 0.6); backdrop-filter: blur(5px); border-left: 5px solid #ffc107; border-radius: 16px; padding: 25px; margin-bottom: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.03); animation: fadeInUp 0.8s ease 0.6s both;">
                <h4 style="font-size: 1.2rem; font-weight: 800; color: #856404; margin-bottom: 15px;"><i class="fa-solid fa-triangle-exclamation"></i> Important Instructions</h4>
                <ol style="padding-left: 20px; color: #664d03; line-height: 1.8; font-size: 0.95rem; font-weight: 500;">
                    <li>Scan the QR Code above.</li>
                    <li>Complete the payment.</li>
                    <li><strong>Take a screenshot</strong> of the successful payment.</li>
                    <li>Copy your Registration ID.</li>
                    <li>Click the WhatsApp button below.</li>
                    <li>Send both the <strong>Payment Screenshot</strong> and your <strong>Registration ID</strong>.</li>
                </ol>
                <p style="margin-top: 15px; color: #dc3545; font-weight: 700; font-size: 0.9rem;"><i class="fa-solid fa-circle-exclamation"></i> Without payment verification your registration will NOT be approved.</p>
            </div>

            <!-- WhatsApp Button -->
            <div class="whatsapp-btn-container" style="text-align: center; animation: fadeInUp 0.8s ease 0.8s both;">
                <a href="#" id="whatsappBtn" class="btn" target="_blank" style="background: #25D366; color: white; border-radius: 50px; padding: 18px 30px; font-size: 1.1rem; font-weight: 700; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4); transition: transform 0.3s, box-shadow 0.3s; width: 100%; justify-content: center; text-decoration: none;">
                    <i class="fa-brands fa-whatsapp" style="font-size: 1.5rem;"></i> Send Payment Screenshot on WhatsApp
                </a>
            </div>

        </div>
    </section>

    <!-- CSS for animations -->
    <style>
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #whatsappBtn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(37, 211, 102, 0.5);
            color: white;
        }
        #copyIdBtn:hover {
            background: #2980b9 !important;
            color: white !important;
        }
        /* Toast notification */
        .toast-notification {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #2c3e50;
            color: white;
            padding: 12px 25px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.95rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 9999;
            opacity: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .toast-notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    </style>
    
    <div id="copyToast" class="toast-notification"><i class="fa-solid fa-circle-check" style="color:#2ecc71;"></i> Registration ID Copied Successfully</div>

`;

fs.writeFileSync('payment.html', before + premiumContent + after);
console.log("Success UI injected into payment.html");
