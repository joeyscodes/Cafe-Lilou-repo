/* ================================================
   CAFÉ LILOU – PREMIUM FRENCH RESTAURANT WEBSITE
   SCRIPT.JS – 3D Hero, IntersectionObserver, Form
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Loader
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 600);
    });
    document.body.style.overflow = 'hidden';
  }

  // 2. Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const hero = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navbar.classList.remove('scrolled');
        else navbar.classList.add('scrolled');
      });
    }, { threshold: 0 });
    if (hero) observer.observe(hero);
    else navbar.classList.add('scrolled');
  }

  // 3. Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // 4. Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // 5. Reservation form confirmation
  const form = document.getElementById('reservationForm');
  const confirmMsg = document.getElementById('confirmationMsg');
  if (form && confirmMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      confirmMsg.style.display = 'block';
      confirmMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Uncomment for production: form.submit();
    });
  }

  // 6. THREE.JS 3D HERO (only on index.html & desktop)
  const canvas = document.getElementById('hero-canvas');
  if (canvas && window.innerWidth > 768) {
    if (typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080e17);
    scene.fog = new THREE.Fog(0x080e17, 3, 12);

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 1.2, 6);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambient = new THREE.AmbientLight(0x445566);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    keyLight.position.set(3, 3, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xc9a84c, 0.8, 8);
    fillLight.position.set(-2, 0.5, -1);
    scene.add(fillLight);

    // Ground plane (table surface) – invisible but receives shadow
    const tableMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const table = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), tableMat);
    table.rotation.x = -Math.PI / 2;
    table.position.y = -1.1;
    table.receiveShadow = true;
    scene.add(table);

    // Croissant group
    const croissant = new THREE.Group();

    // Materials
    const doughMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.5, metalness: 0.1 });
    const darkerMat = new THREE.MeshStandardMaterial({ color: 0xb58555, roughness: 0.6, metalness: 0.1 });

    // Main body: elongated sphere
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), doughMat);
    body.scale.set(1.6, 0.5, 0.9);
    body.position.y = 0.2;
    body.castShadow = true;
    body.receiveShadow = true;
    croissant.add(body);

    // Left horn (tapered cylinder, bent)
    const leftHorn = new THREE.Group();
    const leftCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.1, 8), doughMat);
    leftCyl.position.set(-0.8, 0.1, 0);
    leftCyl.rotation.z = -0.8;
    leftCyl.rotation.x = 0.3;
    leftCyl.castShadow = true;
    leftCyl.receiveShadow = true;
    leftHorn.add(leftCyl);
    // tip
    const leftTip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.35, 8), darkerMat);
    leftTip.position.set(-1.25, -0.3, 0.15);
    leftTip.rotation.z = -0.9;
    leftTip.castShadow = true;
    leftHorn.add(leftTip);
    croissant.add(leftHorn);

    // Right horn
    const rightHorn = new THREE.Group();
    const rightCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.1, 8), doughMat);
    rightCyl.position.set(0.8, 0.1, 0);
    rightCyl.rotation.z = 0.8;
    rightCyl.rotation.x = 0.3;
    rightCyl.castShadow = true;
    rightCyl.receiveShadow = true;
    rightHorn.add(rightCyl);
    const rightTip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.35, 8), darkerMat);
    rightTip.position.set(1.25, -0.3, 0.15);
    rightTip.rotation.z = 0.9;
    rightTip.castShadow = true;
    rightHorn.add(rightTip);
    croissant.add(rightHorn);

    // Center ridge detail
    const ridge = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 8, 16, Math.PI), darkerMat);
    ridge.rotation.x = Math.PI/2;
    ridge.rotation.z = Math.PI/2;
    ridge.position.y = 0.35;
    ridge.castShadow = true;
    croissant.add(ridge);

    croissant.position.set(0, 0.1, 0);
    scene.add(croissant);

    // Floating gold particles
    const particleCount = 180;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      posArray[i*3] = (Math.random() - 0.5) * 5;
      posArray[i*3+1] = Math.random() * 4 - 1;
      posArray[i*3+2] = (Math.random() - 0.5) * 4;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Animation
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = performance.now() * 0.001;

      croissant.rotation.y += 0.002;
      croissant.position.y = 0.1 + Math.sin(time * 2) * 0.05;

      // Animate particles upward
      const positions = particlesGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i*3+1] += 0.008;
        if (positions[i*3+1] > 3.5) {
          positions[i*3+1] = -1;
          positions[i*3] = (Math.random() - 0.5) * 5;
          positions[i*3+2] = (Math.random() - 0.5) * 4;
        }
      }
      particlesGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        renderer.setSize(0, 0);
      } else {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }

});
