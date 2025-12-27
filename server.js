const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');

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
        } else if (file.fieldname === 'resume' || file.fieldname === 'coverLetter') {
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
        } else if (file.fieldname === 'coverLetter') {
            prefix = 'coverletter-';
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

// Send email function
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
        if (file.fieldname === 'resume' || file.fieldname === 'coverLetter') {
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

// Serve the application form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/api/submit-application', upload.fields([
    { name: 'video1', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
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
                linkedin: req.body.linkedin || null
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
                transactionCoordination: req.body.transactionCoordination, // Combined with systemsWorkflows
                whyHireYou: req.body.careerGoals // Combined with careerGoals
            },
            availability: {
                timezone: req.body.timezone,
                        usHoursOverlap: req.body.usHoursOverlap,
                        hoursPerWeek: '40', // Full-time position
                        startDate: req.body.startDate,
                        workEnvironment: req.body.workEnvironment
            },
            rates: {
                expectedRate: req.body.expectedRate,
                        currencyPreference: 'USD' // Always USD
                    },
            videos: {
                video1: req.files?.video1 ? req.files.video1[0].filename : null
            },
            documents: {
                resume: req.files?.resume ? req.files.resume[0].filename : null,
                coverLetter: req.files?.coverLetter ? req.files.coverLetter[0].filename : null
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

        // Send email notifications (async, don't block response)
        (async () => {
            // Email to hiring manager
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
                <p><a href="${process.env.APP_URL || 'http://localhost:3000'}/admin.html">View in Admin Dashboard</a></p>
            `;
            await sendEmail(emailConfig.to, managerSubject, managerHtml, managerHtml.replace(/<[^>]*>/g, ''));

            // Confirmation email to candidate
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
        })().catch(err => {
            console.error('Error sending emails:', err);
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

// Diagnostic endpoint
app.get('/api/health', (req, res) => {
    const dataFile = path.join(__dirname, 'data', 'applications.json');
    const dataDir = path.join(__dirname, 'data');
    
    const info = {
        server: 'running',
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
