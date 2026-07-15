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

const adminContent = `
    <!-- Admin Content Section -->
    <section class="admin-section section-padding bg-light">
        <div class="container" style="min-height: 60vh; padding-top: 50px;">
            <h2 style="font-size: 2rem; margin-bottom: 30px; font-weight: 800; color: var(--color-primary);"><i class="fa-solid fa-user-shield"></i> অ্যাডমিন ড্যাশবোর্ড (Admin Dashboard)</h2>
            
            <div id="adminLoader" style="text-align: center; margin: 50px 0;">
                <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--color-primary);"></i>
                <p style="margin-top: 15px; color: var(--color-text-muted);">লোড হচ্ছে...</p>
            </div>

            <div id="adminContent" style="display: none;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; background: #fff; box-shadow: var(--shadow-sm); border-radius: 8px; overflow: hidden;">
                        <thead style="background: var(--color-navy); color: #fff;">
                            <tr>
                                <th style="padding: 15px; text-align: left;">Reg ID</th>
                                <th style="padding: 15px; text-align: left;">Event</th>
                                <th style="padding: 15px; text-align: left;">Participant</th>
                                <th style="padding: 15px; text-align: left;">Phone</th>
                                <th style="padding: 15px; text-align: left;">Payment Status</th>
                                <th style="padding: 15px; text-align: left;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="adminRegistrationsList">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <!-- Admin Registration Details Modal -->
    <div class="modal-overlay" id="adminRegModal">
        <div class="settings-modal" style="max-width: 600px;">
            <div class="settings-header">
                <h3 class="settings-title"><i class="fa-solid fa-file-invoice" style="color:var(--color-primary);"></i> Registration Details</h3>
                <button class="close-modal" id="closeAdminRegModal">&times;</button>
            </div>
            <div class="modal-body" id="adminRegDetails" style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                <!-- Populated by JS -->
            </div>
        </div>
    </div>

`;

fs.writeFileSync('admin.html', before + adminContent + after);
console.log("admin.html built successfully");
