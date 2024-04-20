let currentQuestionIndex = 0;
let score = 0;
let questionsAnswered = 0; // Track the number of questions answered
let timer;

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    const questions = shuffleArray(data.questions).slice(0, 5); // Select the first 5 questions

   /*function displayQuestion() {
      const question = questions[currentQuestionIndex];
      document.getElementById('question').innerText = question.question;
      document.getElementById('options').innerHTML = '';

      question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', () => selectAnswer(option, question.answer));
        document.getElementById('options').appendChild(button);
      });

      startTimer();
    }*/
    function displayQuestion() {
      const question = questions[currentQuestionIndex];
      document.getElementById('question').innerText = question.question;
      document.getElementById('options').innerHTML = '';
    
      question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = `${option} ${question.unit}`; // Add unité to the option with a space
        button.addEventListener('click', () => selectAnswer(option, question.answer));
        document.getElementById('options').appendChild(button);
        document.querySelectorAll('#options button').forEach(button => {
          button.style.background = 'linear-gradient(to right, #6ABF4B, #6ADA41)'; // Add a red background to all option buttons
        });
      });
    
      startTimer();
    }
    

    function startTimer() {
      let timeLeft = 30;
      document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;
      timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;
        if (timeLeft === 0) {
          clearInterval(timer);
          selectAnswer('', questions[currentQuestionIndex].answer); // Timeout, select no answer
        }
      }, 1000);
    }

    /*function selectAnswer(selectedOption, correctAnswer) {
      clearInterval(timer);
      questionsAnswered++; // Increment the number of questions answered
      
      const options = document.getElementById('options').querySelectorAll('button');
      options.forEach(option => {
        option.disabled = true; // Disable all options
        
        if (option.innerText === correctAnswer) {
          option.style.backgroundColor = 'green'; // Correct answer is always green
          
        } else {
          option.style.backgroundColor = 'lightgray'; // Other options are gray
        }

        if (option.innerText === selectedOption) { //if (option.innerText.startsWith(selectedOption)) { //
          if (selectedOption === correctAnswer) {
            option.style.backgroundColor = 'green'; // Selected correct answer is green
            score++; // Add 1 point for correct answer
          } else {
            option.style.backgroundColor = 'red'; // Selected incorrect answer is red
          }
        }
      });
      document.getElementById('score').innerText = score; // Update the score display

      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length && questionsAnswered < 5) { // Continue if not at the end of questions or not answered 5 questions
          displayQuestion();
          options.forEach(option => {
            option.disabled = false; // Enable options for the new question
            option.style.backgroundColor = ''; // Reset background color
          });
        } else {
          endQuiz();
        }
      }, 2000);
    }*/
    

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
      document.getElementById('score').innerText = score; // Update the score display
    
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
      document.getElementById('next-btn').style.display = 'none';
    }

    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    displayQuestion();
    document.getElementById('score').innerText = score;
  })
  .catch(error => console.error('Error fetching questions:', error));
