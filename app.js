// app.js

// 1) Supabase init (v2)
const SUPABASE_URL = "https://ficxxquiyniiujrrzrft.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpY3h4cXVpeW5paXVqcnJ6cmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODQ3NjgsImV4cCI6MjA3ODc2MDc2OH0.N0c2ToqD1CIhvIw0v6e69EMcWheCrbqhcN7uKAN52hI";

// ❗ FIX: Rename client
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true
  }
});

// Protect routes
async function protectRoutes() {
  const { data } = await client.auth.getSession();
  const session = data?.session;

  const isDashboard = window.location.pathname.includes("dashboard.html");

  if (isDashboard) {
    if (!session) {
      window.location.href = "index.html";
    } else {
      const userEmailEl = document.getElementById("user-email");
      if (userEmailEl) userEmailEl.textContent = `Logged in as: ${session.user.email}`;
    }
  }
}

protectRoutes();

// Tab switching
const tabButtons = document.querySelectorAll(".tab-btn");
const forms = document.querySelectorAll(".form");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");

    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    forms.forEach((form) => {
      form.classList.toggle("active", form.id.startsWith(target));
    });
  });
});

// Signup
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const msg = document.getElementById("signup-message");

    msg.textContent = "Creating account...";
    msg.className = "message";

    const { error } = await client.auth.signUp({ email, password });

    if (error) {
      msg.textContent = error.message;
      msg.classList.add("error");
    } else {
      msg.textContent = "Signup successful! Check your email.";
      msg.classList.add("success");
      signupForm.reset();
    }
  });
}

// Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const msg = document.getElementById("login-message");

    msg.textContent = "Logging in...";
    msg.className = "message";

    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      msg.textContent = error.message;
      msg.classList.add("error");
    } else {
      msg.textContent = "Login successful! Redirecting...";
      msg.classList.add("success");

      setTimeout(() => {
        window.location.href = "safe.html";
      }, 800);
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const msg = document.getElementById("dashboard-message");

    const { error } = await client.auth.signOut();
    if (error) {
      msg.textContent = error.message;
      msg.classList.add("error");
    } else {
      window.location.href = "index.html";
    }
  });
}
