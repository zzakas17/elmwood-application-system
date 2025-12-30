// Portal Utilities - Shared across all application steps
// Progress tracking, data persistence, and navigation

const PortalUtils = {
    STORAGE_KEY: 'applicationData',
    PROGRESS_KEY: 'applicationProgress',
    
    // Step definitions
    STEPS: [
        { id: 1, title: 'Basic Information', url: 'application-step1.html', sections: ['personal', 'education'] },
        { id: 2, title: 'Experience & Skills', url: 'application-step2.html', sections: ['experience', 'skills', 'availability'] },
        { id: 3, title: 'Assessment', url: 'application-step3.html', sections: ['assessment', 'additional'] },
        { id: 4, title: 'Documents & Media', url: 'application-step4.html', sections: ['documents', 'portfolio', 'video'] },
        { id: 5, title: 'Review & Submit', url: 'application-review.html', sections: ['review'] }
    ],
    
    // Save form data to localStorage
    saveData(formData) {
        try {
            const data = this.getData();
            Object.assign(data, formData);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            this.updateProgress();
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    },
    
    // Get all saved data
    getData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading data:', e);
            return {};
        }
    },
    
    // Clear all saved data
    clearData() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.PROGRESS_KEY);
    },
    
    // Update progress tracking
    updateProgress() {
        const data = this.getData();
        const totalFields = this.getTotalRequiredFields();
        const completedFields = this.getCompletedFields(data);
        const progress = Math.round((completedFields / totalFields) * 100);
        
        localStorage.setItem(this.PROGRESS_KEY, JSON.stringify({
            percentage: progress,
            completed: completedFields,
            total: totalFields,
            lastUpdated: new Date().toISOString()
        }));
        
        return progress;
    },
    
    // Get progress
    getProgress() {
        try {
            const progress = localStorage.getItem(this.PROGRESS_KEY);
            return progress ? JSON.parse(progress) : { percentage: 0, completed: 0, total: 0 };
        } catch (e) {
            return { percentage: 0, completed: 0, total: 0 };
        }
    },
    
    // Get total required fields (approximate)
    getTotalRequiredFields() {
        return 45; // Approximate count of required fields across all steps
    },
    
    // Count completed required fields
    getCompletedFields(data) {
        let count = 0;
        const required = [
            'fullName', 'email', 'phone', 'location', 'preferredCommunication',
            'highestEducation', 'marketingDesignExperience', 'creExperience',
            'previousRole', 'marketingExperience', 'transferableExperience',
            'microsoftOffice', 'crmSystems', 'crmExperience', 'designTools',
            'marketingMaterials', 'timezone', 'usHoursOverlap', 'startDate',
            'transactionCoordination', 'timeManagement', 'careerGoals',
            'managementExperience'
        ];
        
        required.forEach(field => {
            if (data[field] && String(data[field]).trim() !== '') {
                count++;
            }
        });
        
        // Check checkboxes
        if (data.designTools && Array.isArray(data.designTools) && data.designTools.length > 0) {
            count++;
        }
        
        // Check files (they won't be in localStorage, but we track if step was visited)
        if (data.stepsCompleted) {
            if (data.stepsCompleted.includes(4)) count += 2; // Resume + Video
        }
        
        return count;
    },
    
    // Mark step as completed
    markStepCompleted(stepId) {
        const data = this.getData();
        if (!data.stepsCompleted) {
            data.stepsCompleted = [];
        }
        if (!data.stepsCompleted.includes(stepId)) {
            data.stepsCompleted.push(stepId);
            this.saveData(data);
        }
    },
    
    // Check if step is completed
    isStepCompleted(stepId) {
        const data = this.getData();
        return data.stepsCompleted && data.stepsCompleted.includes(stepId);
    },
    
    // Get current step from URL
    getCurrentStep() {
        const path = window.location.pathname;
        for (const step of this.STEPS) {
            if (path.includes(step.url)) {
                return step.id;
            }
        }
        return 1;
    },
    
    // Navigate to step
    navigateToStep(stepId) {
        const step = this.STEPS.find(s => s.id === stepId);
        if (step) {
            window.location.href = step.url;
        }
    },
    
    // Get next step
    getNextStep(currentStepId) {
        const currentIndex = this.STEPS.findIndex(s => s.id === currentStepId);
        if (currentIndex < this.STEPS.length - 1) {
            return this.STEPS[currentIndex + 1];
        }
        return null;
    },
    
    // Get previous step
    getPreviousStep(currentStepId) {
        const currentIndex = this.STEPS.findIndex(s => s.id === currentStepId);
        if (currentIndex > 0) {
            return this.STEPS[currentIndex - 1];
        }
        return null;
    },
    
    // Auto-save form data
    setupAutoSave(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                const formData = this.serializeForm(form);
                this.saveData(formData);
                this.showSaveIndicator();
            });
            
            input.addEventListener('blur', () => {
                const formData = this.serializeForm(form);
                this.saveData(formData);
            });
        });
    },
    
    // Serialize form to object
    serializeForm(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    },
    
    // Populate form from saved data
    populateForm(form, data) {
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    if (Array.isArray(data[key])) {
                        field.checked = data[key].includes(field.value);
                    } else {
                        field.checked = data[key] === field.value;
                    }
                } else if (field.type === 'radio') {
                    field.checked = field.value === data[key];
                } else {
                    field.value = data[key];
                }
            }
        });
    },
    
    // Show save indicator
    showSaveIndicator() {
        const indicator = document.getElementById('saveIndicator');
        if (indicator) {
            indicator.textContent = 'Saved';
            indicator.style.display = 'block';
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    indicator.style.display = 'none';
                    indicator.style.opacity = '1';
                }, 300);
            }, 2000);
        }
    },
    
    // Update progress bar
    updateProgressBar() {
        const progress = this.getProgress();
        const fill = document.getElementById('progressFill');
        const percentage = document.getElementById('progressPercentage');
        
        if (fill) {
            fill.style.width = progress.percentage + '%';
        }
        
        if (percentage) {
            percentage.textContent = progress.percentage + '% Complete';
        }
    },
    
    // Initialize progress tracking
    initProgress() {
        this.updateProgress();
        this.updateProgressBar();
        
        // Update progress bar periodically
        setInterval(() => {
            this.updateProgress();
            this.updateProgressBar();
        }, 2000);
    }
};

// Make available globally
window.PortalUtils = PortalUtils;

