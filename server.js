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
const dirs = ['uploads', 'uploads/videos', 'data'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|mov|avi|wmv|webm/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only video files are allowed (mp4, mov, avi, wmv, webm)'));
        }
    }
});

// Serve the application form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/api/submit-application', upload.fields([
    { name: 'video1', maxCount: 1 },
    { name: 'video2', maxCount: 1 }
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
            experience: {
                yearsOfExperience: req.body.yearsOfExperience,
                creExperience: req.body.creExperience,
                previousRole: req.body.previousRole,
                tools: req.body.tools ? req.body.tools.split(',').map(s => s.trim()) : [],
                strengths: req.body.strengths ? req.body.strengths.split(',').map(s => s.trim()) : []
            },
            availability: {
                timezone: req.body.timezone,
                hoursPerWeek: req.body.hoursPerWeek,
                startDate: req.body.startDate
            },
            rates: {
                expectedRate: req.body.expectedRate,
                currencyPreference: req.body.currencyPreference
            },
            technical: {
                englishProficiency: req.body.englishProficiency,
                internetSpeed: req.body.internetSpeed,
                hasBackupPower: req.body.hasBackupPower === 'yes',
                crmExperience: req.body.crmExperience
            },
            additional: {
                whyHireYou: req.body.whyHireYou,
                challenges: req.body.challenges,
                dealExample: req.body.dealExample,
                marketingExp: req.body.marketingExp ? req.body.marketingExp.split(',').map(s => s.trim()) : [],
                documentTypes: req.body.documentTypes ? req.body.documentTypes.split(',').map(s => s.trim()) : []
            },
            videos: {
                video1: req.files?.video1 ? req.files.video1[0].filename : null,
                video2: req.files?.video2 ? req.files.video2[0].filename : null
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
        
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf8');
            const applications = JSON.parse(fileContent);
            res.json(applications);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading applications:', error);
        res.status(500).json({ error: 'Error retrieving applications' });
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
