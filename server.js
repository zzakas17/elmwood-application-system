const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

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
    try {
        const applicationData = {
            id: Date.now().toString(),
            submittedAt: new Date().toISOString(),
            personalInfo: {
                fullName: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone,
                location: req.body.location
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
                stakeholderCommunication: req.body.stakeholderCommunication,
                internetSpeed: req.body.internetSpeed,
                hasBackupPower: req.body.hasBackupPower === 'yes'
            },
            roleSpecific: {
                transactionCoordination: req.body.transactionCoordination,
                systemsWorkflows: req.body.systemsWorkflows,
                complexDeal: req.body.complexDeal,
                whyHireYou: req.body.whyHireYou
            },
            availability: {
                timezone: req.body.timezone,
                usHoursOverlap: req.body.usHoursOverlap,
                hoursPerWeek: req.body.hoursPerWeek,
                startDate: req.body.startDate,
                workEnvironment: req.body.workEnvironment
            },
            rates: {
                expectedRate: req.body.expectedRate,
                currencyPreference: req.body.currencyPreference
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
                difficultSituation: req.body.difficultSituation,
                dealWithPressure: req.body.dealWithPressure,
                communicationPreference: req.body.communicationPreference,
                timeManagement: req.body.timeManagement,
                attentionToDetail: req.body.attentionToDetail,
                careerGoals: req.body.careerGoals
            }
        };

        // Save to JSON file
        const dataFile = path.join(__dirname, 'data', 'applications.json');
        let applications = [];
        
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf8');
            applications = JSON.parse(fileContent);
        }
        
        applications.push(applicationData);
        fs.writeFileSync(dataFile, JSON.stringify(applications, null, 2));

        res.json({
            success: true,
            message: 'Application submitted successfully!',
            applicationId: applicationData.id
        });
    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application. Please try again.'
        });
    }
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
