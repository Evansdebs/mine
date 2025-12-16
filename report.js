// Define subjects for Primary School (Corrected)
const subjects = [
    "English Language", 
    "Mathematics", 
    "Science", 
    "RME", 
    "History", 
    "Creative Arts",
    "Computing",
    "French", 
    "Asante Twi",
   "Career Technlogy"
];

// Primary School Grading System - BASED ON TOTAL SCORE
const gradingSystem = [
    { min: 80, max: 100, grade: "A", remark: "ADVANCE" },
    { min: 68, max: 79, grade: "P", remark: "PROFICIENCY" },
    { min: 54, max: 67, grade: "AP", remark: "APPROACHING PROFICIENCY" },
    { min: 40, max: 53, grade: "D", remark: "DEVELOPING" },
    { min: 0, max: 39, grade: "B", remark: "BEGINNER" }
];

// Initialize data
let students = JSON.parse(localStorage.getItem('students')) || [];
let scores = JSON.parse(localStorage.getItem('scores')) || {};
let schoolInfo = JSON.parse(localStorage.getItem('schoolInfo')) || {
    academicYear: "2024/2025",
    term: "1",
    closingDate: "19th DEC, 2024",
    reopeningDate: "13th JAN, 2025",
    numberOnRoll: "18",
    basicLevel: "6",
    schoolLogo: null
};
let parentContacts = JSON.parse(localStorage.getItem('parentContacts')) || {};
let studentReportDetails = JSON.parse(localStorage.getItem('studentReportDetails')) || {};

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const app = document.getElementById('app');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const notificationArea = document.getElementById('notification-area');

// School Info Elements
const academicYearInput = document.getElementById('academicYear');
const termSelect = document.getElementById('term');
const closingDateInput = document.getElementById('closingDate');
const reopeningDateInput = document.getElementById('reopeningDate');
const numberOnRollInput = document.getElementById('numberOnRoll');
const basicLevelSelect = document.getElementById('basicLevel');
const saveSchoolInfoBtn = document.getElementById('saveSchoolInfo');
const logoUpload = document.getElementById('logoUpload');
const logoPreview = document.getElementById('logoPreview');
const exportDataBtn = document.getElementById('exportData');
const importDataBtn = document.getElementById('importData');
const importFileInput = document.getElementById('importFile');

// Student Management Elements
const studentNameInput = document.getElementById('studentName');
const studentClassSelect = document.getElementById('studentClass');
const addStudentBtn = document.getElementById('addStudent');
const studentsList = document.getElementById('studentsList');
const studentSearchInput = document.getElementById('studentSearch');

// Score Entry Elements
const scoreClassSelect = document.getElementById('scoreClass');
const subjectsGrid = document.getElementById('subjectsGrid');
const scoreEntryCard = document.getElementById('scoreEntryCard');
const currentSubject = document.getElementById('currentSubject');
const scoreEntry = document.getElementById('scoreEntry');
const saveScoresBtn = document.getElementById('saveScores');
const cancelScoresBtn = document.getElementById('cancelScores');

// Individual Report Elements
const individualClassSelect = document.getElementById('individualClass');
const generateAllReportsBtn = document.getElementById('generateAllReports');
const bulkDownloadReportsBtn = document.getElementById('bulkDownloadReports');
const studentsReportsGrid = document.getElementById('studentsReportsGrid');
const individualReportContainer = document.getElementById('individualReportContainer');

// Performance Elements
const performanceClassSelect = document.getElementById('performanceClass');
const generatePerformanceBtn = document.getElementById('generatePerformance');
const performanceContainer = document.getElementById('performanceContainer');

// WhatsApp Integration Elements
const whatsappClassSelect = document.getElementById('whatsappClass');
const whatsappStudentSelect = document.getElementById('whatsappStudent');
const parentNameInput = document.getElementById('parentName');
const whatsappNumberInput = document.getElementById('whatsappNumber');
const saveParentInfoBtn = document.getElementById('saveParentInfo');
const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
const bulkSendWhatsAppBtn = document.getElementById('bulkSendWhatsApp');
const parentsList = document.getElementById('parentsList');
const bulkSendStatus = document.getElementById('bulkSendStatus');

// Edit Modal Elements
const editReportModal = document.getElementById('editReportModal');
const editModalTitle = document.getElementById('editModalTitle');
const editAttendanceInput = document.getElementById('editAttendance');
const editConductInput = document.getElementById('editConduct');
const editInterestInput = document.getElementById('editInterest');
const editTeacherRemarksInput = document.getElementById('editTeacherRemarks');
const closeEditModalBtn = document.getElementById('closeEditModal');
const cancelEditBtn = document.getElementById('cancelEdit');
const saveEditBtn = document.getElementById('saveEdit');

// Subject icons for Primary School
const subjectIcons = {
    "English Language": "fa-language",
    "Mathematics": "fa-calculator",
    "Science": "fa-flask",
    "RME": "fa-pray",
    "History": "fa-history",
    "Creative Arts": "fa-palette",
    "Computing": "fa-laptop-code",
    "French": "fa-flag",
    "Asante Twi": "fa-comments",
    "Career Technology": "fa-tools"
};

// Initialize the app
function init() {
    // Show splash screen for 2 seconds
    setTimeout(() => {
        splashScreen.style.display = 'none';
        app.style.display = 'block';
    }, 2000);

    // Load school info
    loadSchoolInfo();
    
    // Initialize subjects grid
    renderSubjectsGrid();
    
    // Initialize students list
    renderStudentsList();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Save school info
    saveSchoolInfoBtn.addEventListener('click', saveSchoolInfo);

    // Logo upload
    logoUpload.addEventListener('change', handleLogoUpload);

    // Class selectors
    scoreClassSelect.addEventListener('change', renderSubjectsGrid);
    individualClassSelect.addEventListener('change', () => {
        studentsReportsGrid.style.display = 'none';
        bulkDownloadReportsBtn.style.display = 'none';
    });
    performanceClassSelect.addEventListener('change', () => {
        performanceContainer.innerHTML = '';
    });
    whatsappClassSelect.addEventListener('change', () => {
        updateWhatsappStudentSelect();
        renderParentsList();
    });

    // WhatsApp student select change
    whatsappStudentSelect.addEventListener('change', loadParentInfo);

    // Add student
    addStudentBtn.addEventListener('click', addStudent);

    // Student search
    studentSearchInput.addEventListener('input', renderStudentsList);

    // Save scores
    saveScoresBtn.addEventListener('click', saveScores);
    cancelScoresBtn.addEventListener('click', cancelScoreEntry);

    // Generate all reports
    generateAllReportsBtn.addEventListener('click', generateAllClassReports);
    
    // Bulk download reports
    bulkDownloadReportsBtn.addEventListener('click', bulkDownloadAllReports);

    // Generate performance analysis
    generatePerformanceBtn.addEventListener('click', generatePerformanceAnalysis);

    // WhatsApp integration
    saveParentInfoBtn.addEventListener('click', saveParentInfo);
    sendWhatsAppBtn.addEventListener('click', sendWhatsAppReport);
    bulkSendWhatsAppBtn.addEventListener('click', bulkSendWhatsAppReports);

    // Data export/import
    exportDataBtn.addEventListener('click', exportAllData);
    importDataBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importData);
    
    // Edit modal
    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    saveEditBtn.addEventListener('click', saveReportDetails);
    
    // Handle custom dropdown options in edit modal
    [editConductInput, editInterestInput, editTeacherRemarksInput].forEach(select => {
        select.addEventListener('change', function() {
            if (this.value === 'Custom...') {
                const customValue = prompt('Enter custom value:');
                if (customValue) {
                    this.innerHTML += `<option value="${customValue}">${customValue}</option>`;
                    this.value = customValue;
                } else {
                    this.value = '';
                }
            }
        });
    });
    
    // Close modal when clicking outside
    editReportModal.addEventListener('click', (e) => {
        if (e.target === editReportModal) {
            closeEditModal();
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notificationArea.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationArea.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle logo upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoData = e.target.result;
            schoolInfo.schoolLogo = logoData;
            
            // Update preview
            logoPreview.innerHTML = `<img src="${logoData}" alt="school logo">`;
            
            // Save to localStorage
            localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));
            showNotification('School logo uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Switch tabs
function switchTab(tabId) {
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        }
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });

    // Update WhatsApp student select when switching to WhatsApp tab
    if (tabId === 'whatsapp') {
        updateWhatsappStudentSelect();
        renderParentsList();
    }
}

// Load school information
function loadSchoolInfo() {
    academicYearInput.value = schoolInfo.academicYear;
    termSelect.value = schoolInfo.term;
    closingDateInput.value = schoolInfo.closingDate;
    reopeningDateInput.value = schoolInfo.reopeningDate;
    numberOnRollInput.value = schoolInfo.numberOnRoll;
    basicLevelSelect.value = schoolInfo.basicLevel;

    // Load logo
    if (schoolInfo.schoolLogo) {
        logoPreview.innerHTML = `<img src="${schoolInfo.schoolLogo}" alt="school logo">`;
    }
}

// Save school information
function saveSchoolInfo() {
    schoolInfo = {
        academicYear: academicYearInput.value,
        term: termSelect.value,
        closingDate: closingDateInput.value,
        reopeningDate: reopeningDateInput.value,
        numberOnRoll: numberOnRollInput.value,
        basicLevel: basicLevelSelect.value,
        schoolLogo: schoolInfo.schoolLogo
    };
    
    localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));
    showNotification('School information saved successfully!', 'success');
}

// Add student
function addStudent() {
    const name = studentNameInput.value.trim();
    const studentClass = studentClassSelect.value;
    
    if (!name) {
        showNotification('Please enter a student name', 'error');
        return;
    }

    const student = {
        id: Date.now(),
        name: name,
        class: studentClass
    };

    students.push(student);
    saveStudents();
    renderStudentsList();
    studentNameInput.value = '';
    studentNameInput.focus();
    showNotification('Student added successfully!', 'success');
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    const newName = prompt('Edit student name:', student.name);
    if (newName && newName.trim() !== '') {
        student.name = newName.trim();
        saveStudents();
        renderStudentsList();
        showNotification('Student updated successfully!', 'success');
    }
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student? This will also delete all their scores, parent contacts, and report details.')) {
        students = students.filter(student => student.id !== id);
        
        // Remove student scores from all subjects
        Object.keys(scores).forEach(subject => {
            if (scores[subject][id]) {
                delete scores[subject][id];
            }
        });
        
        // Remove parent contacts
        if (parentContacts[id]) {
            delete parentContacts[id];
            saveParentContacts();
        }
        
        // Remove report details
        if (studentReportDetails[id]) {
            delete studentReportDetails[id];
            saveReportDetailsToStorage();
        }
        
        saveStudents();
        saveScoresToStorage();
        renderStudentsList();
        renderParentsList();
        showNotification('Student deleted successfully!', 'success');
    }
}

// Save students to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Save scores to localStorage
function saveScoresToStorage() {
    localStorage.setItem('scores', JSON.stringify(scores));
}

// Save parent contacts to localStorage
function saveParentContacts() {
    localStorage.setItem('parentContacts', JSON.stringify(parentContacts));
}

// Save report details to localStorage
function saveReportDetailsToStorage() {
    localStorage.setItem('studentReportDetails', JSON.stringify(studentReportDetails));
}

// Render students list
function renderStudentsList() {
    studentsList.innerHTML = '';
    
    const searchTerm = studentSearchInput.value.toLowerCase();
    let filteredStudents = students;
    
    if (searchTerm) {
        filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredStudents.length === 0) {
        studentsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-graduate"></i>
                <p>${searchTerm ? 'No students found matching your search' : 'No students added yet'}</p>
            </div>
        `;
        return;
    }

    filteredStudents.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        studentItem.innerHTML = `
            <div>
                <div class="student-name">${student.name}</div>
                <div class="student-class">${student.class}</div>
            </div>
            <div class="student-actions">
                <button class="btn btn-warning" onclick="editStudent(${student.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
        `;
        studentsList.appendChild(studentItem);
    });
}

// Update WhatsApp student select dropdown
function updateWhatsappStudentSelect() {
    const selectedClass = whatsappClassSelect.value;
    whatsappStudentSelect.innerHTML = '<option value="">-- Select a student --</option>';
    
    if (selectedClass) {
        const classStudents = students.filter(student => student.class === selectedClass);
        classStudents.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.name;
            whatsappStudentSelect.appendChild(option);
        });
    }
}

// Load parent information for selected student
function loadParentInfo() {
    const studentId = parseInt(whatsappStudentSelect.value);
    if (!studentId) {
        parentNameInput.value = '';
        whatsappNumberInput.value = '';
        return;
    }

    const parentInfo = parentContacts[studentId];
    if (parentInfo) {
        parentNameInput.value = parentInfo.name || '';
        whatsappNumberInput.value = parentInfo.phone || '';
    } else {
        parentNameInput.value = '';
        whatsappNumberInput.value = '';
    }
}

// Save parent information
function saveParentInfo() {
    const studentId = parseInt(whatsappStudentSelect.value);
    if (!studentId) {
        showNotification('Please select a student first.', 'error');
        return;
    }

    const parentName = parentNameInput.value.trim();
    const whatsappNumber = whatsappNumberInput.value.trim();

    if (!parentName) {
        showNotification('Please enter parent/guardian name.', 'error');
        return;
    }

    if (!whatsappNumber) {
        showNotification('Please enter WhatsApp number.', 'error');
        return;
    }

    // Basic phone number validation
    if (!whatsappNumber.startsWith('+')) {
        showNotification('Please include country code (e.g., +233XXXXXXXXX).', 'error');
        return;
    }

    parentContacts[studentId] = {
        name: parentName,
        phone: whatsappNumber,
        sent: false
    };

    saveParentContacts();
    renderParentsList();
    showNotification('Parent information saved successfully!', 'success');
}

// Render parents list
function renderParentsList() {
    parentsList.innerHTML = '';
    
    const selectedClass = whatsappClassSelect.value;
    if (!selectedClass) {
        parentsList.innerHTML = '<p>Please select a class first.</p>';
        return;
    }

    const classStudents = students.filter(student => student.class === selectedClass);
    if (classStudents.length === 0) {
        parentsList.innerHTML = '<p>No students found in this class.</p>';
        return;
    }

    let hasParents = false;
    classStudents.forEach(student => {
        const parentInfo = parentContacts[student.id];
        if (parentInfo) {
            hasParents = true;
            const parentItem = document.createElement('div');
            parentItem.className = 'parent-item';
            parentItem.innerHTML = `
                <div class="parent-info">
                    <div class="parent-name">${student.name}</div>
                    <div class="parent-phone">Parent: ${parentInfo.name} | ${parentInfo.phone}</div>
                </div>
                <div class="whatsapp-actions">
                    <span class="whatsapp-status ${parentInfo.sent ? 'status-sent' : 'status-pending'}">
                        ${parentInfo.sent ? '✓ Sent' : 'Pending'}
                    </span>
                    <button class="btn btn-whatsapp btn-send-individual" data-student-id="${student.id}">
                        <i class="fab fa-whatsapp"></i> Send
                    </button>
                </div>
            `;
            parentsList.appendChild(parentItem);
        }
    });

    if (!hasParents) {
        parentsList.innerHTML = '<p>No parent information saved for this class yet.</p>';
    } else {
        // Add event listeners to individual send buttons
        document.querySelectorAll('.btn-send-individual').forEach(button => {
            button.addEventListener('click', function() {
                const studentId = parseInt(this.getAttribute('data-student-id'));
                sendIndividualWhatsAppReport(studentId);
            });
        });
    }
}

// Render subjects grid
function renderSubjectsGrid() {
    subjectsGrid.innerHTML = '';
    
    const selectedClass = scoreClassSelect.value;
    if (!selectedClass) {
        subjectsGrid.innerHTML = '<p>Please select a class first</p>';
        return;
    }
    
    subjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.setAttribute('data-subject', subject);
        subjectCard.innerHTML = `
            <i class="fas ${subjectIcons[subject]}"></i>
            <h3>${subject}</h3>
            <p>Click to enter scores</p>
        `;
        subjectCard.addEventListener('click', () => openScoreEntry(subject));
        subjectsGrid.appendChild(subjectCard);
    });
}

// Calculate 50% of a score
function calculateFiftyPercent(score) {
    return Math.round((score / 100) * 50 * 10) / 10;
}

// Calculate total score from class score and exam score
function calculateTotalScore(classScore, examScore) {
    const classScore50 = calculateFiftyPercent(classScore);
    const examScore50 = calculateFiftyPercent(examScore);
    return Math.round((classScore50 + examScore50) * 10) / 10;
}

// Get grade for a score - BASED ON TOTAL SCORE (Corrected)
function getGrade(totalScore) {
    // Ensure totalScore is between 0-100
    if (totalScore < 0) totalScore = 0;
    if (totalScore > 100) totalScore = 100;
    
    for (const grade of gradingSystem) {
        if (totalScore >= grade.min && totalScore <= grade.max) {
            return grade;
        }
    }
    return gradingSystem[4]; // Return BEGINNER if no match
}

// Open score entry for a subject
function openScoreEntry(subject) {
    const selectedClass = scoreClassSelect.value;
    if (!selectedClass) {
        showNotification('Please select a class first', 'error');
        return;
    }

    if (students.length === 0) {
        showNotification('Please add students first', 'error');
        return;
    }

    const classStudents = students.filter(student => student.class === selectedClass);
    if (classStudents.length === 0) {
        showNotification(`No students found in ${selectedClass}`, 'error');
        return;
    }

    currentSubject.textContent = subject;
    scoreEntry.innerHTML = '';
    
    // Add header row
    const headerRow = document.createElement('div');
    headerRow.className = 'score-header';
    headerRow.innerHTML = `
        <div>Student Name</div>
        <div>Class Score (50%)</div>
        <div>Exam Score (50%)</div>
        <div>Total Score</div>
        <div>Grade</div>
    `;
    scoreEntry.appendChild(headerRow);
    
    classStudents.forEach(student => {
        const scoreRow = document.createElement('div');
        scoreRow.className = 'score-row';
        
        // Get existing scores if available
        const studentScores = scores[subject] && scores[subject][student.id] ? scores[subject][student.id] : { classScore: '', examScore: '' };
        const classScore = studentScores.classScore || '';
        const examScore = studentScores.examScore || '';
        
        let totalScore = '';
        let grade = '';
        
        // Calculate total and grade if both scores are available
        if (classScore !== '' && examScore !== '') {
            totalScore = calculateTotalScore(parseFloat(classScore), parseFloat(examScore));
            const gradeInfo = getGrade(totalScore);
            grade = gradeInfo.grade;
        }
        
        scoreRow.innerHTML = `
            <div class="student-name">${student.name}</div>
            <div>
                <input type="number" class="score-input class-score" min="0" max="100" 
                       value="${classScore}" 
                       data-student-id="${student.id}" 
                       placeholder="0-100" step="0.1">
            </div>
            <div>
                <input type="number" class="score-input exam-score" min="0" max="100" 
                       value="${examScore}" 
                       data-student-id="${student.id}" 
                       placeholder="0-100" step="0.1">
            </div>
            <div class="total-score-display">${totalScore !== '' ? totalScore : ''}</div>
            <div class="grade-display">${grade}</div>
        `;
        scoreEntry.appendChild(scoreRow);
        
        // Add event listeners for real-time calculation
        const classScoreInput = scoreRow.querySelector('.class-score');
        const examScoreInput = scoreRow.querySelector('.exam-score');
        
        const updateCalculations = () => {
            const classScoreVal = classScoreInput.value;
            const examScoreVal = examScoreInput.value;
            
            let total = '';
            let gradeText = '';
            
            if (classScoreVal !== '' && examScoreVal !== '') {
                total = calculateTotalScore(parseFloat(classScoreVal), parseFloat(examScoreVal));
                const gradeInfo = getGrade(total);
                gradeText = gradeInfo.grade;
                
                scoreRow.querySelector('.grade-display').className = `grade-display grade-${gradeInfo.grade}`;
            } else {
                scoreRow.querySelector('.grade-display').className = 'grade-display';
            }
            
            scoreRow.querySelector('.total-score-display').textContent = total !== '' ? total : '';
            scoreRow.querySelector('.grade-display').textContent = gradeText;
        };
        
        classScoreInput.addEventListener('input', updateCalculations);
        examScoreInput.addEventListener('input', updateCalculations);
    });

    scoreEntryCard.style.display = 'block';
    scoreEntryCard.scrollIntoView({ behavior: 'smooth' });
}

// Save scores for a subject - FIXED VERSION
function saveScores() {
    const subject = currentSubject.textContent;
    const classScoreInputs = document.querySelectorAll('.class-score');
    const examScoreInputs = document.querySelectorAll('.exam-score');
    
    if (!scores[subject]) {
        scores[subject] = {};
    }
    
    let hasValidScores = false;
    let hasInvalidScore = false;
    
    classScoreInputs.forEach((classInput, index) => {
        const studentId = parseInt(classInput.getAttribute('data-student-id'));
        const examInput = examScoreInputs[index];
        
        const classScore = classInput.value.trim();
        const examScore = examInput.value.trim();
        
        // Check if at least one score is provided
        if (classScore === '' && examScore === '') {
            // No scores for this student, skip
            return;
        }
        
        // Validate class score if provided
        if (classScore !== '') {
            const classScoreNum = parseFloat(classScore);
            if (isNaN(classScoreNum) || classScoreNum < 0 || classScoreNum > 100) {
                hasInvalidScore = true;
                classInput.style.borderColor = 'var(--danger)';
            } else {
                classInput.style.borderColor = '';
            }
        } else {
            classInput.style.borderColor = '';
        }
        
        // Validate exam score if provided
        if (examScore !== '') {
            const examScoreNum = parseFloat(examScore);
            if (isNaN(examScoreNum) || examScoreNum < 0 || examScoreNum > 100) {
                hasInvalidScore = true;
                examInput.style.borderColor = 'var(--danger)';
            } else {
                examInput.style.borderColor = '';
            }
        } else {
            examInput.style.borderColor = '';
        }
        
        // If no validation errors, save the scores
        if (!hasInvalidScore) {
            hasValidScores = true;
            
            // Initialize student scores if not exists
            if (!scores[subject][studentId]) {
                scores[subject][studentId] = { classScore: '', examScore: '', totalScore: '' };
            }
            
            // Update only the scores that are provided (don't overwrite existing ones with empty values)
            if (classScore !== '') {
                scores[subject][studentId].classScore = parseFloat(classScore);
            }
            
            if (examScore !== '') {
                scores[subject][studentId].examScore = parseFloat(examScore);
            }
            
            // Calculate total if both scores are available
            if (scores[subject][studentId].classScore !== '' && scores[subject][studentId].examScore !== '') {
                scores[subject][studentId].totalScore = calculateTotalScore(
                    scores[subject][studentId].classScore, 
                    scores[subject][studentId].examScore
                );
            } else {
                scores[subject][studentId].totalScore = '';
            }
        }
    });
    
    if (hasInvalidScore) {
        showNotification('Please enter valid scores between 0 and 100 for all students', 'error');
        return;
    }
    
    if (!hasValidScores) {
        showNotification('No scores to save. Please enter scores for at least one student.', 'warning');
        return;
    }
    
    saveScoresToStorage();
    showNotification(`Scores for ${subject} saved successfully!`, 'success');
    cancelScoreEntry();
}

// Cancel score entry
function cancelScoreEntry() {
    scoreEntryCard.style.display = 'none';
}

// Calculate student performance metrics
function calculateStudentPerformance(studentId) {
    const studentScores = [];
    
    // Collect all subject scores for the student
    subjects.forEach(subject => {
        if (scores[subject] && scores[subject][studentId]) {
            const subjectData = scores[subject][studentId];
            
            // Only include subjects where both scores are available
            if (subjectData.classScore !== '' && subjectData.examScore !== '') {
                const totalScore = calculateTotalScore(subjectData.classScore, subjectData.examScore);
                const gradeInfo = getGrade(totalScore);
                
                studentScores.push({
                    subject: subject,
                    totalScore: totalScore,
                    grade: gradeInfo.grade,
                    remark: gradeInfo.remark
                });
            }
        }
    });
    
    if (studentScores.length === 0) {
        return null; // No complete scores available
    }
    
    // Calculate average score
    const total = studentScores.reduce((sum, score) => sum + score.totalScore, 0);
    const average = total / studentScores.length;
    
    // Count grades
    const gradeCounts = {};
    studentScores.forEach(score => {
        gradeCounts[score.grade] = (gradeCounts[score.grade] || 0) + 1;
    });
    
    // Calculate overall grade based on average
    const overallGradeInfo = getGrade(average);
    
    return {
        studentId: studentId,
        average: average,
        overallGrade: overallGradeInfo.grade,
        overallRemark: overallGradeInfo.remark,
        gradeCounts: gradeCounts,
        totalSubjects: studentScores.length,
        scores: studentScores
    };
}

// Generate reports for all students in a class
function generateAllClassReports() {
    const selectedClass = individualClassSelect.value;
    
    if (!selectedClass) {
        showNotification('Please select a class first.', 'error');
        return;
    }

    const classStudents = students.filter(student => student.class === selectedClass);
    if (classStudents.length === 0) {
        showNotification(`No students found in ${selectedClass}`, 'error');
        return;
    }

    // Show the students grid
    studentsReportsGrid.style.display = 'grid';
    bulkDownloadReportsBtn.style.display = 'inline-block';
    
    // Clear existing content
    studentsReportsGrid.innerHTML = '';
    individualReportContainer.innerHTML = '';
    
    // Generate report cards for each student
    classStudents.forEach(student => {
        const reportCard = document.createElement('div');
        reportCard.className = 'student-report-card';
        reportCard.id = `report-card-${student.id}`;
        
        const performance = calculateStudentPerformance(student.id);
        const hasCompleteScores = performance !== null;
        const hasReportDetails = studentReportDetails[student.id] !== undefined;
        
        // Check if student has any scores at all
        let hasAnyScores = false;
        subjects.forEach(subject => {
            if (scores[subject] && scores[subject][student.id]) {
                hasAnyScores = true;
            }
        });
        
        reportCard.innerHTML = `
            <div class="student-report-header">
                <div class="student-report-name">${student.name}</div>
                <div class="student-report-status ${hasCompleteScores ? 'status-ready' : hasAnyScores ? 'status-pending' : 'status-pending'}">
                    <i class="fas ${hasCompleteScores ? 'fa-check-circle' : hasAnyScores ? 'fa-clock' : 'fa-clock'}"></i>
                    ${hasCompleteScores ? 'Ready' : hasAnyScores ? 'Partial Scores' : 'No Scores'}
                </div>
            </div>
            <div class="student-report-class">${student.class}</div>
            ${hasReportDetails ? '<div class="student-report-status status-ready"><i class="fas fa-edit"></i> Customized</div>' : ''}
            <div class="student-report-actions">
                <button class="btn edit-btn" onclick="openEditModal(${student.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn preview-btn" onclick="previewStudentReport(${student.id})">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button class="btn download-btn" onclick="downloadStudentReport(${student.id})" 
                        ${!hasCompleteScores ? 'disabled' : ''}>
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        `;
        
        studentsReportsGrid.appendChild(reportCard);
    });
    
    showNotification(`Generated ${classStudents.length} student reports for ${selectedClass}`, 'success');
}

// Open edit modal for a student
function openEditModal(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) {
        showNotification('Student not found.', 'error');
        return;
    }

    editModalTitle.textContent = `Edit Report Details - ${student.name}`;
    
    // Load existing details if available
    const details = studentReportDetails[studentId] || {};
    editAttendanceInput.value = details.attendance || '';
    editConductInput.value = details.conduct || '';
    editInterestInput.value = details.interest || '';
    editTeacherRemarksInput.value = details.teacherRemarks || '';
    
    // Store current student ID
    editReportModal.dataset.studentId = studentId;
    
    // Show modal
    editReportModal.style.display = 'flex';
}

// Close edit modal
function closeEditModal() {
    editReportModal.style.display = 'none';
    delete editReportModal.dataset.studentId;
}

// Save report details
function saveReportDetails() {
    const studentId = parseInt(editReportModal.dataset.studentId);
    if (!studentId) {
        showNotification('Error: No student selected.', 'error');
        return;
    }

    const details = {
        attendance: editAttendanceInput.value.trim(),
        conduct: editConductInput.value,
        interest: editInterestInput.value,
        teacherRemarks: editTeacherRemarksInput.value
    };

    studentReportDetails[studentId] = details;
    saveReportDetailsToStorage();
    
    closeEditModal();
    showNotification('Report details saved successfully!', 'success');
    
    // Refresh the report card to show "Customized" status
    const reportCard = document.getElementById(`report-card-${studentId}`);
    if (reportCard) {
        const statusDiv = reportCard.querySelector('.student-report-status:last-child');
        if (statusDiv) {
            statusDiv.innerHTML = '<i class="fas fa-edit"></i> Customized';
            statusDiv.className = 'student-report-status status-ready';
        }
    }
}

// Preview student report
function previewStudentReport(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) {
        showNotification('Student not found.', 'error');
        return;
    }

    // Generate and display the report
    generateIndividualReport(studentId);
    
    // Scroll to preview
    individualReportContainer.scrollIntoView({ behavior: 'smooth' });
}

// Generate individual report for a specific student
function generateIndividualReport(studentId) {
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        showNotification('Student not found.', 'error');
        return;
    }

    // Calculate performance
    const performance = calculateStudentPerformance(studentId);
    
    // Get report details
    const details = studentReportDetails[studentId] || {};

    let reportHTML = `
        <div class="school-header">
            <div class="school-header-with-logos">
                <div class="school-logo">
                    ${schoolInfo.schoolLogo ? `<img src="${schoolInfo.schoolLogo}" alt="School Logo" style="width: 100%; height: 100%; object-fit: contain;">` : 'School Logo'}
                </div>
                <div class="school-header-content">
                    <h1>THE LIVING SPRING SCHOOL</h1>
                    <p>P.O.BOX 16493 K.I.A ACCRA (0243438604)</p>
                    <p><strong>Motto:</strong> Drink deep or taste not the spring of knowledge</p>
                    <h2>END OF TERM ${schoolInfo.term} REPORT SHEET</h2>
                </div>
                <div class="school-logo">
                    ${schoolInfo.schoolLogo ? `<img src="${schoolInfo.schoolLogo}" alt="School Logo" style="width: 100%; height: 100%; object-fit: contain;">` : 'School Logo'}
                </div>
            </div>
        </div>

        <div class="student-info-grid">
            <div class="info-item">
                <span class="info-label">CLASS:</span>
                <span class="info-value">${student.class} &nbsp;&nbsp; TERM ${schoolInfo.term}</span>
            </div>
            <div class="info-item">
                <span class="info-label">NAME OF LEARNER:</span>
                <span class="info-value">${student.name}</span>
            </div>
            <div class="info-item">
                <span class="info-label">ACADEMIC YEAR:</span>
                <span class="info-value">${schoolInfo.academicYear}</span>
            </div>
            <div class="info-item">
                <span class="info-label">DATE OF VACATION:</span>
                <span class="info-value">${schoolInfo.closingDate}</span>
            </div>
            <div class="info-item">
                <span class="info-label">NUMBER ON ROLL:</span>
                <span class="info-value">${schoolInfo.numberOnRoll}</span>
            </div>
            <div class="info-item">
                <span class="info-label">RE-OPENING DATE:</span>
                <span class="info-value">${schoolInfo.reopeningDate}</span>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>SUBJECT</th>
                    <th>CLASS SCORE (50%)</th>
                    <th>EXAMS SCORE (50%)</th>
                    <th>TOTAL SCORE</th>
                    <th>GRADE</th>
                    <th>REMARKS</th>
                </tr>
            </thead>
            <tbody>
    `;

    let hasScores = false;
    let completedSubjects = 0;
    
    subjects.forEach(subject => {
        if (scores[subject] && scores[subject][studentId]) {
            const subjectData = scores[subject][studentId];
            
            // Check if both scores are available
            if (subjectData.classScore !== '' && subjectData.examScore !== '') {
                hasScores = true;
                completedSubjects++;
                
                const classScore50 = calculateFiftyPercent(subjectData.classScore);
                const examScore50 = calculateFiftyPercent(subjectData.examScore);
                const totalScore = calculateTotalScore(subjectData.classScore, subjectData.examScore);
                const gradeInfo = getGrade(totalScore);
                
                reportHTML += `
                    <tr>
                        <td>${subject}</td>
                        <td>${classScore50}</td>
                        <td>${examScore50}</td>
                        <td>${totalScore}</td>
                        <td class="grade-${gradeInfo.grade}">${gradeInfo.grade}</td>
                        <td class="grade-${gradeInfo.grade}">${gradeInfo.remark}</td>
                    </tr>
                `;
            } else {
                // Show incomplete scores
                const classScoreDisplay = subjectData.classScore !== '' ? calculateFiftyPercent(subjectData.classScore) : '-';
                const examScoreDisplay = subjectData.examScore !== '' ? calculateFiftyPercent(subjectData.examScore) : '-';
                
                reportHTML += `
                    <tr>
                        <td>${subject}</td>
                        <td>${classScoreDisplay}</td>
                        <td>${examScoreDisplay}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>Incomplete</td>
                    </tr>
                `;
            }
        } else {
            // No scores for this subject
            reportHTML += `
                <tr>
                    <td>${subject}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>No scores</td>
                </tr>
            `;
        }
    });

    reportHTML += `
            </tbody>
        </table>
    `;

    // Add performance summary if available
    if (performance) {
        reportHTML += `
            <div class="performance-summary">
                <div class="performance-item">
                    <div class="performance-value">${performance.average.toFixed(1)}%</div>
                    <div class="performance-label">AVERAGE SCORE</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">${performance.overallGrade}</div>
                    <div class="performance-label">OVERALL GRADE</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">${performance.overallRemark}</div>
                    <div class="performance-label">PERFORMANCE LEVEL</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">${completedSubjects}/10</div>
                    <div class="performance-label">SUBJECTS COMPLETED</div>
                </div>
            </div>
        `;
    } else if (completedSubjects > 0) {
        reportHTML += `
            <div class="performance-summary">
                <div class="performance-item">
                    <div class="performance-value">${completedSubjects}</div>
                    <div class="performance-label">SUBJECTS WITH SCORES</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">${10 - completedSubjects}</div>
                    <div class="performance-label">SUBJECTS PENDING</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">-</div>
                    <div class="performance-label">AVERAGE SCORE</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">-</div>
                    <div class="performance-label">OVERALL GRADE</div>
                </div>
            </div>
        `;
    }

    // Use saved details or defaults
    reportHTML += `
        <div class="attendance-section">
            <div class="info-item">
                <span class="info-label">ATTENDANCE:</span>
                <span class="info-value">${details.attendance || 'Not specified'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">PROMOTED TO:</span>
                <span class="info-value"></span>
            </div>
            <div class="info-item">
                <span class="info-label">REPEATED IN:</span>
                <span class="info-value"></span>
            </div>
        </div>

        <div class="conduct-section">
            <div class="info-item">
                <span class="info-label">CONDUCT:</span>
                <span class="info-value">${details.conduct || 'Not specified'}</span>
            </div>
        </div>

        <div class="interest-section">
            <div class="info-item">
                <span class="info-label">INTEREST:</span>
                <span class="info-value">${details.interest || 'Not specified'}</span>
            </div>
        </div>

        <div class="teacher-remarks-section">
            <div class="info-item">
                <span class="info-label">CLASS TEACHER'S REMARKS:</span>
                <span class="info-value">${details.teacherRemarks || 'Not specified'}</span>
            </div>
        </div>

        <div class="signature-section">
            <div class="info-item">
                <span class="info-label">ADMINISTRATOR'S SIGNATURE:</span>
                <span class="info-value">_________________________</span>
            </div>
            <div class="info-item">
                <span class="info-label">CLASS TEACHER'S SIGNATURE:</span>
                <span class="info-value">_________________________</span>
            </div>
        </div>

        <div class="footer-message">
            Have a wonderful holiday!
        </div>
    `;

    individualReportContainer.innerHTML = reportHTML;
    showNotification('Individual report generated successfully!', 'success');
    
    return reportHTML;
}

// Download individual student report as PDF
function downloadStudentReport(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) {
        showNotification('Student not found.', 'error');
        return;
    }

    // Generate the report HTML
    const reportHTML = generateIndividualReport(studentId);
    
    // Download as PDF
    downloadIndividualReportAsPDF(student.name, reportHTML);
}

// Download individual report as PDF with custom filename
function downloadIndividualReportAsPDF(studentName, reportHTML) {
    if (!reportHTML) {
        showNotification('Please generate a report first.', 'error');
        return;
    }

    const printWindow = window.open('', '_blank');
    
    // Clean filename
    const cleanName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Report_${cleanName}_Term${schoolInfo.term}_${schoolInfo.academicYear.replace('/', '_')}`;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${fileName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 15px; line-height: 1.3; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
                th, td { border: 1px solid #000; padding: 6px; text-align: center; }
                th { background-color: #f0f0f0; font-weight: bold; }
                .school-header { text-align: center; margin-bottom: 15px; }
                .school-header-with-logos { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
                .school-logo { width: 80px; height: 80px; border: 2px solid #4361ee; border-radius: 10px; padding: 5px; background: white; }
                .student-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 11px; }
                .attendance-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 12px 0; font-size: 11px; }
                .conduct-section, .interest-section, .teacher-remarks-section { margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 5px; font-size: 11px; }
                .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px; font-size: 11px; }
                .footer-message { text-align: center; margin-top: 15px; padding: 10px; background: linear-gradient(135deg, #4361ee, #3a0ca3); color: white; border-radius: 5px; font-weight: bold; }
                .performance-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; font-size: 11px; }
                .performance-item { text-align: center; padding: 8px; background: white; border-radius: 5px; border: 1px solid #ddd; }
                .performance-value { font-size: 1.2rem; font-weight: bold; color: #4361ee; }
                .performance-label { font-size: 0.7rem; color: #666; }
                .grade-A { background-color: #d4edda; color: #155724; }
                .grade-P { background-color: #c3e6cb; color: #155724; }
                .grade-AP { background-color: #fff3cd; color: #856404; }
                .grade-D { background-color: #ffeaa7; color: #856404; }
                .grade-B { background-color: #f8d7da; color: #721c24; }
                @media print {
                    body { margin: 0; padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${reportHTML}
            <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px; border-top: 1px solid #ccc;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #4361ee; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-print"></i> Print/Save as PDF
                </button>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">
                    File will be saved as: ${fileName}.pdf
                </p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    
    showNotification(`Report for ${studentName} ready to download as PDF!`, 'success');
}

// Bulk download all reports
function bulkDownloadAllReports() {
    const selectedClass = individualClassSelect.value;
    if (!selectedClass) {
        showNotification('Please select a class first.', 'error');
        return;
    }

    const classStudents = students.filter(student => student.class === selectedClass);
    if (classStudents.length === 0) {
        showNotification(`No students found in ${selectedClass}`, 'error');
        return;
    }

    showNotification(`Opening ${classStudents.length} reports for downloading...`, 'info');
    
    // Open each report in a new window for individual downloading
    classStudents.forEach((student, index) => {
        setTimeout(() => {
            const performance = calculateStudentPerformance(student.id);
            if (performance) {
                // Generate report
                const reportHTML = generateIndividualReport(student.id);
                
                // Open in new window for printing/saving
                setTimeout(() => {
                    downloadIndividualReportAsPDF(student.name, reportHTML);
                }, 100);
            }
        }, index * 2000); // Stagger to avoid overwhelming the browser
    });
    
    showNotification(`${classStudents.length} reports will open in separate windows. Please save each one individually.`, 'info');
}

// Generate PDF report for WhatsApp - Returns the HTML content of the report
function generatePDFReportForWhatsApp(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    // Calculate performance
    const performance = calculateStudentPerformance(studentId);
    
    // Get report details
    const details = studentReportDetails[studentId] || {};

    let reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Report for ${student.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 15px; line-height: 1.3; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
                th, td { border: 1px solid #000; padding: 6px; text-align: center; }
                th { background-color: #f0f0f0; font-weight: bold; }
                .school-header { text-align: center; margin-bottom: 15px; }
                .school-header-with-logos { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
                .school-logo { width: 80px; height: 80px; border: 2px solid #4361ee; border-radius: 10px; padding: 5px; background: white; }
                .student-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 11px; }
                .attendance-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 12px 0; font-size: 11px; }
                .conduct-section, .interest-section, .teacher-remarks-section { margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 5px; font-size: 11px; }
                .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px; font-size: 11px; }
                .footer-message { text-align: center; margin-top: 15px; padding: 10px; background: linear-gradient(135deg, #4361ee, #3a0ca3); color: white; border-radius: 5px; font-weight: bold; }
                .performance-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; font-size: 11px; }
                .performance-item { text-align: center; padding: 8px; background: white; border-radius: 5px; border: 1px solid #ddd; }
                .performance-value { font-size: 1.2rem; font-weight: bold; color: #4361ee; }
                .performance-label { font-size: 0.7rem; color: #666; }
                .grade-A { background-color: #d4edda; color: #155724; }
                .grade-P { background-color: #c3e6cb; color: #155724; }
                .grade-AP { background-color: #fff3cd; color: #856404; }
                .grade-D { background-color: #ffeaa7; color: #856404; }
                .grade-B { background-color: #f8d7da; color: #721c24; }
                @media print {
                    body { margin: 0; padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="school-header">
                <div class="school-header-with-logos">
                    <div class="school-logo">
                        ${schoolInfo.schoolLogo ? `<img src="${schoolInfo.schoolLogo}" alt="School Logo" style="width: 100%; height: 100%; object-fit: contain;">` : 'School Logo'}
                    </div>
                    <div class="school-header-content">
                        <h1>THE LIVING SPRING SCHOOL</h1>
                        <p>P.O.BOX 16493 K.I.A ACCRA (0243438604)</p>
                        <p><strong>Motto:</strong> Drink deep or taste not the spring of knowledge</p>
                        <h2>END OF TERM ${schoolInfo.term} REPORT SHEET</h2>
                    </div>
                    <div class="school-logo">
                        ${schoolInfo.schoolLogo ? `<img src="${schoolInfo.schoolLogo}" alt="School Logo" style="width: 100%; height: 100%; object-fit: contain;">` : 'School Logo'}
                    </div>
                </div>
            </div>

            <div class="student-info-grid">
                <div class="info-item">
                    <span class="info-label">CLASS:</span>
                    <span class="info-value">${student.class} &nbsp;&nbsp; TERM ${schoolInfo.term}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">NAME OF LEARNER:</span>
                    <span class="info-value">${student.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">ACADEMIC YEAR:</span>
                    <span class="info-value">${schoolInfo.academicYear}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">DATE OF VACATION:</span>
                    <span class="info-value">${schoolInfo.closingDate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">NUMBER ON ROLL:</span>
                    <span class="info-value">${schoolInfo.numberOnRoll}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">RE-OPENING DATE:</span>
                    <span class="info-value">${schoolInfo.reopeningDate}</span>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>SUBJECT</th>
                        <th>CLASS SCORE (50%)</th>
                        <th>EXAMS SCORE (50%)</th>
                        <th>TOTAL SCORE</th>
                        <th>GRADE</th>
                        <th>REMARKS</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let completedSubjects = 0;
    
    subjects.forEach(subject => {
        if (scores[subject] && scores[subject][studentId]) {
            const subjectData = scores[subject][studentId];
            
            // Check if both scores are available
            if (subjectData.classScore !== '' && subjectData.examScore !== '') {
                completedSubjects++;
                
                const classScore50 = calculateFiftyPercent(subjectData.classScore);
                const examScore50 = calculateFiftyPercent(subjectData.examScore);
                const totalScore = calculateTotalScore(subjectData.classScore, subjectData.examScore);
                const gradeInfo = getGrade(totalScore);
                
                reportHTML += `
                    <tr>
                        <td>${subject}</td>
                        <td>${classScore50}</td>
                        <td>${examScore50}</td>
                        <td>${totalScore}</td>
                        <td class="grade-${gradeInfo.grade}">${gradeInfo.grade}</td>
                        <td class="grade-${gradeInfo.grade}">${gradeInfo.remark}</td>
                    </tr>
                `;
            } else {
                // Show incomplete scores
                const classScoreDisplay = subjectData.classScore !== '' ? calculateFiftyPercent(subjectData.classScore) : '-';
                const examScoreDisplay = subjectData.examScore !== '' ? calculateFiftyPercent(subjectData.examScore) : '-';
                
                reportHTML += `
                    <tr>
                        <td>${subject}</td>
                        <td>${classScoreDisplay}</td>
                        <td>${examScoreDisplay}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>Incomplete</td>
                    </tr>
                `;
            }
        } else {
            // No scores for this subject
            reportHTML += `
                <tr>
                    <td>${subject}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>No scores</td>
                </tr>
            `;
        }
    });

    reportHTML += `
                </tbody>
            </table>
    `;

    // Add performance summary if available
    if (performance) {
        reportHTML += `
            <div class="performance-summary">
                <div class="performance-item">
                    <div class="performance-value">${performance.average.toFixed(1)}%</div>
                    <div class="performance-label">AVERAGE SCORE</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">${performance.overallGrade}</div>
                    <div class="performance-label">OVERALL GRADE</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">${performance.overallRemark}</div>
                    <div class="performance-label">PERFORMANCE LEVEL</div>
                </div>
                <div class="performance-item">
                    <div class="performance-value">${completedSubjects}/9</div>
                    <div class="performance-label">SUBJECTS COMPLETED</div>
                </div>
            </div>
        `;
    }

    // Use saved details or defaults
    reportHTML += `
        <div class="attendance-section">
            <div class="info-item">
                <span class="info-label">ATTENDANCE:</span>
                <span class="info-value">${details.attendance || 'Not specified'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">PROMOTED TO:</span>
                <span class="info-value"></span>
            </div>
            <div class="info-item">
                <span class="info-label">REPEATED IN:</span>
                <span class="info-value"></span>
            </div>
        </div>

        <div class="conduct-section">
            <div class="info-item">
                <span class="info-label">CONDUCT:</span>
                <span class="info-value">${details.conduct || 'Not specified'}</span>
            </div>
        </div>

        <div class="interest-section">
            <div class="info-item">
                <span class="info-label">INTEREST:</span>
                <span class="info-value">${details.interest || 'Not specified'}</span>
            </div>
        </div>

        <div class="teacher-remarks-section">
            <div class="info-item">
                <span class="info-label">CLASS TEACHER'S REMARKS:</span>
                <span class="info-value">${details.teacherRemarks || 'Not specified'}</span>
            </div>
        </div>

        <div class="signature-section">
            <div class="info-item">
                <span class="info-label">ADMINISTRATOR'S SIGNATURE:</span>
                <span class="info-value">_________________________</span>
            </div>
            <div class="info-item">
                <span class="info-label">CLASS TEACHER'S SIGNATURE:</span>
                <span class="info-value">_________________________</span>
            </div>
        </div>

        <div class="footer-message">
            Have a wonderful holiday!
        </div>
    </body>
    </html>
    `;
    
    return reportHTML;
}

// Send individual WhatsApp report with PDF format
function sendIndividualWhatsAppReport(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) {
        showNotification('Student not found.', 'error');
        return;
    }

    const parentInfo = parentContacts[studentId];
    if (!parentInfo) {
        showNotification(`No parent information found for ${student.name}.`, 'error');
        return;
    }

    // Generate the report HTML for PDF
    const reportHTML = generatePDFReportForWhatsApp(studentId);
    if (!reportHTML) {
        showNotification('No report data available for this student.', 'error');
        return;
    }

    // Create a Blob from the HTML content
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary iframe to print the report
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    iframe.onload = function() {
        // Generate WhatsApp message with report details
        let message = `*END OF TERM REPORT - THE LIVING SPRING SCHOOL*\n`;
        message += `Term ${schoolInfo.term}, ${schoolInfo.academicYear}\n\n`;
        message += `*Student:* ${student.name}\n`;
        message += `*Class:* ${student.class}\n\n`;
        message += `Please review your child's report card above. 📊\n\n`;
        message += `_Report generated via OneReal Report Generator_\n`;
        message += `📚 Powered by Living Spring School`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${parentInfo.phone.replace('+', '')}?text=${encodedMessage}`;
        
        // Mark as sent
        parentContacts[studentId].sent = true;
        saveParentContacts();
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
        }, 1000);
        
        showNotification(`WhatsApp report prepared for ${student.name}. The report will open in a new window for you to print/save as PDF and then share via WhatsApp.`, 'success');
        
        // Refresh parents list
        renderParentsList();
    };
}

// Send WhatsApp report for selected student
function sendWhatsAppReport() {
    const studentId = parseInt(whatsappStudentSelect.value);
    if (!studentId) {
        showNotification('Please select a student first.', 'error');
        return;
    }

    sendIndividualWhatsAppReport(studentId);
}

// Bulk send WhatsApp reports for entire class
function bulkSendWhatsAppReports() {
    const selectedClass = whatsappClassSelect.value;
    if (!selectedClass) {
        showNotification('Please select a class first.', 'error');
        return;
    }

    const classStudents = students.filter(student => student.class === selectedClass);
    if (classStudents.length === 0) {
        showNotification('No students found in this class.', 'error');
        return;
    }

    let sentCount = 0;
    let pendingCount = 0;
    let noParentCount = 0;

    bulkSendStatus.innerHTML = '<div class="loading" style="display: inline-block; margin-right: 10px;"></div> Preparing reports...';

    // Process each student
    classStudents.forEach((student, index) => {
        setTimeout(() => {
            const parentInfo = parentContacts[student.id];
            if (parentInfo) {
                const performance = calculateStudentPerformance(student.id);
                if (performance) {
                    // Mark as sent
                    parentContacts[student.id].sent = true;
                    
                    // Open first 3 reports immediately, queue the rest
                    if (sentCount < 3) {
                        sendIndividualWhatsAppReport(student.id);
                    }
                    
                    sentCount++;
                } else {
                    noParentCount++;
                }
            } else {
                noParentCount++;
            }

            // Update status
            bulkSendStatus.innerHTML = `
                <div style="color: var(--primary);">
                    <i class="fas fa-sync-alt fa-spin"></i> Processing: ${sentCount + noParentCount}/${classStudents.length}
                </div>
            `;

            // If all processed, save and show summary
            if (sentCount + noParentCount === classStudents.length) {
                saveParentContacts();
                renderParentsList();
                
                bulkSendStatus.innerHTML = `
                    <div style="color: var(--success); font-weight: bold;">
                        <i class="fas fa-check-circle"></i> Bulk send completed!
                    </div>
                    <div style="margin-top: 10px;">
                        <div>✓ Reports prepared: ${sentCount}</div>
                        <div>⚠ No parent info: ${noParentCount}</div>
                        <div style="margin-top: 10px; font-size: 0.9rem;">
                            <em>First 3 reports opened automatically. Check WhatsApp Web/Desktop.</em>
                        </div>
                    </div>
                `;
                
                showNotification(`Bulk send completed: ${sentCount} reports prepared!`, 'success');
            }
        }, index * 3000); // Stagger requests to avoid overwhelming the browser
    });
}

// Download performance analysis as PDF
function downloadPerformanceAnalysis() {
    if (performanceContainer.innerHTML === '') {
        showNotification('Please generate performance analysis first.', 'error');
        return;
    }

    const selectedClass = performanceClassSelect.value;
    const printWindow = window.open('', '_blank');
    const fileName = `Performance_Analysis_${selectedClass}_Term${schoolInfo.term}_${schoolInfo.academicYear.replace('/', '_')}`;
    
    // Get the chart as image
    let chartImage = '';
    const chartCanvas = document.getElementById('performanceChart');
    if (chartCanvas) {
        chartImage = chartCanvas.toDataURL('image/png');
    }
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${fileName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
                .performance-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px; }
                .performance-item { text-align: center; padding: 15px; background: white; border-radius: 8px; border: 1px solid #ddd; }
                .performance-value { font-size: 1.5rem; font-weight: bold; color: #4361ee; }
                .performance-label { font-size: 0.9rem; color: #666; }
                .ranking-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .ranking-table th, .ranking-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                .ranking-table th { background-color: #f0f0f0; font-weight: bold; }
                .ranking-table tr:nth-child(even) { background-color: #f9f9f9; }
                .rank-1 { background-color: #ffd700 !important; }
                .rank-2 { background-color: #c0c0c0 !important; }
                .rank-3 { background-color: #cd7f32 !important; }
                .grade-A { background-color: #d4edda; color: #155724; }
                .grade-P { background-color: #c3e6cb; color: #155724; }
                .grade-AP { background-color: #fff3cd; color: #856404; }
                .grade-D { background-color: #ffeaa7; color: #856404; }
                .grade-B { background-color: #f8d7da; color: #721c24; }
                .chart-container { margin: 20px 0; text-align: center; }
                .chart-container img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; }
                h1, h2, h3 { color: #4361ee; }
                @media print {
                    body { margin: 0; padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Student Performance Analysis & Ranking</h1>
            <h2>${selectedClass} - Term ${schoolInfo.term}, ${schoolInfo.academicYear}</h2>
            
            ${performanceContainer.innerHTML}
            
            ${chartImage ? `<div class="chart-container"><img src="${chartImage}" alt="Performance Chart"></div>` : ''}
            
            <div class="no-print" style="text-align: center; margin-top: 30px; padding: 15px; border-top: 1px solid #ccc;">
                <button onclick="window.print()" style="padding: 12px 24px; background: #4361ee; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                    <i class="fas fa-print"></i> Print/Save as PDF
                </button>
                <p style="margin-top: 15px; font-size: 14px; color: #666;">
                    File will be saved as: ${fileName}.pdf
                </p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    showNotification('Performance analysis ready to download as PDF!', 'success');
}

// Generate performance analysis
function generatePerformanceAnalysis() {
    const selectedClass = performanceClassSelect.value;
    
    if (!selectedClass) {
        showNotification('Please select a class first.', 'error');
        return;
    }

    const classStudents = students.filter(student => student.class === selectedClass);
    if (classStudents.length === 0) {
        showNotification(`No students found in ${selectedClass}`, 'error');
        return;
    }

    // Calculate performance for all students
    const performanceData = [];
    let totalStudentsWithScores = 0;
    
    classStudents.forEach(student => {
        const performance = calculateStudentPerformance(student.id);
        if (performance) {
            performanceData.push({
                studentId: student.id,
                name: student.name,
                ...performance
            });
            totalStudentsWithScores++;
        }
    });

    if (totalStudentsWithScores === 0) {
        showNotification('No complete scores available for this class.', 'error');
        return;
    }

    // Sort by average score (highest first)
    performanceData.sort((a, b) => b.average - a.average);

    // Add ranks
    performanceData.forEach((student, index) => {
        student.rank = index + 1;
    });

    // Calculate class statistics
    const classAverage = performanceData.reduce((sum, student) => sum + student.average, 0) / performanceData.length;
    
    // Count overall grades
    const overallGradeCounts = {
        'A': 0, 'P': 0, 'AP': 0, 'D': 0, 'B': 0
    };
    
    performanceData.forEach(student => {
        overallGradeCounts[student.overallGrade] = (overallGradeCounts[student.overallGrade] || 0) + 1;
    });

    // Generate HTML
    let performanceHTML = `
        <div class="performance-summary">
            <div class="performance-item">
                <div class="performance-value">${performanceData.length}</div>
                <div class="performance-label">TOTAL STUDENTS</div>
            </div>
            <div class="performance-item">
                <div class="performance-value">${classAverage.toFixed(1)}%</div>
                <div class="performance-label">CLASS AVERAGE</div>
            </div>
            <div class="performance-item">
                <div class="performance-value">${overallGradeCounts['A']}</div>
                <div class="performance-label">ADVANCED (A)</div>
            </div>
            <div class="performance-item">
                <div class="performance-value">${overallGradeCounts['B']}</div>
                <div class="performance-label">BEGINNERS (B)</div>
            </div>
        </div>

        <div class="chart-container">
            <canvas id="performanceChart"></canvas>
        </div>

        <div class="ranking-section">
            <h3>Student Ranking - ${selectedClass}</h3>
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Student Name</th>
                        <th>Average Score</th>
                        <th>Overall Grade</th>
                        <th>Performance Level</th>
                    </tr>
                </thead>
                <tbody>
    `;

    performanceData.forEach(student => {
        const rankClass = student.rank <= 3 ? `rank-${student.rank}` : '';
        performanceHTML += `
            <tr class="${rankClass}">
                <td>${student.rank}</td>
                <td>${student.name}</td>
                <td>${student.average.toFixed(1)}%</td>
                <td class="grade-${student.overallGrade}">${student.overallGrade}</td>
                <td>${student.overallRemark}</td>
            </tr>
        `;
    });

    performanceHTML += `
                </tbody>
            </table>
        </div>
        
        <div class="performance-download-container">
            <button class="btn btn-success" id="downloadPerformanceAnalysis">
                <i class="fas fa-download"></i> Download Performance Analysis as PDF
            </button>
        </div>
    `;

    performanceContainer.innerHTML = performanceHTML;

    // Create performance chart
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Prepare data for chart
    const gradeLabels = ['ADVANCE (A)', 'PROFICIENCY (P)', 'APPROACHING PROFICIENCY (AP)', 'DEVELOPING (D)', 'BEGINNER (B)'];
    const gradeValues = [
        overallGradeCounts['A'],
        overallGradeCounts['P'],
        overallGradeCounts['AP'],
        overallGradeCounts['D'],
        overallGradeCounts['B']
    ];
    
    const gradeColors = [
        'rgba(75, 192, 192, 0.7)',  // Green for Advance
        'rgba(54, 162, 235, 0.7)',  // Blue for Proficiency
        'rgba(255, 206, 86, 0.7)',  // Yellow for Approaching
        'rgba(255, 159, 64, 0.7)',  // Orange for Developing
        'rgba(255, 99, 132, 0.7)'   // Red for Beginner
    ];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: gradeLabels,
            datasets: [{
                label: 'Number of Students',
                data: gradeValues,
                backgroundColor: gradeColors,
                borderColor: gradeColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Performance Levels'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Class Performance Distribution - ${selectedClass}`,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });

    // Add event listener for the download button
    document.getElementById('downloadPerformanceAnalysis').addEventListener('click', downloadPerformanceAnalysis);

    showNotification('Performance analysis generated successfully!', 'success');
}

// Export all data
function exportAllData() {
    const data = {
        students: students,
        scores: scores,
        schoolInfo: schoolInfo,
        parentContacts: parentContacts,
        studentReportDetails: studentReportDetails
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OneReal_Primary_Report_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('All data exported successfully!', 'success');
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirm('This will replace all current data. Are you sure?')) {
                if (data.students) students = data.students;
                if (data.scores) scores = data.scores;
                if (data.schoolInfo) schoolInfo = data.schoolInfo;
                if (data.parentContacts) parentContacts = data.parentContacts;
                if (data.studentReportDetails) studentReportDetails = data.studentReportDetails;
                
                saveStudents();
                saveScoresToStorage();
                saveParentContacts();
                saveReportDetailsToStorage();
                localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));
                
                loadSchoolInfo();
                renderStudentsList();
                renderParentsList();
                
                showNotification('Data imported successfully!', 'success');
            }
        } catch (error) {
            showNotification('Error importing data. Please check the file format.', 'error');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Initialize the app when the page loads

document.addEventListener('DOMContentLoaded', init);
