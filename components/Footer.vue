<script>
/**
 * Footer Component
 */
export default {};
</script>

<template>
  <!-- Footer Start -->
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">{{ new Date().getFullYear() }} &copy; <nuxt-link to="/">Pianomonitor</nuxt-link></div>
        <div class="col-md-6">
          <div class="text-md-right footer-links d-none d-sm-block"></div>
        </div>
      </div>
    </div>
  </footer>
  <!-- end Footer -->
</template>
