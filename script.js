// Select elements
const submitButton = document.getElementById('sub');
const transcriptInput = document.getElementById('transcript');
const outputDiv = document.getElementById('result');

// Add click event to the submit button
submitButton.addEventListener('click', function processTranscript() {
    // Get the pasted transcript from the input field
    const inputText = transcriptInput.value;

    // Step 1: Clean the text to extract the grade points
    const grades = cleanText(inputText);

    if (!grades || grades.length === 0) {
        alert("No valid grades found. Please check the input.");
        return;
    }

    // Step 2: Group the grades into semesters (each semester has 6 grades)
    const semesters = [];
    for (let i = 0; i < grades.length; i += 6) {
        // Ensure a semester contains exactly 6 grades
        if (grades.slice(i, i + 6).length === 6) {
            semesters.push(grades.slice(i, i + 6));
        }
    }

    if (semesters.length === 0) {
        alert("Not enough courses found to form a semester.");
        return;
    }

    // Step 3: Group the semesters into years (2 semesters per year)
    const years = [];
    for (let i = 0; i < semesters.length; i += 2) {
        if (semesters.slice(i, i + 2).length === 2) {
            years.push(semesters.slice(i, i + 2));
        }
    }

    // Step 4: Generate the output HTML to display the GPAs
    let outputHTML = "<h3>GPA for Each Year:</h3><ul>";
    let totalGPA = 0;

    years.forEach((year, index) => {
        let yearGPA = 0;
        let semesterCount = 0;

        year.forEach((semester, semesterIndex) => {
            const gpa = calculateGPA(semester);
            yearGPA += gpa;
            semesterCount++;
            outputHTML += `<li>Year ${index + 1} - Semester ${semesterIndex + 1}: GPA = ${gpa.toFixed(2)}</li>`;
        });

        // Calculate the GPA for the whole year
        const yearAverageGPA = yearGPA / semesterCount;
        outputHTML += `<li>Year ${index + 1} - Average GPA: ${yearAverageGPA.toFixed(2)}</li>`;
        totalGPA += yearAverageGPA;
    });

    // Step 5: Calculate the average GPA across all years
    const averageGPA = years.length > 0 ? totalGPA / years.length : 0;
    outputHTML += `</ul><h3>Average GPA for All Years: ${averageGPA.toFixed(2)}</h3>`;

    // Display the result on the page
    outputDiv.innerHTML = outputHTML;
});

// Function to clean the text and extract grade points
function cleanText(text) {
    // Improved regex to match decimal numbers with at least one digit before and after the decimal
    const regex = /\b\d+\.\d+\b/g;
    const matches = text.match(regex);
    return matches ? matches.map(num => parseFloat(num)) : [];
}

// Function to calculate GPA (average of the points)
function calculateGPA(semesterGrades) {
    if (semesterGrades.length === 0) return 0;
    const totalPoints = semesterGrades.reduce((sum, grade) => sum + grade, 0);
    return totalPoints / semesterGrades.length;
}
