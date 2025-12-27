const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

// Load environment variables from .env file if it exists
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not installed, that's okay - use environment variables directly
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create necessary directories
const dirs = ['uploads', 'uploads/videos', 'uploads/documents', 'uploads/portfolio', 'data'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for all file types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Route files to different directories based on field name
        if (file.fieldname === 'video1') {
        cb(null, 'uploads/videos/');
        } else if (file.fieldname === 'resume') {
            cb(null, 'uploads/documents/');
        } else if (file.fieldname === 'portfolioFiles') {
            cb(null, 'uploads/portfolio/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        let prefix = '';
        
        if (file.fieldname === 'video1') {
            prefix = 'video-';
        } else if (file.fieldname === 'resume') {
            prefix = 'resume-';
        } else if (file.fieldname === 'portfolioFiles') {
            prefix = 'portfolio-';
        }
        
        cb(null, prefix + uniqueSuffix + ext);
    }
});

// Email configuration
const emailConfig = {
    to: process.env.ADMIN_EMAIL || 'zac@elmwood.co', // Where to send application notifications
    enabled: process.env.EMAIL_ENABLED !== 'false' // Default to enabled if not explicitly disabled
};

// Email transporter setup (only if email is enabled)
let transporter = null;
if (emailConfig.enabled && process.env.EMAIL_HOST) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

// Generate PDF from application data
function generateApplicationPDF(applicationData) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            
            // Header
            doc.fontSize(20).font('Helvetica-Bold')
               .text('Application for Director - Marketing & Operations', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).font('Helvetica')
               .text(`Application ID: ${applicationData.id}`, { align: 'center' });
            doc.text(`Submitted: ${new Date(applicationData.submittedAt).toLocaleString()}`, { align: 'center' });
            doc.moveDown(2);
            
            // Personal Information
            doc.fontSize(16).font('Helvetica-Bold').text('Personal Information');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            doc.text(`Name: ${applicationData.personalInfo?.fullName || 'N/A'}`);
            doc.text(`Email: ${applicationData.personalInfo?.email || 'N/A'}`);
            doc.text(`Phone: ${applicationData.personalInfo?.phoneFull || applicationData.personalInfo?.phone || 'N/A'}`);
            doc.text(`Location: ${applicationData.personalInfo?.location || 'N/A'}`);
            if (applicationData.personalInfo?.linkedin) {
                doc.text(`LinkedIn: ${applicationData.personalInfo.linkedin}`);
            }
            if (applicationData.personalInfo?.personalWebsite) {
                doc.text(`Website: ${applicationData.personalInfo.personalWebsite}`);
            }
            if (applicationData.personalInfo?.preferredCommunication) {
                doc.text(`Preferred Communication: ${applicationData.personalInfo.preferredCommunication}`);
            }
            doc.moveDown();
            
            // Education
            if (applicationData.education) {
                doc.fontSize(16).font('Helvetica-Bold').text('Education');
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                doc.text(`Highest Education: ${applicationData.education.highestEducation || 'N/A'}`);
                if (applicationData.education.educationField) {
                    doc.text(`Field: ${applicationData.education.educationField}`);
                }
                if (applicationData.education.institution) {
                    doc.text(`Institution: ${applicationData.education.institution}`);
                }
                if (applicationData.education.graduationYear) {
                    doc.text(`Graduation Year: ${applicationData.education.graduationYear}`);
                }
                if (applicationData.education.gpa) {
                    doc.text(`GPA: ${applicationData.education.gpa}`);
                }
                if (applicationData.education.additionalEducation) {
                    doc.text(`Additional Education: ${applicationData.education.additionalEducation}`);
                }
                doc.moveDown();
            }
            
            // Experience
            if (applicationData.experience) {
                doc.fontSize(16).font('Helvetica-Bold').text('Experience');
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                if (applicationData.experience.marketingDesignExperience) {
                    doc.text(`Marketing/Design Experience: ${applicationData.experience.marketingDesignExperience}`);
                }
                if (applicationData.experience.creExperience) {
                    doc.text(`CRE Experience: ${applicationData.experience.creExperience}`);
                }
                if (applicationData.experience.previousRole) {
                    doc.text(`Previous Role: ${applicationData.experience.previousRole}`);
                }
                if (applicationData.experience.marketingExperience) {
                    doc.text(`Marketing Experience: ${applicationData.experience.marketingExperience}`);
                }
                if (applicationData.experience.transactionExperience) {
                    doc.text(`Transaction Experience: ${applicationData.experience.transactionExperience}`);
                }
                if (applicationData.experience.transferableExperience) {
                    doc.text(`Transferable Experience: ${applicationData.experience.transferableExperience}`);
                }
                doc.moveDown();
            }
            
            // Technical Skills
            if (applicationData.technical) {
                doc.fontSize(16).font('Helvetica-Bold').text('Technical Skills');
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                if (applicationData.technical.microsoftOffice) {
                    doc.text(`Microsoft Office: ${applicationData.technical.microsoftOffice}`);
                }
                if (applicationData.technical.crmSystems) {
                    doc.text(`CRM Systems: ${applicationData.technical.crmSystems}`);
                }
                if (applicationData.technical.crmExperience) {
                    doc.text(`CRM Experience: ${applicationData.technical.crmExperience}`);
                }
                if (applicationData.technical.designTools && applicationData.technical.designTools.length > 0) {
                    doc.text(`Design Tools: ${applicationData.technical.designTools.join(', ')}`);
                }
                if (applicationData.technical.marketingMaterials) {
                    doc.text(`Marketing Materials: ${applicationData.technical.marketingMaterials}`);
                }
                if (applicationData.technical.englishProficiency) {
                    doc.text(`English Proficiency: ${applicationData.technical.englishProficiency}`);
                }
                if (applicationData.technical.stakeholderCommunication) {
                    doc.text(`Stakeholder Communication: ${applicationData.technical.stakeholderCommunication}`);
                }
                doc.moveDown();
            }
            
            // Role-Specific
            if (applicationData.roleSpecific) {
                doc.fontSize(16).font('Helvetica-Bold').text('Role-Specific Assessment');
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                if (applicationData.roleSpecific.transactionCoordination) {
                    doc.text(`Transaction Coordination: ${applicationData.roleSpecific.transactionCoordination}`);
                }
                if (applicationData.roleSpecific.timeManagement) {
                    doc.text(`Time Management: ${applicationData.roleSpecific.timeManagement}`);
                }
                if (applicationData.roleSpecific.careerGoals) {
                    doc.text(`Career Goals: ${applicationData.roleSpecific.careerGoals}`);
                }
                if (applicationData.roleSpecific.managementExperience) {
                    doc.text(`Management Experience: ${applicationData.roleSpecific.managementExperience}`);
                }
                if (applicationData.roleSpecific.managementExample) {
                    doc.moveDown(0.3);
                    doc.text(`Management Example:`, { continued: false });
                    doc.text(applicationData.roleSpecific.managementExample, { indent: 20 });
                }
                doc.moveDown();
            }
            
            // Accommodations
            if (applicationData.accommodations) {
                doc.fontSize(16).font('Helvetica-Bold').text('Accommodations');
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                doc.text(applicationData.accommodations, { indent: 20 });
                doc.moveDown();
            }
            
            // Availability
            if (applicationData.availability) {
                doc.fontSize(16).font('Helvetica-Bold').text('Availability');
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                if (applicationData.availability.timezone) {
                    doc.text(`Timezone: ${applicationData.availability.timezone}`);
                }
                if (applicationData.availability.usHoursOverlap) {
                    doc.text(`US Hours Overlap: ${applicationData.availability.usHoursOverlap}`);
                }
                if (applicationData.availability.startDate) {
                    doc.text(`Start Date: ${applicationData.availability.startDate}`);
                }
                doc.moveDown();
            }
            
            // Fit Assessment
            if (applicationData.fitAssessment) {
                doc.fontSize(16).font('Helvetica-Bold').text('Fit Assessment');
                doc.moveDown(0.5);
                doc.fontSize(11).font('Helvetica');
                if (applicationData.fitAssessment.communicationPreference) {
                    doc.text(`Communication Preference: ${applicationData.fitAssessment.communicationPreference}`);
                }
                if (applicationData.fitAssessment.timeManagement) {
                    doc.text(`Time Management: ${applicationData.fitAssessment.timeManagement}`);
                }
                if (applicationData.fitAssessment.careerGoals) {
                    doc.text(`Career Goals: ${applicationData.fitAssessment.careerGoals}`);
                }
                doc.moveDown();
            }
            
            // Files
            doc.fontSize(16).font('Helvetica-Bold').text('Attachments');
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');
            if (applicationData.videos?.video1) {
                doc.text(`Video: ${applicationData.videos.video1}`);
            }
            if (applicationData.documents?.resume) {
                doc.text(`Resume: ${applicationData.documents.resume}`);
            }
            if (applicationData.portfolio && applicationData.portfolio.length > 0) {
                doc.text(`Portfolio Files: ${applicationData.portfolio.length} file(s)`);
                applicationData.portfolio.forEach((file, i) => {
                    doc.text(`  ${i + 1}. ${file}`, { indent: 20 });
                });
            }
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

// Send email function with PDF attachment
async function sendEmailWithPDF(to, subject, html, text, pdfBuffer, applicantName) {
    if (!emailConfig.enabled || !transporter) {
        console.log('📧 Email disabled or not configured, skipping email to:', to);
        return;
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: html,
            text: text || html.replace(/<[^>]*>/g, ''),
            attachments: [
                {
                    filename: `Application_${applicantName || 'Unknown'}_${Date.now()}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };
        
        await transporter.sendMail(mailOptions);
        console.log('✅ Email with PDF sent successfully to:', to);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}

// Send email function (simple, no attachments - for candidate confirmation)
async function sendEmail(to, subject, html, text) {
    if (!emailConfig.enabled || !transporter) {
        console.log('📧 Email disabled or not configured, skipping email to:', to);
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: html,
            text: text || html.replace(/<[^>]*>/g, '')
        });
        console.log('✅ Email sent successfully to:', to);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit (applies to all files)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        
        // Video files
        if (file.fieldname === 'video1') {
            const allowedTypes = /\.(mp4|mov|avi|wmv|webm)$/;
            if (allowedTypes.test(ext)) {
                return cb(null, true);
            }
            return cb(new Error('Only video files are allowed (mp4, mov, avi, wmv, webm)'));
        }
        
        // Document files
        if (file.fieldname === 'resume') {
            const allowedTypes = /\.(pdf|doc|docx)$/;
            if (allowedTypes.test(ext)) {
                return cb(null, true);
            }
            return cb(new Error('Only PDF, DOC, or DOCX files are allowed'));
        }
        
        // Portfolio files
        if (file.fieldname === 'portfolioFiles') {
            const allowedTypes = /\.(pdf|doc|docx|jpg|jpeg|png|zip)$/;
            if (allowedTypes.test(ext)) {
            return cb(null, true);
            }
            return cb(new Error('Only PDF, DOC, DOCX, JPG, PNG, or ZIP files are allowed for portfolio'));
        }
        
        cb(null, true);
    }
});

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the application form
app.get('/application.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'application.html'));
});

// Handle form submission
app.post('/api/submit-application', upload.fields([
    { name: 'video1', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'portfolioFiles', maxCount: 10 }
]), (req, res) => {
    console.log('=== Application Submission Received ===');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Files:', req.files ? Object.keys(req.files) : 'No files');
    
    try {
        const applicationData = {
            id: Date.now().toString(),
            submittedAt: new Date().toISOString(),
            personalInfo: {
                fullName: req.body.fullName,
                email: req.body.email,
                countryCode: req.body.countryCode || '',
                phone: req.body.phone,
                phoneFull: (req.body.countryCode || '') + (req.body.phone || ''),
                location: req.body.location,
                linkedin: req.body.linkedin || null,
                personalWebsite: req.body.personalWebsite || null,
                preferredCommunication: req.body.preferredCommunication || null
            },
            education: {
                highestEducation: req.body.highestEducation,
                educationField: req.body.educationField,
                institution: req.body.institution,
                graduationYear: req.body.graduationYear,
                gpa: req.body.gpa,
                additionalEducation: req.body.additionalEducation
            },
            experience: {
                marketingDesignExperience: req.body.marketingDesignExperience,
                creExperience: req.body.creExperience,
                previousRole: req.body.previousRole,
                marketingExperience: req.body.marketingExperience,
                transactionExperience: req.body.transactionExperience,
                transferableExperience: req.body.transferableExperience
            },
                technical: {
                    microsoftOffice: req.body.microsoftOffice,
                    crmSystems: req.body.crmSystems,
                    crmExperience: req.body.crmExperience,
                    designTools: req.body.designTools ? (Array.isArray(req.body.designTools) ? req.body.designTools : [req.body.designTools]) : [],
                    marketingMaterials: req.body.marketingMaterials,
                    englishProficiency: req.body.englishProficiency,
                    stakeholderCommunication: req.body.stakeholderCommunication
                },
            roleSpecific: {
                transactionCoordination: req.body.transactionCoordination,
                timeManagement: req.body.timeManagement,
                careerGoals: req.body.careerGoals,
                managementExperience: req.body.managementExperience,
                managementExample: req.body.managementExample || null
            },
            accommodations: req.body.accommodations || null,
            consent: {
                termsPrivacy: req.body.consentTermsPrivacy === 'on',
                consentedAt: new Date().toISOString()
            },
            availability: {
                timezone: req.body.timezone,
                usHoursOverlap: req.body.usHoursOverlap,
                hoursPerWeek: '40', // Full-time position
                startDate: req.body.startDate
            },
            rates: {
                expectedRate: null, // Compensation is now in job description ($6-7/hour)
                currencyPreference: 'USD' // Always USD
            },
            videos: {
                video1: req.files?.video1 ? req.files.video1[0].filename : null
            },
            documents: {
                resume: req.files?.resume ? req.files.resume[0].filename : null
            },
            portfolio: req.files?.portfolioFiles ? req.files.portfolioFiles.map(file => file.filename) : [],
            fitAssessment: {
                communicationPreference: req.body.communicationPreference,
                timeManagement: req.body.timeManagement, // Combined with difficultSituation
                careerGoals: req.body.careerGoals
            }
        };

        // Save to JSON file
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const dataFile = path.join(dataDir, 'applications.json');
        let applications = [];
        
        if (fs.existsSync(dataFile)) {
            try {
            const fileContent = fs.readFileSync(dataFile, 'utf8');
                if (fileContent && fileContent.trim() !== '') {
            applications = JSON.parse(fileContent);
                    if (!Array.isArray(applications)) {
                        console.warn('Applications file is not an array, resetting');
                        applications = [];
                    }
                }
            } catch (parseError) {
                console.error('Error parsing applications file:', parseError);
                applications = [];
            }
        }
        
        applications.push(applicationData);
        
        // Write with error handling
        try {
            fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2), 'utf8');
            console.log(`✅ Application saved: ${applicationData.id}`);
            console.log(`   Name: ${applicationData.personalInfo?.fullName}`);
            console.log(`   Email: ${applicationData.personalInfo?.email}`);
            console.log(`   Total applications: ${applications.length}`);
            console.log(`   File location: ${dataFile}`);
            console.log(`   File size: ${fs.statSync(dataFile).size} bytes`);
            
            // Verify it was written correctly
            const verifyContent = fs.readFileSync(dataFile, 'utf8');
            const verifyApps = JSON.parse(verifyContent);
            if (verifyApps.length !== applications.length) {
                console.error(`⚠️ WARNING: File write verification failed! Expected ${applications.length}, got ${verifyApps.length}`);
            }
        } catch (writeError) {
            console.error('❌ CRITICAL: Failed to write application file:', writeError);
            throw writeError;
        }

        // Generate PDF and send email notifications (async, don't block response)
        (async () => {
            try {
                // Generate PDF
                console.log('📄 Generating PDF for application...');
                const pdfBuffer = await generateApplicationPDF(applicationData);
                console.log('✅ PDF generated successfully');
                
                // Email to hiring manager with PDF attachment
                const managerSubject = `New Application: ${applicationData.personalInfo?.fullName || 'Unknown'}`;
                const managerHtml = `
                    <h2>New Application Received</h2>
                    <p><strong>Name:</strong> ${applicationData.personalInfo?.fullName || 'N/A'}</p>
                    <p><strong>Email:</strong> ${applicationData.personalInfo?.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${applicationData.personalInfo?.phoneFull || (applicationData.personalInfo?.countryCode ? applicationData.personalInfo.countryCode + ' ' : '') + (applicationData.personalInfo?.phone || 'N/A')}</p>
                    <p><strong>Location:</strong> ${applicationData.personalInfo?.location || 'N/A'}</p>
                    <p><strong>Experience:</strong> ${applicationData.experience?.marketingDesignExperience || 'N/A'}</p>
                    <p><strong>Application ID:</strong> ${applicationData.id}</p>
                    <p><strong>Submitted:</strong> ${new Date(applicationData.submittedAt).toLocaleString()}</p>
                    <p><strong>📎 Full application details attached as PDF</strong></p>
                    <p><a href="${process.env.APP_URL || 'http://localhost:3000'}/admin.html">View in Admin Dashboard</a></p>
                `;
                await sendEmailWithPDF(
                    emailConfig.to, 
                    managerSubject, 
                    managerHtml, 
                    managerHtml.replace(/<[^>]*>/g, ''),
                    pdfBuffer,
                    applicationData.personalInfo?.fullName || 'Unknown'
                );

                // Confirmation email to candidate (no PDF needed)
                const candidateSubject = 'Application Received - Commercial Real Estate Brokerage';
                const candidateHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #1a3d5c;">Thank You for Your Application</h2>
                        <p>Dear ${applicationData.personalInfo?.fullName || 'Applicant'},</p>
                        <p>We have successfully received your application for the <strong>Director - Marketing & Operations</strong> position.</p>
                        <p><strong>Application ID:</strong> ${applicationData.id}</p>
                        <p><strong>Submitted:</strong> ${new Date(applicationData.submittedAt).toLocaleString()}</p>
                        <h3 style="color: #1a3d5c; margin-top: 30px;">What Happens Next?</h3>
                        <ul>
                            <li>Our team will review your application within the next few business days</li>
                            <li>If your qualifications match our needs, we'll contact you via email to schedule an interview</li>
                            <li>Please check your email regularly, including your spam folder</li>
                            <li>You can expect to hear from us within 1-2 weeks</li>
                        </ul>
                        <p style="margin-top: 30px;">If you have any questions, we will contact you via the email address you provided in your application.</p>
                        <p style="margin-top: 30px; color: #666; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
                    </div>
                `;
                await sendEmail(applicationData.personalInfo?.email, candidateSubject, candidateHtml, candidateHtml.replace(/<[^>]*>/g, ''));
            } catch (emailError) {
                console.error('Error generating PDF or sending emails:', emailError);
                // Try to send email without PDF as fallback
                try {
                    const managerSubject = `New Application: ${applicationData.personalInfo?.fullName || 'Unknown'}`;
                    const managerHtml = `
                        <h2>New Application Received</h2>
                        <p><strong>Name:</strong> ${applicationData.personalInfo?.fullName || 'N/A'}</p>
                        <p><strong>Email:</strong> ${applicationData.personalInfo?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${applicationData.personalInfo?.phoneFull || 'N/A'}</p>
                        <p><strong>Location:</strong> ${applicationData.personalInfo?.location || 'N/A'}</p>
                        <p><strong>Application ID:</strong> ${applicationData.id}</p>
                        <p><strong>Submitted:</strong> ${new Date(applicationData.submittedAt).toLocaleString()}</p>
                        <p><strong>⚠️ PDF generation failed, but application was saved.</strong></p>
                    `;
                    await sendEmail(emailConfig.to, managerSubject, managerHtml, managerHtml.replace(/<[^>]*>/g, ''));
                } catch (fallbackError) {
                    console.error('Fallback email also failed:', fallbackError);
                }
            }
        })().catch(err => {
            console.error('Error in email process:', err);
            // Don't fail the request if email fails
        });

        res.json({
            success: true,
            message: 'Application submitted successfully!',
            applicationId: applicationData.id
        });
    } catch (error) {
        console.error('❌ Error processing application:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error submitting application. Please try again.',
            error: error.message
        });
    }
});

// Health check endpoint (also used for keep-alive)
app.get('/api/health', (req, res) => {
    const dataFile = path.join(__dirname, 'data', 'applications.json');
    const dataDir = path.join(__dirname, 'data');
    
    const info = {
        server: 'running',
        timestamp: new Date().toISOString(),
        dataDirectory: {
            exists: fs.existsSync(dataDir),
            path: dataDir
        },
        dataFile: {
            exists: fs.existsSync(dataFile),
            path: dataFile,
            size: fs.existsSync(dataFile) ? fs.statSync(dataFile).size : 0
        },
        applications: {
            count: 0
        }
    };
    
    if (fs.existsSync(dataFile)) {
        try {
            const content = fs.readFileSync(dataFile, 'utf8');
            if (content && content.trim()) {
                const apps = JSON.parse(content);
                info.applications.count = Array.isArray(apps) ? apps.length : 0;
                if (apps.length > 0) {
                    info.applications.latest = {
                        id: apps[apps.length - 1].id,
                        name: apps[apps.length - 1].personalInfo?.fullName,
                        email: apps[apps.length - 1].personalInfo?.email,
                        submittedAt: apps[apps.length - 1].submittedAt
                    };
                }
            }
        } catch (e) {
            info.error = e.message;
        }
    }
    
    res.json(info);
});

// Keep-alive endpoint (simple ping to prevent sleep)
app.get('/ping', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all applications (admin endpoint)
app.get('/api/applications', (req, res) => {
    try {
        const dataFile = path.join(__dirname, 'data', 'applications.json');
        
        // Ensure data directory exists
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf8');
            // Handle empty file
            if (!fileContent || fileContent.trim() === '') {
                console.log('Applications file is empty, returning empty array');
                return res.json([]);
            }
            const applications = JSON.parse(fileContent);
            // Ensure it's an array
            const appsArray = Array.isArray(applications) ? applications : [];
            console.log(`Returning ${appsArray.length} applications`);
            res.setHeader('Content-Type', 'application/json');
            res.json(appsArray);
        } else {
            console.log('Applications file does not exist, returning empty array');
            // Create empty file
            fs.writeFileSync(dataFile, '[]', 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading applications:', error);
        res.status(500).setHeader('Content-Type', 'application/json');
        res.json({ error: 'Error retrieving applications', message: error.message });
    }
});

// Get a specific application by ID
app.get('/api/applications/:id', (req, res) => {
    try {
        const dataFile = path.join(__dirname, 'data', 'applications.json');
        
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf8');
            const applications = JSON.parse(fileContent);
            const application = applications.find(app => app.id === req.params.id);
            
            if (application) {
                res.json(application);
            } else {
                res.status(404).json({ error: 'Application not found' });
            }
        } else {
            res.status(404).json({ error: 'Application not found' });
        }
    } catch (error) {
        console.error('Error reading application:', error);
        res.status(500).json({ error: 'Error retrieving application' });
    }
});

// Serve video files
app.get('/api/videos/:filename', (req, res) => {
    const videoPath = path.join(__dirname, 'uploads', 'videos', req.params.filename);
    
    if (fs.existsSync(videoPath)) {
        res.sendFile(videoPath);
    } else {
        res.status(404).json({ error: 'Video not found' });
    }
});

// Serve document files
app.get('/api/documents/:filename', (req, res) => {
    const docPath = path.join(__dirname, 'uploads', 'documents', req.params.filename);
    
    if (fs.existsSync(docPath)) {
        res.sendFile(docPath);
    } else {
        res.status(404).json({ error: 'Document not found' });
    }
});

// Serve portfolio files
app.get('/api/portfolio/:filename', (req, res) => {
    const portfolioPath = path.join(__dirname, 'uploads', 'portfolio', req.params.filename);
    
    if (fs.existsSync(portfolioPath)) {
        res.sendFile(portfolioPath);
    } else {
        res.status(404).json({ error: 'Portfolio file not found' });
    }
});

// Update application rating
app.post('/api/applications/:id/rating', (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const dataFile = path.join(__dirname, 'data', 'applications.json');
        
        if (!fs.existsSync(dataFile)) {
            return res.status(404).json({ error: 'No applications found' });
        }
        
        let applications = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        const appIndex = applications.findIndex(app => app.id === id);
        
        if (appIndex === -1) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        applications[appIndex].rating = parseInt(rating);
        fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ error: 'Error updating rating' });
    }
});

// Update application notes
app.post('/api/applications/:id/notes', (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const dataFile = path.join(__dirname, 'data', 'applications.json');
        
        if (!fs.existsSync(dataFile)) {
            return res.status(404).json({ error: 'No applications found' });
        }
        
        let applications = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        const appIndex = applications.findIndex(app => app.id === id);
        
        if (appIndex === -1) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        applications[appIndex].notes = notes;
        fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating notes:', error);
        res.status(500).json({ error: 'Error updating notes' });
    }
});

// Update application status
app.post('/api/applications/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const dataFile = path.join(__dirname, 'data', 'applications.json');
        
        if (!fs.existsSync(dataFile)) {
            return res.status(404).json({ error: 'No applications found' });
        }
        
        let applications = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        const appIndex = applications.findIndex(app => app.id === id);
        
        if (appIndex === -1) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        applications[appIndex].status = status;
        fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Error updating status' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size is too large. Maximum size is 100MB.'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: error.message || 'An error occurred'
    });
});

app.listen(PORT, () => {
    console.log(`✓ Server is running on http://localhost:${PORT}`);
    console.log(`✓ Application form available at http://localhost:${PORT}`);
    console.log(`✓ Admin dashboard available at http://localhost:${PORT}/admin.html`);
    console.log(`\nTo deploy, push to GitHub and connect to Railway or Render`);
});
