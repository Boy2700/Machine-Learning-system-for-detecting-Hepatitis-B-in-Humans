document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "Have you experienced yellowing of the skin or eyes (jaundice)?",
            weight: 3,
            tooltip: "Jaundice is a common sign of liver problems, including Hepatitis B."
        },
        {
            question: "Have you noticed dark urine?",
            weight: 2,
            tooltip: "Dark urine can be a sign of liver issues, including Hepatitis B."
        },
        {
            question: "Do you have persistent fatigue?",
            weight: 1,
            tooltip: "Fatigue is a common symptom of many conditions, including Hepatitis B."
        },
        {
            question: "Have you experienced abdominal pain?",
            weight: 1,
            tooltip: "Abdominal pain can be associated with liver problems."
        },
        {
            question: "Have you had a loss of appetite?",
            weight: 1,
            tooltip: "Loss of appetite is common in liver diseases."
        },
        {
            question: "Have you experienced nausea or vomiting?",
            weight: 1,
            tooltip: "Nausea and vomiting can be symptoms of liver issues."
        },
        {
            question: "Have you had joint pain?",
            weight: 1,
            tooltip: "Joint pain can be associated with Hepatitis B."
        },
        {
            question: "Have you had a fever?",
            weight: 1,
            tooltip: "Fever can be a symptom of various infections, including Hepatitis B."
        },
        {
            question: "Have you been diagnosed with any liver disease?",
            weight: 2,
            tooltip: "Previous liver diseases increase the risk of Hepatitis B."
        },
        {
            question: "Have you ever used injectable drugs?",
            weight: 3,
            tooltip: "Injectable drug use is a high-risk factor for Hepatitis B transmission."
        },
        {
            question: "Have you had unprotected sex with multiple partners?",
            weight: 2,
            tooltip: "Unprotected sex increases the risk of Hepatitis B transmission."
        },
        {
            question: "Have you lived with someone who has chronic Hepatitis B?",
            weight: 2,
            tooltip: "Close contact with infected individuals increases transmission risk."
        },
        {
            question: "Were you born in a country with high Hepatitis B rates?",
            weight: 2,
            tooltip: "Some countries have higher prevalence of Hepatitis B."
        },
        {
            question: "Have you received a blood transfusion before 1992?",
            weight: 2,
            tooltip: "Blood screening for Hepatitis B became more rigorous after 1992."
        },
        {
            question: "Do you work in healthcare or emergency services?",
            weight: 1,
            tooltip: "Healthcare workers have a higher risk of exposure to Hepatitis B."
        },
        {
            question: "Have you ever been on hemodialysis?",
            weight: 2,
            tooltip: "Hemodialysis patients are at increased risk for Hepatitis B."
        },
        {
            question: "Have you had any tattoos or piercings from unlicensed facilities?",
            weight: 1,
            tooltip: "Unsterile equipment can transmit Hepatitis B."
        },
        {
            question: "Have you shared personal care items (razors, toothbrushes) with others?",
            weight: 1,
            tooltip: "Sharing personal items can potentially spread Hepatitis B."
        },
        {
            question: "Have you traveled to areas with high Hepatitis B rates without vaccination?",
            weight: 1,
            tooltip: "Travel to high-risk areas without protection increases exposure risk."
        },
        {
            question: "Have you ever been tested for Hepatitis B before?",
            weight: 0,
            tooltip: "Previous testing doesn't affect risk, but is good to know."
        }
    ];

    let currentQuestion = 0;
    let userResponses = [];

    const landingSection = document.getElementById('landing');
    const questionnaireSection = document.getElementById('questionnaire');
    const resultsSection = document.getElementById('results');
    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const questionContainer = document.getElementById('question-container');
    const progressBar = document.getElementById('progress');

    startBtn.addEventListener('click', startQuestionnaire);
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    restartBtn.addEventListener('click', restartQuestionnaire);

    function startQuestionnaire() {
        landingSection.classList.remove('active');
        landingSection.classList.add('hidden');
        questionnaireSection.classList.remove('hidden');
        questionnaireSection.classList.add('active');
        showQuestion(currentQuestion);
    }

    function showQuestion(index) {
        const question = questions[index];
        questionContainer.innerHTML = `
            <div class="question">
                <h3>${question.question} 
                    <span class="tooltip">ℹ️
                        <span class="tooltiptext">${question.tooltip}</span>
                    </span>
                </h3>
                <div class="options">
                    <div class="option" data-value="yes">Yes</div>
                    <div class="option" data-value="no">No</div>
                    <div class="option" data-value="not-sure">Not Sure</div>
                </div>
            </div>
        `;

        const options = questionContainer.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', selectOption);
        });

        if (userResponses[index]) {
            const selectedOption = questionContainer.querySelector(`.option[data-value="${userResponses[index]}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
        }

        updateProgressBar();
        updateNavigation();
    }

    function selectOption(e) {
        const selectedOption = e.target;
        const options = questionContainer.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        selectedOption.classList.add('selected');
        userResponses[currentQuestion] = selectedOption.dataset.value;
        nextBtn.disabled = false;
    }

    function showNextQuestion() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
        } else {
            showResults();
        }
    }

    function showPreviousQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    }

    function updateProgressBar() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function updateNavigation() {
        prevBtn.disabled = currentQuestion === 0;
        nextBtn.disabled = !userResponses[currentQuestion];
        nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Finish' : 'Next';
    }

    function showResults() {
        questionnaireSection.classList.remove('active');
        questionnaireSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('active');

        const { riskLevel, confidenceScore, keySymptoms } = calculateResults();

        document.getElementById('risk-level').textContent = `Risk Level: ${riskLevel}`;
        document.getElementById('confidence-score').textContent = `Confidence Score: ${confidenceScore}%`;
        document.getElementById('key-symptoms').innerHTML = `
            <h3>Key Symptoms and Risk Factors:</h3>
            <ul>${keySymptoms.map(symptom => `<li>${symptom}</li>`).join('')}</ul>
        `;
        document.getElementById('recommendations').innerHTML = getRecommendations(riskLevel);
    }

    function calculateResults() {
        let totalScore = 0;
        let maxScore = 0;
        let keySymptoms = [];

        questions.forEach((question, index) => {
            if (userResponses[index] === 'yes') {
                totalScore += question.weight;
                if (question.weight > 1) {
                    keySymptoms.push(question.question);
                }
            }
            maxScore += question.weight;
        });

        const riskPercentage = (totalScore / maxScore) * 100;
        let riskLevel;
        if (riskPercentage < 30) {
            riskLevel = 'Low';
        } else if (riskPercentage < 60) {
            riskLevel = 'Moderate';
        } else {
            riskLevel = 'High';
        }

        const confidenceScore = Math.round((userResponses.filter(response => response !== 'not-sure').length / questions.length) * 100);

        return { riskLevel, confidenceScore, keySymptoms };
    }

    function getRecommendations(riskLevel) {
        let recommendations = '<h3>Recommendations:</h3><ul>';
        
        if (riskLevel === 'High') {
            recommendations += `
                <li>Consult a healthcare provider immediately for a comprehensive Hepatitis B test.</li>
                <li>Consider getting tested for other sexually transmitted infections.</li>
                <li>If you haven't been vaccinated, discuss Hepatitis B vaccination with your doctor.</li>
            `;
        } else if (riskLevel === 'Moderate') {
            recommendations += `
                <li>Schedule an appointment with your healthcare provider for a Hepatitis B blood test.</li>
                <li>If you haven't been vaccinated, consider getting the Hepatitis B vaccine.</li>
                <li>Practice safe sex and avoid sharing personal items like razors or toothbrushes.</li>
            `;
        } else {
            recommendations += `
                <li>Consider getting vaccinated for Hepatitis B if you haven't already.</li>
                <li>Continue practicing good hygiene and safe sex.</li>
                <li>Stay informed about Hepatitis B and its prevention methods.</li>
            `;
        }

        recommendations += `
            <li>Maintain a healthy lifestyle with a balanced diet and regular exercise.</li>
            <li>Avoid excessive alcohol consumption to protect your liver.</li>
        </ul>`;

        return recommendations;
    }

    function restartQuestionnaire() {
        currentQuestion = 0;
        userResponses = [];
        resultsSection.classList.remove('active');
        resultsSection.classList.add('hidden');
        landingSection.classList.remove('hidden');
        landingSection.classList.add('active');
    }
});
