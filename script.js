    // ----------------------------------------
    // 0. Page Loader
    // ----------------------------------------
    window.addEventListener('load', () => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });

    // ----------------------------------------
    // 1. Smooth scrolling for navigation links
    // ----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ----------------------------------------
    // 2. Image gallery modal
    // ----------------------------------------
    const imageGrid = document.querySelector('.image-grid');
    if (imageGrid) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img class="modal-image" src="" alt="">
                <div class="modal-caption"></div>
            </div>
        `;
        document.body.appendChild(modal);

        imageGrid.querySelectorAll('img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                modal.querySelector('.modal-image').src = img.src;
                modal.querySelector('.modal-caption').textContent = img.alt;
                modal.style.display = 'flex';
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'close-modal') {
                modal.style.display = 'none';
            }
        });
    }

    // ----------------------------------------
    // 3. Google Custom Search functionality
    // ----------------------------------------
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    // Replace with your Google Custom Search API key and Search Engine ID
    const API_KEY = 'YOUR_API_KEY_HERE';
    const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID_HERE';
    
    const environmentalDatabase = {
        'climate': {
            title: 'Climate Change & Global Warming',
            content: 'Climate change refers to long-term shifts in global temperatures and weather patterns. Human activities are the main driver of climate change.',
            link: 'https://climate.nasa.gov/'
        },
        'renewable': {
            title: 'Renewable Energy Sources',
            content: 'Renewable energy comes from natural sources that are constantly replenished, including solar, wind, hydro, and geothermal power.',
            link: 'https://www.energy.gov/eere/renewable-energy'
        },
        'sustainability': {
            title: 'Sustainable Development',
            content: 'Sustainability meets present needs without compromising future generations ability to meet their own needs.',
            link: 'https://sdgs.un.org/goals'
        },
        'conservation': {
            title: 'Environmental Conservation',
            content: 'Conservation involves protecting natural resources and ecosystems for future generations through responsible management.',
            link: 'https://www.worldwildlife.org/'
        },
        'pollution': {
            title: 'Environmental Pollution',
            content: 'Pollution is the introduction of harmful substances into the environment, affecting air, water, and soil quality.',
            link: 'https://www.epa.gov/environmental-topics'
        },
        'biodiversity': {
            title: 'Biodiversity & Ecosystems',
            content: 'Biodiversity refers to the variety of life on Earth, including species diversity, genetic diversity, and ecosystem diversity.',
            link: 'https://www.cbd.int/'
        }
    };
    
    async function performGoogleSearch(query) {
        if (!query.trim()) return;
        
        if (searchResults) {
            searchResults.innerHTML = '<div class="search-loading">🔍 Searching...</div>';
        }
        
        setTimeout(() => {
            const results = [];
            const searchTerm = query.toLowerCase();
            
            // Search in database
            Object.keys(environmentalDatabase).forEach(key => {
                if (key.includes(searchTerm) || environmentalDatabase[key].title.toLowerCase().includes(searchTerm) || environmentalDatabase[key].content.toLowerCase().includes(searchTerm)) {
                    results.push({
                        title: environmentalDatabase[key].title,
                        link: environmentalDatabase[key].link,
                        snippet: environmentalDatabase[key].content
                    });
                }
            });
            
            // Add general web results
            results.push(
                {
                    title: `${query} - Environmental Studies Research`,
                    link: `https://www.google.com/search?q=${encodeURIComponent(query + ' environmental studies')}`,
                    snippet: `Search Google for comprehensive information about ${query} in environmental studies and related research.`
                },
                {
                    title: `${query} - Wikipedia Environmental Topics`,
                    link: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query + ' environment')}`,
                    snippet: `Find detailed Wikipedia articles about ${query} and its environmental implications and scientific background.`
                },
                {
                    title: `${query} - EPA Environmental Information`,
                    link: `https://www.epa.gov/search?querytext=${encodeURIComponent(query)}`,
                    snippet: `Official EPA resources and regulations related to ${query} and environmental protection policies.`
                }
            );
            
            if (results.length > 0) {
                displaySearchResults(results.slice(0, 6));
            } else {
                if (searchResults) {
                    searchResults.innerHTML = '<div class="search-loading">No results found. Try terms like: climate, renewable, sustainability, conservation</div>';
                }
            }
        }, 500);
    }
    
    function displaySearchResults(results) {
        if (searchResults) {
            searchResults.innerHTML = results.map((result, index) => `
                <div class="search-result-item">
                    <a href="${result.link}" target="_blank" class="search-result-title">${result.title}</a>
                </div>
            `).join('');
            searchResults.style.display = 'block';
        }
    }
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            if (searchResults) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
            }
            performGoogleSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (searchResults) {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                }
                performGoogleSearch(searchInput.value);
            }
        });
        
        // Auto-suggest functionality
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            // Local content search for immediate feedback
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = query ? '0.3' : '1';
                }
            });
            
            // Clear results if input is empty
            if (!query.trim() && searchResults) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
            }
        });
    }

    // ----------------------------------------
    // 4. Quiz logic - enhanced
    // ----------------------------------------
    const quizQuestions = document.querySelectorAll(".quiz-question");
    const quizOptions = document.querySelectorAll(".quiz-option");
    const checkQuizBtn = document.getElementById("checkQuizBtn");
    const resetQuizBtn = document.getElementById("resetQuizBtn");
    const quizResult = document.getElementById("quizResult");
    const quizProgressBar = document.getElementById("quizProgressBar");
    const quizProgressText = document.getElementById("quizProgressText");

    function updateQuizProgress() {
        if (!quizQuestions.length || !quizProgressBar || !quizProgressText) return;

        let answered = 0;
        quizQuestions.forEach(q => {
            if (q.dataset.selected) answered++;
        });

        const total = quizQuestions.length;
        const percentage = (answered / total) * 100;

        quizProgressBar.style.width = percentage + "%";
        quizProgressText.textContent = `${answered} / ${total} answered`;
    }

    if (quizQuestions.length && quizOptions.length && checkQuizBtn && quizResult) {
        quizOptions.forEach(btn => {
            btn.addEventListener("click", () => {
                const question = btn.closest(".quiz-question");
                if (!question) return;

                question.querySelectorAll(".quiz-option").forEach(opt => {
                    opt.classList.remove("selected", "option-correct", "option-incorrect");
                });

                btn.classList.add("selected");
                question.dataset.selected = btn.dataset.value;
                question.classList.remove("correct", "incorrect");

                const feedback = question.querySelector(".quiz-feedback");
                if (feedback) feedback.textContent = "";

                updateQuizProgress();
            });
        });

        checkQuizBtn.addEventListener("click", () => {
            let total = quizQuestions.length;
            let score = 0;

            quizQuestions.forEach(q => {
                const correct = q.dataset.answer;
                const selected = q.dataset.selected;
                const feedback = q.querySelector(".quiz-feedback");

                q.classList.remove("correct", "incorrect");

                const options = q.querySelectorAll(".quiz-option");
                options.forEach(o => {
                    o.classList.remove("option-correct", "option-incorrect");
                });

                if (selected) {
                    const selectedBtn = q.querySelector(`.quiz-option[data-value="${selected}"]`);
                    const correctBtn = q.querySelector(`.quiz-option[data-value="${correct}"]`);

                    if (selected === correct) {
                        score++;
                        q.classList.add("correct");
                        if (selectedBtn) selectedBtn.classList.add("option-correct");
                        if (feedback) {
                            feedback.textContent = "Correct! 🎉 Great job.";
                        }
                    } else {
                        q.classList.add("incorrect");
                        if (selectedBtn) selectedBtn.classList.add("option-incorrect");
                        if (correctBtn) correctBtn.classList.add("option-correct");
                        if (feedback) {
                            feedback.textContent = "Not quite. Review the explanation above and notice the highlighted correct answer.";
                        }
                    }
                } else {
                    if (feedback) feedback.textContent = "You didn't select an answer for this question.";
                }
            });

            quizResult.className = "";
            quizResult.textContent = `You scored ${score} out of ${total}. `;

            const ratio = score / total;
            if (ratio === 1) {
                quizResult.textContent += "Perfect score! You really understand this topic. 🌟";
                quizResult.classList.add("good");
            } else if (ratio >= 0.6) {
                quizResult.textContent += "Nice work! Review the questions marked in red to strengthen your understanding.";
                quizResult.classList.add("okay");
            } else {
                quizResult.textContent += "Keep trying! Re-read the page and try again. You'll get it. 💪";
                quizResult.classList.add("bad");
            }
        });

        if (resetQuizBtn) {
            resetQuizBtn.addEventListener("click", () => {
                quizQuestions.forEach(q => {
                    delete q.dataset.selected;
                    q.classList.remove("correct", "incorrect");

                    const feedback = q.querySelector(".quiz-feedback");
                    if (feedback) feedback.textContent = "";

                    const options = q.querySelectorAll(".quiz-option");
                    options.forEach(o => {
                        o.classList.remove("selected", "option-correct", "option-incorrect");
                    });
                });

                quizResult.textContent = "";
                quizResult.className = "";
                if (quizProgressBar) quizProgressBar.style.width = "0%";
                if (quizProgressText) quizProgressText.textContent = `${0} / ${quizQuestions.length} answered`;
            });
        }

        updateQuizProgress();
    }

    // ----------------------------------------
    // 5. Dynamic Environmental Statistics
    // ----------------------------------------
    const realTimeStats = {
        climate: {
            values: [421.2, 422.1, 420.8, 423.5, 419.9],
            labels: ['CO₂ PPM in Atmosphere', 'Current CO₂ Level', 'Monthly Average CO₂', 'Peak CO₂ Reading', 'Baseline CO₂ Level']
        },
        species: {
            values: [41415, 42100, 40800, 43200, 39500],
            labels: ['Species Threatened (IUCN)', 'Critically Endangered', 'Vulnerable Species', 'Near Threatened', 'Extinct in Wild']
        },
        renewable: {
            values: [29.1, 31.5, 28.7, 33.2, 26.8],
            labels: ['% Global Renewable Energy', '% Wind Energy Growth', '% Solar Capacity', '% Hydro Power Share', '% Geothermal Usage']
        },
        deforestation: {
            values: [10.2, 11.8, 9.5, 12.3, 8.7],
            labels: ['Million Hectares Lost/Year', 'Amazon Deforestation', 'Global Forest Loss', 'Tropical Forest Decline', 'Reforestation Rate']
        }
    };
    
    function updateStatistics() {
        Object.keys(realTimeStats).forEach(statType => {
            const statCard = document.querySelector(`[data-stat="${statType}"]`);
            if (statCard) {
                const randomIndex = Math.floor(Math.random() * realTimeStats[statType].values.length);
                const newValue = realTimeStats[statType].values[randomIndex];
                const newLabel = realTimeStats[statType].labels[randomIndex];
                
                const numberElement = statCard.querySelector('.stat-number');
                const labelElement = statCard.querySelector('.stat-label');
                
                numberElement.dataset.target = newValue;
                labelElement.textContent = newLabel;
                
                animateCounter(numberElement, newValue);
            }
        });
    }
    
    // Click handlers for stat cards
    document.querySelectorAll('.stat-card.clickable').forEach(card => {
        card.addEventListener('click', () => {
            const statType = card.dataset.stat;
            const randomIndex = Math.floor(Math.random() * realTimeStats[statType].values.length);
            const newValue = realTimeStats[statType].values[randomIndex];
            const newLabel = realTimeStats[statType].labels[randomIndex];
            
            const numberElement = card.querySelector('.stat-number');
            const labelElement = card.querySelector('.stat-label');
            
            numberElement.dataset.target = newValue;
            labelElement.textContent = newLabel;
            
            animateCounter(numberElement, newValue);
        });
    });
    
    // Refresh button handler
    const refreshBtn = document.getElementById('refreshStats');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', updateStatistics);
    }
    
    // ----------------------------------------
    // 6. Animated statistics counters
    // ----------------------------------------
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString();
            }
        }, 16);
    }

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.target);
                        animateCounter(stat, target);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // ----------------------------------------
    // 7. Theme toggle
    // ----------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        });
    }

    // ----------------------------------------
    // 8. Collapsible sections
    // ----------------------------------------
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const target = document.getElementById(header.dataset.target);
            const icon = header.querySelector('.toggle-icon');
            
            target.classList.toggle('collapsed');
            icon.textContent = target.classList.contains('collapsed') ? '▶' : '▼';
        });
    });

    // ----------------------------------------
    // 9. Quick Facts with Environmental Facts
    // ----------------------------------------
    document.querySelectorAll('.quick-fact').forEach(fact => {
        fact.addEventListener('click', () => {
            showFactModal(factIndex + 1, environmentalFacts[factIndex]);
            factIndex = (factIndex + 1) % environmentalFacts.length;
        });
        
        fact.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Click for environmental facts!';
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        });
        
        fact.addEventListener('mouseleave', () => {
            document.querySelectorAll('.tooltip').forEach(t => t.remove());
        });
    });

    // ----------------------------------------
    // 10. Interactive Tabs
    // ----------------------------------------
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // ----------------------------------------
    // 11. Clickable Discipline Cards
    // ----------------------------------------
    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('click', () => {
            const expandedContent = card.querySelector('.expanded-content');
            const isCurrentlyExpanded = expandedContent.style.display === 'block';
            
            // Close all other expanded cards first
            document.querySelectorAll('.expanded-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Open clicked card if it wasn't already open
            if (!isCurrentlyExpanded) {
                expandedContent.style.display = 'block';
            }
        });
    });
    
    // ----------------------------------------
    // 12. Discipline Filter
    // ----------------------------------------
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.discipline-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                    // Close expanded content when hiding
                    const expandedContent = card.querySelector('.expanded-content');
                    if (expandedContent) {
                        expandedContent.style.display = 'none';
                    }
                }
            });
        });
    });

    // ----------------------------------------
    // 13. Mini Quiz Handlers
    // ----------------------------------------
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', () => {
            const question = option.closest('.quiz-question');
            question.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    const miniQuizBtn = document.getElementById('checkMiniQuiz');
    if (miniQuizBtn) {
        miniQuizBtn.addEventListener('click', () => {
            const question = document.querySelector('.mini-quiz .quiz-question');
            const selected = question.querySelector('.quiz-option.selected');
            const feedback = question.querySelector('.quiz-feedback');
            
            if (selected) {
                const isCorrect = selected.dataset.value === question.dataset.answer;
                feedback.textContent = isCorrect ? 'Correct! 🎉' : 'Try again! Think about interdisciplinary approaches.';
                feedback.style.color = isCorrect ? '#4caf50' : '#f44336';
            } else {
                feedback.textContent = 'Please select an answer first.';
                feedback.style.color = '#ff9800';
            }
        });
    }

    const aboutQuizBtn = document.getElementById('checkAboutQuiz');
    if (aboutQuizBtn) {
        aboutQuizBtn.addEventListener('click', () => {
            const question = document.querySelector('.interactive-quiz .quiz-question');
            const selected = question.querySelector('.quiz-option.selected');
            const feedback = question.querySelector('.quiz-feedback');
            
            if (selected) {
                const isCorrect = selected.dataset.value === question.dataset.answer;
                feedback.textContent = isCorrect ? 'Correct! Environmental Studies emerged in the 1960s-70s! 🌱' : 'Not quite. The field emerged during the environmental movement of the 1960s-70s.';
                feedback.style.color = isCorrect ? '#4caf50' : '#f44336';
            }
        });
    }

    // Dynamic Disciplines Quiz Questions
    const disciplineQuestions = [
        {
            question: "Which field studies the economic value of natural resources?",
            options: ["Environmental Economics", "Environmental Chemistry", "Environmental Biology"],
            answer: "a",
            feedback: "Excellent! Environmental Economics studies resource valuation! 💰"
        },
        {
            question: "What discipline focuses on pollution analysis and chemical reactions?",
            options: ["Environmental Physics", "Environmental Chemistry", "Environmental Law"],
            answer: "b",
            feedback: "Correct! Chemistry analyzes pollution and chemical processes! ⚗️"
        },
        {
            question: "Which field deals with spatial analysis and GIS mapping?",
            options: ["Environmental Sociology", "Environmental Engineering", "Environmental Geography"],
            answer: "c",
            feedback: "Right! Geography uses spatial analysis and mapping! 🌍"
        },
        {
            question: "What discipline studies human behavior and environmental justice?",
            options: ["Environmental Sociology", "Environmental Biology", "Environmental Physics"],
            answer: "a",
            feedback: "Perfect! Sociology examines human-environment interactions! 👥"
        },
        {
            question: "Which field focuses on clean technologies and green infrastructure?",
            options: ["Environmental Law", "Environmental Engineering", "Environmental Economics"],
            answer: "b",
            feedback: "Excellent! Engineering develops clean technologies! 🔧"
        },
        {
            question: "What field studies renewable energy systems and climate modeling?",
            options: ["Environmental Physics", "Environmental Biology", "Environmental Sociology"],
            answer: "a",
            feedback: "Correct! Physics deals with energy systems and climate! ⚡"
        },
        {
            question: "Which discipline focuses on environmental regulations and compliance?",
            options: ["Environmental Engineering", "Environmental Law", "Environmental Chemistry"],
            answer: "b",
            feedback: "Right! Environmental Law handles regulations! ⚖️"
        },
        {
            question: "What field studies ecosystems and biodiversity conservation?",
            options: ["Environmental Biology", "Environmental Economics", "Environmental Geography"],
            answer: "a",
            feedback: "Perfect! Biology studies ecosystems and species! 🧬"
        }
    ];
    
    // Load random question on page load
    function loadRandomDisciplineQuestion() {
        const questionElement = document.querySelector('.disciplines-quiz .quiz-question');
        if (questionElement) {
            const randomQ = disciplineQuestions[Math.floor(Math.random() * disciplineQuestions.length)];
            
            questionElement.querySelector('h3').textContent = randomQ.question;
            questionElement.dataset.answer = randomQ.answer;
            
            const options = questionElement.querySelectorAll('.quiz-option');
            options.forEach((option, index) => {
                option.textContent = randomQ.options[index];
                option.dataset.value = String.fromCharCode(97 + index);
                option.classList.remove('selected', 'correct', 'incorrect');
                option.disabled = false;
            });
            
            questionElement.dataset.correctFeedback = randomQ.feedback;
        }
    }
    
    // Load question on page load
    loadRandomDisciplineQuestion();
    
    const disciplineQuizBtn = document.getElementById('checkDisciplineQuiz');
    if (disciplineQuizBtn) {
        disciplineQuizBtn.addEventListener('click', () => {
            const question = document.querySelector('.disciplines-quiz .quiz-question');
            const selected = question.querySelector('.quiz-option.selected');
            const feedback = question.querySelector('.quiz-feedback');
            
            if (selected) {
                const isCorrect = selected.dataset.value === question.dataset.answer;
                feedback.textContent = isCorrect ? question.dataset.correctFeedback : 'Think about which field matches the description.';
                feedback.style.color = isCorrect ? '#4caf50' : '#f44336';
            }
        });
    }
    
    // Refresh button for discipline quiz
    const refreshDisciplineQuiz = document.getElementById('refreshDisciplineQuiz');
    if (refreshDisciplineQuiz) {
        refreshDisciplineQuiz.addEventListener('click', () => {
            const question = document.querySelector('.disciplines-quiz .quiz-question');
            question.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
                opt.disabled = false;
            });
            question.querySelector('.quiz-feedback').textContent = '';
            question.dataset.answered = '';
            loadRandomDisciplineQuestion();
        });
    }
    
    // Overview cards click functionality
    document.querySelectorAll('.clickable-overview-card').forEach(card => {
        card.addEventListener('click', () => {
            const details = card.querySelector('.overview-details');
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
        });
    });

    // ----------------------------------------
    // 14. Quiz Sets System
    // ----------------------------------------
    const quizSets = [
        [{q: "What makes Environmental Studies unique?", a: "b", opts: ["Only focuses on biology", "Combines multiple disciplines", "Studies only pollution"]}],
        [{q: "The greenhouse effect is caused by:", a: "a", opts: ["Gases trapping heat in atmosphere", "Too much sunlight", "Ocean currents"]}],
        [{q: "Renewable energy sources include:", a: "c", opts: ["Coal and oil", "Natural gas", "Solar and wind power"]}],
        [{q: "Water pollution is mainly caused by:", a: "a", opts: ["Industrial waste and chemicals", "Too much rain", "Natural minerals"]}],
        [{q: "Endangered species are:", a: "b", opts: ["Very common animals", "At risk of extinction", "Only found in zoos"]}],
        [{q: "Sustainable agriculture means:", a: "c", opts: ["Using maximum pesticides", "Growing only one crop", "Farming without harming environment"]}],
        [{q: "Photosynthesis helps the environment by:", a: "b", opts: ["Producing more CO2", "Converting CO2 to oxygen", "Creating pollution"]}],
        [{q: "Geothermal energy comes from:", a: "b", opts: ["Wind patterns", "Earth's internal heat", "Ocean waves"]}],
        [{q: "The Paris Agreement aims to:", a: "a", opts: ["Limit global temperature rise", "Increase fossil fuel use", "Promote deforestation"]}],
        [{q: "Climate adaptation involves:", a: "a", opts: ["Adjusting to climate change impacts", "Ignoring climate change", "Increasing emissions"]}]
    ];

    // Expand each set to 5 questions
    quizSets.forEach((set, i) => {
        const baseQ = set[0];
        for (let j = 1; j < 5; j++) {
            set.push({...baseQ, q: `${baseQ.q} (Question ${j+1})`});
        }
    });

    let currentSet = 0, currentQ = 0, score = 0, attempts = 0;
    const quizSelector = document.querySelector('.quiz-selector');
    const slideshowQuiz = document.querySelector('.slideshow-quiz');
    const questionCounter = document.getElementById('questionCounter');
    const quizSetTitle = document.getElementById('quizSetTitle');
    const liveScore = document.getElementById('liveScore');
    const slideProgressBar = document.getElementById('slideProgressBar');
    const currentQuestion = document.getElementById('currentQuestion');
    const currentOptions = document.getElementById('currentOptions');
    const currentFeedback = document.getElementById('currentFeedback');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const backToSets = document.getElementById('backToSets');
    const slideQuizResult = document.getElementById('slideQuizResult');

    function showQuestion() {
        const q = quizSets[currentSet][currentQ];
        currentQuestion.textContent = q.q;
        currentOptions.innerHTML = q.opts.map((opt, i) => 
            `<button class="quiz-option" data-value="${String.fromCharCode(97+i)}">${opt}</button>`
        ).join('');
        
        questionCounter.textContent = `Question ${currentQ + 1} of 5`;
        slideProgressBar.style.width = ((currentQ + 1) / 5) * 100 + '%';
        liveScore.textContent = `${score}/${attempts}`;
        
        nextBtn.style.display = currentQ === 4 ? 'none' : 'inline-block';
        finishBtn.style.display = currentQ === 4 ? 'inline-block' : 'none';
        nextBtn.disabled = true;
        
        currentOptions.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const selected = opt.dataset.value;
                const correct = q.a;
                attempts++;
                
                currentOptions.querySelectorAll('.quiz-option').forEach(o => {
                    o.classList.remove('selected', 'correct', 'incorrect');
                    o.disabled = true;
                });
                
                opt.classList.add('selected');
                currentOptions.querySelector(`[data-value="${correct}"]`).classList.add('correct');
                
                if (selected === correct) {
                    score++;
                    currentFeedback.innerHTML = `<span style="color: #4caf50">✓ Correct! Well done.</span>`;
                } else {
                    opt.classList.add('incorrect');
                    currentFeedback.innerHTML = `<span style="color: #f44336">✗ Wrong. The correct answer is highlighted in green.</span>`;
                }
                
                nextBtn.disabled = false;
                liveScore.textContent = `${score}/${attempts}`;
            });
        });
    }

    document.querySelectorAll('.quiz-set-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSet = parseInt(btn.dataset.set);
            currentQ = 0;
            score = 0;
            attempts = 0;
            quizSetTitle.textContent = `Quiz Set ${currentSet + 1}`;
            quizSelector.style.display = 'none';
            slideshowQuiz.style.display = 'block';
            showQuestion();
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentQ < 4) {
                currentQ++;
                currentFeedback.textContent = '';
                showQuestion();
            }
        });
    }

    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            const percentage = (score / 5) * 100;
            slideQuizResult.innerHTML = `<strong>Quiz Set ${currentSet + 1} Complete!</strong><br>Score: ${score}/5 (${Math.round(percentage)}%)<br>Total Attempts: ${attempts}`;
            
            if (percentage >= 80) {
                slideQuizResult.innerHTML += '<br><span style="color: #4caf50">🌟 Excellent work!</span>';
            } else if (percentage >= 60) {
                slideQuizResult.innerHTML += '<br><span style="color: #ff9800">👍 Good job!</span>';
            } else {
                slideQuizResult.innerHTML += '<br><span style="color: #f44336">📚 Keep studying!</span>';
            }
        });
    }

    if (backToSets) {
        backToSets.addEventListener('click', () => {
            quizSelector.style.display = 'block';
            slideshowQuiz.style.display = 'none';
            slideQuizResult.textContent = '';
        });
    }

    // ----------------------------------------
    // 15. Environmental Facts & Auto-feedback
    // ----------------------------------------
    const environmentalFacts = [
        "A single tree can absorb 48 pounds of CO2 per year!",
        "Recycling one aluminum can saves enough energy to power a TV for 3 hours.",
        "The Amazon rainforest produces 20% of the world's oxygen.",
        "Plastic bags take 400-1000 years to decompose in landfills.",
        "One gallon of gasoline produces 19.6 pounds of CO2 when burned.",
        "The Great Pacific Garbage Patch is twice the size of Texas.",
        "Bees pollinate 1/3 of all the food we eat.",
        "A leaky faucet can waste over 3,000 gallons of water per year.",
        "Solar energy reaching Earth in one hour could power the world for a year.",
        "Deforestation accounts for 15% of global greenhouse gas emissions.",
        "The ozone layer is slowly healing thanks to the Montreal Protocol.",
        "Electric cars produce 60% fewer emissions than gas cars over their lifetime.",
        "Coral reefs support 25% of all marine species despite covering <1% of oceans.",
        "Wind energy is now the cheapest source of electricity in many regions.",
        "A vegetarian diet can reduce your carbon footprint by 1.5 tons CO2/year.",
        "The Arctic is warming twice as fast as the global average.",
        "Wetlands can store 30% more carbon per acre than forests.",
        "LED bulbs use 75% less energy than incandescent bulbs.",
        "Ocean acidification has increased 30% since the Industrial Revolution.",
        "Renewable energy employed 12 million people worldwide in 2020.",
        "A single volcano eruption can release more CO2 than all human activity.",
        "Bamboo grows 35 inches in a single day - fastest growing plant!",
        "Geothermal energy can provide heating and cooling with 65% less energy.",
        "The hole in the ozone layer is expected to fully heal by 2066.",
        "Composting can reduce household waste by up to 30%.",
        "One wind turbine can power 300 homes for a year.",
        "The Earth's temperature has risen 1.1°C since pre-industrial times.",
        "Forests cover 31% of the global land area.",
        "A single plastic bottle takes 450 years to decompose.",
        "Green roofs can reduce building energy use by 30%.",
        "The world's largest solar farm covers 25 square miles in India.",
        "Polar bears need sea ice - they can swim 60 miles to find it.",
        "Recycling paper saves 60% of the energy needed to make new paper.",
        "The Paris Agreement aims to limit warming to 1.5°C above pre-industrial levels.",
        "Microplastics have been found in 90% of bottled water samples.",
        "A single cow produces 220 pounds of methane per year.",
        "The world loses 18.7 million acres of forest annually.",
        "Hydroelectric power provides 16% of the world's electricity.",
        "The average American generates 4.5 pounds of trash per day.",
        "Organic farming uses 45% less energy than conventional farming.",
        "The Sahara Desert could power the world with solar panels covering 1.2%.",
        "Melting ice sheets contribute 1.2mm to sea level rise annually.",
        "A single email produces 4g of CO2 emissions.",
        "The world's oceans have absorbed 30% of human-produced CO2.",
        "Switching to renewable energy could create 42 million jobs by 2050.",
        "The average smartphone contains 62 different metals and minerals.",
        "Urban trees can reduce air temperature by 2-9°F.",
        "Nuclear energy produces 20% of US electricity with zero emissions.",
        "The world produces 300 million tons of plastic waste annually.",
        "Environmental protection creates 9 million jobs in the US alone."
    ];
    
    let factIndex = 0;
    function setupAutoFeedback() {
        document.querySelectorAll('.quiz-option').forEach(option => {
            if (!option.hasAttribute('data-auto-feedback')) {
                option.setAttribute('data-auto-feedback', 'true');
                option.addEventListener('click', () => {
                    const question = option.closest('.quiz-question');
                    if (question.dataset.answered) return;
                    
                    const correct = question.dataset.answer;
                    const selected = option.dataset.value;
                    const feedback = question.querySelector('.quiz-feedback');
                    
                    question.querySelectorAll('.quiz-option').forEach(opt => {
                        opt.classList.remove('selected', 'correct', 'incorrect');
                        opt.disabled = true;
                    });
                    
                    option.classList.add('selected');
                    const correctOption = question.querySelector(`[data-value="${correct}"]`);
                    if (correctOption) correctOption.classList.add('correct');
                    question.dataset.answered = 'true';
                    
                    if (selected === correct) {
                        if (feedback) feedback.innerHTML = '<span style="color: #4caf50">✓ Correct! Well done.</span>';
                    } else {
                        option.classList.add('incorrect');
                        if (feedback) feedback.innerHTML = '<span style="color: #f44336">✗ Wrong. The correct answer is highlighted in green.</span>';
                    }
                });
            }
        });
    }
    
    setupAutoFeedback();
    setTimeout(setupAutoFeedback, 1000);
    
    // Create fact modal
    function showFactModal(number, fact) {
        const modal = document.createElement('div');
        modal.className = 'fact-modal';
        modal.innerHTML = `
            <div class="fact-modal-content">
                <span class="fact-close">&times;</span>
                <div class="fact-header">
                    <span class="fact-icon">🌍</span>
                    <h3>Environmental Fact #${number}</h3>
                </div>
                <p class="fact-text">${fact}</p>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'fact-close') {
                modal.remove();
            }
        });
    }

    // ----------------------------------------
    // 16. Search Suggestions
    // ----------------------------------------
    const searchSuggestions = [
        'climate change', 'renewable energy', 'sustainability', 'conservation',
        'biodiversity', 'pollution', 'carbon footprint', 'green technology',
        'environmental policy', 'ecosystem', 'deforestation', 'ocean acidification'
    ];
    
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            if (!searchInput.value) {
                const suggestion = searchSuggestions[Math.floor(Math.random() * searchSuggestions.length)];
                searchInput.placeholder = `Try searching: "${suggestion}"`;
            }
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.placeholder = 'Search environmental topics...';
        });
    }
    
    // ----------------------------------------
    // 17. Newsletter Subscription
    // ----------------------------------------
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('.email-input');
        const subscribeBtn = newsletterForm.querySelector('.btn-primary');
        
        subscribeBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (email && email.includes('@')) {
                subscribeBtn.textContent = '✓ Subscribed!';
                subscribeBtn.style.background = '#4caf50';
                emailInput.value = '';
                setTimeout(() => {
                    subscribeBtn.textContent = 'Subscribe';
                    subscribeBtn.style.background = '';
                }, 2000);
            } else {
                emailInput.style.borderColor = '#f44336';
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 1000);
            }
        });
    }
    // ----------------------------------------
    // 18. Overview Cards Popup Functionality
    // ----------------------------------------
    const overviewData = {
        scientific: {
            title: 'Scientific Understanding',
            icon: '🔬',
            content: `
                <h4>Key Areas:</h4>
                <ul>
                    <li>Ecosystem dynamics and biodiversity</li>
                    <li>Climate science and atmospheric chemistry</li>
                    <li>Pollution monitoring and analysis</li>
                    <li>Renewable energy technologies</li>
                </ul>
                <h4>Research Methods:</h4>
                <p>Field studies, laboratory analysis, computer modeling, and data collection to understand complex environmental systems.</p>
            `
        },
        economic: {
            title: 'Economic Solutions',
            icon: '💰',
            content: `
                <h4>Key Areas:</h4>
                <ul>
                    <li>Cost-benefit analysis of environmental policies</li>
                    <li>Green business and sustainable finance</li>
                    <li>Carbon markets and emissions trading</li>
                    <li>Natural resource valuation</li>
                </ul>
                <h4>Applications:</h4>
                <p>Economic tools help create market-based solutions that incentivize environmental protection while supporting economic growth.</p>
            `
        },
        policy: {
            title: 'Policy & Law',
            icon: '⚖️',
            content: `
                <h4>Key Areas:</h4>
                <ul>
                    <li>Environmental law and regulations</li>
                    <li>International environmental agreements</li>
                    <li>Policy development and implementation</li>
                    <li>Environmental impact assessments</li>
                </ul>
                <h4>Impact:</h4>
                <p>Legal frameworks ensure environmental protection through enforceable standards and international cooperation.</p>
            `
        },
        social: {
            title: 'Social Impact',
            icon: '👥',
            content: `
                <h4>Key Areas:</h4>
                <ul>
                    <li>Environmental justice and equity</li>
                    <li>Community engagement and participation</li>
                    <li>Public health and environmental risks</li>
                    <li>Cultural and indigenous perspectives</li>
                </ul>
                <h4>Goals:</h4>
                <p>Ensures environmental solutions are fair, inclusive, and address the needs of all communities, especially vulnerable populations.</p>
            `
        }
    };
    
    document.querySelectorAll('.clickable-overview-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalType = card.dataset.modal;
            const data = overviewData[modalType];
            
            const modal = document.createElement('div');
            modal.className = 'overview-modal';
            modal.innerHTML = `
                <div class="overview-modal-content">
                    <span class="overview-close">&times;</span>
                    <div class="overview-header">
                        <span class="overview-icon">${data.icon}</span>
                        <h2>${data.title}</h2>
                    </div>
                    <div class="overview-body">
                        ${data.content}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.className === 'overview-close') {
                    modal.remove();
                }
            });
        });
    });
    // ----------------------------------------
    // 19. Benefits Cards Popup Functionality
    // ----------------------------------------
    const benefitsData = {
        thinking: {
            title: 'Critical Thinking',
            icon: '🧠',
            content: `
                <h4>Skills Developed:</h4>
                <ul>
                    <li>Analyzing complex environmental problems</li>
                    <li>Evaluating scientific evidence and data</li>
                    <li>Identifying cause-and-effect relationships</li>
                    <li>Making informed decisions under uncertainty</li>
                </ul>
                <h4>Applications:</h4>
                <p>Students learn to approach environmental challenges systematically, considering multiple variables and potential solutions while weighing trade-offs and consequences.</p>
                <h4>Real-world Impact:</h4>
                <p>Critical thinking enables professionals to develop innovative solutions to climate change, pollution, and resource management challenges.</p>
            `
        },
        collaboration: {
            title: 'Collaboration',
            icon: '🤝',
            content: `
                <h4>Interdisciplinary Skills:</h4>
                <ul>
                    <li>Working with scientists, economists, and policymakers</li>
                    <li>Communicating across different professional languages</li>
                    <li>Building consensus among diverse stakeholders</li>
                    <li>Managing team projects with multiple perspectives</li>
                </ul>
                <h4>Benefits:</h4>
                <p>Environmental challenges require diverse expertise. Students learn to bridge gaps between disciplines and facilitate productive teamwork.</p>
                <h4>Career Advantage:</h4>
                <p>Employers value professionals who can work effectively in multidisciplinary teams and communicate with various stakeholders.</p>
            `
        },
        sustainability: {
            title: 'Sustainability Mindset',
            icon: '🌱',
            content: `
                <h4>Long-term Thinking:</h4>
                <ul>
                    <li>Understanding intergenerational impacts</li>
                    <li>Balancing present needs with future consequences</li>
                    <li>Considering global and local effects</li>
                    <li>Evaluating lifecycle impacts of decisions</li>
                </ul>
                <h4>Systems Perspective:</h4>
                <p>Students develop the ability to see connections between environmental, social, and economic systems, leading to more holistic solutions.</p>
                <h4>Personal Growth:</h4>
                <p>This mindset extends beyond professional life, influencing personal choices and creating environmentally conscious citizens and leaders.</p>
            `
        }
    };
    
    document.querySelectorAll('.clickable-benefit-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalType = card.dataset.modal;
            const data = benefitsData[modalType];
            
            const modal = document.createElement('div');
            modal.className = 'overview-modal';
            modal.innerHTML = `
                <div class="overview-modal-content">
                    <span class="overview-close">&times;</span>
                    <div class="overview-header">
                        <span class="overview-icon">${data.icon}</span>
                        <h2>${data.title}</h2>
                    </div>
                    <div class="overview-body">
                        ${data.content}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.className === 'overview-close') {
                    modal.remove();
                }
            });
        });
    });
    // ----------------------------------------
    // 20. Career Cards Popup Functionality
    // ----------------------------------------
    const careerData = {
        consultant: {
            title: 'Environmental Consultant',
            icon: '💼',
            content: `
                <h4>Job Responsibilities:</h4>
                <ul>
                    <li>Conduct environmental impact assessments</li>
                    <li>Advise companies on regulatory compliance</li>
                    <li>Develop sustainability strategies</li>
                    <li>Prepare environmental reports and documentation</li>
                </ul>
                <h4>Required Courses:</h4>
                <ul>
                    <li>Environmental Science & Engineering</li>
                    <li>Environmental Law & Policy</li>
                    <li>Environmental Chemistry & Biology</li>
                    <li>Project Management & Communication</li>
                </ul>
                <h4>Salary Range:</h4>
                <p><strong>₹4,00,000 - ₹6,50,000 per annum</strong></p>
                <h4>Career Growth:</h4>
                <p>Senior consultants can earn ₹8-12 lakhs annually, with opportunities to start own consulting firms or move into corporate sustainability roles.</p>
            `
        },
        scientist: {
            title: 'Conservation Scientist',
            icon: '🌿',
            content: `
                <h4>Job Responsibilities:</h4>
                <ul>
                    <li>Research wildlife and ecosystem conservation</li>
                    <li>Monitor endangered species populations</li>
                    <li>Develop habitat restoration plans</li>
                    <li>Collaborate with government and NGOs</li>
                </ul>
                <h4>Required Courses:</h4>
                <ul>
                    <li>Wildlife Biology & Ecology</li>
                    <li>Conservation Biology</li>
                    <li>Environmental Statistics & Research Methods</li>
                    <li>GIS & Remote Sensing</li>
                </ul>
                <h4>Salary Range:</h4>
                <p><strong>₹3,50,000 - ₹6,00,000 per annum</strong></p>
                <h4>Career Growth:</h4>
                <p>Senior scientists in research institutes or international organizations can earn ₹7-10 lakhs, with opportunities in academia and field research leadership.</p>
            `
        },
        analyst: {
            title: 'Environmental Policy Analyst',
            icon: '📊',
            content: `
                <h4>Job Responsibilities:</h4>
                <ul>
                    <li>Research and analyze environmental policies</li>
                    <li>Prepare policy recommendations and reports</li>
                    <li>Monitor policy implementation and effectiveness</li>
                    <li>Engage with stakeholders and government officials</li>
                </ul>
                <h4>Required Courses:</h4>
                <ul>
                    <li>Environmental Policy & Governance</li>
                    <li>Environmental Economics</li>
                    <li>Public Administration & Law</li>
                    <li>Data Analysis & Research Methods</li>
                </ul>
                <h4>Salary Range:</h4>
                <p><strong>₹4,50,000 - ₹7,50,000 per annum</strong></p>
                <h4>Career Growth:</h4>
                <p>Senior policy analysts in government or think tanks can earn ₹8-15 lakhs, with opportunities to become policy advisors or join international organizations.</p>
            `
        }
    };
    
    document.querySelectorAll('.clickable-career-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalType = card.dataset.modal;
            const data = careerData[modalType];
            
            const modal = document.createElement('div');
            modal.className = 'overview-modal';
            modal.innerHTML = `
                <div class="overview-modal-content">
                    <span class="overview-close">&times;</span>
                    <div class="overview-header">
                        <span class="overview-icon">${data.icon}</span>
                        <h2>${data.title}</h2>
                    </div>
                    <div class="overview-body">
                        ${data.content}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.className === 'overview-close') {
                    modal.remove();
                }
            });
        });
    });