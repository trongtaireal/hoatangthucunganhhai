// Nội dung file script.js - REMOVED Mobile Nav Toggle Logic

document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation Toggle Logic REMOVED ---

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach((item, index) => {
            const questionButton = item.querySelector('.faq-question');
            const answerPanel = item.querySelector('.faq-answer');
            const icon = questionButton.querySelector('.faq-icon');
            if (questionButton && answerPanel && icon) {
                const panelId = `faq-answer-${index}`;
                questionButton.setAttribute('aria-expanded', 'false');
                answerPanel.setAttribute('id', panelId);
                questionButton.setAttribute('aria-controls', panelId);
                questionButton.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            const otherIcon = otherItem.querySelector('.faq-icon');
                            const otherButton = otherItem.querySelector('.faq-question');
                            if(otherAnswer) otherAnswer.style.maxHeight = null;
                            if(otherIcon) otherIcon.textContent = '+';
                            if(otherButton) otherButton.setAttribute('aria-expanded', 'false');
                        }
                    });
                    item.classList.toggle('active');
                    if (item.classList.contains('active')) {
                        answerPanel.style.maxHeight = answerPanel.scrollHeight + "px";
                        icon.textContent = '−';
                        questionButton.setAttribute('aria-expanded', 'true');
                    } else {
                        answerPanel.style.maxHeight = null;
                        icon.textContent = '+';
                        questionButton.setAttribute('aria-expanded', 'false');
                    }
                });
            } else { console.warn(`FAQ item ${index} missing elements.`); }
        });
    } else { console.log("No FAQ items found."); }

    // --- Hero Image Slider ---
    const heroSlider = document.querySelector('.hero-slider');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroSliderContainer = document.querySelector('.hero-slider-container');
    const heroDotsContainer = document.querySelector('.hero-slider-nav-dots');

    if (heroSlider && heroSlides.length > 1 && heroSliderContainer && heroDotsContainer) {
        let currentHeroSlide = 0;
        const totalHeroSlides = heroSlides.length;
        const heroSlideInterval = 3000;
        let heroSlideTimer;

        function createHeroDots() {
            heroDotsContainer.innerHTML = '';
            heroSlides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.dataset.index = index;
                heroDotsContainer.appendChild(dot);
            });
        }
        function updateActiveHeroDot() {
            const dots = heroDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentHeroSlide);
            });
        }
        function moveToHeroSlide(slideIndex) {
            currentHeroSlide = (slideIndex + totalHeroSlides) % totalHeroSlides;
            heroSlider.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
            heroSlider.style.transform = `translateX(-${currentHeroSlide * 100}%)`;
            updateActiveHeroDot();
        }
        function nextHeroSlide() { moveToHeroSlide(currentHeroSlide + 1); }
        function startHeroSlider() { clearInterval(heroSlideTimer); heroSlideTimer = setInterval(nextHeroSlide, heroSlideInterval); }

        createHeroDots();
        updateActiveHeroDot();
        startHeroSlider();
        heroSliderContainer.addEventListener('mouseenter', () => { clearInterval(heroSlideTimer); });
        heroSliderContainer.addEventListener('mouseleave', () => { startHeroSlider(); });
        heroDotsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('dot')) {
                const index = parseInt(event.target.dataset.index);
                moveToHeroSlide(index);
                startHeroSlider();
            }
        });
    } else if (heroSlides.length <= 1) {
        if (heroDotsContainer) heroDotsContainer.style.display = 'none';
        console.log("Hero slider needs more than one slide for navigation.");
    } else {
        console.log("Hero slider elements not found or incomplete.");
    }

    // --- Pricing Card Mobile Slider ---
    const scrollContainer = document.querySelector('.pricing-scroll-container');
    const pricingGrid = document.querySelector('.pricing-grid');
    const pricingCards = document.querySelectorAll('.pricing-card');
    const pricingDotsContainer = document.querySelector('.pricing-nav-dots');

    if (scrollContainer && pricingGrid && pricingCards.length > 1 && pricingDotsContainer) {
        let cardWidth = 0;
        let gap = 0;
        let visibleWidth = 0;
        let debounceTimer;
        let isMobileLayout = false;
        let debouncedScrollHandler;

        function calculatePricingDimensions() {
            if (pricingCards.length > 0 && isMobileLayout) {
                const cardStyle = window.getComputedStyle(pricingCards[0]);
                cardWidth = pricingCards[0].offsetWidth;
                gap = parseInt(cardStyle.marginRight) || parseInt(window.getComputedStyle(pricingGrid).gap) || 15;
                visibleWidth = scrollContainer.offsetWidth;
            }
        }
        function createPricingDots() {
            pricingDotsContainer.innerHTML = '';
            pricingCards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to price card ${index + 1}`);
                dot.dataset.index = index;
                pricingDotsContainer.appendChild(dot);
            });
            updateActivePricingDot();
        }
        function updateActivePricingDot() {
             if (!isMobileLayout) return;
             if (visibleWidth === 0 || cardWidth === 0) calculatePricingDimensions();
             if (visibleWidth === 0) return;

            const scrollLeft = scrollContainer.scrollLeft;
            const centerScroll = scrollLeft + visibleWidth / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            pricingCards.forEach((card, index) => {
                 const gridPaddingLeft = parseInt(window.getComputedStyle(pricingGrid).paddingLeft || '0');
                 const cardLeft = card.offsetLeft - gridPaddingLeft;
                 const cardCenter = cardLeft + cardWidth / 2;
                const distance = Math.abs(cardCenter - centerScroll);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });
            const dots = pricingDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => { dot.classList.toggle('active', index === closestIndex); });
        }
        function scrollToPricingCard(index) {
             if (!isMobileLayout || !pricingCards[index]) return;
             calculatePricingDimensions();
             const gridPaddingLeft = parseInt(window.getComputedStyle(pricingGrid).paddingLeft || '0');
             const cardLeft = pricingCards[index].offsetLeft - gridPaddingLeft;
             const scrollTarget = cardLeft - (visibleWidth / 2) + (cardWidth / 2);
             scrollContainer.scrollTo({ left: scrollTarget, behavior: 'smooth' });
        }
        function debounce(func, wait) {
            return function executedFunction(...args) {
                const later = () => { clearTimeout(debounceTimer); func(...args); };
                clearTimeout(debounceTimer); debounceTimer = setTimeout(later, wait);
            };
        }

        debouncedScrollHandler = debounce(updateActivePricingDot, 100);

        function initializeMobileSlider() {
            const currentlyMobile = window.innerWidth <= 768;
            if (currentlyMobile) {
                if (!isMobileLayout) {
                    isMobileLayout = true;
                    calculatePricingDimensions();
                    createPricingDots();
                    scrollContainer.addEventListener('scroll', debouncedScrollHandler, { passive: true });
                    pricingDotsContainer.style.display = 'flex';
                     pricingDotsContainer.style.justifyContent = 'center';
                    setTimeout(updateActivePricingDot, 50);
                }
            } else {
                if (isMobileLayout) {
                    isMobileLayout = false;
                    pricingDotsContainer.innerHTML = '';
                    pricingDotsContainer.style.display = 'none';
                    scrollContainer.removeEventListener('scroll', debouncedScrollHandler);
                    scrollContainer.scrollTo({ left: 0 });
                    cardWidth = 0;
                    visibleWidth = 0;
                }
            }
        }
         pricingDotsContainer.addEventListener('click', (event) => {
            if (isMobileLayout && event.target.classList.contains('dot')) {
                 const index = parseInt(event.target.dataset.index);
                 scrollToPricingCard(index);
            }
         });
        initializeMobileSlider();
        window.addEventListener('resize', debounce(initializeMobileSlider, 250));
    } else {
        // console.log("Pricing scroll elements not found or not enough cards.");
    }
});