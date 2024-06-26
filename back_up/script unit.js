let currentQuestionIndex = 0;
let score = 0;
let questionsAnswered = 0; // Track the number of questions answered
let timer;
let rangeInput = document.getElementsByClassName('range'); // Replace 'yourRangeInputId' with the actual ID of your range input
let rangeValue = document.getElementById('rangeValue'); // Replace 'yourRangeValueId' with the actual ID of your range value display
let currentUnit = ''; // Global variable to store current unit


// Range input event listener to update value display
function rangeSlide(value) {
  rangeValue.innerHTML = value+ ' ' + currentUnit;
}
function editRangeLimits(minValue, maxValue) {
  const rangeInput = document.querySelector('.range');
  rangeInput.setAttribute('min', minValue);
  rangeInput.setAttribute('max', maxValue);
}


fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    const questions = shuffleArray(data.questions).slice(0, 5); // Select the first 5 questions
    

    function displayQuestion() {
      const question = questions[currentQuestionIndex];
      document.getElementById('question').innerText = question.question;
      document.getElementById('options').innerHTML = '';
      currentUnit = question.unit; // Update the unit

    
      // Calculate min and max option values
      let minOptionValue = Infinity;
      let maxOptionValue = -Infinity;
      question.options.forEach(option => {
        const optionValue = parseInt(option); // Convert option to integer
        if (!isNaN(optionValue)) { // Check if the conversion is successful
          minOptionValue = Math.min(minOptionValue, optionValue);
          maxOptionValue = Math.max(maxOptionValue, optionValue);
        }
      });
    
      // Calculate range min and max based on min and max option values
      const rangeMin = Math.floor(minOptionValue - (minOptionValue * 0.05));
      const rangeMax = Math.ceil(maxOptionValue + (maxOptionValue * 0.05));
    
      // Update input range min and max attributes
      editRangeLimits(rangeMin, rangeMax);

      
    
      question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = `${option} ${question.unit}`; // Add unit to the option with a space
        /*button.addEventListener('click', () => selectAnswer(option, question.answer));*/
        document.getElementById('options').appendChild(button);
        document.querySelectorAll('#options button').forEach(button => {
          button.style.background = 'linear-gradient(to right, #6ABF4B, #6ADA41)'; // Add a red background to all option buttons
        });
      });
      
      
      

      // Add event listener to range input for highlighting matching option
      document.querySelector('.range').addEventListener('input', function() {
        const rangeValue = parseInt(this.value);
        document.querySelectorAll('#options button').forEach(optionButton => {
          const optionValue = parseInt(optionButton.innerText.split(' ')[0]);
          if (optionValue === rangeValue) {
            optionButton.style.background = 'linear-gradient(to right, #18DE00, #ffc400)';
          } else {
            optionButton.style.background = 'linear-gradient(to right, #6ABF4B, #6ADA41)';
          }
        });
      });
      
    
      startTimer();
    }
    
    

    function startTimer() {
      let timeLeft = 30;
      document.getElementById('timer_t').innerText = `${timeLeft} `;
      timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer_t').innerText = `${timeLeft} `;
        if (timeLeft === 0) {
          clearInterval(timer);
          selectAnswer('', questions[currentQuestionIndex].answer); // Timeout, select no answer
        }
      }, 1000);
    }
    

    function selectAnswer(selectedOption, correctAnswer) {
      clearInterval(timer);
      questionsAnswered++; // Increment the number of questions answered
      
    
      const options = document.getElementById('options').querySelectorAll('button');
      options.forEach(optionButton => {
        optionButton.disabled = true; // Disable all options
        
    
        // Extract the option text without the unit from the button's innerText
        const optionTextWithoutUnit = optionButton.innerText.split(' ')[0];
        
    
        if (optionTextWithoutUnit === correctAnswer) {
          optionButton.style.background = 'linear-gradient(to right, #18DE00, #00FF97)'; // Correct answer is always green
        } else {
          optionButton.style.background = 'linear-gradient(to right, #B7B7B7, #89C47C';; // Other options are gray
        }
    
        if (optionTextWithoutUnit === selectedOption) {
          if (selectedOption === correctAnswer) {
            optionButton.style.background = 'linear-gradient(to right, #18DE00, #00FF97)'; // Selected correct answer is green
            score++; // Add 1 point for correct answer
          } else {
            optionButton.style.background = 'linear-gradient(to right, #C66666, #C80000)'; // Selected incorrect answer is red
          }
        }
      });
      document.getElementById('score_t').innerText = score; // Update the score display
    
      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length && questionsAnswered < 5) { // Continue if not at the end of questions or not answered 5 questions
          displayQuestion();
          options.forEach(optionButton => {
            optionButton.disabled = false; // Enable options for the new question
            optionButton.style.backgroundColor = ''; // Reset background color
          });
        } else {
          endQuiz();
        }
      }, 2000);
    }
    

    function endQuiz() {
      alert(`Quiz ended! Your final score is ${score}`);
      document.getElementById('next-btn').style.display = 'block';
    }

    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    displayQuestion();
    document.getElementById('score_t').innerText = score;
  })
  .catch(error => console.error('Error fetching questions:', error));
// Call editRangeLimits function with new min and max values
editRangeLimits(0, 2000);