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
  console.log("User Role:", userRole);
}

let navLinks = document.getElementById("nav-links");

if (userRole === "USER") {
  navLinks.innerHTML = `
    <li><a href="#"><i class="fa-solid fa-clipboard" style="color: #ffffff;"></i> Tests</a></li>
    <li><a href="#"><i class="fa-solid fa-square-poll-vertical" style="color: #ffffff;"></i> Results</a></li>
    <li><a href="#" onclick="logout()"><i class="fa-solid fa-right-from-bracket" style="color: #ffffff;"></i> Logout</a></li>
    <li><a href="#"><i class="fa-solid fa-user" style="color: #ffffff;" ></i></a></li>
  `;

  function logout() {
    localStorage.removeItem("authToken");
    window.location.replace("/index.html");
  }


} else if (userRole === "ADMIN") {
  navLinks.innerHTML = `
    <li><a href="#"><i class="fa-solid fa-clipboard" style="color: #ffffff;"></i> Tests</a></li>
    <li><a href="#"><i class="fa-regular fa-square-plus"></i> Create Test</a></li>
    <li><a href="#"><i class="fa-solid fa-square-poll-vertical" style="color: #ffffff;"></i> Results</a></li>
    <li><a href="#" onclick="logout()"><i class="fa-solid fa-right-from-bracket" style="color: #ffffff;"></i> Logout</a></li>
    <li><a href="#"><i class="fa-solid fa-user" style="color: #ffffff;" ></i></a></li>
  `;
}

const testDashboard = document.getElementById("test-data");

async function loadTests() {
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch("http://localhost:8080/test/get-all", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (res.status === 204) {
      testDashboard.innerHTML = "<p>No tests found</p>";
      return;
    }  

    if (res.ok) {
      const tests = await res.json();
      testDashboard.innerHTML = "";

      tests.forEach((test,i) => {
        const testCard = document.createElement("div");
        testCard.classList.add("test-card");
        testCard.setAttribute("data-aos", "flip-down");
        testCard.setAttribute("data-aos-delay",1000);
        testCard.setAttribute("data-aos-duration", "500");

        testCard.textContent = `Card ${i + 1}`;

        testCard.innerHTML = `
          <div class="test-header">
            <div class="test-header-left">
              <h1><b>Topic : </b>${test.title}</h1>
              <span><b>Upload Date:</b> ${test.creationDate}</span>
            </div>
            <div class="test-header-right">
              <p><b>Duration:</b> ${test.duration} mins</p>
            </div>
          </div>
          <p><b>Total Marks:</b> ${test.totalMarks}</p>
          <p><b>Start Date:</b> ${test.startDate}</p>
          <p><b>Start Time:</b> ${test.startTime}</p>
        `;

        testDashboard.appendChild(testCard);
      });
    } else {
      navLinks.style.display = "none"
      const err = await res.text();
      testDashboard.innerHTML = `
        <div class = "login-card-dash">
          <div class = "card" data-aos="fade-top" data-aos-delay="2000" data-aos-duration="500">
            <h1>Session has expired !</h1>
            <p>Please login again !</p>
            <button id="dash-to-login">Login</button>
          </div>
        </div>
      `;

      document.getElementById("dash-to-login").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.replace("/index.html");
      });
    }
  } catch (err) {
    testDashboard.innerHTML = `<p style="color:red;">Something went wrong: ${err}</p>`;
  }
}

loadTests();
