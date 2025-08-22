const token = localStorage.getItem("authToken");
let userRole;
function parseJwt(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

if (token) {
  let decoded = parseJwt(token);
  userRole = decoded.role;
}

let navLinks = document.getElementById("nav-links");

if (userRole === "USER") {
  navLinks.innerHTML = `
    <li><button><i class="fa-solid fa-clipboard" style="color: #ffffff;"></i> Tests</button></li>
    <li><button><i class="fa-solid fa-square-poll-vertical" style="color: #ffffff;"></i> Results</button></li>
    <li><button><i class="fa-solid fa-file-pen" style="color: #ffffff;"></i> Notes</button></li>
    <li><button onclick="logout()"><i class="fa-solid fa-right-from-bracket" style="color: #ffffff;"></i> Logout</button></li>
    <li><button><i class="fa-solid fa-user" style="color: #ffffff;" ></i></button></li>
  `;
} else if (userRole === "ADMIN") {
  navLinks.innerHTML = `
    <li><button><i class="fa-solid fa-clipboard" style="color: #ffffff;"></i> Tests</button></li>
    <li><button onclick="createTest()"><i class="fa-regular fa-square-plus"></i> Create Test</button></li>
    <li><button><i class="fa-solid fa-square-poll-vertical" style="color: #ffffff;"></i> Results</button></li>
    <li><button><i class="fa-solid fa-database" style="color: #ffffff;"></i> Students</button></li>
    <li><button><i class="fa-solid fa-file-pen" style="color: #ffffff;"></i> Notes</button></li>
    <li><button onclick="logout()"><i class="fa-solid fa-right-from-bracket" style="color: #ffffff;"></i> Logout</button></li>
    <li><button><i class="fa-solid fa-user" style="color: #ffffff;" ></i></button></li>
  `;
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.replace("/index.html");
}

let mainPage = document.getElementById("test-data");

function showMessage(message, color) {
    console.log("hi");
    
    addTestMsgBox.style.dispaly = "block";
    addTestMsg.textContent = message;
    addTestMsg.style.background = color;

  
    setTimeout(() => {
      addTestMsgBox.style.dispaly = "none";
      addTestMsg.textContent = "";
      addTestMsg.style.background = "transparent";
    }, 3000);
  }


function createTest() {
  mainPage.innerHTML = `
    <div class="add-test-msg-box" id="add-test-msg-box">
      <p id="add-test-msg" class="add-test-msg"></p>
    </div>
    <div class="add-test-card" data-aos="zoom-in" data-aos-delay="100" data-aos-duration="300">
      <form id="add-test-form">
          <!-- Title -->
          <label for="title">Title:</label>
          <input type="text" id="title" name="title" required>

          <div class="date-time">
              <div>
                  <!-- Start Date -->
                  <label for="startDate">Start Date:</label>
                  <input type="date" id="startDate" name="startDate" required>
              </div>

              <div>
                  <!-- Start Time -->
                  <label for="startTime">Start Time:</label>
                  <input type="time" id="startTime" name="startTime" required>
              </div>
          </div>

          <div class="dur-marks">
              <div>
                  <!-- Duration -->
                  <label for="duration">Duration (minutes):</label>
                  <input type="number" id="duration" name="duration" min="1" required>
              </div>

              <!-- Total Marks -->
              <div>
                  <label for="totalMarks">Total Marks:</label>
                  <input type="number" id="totalMarks" name="totalMarks" min="0" required>
              </div>
          </div>

          <div class="add-test-btn">
              <button type="button" id="add-test">ADD TEST</button>
          </div>
      </form>
    </div>
  `;

  const addTestBtn = document.getElementById("add-test");
  const form = document.getElementById("add-test-form");
  const addTestMsg = document.getElementById("add-test-msg");
  const addTestMsgBox = document.getElementById("add-test-msg-box");

  addTestMsg.style.display = "none";

  addTestBtn.addEventListener("click", async () => {
    const testRequestDto = {
      title: form.title.value.trim(),
      startDate: form.startDate.value,
      startTime: form.startTime.value,
      duration: parseInt(form.duration.value),
      totalMarks: parseInt(form.totalMarks.value)
    };
    try {
      const response = await fetch("http://localhost:8080/test/modify/add-test", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify(testRequestDto)
      });

      if (response.ok) {
        const data = await response.json();
        addTestMsg.style.display = "flex";        
        addTestMsg.textContent = "✅ Test added successfully! Test ID: " + data.id;
        addTestMsg.style.backgroundColor = "green";
        form.reset(); 
      } else {
        addTestMsg.style.display = "flex";  
        addTestMsg.textContent = "❌ Failed to add test. Status: " + response.status;
        addTestMsg.style.backgroundColor = "red";
      }
    } catch (error) {
      addTestMsg.style.display = "flex";  
      addTestMsg.textContent = "⚠️ Error: " + error.message;
      addTestMsg.style.backgroundColor = "red";
    }

    setTimeout(() => {
      addTestMsg.style.display = "none";  
      addTestMsg.textContent = "";
    }, 5000);
  });
}