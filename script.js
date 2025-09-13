// Enhanced MEDUCO Website Scripts
(function() {
	// Initialize common elements
	const year = document.getElementById('year')
	if (year) year.textContent = new Date().getFullYear().toString()

	// Enhanced contact form with animations
	const form = document.getElementById('contactForm')
	const note = document.getElementById('formNote')
	if (form && note) {
		form.addEventListener('submit', (e) => {
			e.preventDefault()
			note.textContent = 'Thanks! We will get back to you shortly.'
			note.style.animation = 'pulse 0.6s ease'
			form.reset()
			setTimeout(() => {
				note.style.animation = ''
			}, 600)
		})
	}


	// Enhanced patient ID generation with animation
	function generatePatientID() {
		const currentYear = new Date().getFullYear().toString().slice(-2)
		const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
		const prefix = 'PAT'
		return `${prefix}-${currentYear}-${randomNum}`
	}

	// Password toggle functionality
	window.togglePassword = function(fieldName) {
		const passwordField = document.querySelector(`input[name="${fieldName}"]`)
		const iconElement = document.getElementById(`${fieldName}-icon`)
		
		if (passwordField && iconElement) {
			if (passwordField.type === 'password') {
				passwordField.type = 'text'
				iconElement.textContent = '🙉'
				iconElement.setAttribute('aria-label', 'Hide password')
			} else {
				passwordField.type = 'password'
				iconElement.textContent = '👁️'
				iconElement.setAttribute('aria-label', 'Show password')
			}
			
			// Add subtle animation
			iconElement.style.transform = 'scale(0.8)'
			setTimeout(() => {
				iconElement.style.transform = 'scale(1)'
			}, 150)
		}
	}

	// Enhanced role switching with smooth transitions (works for both login and signup)
	const roleTabs = document.getElementById('roleTabs')
	const roleInput = document.getElementById('roleInput')
	const loginForm = document.getElementById('loginForm')
	const signupForm = document.getElementById('signupForm')
	const loginNote = document.getElementById('loginNote')
	const signupNote = document.getElementById('signupNote')
	const currentForm = loginForm || signupForm
	
	if (roleTabs && roleInput) {
		roleTabs.addEventListener('click', (e) => {
			const target = e.target
			if (!(target instanceof HTMLElement)) return
			const role = target.getAttribute('data-role')
			if (!role) return
			
			roleInput.value = role
			
			// Enhanced role switching animations
			for (const btn of roleTabs.querySelectorAll('[data-role]')) {
				btn.classList.remove('btn-primary')
				btn.classList.add('btn-outline')
				btn.style.transform = 'scale(0.95)'
			}
			
			target.classList.remove('btn-outline')
			target.classList.add('btn-primary')
			target.style.transform = 'scale(1.05)'
			
			// Add subtle animation to form
			if (currentForm) {
				currentForm.style.animation = 'pulse 0.3s ease'
				setTimeout(() => {
					currentForm.style.animation = ''
				}, 300)
			}
		})
	}

	// Enhanced login form submission (sign-in only)
	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault()
			const data = new FormData(loginForm)
			const email = String(data.get('email') || '')
			const password = String(data.get('password') || '')
			const role = String(data.get('role') || 'patient')
			const submitBtn = loginForm.querySelector('#submitBtn')
			
			// Enhanced loading state
			if (submitBtn) {
				submitBtn.textContent = 'Signing in...'
				submitBtn.disabled = true
				submitBtn.style.opacity = '0.7'
			}
			
			try {
				// Use real API for login
				const response = await window.meducoAPI.login(email, password, role)
				
				if (loginNote) {
					loginNote.innerHTML = `
						<div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; border: 2px solid #10b981; margin-top: 16px;">
							<p style="margin: 0; color: #059669; font-weight: 600;">✅ Signed in successfully. Redirecting...</p>
						</div>
					`
					loginNote.style.animation = 'fadeInUp 0.6s ease'
				}
				
				// Store additional data for compatibility
				if (role === 'patient' && response.user.profile) {
					localStorage.setItem('patientName', `${response.user.profile.first_name} ${response.user.profile.last_name}`)
					localStorage.setItem('patientID', response.user.profile.patient_id)
				} else if (role === 'doctor' && response.user.profile) {
					localStorage.setItem('doctorName', `${response.user.profile.first_name} ${response.user.profile.last_name}`)
				}
				
				const dest = role === 'doctor' ? 'doctor-dashboard.html' : 'patient-dashboard.html'
				setTimeout(() => { window.location.href = dest }, 1500)
				
			} catch (error) {
				console.error('Login failed:', error)
				if (loginNote) {
					loginNote.innerHTML = `
						<div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 2px solid #ef4444; margin-top: 16px;">
							<p style="margin: 0; color: #dc2626; font-weight: 600;">❌ ${error.message || 'Login failed. Please try again.'}</p>
						</div>
					`
					loginNote.style.animation = 'fadeInUp 0.6s ease'
				}
			} finally {
				// Reset button state
				if (submitBtn) {
					submitBtn.textContent = 'Sign In'
					submitBtn.disabled = false
					submitBtn.style.opacity = '1'
				}
			}
		})
	}

	// Enhanced signup form submission
	if (signupForm) {
		signupForm.addEventListener('submit', async (e) => {
			e.preventDefault()
			const data = new FormData(signupForm)
			const role = String(data.get('role') || 'patient')
			const fullName = String(data.get('fullName') || '')
			const email = String(data.get('email') || '')
			const phone = String(data.get('phone') || '')
			const password = String(data.get('password') || '')
			const confirm = String(data.get('confirm') || '')
			const submitBtn = signupForm.querySelector('#submitBtn')
			
			// Validate phone number format
			const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
			if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
				if (signupNote) {
					signupNote.innerHTML = `
						<div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 2px solid #ef4444; margin-top: 16px;">
							<p style="margin: 0; color: #dc2626; font-weight: 600;">❌ Please enter a valid phone number!</p>
						</div>
					`
					signupNote.style.animation = 'fadeInUp 0.6s ease'
				}
				return
			}
			
			// Validate password strength
			const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
			if (!passwordRegex.test(password)) {
				if (signupNote) {
					signupNote.innerHTML = `
						<div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 2px solid #ef4444; margin-top: 16px;">
							<p style="margin: 0; color: #dc2626; font-weight: 600;">❌ Password must contain at least one uppercase letter, one lowercase letter, and one number!</p>
						</div>
					`
					signupNote.style.animation = 'fadeInUp 0.6s ease'
				}
				return
			}

			// Validate password confirmation
			if (password !== confirm) {
				if (signupNote) {
					signupNote.innerHTML = `
						<div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 2px solid #ef4444; margin-top: 16px;">
							<p style="margin: 0; color: #dc2626; font-weight: 600;">❌ Passwords do not match!</p>
						</div>
					`
					signupNote.style.animation = 'fadeInUp 0.6s ease'
				}
				return
			}
			
			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(email)) {
				if (signupNote) {
					signupNote.innerHTML = `
						<div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 2px solid #ef4444; margin-top: 16px;">
							<p style="margin: 0; color: #dc2626; font-weight: 600;">❌ Please enter a valid email address!</p>
						</div>
					`
					signupNote.style.animation = 'fadeInUp 0.6s ease'
				}
				return
			}
			
			// Enhanced loading state
			if (submitBtn) {
				submitBtn.textContent = 'Creating account...'
				submitBtn.disabled = true
				submitBtn.style.opacity = '0.7'
			}
			
			try {
				// Parse full name
				const nameParts = fullName.trim().split(' ')
				const firstName = nameParts[0] || ''
				const lastName = nameParts.slice(1).join(' ') || ''
				
				// Use real API for registration
				const response = await window.meducoAPI.register({
					email,
					password,
					role,
					firstName,
					lastName,
					phone
				})
				
				const userIdField = role === 'patient' ? response.user.patientId : response.user.doctorId
				const displayName = role === 'doctor' ? `Dr. ${fullName}` : fullName
				
				if (signupNote) {
					signupNote.innerHTML = `
						<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; border: 2px solid #0ea5e9; margin-top: 20px; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.1);">
							<h4 style="margin: 0 0 12px; color: #0ea5e9; font-size: 20px;">${role === 'doctor' ? '👨‍⚕️' : '🎉'} Welcome, ${displayName}!</h4>
							${role === 'patient' ? `<p style="margin: 0 0 16px; color: #0ea5e9; font-size: 16px;">Your Patient ID: <strong style="font-size: 22px; background: linear-gradient(135deg, #0ea5e9, #0284c7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${userIdField}</strong></p>` : ''}
							<p style="margin: 0; font-size: 14px; color: #64748b;">${role === 'patient' ? 'Please save this ID. ' : ''}Redirecting to dashboard...</p>
							<div style="margin-top: 16px;">
								<div style="width: 100%; height: 4px; background: #e0f2fe; border-radius: 2px; overflow: hidden;">
									<div style="width: 0%; height: 100%; background: linear-gradient(90deg, #0ea5e9, #0284c7); border-radius: 2px; animation: progressBar 3s linear forwards;"></div>
								</div>
							</div>
						</div>
					`
					signupNote.style.animation = 'fadeInUp 0.6s ease'
				}
				
				// Store additional data for compatibility
				if (role === 'patient') {
					localStorage.setItem('patientID', userIdField)
					localStorage.setItem('patientName', fullName)
				} else if (role === 'doctor') {
					localStorage.setItem('doctorName', fullName)
				}
				
				const dest = role === 'doctor' ? 'doctor-dashboard.html' : 'patient-dashboard.html'
				setTimeout(() => {
					window.location.href = dest
				}, 3000)
				
			} catch (error) {
				console.error('Registration failed:', error)
				if (signupNote) {
					let errorMessage = error.message || 'Registration failed. Please try again.'

					// Display detailed validation errors if available
					if (error.response && error.response.data && error.response.data.errors && Array.isArray(error.response.data.errors)) {
						const errorList = error.response.data.errors.map(err => `<li>${err.msg}</li>`).join('')
						errorMessage = `<div>❌ Validation failed:</div><ul style="text-align: left; margin: 8px 0 0 20px;">${errorList}</ul>`
					}

					signupNote.innerHTML = `
						<div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 2px solid #ef4444; margin-top: 16px;">
							<p style="margin: 0; color: #dc2626; font-weight: 600;">${errorMessage}</p>
						</div>
					`
					signupNote.style.animation = 'fadeInUp 0.6s ease'
				}
			}
				// Reset button state
				if (submitBtn) {
					submitBtn.textContent = 'Sign Up'
					submitBtn.disabled = false
					submitBtn.style.opacity = '1'
				}
			}
		})
	}

	// Enhanced scroll animations
	function animateOnScroll() {
		const elements = document.querySelectorAll('.card, .feature-card, .step, .overview-card')
		
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.style.opacity = '1'
					entry.target.style.transform = 'translateY(0)'
				}
			})
		}, {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		})
		
		elements.forEach(el => {
			el.style.opacity = '0'
			el.style.transform = 'translateY(30px)'
			el.style.transition = 'all 0.6s ease'
			observer.observe(el)
		})
	}

	// Enhanced navigation toggle with smooth animations
	const navToggle = document.getElementById('navToggle')
	const nav = document.getElementById('nav')
	
	if (navToggle && nav) {
		navToggle.addEventListener('click', () => {
			nav.classList.toggle('show')
			
			// Animate toggle button
			const spans = navToggle.querySelectorAll('span')
			if (nav.classList.contains('show')) {
				spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)'
				spans[1].style.opacity = '0'
				spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)'
			} else {
				spans[0].style.transform = 'none'
				spans[1].style.opacity = '1'
				spans[2].style.transform = 'none'
			}
		})
	}

	// Enhanced table row interactions
	function enhanceTables() {
		const tableRows = document.querySelectorAll('tbody tr')
		tableRows.forEach(row => {
			row.addEventListener('mouseenter', () => {
				row.style.transform = 'scale(1.01)'
				row.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
			})
			
			row.addEventListener('mouseleave', () => {
				row.style.transform = 'scale(1)'
				row.style.boxShadow = 'none'
			})
		})
	}

	// Enhanced button interactions
	function enhanceButtons() {
		const buttons = document.querySelectorAll('.btn')
		buttons.forEach(btn => {
			btn.addEventListener('mouseenter', () => {
				btn.style.transform = 'translateY(-2px)'
			})
			
			btn.addEventListener('mouseleave', () => {
				btn.style.transform = 'translateY(0)'
			})
		})
	}

	// Enhanced chart animations
	function animateCharts() {
		const charts = document.querySelectorAll('canvas')
		charts.forEach(chart => {
			chart.style.opacity = '0'
			chart.style.transform = 'scale(0.8)'
			
			setTimeout(() => {
				chart.style.transition = 'all 0.8s ease'
				chart.style.opacity = '1'
				chart.style.transform = 'scale(1)'
			}, 500)
		})
	}

	// Enhanced overview card animations
	function animateOverviewCards() {
		const cards = document.querySelectorAll('.overview-card')
		cards.forEach((card, index) => {
			card.style.opacity = '0'
			card.style.transform = 'translateY(20px)'
			
			setTimeout(() => {
				card.style.transition = 'all 0.6s ease'
				card.style.opacity = '1'
				card.style.transform = 'translateY(0)'
			}, index * 100)
		})
	}

	// Enhanced feature card animations
	function animateFeatureCards() {
		const cards = document.querySelectorAll('.feature-card')
		cards.forEach((card, index) => {
			card.style.opacity = '0'
			card.style.transform = 'translateY(30px)'
			
			setTimeout(() => {
				card.style.transition = 'all 0.6s ease'
				card.style.opacity = '1'
				card.style.transform = 'translateY(0)'
			}, index * 150)
		})
	}

	// Enhanced step animations
	function animateSteps() {
		const steps = document.querySelectorAll('.step')
		steps.forEach((step, index) => {
			step.style.opacity = '0'
			step.style.transform = 'translateY(30px)'
			
			setTimeout(() => {
				step.style.transition = 'all 0.6s ease'
				step.style.opacity = '1'
				step.style.transform = 'translateY(0)'
			}, index * 200)
		})
	}

	// Enhanced hero text animations
	function animateHeroText() {
		const heroElements = document.querySelectorAll('.hero-text h1, .hero-text p, .hero-text .actions')
		heroElements.forEach((el, index) => {
			el.style.opacity = '0'
			el.style.transform = 'translateY(30px)'
			
			setTimeout(() => {
				el.style.transition = 'all 0.8s ease'
				el.style.opacity = '1'
				el.style.transform = 'translateY(0)'
			}, index * 200)
		})
	}

	// Enhanced statistics animations
	function animateStatistics() {
		const statItems = document.querySelectorAll('.stat-item')
		statItems.forEach((item, index) => {
			item.style.opacity = '0'
			item.style.transform = 'translateX(-20px)'
			
			setTimeout(() => {
				item.style.transition = 'all 0.5s ease'
				item.style.opacity = '1'
				item.style.transform = 'translateX(0)'
			}, index * 100)
		})
	}

	// Enhanced mini card animations
	function animateMiniCards() {
		const miniCards = document.querySelectorAll('.mini-card')
		miniCards.forEach((card, index) => {
			card.style.opacity = '0'
			card.style.transform = 'translateY(20px)'
			
			setTimeout(() => {
				card.style.transition = 'all 0.5s ease'
				card.style.opacity = '1'
				card.style.transform = 'translateY(0)'
			}, index * 100)
		})
	}

	// Enhanced form animations
	function animateForms() {
		const formInputs = document.querySelectorAll('.input')
		formInputs.forEach((input, index) => {
			input.style.opacity = '0'
			input.style.transform = 'translateY(20px)'
			
			setTimeout(() => {
				input.style.transition = 'all 0.5s ease'
				input.style.opacity = '1'
				input.style.transform = 'translateY(0)'
			}, index * 100)
		})
	}

	// Enhanced modal animations
	function enhanceModals() {
		const modals = document.querySelectorAll('[id$="Modal"]')
		modals.forEach(modal => {
			modal.addEventListener('show', () => {
				modal.style.display = 'block'
				setTimeout(() => {
					modal.style.opacity = '1'
					modal.style.transform = 'scale(1)'
				}, 10)
			})
			
			modal.addEventListener('hide', () => {
				modal.style.opacity = '0'
				modal.style.transform = 'scale(0.9)'
				setTimeout(() => {
					modal.style.display = 'none'
				}, 300)
			})
		})
	}

	// Enhanced scroll effects
	function enhanceScrollEffects() {
		let lastScrollTop = 0
		const header = document.querySelector('.site-header')
		
		window.addEventListener('scroll', () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop
			
			if (scrollTop > lastScrollTop && scrollTop > 100) {
				// Scrolling down
				header.style.transform = 'translateY(-100%)'
			} else {
				// Scrolling up
				header.style.transform = 'translateY(0)'
			}
			
			lastScrollTop = scrollTop
		})
	}

	// Enhanced loading states
	function enhanceLoadingStates() {
		const buttons = document.querySelectorAll('.btn[type="submit"]')
		buttons.forEach(btn => {
			btn.addEventListener('click', () => {
				if (!btn.disabled) {
					btn.style.position = 'relative'
					btn.style.overflow = 'hidden'
					
					const loader = document.createElement('div')
					loader.style.cssText = `
						position: absolute;
						top: 0;
						left: -100%;
						width: 100%;
						height: 100%;
						background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
						animation: loading 1s infinite;
					`
					btn.appendChild(loader)
					
					setTimeout(() => {
						if (loader.parentNode) {
							loader.remove()
						}
					}, 1000)
				}
			})
		})
	}

	// Enhanced hover effects
	function enhanceHoverEffects() {
		const cards = document.querySelectorAll('.card, .feature-card, .overview-card')
		cards.forEach(card => {
			card.addEventListener('mouseenter', () => {
				card.style.transform = 'translateY(-8px) scale(1.02)'
				card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'
			})
			
			card.addEventListener('mouseleave', () => {
				card.style.transform = 'translateY(0) scale(1)'
				card.style.boxShadow = ''
			})
		})
	}

	// Enhanced focus effects
	function enhanceFocusEffects() {
		const focusableElements = document.querySelectorAll('input, button, a, select, textarea')
		focusableElements.forEach(el => {
			el.addEventListener('focus', () => {
				el.style.transform = 'scale(1.02)'
				el.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
			})
			
			el.addEventListener('blur', () => {
				el.style.transform = 'scale(1)'
				el.style.boxShadow = ''
			})
		})
	}

	// Enhanced responsive animations
	function enhanceResponsiveAnimations() {
		const mediaQuery = window.matchMedia('(max-width: 768px)')
		
		function handleResize(e) {
			if (e.matches) {
				// Mobile optimizations
				document.body.style.setProperty('--animation-duration', '0.3s')
			} else {
				// Desktop optimizations
				document.body.style.setProperty('--animation-duration', '0.6s')
			}
		}
		
		mediaQuery.addListener(handleResize)
		handleResize(mediaQuery)
	}

	// Enhanced performance optimizations
	function enhancePerformance() {
		// Lazy load images and heavy elements
		const lazyElements = document.querySelectorAll('[data-lazy]')
		const lazyObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('loaded')
					lazyObserver.unobserve(entry.target)
				}
			})
		})
		
		lazyElements.forEach(el => lazyObserver.observe(el))
		
		// Debounce scroll events
		let scrollTimeout
		window.addEventListener('scroll', () => {
			clearTimeout(scrollTimeout)
			scrollTimeout = setTimeout(() => {
				// Handle scroll-based animations
			}, 16)
		})
	}

	// Enhanced accessibility
	function enhanceAccessibility() {
		// Add focus indicators
		const focusableElements = document.querySelectorAll('a, button, input, select, textarea')
		focusableElements.forEach(el => {
			el.addEventListener('focus', () => {
				el.style.outline = '2px solid var(--brand)'
				el.style.outlineOffset = '2px'
			})
			
			el.addEventListener('blur', () => {
				el.style.outline = ''
				el.style.outlineOffset = ''
			})
		})
		
		// Enhanced keyboard navigation
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Tab') {
				document.body.classList.add('keyboard-navigation')
			}
		})
		
		document.addEventListener('mousedown', () => {
			document.body.classList.remove('keyboard-navigation')
		})
	}


	// Enhanced error handling
	function enhanceErrorHandling() {
		window.addEventListener('error', (e) => {
			console.error('Enhanced error handling:', e.error)
			// In a real app, you might want to send this to an error tracking service
		})
		
		window.addEventListener('unhandledrejection', (e) => {
			console.error('Unhandled promise rejection:', e.reason)
			// Handle unhandled promise rejections
		})
	}

	// Enhanced analytics and tracking
	function enhanceAnalytics() {
		// Track user interactions
		document.addEventListener('click', (e) => {
			const target = e.target
			if (target.matches('button, a, input[type="submit"]')) {
				// Track button clicks and form submissions
				console.log('User interaction:', target.textContent || target.value)
			}
		})
		
		// Track scroll depth
		let maxScroll = 0
		window.addEventListener('scroll', () => {
			const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
			if (scrollPercent > maxScroll) {
				maxScroll = scrollPercent
				console.log('Scroll depth:', maxScroll + '%')
			}
		})
	}

	// Enhanced mobile experience
	function enhanceMobileExperience() {
		// Add touch feedback
		const touchElements = document.querySelectorAll('button, a, .card, .feature-card, .overview-card')
		touchElements.forEach(el => {
			el.addEventListener('touchstart', () => {
				el.style.transform = 'scale(0.98)'
			})
			
			el.addEventListener('touchend', () => {
				el.style.transform = 'scale(1)'
			})
		})
		
		// Enhanced mobile navigation
		const mobileNav = document.querySelector('.nav-toggle')
		if (mobileNav) {
			mobileNav.addEventListener('touchstart', (e) => {
				e.preventDefault()
				mobileNav.click()
			})
		}
		
		// Swipe gestures for mobile navigation
		let startX = 0
		let startY = 0
		
		document.addEventListener('touchstart', function(e) {
			startX = e.touches[0].clientX
			startY = e.touches[0].clientY
		})
		
		document.addEventListener('touchend', function(e) {
			const endX = e.changedTouches[0].clientX
			const endY = e.changedTouches[0].clientY
			const diffX = startX - endX
			const diffY = startY - endY
			
			// Swipe left to open navigation
			if (diffX > 50 && Math.abs(diffY) < 50) {
				const nav = document.querySelector('.nav')
				if (nav && !nav.classList.contains('show')) {
					nav.classList.add('show')
				}
			}
			
			// Swipe right to close navigation
			if (diffX < -50 && Math.abs(diffY) < 50) {
				const nav = document.querySelector('.nav')
				if (nav && nav.classList.contains('show')) {
					nav.classList.remove('show')
				}
			}
		})
		
		// Double tap to zoom prevention
		let lastTouchEnd = 0
		document.addEventListener('touchend', function(event) {
			const now = (new Date()).getTime()
			if (now - lastTouchEnd <= 300) {
				event.preventDefault()
			}
			lastTouchEnd = now
		}, false)
		
		// Responsive table handling
		const tables = document.querySelectorAll('.table-wrap')
		tables.forEach(table => {
			if (window.innerWidth <= 768) {
				table.style.overflowX = 'auto'
				table.style.webkitOverflowScrolling = 'touch'
			}
		})
		
		// Responsive chart resizing
		const charts = document.querySelectorAll('.chart-container')
		charts.forEach(chart => {
			if (window.ResizeObserver) {
				const resizeObserver = new ResizeObserver(entries => {
					entries.forEach(entry => {
						if (entry.target === chart) {
							// Trigger chart redraw if needed
							const canvas = chart.querySelector('canvas')
							if (canvas) {
								canvas.style.width = '100%'
								canvas.style.height = '100%'
							}
						}
					})
				})
				resizeObserver.observe(chart)
			}
		})
		
		// Responsive modal positioning
		const modals = document.querySelectorAll('.modal-content')
		modals.forEach(modal => {
			if (window.innerWidth <= 480) {
				modal.style.top = '10px'
				modal.style.transform = 'translate(-50%, 0)'
				modal.style.maxHeight = 'calc(100vh - 20px)'
			}
		})
		
		// Responsive navigation improvements
		const navToggle = document.querySelector('.nav-toggle')
		const nav = document.querySelector('.nav')
		
		if (navToggle && nav) {
			// Close nav when clicking outside
			document.addEventListener('click', function(e) {
				if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
					nav.classList.remove('show')
				}
			})
			
			// Close nav on escape key
			document.addEventListener('keydown', function(e) {
				if (e.key === 'Escape' && nav.classList.contains('show')) {
					nav.classList.remove('show')
				}
			})
		}
		
		// Responsive form improvements
		const inputs = document.querySelectorAll('input, textarea, select')
		inputs.forEach(input => {
			// Prevent zoom on iOS
			if (input.type !== 'file') {
				input.style.fontSize = '16px'
			}
			
			// Enhanced focus states for mobile
			input.addEventListener('focus', function() {
				this.style.transform = 'scale(1.02)'
			})
			
			input.addEventListener('blur', function() {
				this.style.transform = 'scale(1)'
			})
		})
		
		// Responsive image handling
		const images = document.querySelectorAll('img')
		images.forEach(img => {
			img.style.maxWidth = '100%'
			img.style.height = 'auto'
		})
		
		// Responsive iframe handling
		const iframes = document.querySelectorAll('iframe')
		iframes.forEach(iframe => {
			iframe.style.maxWidth = '100%'
			iframe.style.height = 'auto'
		})
	}

	// Enhanced loading animations
	function enhanceLoadingAnimations() {
		// Add page load animation
		window.addEventListener('load', () => {
			document.body.classList.add('loaded')
		})
		
		// Add skeleton loading for dynamic content
		const skeletonElements = document.querySelectorAll('[data-skeleton]')
		skeletonElements.forEach(el => {
			el.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
			el.style.backgroundSize = '200% 100%'
			el.style.animation = 'skeleton-loading 1.5s infinite'
		})
	}

	// Enhanced micro-interactions
	function enhanceMicroInteractions() {
		// Add ripple effect to buttons
		const buttons = document.querySelectorAll('.btn')
		buttons.forEach(btn => {
			btn.addEventListener('click', (e) => {
				const ripple = document.createElement('span')
				const rect = btn.getBoundingClientRect()
				const size = Math.max(rect.width, rect.height)
				const x = e.clientX - rect.left - size / 2
				const y = e.clientY - rect.top - size / 2
				
				ripple.style.cssText = `
					position: absolute;
					width: ${size}px;
					height: ${size}px;
					left: ${x}px;
					top: ${y}px;
					background: rgba(255,255,255,0.3);
					border-radius: 50%;
					transform: scale(0);
					animation: ripple 0.6s linear;
					pointer-events: none;
				`
				
				btn.appendChild(ripple)
				setTimeout(() => ripple.remove(), 600)
			})
		})
		
		// Add typing effect to headings
		const typingElements = document.querySelectorAll('[data-typing]')
		typingElements.forEach(el => {
			const text = el.textContent
			el.textContent = ''
			el.style.borderRight = '2px solid var(--brand)'
			
			let i = 0
			const typeWriter = () => {
				if (i < text.length) {
					el.textContent += text.charAt(i)
					i++
					setTimeout(typeWriter, 100)
				} else {
					el.style.borderRight = 'none'
				}
			}
			
			setTimeout(typeWriter, 1000)
		})
	}


// Initialize all enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
	
	// Initialize basic enhancements
	animateOnScroll()
	enhanceTables()
	enhanceButtons()
	enhanceModals()
	enhanceScrollEffects()
		enhanceLoadingStates()
		enhanceHoverEffects()
		enhanceFocusEffects()
		enhanceResponsiveAnimations()
		enhancePerformance()
		enhanceAccessibility()
		enhanceErrorHandling()
		enhanceAnalytics()
		enhanceMobileExperience()
		enhanceLoadingAnimations()
		enhanceMicroInteractions()
		
		// Initialize page-specific animations
		if (document.querySelector('.hero')) {
			animateHeroText()
		}
		
		if (document.querySelector('.overview-card')) {
			animateOverviewCards()
		}
		
		if (document.querySelector('.feature-card')) {
			animateFeatureCards()
		}
		
		if (document.querySelector('.step')) {
			animateSteps()
		}
		
		if (document.querySelector('.stat-item')) {
			animateStatistics()
		}
		
		if (document.querySelector('.mini-card')) {
			animateMiniCards()
		}
		
		if (document.querySelector('.input')) {
			animateForms()
		}
		
		if (document.querySelector('canvas')) {
			animateCharts()
		}
	})

	// Enhanced window load handling
	window.addEventListener('load', function() {
		// Add loaded class to body for final animations
		document.body.classList.add('fully-loaded')
		
		// Initialize any remaining enhancements
		setTimeout(() => {
			// Final polish animations
			const finalElements = document.querySelectorAll('.card, .feature-card, .overview-card')
			finalElements.forEach((el, index) => {
				setTimeout(() => {
					el.style.animation = 'pulse 0.6s ease'
					setTimeout(() => {
						el.style.animation = ''
					}, 600)
				}, index * 100)
			})
		}, 1000)
	})

	// Appointments page specific functionality
	if (document.getElementById('appointmentsTableBody')) {
		// Load appointments when page loads
		document.addEventListener('DOMContentLoaded', loadAppointments)

		// Event listeners for appointments page
		const btnNewAppointment = document.getElementById('btnNewAppointment')
		const btnExportAppointments = document.getElementById('btnExportAppointments')
		const newAppointmentModal = document.getElementById('newAppointmentModal')
		const viewAppointmentModal = document.getElementById('viewAppointmentModal')
		const closeNewAppointmentModal = document.getElementById('closeNewAppointmentModal')
		const closeViewAppointmentModal = document.getElementById('closeViewAppointmentModal')
		const newAppointmentForm = document.getElementById('newAppointmentForm')
		const btnApproveAppointment = document.getElementById('btnApproveAppointment')
		const btnMarkDoneAppointment = document.getElementById('btnMarkDoneAppointment')

		if (btnNewAppointment) {
			btnNewAppointment.addEventListener('click', () => {
				newAppointmentModal.style.display = 'block'
			})
		}

		if (btnExportAppointments) {
			btnExportAppointments.addEventListener('click', exportAppointments)
		}

		if (closeNewAppointmentModal) {
			closeNewAppointmentModal.addEventListener('click', () => {
				newAppointmentModal.style.display = 'none'
			})
		}

		if (closeViewAppointmentModal) {
			closeViewAppointmentModal.addEventListener('click', () => {
				viewAppointmentModal.style.display = 'none'
			})
		}

		if (newAppointmentForm) {
			newAppointmentForm.addEventListener('submit', createNewAppointment)
		}

		if (btnApproveAppointment) {
			btnApproveAppointment.addEventListener('click', () => approveAppointment(currentAppointmentId))
		}

		if (btnMarkDoneAppointment) {
			btnMarkDoneAppointment.addEventListener('click', () => markAppointmentDone(currentAppointmentId))
		}

		// Close modals when clicking outside
		window.addEventListener('click', (event) => {
			if (event.target === newAppointmentModal) {
				newAppointmentModal.style.display = 'none'
			}
			if (event.target === viewAppointmentModal) {
				viewAppointmentModal.style.display = 'none'
			}
		})

		let currentAppointmentId = null

		async function loadAppointments() {
			try {
				const today = new Date().toISOString().split('T')[0]
				const response = await window.meducoAPI.getAppointments({ date: today })
				
				if (response.success) {
					populateAppointmentsTable(response.data.appointments)
				} else {
					console.error('Failed to load appointments:', response.message)
				}
			} catch (error) {
				console.error('Error loading appointments:', error)
			}
		}

		function populateAppointmentsTable(appointments) {
			const tableBody = document.getElementById('appointmentsTableBody')
			tableBody.innerHTML = ''

			if (!appointments || appointments.length === 0) {
				tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No appointments found</td></tr>'
				return
			}

			appointments.forEach(appointment => {
				const row = document.createElement('tr')
				row.innerHTML = `
					<td>${appointment.appointment_time}</td>
					<td>${appointment.patient_first_name} ${appointment.patient_last_name}</td>
					<td>${appointment.patient_id}</td>
					<td>${appointment.type}</td>
					<td><span class="badge ${getStatusClass(appointment.status)}">${appointment.status}</span></td>
					<td>
						<button class="btn btn-outline view-btn" style="padding: 4px 8px; font-size: 12px;" data-id="${appointment.id}">View</button>
					</td>
				`
				tableBody.appendChild(row)
			})

			// Add event listeners to view buttons
			document.querySelectorAll('.view-btn').forEach(btn => {
				btn.addEventListener('click', (e) => {
					const appointmentId = e.target.getAttribute('data-id')
					viewAppointment(appointmentId)
				})
			})
		}

		function getStatusClass(status) {
			switch (status.toLowerCase()) {
				case 'confirmed': return ''
				case 'pending': return 'warning'
				case 'cancelled': return 'alert'
				case 'completed': return 'success'
				default: return ''
			}
		}

		async function viewAppointment(appointmentId) {
			try {
				// Get appointment details (assuming we can get by ID, or filter from loaded appointments)
				const today = new Date().toISOString().split('T')[0]
				const response = await window.meducoAPI.getAppointments({ date: today })
				
				if (response.success) {
					const appointment = response.data.appointments.find(app => app.id == appointmentId)
					if (appointment) {
						currentAppointmentId = appointmentId
						const detailsDiv = document.getElementById('appointmentDetails')
						detailsDiv.innerHTML = `
							<p><strong>Patient:</strong> ${appointment.patient_first_name} ${appointment.patient_last_name}</p>
							<p><strong>Patient ID:</strong> ${appointment.patient_id}</p>
							<p><strong>Date:</strong> ${appointment.appointment_date}</p>
							<p><strong>Time:</strong> ${appointment.appointment_time}</p>
							<p><strong>Type:</strong> ${appointment.type}</p>
							<p><strong>Reason:</strong> ${appointment.reason || 'N/A'}</p>
							<p><strong>Status:</strong> ${appointment.status}</p>
							${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
							${appointment.diagnosis ? `<p><strong>Diagnosis:</strong> ${appointment.diagnosis}</p>` : ''}
							${appointment.prescription ? `<p><strong>Prescription:</strong> ${appointment.prescription}</p>` : ''}
						`
						viewAppointmentModal.style.display = 'block'
					}
				}
			} catch (error) {
				console.error('Error viewing appointment:', error)
			}
		}

		async function createNewAppointment(event) {
			event.preventDefault()
			
			const formData = new FormData(event.target)
			const appointmentData = {
				patientId: formData.get('patientId'),
				appointmentDate: formData.get('appointmentDate'),
				appointmentTime: formData.get('appointmentTime'),
				type: formData.get('appointmentType'),
				reason: formData.get('reason')
			}

			try {
				const response = await window.meducoAPI.createAppointment(appointmentData)
				
				if (response.success) {
					alert('Appointment created successfully!')
					newAppointmentModal.style.display = 'none'
					event.target.reset()
					loadAppointments() // Reload appointments
				} else {
					alert('Failed to create appointment: ' + response.message)
				}
			} catch (error) {
				console.error('Error creating appointment:', error)
				alert('Error creating appointment: ' + error.message)
			}
		}

		async function approveAppointment(appointmentId) {
			try {
				const response = await window.meducoAPI.updateAppointment(appointmentId, { status: 'confirmed' })
				
				if (response.success) {
					alert('Appointment approved!')
					viewAppointmentModal.style.display = 'none'
					loadAppointments() // Reload appointments
				} else {
					alert('Failed to approve appointment: ' + response.message)
				}
			} catch (error) {
				console.error('Error approving appointment:', error)
				alert('Error approving appointment: ' + error.message)
			}
		}

		async function markAppointmentDone(appointmentId) {
			try {
				const response = await window.meducoAPI.updateAppointment(appointmentId, { status: 'completed' })
				
				if (response.success) {
					alert('Appointment marked as done!')
					viewAppointmentModal.style.display = 'none'
					loadAppointments() // Reload appointments
				} else {
					alert('Failed to mark appointment as done: ' + response.message)
				}
			} catch (error) {
				console.error('Error marking appointment as done:', error)
				alert('Error marking appointment as done: ' + error.message)
			}
		}

		async function exportAppointments() {
			try {
				const today = new Date()
				const tomorrow = new Date(today)
				tomorrow.setDate(tomorrow.getDate() + 1)
				const tomorrowStr = tomorrow.toISOString().split('T')[0]
				
				// Get today's appointments
				const response = await window.meducoAPI.getAppointments({ date: new Date().toISOString().split('T')[0] })
				
				if (response.success && response.data && response.data.appointments && response.data.appointments.length > 0) {
					// Create new appointments for tomorrow
					const exportPromises = response.data.appointments.map(async (appointment) => {
						const newAppointmentData = {
							patientId: appointment.patient_id,
							appointmentDate: tomorrowStr,
							appointmentTime: appointment.appointment_time,
							type: appointment.type,
							reason: `Exported from ${appointment.appointment_date} - ${appointment.reason || ''}`
						}
						return window.meducoAPI.createAppointment(newAppointmentData)
					})
					
					const results = await Promise.all(exportPromises)
					const successCount = results.filter(r => r.success).length
					
					alert(`Exported ${successCount} appointments to ${tomorrow.toLocaleDateString()}`)
					loadAppointments() // Reload to show any changes
				} else {
					alert('No appointments to export')
				}
			} catch (error) {
				console.error('Error exporting appointments:', error)
				alert('Error exporting appointments: ' + error.message)
			}
		}
	}
})()
