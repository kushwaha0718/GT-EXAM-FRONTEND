const loginForm = document.getElementById("login");
const signupForm = document.getElementById("signup");
const registerBtn = document.getElementById("noaccount");
const backBtn = document.getElementById("back-to-login");

loginForm.classList.add("active");

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
});

backBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
});


const after_otp = document.getElementById("after-otp");

after_otp.style.display="none";



let emailInput = document.getElementById("email-signup");
let otpInput   = document.getElementById("otp-value");
let getOtpBtn   = document.getElementById("get-otp");
let submitOtpBtn = document.getElementById("Submit-otp");
let otpblock = document.getElementById("otp");

let formmessage2 = document.getElementById("form-message2");
function showMessage(message, color) {
  formmessage2.textContent = message;
  formmessage2.style.background = color;

  
  setTimeout(() => {
    formmessage2.textContent = "Please fill the required details";
    formmessage2.style.background = "transparent";
  }, 3000);
}

let formmessage = document.getElementById("form-message1");
function showMessage2(message, color) {
  formmessage.textContent = message;
  formmessage.style.background = color;

  
  setTimeout(() => {
    formmessage.textContent = "Please fill the required details";
    formmessage.style.background = "transparent";
  }, 3000);
}


getOtpBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  let email = emailInput.value.trim();

  // Regex pattern for email validation
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email === "") {
    showMessage("Email cannot be empty!", "red");
    return;
  } 
  else if (!emailPattern.test(email)) {
    showMessage("Please enter a valid email address", "red");
    return;
  }

  getOtpBtn.classList.add("loading");
  getOtpBtn.textContent = "Wait";


  fetch("http://localhost:8080/otp/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email })
  })
  .then(res => res.text())
  .then(data => {
    showMessage(data, "green");
  })
  .catch(err => {
    console.error(err);
    showMessage("Something went wrong!", "red");
  })
  .finally(() => {
    getOtpBtn.classList.remove("loading");
    getOtpBtn.disabled = false;
    getOtpBtn.textContent = "Get OTP";
  });
});

submitOtpBtn.addEventListener("click", (e) => {
  e.preventDefault();
    let email = emailInput.value;
    let otp = otpInput.value;
    console.log("Validating OTP:", otp);

    fetch("http://localhost:8080/otp/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp })
    })
    .then(res => res.text())
    .then(data => {
        if (data === "true") {
          submitOtpBtn.classList.add("loading");
          submitOtpBtn.textContent = "Wait";
          setTimeout(() => {
            submitOtpBtn.classList.remove("loading");
            submitOtpBtn.disabled = true;
            submitOtpBtn.innerHTML = `<i class="fa-solid fa-check" style="color: #ffffff;"></i>`;
            submitOtpBtn.style.background ="green";
            showMessage("Verified !","green")
            getOtpBtn.innerHTML = `<i class="fa-solid fa-check" style="color: #ffffff;"></i>`;
            getOtpBtn.style.background ="green";
            otpblock.style.display="none";
            emailInput.disabled = true;
            after_otp.style.display="block";
          }, 2000);
        }
    })
});


const finalSignupBtn = document.querySelector("#final-signup");

finalSignupBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let signupData = {
    firstName: document.getElementById("firstname").value.trim(),
    lastName: document.getElementById("lastname").value.trim(),
    email: emailInput.value.trim(),
    password: document.getElementById("password2").value.trim(),
    phone: document.getElementById("contact").value.trim(),
    year: document.getElementById("yearfield").value.trim()
  };
  if (!signupData.firstName) {
    showMessage("First Name must not be empty", "red");
    return;
  }

  if (!signupData.lastName) {
      showMessage("Last Name must not be empty", "red");
      return;
  }

  if (!signupData.password) {
      showMessage("Password must not be empty", "red");
      return;
  }

  if (!signupData.phone) {
      showMessage("Contact must not be empty", "red");
      return;
  }

  if (!/^\d{10}$/.test(signupData.phone)) {
    showMessage("Contact Number must be of 10-digits", "red");
    return;
  }

  if (!signupData.year) {
      showMessage("Batch Year must not be empty", "red");
      return;
  }
  fetch("http://localhost:8080/gtexam/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData)
  })
    .then(async res => {
      if (res.ok) {
        const user = await res.json();
        showMessage("Successfully Registered","green")
        setTimeout(()=>{
          window.location.href = "/index.html";
        },2000);
      } else {
        const errMsg = await res.text();
        showMessage("Signup failed: " + errMsg ,"red");
      }
    })
    .catch(err => {
      showMessage("error " + err , "red");
    })
});



const loginEmail = document.getElementById("email-login");
const loginPass = document.getElementById("password-login");
const confirmLoginBtn = document.getElementById("login-confirm");



confirmLoginBtn.addEventListener("click", async () => {
  let email = loginEmail.value.trim();
  let password = loginPass.value.trim();

  if (email === "" || password === "") {
    showMessage("Please fill all fields", "red");
    return;
  }

  try {
    confirmLoginBtn.classList.add("loading");
    confirmLoginBtn.textContent = "Verifying.. ";
    confirmLoginBtn.disabled= true;
    const res = await fetch("http://localhost:8080/gtexam/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (res.ok) {
      const token = await res.text();
      showMessage2("Login successful!", "green");

      confirmLoginBtn.classList.remove("loading");
      confirmLoginBtn.textContent = "Login";
      confirmLoginBtn.disabled= false;
      localStorage.setItem("authToken", token);
      setTimeout(()=>{
        window.location.reload();
      },2000);

      setTimeout(() => {
        window.location.replace("/dashboard.html");
      }, 2000);
    } else {
      const errMsg = await res.text();
      showMessage2("Login failed: " + errMsg, "red");
      confirmLoginBtn.classList.remove("loading");
      confirmLoginBtn.disabled=false
      confirmLoginBtn.textContent = "Login";
    }
  } catch (error) {
    showMessage2("Error: " + error.message, "red");
    confirmLoginBtn.classList.remove("loading");
    confirmLoginBtn.disabled=false
    confirmLoginBtn.textContent = "Login";
  }
});