$(document).ready(function() {
    // Initialize animations
    initializeAnimations();
    
    // Document sentiment analysis (manual input)
    $('#analyze-btn').click(function() {
        const inputText = $('#input-text').val().trim();
        if (!inputText) {
            showNotification('Please enter some text to analyze', 'warning');
            return;
        }
        
        // Show loading state
        const $btn = $(this);
        const originalText = $btn.html();
        $btn.html('<i class="fas fa-spinner fa-spin"></i> Analyzing...');
        $btn.prop('disabled', true);

        $.ajax({
            url: '/predict',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ text: inputText }),
            success: function(response) {
                // Reset button
                $btn.html(originalText);
                $btn.prop('disabled', false);
                
                // Update sentiment result
                $('#doc-sentiment')
                    .text(response.sentiment)
                    .removeClass('sentiment-positive sentiment-neutral sentiment-negative')
                    .addClass(
                        response.sentiment === "Positive" ? 'sentiment-positive' :
                        response.sentiment === "Neutral" ? 'sentiment-neutral' :
                        'sentiment-negative'
                    );

                $('#doc-confidence').text(response.confidence);
                
                // Update progress bars with animation
                animateProgressBar('#negative-progress', response.probabilities.negative * 100);
                animateProgressBar('#neutral-progress', response.probabilities.neutral * 100);
                animateProgressBar('#positive-progress', response.probabilities.positive * 100);
                
                $('#negative-value').text((response.probabilities.negative * 100).toFixed(1) + "%");
                $('#neutral-value').text((response.probabilities.neutral * 100).toFixed(1) + "%");
                $('#positive-value').text((response.probabilities.positive * 100).toFixed(1) + "%");
                
                $('#doc-keywords').text(response.keywords.join(', '));
                
                showNotification('Analysis complete!', 'success');
            },
            error: function(err) {
                console.error("Prediction error:", err);
                $btn.html(originalText);
                $btn.prop('disabled', false);
                showNotification('Error during analysis. Please try again.', 'error');
            }
        });
    });

    // Hashtag tweet analysis
    $('#search-tweets-btn').on('click', function() {
        const hashtag = $('#hashtag-input').val().trim();
        if (!hashtag) {
            showNotification('Please enter a hashtag', 'warning');
            return;
        }

        // Show loading state
        $('#twitter-loading').show();
        $('#twitter-results-table, #twitter-summary').hide();
        $('#twitter-error').hide();
        $('.wordcloud-image').empty();
        
        const $btn = $(this);
        const originalText = $btn.html();
        $btn.html('<i class="fas fa-spinner fa-spin"></i> Searching...');
        $btn.prop('disabled', true);

        $.ajax({
            url: '/analyze_hashtag',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ hashtag: hashtag }),
            success: function(response) {
                // Reset button and hide loading
                $btn.html(originalText);
                $btn.prop('disabled', false);
                $('#twitter-loading').hide();
                
                if (response.error) {
                    // Show error message
                    $('#twitter-error').show();
                    $('#twitter-error .error-message').text(response.error);
                    return;
                }
                
                // Calculate sentiment counts from tweets array
                const sentimentCounts = {
                    positive: 0,
                    neutral: 0,
                    negative: 0
                };
                
                // Count sentiments from tweets
                response.tweets.forEach(tweet => {
                    if (tweet.sentiment === "Positive") sentimentCounts.positive++;
                    else if (tweet.sentiment === "Neutral") sentimentCounts.neutral++;
                    else if (tweet.sentiment === "Negative") sentimentCounts.negative++;
                });
                
                // Update summary stats
                $('#twitter-positive-count').text(sentimentCounts.positive);
                $('#twitter-neutral-count').text(sentimentCounts.neutral);
                $('#twitter-negative-count').text(sentimentCounts.negative);
                
                // Clear previous results and populate table
                const $tbody = $('#twitter-results-body');
                $tbody.empty();
                
                if (response.tweets.length === 0) {
                    $tbody.append('<tr><td colspan="3">No tweets found</td></tr>');
                } else {
                    response.tweets.forEach(tweet => {
                        const sentimentClass = 
                            tweet.sentiment === "Positive" ? 'sentiment-positive' :
                            tweet.sentiment === "Neutral" ? 'sentiment-neutral' :
                            'sentiment-negative';
                        
                        $tbody.append(`
                            <tr>
                                <td>${tweet.text}</td>
                                <td class="${sentimentClass}">${tweet.sentiment}</td>
                                <td>${tweet.confidence}</td>
                            </tr>
                        `);
                    });
                }
                
                // Show word cloud if available
                if (response.wordcloud) {
                    $('.wordcloud-image').html(`<img src="data:image/png;base64,${response.wordcloud}" alt="Word Cloud">`);
                }
                
                // Display average sentiment if available
                // if (response.avg_sentiment) {
                //     let avgSentimentText = "Average Sentiment: " + response.avg_sentiment;
                //     let $avgSentiment = $(`<div class="avg-sentiment">${avgSentimentText}</div>`);
                //     $('#twitter-summary').append($avgSentiment);
                // }
                
                // Show results
                $('#twitter-summary, #twitter-results-table').show();
                
                showNotification('Twitter analysis complete!', 'success');
            },
            error: function(err) {
                console.error("Twitter analysis error:", err);
                $btn.html(originalText);
                $btn.prop('disabled', false);
                $('#twitter-loading').hide();
                
                $('#twitter-error').show();
                $('#twitter-error .error-message').text('Error analyzing tweets. Please try again.');
                
                showNotification('Error during twitter analysis.', 'error');
            }
        });
    });

    // Tab switching
    $('.tab').on('click', function() {
        const tab = $(this).data('tab');
        $('.tab').removeClass('active');
        $('.tab-content').removeClass('active');
        
        $(this).addClass('active');
        $(`#${tab}-content`).addClass('active');
    });
    
    // Support for both old and new tab class names
    $('.feature-tab').on('click', function() {
        const tab = $(this).data('tab');
        $('.feature-tab').removeClass('active');
        $('.feature-content').removeClass('active');
        
        $(this).addClass('active');
        $(`#${tab}-content`).addClass('active');
    });
    
    // Keyboard shortcuts
    $('#hashtag-input').keypress(function(e) {
        if (e.which === 13) {
            $('#search-tweets-btn').click();
        }
    });
    
    $('#input-text').keypress(function(e) {
        if (e.which === 13 && e.ctrlKey) {
            $('#analyze-btn').click();
        }
    });
});

// Initialize animations and UI elements
function initializeAnimations() {
    // Reset progress bars to zero
    $('.progress-fill').css('width', '0%');
    
    // Add fade in animations to cards
    $('.card').each(function(i) {
        $(this).css({
            'opacity': 0,
            'transform': 'translateY(20px)'
        });
        
        setTimeout(() => {
            $(this).animate({
                'opacity': 1,
                'transform': 'translateY(0)'
            }, 500);
        }, i * 150);
    });
}

// Animate progress bars
function animateProgressBar(selector, value) {
    $(selector).css('width', '0%').animate({
        width: value + '%'
    }, 800, 'swing');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    $('.notification').remove();
    
    // Create notification element
    const $notification = $('<div class="notification"></div>');
    $notification.text(message);
    $notification.addClass(type);
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'error') icon = 'exclamation-circle';
    
    $notification.prepend(`<i class="fas fa-${icon}"></i> `);
    
    // Add to body and animate
    $('body').append($notification);
    
    $notification.css({
        'right': '-300px',
        'opacity': 0
    }).animate({
        'right': '20px',
        'opacity': 1
    }, 300);
    
    // Auto remove after delay
    setTimeout(() => {
        $notification.animate({
            'right': '-300px',
            'opacity': 0
        }, 300, function() {
            $(this).remove();
        });
    }, 5000);
}

// Function to get text sentiment color for styling purposes
function getSentimentColor(sentiment) {
    switch(sentiment.toLowerCase()) {
        case 'positive':
            return 'var(--positive)';
        case 'neutral':
            return 'var(--neutral)';
        case 'negative':
            return 'var(--negative)';
        default:
            return 'var(--text-dark)';
    }
}

// Add notification styles if not already in CSS
$(document).ready(function() {
    if ($('#notification-styles').length === 0) {
        $('head').append(`
            <style id="notification-styles">
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    background: white;
                    color: var(--text-dark);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    max-width: 300px;
                }
                
                .notification i {
                    font-size: 1.25rem;
                }
                
                .notification.success {
                    border-left: 4px solid var(--positive);
                }
                
                .notification.success i {
                    color: var(--positive);
                }
                
                .notification.info {
                    border-left: 4px solid var(--primary);
                }
                
                .notification.info i {
                    color: var(--primary);
                }
                
                .notification.warning {
                    border-left: 4px solid #f59e0b;
                }
                
                .notification.warning i {
                    color: #f59e0b;
                }
                
                .notification.error {
                    border-left: 4px solid var(--negative);
                }
                
                .notification.error i {
                    color: var(--negative);
                }
                
                /* Add styling for average sentiment */
                .avg-sentiment {
                    background-color: rgba(99, 102, 241, 0.05);
                    padding: 1rem;
                    border-radius: var(--radius);
                    text-align: center;
                    font-weight: 600;
                    margin-top: 1rem;
                    color: var(--primary);
                    border: 1px solid var(--primary-light);
                }
            </style>
        `);
    }
});