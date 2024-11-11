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

    if (grades.length === 0) {
        alert("No valid grades found. Please check the input.");
        return;
    }

    // Step 2: Group the grades into semesters (each semester has 6 grades)
    const semesters = [];
    while (grades.length > 0) {
        semesters.push(grades.splice(0, 6));  // Take 6 grades for each semester
    }

    // Step 3: Group the semesters by year (2 semesters per year)
    const years = [];
    while (semesters.length > 0) {
        const year = [semesters.splice(0, 2)]; // Take 2 semesters for each year
        years.push(year);
    }

    // Step 4: Generate the output HTML to display the GPAs
    let outputHTML = "<h3>GPA for Each Year:</h3><ul>";
    let totalGPA = 0;
    years.forEach((year, index) => {
        let yearGPA = 0;
        let semesterCount = 0;

        year[0].forEach((semester, semesterIndex) => {
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
    const averageGPA = totalGPA / years.length;
    outputHTML += `</ul><h3>Average GPA for All Years: ${averageGPA.toFixed(5)}</h3>`;

    // Display the result on the page
    outputDiv.innerHTML = outputHTML;
});

// Function to clean the text and extract grade points
function cleanText(text) {
    // This regex matches numbers with one or more digits before the decimal and exactly two digits after the decimal
    const regex = /\b\d+\.\d{2}\b/g;
    return text.match(regex).map(num => parseFloat(num));
}

// Function to calculate GPA (average of the points)
function calculateGPA(semesterGrades) {
    const totalPoints = semesterGrades.reduce((sum, grade) => sum + grade, 0);
    return totalPoints / semesterGrades.length;
}
