<template>
  <div class="landing-wrapper">
    <div class="landing-card">
      <h2>Welcome!</h2>

      <div class="actions">
        <router-link to="/login" class="btn-primary">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed for now
</script>

<style>
.landing-wrapper {
  position: fixed;
  inset: 0;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 1rem;
  box-sizing: border-box;
  background: linear-gradient(135deg, #4f46e5, #6366f1, #a78bfa);
  z-index: 0;
}

.landing-card {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  color: #fff;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

@media (max-width: 420px) {
  .landing-card {
    padding: 1.25rem;
    border-radius: 12px;
  }
}

h2 {
  margin: 0 0 0.25rem;
  font-size: 1.8rem;
}

p {
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.actions {
  display: flex;
  justify-content: center;
}

.btn-primary {
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  background: #6366f1;
  color: #fff;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #4f46e5;
}
</style>