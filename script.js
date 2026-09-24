(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Animated changing word
      const words = ['belajar', 'mencoba', 'bertanya', 'bertumbuh', 'berbagi'];
      const dynamicWord = document.getElementById('dynamicWord');

      if (!reduceMotion) {
        let wordIndex = 0;
        let charIndex = words[0].length;
        let deleting = true;

        const type = () => {
          const current = words[wordIndex];

          if (deleting) {
            charIndex--;
            dynamicWord.textContent = current.slice(0, Math.max(charIndex, 0));

            if (charIndex <= 0) {
              deleting = false;
              wordIndex = (wordIndex + 1) % words.length;
              setTimeout(type, 300);
              return;
            }
          } else {
            const next = words[wordIndex];
            charIndex++;
            dynamicWord.textContent = next.slice(0, charIndex);

            if (charIndex >= next.length) {
              deleting = true;
              setTimeout(type, 1200);
              return;
            }
          }

          setTimeout(type, deleting ? 55 : 85);
        };

        setTimeout(type, 1700);
      }

      // 2. Cursor-following ambient glow
      const orb = document.getElementById('orb');
      if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
        let targetX = innerWidth * .5;
        let targetY = innerHeight * .25;
        let x = targetX;
        let y = targetY;

        window.addEventListener('pointermove', (event) => {
          targetX = event.clientX;
          targetY = event.clientY;
        }, { passive: true });

        const animateOrb = () => {
          x += (targetX - x) * .08;
          y += (targetY - y) * .08;
          orb.style.left = x + 'px';
          orb.style.top = y + 'px';
          requestAnimationFrame(animateOrb);
        };
        animateOrb();
      }

      // 3. Scroll reveal
      const revealItems = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .15 });

      revealItems.forEach((item) => observer.observe(item));

      // 4. Navbar background on scroll
      const navShell = document.getElementById('navShell');
      const updateNav = () => {
        navShell.classList.toggle('scrolled', window.scrollY > 18);
      };
      updateNav();
      window.addEventListener('scroll', updateNav, { passive: true });

      // 5. Interactive card glow + subtle tilt
      if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
        document.querySelectorAll('.card').forEach((card) => {
          const glow = card.querySelector('.card-glow');

          card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - .5) * 5;
            const rotateX = -((y / rect.height) - .5) * 5;

            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
            card.style.transform =
              'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-3px)';
          });

          card.addEventListener('pointerleave', () => {
            card.style.transform = '';
          });
        });
      }

      document.getElementById('year').textContent = new Date().getFullYear();
    })();
