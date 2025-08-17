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


getOtpBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  let email = emailInput.value;
  fetch("http://localhost:8080/otp/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email })
  })
  .then(res => res.text())
  .then(data => alert(data));
})

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
          after_otp.style.display="block";
        }
    })
});


const finalSignupBtn = document.querySelector("#final-signup");

finalSignupBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let signupData = {
    firstName: document.getElementById("firstname").value,
    lastName: document.getElementById("lastname").value,
    email: emailInput.value,
    password: document.getElementById("password2").value,
    phone: document.getElementById("contact").value,
    year: document.getElementById("yearfield").value
  };

  fetch("http://localhost:8080/gtexam/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData)
  })
    .then(async res => {
      if (res.ok) {
        const user = await res.json();
        window.location.href = "/index.html";
      } else {
        const errMsg = await res.text();
        alert("Signup failed: " + errMsg);
      }
    })
    .catch(err => {
      alert("Error: " + err.message);
    });
});
