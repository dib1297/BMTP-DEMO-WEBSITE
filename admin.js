document.addEventListener('DOMContentLoaded', async () => {
    const supabase = window.supabaseClient;
    if (!supabase) return;

    const loader = document.getElementById('adminLoader');
    const content = document.getElementById('adminContent');
    
    // Tab Elements
    const tabEvents = document.getElementById('tabEvents');
    const tabMemberships = document.getElementById('tabMemberships');
    const eventsTabContent = document.getElementById('eventsTabContent');
    const membershipsTabContent = document.getElementById('membershipsTabContent');

    const modal = document.getElementById('adminRegModal');
    const modalDetails = document.getElementById('adminRegDetails');

    // 1. Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const userId = session.user.id;

    // 2. Check if user is admin
    const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

    if (profileErr || !profile || !profile.is_admin) {
        alert("Access Denied: You are not an admin.");
        window.location.href = 'dashboard.html';
        return;
    }

    // 3. Tab Switching Logic
    let currentTab = 'events';

    tabEvents.addEventListener('click', () => {
        currentTab = 'events';
        tabEvents.classList.add('active');
        tabEvents.style.borderBottomColor = 'var(--color-primary)';
        tabEvents.style.color = 'var(--color-primary)';
        
        tabMemberships.classList.remove('active');
        tabMemberships.style.borderBottomColor = 'transparent';
        tabMemberships.style.color = '#7f8c8d';

        eventsTabContent.style.display = 'block';
        membershipsTabContent.style.display = 'none';
        
        document.getElementById('adminSearchInput').value = '';
        renderRegistrations(allRegistrations);
    });

    tabMemberships.addEventListener('click', () => {
        currentTab = 'memberships';
        tabMemberships.classList.add('active');
        tabMemberships.style.borderBottomColor = '#27ae60';
        tabMemberships.style.color = '#27ae60';
        
        tabEvents.classList.remove('active');
        tabEvents.style.borderBottomColor = 'transparent';
        tabEvents.style.color = '#7f8c8d';

        eventsTabContent.style.display = 'none';
        membershipsTabContent.style.display = 'block';
        
        document.getElementById('adminSearchInput').value = '';
        renderMemberships(allMemberships);
    });

    // 4. Fetch Data
    let allRegistrations = [];
    let allMemberships = [];

    const fetchAllData = async () => {
        loader.style.display = 'block';
        content.style.display = 'none';

        // Fetch Registrations
        const { data: regs, error: err1 } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        // Fetch Memberships
        const { data: mems, error: err2 } = await supabase
            .from('memberships')
            .select('*')
            .order('created_at', { ascending: false });

        loader.style.display = 'none';
        content.style.display = 'block';

        if (err1) console.error("Registrations Error:", err1);
        if (err2) console.error("Memberships Error:", err2);

        allRegistrations = regs || [];
        allMemberships = mems || [];
        
        window.adminRegsData = allRegistrations;
        window.adminMemsData = allMemberships;

        renderRegistrations(allRegistrations);
        renderMemberships(allMemberships);
    };

    // 5. Render Functions
    const renderRegistrations = (regs) => {
        const list = document.getElementById('adminRegistrationsList');
        if (!regs || regs.length === 0) {
            list.innerHTML = `<tr><td colspan="6" style="text-align:center;">No event registrations found.</td></tr>`;
            return;
        }

        list.innerHTML = regs.map(reg => {
            let statusBadge = '';
            if (reg.payment_status === 'Pending') statusBadge = `<span style="color:#f39c12;font-weight:600;">Pending</span>`;
            else if (reg.payment_status === 'Submitted') statusBadge = `<span style="color:#3498db;font-weight:600;">Submitted</span>`;
            else if (reg.payment_status === 'Paid') statusBadge = `<span style="color:#27ae60;font-weight:600;">Paid</span>`;
            else if (reg.payment_status === 'Rejected') statusBadge = `<span style="color:#e74c3c;font-weight:600;">Rejected</span>`;
            else statusBadge = `<span>${reg.payment_status}</span>`;
            
            return `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px;">${reg.registration_id}</td>
                    <td style="padding: 15px;">${reg.event_title}</td>
                    <td style="padding: 15px;">${reg.participant_name}</td>
                    <td style="padding: 15px;">${reg.phone}</td>
                    <td style="padding: 15px;">${statusBadge}</td>
                    <td style="padding: 15px;">
                        <button class="btn btn-sm btn-outline" onclick="viewReg('${reg.id}')" style="padding: 5px 10px; font-size: 0.8rem;">View</button>
                    </td>
                </tr>
            `;
        }).join('');
    };

    const renderMemberships = (mems) => {
        const list = document.getElementById('adminMembershipsList');
        if (!mems || mems.length === 0) {
            list.innerHTML = `<tr><td colspan="6" style="text-align:center;">No memberships found.</td></tr>`;
            return;
        }

        list.innerHTML = mems.map(mem => {
            let statusBadge = '';
            if (mem.payment_status === 'Pending') statusBadge = `<span style="color:#f39c12;font-weight:600;">Pending</span>`;
            else if (mem.payment_status === 'Paid') statusBadge = `<span style="color:#27ae60;font-weight:600;">Paid</span>`;
            else if (mem.payment_status === 'Rejected') statusBadge = `<span style="color:#e74c3c;font-weight:600;">Rejected</span>`;
            else statusBadge = `<span>${mem.payment_status}</span>`;
            
            return `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px;">${mem.membership_id}</td>
                    <td style="padding: 15px;">${mem.name}</td>
                    <td style="padding: 15px;">${mem.phone}</td>
                    <td style="padding: 15px;">${mem.plan_name}</td>
                    <td style="padding: 15px;">${statusBadge}</td>
                    <td style="padding: 15px;">
                        <button class="btn btn-sm" onclick="viewMem('${mem.id}')" style="padding: 5px 10px; font-size: 0.8rem; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">View Documents</button>
                    </td>
                </tr>
            `;
        }).join('');
    };

    await fetchAllData();

    // 6. Search Logic
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            if (currentTab === 'events') {
                const filtered = allRegistrations.filter(reg => {
                    return (reg.registration_id || '').toLowerCase().includes(term) || 
                           (reg.participant_name || '').toLowerCase().includes(term) || 
                           (reg.phone || '').toLowerCase().includes(term);
                });
                renderRegistrations(filtered);
            } else {
                const filtered = allMemberships.filter(mem => {
                    return (mem.membership_id || '').toLowerCase().includes(term) || 
                           (mem.name || '').toLowerCase().includes(term) || 
                           (mem.phone || '').toLowerCase().includes(term);
                });
                renderMemberships(filtered);
            }
        });
    }

    // Modal Close
    document.getElementById('closeAdminRegModal').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // 7. View Event Registration
    window.viewReg = async (id) => {
        const reg = window.adminRegsData.find(r => r.id === id);
        if (!reg) return;

        let proofHtml = '<p>No payment proof submitted.</p>';
        if (reg.screenshot_url) {
            let imageUrl = reg.screenshot_url;
            if (!imageUrl.startsWith('http')) {
                const { data: signedData } = await supabase.storage.from('payment-screenshots').createSignedUrl(imageUrl, 3600);
                if (signedData) imageUrl = signedData.signedUrl;
            }

            proofHtml = `
                <div style="margin-top: 15px;">
                    <strong>UTR Number:</strong> ${reg.utr_number} <br>
                    <strong>Screenshot:</strong><br>
                    <a href="${imageUrl}" target="_blank">
                        <img src="${imageUrl}" style="max-width: 100%; max-height: 300px; border: 1px solid #ddd; margin-top: 10px; border-radius: 8px;">
                    </a>
                </div>
            `;
        }

        let actionBtns = '';
        if (reg.payment_status === 'Submitted' || reg.registration_status === 'Pending Verification') {
            actionBtns = `
                <div style="margin-top: 25px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="updateRegStatus('${reg.id}', 'Confirmed', 'Paid')" style="flex: 1; background: #27ae60; border: none;">Approve Payment</button>
                    <button class="btn btn-navy" onclick="updateRegStatus('${reg.id}', 'Rejected', 'Rejected')" style="flex: 1; background: #e74c3c; border: none;">Reject</button>
                </div>
            `;
        }

        modalDetails.innerHTML = `
            <div style="line-height: 1.6;">
                <h4 style="color: var(--color-primary); border-bottom: 2px solid #eee; padding-bottom: 5px;">Event Registration</h4>
                <p><strong>Registration ID:</strong> ${reg.registration_id}</p>
                <p><strong>Event:</strong> ${reg.event_title}</p>
                <p><strong>Participant Name:</strong> ${reg.participant_name}</p>
                <p><strong>Phone:</strong> <a href="https://wa.me/${reg.phone.replace('+', '')}" target="_blank" style="color: #25D366; font-weight: bold;"><i class="fa-brands fa-whatsapp"></i> ${reg.phone}</a></p>
                <p><strong>Status:</strong> ${reg.registration_status}</p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
                <h4>Payment Info</h4>
                ${proofHtml}
                ${actionBtns}
            </div>
        `;
        modal.classList.add('active');
    };

    // 8. View Membership Details
    window.viewMem = async (id) => {
        const mem = window.adminMemsData.find(m => m.id === id);
        if (!mem) return;

        let aadhaarNo = 'N/A';
        let aadhaarImg = '';
        let signImg = '';
        let passportImg = mem.photo_url || '';

        // Parse Aadhaar URL JSON if it exists
        try {
            if (mem.aadhaar_url && mem.aadhaar_url.startsWith('{')) {
                const parsed = JSON.parse(mem.aadhaar_url);
                aadhaarNo = parsed.no || 'N/A';
                aadhaarImg = parsed.img || '';
                signImg = parsed.sign || '';
            } else {
                aadhaarNo = mem.aadhaar_url; // Fallback for old records
            }
        } catch(e) {}

        const makeDocLink = (url, name) => {
            if (!url || url === 'null') return `<span style="color:#e74c3c;">Not Uploaded</span>`;
            return `<a href="${url}" target="_blank" style="display:inline-block; margin-top:5px; padding: 8px 15px; background: #f1f2f6; border-radius: 6px; color: #2980b9; text-decoration: none; font-weight: 600; font-size: 0.9rem; border: 1px solid #dcdde1;"><i class="fa-solid fa-external-link-alt"></i> View ${name}</a>`;
        };

        let actionBtns = '';
        if (mem.payment_status === 'Pending') {
            actionBtns = `
                <div style="margin-top: 25px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="updateMemStatus('${mem.id}', 'Paid')" style="flex: 1; background: #27ae60; border: none;"><i class="fa-solid fa-check"></i> Mark as Paid</button>
                    <button class="btn btn-navy" onclick="updateMemStatus('${mem.id}', 'Rejected')" style="flex: 1; background: #e74c3c; border: none;"><i class="fa-solid fa-times"></i> Reject</button>
                </div>
            `;
        }

        modalDetails.innerHTML = `
            <div style="line-height: 1.6;">
                <h4 style="color: #27ae60; border-bottom: 2px solid #eee; padding-bottom: 5px;"><i class="fa-solid fa-id-card"></i> Official Membership Details</h4>
                <p><strong>Membership ID:</strong> <span style="color: #f39c12; font-weight: bold;">${mem.membership_id}</span></p>
                <p><strong>Name:</strong> ${mem.name}</p>
                <p><strong>Phone:</strong> <a href="https://wa.me/${mem.phone.replace('+', '')}" target="_blank" style="color: #25D366; font-weight: bold;"><i class="fa-brands fa-whatsapp"></i> ${mem.phone}</a> <span style="font-size:0.8rem; color:#888;">(Click to Chat)</span></p>
                <p><strong>Aadhaar No:</strong> ${aadhaarNo}</p>
                <p><strong>Address:</strong> ${mem.address}</p>
                <p><strong>Plan:</strong> ${mem.plan_name} (₹${mem.plan_price})</p>
                <p><strong>Payment Status:</strong> ${mem.payment_status === 'Paid' ? '<span style="color:#27ae60;font-weight:bold;">Paid</span>' : '<span style="color:#f39c12;font-weight:bold;">Pending Payment</span>'}</p>
                
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
                <h4 style="margin-bottom: 10px;">Uploaded Documents</h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div><strong>Aadhaar Card:</strong><br> ${makeDocLink(aadhaarImg, 'Aadhaar')}</div>
                    <div><strong>Passport Photo:</strong><br> ${makeDocLink(passportImg, 'Passport Photo')}</div>
                    <div><strong>Signature:</strong><br> ${makeDocLink(signImg, 'Signature')}</div>
                </div>

                ${actionBtns}
            </div>
        `;
        modal.classList.add('active');
    };

    window.updateRegStatus = async (id, regStatus, payStatus) => {
        if (!confirm(`Are you sure you want to mark this registration as ${regStatus}?`)) return;
        try {
            const { error } = await supabase.from('registrations')
                .update({ registration_status: regStatus, payment_status: payStatus }).eq('id', id);
            if (error) throw error;
            alert(`Successfully updated to ${regStatus}`);
            modal.classList.remove('active');
            await fetchAllData();
        } catch (err) {
            alert("Error updating status.");
        }
    };

    window.updateMemStatus = async (id, payStatus) => {
        if (!confirm(`Are you sure you want to mark this membership as ${payStatus}?`)) return;
        try {
            const { error } = await supabase.from('memberships')
                .update({ payment_status: payStatus }).eq('id', id);
            if (error) throw error;
            alert(`Successfully updated membership to ${payStatus}`);
            modal.classList.remove('active');
            await fetchAllData();
        } catch (err) {
            alert("Error updating membership status.");
        }
    };
});
