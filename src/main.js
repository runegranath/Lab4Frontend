import "./style.css";

const menu = document.getElementById("menu");

//formulär
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
});

function init() {
  changeMenu();

  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  // if() {

  // }
}

function changeMenu() {
  if (localStorage.getItem("token")) {
    menu.innerHTML = `
        <li><a href="index.html" id=""> --- </a></li>
        <li><a href="admin.html" id="admin-link">Admin</a></li>
        <li><button id="logout-button" class="logout-button">Logga ut</button></li>
        `;
  } else {
    menu.innerHTML = `
        <li><a href="index.html" id=""> --- </a></li>
        <li><a href="login.html" id="login-button" class="auth-button">Logga in</a></li>
        `;
  }

  const logoutBtn = document.getElementById("logout-button");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
}

async function loginUser(e) {
  e.preventDefault();

  let usernamelInput = document.getElementById("username").value;
  let passwordInput = document.getElementById("password").value;

  if (!usernamelInput || !passwordInput) {
    console.log("Fyll i alla fält!");
    return;
  }

  let user = {
    username: usernamelInput,
    password: passwordInput,
  };

  try {
    const resp = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (resp.ok) {
      const data = await resp.json();

      localStorage.setItem("token", data.token);
      window.location.href = "admin.html";
    } else {
      throw error;
    }
  } catch (error) {
    console.log("Felaktigt användarnamn eller lösenord");
  }
}
