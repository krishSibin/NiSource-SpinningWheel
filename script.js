const sectors = [
    { color: "#FFBC03", text: "#333333", label: "1         ", heading: "Phishing", description: "________ is a type of social engineering attack." },
    { color: "#FF5A10", text: "#333333", label: "2         ", heading: "Piggybacking", description: "__________ is gaining access to a system using another's credentials." },
    { color: "#FFBC03", text: "#333333", label: "3         ", heading: "Malware", description: "__________ refers to software designed to harm or exploit systems." },
    { color: "#FF5A10", text: "#333333", label: "4         ", heading: "Ransomware", description: "__________ is a type of malware that demands payment." },
    { color: "#FFBC03", text: "#333333", label: "5         ", heading: "Spyware", description: "_________ collects information from a device without consent." },
    { color: "#FF5A10", text: "#333333", label: "6         ", heading: "Social Engineering", description: "___________  exploits human psychology to gain access to systems." },
    { color: "#FFBC03", text: "#333333", label: "7         ", heading: "Rootkit", description: "_________ allow unauthorized access to a system while hiding their presence." },
    { color: "#FF5A10", text: "#333333", label: "8         ", heading: "Trojan Horse", description: "A _________ disguises itself as a legitimate program." },
  ];
  
  
  const events = {
    listeners: {},
    addListener: function (eventName, fn) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(fn);
    },
    fire: function (eventName, ...args) {
      if (this.listeners[eventName]) {
        for (let fn of this.listeners[eventName]) {
          fn(...args);
        }
      }
    },
  };
  
  const rand = (m, M) => Math.random() * (M - m) + m;
  const tot = sectors.length;
  const spinEl = document.querySelector("#spin");
  const ctx = document.querySelector("#wheel").getContext("2d");
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / sectors.length;
  
  const friction = 0.991; // Controls deceleration
  let angVel = 0; // Angular velocity
  let ang = 0; // Angle in radians
  
  let spinButtonClicked = false;
  let resultTimeout; // To reset the center text after showing the result
  
  const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;
  
  function drawSector(sector, i) {
    const ang = arc * i;
    ctx.save();
  
    // Draw the sector
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
  
    // Add text
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = sector.text;
    ctx.font = "bold 30px 'Lato', sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
  
    ctx.restore();
  }
  
  function rotate() {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  
    // Dynamically update center text while spinning
    if (angVel > 0) {
      spinEl.textContent = sector.label;
      spinEl.style.background = sector.color;
      spinEl.style.color = sector.text;
    }
  }
  
  function frame() {
    if (!angVel && spinButtonClicked) {
      const finalSector = sectors[getIndex()];
      events.fire("spinEnd", finalSector);
      spinButtonClicked = false; // Reset the flag
      return;
    }
  
    angVel *= friction; // Decelerate
    if (angVel < 0.002) angVel = 0; // Stop spinning
    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate();
  }
  
  function engine() {
    frame();
    requestAnimationFrame(engine);
  }
  
  function init() {
    sectors.forEach(drawSector);
    rotate(); // Initial rotation
    engine(); // Start animation engine
  
    spinEl.style.background = "yellow"; // Set default background to yellow
  
    spinEl.addEventListener("click", () => {
      if (!angVel) {
        clearTimeout(resultTimeout); // Clear timeout if still running
        spinEl.textContent = "SPIN"; // Reset text
        spinEl.style.background = "#FFBC03"; // Reset background to yellow
        spinEl.style.color = "#333333"; // Reset text color to dark
        angVel = rand(0.25, 0.45); // Start spinning
        spinButtonClicked = true;
      }
    });
  }
  
  init();
  
  events.addListener("spinEnd", (sector) => {
    // Store the result in localStorage
    localStorage.setItem("spinResult", JSON.stringify(sector));
  
    // Redirect to the result page
    window.location.href = "result.html";
  });
  