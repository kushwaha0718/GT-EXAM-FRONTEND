function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
    const exp = payload.exp; // expiry time in seconds
    const now = Math.floor(Date.now() / 1000);

    return exp < now; // true if expired
  } catch (e) {
    console.error("Invalid token", e);
    return true; // treat invalid token as expired
  }
}

const toggleNav = document.getElementById("hamburger");
const navLinks2 = document.getElementById("nav-links");

toggleNav.addEventListener("click", function() {
  navLinks2.classList.toggle("show");
  toggleNav.innerHTML = navLinks2.classList.contains("show") ? '<i class="fa-solid fa-xmark" style="color: #ffffff;"></i>' : '<i class="fa-solid fa-bars" style="color: #ffffff;"></i>';
});

const token = localStorage.getItem("authToken");
let userRole;
if (isTokenExpired(token)) {
  console.log("Token expired");
  window.location.replace("/index.html")
} else {
  console.log("Token valid");
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
    getAllTest();
  }
}



let navLinks = document.getElementById("nav-links");

if (userRole === "USER") {
  navLinks.innerHTML = `
    <li><button onclick="getAllTest()"><i class="fa-solid fa-clipboard" style="color: #ffffff;"></i> Tests</button></li>
    <li><button><i class="fa-solid fa-square-poll-vertical" style="color: #ffffff;"></i> Results</button></li>
    <li><button><i class="fa-solid fa-file-pen" style="color: #ffffff;"></i> Notes</button></li>
    <li><button onclick="logout()"><i class="fa-solid fa-right-from-bracket" style="color: #ffffff;"></i> Logout</button></li>
    <li><button><i class="fa-solid fa-user" style="color: #ffffff;" ></i></button></li>
  `;
} else if (userRole === "ADMIN") {
  navLinks.innerHTML = `
    <li><button onclick="window.location.replace('dashboard.html')"><i class="fa-solid fa-clipboard" style="color: #ffffff;"></i> Tests</button></li>
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



//CREATE EXAM  
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



function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " " + date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function formatDateOnly(dateString) {
  if (!dateString) return "N/A";

  // Handle "YYYY-MM-DD" format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-");
    return `${day} ${new Date(dateString).toLocaleString("en-IN", { month: "short" })} ${year}`;
  }

  // Fallback to Date object for full timestamps
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatTimeOnly(timeString) {
  // handle "HH:mm:ss"
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}


//GET ALL TEST
async function getAllTest(page = 0, size = 12) {
  try {
    const token = localStorage.getItem("authToken"); 
    const res = await fetch(`http://localhost:8080/test/get-all?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (res.status === 204) {
      mainPage.innerHTML = `
        <div class="no-content">
            <img src="Images/hat.png" alt="">
            <span>No exams to attend come back later.</span>
        </div>
      `;
      
      return;
    }
    if (!res.ok) {
      throw new Error("Failed to fetch tests");
    }

    const allTests = await res.json();

    // Clear previous content
    mainPage.innerHTML = "";

    // Create container
    let testContainer = document.createElement("div");
    testContainer.classList.add("test-container");
    mainPage.appendChild(testContainer);
  
    // Render cards
    for (let i = 0; i < allTests.content.length; i++) {
      const test = allTests.content[i];

      const now = new Date();
      const examStart = new Date(`${test.startDate}T${test.startTime}`);
      const examEndforBtn = new Date(examStart.getTime() + (test.duration || 0 ) * 60000);
      const examEnd = new Date(examStart.getTime() + ((test.duration || 0 ) +5) * 60000);

      let testCard = document.createElement("div");
      testCard.classList.add("test-card");

      let isOver = false;

      if (now > examEnd) {
        isOver = true;
        fetch(`http://localhost:8080/test/modify/test-status/${test.id}`, {
          method: "PUT",
          headers:{
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
          }
        })
      }


      testCard.innerHTML = `
        <div class="header">
            <h1>${test.id} <hr> ${test.title}</h1>
            <hr>
        </div>
        <div class="body">
            <span>Published Date : ${formatDateTime(test.creationDate)}</span>
            <span>Exam Date : ${formatDateOnly(test.startDate)}</span>
            <span>Start Time : ${formatTimeOnly(test.startTime)}</span>
            <span>Total Time : ${test.duration || "N/A"} mins</span>
            <span>Total Marks : ${test.totalMarks || "N/A"}</span>
        </div>
        <div class="footer">
            ${isOver 
              ? `<div class="overlay"><span>Results Out</span></div>` 
              : `<button type="button" class="start-exam-btn" id="start-exam-btn">Start Exam</button>`}
        </div>
      `; 

      if (now > examEndforBtn ) {
        const btn = testCard.querySelector(`#start-exam-btn`);
        if (btn) {
          btn.disabled = true;
          btn.style.cursor = "not-allowed";
          btn.innerText = "Exam Over";
        }
      }

      testContainer.appendChild(testCard);
    }


    // --- PAGE NAVIGATOR ---
    let pagination = document.createElement("div");
    pagination.classList.add("pagination");

    // Prev Button
    if (page > 0) {
      let prevBtn = document.createElement("button");
      prevBtn.textContent = "<";
      prevBtn.onclick = () => getAllTest(page - 1, size);
      pagination.appendChild(prevBtn);
    }

    // Page Numbers
    for (let p = 0; p < allTests.totalPages; p++) {
      let pageBtn = document.createElement("button");
      pageBtn.textContent = p + 1;
      if (p === page) pageBtn.classList.add("active");
      pageBtn.onclick = () => getAllTest(p, size);
      pagination.appendChild(pageBtn);
    }

    // Next Button
    if (page < allTests.totalPages - 1) {
      let nextBtn = document.createElement("button");
      nextBtn.textContent = ">";
      nextBtn.onclick = () => getAllTest(page + 1, size);
      pagination.appendChild(nextBtn);
    }

    mainPage.appendChild(pagination);

    return allTests;

  } catch (error) {
    console.error("Error:", error);
  }
}




if (userRole === "USER") {
  let hiddenTime = null;
  const RELOAD_AFTER = 5 * 1000; // 10 minutes in ms

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      // User switched to another tab
      hiddenTime = Date.now();
    } else {
      // User came back
      if (hiddenTime && Date.now() - hiddenTime > RELOAD_AFTER) {
        location.reload(); // reloads the page
      }
      hiddenTime = null; // reset
    }
  });
}