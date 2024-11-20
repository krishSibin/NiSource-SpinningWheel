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
  
  const friction = 0.991; 
  let angVel = 0; 
  let ang = 0;
  
  let spinButtonClicked = false;
  let resultTimeout; 
  
  const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;
  
  function drawSector(sector, i) {
    const ang = arc * i;
    ctx.save();
  

    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
  

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
      spinButtonClicked = false; 
      return;
    }
  
    angVel *= friction; 
    if (angVel < 0.002) angVel = 0; 
    ang += angVel; 
    ang %= TAU; 
    rotate();
  }
  
  function engine() {
    frame();
    requestAnimationFrame(engine);
  }
  
  function init() {
    sectors.forEach(drawSector);
    rotate();
    engine();
  
    spinEl.style.background = "yellow"; 
  
    spinEl.addEventListener("click", () => {
      if (!angVel) {
        clearTimeout(resultTimeout); 
        spinEl.textContent = "SPIN"; 
        spinEl.style.background = "#FFBC03"; 
        spinEl.style.color = "#333333"; 
        angVel = rand(0.25, 0.45);
        spinButtonClicked = true;
      }
    });
  }
  
  init();
  
  events.addListener("spinEnd", (sector) => {
   
    localStorage.setItem("spinResult", JSON.stringify(sector));
  

    window.location.href = "result.html";
  });
  