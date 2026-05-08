import "./style.css";

const menu = document.getElementById("menu");

//formulär
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("registerForm");

function init() {
  changeMenu();

  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", registerUser);
  }

  if (document.getElementById("user-list")) {
    fetchUsers();
  }
}

async function registerUser(e) {
  e.preventDefault();

  const info = document.getElementById("info");

  const usernameInput = document.getElementById("reg-username").value;
  const passwordInput = document.getElementById("reg-password").value;

  if (!usernameInput || !passwordInput) {
    info.innerHTML = `<p style="color: orange;">Båda fälten måste fyllas i!</p>`;
    return;
  }

  if (!passwordInput.toLowerCase().startsWith("katt")) {
    info.innerHTML = `<p style="color: orange;">Lösenord måste börja på "katt"!</p>`;
    return;
  }

  const newUser = {
    username: usernameInput,
    password: passwordInput,
  };

  try {
    const resp = await fetch("https://lab4backend-1jj9.onrender.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (resp.ok) {
      const info = document.getElementById("info");
      info.innerHTML = `<p style="color: green; font-weight: bold;">Registrering lyckades! Du kan nu logga in.</p>`;
    } else {
      const errorData = await resp.json();
      document.getElementById("info").innerHTML =
        `<p style="color: red;">${errorData.message || "Kunde inte registrera användare."}</p>`;
    }
  } catch (error) {
    console.log("Kopplingsfel till servern.");
  }
}

function changeMenu() {
  if (localStorage.getItem("token")) {
    menu.innerHTML = `
        <li><a href="index.html" id="index-link">Start</a></li>
        <li><a href="admin.html" id="admin-link">Admin</a></li>
        <li><button id="logout-button" class="logout-button">Logga ut</button></li>
        `;
  } else {
    menu.innerHTML = `
        <li><a href="index.html" id="">Start</a></li>
        `;
  }

  const logoutBtn = document.getElementById("logout-button");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
}

async function loginUser(e) {
  e.preventDefault();

  let usernamelInput = document.getElementById("login-username").value;
  let passwordInput = document.getElementById("login-password").value;

  if (!usernamelInput || !passwordInput) {
    document.getElementById("info").innerHTML =
      `<p style="color: orange;">Alla fält behöver vara ifyllda</p>`;
    return;
  }

  let user = {
    username: usernamelInput,
    password: passwordInput,
  };

  try {
    const resp = await fetch("https://lab4backend-1jj9.onrender.com/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (resp.ok) {
      const data = await resp.json();

      localStorage.setItem("token", data.response.token);
      window.location.href = "admin.html";
    } else {
      throw error;
    }
  } catch (error) {
    document.getElementById("info").innerHTML =
      `<p style="color: red;">Felaktigt användarnamn eller lösenord</p>`;
  }
}

async function fetchUsers() {
  const userListContainer = document.getElementById("user-list");
  if (!userListContainer) return;

  const token = localStorage.getItem("token");

  try {
    const resp = await fetch("https://lab4backend-1jj9.onrender.com/api/protected", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (resp.ok) {
      const result = await resp.json();
      displayUsers(result.data); // Skicka vidare data till renderfunktionen
    } else {
      userListContainer.innerHTML = "<p>Något gick fel, pröva igen</p>";
    }
  } catch (error) {
    console.error("Fel vid hämtning:", error);
  }
}

function displayUsers(users) {
  const userListContainer = document.getElementById("user-list");

  if (users.length === 0) {
    userListContainer.innerHTML = "<p>Inga användare hittades.</p>";
    return;
  }

  // Skapa en tabell eller lista
  let html = "";

  users.forEach((user) => {
    html += `
    <div>
      <p><strong>Användare: </strong>${user.username}</p>
      <p><strong>Skapad: </strong>${user.created}</p>
    </div>
    `;
  });

  userListContainer.innerHTML = html;
}

init();
