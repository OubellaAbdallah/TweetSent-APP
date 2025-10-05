  const canvas = document.getElementById('animationCanvas');
        const ctx = canvas.getContext('2d');

        // Function to resize the canvas to fill the window
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Event listener for window resize
        window.addEventListener('resize', resizeCanvas);
        // Initial resize
        resizeCanvas();

        // Updated words list with an AI/ML theme
        const words = [
            "Sentiment", "Analysis", "Python", "AI", "ML", "Deep Learning",
            "NLP", "TensorFlow", "PyTorch", "Scikit-learn", "Keras",
            "Algorithm", "Model", "Data", "Training", "Inference",
            "Neural Network", "Classification", "Regression", "Clustering",
            "Feature", "Vector", "Tokenize", "Embedding", "Big Data"
        ];
        // Define a list of colors for the words
        const colors = ["#000","#007bff","#fff"];

        const fallingWords = [];
        const gravity = 0.1;
        const maxWords = 20;
        const fontWeight = "bold"; // Define font weight

        /**
         * Constructor for a FallingWord object.
         * @param {string} text - The text content of the word.
         * @param {number} x - The initial x-coordinate.
         * @param {number} y - The initial y-coordinate.
         * @param {number} fontSize - The font size for the word.
         * @param {string} color - The color of the word.
         */
        function FallingWord(text, x, y, fontSize, color) {
            this.text = text;
            this.x = x;
            this.y = y;
            this.dy = Math.random() * 1.5 + 0.5;
            this.fontSize = fontSize;
            this.color = color; // Store the color

            // Set font for this word before measuring its width
            ctx.font = `${fontWeight} ${this.fontSize}px Arial`; // Added font weight
            this.width = ctx.measureText(this.text).width;
        }

        /**
         * Draws the word on the canvas.
         */
        FallingWord.prototype.draw = function() {
            ctx.font = `${fontWeight} ${this.fontSize}px Arial`; // Added font weight
            ctx.fillStyle = this.color; // Use the word's specific color
            ctx.fillText(this.text, this.x, this.y);
        };

        /**
         * Updates the word's position and handles looping.
         */
        FallingWord.prototype.update = function() {
            this.y += this.dy;
            this.dy += gravity;

            if (this.y - this.fontSize > canvas.height) {
                this.y = 0 - this.fontSize;
                this.text = words[Math.floor(Math.random() * words.length)];
                this.fontSize = Math.random() * 20 + 12;
                this.color = colors[Math.floor(Math.random() * colors.length)]; // Assign new random color

                ctx.font = `${fontWeight} ${this.fontSize}px Arial`; // Added font weight
                this.width = ctx.measureText(this.text).width;

                let potentialX = Math.random() * (canvas.width - this.width);
                this.x = potentialX > 0 ? potentialX : 0;
                this.dy = Math.random() * 1.5 + 0.5;
            }

            this.draw();
        };

        /**
         * Adds a new word to the animation.
         */
        function addWord() {
            const text = words[Math.floor(Math.random() * words.length)];
            const tempFontSize = Math.random() * 20 + 12;
            const tempColor = colors[Math.floor(Math.random() * colors.length)]; // Pick a random color

            ctx.font = `${fontWeight} ${tempFontSize}px Arial`; // Added font weight
            const textWidth = ctx.measureText(text).width;

            let initialX = Math.random() * (canvas.width - textWidth);
            if (initialX < 0) initialX = 0;

            const initialY = 0 - tempFontSize;

            fallingWords.push(new FallingWord(text, initialX, initialY, tempFontSize, tempColor));
        }

        for (let i = 0; i < maxWords / 2; i++) {
            addWord();
        }

        /**
         * The main animation loop.
         */
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            fallingWords.forEach(word => {
                word.update();
            });

            if (fallingWords.length < maxWords && Math.random() < 0.02) {
                addWord();
            }
        }

        animate();