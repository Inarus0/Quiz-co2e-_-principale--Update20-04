let currentQuestionIndex = 0;
let score = 0;
let questionsAnswered = 0; // Track the number of questions answered
let timer;





function updateQuestionIndex() {
  const totalQuestions = 5;
  
  let ratio = `${currentQuestionIndex+1}/${totalQuestions}`;
  document.getElementById('question_index').innerText = ratio;
}
document.getElementById('b_main').addEventListener('click', function() {
   window.location.href = '../index.php';
  
});

document.addEventListener('contextmenu', function(event) {
  event.preventDefault(); // Empêche l'ouverture du menu contextuel
});
// Call the function to update the question index initially


fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    const questions = shuffleArray(data.questions).slice(0, 5); // Select the first 5 questions

    function displayQuestion() {
      const question = questions[currentQuestionIndex];
      document.getElementById('question').innerText = question.question;
      document.getElementById('options').innerHTML = '';
      
      updateQuestionIndex(); // Update unit text

      question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', () => selectAnswer(option, question.answer));
        document.getElementById('options').appendChild(button);
      });

      startTimer();
    }
    function startTimer() {
      let timeLeft = 30;
      document.getElementById('timer_t').innerText = `${timeLeft} `;
      clearInterval(timer); // Clear any existing timer
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
    
        if (optionButton.innerText === correctAnswer) {
          optionButton.style.background = 'linear-gradient(to right, #18DE00, #00FF97)'; // Correct answer is always green
        } else {
          optionButton.style.background = 'linear-gradient(to right, #B7B7B7, #89C47C'; // Other options are gray
        }
    
        if (optionButton.innerText === selectedOption) {
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

    document.getElementById('next-btn').addEventListener('click', function() {
      const rangeValue = parseInt(document.querySelector('.range').value);
      const correctAnswer = parseInt(questions[currentQuestionIndex].answer);
      const options = document.getElementById('options').querySelectorAll('button');

      options.forEach(optionButton => {
        const optionTextWithoutUnit = parseInt(optionButton.innerText.split(' ')[0]);

        if (optionTextWithoutUnit === rangeValue && rangeValue === correctAnswer) {
          optionButton.style.background = 'linear-gradient(to right, #18DE00, #00FF97)'; // Correct answer is always green
          score++; // Add 1 point for correct answer
        } else if (optionTextWithoutUnit === rangeValue && rangeValue !== correctAnswer) {
          optionButton.style.background = 'linear-gradient(to right, #C66666, #C80000)'; // Selected incorrect answer is red
        } else {
          if (optionTextWithoutUnit === correctAnswer) {
            optionButton.style.background = 'linear-gradient(to right, #18DE00, #00FF97)'; // Correct answer is always green
          } else {
            optionButton.style.background = 'linear-gradient(to right, #B7B7B7, #89C47C'; // Other options are gray
          }
        }
        optionButton.disabled = true; // Disable all options
      });

      document.getElementById('score_t').innerText = score; // Update the score display

      // Disable range input
      const rangeInput = document.querySelector('.range');
      rangeInput.disabled = true;

      // Disable Next button
      const nextButton = document.getElementById('next-btn');
      nextButton.disabled = true;

      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length && questionsAnswered < 5) { // Continue if not at the end of questions or not answered 5 questions
          displayQuestion();
          options.forEach(optionButton => {
            optionButton.disabled = false; // Enable options for the new question
            optionButton.style.backgroundColor = ''; // Reset background color
          });
          // Enable range input
          rangeInput.disabled = false;
          // Enable Next button
          nextButton.disabled = false;
        } else {
          endQuiz();
        }
      }, 2000);
    });

    function endQuiz() {
      document.getElementById('quiz-container').style.display = 'none';
      document.getElementById('img_4').style.display = 'none';
      document.getElementById('score_text').style.display = 'block';
      document.getElementById('total_points').innerHTML = `${score} / 5`;
      document.getElementById('total_points').style.display = 'block';
      document.getElementById('b_main').style.display = 'block';
      document.getElementById('question_bg').style.left = '0%';
      document.getElementById('question_bg').style.width = '90%';
      /*document.getElementById('total_points').innerHTML = `${score}`;*/
      
      setTimeout(function() {
        window.location.href = '../index.html';
      }, 20000); // 6000 milliseconds = 6 seconds
      
      /*alert(`Quiz ended! Your final score is ${score}`);
      document.getElementById('next-btn').style.display = 'block';*/
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
